import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Prueba = () => {

    const { data: session, status } = useSession()

    if (status === "loading") {
        return <div>Cargando...</div>
    }

    if (session && session.user) {
        return (
            <div>
                <p>Logueado como {session.user.email}</p>
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

export default Prueba