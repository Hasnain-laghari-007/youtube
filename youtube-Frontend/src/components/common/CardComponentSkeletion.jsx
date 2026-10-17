
const CardComponentSkeletion = () => {
    return (
        <div className="flex flex-col animate-pulse">
            <img className="aspect-video w-full object-cover rounded-xl bg-[]" src="" alt="thumbnail" />
            <div className="desc mt-3 flex gap-x-3">

                <div className="avatar w-9 h-9 rounded-[50%]">
                </div>

                <p className="videoTitle h-5 text-[16px]/[22px] font-medium text-[#0f0f0f] overflow-hidden text-ellipsis line-clamp-2">
                </p>
                <span className="channel text-[14px] leading-5 font-normal text-[#606060]">
                </span>

            </div>
        </div>
    )
}

export default CardComponentSkeletion