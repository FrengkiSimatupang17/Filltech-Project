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
            // INLINE STYLES: Prioritas tertinggi untuk memaksa warna
            style={{ 
                backgroundColor: 'white', 
                color: '#111827', // Gray-900
                caretColor: '#111827', // Warna kursor ketik
                WebkitTextFillColor: '#111827', // Paksa warna teks saat Autofill (Chrome/Edge)
            }}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                'min-h-[44px] sm:min-h-[38px] text-base sm:text-sm ' +
                'bg-white text-gray-900 placeholder-gray-500 ' +
                // Fallback Tailwind classes untuk autofill
                '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] ' +
                '[&:-webkit-autofill]:-webkit-text-fill-color-gray-900 ' +
                className
            }
            ref={input}
        />
    );
});