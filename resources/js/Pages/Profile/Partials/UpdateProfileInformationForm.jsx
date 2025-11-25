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
        // Field password (kosong defaultnya)
        password: '',
        password_confirmation: '',
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
                    Lengkapi data diri Anda untuk mengaktifkan layanan.
                </p>
                {user.id_unik && (
                    <div className="mt-2 p-3 bg-indigo-100 border border-indigo-200 rounded-md">
                        <span className="text-sm font-medium text-indigo-700">ID Unik Anda: {user.id_unik}</span>
                    </div>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Nama */}
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

                {/* Email */}
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
                        disabled={!!user.google_id} // Disable email edit jika login via Google (opsional)
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                
                {/* BAGIAN KHUSUS GOOGLE USER: SET PASSWORD */}
                {/* Jika user punya google_id, kita minta mereka set password baru */}
                {user.google_id && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md space-y-4">
                        <h3 className="text-sm font-bold text-yellow-800">Atur Kata Sandi (Wajib)</h3>
                        <p className="text-xs text-yellow-700">Karena Anda mendaftar menggunakan Google, silakan buat kata sandi untuk keamanan tambahan.</p>
                        
                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required // Wajib diisi
                                autoComplete="new-password"
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required // Wajib diisi
                                autoComplete="new-password"
                            />
                            <InputError className="mt-2" message={errors.password_confirmation} />
                        </div>
                    </div>
                )}

                {/* Nomor Telepon */}
                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor Telepon (WhatsApp)" />
                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        autoComplete="tel"
                        required // Wajib untuk generate ID
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* Alamat */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="rt" value="RT (3 Digit)" />
                        <TextInput
                            id="rt"
                            className="mt-1 block w-full"
                            value={data.rt}
                            onChange={(e) => setData('rt', e.target.value)}
                            placeholder="001"
                            required
                        />
                        <InputError className="mt-2" message={errors.rt} />
                    </div>
                     <div>
                        <InputLabel htmlFor="rw" value="RW (3 Digit)" />
                        <TextInput
                            id="rw"
                            className="mt-1 block w-full"
                            value={data.rw}
                            onChange={(e) => setData('rw', e.target.value)}
                            placeholder="005"
                            required
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
                            placeholder="A"
                            required
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
                            placeholder="12B"
                            required
                        />
                        <InputError className="mt-2" message={errors.nomor_rumah} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan & Lanjutkan</PrimaryButton>
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