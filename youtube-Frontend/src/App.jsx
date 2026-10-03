import { RouterProvider } from "react-router-dom"
import { router } from "./routes/routes.jsx"

const App = () => {
  return (
    <div className='w-full min-h-screen dark:bg-[#0F0F0F] dark:text-[#FFFFFF] bg-[#FFFFFF] text-black '>
      <RouterProvider router={router} />
    </div>
  )
}

export default App