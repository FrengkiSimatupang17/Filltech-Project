import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                // FORCE STYLE: Pastikan background putih & teks hitam
                'bg-white text-gray-900 placeholder-gray-500 ' +
                // AUTOFILL FIX: Menimpa warna biru/abu-abu bawaan browser saat autofill
                '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:-webkit-text-fill-color-gray-900 ' +
                className
            }
            ref={input}
        />
    );
});