import { House , Play, Bell,CircleUser, RotateCcw,Menu,Clock,ThumbsUp,ArrowDownToLine } from "lucide-react"
import { useContext } from "react"
import { sideBarContext } from "../../context/SideBarContext.jsx"
import logoImg from "../../assets/youtube-logo-icon.webp"

const OverlaySideBar = () => {
    let {isOpen,setIsOpen} = useContext(sideBarContext)
    const items = [
        {
            icon : <House/>,
            Name : "Home"
        },
        {
            icon : <Play/>,
            Name : "Shorts"
        },
        {
            icon : <Bell/>,
            Name : "Subscriptions"
        },
        {
            icon : <CircleUser/>,
            Name : "Your channel"
        },
        {
            icon : <RotateCcw/>,
            Name : "History"
        },
        {
            icon : <Menu/>,
            Name : "Playlists"
        },
        {
            icon : <Clock/>,
            Name : "Watch later"
        },
        {
            icon : <ThumbsUp />,
            Name : "Liked videos"
        },
        {
            icon : <Play />,
            Name : "Your videos"
        },
        {
            icon : <ArrowDownToLine />,
            Name : "Downloads"
        }
    ]

    return (
        <div className={`absolute top-0 left-0  w-full min-h-full border ${isOpen ? "opacity-1 z-10" : "opacity-0 -z-1"} duration-150  bg-[#00000095]`}>
            <div className="slidingSideBar h-full w-20 border">

                <div className="Logo flex">
                    <img src={logoImg} />
                    <button onClick={() => setIsOpen(prev => !prev)}>
                        <Menu />
                    </button>
                </div>

                <ul className="flex flex-col w-full">
                    {
                        items.map((item,idx) => (
                            <li key={idx}>
                                <img src={item.icon} />
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