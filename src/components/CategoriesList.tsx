import { fetchCategories } from "@/utils/getCategories";
import Link from "next/link";
import { useQuery } from "react-query";

const CategoriesList = () => {

    const { data, isLoading, error } = useQuery<string[] | Error>({
        queryFn: fetchCategories,
        queryKey: ['categories'],
    })

    if (isLoading) {
        return (
            <div className="mx-4 max-w-[850px]">
                <h2 className="text-3xl mb-4">Categorías</h2>
                <ul className="mb-8 flex flex-col gap-1">
                    <li>
                        <p>Cargando...</p>
                    </li>
                </ul>
            </div>
        )
    }

    if (error || data instanceof Error) {
        return (
            <div className="mx-4 max-w-[850px]">
                <h2 className="text-3xl mb-4">Categorías</h2>
                <ul className="mb-8 flex flex-col gap-1">
                    <li>
                        <p>Error {JSON.stringify(error)}</p>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <div className="mx-4 max-w-[850px]">
            <h2 className="text-3xl mb-4">Categorías</h2>
            <ul className="mb-8 flex flex-wrap justify-around gap-4">
                {data!.map((e, idx: number) => {
                    return (
                        <li key={idx}>
                            <Link className="capitalize py-2 hover:opacity-75" href={`/timeline/search?tags=${e}`}>{e}</Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CategoriesList