import React from 'react'
import { Menu, Search } from 'lucide-react'
import youtubeHome from "../../assets/social.png"

const Navbar = () => {
  return (
    <div className='w-full border flex items-center  py-3 px-4'>
      <div className="leftPart flex">
        <Menu />
          <div className='w-[45px] h-[45px]'>
            <img className='w-full h-full' src={youtubeHome}/>
          </div>
      </div>

      <div className="searchPart">
        <div className="search">
          <input type="text" id='searchBar' />
          <Search />
        </div>
      </div>

      <div className="rightPart">
          <p>Right part</p>
      </div>
    </div>
  )
}

export default Navbar