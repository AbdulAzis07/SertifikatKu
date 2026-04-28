import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your account information and security</p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl mx-auto"
                        />
                    </div>

                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
                        <UpdatePasswordForm className="max-w-xl mx-auto" />
                    </div>

                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
                        <DeleteUserForm className="max-w-xl mx-auto" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
