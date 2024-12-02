import { IoIosStats } from "react-icons/io";
import { FaRegClipboard } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { IoIosPaper } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";

export default function Sidebar({ isOpen, closeSideBar }) {
    return (
        <aside className={`h-screen w-32 fixed top-0 right-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="bg-indigo-500 h-full flex flex-col border-l shadow-sm">
                <div className="p-1 flex justify-end">
                    <button onClick={closeSideBar}>
                        <IoExitOutline size={24} />
                    </button>
                </div>
                <div className="flex flex-col">
                    <SidebarItem text="Stats" icon={<IoIosStats size={20}/>} />
                    <SidebarItem text="Comps" icon={<FaRegClipboard size={20}/>} />
                    <SidebarItem text="Units" icon={<FaClipboardUser size={20}/>} />
                    <SidebarItem text="Patch" icon={<IoIosPaper size={20}/>} />
                    {/* Add more SidebarItems here */}
                </div>
            </nav>
        </aside>
    );
}

export function SidebarItem({ text, icon }) {
    return (
        <div className="p-4 border-b text-white hover:bg-indigo-600 cursor-pointer flex justify-between items-center">
            <span>{text}</span>
            <span>{icon}</span>
        </div>
    );
}