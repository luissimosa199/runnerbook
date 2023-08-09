import LastTenUserTimeline from "@/components/LastTenUserTimeline"
import PhotoInput from "@/components/PhotoInput"
import UserPhotos from "@/components/UserPhotos"
import { handleFileAdding, uploadImages } from "@/utils/formHelpers"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import { ChangeEvent, useState } from "react"

const Profile = () => {

    const [newImages, setNewImages] = useState<string[]>([])
    const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    
    const { data: session, status } = useSession()

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
        try {
            console.log(uploadedImages);
            const response = await fetch(`/api/user/photos/?username=${encodeURIComponent(session?.user?.email as string)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ photos: uploadedImages })
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error(data.error || 'Something went wrong');
            }
            console.log('Fotos subidas con exito', data);
            setNewImages([])
            setUploadedImages([])
        } catch (error) {
            console.error('Error submitting photos:', error);
        }
    }

    if (status === "loading") {
        return (
            <div className="border-2">
                <div className="text-center">Cargando datos de usuario...</div>
            </div>
        )
    }

    if (session && session.user) {
        return (
            <div className="p-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Perfil</h1>

                <div className="flex justify-around items-center border rounded-lg p-6 bg-white shadow-md">
                    <Image
                        src={session.user.image || '/noprofile.png'}
                        width={128}
                        height={128}
                        alt={`${session.user.name}'s Avatar`}
                        className="w-32 h-32 object-cover rounded-full border"
                    />

                    <div className="text-center">
                        <p className="font-bold text-xl mb-2">{session.user.name}</p>
                        <p className="italic mb-4 text-gray-600">{session.user.email}</p>
                        <button type="button" onClick={() => signOut()} className="text-sm bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Cerrar Sesión</button>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Fotos</h2>
                    <div>
                        <UserPhotos username={session.user.email as string} />
                    </div>
                    <PhotoInput handleUploadImages={handleUploadImages} variant="small" />

                    {newImages && newImages.map((e: string, index: number) => (
                        <div key={index} className="flex flex-col md:flex-row items-center gap-4 bg-gray-100 p-4 rounded-md mb-4">
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={handleDeleteImage(index)}
                                    className="bg-red-500 text-white p-2 w-8 h-8 rounded-full hover:bg-red-600 flex justify-center"
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                                <Image src={e} alt="" width={100} height={100} />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleSubmit}>Subir</button>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Últimas publicaciones</h2>
                    <LastTenUserTimeline username={session.user.email as string} />
                </div>
            </div>
        )
    }

    return (
        <div className="border-2">
            <div className="text-center">Ingresa para ver tu perfil de usuario</div>
        </div>
    )
}

export default Profile