import { CldImage } from 'next-cloudinary';
import React, { FunctionComponent } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query';

interface UserPhotosProps {
    username: string
}

const UserPhotos: FunctionComponent<UserPhotosProps> = ({ username }) => {

    const fetchUserPhotos = async () => {
        const response = await fetch(`/api/user/photos/?username=${encodeURIComponent(username)}`, {
            method: 'GET'
        });
        const data = await response.json()
        return data
    }

    const deleteUserPhoto = async (photoUrl: string) => {
        const response = await fetch(`/api/user/photos/?username=${encodeURIComponent(username)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo: photoUrl })
        });
        const data = await response.json()
        return data
    }

    const handleDelete = (e: string) => {
        queryClient.cancelQueries([username, 'userPhotos'])
        mutation.mutate(e)
    }

    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery([username, 'userPhotos'], fetchUserPhotos)

    const mutation = useMutation(async (photoUrl: string) => {
        return deleteUserPhoto(photoUrl)
    },
        {
            onMutate: (photoUrl: string) => {
                const previousData = queryClient.getQueryData<string[]>([username, 'userPhotos']);
                if (previousData) {
                    queryClient.setQueryData([username, 'userPhotos'], (oldData = []) => {
                        return (oldData as string[]).filter((photo: string) => photo !== photoUrl);
                    });
                }
                return { previousData };
            },
            onError: (err, photoUrl, context: any) => {
                queryClient.setQueryData([username, 'userPhotos'], context.previousData);
            },
        }

    )

    if (isLoading) {
        return (
            <div>Cargando...</div>
        )
    }

    if (isError) {
        return (
            <div>Error</div>
        )
    }

    return (
        <div className="space-y-4">
            {data && data.length > 0
                ? data.map((e: string) => {
                    return (
                        <div key={e} className="flex items-center gap-4 bg-gray-100 p-4 rounded-md">
                            <button
                                onClick={() => { handleDelete(e) }}
                                className="bg-red-500 text-white p-2 w-8 h-8 rounded-full hover:bg-red-600 flex justify-center items-center transition duration-300"
                            >
                                X
                            </button>
                            <CldImage alt="" src={e} width={150} height={150} className="object-cover rounded-md shadow" />
                        </div>
                    )
                })
                : <p className="text-gray-600 italic">No hay fotos para mostrar</p>
            }
        </div>

    )
}

export default UserPhotos