const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
                .catch( (error) => next(error))
    }
}
    
export {asyncHandler}




// const asyncHandler = () => {}
// const asyncHandler = (fu) => {() => {}}
// const asyncHandler = (fu) => { async () => {} }

// const asyncHandler = (fu) => async (req, res, next) => {
//     try {
//         await fu(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }