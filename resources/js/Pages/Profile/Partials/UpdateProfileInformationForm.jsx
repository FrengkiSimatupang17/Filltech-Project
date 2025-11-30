import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
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
                    Lengkapi data diri dan alamat pemasangan Anda.
                </p>
                {user.id_unik && (
                    <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-indigo-800 text-sm font-bold">
                        ID Pelanggan: {user.id_unik}
                    </div>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Nama */}
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

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-50"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        disabled={!!user.google_id} 
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                
                {/* Password Baru (Khusus User Google) */}
                {user.google_id && (
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md space-y-4">
                        <h3 className="text-sm font-bold text-yellow-800">Atur Kata Sandi (Wajib)</h3>
                        <p className="text-xs text-yellow-700">Untuk keamanan tambahan, silakan buat kata sandi baru.</p>
                        
                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
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
                                autoComplete="new-password"
                            />
                            <InputError className="mt-2" message={errors.password_confirmation} />
                        </div>
                    </div>
                )}

                {/* Nomor Telepon */}
                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor WhatsApp Aktif" />
                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        autoComplete="tel"
                        placeholder="08..."
                        required 
                    />
                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Alamat Pemasangan</h3>
                    
                    {/* Field Alamat (Jalan/Perumahan) */}
                    <div className="mb-4">
                        <InputLabel htmlFor="alamat" value="Nama Jalan / Perumahan / Patokan" />
                        <TextArea
                            id="alamat"
                            className="mt-1 block w-full"
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            placeholder="Contoh: Perumahan Buana Garden Tahap 2, Depan Masjid..."
                            rows="2"
                            required
                        />
                        <InputError className="mt-2" message={errors.alamat} />
                    </div>

                    {/* Detail RT/RW/Blok/No */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                </div>

                <div className="flex items-center gap-4 pt-2">
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