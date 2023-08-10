import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'

const Session = () => {

    const { data: session, status } = useSession()

    console.log(session)

    if (status === "loading") {
        return <div>Cargando...</div>
    }

    if (session && session.user) {
        return (
            <div>
                <p>Logueado como {session.user.email}</p>
                <Image width={100} height={100} src={session.user.image || ""} alt="" />
                <button onClick={() => signOut()}>Salir</button>
            </div>
        )
    }

    return (
        <div>
            <p>No estas logueado</p>
            <button onClick={() => signIn()}>Ingresar</button>
        </div>
    )
}

export default Session;