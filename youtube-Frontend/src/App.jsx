import Layout from "./components/layout/Layout.jsx"
import SideBarContext from "./context/SideBarContext.jsx"
import OverlaySideBar from "./components/layout/OverlaySideBar.jsx"

const App = () => {
  return (
    <div className='w-full min-h-screen dark:bg-[#0F0F0F] dark:text-[#FFFFFF] bg-[#FFFFFF] text-black '>
      <SideBarContext>
      <OverlaySideBar/>
      <Layout />
      </SideBarContext>
    </div>
  )
}

export default App