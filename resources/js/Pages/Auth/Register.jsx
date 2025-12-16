import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
                    
                    <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
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
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
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
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
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
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
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
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-3"
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
                        
                        <p className="text-center text-sm text-slate-500">
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