import thumbnail from "../../assets/thumbnail.jpg"
import avatar from "../../assets/avatar.png"

const VideoCard = () => {
    return (
        <div className="videoCard flex flex-col">
            <img className="aspect-video w-full object-cover rounded-xl" src={thumbnail} alt="thumbnail" />

            <div className="desc mt-3 flex">

                <div className="avatar w-9 h-9 rounded-[50%]">
                    <img className="w-full h-full" src={avatar} alt="avatar" />
                </div>

                <div className="descriptionDiv flex flex-col items-start flex-1 space-y-1">
                    <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                        This is my Test video Use my video sharing app free!
                        Helo Hi ellipses how are you checking your advantage
                    </p>

                    <button  className="channel text-[14px] truncate font-normal text-[#aaaaaa] hover:text-white cursor-pointer">
                        Test channel
                    </button>
                </div>

            </div>
        </div>
    )
}

export default VideoCard




