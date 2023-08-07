import { fetchCategories } from "@/utils/getCategories";
import { faGreaterThan, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useRef, useState } from "react";

interface InputListProps {
    inputList: string[];
    setInputList: Dispatch<SetStateAction<string[]>>;
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

        if (inputList.includes(inputValue)) {
            setInputText("");
            return;
        }

        if (inputText.trim() !== "") {
            setInputList((prevInputs) => [...prevInputs, inputValue]);
            setInputText("");
        }
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="relative">
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
                <ul className="absolute top-8 bg-white p-2 w-full border border-gray-300 rounded-md shadow-lg">
                    {suggestions.filter(e => e.startsWith(inputText)).map((e, idx) => (
                        <li key={idx} className="p-1 hover:bg-gray-100">
                            <button
                                onClick={(event) => { event.preventDefault(); setInputList([...inputList, e]); setInputText('') }}
                                className="hover:text-blue-500 w-full text-left"
                            >
                                {e}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <ul className="flex flex-wrap gap-2">
                {inputList.map((e, idx) => (
                    <li key={idx} className="bg-blue-300 rounded-full pl-2 pr-2 py-1 flex items-center gap-2 text-sm" >
                        <span className="mb-1">
                            {e}
                        </span>
                        <button
                            className="text-xs bg-transparent font-bold w-5 h-5 border-2 bg-white rounded-full text-blue-500 hover:bg-blue-200 hover:border-blue-700"
                            onClick={(event) => { event.preventDefault(); setInputList(inputList.filter(input => input !== e)) }}
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InputList;
