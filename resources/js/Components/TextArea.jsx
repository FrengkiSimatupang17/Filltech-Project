import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea({ className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                // FORCE STYLE:
                'bg-white text-gray-900 placeholder-gray-500 ' +
                className
            }
            ref={input}
        />
    );
});