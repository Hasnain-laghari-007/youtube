import React from 'react'
import { House, Play, TvMinimalPlay, CircleUser } from 'lucide-react'

const SideBar = () => {
  let arr = [{ icon: <House />, name: "Home" }, { icon: <Play />, name: "Shorts" }, { icon: <TvMinimalPlay />, name: "Subscriptions" }, { icon: <CircleUser />, name: "You" }]
  return (
    <ul className='h-full w-5 flex flex-col'>
      {
        arr.map((item,idx) =>{
          <li className='flex flex-col items-center p-10 rounded-[5px] hover:bg-[#0F0F0F] duration-150'>
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        })
      }
    </ul>
  )
}

export default SideBar