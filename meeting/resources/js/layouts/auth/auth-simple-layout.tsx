import { Link } from '@inertiajs/react';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-svh flex-col bg-slate-50 dark:bg-slate-950">
            {/* Top Navigation Bar */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-slate-900 dark:border-slate-800">
                <Link
                    href={home()}
                    className="flex items-center gap-2 font-semibold text-lg"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                        <AppLogoIcon className="size-5 text-white" />
                    </div>
                    eNotulen
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {mounted ? (
                            resolvedAppearance === 'dark' ? (
                                <Moon className="size-5" />
                            ) : (
                                <Sun className="size-5" />
                            )
                        ) : (
                            <Sun className="size-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            {/* Main Content (Centered Card) */}
            <main className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-md">
                                <AppLogoIcon className="size-8 text-white" />
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold tracking-tight">eNotulen</h1>
                                {title !== 'eNotulen' && (
                                    <h2 className="text-lg font-semibold">{title}</h2>
                                )}
                                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} eNotulen. Semua hak dilindungi.
            </footer>
        </div>
    );
}
