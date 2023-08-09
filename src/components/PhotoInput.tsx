import { TimelineFormInputs } from "@/types";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FunctionComponent } from "react"
import { UseFormRegister } from "react-hook-form";

interface PhotoInput {
    handleUploadImages: (event: ChangeEvent<HTMLInputElement>) => void;
    register?: UseFormRegister<TimelineFormInputs>;
    label?: string;
    variant?: "default" | "small";
}

const PhotoInput: FunctionComponent<PhotoInput> = ({ handleUploadImages, register, label = "Fotos: ", variant = "default" }) => {
    const isSmall = variant === "small";
    
    return (
        <label htmlFor="photo" className={`relative flex flex-col items-center justify-center p-4 border rounded hover:bg-gray-200 cursor-pointer ${isSmall ? "p-2" : ""}`}>
            <i className={`mb-2 text-lg text-gray-500 ${isSmall ? "text-base mb-1" : ""}`}>
                <FontAwesomeIcon icon={faUpload} />
            </i>
            {isSmall ? null : <span className="mb-2 text-lg font-semibold">{label}</span>}
            <input
                accept="image/png, image/jpeg"
                className="absolute opacity-0 w-0 h-0"
                type="file"
                id="photo"
                multiple
                {...(register ? register("photo") : {})}
                onChange={handleUploadImages}
            />
            {isSmall ? null : <span className="text-gray-500">Arrastrá o clickea</span>}
        </label>
    )
}

export default PhotoInput;