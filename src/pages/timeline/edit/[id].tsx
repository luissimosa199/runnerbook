import TagsInput from "@/components/TagsInput";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { TimeLineEntryData } from "@/types";

const Edit = () => {

    const [tagsList, setTagsList] = useState<string[]>([]);
    const [mainText, setMainText] = useState<string>('');
    const [timelineData, setTimelineData] = useState<any>({});
    const [photo, setPhoto] = useState<TimeLineEntryData[]>([]);

    const router = useRouter()
    const { id } = router.query;

    useEffect(() => {
        const fetchTimelineData = async () => {
            const response = await fetch(`/api/timeline/${id}`);
            const timelineData = await response.json()

            setTimelineData(timelineData);
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

        console.log("INIT DATA: ", timelineData)

    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMainText(event.target.value);
    }

    const handleCaptionChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const newPhoto = [...photo];
        newPhoto[index].caption = event.target.value;
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
                            <div key={e.idx}>
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
