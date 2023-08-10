import { useMutation, useQueryClient } from 'react-query';
import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useState } from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import Image from 'next/image'
import LastTenUserTimeline from "@/components/LastTenUserTimeline"
import PhotoInput from "@/components/PhotoInput"
import UserPhotos from "@/components/UserPhotos"
import { handleFileAdding, uploadImages } from "@/utils/formHelpers"
import Link from 'next/link';

const Profile = () => {

    const [newImages, setNewImages] = useState<string[]>([])
    const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const { data: session, status, update } = useSession()

    const queryClient = useQueryClient();

    const uploadPhotosMutation = useMutation((photos: string[]) => uploadUserPhotos(photos, session?.user?.email as string), {
        onMutate: (newPhotos: string[]) => {
            const previousData = queryClient.getQueryData<string[]>([session?.user?.email, 'userPhotos']);
            queryClient.setQueryData<string[]>([session?.user?.email, 'userPhotos',], (oldData = []) => {
                return [...oldData, ...newPhotos];
            });
            return { previousData };
        },
        onSuccess: () => {
            setNewImages([]);
            setUploadedImages([]);
        },
        onError: (_, __, context: any) => {
            queryClient.setQueryData(['userPhotos', session?.user?.email], context.previousData);
        }
    });

    const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
        (await handleFileAdding(event, setNewImages));
        const uploadPromise = uploadImages(event);
        setImageUploadPromise(uploadPromise);
        const urls = await uploadImages(event) as string[];
        setUploadedImages(prevUrls => [...prevUrls, ...urls]);
        // setNewImageCaptions(prevCaptions => [...prevCaptions, ...urls.map(_ => '')]);
    };

    const handleDeleteImage = (index: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const newUploadedImages = uploadedImages.filter((_, photoIndex) => photoIndex !== index);
        // const newCaptions = newImageCaptions.filter((_, captionIndex) => captionIndex !== index);
        // const newPhoto = photo.filter((_, photoIndex) => photoIndex !== index);
        setUploadedImages(newUploadedImages);
        const updatedNewImages = newImages.filter((_, imgIndex) => imgIndex !== index);
        setNewImages(updatedNewImages);
        // setNewImageCaptions(newCaptions);
        // setPhoto(newPhoto);
    };

    const handleSubmit = async () => {
        queryClient.cancelQueries([session?.user?.email, 'userPhotos'])
        await imageUploadPromise;
        uploadPhotosMutation.mutate(uploadedImages);
    };

    const uploadUserPhotos = async (photos: string[], userEmail: string) => {
        const response = await fetch(`/api/user/photos/?username=${encodeURIComponent(userEmail)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photos })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Something went wrong');
        }

        return response.json();
    };

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
        try {
            const avatarArr = await uploadImages(event);
            const avatarUrl = avatarArr![0];
            const serverResponse = await updateAvatarOnServer(avatarUrl);

            // updating not working
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
                    <div className="flex flex-col items-center">
                        <Image
                            src={session.user.image || '/noprofile.png'}
                            width={128}
                            height={128}
                            alt={`${session.user.name}'s Avatar`}
                            className="w-32 h-32 object-cover rounded-full border mb-4"
                        />
                        <PhotoInput handleUploadImages={handleChangeAvatar} variant="small" />
                    </div>

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

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Fotos</h2>
                    <UserPhotos username={session.user.email as string} />
                    <PhotoInput handleUploadImages={handleUploadImages} variant="small" />

                    <div className="mt-4 space-y-4">
                        {newImages && newImages.map((e: string, index: number) => (
                            <div key={index} className="flex items-center gap-4 bg-gray-100 p-4 rounded-md">
                                <button
                                    onClick={handleDeleteImage(index)}
                                    className="bg-red-500 text-white p-2 w-8 h-8 rounded-full hover:bg-red-600 flex justify-center items-center transition duration-300"
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                                <Image src={e} alt="" width={100} height={100} />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Subir
                    </button>
                </div>

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