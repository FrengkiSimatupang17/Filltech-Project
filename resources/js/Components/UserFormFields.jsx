import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function UserFormFields({ data, setData, errors, isCreate = false, roleContext = 'client' }) {
    return (
        <>
            <div className="mt-4">
                <InputLabel htmlFor="name" value="Nama Lengkap" />
                <TextInput 
                    id="name" 
                    value={data.name} 
                    onChange={(e) => setData('name', e.target.value)} 
                    className="mt-1 block w-full" 
                    required 
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            
            <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput 
                    id="email" 
                    type="email" 
                    value={data.email} 
                    onChange={(e) => setData('email', e.target.value)} 
                    className="mt-1 block w-full" 
                    required 
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="phone_number" value="No. Telepon (WhatsApp)" />
                <TextInput 
                    id="phone_number" 
                    value={data.phone_number} 
                    onChange={(e) => setData('phone_number', e.target.value)} 
                    className="mt-1 block w-full" 
                />
                <InputError message={errors.phone_number} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value={isCreate ? "Password" : "Password Baru (Opsional)"} />
                <TextInput 
                    id="password" 
                    type="password" 
                    value={data.password} 
                    onChange={(e) => setData('password', e.target.value)} 
                    className="mt-1 block w-full" 
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                <TextInput 
                    id="password_confirmation" 
                    type="password" 
                    value={data.password_confirmation} 
                    onChange={(e) => setData('password_confirmation', e.target.value)} 
                    className="mt-1 block w-full" 
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            {/* Bagian Khusus Client: Alamat & ID Unik */}
            {roleContext === 'client' && (
                <>
                    <div className="divider text-sm font-bold text-gray-500 mt-6">Detail Alamat (Klien)</div>

                    <div className="mt-4">
                        <InputLabel htmlFor="id_unik" value="ID Unik (Auto-generate jika kosong)" />
                        <TextInput 
                            id="id_unik" 
                            value={data.id_unik} 
                            onChange={(e) => setData('id_unik', e.target.value)} 
                            className="mt-1 block w-full bg-gray-50" 
                            placeholder="YYYYMMDD_RT_RW_BLOK_NO"
                        />
                        <InputError message={errors.id_unik} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <InputLabel htmlFor="rt" value="RT (3 Digit)" />
                            <TextInput id="rt" value={data.rt} onChange={(e) => setData('rt', e.target.value)} className="mt-1 block w-full" placeholder="001" />
                            <InputError message={errors.rt} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="rw" value="RW (3 Digit)" />
                            <TextInput id="rw" value={data.rw} onChange={(e) => setData('rw', e.target.value)} className="mt-1 block w-full" placeholder="005" />
                            <InputError message={errors.rw} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <InputLabel htmlFor="blok" value="Blok" />
                            <TextInput id="blok" value={data.blok} onChange={(e) => setData('blok', e.target.value)} className="mt-1 block w-full" placeholder="A" />
                            <InputError message={errors.blok} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nomor_rumah" value="Nomor Rumah" />
                            <TextInput id="nomor_rumah" value={data.nomor_rumah} onChange={(e) => setData('nomor_rumah', e.target.value)} className="mt-1 block w-full" placeholder="12B" />
                            <InputError message={errors.nomor_rumah} className="mt-2" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}