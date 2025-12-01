import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function SelectInput({ className = '', children, isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                // FORCE STYLE:
                'bg-white text-gray-900 ' +
                className
            }
            ref={input}
        >
            {children}
        </select>
    );
});