import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Komponen Ikon Google (SVG Murni)
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

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
        <>
            <Head title="Masuk - Filltech" />

            {/* Container Utama Split Screen */}
            <div className="min-h-screen flex bg-white">
                
                {/* --- BAGIAN KIRI (GAMBAR - DESKTOP ONLY) --- */}
                <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" 
                        alt="Technology Background" 
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/90 mix-blend-multiply"></div>
                    
                    {/* Content Text */}
                    <div className="relative z-10 p-12 text-white max-w-lg">
                        <ApplicationLogo className="w-16 h-16 text-blue-400 mb-8" />
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Selamat Datang Kembali.</h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            "Koneksi internet yang stabil adalah kunci produktivitas modern. Kelola akun dan layanan Anda dengan mudah melalui dashboard Filltech."
                        </p>
                    </div>
                    
                    {/* Decorative Circles */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                </div>

                {/* --- BAGIAN KANAN (FORM) --- */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white relative">
                    
                    {/* Tombol Kembali */}
                    <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Beranda
                    </Link>

                    <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                        
                        {/* Mobile Logo (Hanya muncul di HP) */}
                        <div className="text-center lg:text-left">
                            <div className="lg:hidden flex justify-center mb-4">
                                <ApplicationLogo className="w-12 h-12 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Masuk Akun</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Silakan masukkan email dan password Anda.
                            </p>
                        </div>

                        {status && <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">{status}</div>}

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" className="text-slate-700" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="text-slate-700" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-600">Ingat Saya</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-500"
                                    >
                                        Lupa Password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton className="w-full justify-center py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold shadow-lg shadow-blue-600/30 transition-all" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk Sekarang'}
                            </PrimaryButton>
                        </form>

                        {/* --- LOGIN WITH GOOGLE (DIKEMBALIKAN) --- */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Atau lanjutkan dengan</span>
                            </div>
                        </div>

                        <a 
                            href={route('socialite.google.redirect')} 
                            className="flex items-center justify-center w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all"
                        >
                            <GoogleIcon />
                            <span className="font-bold">Google Account</span>
                        </a>
                        {/* ------------------------------------------- */}
                        
                        <p className="text-center text-sm text-slate-500 pt-4">
                            Belum berlangganan?{' '}
                            <Link href={route('register')} className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
                                Daftar Baru
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
            `}</style>
        </>
    );
}