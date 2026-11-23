import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore.js"
import { router } from "./routes/routes.jsx"
import { Toaster } from "react-hot-toast"
import { api } from "./api/axios.js"

const App = () => {

  const setUser = useAuthStore(s => s.setUser)
  const clearUser = useAuthStore(s => s.clearUser)

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await api.get("/users/current-user")
        setUser(res.data?.data)
      } catch (error) {
        clearUser()
      }
    }
    fetchCurrentUser()
  }, [])

  return (
    <div className='w-full min-h-screen dark:bg-[#0F0F0F] dark:text-[#FFFFFF] bg-[#FFFFFF] text-black '>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <RouterProvider router={router} />
    </div>
  )
}

export default App