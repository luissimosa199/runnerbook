import Image from 'next/image'
import { ChangeEvent, FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import PhotoInput from './PhotoInput';

interface ProfilePictureProps {
    username: string;
    handleChangeAvatar: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ProfilePicture: FunctionComponent<ProfilePictureProps> = ({ username, handleChangeAvatar }) => {

    const fetchProfilePicture = async () => {
        const response = await fetch(`/api/user/avatar/?username=${encodeURIComponent(username as string)}`)
        const data = response.json()
        return data
    }

    const { data, isLoading, isError } = useQuery([username, 'profilePicture'], fetchProfilePicture)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 object-cover rounded-full border mb-4"></div>
            </div>
        )
    }

    if(isError){
        return (
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 object-cover rounded-full border mb-4">
                    <p>Error</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <Image
                src={(data.image as string) || '/noprofile.png'}
                width={128}
                height={128}
                alt={`${username}'s Avatar`}
                className="w-32 h-32 object-cover rounded-full border mb-4"
            />
            <PhotoInput handleUploadImages={handleChangeAvatar} variant="small" id="profilepicture" />
        </div>
    )
}

export default ProfilePicture