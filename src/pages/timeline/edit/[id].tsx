import TagsInput from "@/components/TagsInput";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { TimeLineEntryData, TimelineFormInputs } from "@/types";
import PhotoInput from "@/components/PhotoInput";
import { editData, handleFileAdding, uploadImages } from "@/utils/formHelpers";
import { useMutation, useQueryClient } from "react-query";

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

            queryClient.invalidateQueries('timelines')
            router.push('http://localhost:3000/')
            return editData(payload);
        },
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

            (await imageUploadPromise)
            setImageUploadPromise(null);

            try {
                await mutation.mutateAsync({ data: processedData, urls: uploadedImages })
            } catch (err) {
                throw err
            }
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
        <div>
            <h1 className="text-3xl mb-4">Edit: {id}</h1>

            <form onSubmit={handleSubmit} className="border-2 flex flex-col gap-2 p-4">
                <label htmlFor="mainText">Texto</label>
                <input type="text" value={mainText} onChange={handleTextChange} className="border" />

                <TagsInput tagsList={tagsList} setTagsList={setTagsList} />

                <PhotoInput handleUploadImages={handleUploadImages} />

                <div>
                    {photo && photo.map((e: TimeLineEntryData, index: number) => {
                        return (
                            <div key={index}>
                                <button onClick={handleDeleteImage(index)}>X</button>
                                <Image src={e.url} alt="" width={100} height={100} />
                                <input type="text" value={e.caption || ''} onChange={handleCaptionChange(index)} />
                            </div>
                        )
                    })}
                    {
                        newImages && newImages.map((e: string, index: number) => {
                            return (
                                <div key={index}>
                                    <button onClick={handleDeleteImage(index)}>X</button>
                                    <Image src={e} alt="" width={100} height={100} />
                                    <input type="text" value={newImageCaptions[index] || ''} onChange={handleNewImageCaptionChange(index)} />
                                </div>
                            )
                        })
                    }
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}

export default Edit
