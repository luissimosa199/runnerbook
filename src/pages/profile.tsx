import { useMutation, useQueryClient } from 'react-query';
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import LastTenUserTimeline from "@/components/LastTenUserTimeline"
import PhotoInput from "@/components/PhotoInput"
import UserPhotos from "@/components/UserPhotos"
import { handleFileAdding, uploadImages } from "@/utils/formHelpers"
import Link from 'next/link';
import ProfilePicture from '@/components/ProfilePicture';
import UserPhotoGallery from '@/components/UserPhotoGallery';

const Profile = () => {

    const { data: session, status } = useSession()
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

    if (status === "loading") {
        return (
            <div className="border-2">
                <div className="text-center">Cargando datos de usuario...</div>
            </div>
        )
    }

    if (session && session.user) {
        return (
            <div className="p-8 bg-gray-50 space-y-12">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Perfil</h1>

                <div className="flex justify-around items-center border rounded-lg p-6 bg-white shadow-md space-x-8">
                    <ProfilePicture handleChangeAvatar={handleChangeAvatar} username={session.user.email as string} />
                    <div className="text-center">
                        <p className="font-bold text-xl mb-2">{session.user.name}</p>
                        <p className="italic mb-4 text-gray-600">{session.user.email}</p>
                        <button
                            type="button"
                            onClick={() => signOut()}
                            className="text-sm bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>


                <UserPhotoGallery  />
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Últimas publicaciones</h2>
                    <LastTenUserTimeline username={session.user.email as string} />
                </div>
            </div>
        )
    }

    return (
        <div className="border-2">
            <div className="text-center">Ingresa para ver tu perfil de usuario</div>
            <Link href="/login">Inicia Sesión</Link>
        </div>
    )
}

export default Profile