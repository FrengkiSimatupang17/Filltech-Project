import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
        rt: user.rt || '',
        rw: user.rw || '',
        blok: user.blok || '',
        nomor_rumah: user.nomor_rumah || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Informasi Profil</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
                {user.id_unik && (
                    <div className="mt-2 p-3 bg-indigo-100 border border-indigo-200 rounded-md">
                        <span className="text-sm font-medium text-indigo-700">ID Unik Anda: {user.id_unik}</span>
                    </div>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama" />
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
                            Email Anda belum terverifikasi.
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

                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor Telepon (WhatsApp)" />
                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        autoComplete="tel"
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="rt" value="RT" />
                        <TextInput
                            id="rt"
                            className="mt-1 block w-full"
                            value={data.rt}
                            onChange={(e) => setData('rt', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.rt} />
                    </div>
                     <div>
                        <InputLabel htmlFor="rw" value="RW" />
                        <TextInput
                            id="rw"
                            className="mt-1 block w-full"
                            value={data.rw}
                            onChange={(e) => setData('rw', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.rw} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <InputLabel htmlFor="blok" value="Blok" />
                        <TextInput
                            id="blok"
                            className="mt-1 block w-full"
                            value={data.blok}
                            onChange={(e) => setData('blok', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.blok} />
                    </div>
                     <div>
                        <InputLabel htmlFor="nomor_rumah" value="Nomor Rumah" />
                        <TextInput
                            id="nomor_rumah"
                            className="mt-1 block w-full"
                            value={data.nomor_rumah}
                            onChange={(e) => setData('nomor_rumah', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.nomor_rumah} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}