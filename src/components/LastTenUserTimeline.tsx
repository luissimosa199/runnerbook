import { InputItem, TimelineFormInputs } from '@/types'
import formatDateString from '@/utils/formatDateString'
import { CldImage } from 'next-cloudinary'
import { FunctionComponent } from 'react'
import { useQuery } from 'react-query'

interface LastTenUserTimelineProps {
    username: string
}

const LastTenUserTimeline: FunctionComponent<LastTenUserTimelineProps> = ({ username }) => {

    const fetchUserTimelines = async () => {
        const response = await fetch(`/api/user/timelines/?username=${encodeURIComponent(username)}&page=0`, {
            method: 'GET'
        });
        const data = await response.json()
        return data
    }

    const { data, isLoading, isError } = useQuery([username, 'userTimelines'], fetchUserTimelines)

    if (isLoading) {
        return (
            <div className="mt-4 bg-white p-6 rounded-lg shadow-md animate-pulse">
                <ul className="divide-y divide-gray-200">
                    {[...Array(3)].map((_, index) => (
                        <li key={index} className="py-4 space-y-4">
                            <div className="h-4 bg-gray-300 w-1/3"></div>

                            <div className="h-6 bg-gray-300 w-2/3 my-2"></div>

                            <div className="flex gap-2">
                                <div className="w-32 h-32 bg-gray-300 rounded"></div>
                                <div className="w-32 h-32 bg-gray-300 rounded"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="p-4 bg-gray-300 rounded-lg"></div>
                                <div className="p-4 bg-gray-300 rounded-lg"></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        )
    }

    if (isError) {
        return (
            <div>Error</div>
        )
    }

    return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            {data && data.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {data.map((e: TimelineFormInputs, idx: number) => (
                        <li key={idx} className="py-4 space-y-4">
                            <p className="text-lg text-gray-600">{formatDateString(e.createdAt)}</p>

                            {e.mainText && <p className="text-xl mb-4 font-semibold">{e.mainText}</p>}

                            {e.photo && e.photo.length > 0 && (
                                <div className="flex gap-2">
                                    {e.photo.map((media: any, mediaIdx: number) => {
                                        const isVideo = media.url.includes("/dahu3rii0/video/upload/") && media.url.endsWith(".mp4");
                                        return (
                                            <div key={mediaIdx} className="w-fit overflow-hidden rounded">
                                                {isVideo ? (
                                                    <video controls width="200" height="200" className="object-cover">
                                                        <source src={media.url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <CldImage src={media.url} alt={media.caption || 'Timeline Image'} width={200} height={200} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}


                            {e.links && e.links.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {e.links.map((link: any) => { // use 'any' type temporarily

                                        // old cases
                                        const isStringLink = typeof link === 'string';
                                        const linkValue = isStringLink ? link : link.value;
                                        const linkCaption = typeof link === 'object' && link.caption;

                                        return (
                                            <div key={linkValue} className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300">
                                                <a
                                                    href={linkValue}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className=" text-blue-600 hover:text-blue-800 font-medium break-words"
                                                >
                                                    {linkValue}
                                                </a>
                                                <p className="text-base text-gray-500 mt-2">
                                                    {linkCaption}
                                                </p>
                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 mt-4">No has realizado tu primer Timeline</p>
            )}
        </div>

    )
}

export default LastTenUserTimeline