import { Transition } from '@headlessui/react';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useEffect } from 'react';

export default function ToastNotification({ message, setMessage, type = 'success' }) {
    
    // Auto-hide dalam 2 detik jika message ada
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <Transition
            show={!!message}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 translate-y-4"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 translate-y-4"
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100]"
        >
            <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 
                ${type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
                
                {type === 'success' ? (
                    <FaCheckCircle className="text-green-400 text-lg" />
                ) : (
                    <FaInfoCircle className="text-white text-lg" />
                )}
                
                <span className="font-medium text-sm">{message}</span>
            </div>
        </Transition>
    );
}