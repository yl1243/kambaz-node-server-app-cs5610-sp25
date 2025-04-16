import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app) {

    // 取消报名 ✅ NEW: delete user-course enrollment by userId + courseId
    app.delete("/api/enrollments/user/:userId/course/:courseId", async (req, res) => {
        const { userId, courseId } = req.params;
        try {
            const result = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
            res.sendStatus(200);
        } catch (error) {
            console.error("Unenroll failed:", error);
            res.status(500).send("Unenroll failed");
        }
    });


    // app.delete("/api/enrollments/user/:userId/course/:courseId", async (req, res) => {
    //     const { userId, courseId } = req.params;
    //     const status = await dao.unenrollUserFromCourse(userId, courseId);
    //     res.sendStatus(200);
    // });

    // 查询某个用户的所有报名
    app.get("/api/enrollments/user/:userId", async (req, res) => {
        const { userId } = req.params;
        const enrollments = await dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    });

    // // py的取消报名
    // app.delete("/api/enrollments/user/:userId/course/:courseId", async (req, res) => {
    //     const { userId, courseId } = req.params;
    //     await dao.unenrollUserFromCourse(userId, courseId);
    //     res.sendStatus(204);
    // });

    // get enrollments by course id
    app.get("/api/courses/:courseId/enrollments", async (req, res) => {
        const { courseId } = req.params;
        const enrollments = await enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // enroll coure for user
    app.post("/api/courses/:courseId/enrollments", async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });


    // get enrollments by course id
    app.get("/api/courses/:courseId/enrollments", async (req, res) => {
        const { courseId } = req.params;
        const enrollments = await enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // 给user enroll
    app.post("/api/courses/:courseId/enrollments", async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });

    // get all enrollments
    app.get("/api/enrollments", async (req, res) => {
        const allEnrollments = await dao.findAllEnrollments();
        res.json(allEnrollments);
    });


}