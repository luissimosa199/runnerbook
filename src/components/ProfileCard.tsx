import React, { ChangeEvent } from 'react'
import ProfilePicture from './ProfilePicture'
import { signOut, useSession } from 'next-auth/react'
import { useQueryClient } from 'react-query'
import { uploadImages } from '@/utils/formHelpers'
import PhotoInput from './PhotoInput'
import AdsSwitch from './AdsSwitch'
import { CustomSession } from '@/pages/api/auth/[...nextauth]'

const ProfileCard = () => {

    const { data: session } = useSession()
    const queryClient = useQueryClient();

    const updateAvatarOnServer = async (avatarUrl: string) => {
        const response = await fetch(`/api/user/avatar/?username=${encodeURIComponent(session!.user!.email as string)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: avatarUrl })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || `Server responded with ${response.status}`);
        }
        return response.json();
    };

    const handleChangeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation()

        queryClient.cancelQueries([session?.user?.email, 'profilePicture'])
        try {
            const file = event.target.files?.[0]
            if (!file) return;

            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result as string);
                };
                reader.onerror = function () {
                    reject(new Error("Failed to read the file"));
                };
                reader.readAsDataURL(file);
            });
            queryClient.setQueryData([session?.user?.email, 'profilePicture'], { image: dataUrl });
            const avatarArr = await uploadImages(event);
            const avatarUrl = avatarArr![0];
            await updateAvatarOnServer(avatarUrl);
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-around items-center border rounded-lg p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center relative">
                <ProfilePicture username={session!.user!.email as string} />
                <div className="border-2 absolute bottom-0 left-0 bg-white h-12 w-12 rounded-full overflow-hidden flex justify-center">
                    <PhotoInput handleUploadImages={handleChangeAvatar} variant="small" id="profilepicture" />
                </div>
            </div>

            <div className="text-center">
                <p className="font-bold text-2xl mb-3">{session!.user!.name}</p>
                <p className="italic mb-6 text-gray-600">{session!.user!.email}</p>
                <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-sm bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition duration-300"
                >
                    Cerrar Sesión
                </button>
                {(session as CustomSession)?.role && <AdsSwitch />}
            </div>
        </div>
    )
}

export default ProfileCard