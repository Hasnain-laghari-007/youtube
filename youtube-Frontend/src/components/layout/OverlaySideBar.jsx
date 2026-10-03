import { House, Play, Bell, CircleUser, RotateCcw, Menu, Clock, ThumbsUp, ArrowDownToLine } from "lucide-react"
import { useContext } from "react"
import { sideBarContext } from "../../context/SideBarContext.jsx"
import logoImg from "../../assets/youtube-logo-icon.jpg"

const OverlaySideBar = () => {
    let { isOpen, setIsOpen } = useContext(sideBarContext)
    const items = [
        {
            icon: <House />,
            Name: "Home"
        },
        {
            icon: <Play />,
            Name: "Shorts"
        },
        {
            icon: <Bell />,
            Name: "Subscriptions"
        },
        {
            icon: <CircleUser />,
            Name: "Your channel"
        },
        {
            icon: <RotateCcw />,
            Name: "History"
        },
        {
            icon: <Menu />,
            Name: "Playlists"
        },
        {
            icon: <Clock />,
            Name: "Watch later"
        },
        {
            icon: <ThumbsUp />,
            Name: "Liked videos"
        },
        {
            icon: <Play />,
            Name: "Your videos"
        },
        {
            icon: <ArrowDownToLine />,
            Name: "Downloads"
        }
    ]

    return (
        <div className={`fixed top-0 left-0  w-full h-screen ${isOpen ? "opacity-100 z-10" : "opacity-0 -z-10"} transition-all bg-[#00000095]`}

            onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false)
            }
            }>
            <div className={`slidingSideBar flex flex-col h-full w-[20%] bg-[#0F0F0F] px-5 overflow-auto ${isOpen ? 'translate-x-0' : '-translate-x-100'} transition-transform duration-150`}>

                <div className="Logo flex h-12 mt-4 ">
                    <button className="cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
                        <Menu />
                    </button>
                    <div className="logo_2 w-full h-full">
                        <img className="w-full h-full object-cover" src={logoImg} />
                    </div>
                </div>
                <hr className="mb-5 mt-10 text-[#4e4e4e]" />
                <ul className="flex flex-col w-full">
                    {
                        items.map((item, idx) => (
                            <li className="flex gap-x-5 w-full p-2 rounded-lg cursor-pointer hover:bg-[#3D3D3D] duration-150 text-[15px]" key={idx}>
                                {item.icon}
                                <p>{item.Name}</p>
                            </li>
                        ))
                    }
                </ul>

            </div>
        </div>
    )
}

export default OverlaySideBar