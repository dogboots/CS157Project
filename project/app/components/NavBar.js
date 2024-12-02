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
            <div className="flex text-white text-2xl">
                 
                <div className="flex-1">
                    <b>Placeholder</b>
                  
                </div>

                <button><FiMenu className="text-3xl mr-2 cursor-pointer" onClick={openSideBar}/>
                    
                  </button>
                   
        
                
            
            </div>
        </nav>
        <Sidebar isOpen={isOpen} closeSideBar={closeSideBar}/>
        </div>
        
    );
}

export default NavBar;