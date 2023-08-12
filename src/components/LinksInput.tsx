import { InputItem } from "@/types";
import { fetchCategories } from "@/utils/getCategories";
import { faGreaterThan, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useRef, useState } from "react";

interface InputListProps {
    inputList: InputItem[];
    setInputList: Dispatch<SetStateAction<InputItem[]>>;
    placeholder?: string;
    suggestions?: string[];
    type: 'tag' | 'link';
}

const InputList: FunctionComponent<InputListProps> = ({ inputList, setInputList, placeholder, type }) => {
    const [inputText, setInputText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [suggestions, setSuggestions] = useState<string[]>([])

    useEffect(() => {
        if (type === 'tag') {
            (async () => {
                const response = await fetchCategories()
                setSuggestions(response)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCaptionChange = (idx: number, caption: string) => {
        const newList = [...inputList];
        newList[idx].caption = caption;
        setInputList(newList);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addInput();
        }
    };

    const addInput = () => {
        const inputValue = inputText.trim().toLocaleLowerCase();
        if (inputList.some(item => item.value === inputValue)) {
            setInputText("");
            return;
        }
        if (inputValue !== "") {
            setInputList(prevInputs => [...prevInputs, { value: inputValue }]);
            setInputText("");
        }
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="relative z-10">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    className="border rounded px-3 py-2 w-full mb-2"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                />
                <button onClick={(event) => {
                    event.preventDefault();
                    addInput();
                    if (inputRef.current) inputRef.current.focus();
                }} className="absolute right-2 top-2 text-lg font-bold rounded-full shadow w-6 h-6 leading-4 text-blue-500 border border-blue-500 bg-white hover:bg-blue-200 hover:text-blue-700">
                    <FontAwesomeIcon icon={faGreaterThan} />
                </button>
            </div>
            {type === 'tag' && inputText !== "" && suggestions.some(e => e.startsWith(inputText)) && (
                <ul className="absolute top-8 bg-white p-2 w-full border border-gray-300 rounded-md shadow-lg z-20">
                    {suggestions.filter(e => e.startsWith(inputText)).slice(0, 10).map((e, idx) => (
                        <li key={idx} className="p-1 hover:bg-gray-100">
                            <button
                                onClick={(event) => {
                                    event.preventDefault();
                                    setInputList([...inputList, { value: e }]);
                                    setInputText('')
                                }}
                                className="hover:text-blue-500 w-full text-left"
                            >
                                {e}
                            </button>
                        </li>
                    ))}

                </ul>
            )}

            <ul className="flex flex-wrap gap-2 md:justify-between">
                {inputList.map((item, idx) => (
                    <li key={idx} className={`bg-white border rounded-md p-2 mb-2 ${type === 'tag' ? 'w-full md:w-[30%]' : 'w-full'} relative`}>

                        <div className={`flex justify-between items-start`}>
                            <span className="text-blue-600 font-medium">
                                {item.value}
                            </span>

                            <button
                                className="text-xs bg-red-500 font-bold w-5 h-5 rounded-full text-white absolute top-2 right-2"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setInputList(inputList.filter(input => input.value !== item.value));
                                }}
                            >
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        </div>


                        {type === 'link' && (
                            <input
                                type="text"
                                value={item.caption || ''}
                                onChange={(e) => handleCaptionChange(idx, e.target.value)}
                                placeholder="Caption for link"
                                className="mt-2 border rounded px-2 py-1 w-full"
                            />
                        )}

                    </li>
                ))}

            </ul>
        </div>
    );
};

export default InputList;
