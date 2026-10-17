import thumbnail from "../../assets/thumbnail.jpg"
import avatar from "../../assets/avatar.png"

const CardComponent = () => {
    return (
        <div className="flex flex-col">
            <img className="aspect-video w-full object-cover rounded-xl" src={thumbnail} alt="thumbnail" />

            <div className="desc mt-3 flex">

                <div className="avatar w-9 h-9 rounded-[50%]">
                    <img className="w-full h-full" src={avatar} alt="avatar" />
                </div>

                <p className="videoTitle h-5 text-[16px]/[22px] font-medium text-[#f1f1f1] overflow-hidden text-ellipsis line-clamp-2">
                    This is my Test video Use my video shring app free!
                </p>
            </div>
            <span className="channel text-[14px] leading-5 font-normal text-[#aaaaaa]">
                    Test channel
                </span>
        </div>
    )
}

export default CardComponent