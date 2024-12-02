"use client"

import Link from 'next/link'
import { FiMenu } from "react-icons/fi";
import { useState } from 'react';
import Sidebar from './Sidebar';
import "../globals.css";

function NavBar() {
    const [isOpen, setOpen] = useState(false);

    const openSideBar = () => {
        setOpen(!isOpen);
        console.log(isOpen);
    };

    const closeSideBar = () => {
        setOpen(false);
    };

    return (
        <div>

            <nav className="bg-green-500 p-1">
                <div className="flex justify-between items-center text-white text-2xl">

                    <div className="flex items-center">
                        <Link href="/">
                            <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                                <b>Placeholder</b>
                            </button>
                        </Link>


                        <div className="flex space-x-6 ml-6">
                            <Link href="/user">
                                <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                                    User
                                </button>
                            </Link>
                        </div>
                    </div>

                    <button>
                        <FiMenu className="text-3xl mr-2 cursor-pointer" onClick={openSideBar} />
                    </button>
                </div>
            </nav>
            <Sidebar isOpen={isOpen} closeSideBar={closeSideBar} />
        </div>

    );
}

export default NavBar;