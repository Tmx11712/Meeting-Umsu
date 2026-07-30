import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDelete = async (
    title: string,
    text: string = 'Data yang dihapus tidak dapat dikembalikan!',
    confirmButtonText: string = 'Ya, Hapus!'
) => {
    return MySwal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Tailwind red-500
        cancelButtonColor: '#64748b',  // Tailwind slate-500
        confirmButtonText,
        cancelButtonText: 'Batal',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl font-medium px-5 py-2',
            cancelButton: 'rounded-xl font-medium px-5 py-2',
            title: 'text-lg text-slate-800 dark:text-slate-100',
        },
    }).then((result) => result.isConfirmed);
};

export const showSuccess = (title: string, text?: string) => {
    return MySwal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#3b82f6', // Tailwind blue-500
        confirmButtonText: 'OK',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl font-medium px-5 py-2',
            title: 'text-lg text-slate-800 dark:text-slate-100',
        },
    });
};

export const showError = (title: string, text?: string) => {
    return MySwal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#ef4444', // Tailwind red-500
        confirmButtonText: 'Tutup',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl font-medium px-5 py-2',
            title: 'text-lg text-slate-800 dark:text-slate-100',
        },
    });
};

export default MySwal;
