import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";
import { signIn } from 'next-auth/react'
import Link from "next/link";

export default function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const csrfToken = formData.get("csrfToken");

        signIn('credentials', {
            email: email,
            password: password,
            csrfToken: csrfToken,
            callbackUrl: '/',
        })
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form className="bg-white p-8 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Usuario
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" type="text" id="email" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" type="password" id="password" />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all" type="submit">
                        Ingresar
                    </button>
                    <Link href="/register" className="text-sm mt-2 text-slate-500 hover:opacity-75 transition-all">No tengo cuenta</Link>
                </div>
            </form>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}
