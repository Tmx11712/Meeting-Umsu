// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Reset Password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Masukkan email Anda"
                                    startIcon={Mail}
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Kirim Link Reset
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="relative my-4 text-center text-sm">
                    <span className="relative z-10 bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        atau
                    </span>
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                </div>

                <div className="text-center text-sm">
                    <TextLink
                        href={login()}
                        className="inline-flex items-center justify-center font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke login
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Reset Password',
    description: 'Masukkan email Anda dan kami akan mengirimkan\nlink untuk mereset password.',
};
