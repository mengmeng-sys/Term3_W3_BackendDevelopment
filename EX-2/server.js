// server.js
import express from "express";
import courses from "./course.js";

const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
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
    if(minCredits > maxCredits){
        res.status(400).json({ error: "Invalid credits range" });
        return;
    }

    res.json({
        results: filteredCourses,
        meta:filteredCourses.length
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
