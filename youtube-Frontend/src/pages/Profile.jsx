import { React, useEffect, useState } from "react";
import { api } from "../api/axios.js"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  useEffect(() => {

    async function fetchUserVideos() {
      try {
        const response = await api.get("/videos/get-current-user-videos")
        setVideos(response.data.data)
      } catch (error) {
        toast.error("Error occur while fetching videos!")
      }
      finally{
        setIsVideoLoading(false)
      }
    }

    async function fetchCurrentUser() {
      try {
        const response = await api.get("/users/current-user")
        setChannel(response.data.data ?? [])
        setLoading(false)
      } catch (error) {
        toast.error(error.response?.data?.message || "Error occur while fetching videos")
        if (error.reponse?.statusCode === 401) navigate("/")
      }
    }
    fetchCurrentUser()
    fetchUserVideos()
  }, [])


  return (
    <div className="max-w-321 mx-auto px-4 pb-7 md:px-6">
      {/* Cover image */}
      <div className="w-full aspect-[6.2/1] min-h-25 md:rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
        {loading ? (
          <div className="w-10 h-10 border-2 border-blue-500 border-b-transparent border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <img
            src={channel?.coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile info */}
      <div className=" flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-4">
        {/* Profile image */}
        <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center">
          {loading ? (
            <div className="w-10 h-10 border-2 border-blue-500 border-b-transparent border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img
              src={channel?.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="text-center sm:text-left ">
          <h1 className="text-2xl md:text-4xl font-bold">{channel?.fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            @{channel?.username} • {channel?.subscribers} subscribers
          </p>
        </div>

      </div>

      {/* Videos grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
        {
          videos?.length === 0 ?
            isVideoLoading ?
              <div className="absolute w-full justify-center">
                <div className="w-10 h-10 border-2 border-blue-500 border-b-transparent border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
              :
              <div className="absolute flex justify-center w-full">
                <p className="text-center text-3xl">No videos!</p>
              </div>
            :
            videos.map((video) => (
              <div key={video._id} className="flex flex-col cursor-pointer">
                <img className="aspect-video w-full object-cover rounded-xl" src={video.thumbnail} alt="thumbnail" />

                <div className="desc mt-3 flex">

                  <div className="w-9 h-9 rounded-[50%]">
                    <img className="w-full h-full" src={video?.avatar} alt="avatar" />
                  </div>

                  <div className="descriptionDiv flex flex-col items-start flex-1">
                    <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                      {
                        video.description || ""
                      }
                    </p>
                    <p className="text-[14px] truncate font-normal text-[#aaaaaa] hover:text-white cursor-pointer">
                      {video.channel || ""}
                    </p>
                  </div>

                </div>

              </div>
            ))
        }
      </div>
    </div>
  );
};

export default Profile