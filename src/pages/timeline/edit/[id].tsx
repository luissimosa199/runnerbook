import TagsInput from "@/components/TagsInput";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { TimeLineEntryData, TimelineFormInputs } from "@/types";
import PhotoInput from "@/components/PhotoInput";
import { editData, handleFileAdding, uploadImages } from "@/utils/formHelpers";
import { useMutation, useQueryClient } from "react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const Edit = () => {

    const [tagsList, setTagsList] = useState<string[]>([]);
    const [mainText, setMainText] = useState<string>('');
    const [photo, setPhoto] = useState<TimeLineEntryData[]>([]);
    const [newImages, setNewImages] = useState<string[]>([])
    const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [newImageCaptions, setNewImageCaptions] = useState<string[]>([]);

    const queryClient = useQueryClient();
    const router = useRouter()
    const { id } = router.query;

    useEffect(() => {
        const fetchTimelineData = async () => {
            const response = await fetch(`/api/timeline/${id}`);
            const timelineData = await response.json()
            setTagsList(timelineData.tags);
            setMainText(timelineData.mainText);
            setPhoto(timelineData.photo);
        }

        if (id) {
            fetchTimelineData();
        }
    }, [id]);

    const mutation = useMutation(
        async ({ data, urls }: { data: Omit<TimelineFormInputs, "_id" | "createdAt">; urls: string[] }) => {
            const existingPhotos = data.photo || [];
            const maxExistingIdx = Math.max(...existingPhotos.map(e => e.idx), 0);

            const newPhotos = [
                ...existingPhotos,
                ...urls.map((url, urlIdx) => ({
                    url: url,
                    idx: maxExistingIdx + 1 + urlIdx,
                    caption: newImageCaptions[urlIdx] || '',
                })),
            ];

            const payload = {
                ...data,
                _id: id as string,
                photo: newPhotos,
                length: newPhotos.length,
            };

            return editData(payload);
        },

        {
            onMutate: async ({ data, urls }) => {

                router.push('http://localhost:3000/')

                await queryClient.cancelQueries('timelines');
                const previousTimelines = queryClient.getQueryData<TimelineFormInputs[]>(['timelines']);
                const newTimelineData: Omit<TimelineFormInputs, "createdAt"> = {
                    ...data,
                    _id: id as string,
                    photo: [
                        ...(data.photo || []),
                        ...urls.map((url, urlIdx) => ({
                            url: url,
                            idx: data.length + urlIdx,
                            caption: newImageCaptions[urlIdx] || '',
                        })),
                    ],
                    length: data.length + urls.length,
                };
                queryClient.setQueryData<Omit<TimelineFormInputs, "createdAt">[]>(['timelines'], (old) =>
                    old?.map((timeline) => {
                        if (timeline._id === id) {
                            return newTimelineData;
                        }
                        return timeline;
                    }) || []
                );

                return { previousTimelines };
            },
            // On failure, roll back to the previous value
            onError: (err, variables, context) => {
                if (context?.previousTimelines) {
                    queryClient.setQueryData<TimelineFormInputs[]>(['timelines'], context.previousTimelines);
                }
            },
        }
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const processedData = {
            mainText: mainText,
            photo: photo,
            length: photo.length,
            tags: tagsList
        }

        if (imageUploadPromise) {
            await imageUploadPromise;
            setImageUploadPromise(null);
        }

        try {
            await mutation.mutateAsync({ data: processedData, urls: uploadedImages })
        } catch (err) {
            throw err;
        }
    };


    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMainText(event.target.value);
    }

    const handleCaptionChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const newPhoto = [...photo];
        newPhoto[index].caption = event.target.value;
        setPhoto(newPhoto);
    }

    const handleDeleteImage = (index: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const newUploadedImages = uploadedImages.filter((_, photoIndex) => photoIndex !== index);
        const newCaptions = newImageCaptions.filter((_, captionIndex) => captionIndex !== index);
        const newPhoto = photo.filter((_, photoIndex) => photoIndex !== index);
        setUploadedImages(newUploadedImages);
        setNewImageCaptions(newCaptions);
        setPhoto(newPhoto);
    };

    const handleNewImageCaptionChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const newCaptions = [...newImageCaptions];
        newCaptions[index] = event.target.value;
        setNewImageCaptions(newCaptions);
    };

    const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
        (await handleFileAdding(event, setNewImages));
        const uploadPromise = uploadImages(event);
        setImageUploadPromise(uploadPromise);
        const urls = await uploadImages(event) as string[];
        setUploadedImages(prevUrls => [...prevUrls, ...urls]);
        setNewImageCaptions(prevCaptions => [...prevCaptions, ...urls.map(_ => '')]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">Editar</h1>
            <form onSubmit={handleSubmit} className="bg-white border-2 rounded-md flex flex-col gap-4 p-4">
                <label htmlFor="mainText" className="text-lg font-semibold">Texto</label>
                <input type="text" value={mainText} onChange={handleTextChange} className="border p-2 rounded-md" />
                <TagsInput tagsList={tagsList} setTagsList={setTagsList} />
                <PhotoInput handleUploadImages={handleUploadImages} />
                <div className="flex flex-col gap-2">
                    {photo && photo.map((e: TimeLineEntryData, index: number) => (
                        <div key={index} className="flex flex-col min-[470px]:flex-row items-center gap-2 md:justify-center">
                            <div className="flex gap-2 items-center mr-[25px] min-[470px]:mr-0">
                                <button onClick={handleDeleteImage(index)} className="bg-red-500 text-white p-1 w-7 h-7 rounded-full">
                                    <FontAwesomeIcon icon={faX} style={{ marginBottom: '2px' }} />
                                </button>
                                <Image src={e.url} alt="" width={100} height={100} />
                            </div>
                            <input type="text" value={e.caption || ''} onChange={handleCaptionChange(index)} className="border p-2 rounded-md w-full min-[470px]:w-[65%] min-[470px]:mx-auto md:mx-0 " />
                        </div>
                    ))}
                    {newImages && newImages.map((e: string, index: number) => (
                        <div key={index} className="flex flex-col min-[470px]:flex-row items-center gap-2 bg-gray-100 p-2 rounded-md md:justify-center">
                            <div className="flex gap-2 items-center mr-[25px] min-[470px]:mr-0">
                                <button onClick={handleDeleteImage(index)} className="bg-red-500 text-white p-1 w-7 h-7 rounded-full">
                                    <FontAwesomeIcon icon={faX} style={{ marginBottom: '2px' }} />
                                </button>
                                <Image src={e} alt="" width={100} height={100} />
                            </div>
                            <input type="text" value={newImageCaptions[index] || ''} onChange={handleNewImageCaptionChange(index)} className="border p-2 rounded-md w-full min-[470px]:w-[65%] min-[470px]:mx-auto border-blue-500 md:mx-0 " />
                        </div>
                    ))}
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Enviar</button>
            </form>
        </div>
    )
}

export default Edit
