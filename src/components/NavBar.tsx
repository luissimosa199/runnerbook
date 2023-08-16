import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {

    const [showNavBar, setShowNavBar] = useState<boolean>(false);    

    const handleOpenNavBar = (e: any) => {
        e.preventDefault();
        setShowNavBar(!showNavBar)
    }

    return (
        <header className="flex justify-between p-2 bg-base-100">

            <div className="">

                <button className="cursor-pointer relative" onClick={handleOpenNavBar}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>

                    {showNavBar && <ul tabIndex={0} className="mt-3 p-2 bg-white shadow rounded bg-base-100 w-52 z-40 absolute">
                        <li><Link href="/">Homepage</Link></li>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><a href="/ftp">FTPs</a></li>
                        <li><a href="/comidas">Comidas</a></li>
                        <li><a href="/agua">Agua</a></li>
                        <li><a href="/ejercicio">Ejercicios</a></li>
                        <li><a href="/notas">Notas</a></li>
                    </ul>}

                    
                </button>

            </div>

            <div className="w-full text-center">
                <Link href="/" className="normal-case text-xl">bikebook.com</Link>
            </div>

            <div className="flex">
                <button className="">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <button className="">
                    <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className=""></span>
                    </div>
                </button>
            </div>

        </header>
    );
};

export default Navbar;