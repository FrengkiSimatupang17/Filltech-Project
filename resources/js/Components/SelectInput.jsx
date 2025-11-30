export default function SelectInput({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                'bg-white text-gray-900 ' +
                className
            }
        >
            {children}
        </select>
    );
}