import { House, Play, TvMinimalPlay, CircleUser } from 'lucide-react';

const SideBar = () => {
  let sideBarItems = [{ icon: <House />, name: "Home", id: 1 }, { icon: <Play />, name: "Shorts", id: 2 }, { icon: <TvMinimalPlay />, name: "Subscriptions", id: 3 }, { icon: <CircleUser />, name: "You", id: 4 }]

  return (
    <ul className='sideBar h-[calc(100vh-56px)] inline-block border pl-1 pr-5 pt-4'>
      {
        sideBarItems.map((item) => (
          <li key={item.id} className='px-1 py-4  flex flex-col items-center space-y-2 hover:bg-[#272727] hover:cursor-pointer duration-150 rounded-lg'>
            <span >{item.icon}</span>
            <span className="text-[10px]">{item.name}</span>
          </li>
        ))
      }
    </ul>
  )
}

export default SideBar