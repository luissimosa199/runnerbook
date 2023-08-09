import { CldImage } from 'next-cloudinary';
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-query';

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

    const { data, isLoading, isError } = useQuery([username, 'userPhotos'], fetchUserPhotos)

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
        <div>
            {data && data.length > 0 ? data.map((e: string) => <CldImage alt="" key={e} src={e} width={150} height={150} />) : <p>No hay fotos para mostrar</p>}
        </div>
    )
}

export default UserPhotos