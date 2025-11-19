import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

function GoogleButton() {
    return (
        <a
            href={route('socialite.google.redirect')}
            className="btn btn-outline w-full normal-case gap-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 bg-white border-gray-300 mt-4"
        >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-0.138-2.65-0.389-3.917Z"></path>
                <path fill="#34A853" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691Z"></path>
                <path fill="#FBBC05" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.596-11.303-8.342l-6.571,4.819C9.656,39.663,16.318,44,24,44Z"></path>
                <path fill="#E94235" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.601,36.626,42.502,32.074,43.611,20.083Z"></path>
            </svg>
            Lanjutkan dengan Google
        </a>
    );
}

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Selamat Datang Kembali</h2>
                <p className="text-gray-500 text-sm mt-1">Silakan masuk ke akun Anda</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-md">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Ingat saya</span>
                    </label>
                    
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-blue-600 hover:text-blue-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <PrimaryButton className="w-full justify-center btn-lg" disabled={processing}>
                        Masuk Sekarang
                    </PrimaryButton>
                </div>
            </form>

            <div className="divider my-6 text-gray-400 text-sm">ATAU</div>
            
            <GoogleButton />
            
            <div className="mt-6 text-center text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link href={route('register')} className="text-blue-600 font-bold hover:underline">
                    Daftar disini
                </Link>
            </div>
        </GuestLayout>
    );
}