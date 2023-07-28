import { TimelineFormInputs } from "@/types";
import { ChangeEvent, FunctionComponent } from "react"
import { UseFormRegister } from "react-hook-form";

interface PhotoInput {
    handleUploadImages: (event: ChangeEvent<HTMLInputElement>) => void;
    register?: UseFormRegister<TimelineFormInputs>;
    label?: string
}

const PhotoInput: FunctionComponent<PhotoInput> = ({ handleUploadImages, register, label = "Fotos: " }) => {
    return (
        <label htmlFor="photo" className="relative flex flex-col">
            {label}
            <input
                className="border rounded h-10 p-1"
                type="file"
                id="photo"
                multiple
                {...(register ? register("photo") : {})}
                onChange={handleUploadImages}
            />
        </label>
    )
}

export default PhotoInput