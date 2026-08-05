import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideBar from './SideBar'

const Layout = () => {
    return <>
        <Navbar />
        <SideBar />
        {/* <div className='main'>
            <Outlet/>
        </div> */}
    </>

}

export default Layout