import { React, useEffect, useState } from "react";
import { api } from "../api/axios.js"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await api.get("/users/current-user")
        setChannel(response.data.data)
      } catch {
        toast.error("Unable to get profile! Try again")
        navigate("/")
      }
    }
    fetchCurrentUser()
  }, [])


  return (
    <div className="max-w-321 mx-auto px-4 md:px-6">
      {/* Cover image */}
      <div className="w-full aspect-[6.2/1] min-h-25 md:rounded-xl overflow-hidden bg-gray-500">
        <img
          src={channel?.coverImage}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile info */}
      <div className=" flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-4">
        {/* Profile image */}
        <img
          src={channel?.avatar}
          alt="avatar"
          className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover shrink-0"
        />

        <div className="text-center sm:text-left ">
          <h1 className="text-2xl md:text-4xl font-bold">{channel?.fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            @{channel?.username} • {channel?.subscribers} subscribers
          </p>
        </div>
        
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
        {/* video cards yahan */}
      </div>
    </div>
  );
};

export default Profile