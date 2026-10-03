import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SideBar from './SideBar'
import OverlaySideBar from "./OverlaySideBar.jsx"
import SideBarContext from '../../context/SideBarContext.jsx'

const Layout = () => {
    return <SideBarContext>
        <Navbar />
        <SideBar />
        <main>
            <Outlet/>
        </main>
        <OverlaySideBar/>
    </SideBarContext>

}

export default Layout