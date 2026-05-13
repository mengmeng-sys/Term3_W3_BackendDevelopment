function validateMinMaxCredits(req,res,next){
    const {minCredits,maxCredits}=req.query;
    // Check if minCredits is a valid integer
    if(minCredits!==undefined){
        if(!Number.isInteger(Number(minCredits)) || isNaN(Number(minCredits))){
            return res.status(400).json({error:"minCredits must be a valid integer"});
        }
    }
        // Check if maxCredits is a valid integer
    if(maxCredits!==undefined){
        if(!Number.isInteger(Number(maxCredits)) || isNaN(Number(maxCredits))){
            return res.status(400).json({error:"maxCredits must be a valid integer"});
        }
    }
    if(minCredits!==undefined && maxCredits!==undefined){
        if(Number(minCredits)>Number(maxCredits)){
            return res.status(400).json({error:"Invalid credits range: minCredits cannot be greater than maxCredits"});
        }
    }
    next(); // move to next thing to do
}
export default validateMinMaxCredits;