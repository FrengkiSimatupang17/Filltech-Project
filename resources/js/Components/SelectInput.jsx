export default function SelectInput({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm min-h-[44px] sm:min-h-[38px] text-base sm:text-sm bg-white ' +
                className
            }
        >
            {children}
        </select>
    );
}