import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Videocall = () => {

    const [isPageLoaded, setPageLoaded] = useState<boolean>(false)
    const router = useRouter()
    const roomId = router.query.id

    useEffect(() => {
        setPageLoaded(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!isPageLoaded || !roomId) {
        return (
            <p>Cargando...</p>
        );
    }

    return (
        <iframe className="w-screen h-screen" src={`https://meet.jit.si/${roomId}`} ></iframe>
    )
}

export default Videocall