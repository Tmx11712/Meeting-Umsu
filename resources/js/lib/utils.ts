import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * [EDUKASI ARSITEKTUR: TAILWIND CLASS MERGE]
 * Fungsi `cn` (Class Name) ini sangat populer di ekosistem React + Tailwind (terutama shadcn/ui).
 * Tujuannya untuk menggabungkan class Tailwind secara pintar tanpa bentrok.
 * Contoh: Jika ada class `p-4` dan kita paksa tambah `p-2`, `twMerge` akan menghapus `p-4` dan menyisakan `p-2` saja.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}
