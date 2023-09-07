import Image from 'next/image'
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';

interface ProfilePictureProps {
    username: string;
}

const ProfilePicture: FunctionComponent<ProfilePictureProps> = ({ username }) => {

    const fetchProfilePicture = async () => {
        const response = await fetch(`/api/user/avatar/?username=${encodeURIComponent(username as string)}`)
        const data = response.json()
        return data
    }

    const { data, isLoading, isError } = useQuery([username, 'profilePicture'], fetchProfilePicture)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center h-[128px]">
                <div className="w-32 h-32 object-cover rounded-full mb-4"></div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center">
                <Image
                    src='/noprofile.png'
                    width={128}
                    height={128}
                    alt={`${username}'s Avatar`}
                    className="w-32 h-32 object-cover rounded-full border-gray-300 mb-5"
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center h-[128px]">
            <Image
                src={(data.image as string) || '/noprofile.png'}
                width={128}
                height={128}
                alt={`${username}'s Avatar`}
                className="w-32 h-32 object-cover rounded-full border-gray-300 mb-5"
            />
        </div>
    )
}

export default ProfilePicture