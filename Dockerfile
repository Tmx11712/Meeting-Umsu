# ==========================================
# Stage 1: Build Node.js assets (React/Vite)
# ==========================================
# Pinned to 22.23.4+ to patch Node2Shell Brotli critical RCE (CVE-2026-111497)
FROM node:22.23.4-alpine AS node-builder
WORKDIR /app

# Ensure Alpine OS libraries in builder are updated
RUN apk update && apk upgrade --no-cache

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Bypass wayfinder plugin needing PHP during Vite build
RUN printf '#!/bin/sh\nexit 0' > /usr/local/bin/php && chmod +x /usr/local/bin/php

# Pass VITE_* variables at build time so they are baked into the frontend JS bundle.
# Default values work for production behind Nginx reverse proxy.
ARG VITE_REVERB_APP_KEY=my_reverb_key
ARG VITE_REVERB_HOST=localhost
ARG VITE_REVERB_PORT=8080
ARG VITE_REVERB_SCHEME=http
ARG VITE_APP_NAME=enotulen
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY
ENV VITE_REVERB_HOST=$VITE_REVERB_HOST
ENV VITE_REVERB_PORT=$VITE_REVERB_PORT
ENV VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME
ENV VITE_APP_NAME=$VITE_APP_NAME

# Build the Vite assets
RUN npm run build


# ==========================================
# Stage 2: Build PHP Application
# ==========================================
# Pinned to 8.4.27+ to patch PHP2Shell critical RCE vulnerabilities (CVE-2026-109618 & CVE-2026-109619)
FROM php:8.4.27-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk update && apk upgrade --no-cache && apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    postgresql-dev \
    postgresql-client \
    linux-headers \
    ffmpeg \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Configure PHP for larger file uploads & enable production OPcache
RUN echo "upload_max_filesize = 210M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 210M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "opcache.enable=1" > /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files
COPY composer.json composer.lock ./

# Copy the rest of the application code
COPY . .

# Install composer dependencies (guaranteed fresh according to composer.lock)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the built node assets from Stage 1
COPY --from=node-builder /app/public/build /var/www/html/public/build
COPY --from=node-builder /app/public/build /var/www/html/public-assets/build

# Copy static images and root public files (favicons, icons, etc.) into public-assets so they can be synced to the volume on startup
RUN cp -r /var/www/html/public/images /var/www/html/public-assets/images \
    && cp -f /var/www/html/public/favicon* /var/www/html/public-assets/ 2>/dev/null || true \
    && cp -f /var/www/html/public/apple-touch-icon* /var/www/html/public-assets/ 2>/dev/null || true

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Entrypoint: caching config/route/view + migrasi opsional (RUN_MIGRATIONS=true).
# Dibutuhkan di AWS ECS karena tidak ada deploy script yang dijalankan manual.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Expose port 9000 for PHP-FPM
EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
