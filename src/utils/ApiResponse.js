class ApiResponse{
    constructor(status, message, data = "Success") {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = statuscode < 400;
    }
    
}