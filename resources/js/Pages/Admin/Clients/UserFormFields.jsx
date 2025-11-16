import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";

export default function UserFormFields({ data, setData, errors, isCreate = false }) {
    return (
        <>
            <div className="mt-4">
                <InputLabel htmlFor="name" value="Nama" />
                <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.name} className="mt-2" />
            </div>
            
            <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="role" value="Role" />
                <SelectInput id="role" value={data.role} className="mt-1 block w-full" onChange={(e) => setData('role', e.target.value)}>
                    <option value="client">Client</option>
                    <option value="teknisi">Teknisi</option>
                    <option value="administrator">Administrator</option>
                </SelectInput>
                <InputError message={errors.role} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value={isCreate ? "Password" : "Password Baru (Opsional)"} />
                <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <h3 className="text-md font-medium text-gray-800 mt-6">Data Opsional</h3>

            <div className="mt-4">
                <InputLabel htmlFor="id_unik" value="ID Unik" />
                <TextInput id="id_unik" value={data.id_unik} onChange={(e) => setData('id_unik', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.id_unik} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="phone_number" value="No. Telepon" />
                <TextInput id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.phone_number} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
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

            <div className="grid grid-cols-2 gap-4 mt-4">
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
        </>
    );
}