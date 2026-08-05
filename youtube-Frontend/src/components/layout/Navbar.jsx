import React from 'react'
import { Menu, Search, Mic, Plus, Bell } from 'lucide-react'
import youtubeHome from "../../assets/social.png"

const Navbar = () => {
  return (
    <div className='Navbar w-full flex items-center justify-between px-4 py-1  relative top-2'>
      <div className="leftPart flex items-center space-x-6">
        <button className='p-2 rounded-[50%] hover:bg-[#3F3F3F] duration-150 cursor-pointer'>
          <Menu size={23} />
        </button>
        <div className='w-11 h-11'>
          <img className='w-full h-full' src={youtubeHome} />
        </div>
      </div>

      <div className="search flex items-center dark:bg-[#121212] dark:text-white text-black bg-white max-w-146 h-10 w-full dark:border dark:border-[#484646d0] rounded-[20px] mx-10">
        <input className='relative z-2 placeholder:text[#6C6C6C] text-[17px] focus:outline-blue-500 focus:outline-1 outline-0 flex-1 w-full h-full rounded-tl-[20px] rounded-bl-[20px] pl-4' type="text" id='searchBar' placeholder='Search' />
        <button className='searchBtn cursor-pointer bg-[#222222]  h-full flex items-center px-6 rounded-br-[20px] rounded-tr-[20px]'>
          <Search />
        </button>
      </div>

      <div className="rightPart flex items-center  space-x-10 ">

        <button className='p-3 rounded-[50%]'> {/* mic button*/}
          <Mic size={24} />
        </button>

        <button className='flex items-center py-2 px-4 space-x-2 rounded-[20px]'> {/*create button*/}
          <Plus size={25} />
          <span className='text-[16px] font-medium'>Create</span>
        </button>

        <button className='p-3 rounded-[50%]  hover:bg-[#3F3F3F] duration-150 cursor-pointer'> {/* notifications button*/}
          <Bell size={24} />
        </button>

      </div>

    </div>
  )
}

export default Navbar