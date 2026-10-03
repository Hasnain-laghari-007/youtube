import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideBar from './SideBar'
import OverlaySideBar from "./OverlaySideBar.jsx"
import SideBarContext from '../../context/SideBarContext.jsx'

const Layout = () => {
    return <SideBarContext>
        <Navbar />
        <div className='h-[calc(100vh-56px)] flex w-screen'>
            <SideBar />
            <Outlet />
        </div>
        <OverlaySideBar />
    </SideBarContext>

}

export default Layout