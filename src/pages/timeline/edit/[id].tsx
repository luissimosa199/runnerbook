import TagsInput from "@/components/TagsInput";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { TimeLineEntryData } from "@/types";

const Edit = () => {

    const [tagsList, setTagsList] = useState<string[]>([]);
    const [mainText, setMainText] = useState<string>('');
    const [photo, setPhoto] = useState<TimeLineEntryData[]>([]);

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // const response = await fetch(`/api/timeline/${id}`, {
        //     method: 'UPDATE',
        //     body: '...'
        // });
        // const data = await response.json()
        // console.log(data)

        const processedData = {
            mainText: mainText,
            photo: photo,
            length: photo.length,
            tags: tagsList
        }

        console.log("DATA: ", processedData)

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
        const newPhoto = photo.filter((_, photoIndex) => photoIndex !== index);
        setPhoto(newPhoto);
    }


    return (
        <div>
            <h1 className="text-3xl mb-4">Edit: {id}</h1>

            <form onSubmit={handleSubmit} className="border-2 flex flex-col gap-2 p-4">
                <label htmlFor="mainText">Texto</label>
                <input type="text" value={mainText} onChange={handleTextChange} className="border" />

                <TagsInput tagsList={tagsList} setTagsList={setTagsList} />

                <div>
                    {photo && photo.map((e: TimeLineEntryData, index: number) => {
                        return (
                            <div key={index}>
                                <button onClick={handleDeleteImage(index)}>X</button>
                                <Image src={e.url} alt="" width={100} height={100} />
                                <input type="text" value={e.caption} onChange={handleCaptionChange(index)} />
                            </div>
                        )
                    })}
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}

export default Edit
