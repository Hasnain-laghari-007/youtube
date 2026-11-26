import { useLoaderData, Link } from "react-router-dom";
import { formatViews, timeAgo } from "../utils/DateViewFormat.js";
import { Play } from "lucide-react";

const Profile = () => {
  const { userVideos, currentUser } = useLoaderData()

  return (
    <div className="max-w-321 mx-auto px-4 pb-7 md:px-6">

      {/* Cover image */}
      <div className="w-full aspect-[6.2/1] min-h-25 md:rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
        {currentUser?.coverImage &&
          <img
            src={currentUser.coverImage}
            alt="cover image"
            className="w-full h-full object-cover"
          />
        }
      </div>

      {/* Profile info */}

      <div className=" flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-4">
        {/* Profile image */}

        <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center">
          {currentUser?.avatar &&
            <img
              src={currentUser.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          }
        </div>

        <div className="text-center sm:text-left ">
          <h1 className="text-2xl md:text-4xl font-bold">{currentUser?.fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            @{currentUser?.username} • {currentUser?.subscribers} subscribers
          </p>
        </div>

      </div>

      {/* Videos grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
        {
          userVideos?.length === 0 ?
            <div className="absolute flex justify-center w-full">
              <p className="text-center text-3xl">No videos!</p>
            </div>
            :
            userVideos.map((video) => (
              <Link to={`/watch/${video._id}`} key={video._id} className="flex flex-col cursor-pointer">
                <img className="aspect-video w-full object-cover rounded-xl" src={video.thumbnail} alt="thumbnail" />

                <div className="desc mt-3 flex">

                  <div className="descriptionDiv flex flex-col items-start flex-1">
                    <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                      {
                        video.title || ""
                      }
                    </p>
                    <p className="text-[13px] flex items-center truncate font-normal text-[#aaaaaa] cursor-pointer">
                      <Play size={14} /> <span className="ml-1.5 mr-2">{formatViews(video.views)} </span>
                      <span> {timeAgo(video.createdAt)}</span>
                    </p>
                  </div>

                </div>

              </Link>
            ))
        }
      </div>
    </div>
  );
};

export default Profile