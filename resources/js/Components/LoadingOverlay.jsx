import { Transition } from '@headlessui/react';

export default function LoadingOverlay({ show = false, message = 'Sedang memproses...' }) {
    return (
        <Transition
            show={show}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center transform scale-100 animate-in zoom-in duration-200">
                    <div className="loading loading-spinner loading-lg text-blue-600 mb-4"></div>
                    <p className="text-gray-700 font-semibold text-sm animate-pulse">
                        {message}
                    </p>
                </div>
            </div>
        </Transition>
    );
}