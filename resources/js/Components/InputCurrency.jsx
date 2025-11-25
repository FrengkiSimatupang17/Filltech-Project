import { forwardRef, useEffect, useState } from 'react';

export default forwardRef(function InputCurrency({ className = '', isFocused = false, value, onValueChange, ...props }, ref) {
    const formatRupiah = (angka) => {
        if (!angka) return '';
        return new Intl.NumberFormat('id-ID', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(angka);
    };

    const [displayValue, setDisplayValue] = useState(formatRupiah(value));

    useEffect(() => {
        setDisplayValue(formatRupiah(value));
    }, [value]);

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue ? parseInt(rawValue, 10) : '';

        setDisplayValue(formatRupiah(numericValue));

        if (onValueChange) {
            onValueChange(numericValue);
        }
    };

    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                Rp
            </span>
            <input
                {...props}
                type="text"
                className={
                    'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm pl-10 ' +
                    className
                }
                ref={ref}
                value={displayValue}
                onChange={handleChange}
            />
        </div>
    );
});