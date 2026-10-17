import thumbnail from "../../assets/thumbnail.jpg"

const CardComponent = () => {
    return (
        <div className="flex flex-col">
            <img className="aspect-video w-full object-cover" src={thumbnail} alt="thumbnail" />
            <div className="desc">
                
            </div>
        </div>
    )
}

export default CardComponent