import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// --- KOMPONEN IKON GOOGLE (Disalin dari Login.jsx) ---
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Daftar - Filltech" />

            <div className="min-h-screen flex bg-white">
                
                {/* --- BAGIAN KIRI (GAMBAR) --- */}
                <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                        alt="Office Team" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/90 to-slate-900/80 mix-blend-multiply"></div>
                    
                    <div className="relative z-10 p-12 text-white max-w-lg">
                        <ApplicationLogo className="w-16 h-16 text-emerald-400 mb-8" />
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Bergabunglah Bersama Kami.</h2>
                        <p className="text-emerald-100 text-lg leading-relaxed">
                            "Nikmati pengalaman internet tanpa batas kuota dengan dukungan teknis prioritas. Pendaftaran cepat, pemasangan kilat."
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN KANAN (FORM) --- */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white relative">
                    
                    <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
                        <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Beranda
                    </Link>

                    <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                        
                        <div className="text-center lg:text-left">
                            <div className="lg:hidden flex justify-center mb-4">
                                <ApplicationLogo className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Buat Akun Baru</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Isi data diri Anda untuk mulai berlangganan.
                            </p>
                        </div>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" className="text-slate-700" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm py-3"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Sesuai KTP"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-slate-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm py-3"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="contoh@email.com"
                                    required
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
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm py-3"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-slate-700" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm py-3"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <PrimaryButton className="w-full justify-center py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all mt-4" disabled={processing}>
                                {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                            </PrimaryButton>
                        </form>

                        {/* --- BAGIAN BARU: TOMBOL GOOGLE --- */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Atau daftar dengan</span>
                            </div>
                        </div>

                        <a 
                            href={route('socialite.google.redirect')} 
                            className="flex items-center justify-center w-full px-4 py-3 mt-4 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all"
                        >
                            <GoogleIcon />
                            <span className="font-bold">Google Account</span>
                        </a>
                        {/* ---------------------------------- */}
                        
                        <p className="text-center text-sm text-slate-500 pt-4">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline">
                                Masuk Disini
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