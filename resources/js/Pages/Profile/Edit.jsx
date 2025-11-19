import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const { user } = usePage().props.auth;
    const isCompletionPage = route().current('profile.complete');

    if (isCompletionPage && user.id_unik) {
        window.location.href = route('dashboard');
        return null;
    }

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {isCompletionPage && !user.id_unik ? 'Lengkapi Data Profil' : 'Profil'}
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {isCompletionPage && !user.id_unik && (
                         <div className="alert alert-warning shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.503-1.61 1.745-2.905l-6.928-12.012c-.75-1.295-2.64-1.295-3.39 0l-6.928 12.012C2.463 17.39 3.426 19 4.966 19z" /></svg>
                                <span>PERHATIAN: Anda harus melengkapi data alamat untuk membuat User ID unik dan melanjutkan ke Dashboard.</span>
                            </div>
                        </div>
                    )}

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {!isCompletionPage && (
                        <>
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>

                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}