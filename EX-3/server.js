// server.js
import express from "express";
import courses from "./course.js";
import requestlogger from "./assistantsServer/logger.js";
import validateMinMaxCredits from "./assistantsServer/validateCredits.js";
import auth from "./assistantsServer/auth.js";


const app = express();
const PORT = 3000;

// Q1 Logging Middleware Function
// function requestlogger(req,res,next){
    
//     console.log({
//         method: req.method,
//         path: req.path,
//         query: req.query,
//         timestamp: new Date().toString(),
//     });
//     next();
// }
//apply globally middleware
app.use(requestlogger);

//Q2 Create a route-specific middleware to validate query parameters
// function validateMinMaxCredits(req,res,next){
//     const {minCredits,maxCredits}=req.query;
//     // Check if minCredits is a valid integer
//     if(minCredits!==undefined){
//         if(!Number.isInteger(Number(minCredits)) || isNaN(Number(minCredits))){
//             return res.status(400).json({error:"minCredits must be a valid integer"});
//         }
//     }
//         // Check if maxCredits is a valid integer
//     if(maxCredits!==undefined){
//         if(!Number.isInteger(Number(maxCredits)) || isNaN(Number(maxCredits))){
//             return res.status(400).json({error:"maxCredits must be a valid integer"});
//         }
//     }
//     if(minCredits!==undefined && maxCredits!==undefined){
//         if(Number(minCredits)>Number(maxCredits)){
//             return res.status(400).json({error:"Invalid credits range: minCredits cannot be greater than maxCredits"});
//         }
//     }
//     next(); // move to next thing to do
// }
// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses',auth,validateMinMaxCredits, (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    //edge case : invalid credit range
    if(minCredits && maxCredits && Number(minCredits) > Number(maxCredits)) return res.status(400).json({error:"Invalid credits range : minCredits cannot be greater than maxCredits"});
    //dept filter
    let filteredCourses = courses.filter(course => course.department === dept);
    //level filtered by exact level
    if (level)filteredCourses = filteredCourses.filter(course => course.level === level);
    //minimum credit filtering by greater or equal minCredits
    if(minCredits) filteredCourses = filteredCourses.filter(course=> course.credits >= minCredits);
    //maximum credit filtering by less or equal maxCredits
    if(maxCredits) filteredCourses = filteredCourses.filter(course=> course.credits<=maxCredits);
    //semester filtered by exact semester
    if(semester) filteredCourses = filteredCourses.filter(course => course.semester ===semester);
    //Filter by instructor (partial match,case insensitive)
    if(instructor){
        filteredCourses = filteredCourses.filter(course =>
            course.instructor.toLowerCase().includes(instructor.toLowerCase())
        );
    }
    // no need this condition anymore since we had middleware that check for validation of min and max credits
    // if(minCredits > maxCredits){
    //     res.status(400).json({ error: "Invalid credits range" });
    //     return;
    // }

    res.json({
        results: filteredCourses,
        meta:filteredCourses.length
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
