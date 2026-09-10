# ==========================================
# Stage 1: Build Node.js assets (React/Vite)
# ==========================================
FROM node:22-alpine AS node-builder
WORKDIR /app

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
FROM php:8.4-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    postgresql-dev \
    linux-headers \
    ffmpeg \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd pcntl

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Configure PHP for larger file uploads
RUN echo "upload_max_filesize = 100M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 100M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini

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

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]
