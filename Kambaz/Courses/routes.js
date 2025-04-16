import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function CourseRoutes(app) {

    // find all courses
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    });

    // delete course
    app.delete("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    });

    // create course
    app.post("/api/courses", async (req, res) => {
        const course = await dao.createCourse(req.body);


        // added the enrolling the author
        const currentUser = req.session["currentUser"];
        if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        }

        res.json(course);
    });


    // update course
    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });


    // find user for courses
    const findUsersForCourse = async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    };
    app.get("/api/courses/:cid/users", findUsersForCourse);



    // findmodules for course
    app.get("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });


    // create module
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module);
        res.send(newModule);
    });


    // // HW5旧的 要加， py的不加
    // // get assignments by course id
    // app.get("/api/courses/:courseId/assignments", (req, res) => {
    //     const { courseId } = req.params;
    //     const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
    //     res.json(assignments);
    // });

    // // create assignment
    // app.post("/api/courses/:courseId/assignments", (req, res) => {
    //     const { courseId } = req.params;
    //     const assignment = {
    //         ...req.body,
    //         course: courseId,
    //     };
    //     const newAssignment = assignmentsDao.createAssignment(assignment);
    //     res.send(newAssignment);
    // });



}


