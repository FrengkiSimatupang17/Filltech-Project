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

    // [FITUR BARU] Fungsi untuk menghilangkan tanda '-' saat diklik
    const handleFocus = (field) => {
        if (data[field] === '-') {
            setData(field, '');
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil akun dan alamat email Anda.
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
                        // Auto clear jika isinya '-'
                        onFocus={() => handleFocus('phone_number')}
                        placeholder="08123xxxx"
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* --- ALAMAT --- */}
                <div>
                    <InputLabel htmlFor="alamat" value="Alamat (Jalan / Gang)" />
                    <TextInput
                        id="alamat"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        // Auto clear jika isinya '-'
                        onFocus={() => handleFocus('alamat')}
                    />
                    <InputError className="mt-2" message={errors.alamat} />
                </div>

                {/* --- RT & RW --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="rt" value="RT" />
                        <TextInput
                            id="rt"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.rt}
                            onChange={(e) => setData('rt', e.target.value)}
                            // Auto clear jika isinya '-'
                            onFocus={() => handleFocus('rt')}
                        />
                        <InputError className="mt-2" message={errors.rt} />
                    </div>
                    <div>
                        {/* [FIX] Menghilangkan tulisan (3 Digit) */}
                        <InputLabel htmlFor="rw" value="RW" />
                        <TextInput
                            id="rw"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.rw}
                            onChange={(e) => setData('rw', e.target.value)}
                            // Auto clear jika isinya '-'
                            onFocus={() => handleFocus('rw')}
                        />
                        <InputError className="mt-2" message={errors.rw} />
                    </div>
                </div>

                {/* --- BLOK & NOMOR --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="blok" value="Blok (Opsional)" />
                        <TextInput
                            id="blok"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.blok}
                            onChange={(e) => setData('blok', e.target.value)}
                            // Auto clear jika isinya '-'
                            onFocus={() => handleFocus('blok')}
                        />
                        <InputError className="mt-2" message={errors.blok} />
                    </div>
                    <div>
                        <InputLabel htmlFor="nomor_rumah" value="Nomor Rumah" />
                        <TextInput
                            id="nomor_rumah"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nomor_rumah}
                            onChange={(e) => setData('nomor_rumah', e.target.value)}
                            // Auto clear jika isinya '-'
                            onFocus={() => handleFocus('nomor_rumah')}
                        />
                        <InputError className="mt-2" message={errors.nomor_rumah} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-1000"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}