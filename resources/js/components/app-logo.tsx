import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <img
                src="/images/logo-umsu.webp"
                alt="Logo UMSU"
                width={36}
                height={44}
                decoding="async"
                className="mr-1 h-10 w-auto shrink-0 object-contain sm:mr-2 sm:h-11"
            />
            <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden">
                <AppLogoIcon className="size-4 text-white" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="truncate text-base leading-tight font-bold tracking-tight text-foreground">
                    eNotulen
                </span>
            </div>
        </>
    );
}
