import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const { flash } = usePage().props as unknown as {
        flash?: {
            toast?: FlashToast;
            success?: string;
            error?: string;
            info?: string;
        };
    };

    useEffect(() => {
        if (flash?.toast) {
            toast[flash.toast.type](flash.toast.message);
        }

        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);
}
