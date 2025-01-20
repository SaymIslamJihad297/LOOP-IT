module.exports.wrapAsync = (fn)=>{
    return (req, res, next)=>{
        fn(req, res, next).catch((err)=> next(err));
    }
}

class ExpressError extends Error{
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
}
module.exports.ExpressError = ExpressError;