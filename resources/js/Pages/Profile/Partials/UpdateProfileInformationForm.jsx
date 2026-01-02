import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
        alamat: user.alamat || '',
        rt: user.rt || '',
        rw: user.rw || '',
        blok: user.blok || '',
        nomor_rumah: user.nomor_rumah || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // Auto-format RT menjadi 3 digit (contoh: 1 -> 001) saat kursor lepas
    const handleRtBlur = (e) => {
        let val = e.target.value;
        // Jika ada isi tapi kurang dari 3 digit, tambahkan 0 di depan
        if (val && val.length > 0 && val.length < 3) {
            val = val.padStart(3, '0');
            setData('rt', val);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil akun, nomor telepon, dan alamat domisili Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                
                {/* --- NAMA --- */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* --- EMAIL --- */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* --- NOMOR HP --- */}
                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor WhatsApp" />
                    <TextInput
                        id="phone_number"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        placeholder="0812xxxx"
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* --- BAGIAN ALAMAT (TAMPILAN BARU) --- */}
                <div className="border-t border-gray-100 pt-6 mt-2">
                    <h3 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-wider">Detail Alamat Domisili</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* ALAMAT JALAN */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="alamat" value="Nama Jalan / Gang" />
                            <TextInput
                                id="alamat"
                                className="mt-1 block w-full"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Contoh: Jl. Merpati Indah"
                            />
                            <InputError className="mt-2" message={errors.alamat} />
                        </div>

                        {/* RT & RW */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* INPUT RT (TETAP ANGKA 3 DIGIT) */}
                            <div>
                                <InputLabel htmlFor="rt" value="RT (Angka)" />
                                <TextInput
                                    id="rt"
                                    className="mt-1 block w-full text-center font-mono font-bold"
                                    value={data.rt}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setData('rt', val);
                                    }}
                                    onBlur={handleRtBlur}
                                    maxLength={3}
                                    placeholder="001"
                                />
                                <InputError className="mt-2" message={errors.rt} />
                            </div>
                            
                            {/* INPUT RW (BEBAS TEXT - SESUAI REQUEST ANDA) */}
                            <div>
                                <InputLabel htmlFor="rw" value="RW / Dusun" />
                                <TextInput
                                    id="rw"
                                    className="mt-1 block w-full text-center font-bold uppercase"
                                    value={data.rw}
                                    onChange={(e) => setData('rw', e.target.value.toUpperCase())}
                                    placeholder="MANTANG / 05A"
                                />
                                <InputError className="mt-2" message={errors.rw} />
                            </div>
                        </div>

                        {/* BLOK & NOMOR */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="blok" value="Blok Rumah" />
                                <TextInput
                                    id="blok"
                                    className="mt-1 block w-full uppercase"
                                    value={data.blok}
                                    onChange={(e) => setData('blok', e.target.value.toUpperCase())}
                                    placeholder="A5"
                                />
                                <InputError className="mt-2" message={errors.blok} />
                            </div>
                            <div>
                                <InputLabel htmlFor="nomor_rumah" value="Nomor" />
                                <TextInput
                                    id="nomor_rumah"
                                    className="mt-1 block w-full"
                                    value={data.nomor_rumah}
                                    onChange={(e) => setData('nomor_rumah', e.target.value)}
                                    placeholder="10"
                                />
                                <InputError className="mt-2" message={errors.nomor_rumah} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOMBOL SIMPAN */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-4">
                    <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-1000"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-bold">Profil berhasil disimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}