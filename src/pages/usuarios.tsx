import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";

interface UserInterface {
    name: string;
    email: string;
    image: string;
    _id: string;
}

const Usuarios = () => {

    const { data: session } = useSession()

    const fetchUsers = async () => {
        const response = await fetch('/api/user', {
            method: 'GET',

        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const { data: users, error, isLoading } = useQuery('users', fetchUsers);

    if (isLoading) return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md animate-pulse">
            <ul className="divide-y divide-gray-200">
                {[...Array(6)].map((_, index) => (
                    <li key={index} className="py-4 space-y-4">
                        <div className="flex items-center gap-4">
                            {/* Skeleton for profile image */}
                            <div className="rounded-full h-[150px] w-[150px] bg-gray-300"></div>
                            {/* Skeleton for user name */}
                            <div className="flex flex-col">
                                <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
                            </div>
                            {/* Skeleton for video call icon */}
                            <div className="h-6 w-6 bg-gray-300 rounded ml-4"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (error) return <p>Error</p>;

    return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
                {users.map((user: UserInterface) => {
                    return (
                        <li key={user._id} className="py-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full h-[150px] w-[150px] border-2 overflow-hidden relative">
                                    <Image
                                        alt={`foto de ${user.name}`}
                                        src={user.image || "/noprofile.png"}
                                        fill
                                        className="absolute object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-lg font-medium">{user.name}</p>
                                </div>
                                {session?.user?.email !== user.email && <div className="">
                                    <Link href={`/videocall/${(session!.user!.email as string).split('@')[0]}${user.email.split('@')[0]}`}>
                                        <FontAwesomeIcon icon={faVideo} />
                                    </Link>
                                </div>}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

    );
}

export default Usuarios;