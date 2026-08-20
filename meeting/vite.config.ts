import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

/**
 * [EDUKASI ARSITEKTUR: VITE BUNDLER & HMR]
 * Vite adalah alat "Build Tool" yang digunakan Laravel modern.
 * Fungsi utamanya adalah mengompilasi file TypeScript/React (`.tsx`) dan CSS Anda menjadi kode Javascript standar 
 * yang dimengerti browser. Selain itu, fitur HMR (Hot Module Replacement) memungkinkan perubahan 
 * pada kodingan UI langsung ter-update di layar tanpa perlu me-refresh browser.
 */
export default defineConfig({

    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
