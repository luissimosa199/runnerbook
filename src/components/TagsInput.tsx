import { fetchCategories } from "@/utils/getCategories";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";

interface TagsInputProps {
    tagsList: string[]
    setTagsList: Dispatch<SetStateAction<string[]>>
}

const TagsInput: FunctionComponent<TagsInputProps> = ({ tagsList, setTagsList }) => {
    const [inputText, setInputText] = useState("");
    const [categories, setCategories] = useState<string[]>([])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addTag();
        }
    };

    const addTag = () => {

        const inputValue = inputText.trim().toLocaleLowerCase()

        if (tagsList.includes(inputValue)) {
            setInputText("");
            return;
        }

        if (inputText.trim() !== "") {
            setTagsList((prevTags) => [...prevTags, inputValue]);
            setInputText("");
        }
    };

    useEffect(() => {
        (async () => {
            const response = await fetchCategories()
            setCategories(response)
        })()
    }, [])

    return (
        <div className="flex flex-col gap-2 mb-6 relative">
            <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Agrega una categoría y presiona Enter"
                className="border rounded px-2 py-1 w-full mb-2"
            />
            {inputText !== "" && categories.some(e => e.startsWith(inputText)) && (
                <ul className="absolute top-8 bg-white p-2 w-full border">
                    {categories.filter(e => e.startsWith(inputText)).map((e, idx) => (
                        <li key={idx} className="">
                            <button
                                onClick={(event) => { event.preventDefault(); setTagsList([...tagsList, e]); setInputText('') }}
                                className="hover:text-blue-500 w-full text-left"
                            >
                                {e}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <ul className="flex flex-wrap gap-2">
                {tagsList.map((e, idx) => (
                    <li key={idx} className="bg-blue-300 rounded-full pl-2" >
                        <span>
                            {e}
                        </span>
                        <button
                            className="ml-2 text-xs bg-transparent font-bold w-6 h-6 border-2 bg-white rounded-full text-blue-500"
                            onClick={(event) => { event.preventDefault(); setTagsList(tagsList.filter(tag => tag !== e)) }}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TagsInput;