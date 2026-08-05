class ApiResponse{
    constructor(message = "",data = {},statusCode){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = true
    }
}

export {ApiResponse}