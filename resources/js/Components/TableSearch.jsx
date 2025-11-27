import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaSearch } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function TableSearch({ 
    placeholder = "Cari data...", 
    url, 
    initialValue = "", 
    filters = {} 
}) {
    const [search, setSearch] = useState(initialValue);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(url, { ...filters, search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex shadow-sm rounded-lg">
            <TextInput
                type="text"
                className="w-full rounded-r-none border-r-0 focus:ring-inset"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <PrimaryButton className="rounded-l-none justify-center px-4 border-l-0">
                <FaSearch />
            </PrimaryButton>
        </form>
    );
}