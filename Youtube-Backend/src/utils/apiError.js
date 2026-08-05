class ApiError extends Error{
    constructor(message = "", statusCode){
        super(message)
        this.statusCode = statusCode
        this.data = {}
        this.message = message
        this.success = false
    }
}
export {ApiError}