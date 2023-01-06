


export function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            next(new Error(error.message, { cause: 500 }))
        })
    }
}


export const handleError = (error, req, res, next) => {
    if (error) {
        if (process.env.ENV == "DEV") {
            res.status(error["cause"] || 500).json({
                message: error.message,
                stack: error.stack,
                status: error["cause"]
            });
        } else {
            res.status(error["cause"] || 500).json({
                message: error.message,
                status: error["cause"]
            })
        }
    }
}