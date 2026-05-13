function requestlogger(req,res,next){
    console.log({
        method: req.method,
        path: req.path,
        query: req.query,
        timestamp: new Date().toString(),
    });
    next();
}
export default requestlogger;