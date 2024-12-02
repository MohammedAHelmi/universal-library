class CodedError extends Error{
    constructor(code, message){
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CodedError;