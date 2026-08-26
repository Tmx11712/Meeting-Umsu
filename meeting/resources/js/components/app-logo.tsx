import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <img src="/images/logo-umsu.png" alt="Logo UMSU" className="h-12 w-auto object-contain mr-2" />
            <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary text-primary-foreground shrink-0">
                <AppLogoIcon className="size-4 text-white" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold text-foreground text-base tracking-tight">
                    eNotulen
                </span>
            </div>
        </>
    );
}
