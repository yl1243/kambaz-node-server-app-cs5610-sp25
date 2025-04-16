import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
// let currentUser = null;


export default function UserRoutes(app) {


    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    // sign up
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser; // 不同用户有不同的session， 每个页面看到不同的用户
        res.json(currentUser);
    };


    // sign in
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };


    // find all users
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }

        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }


        const users = await dao.findAllUsers();
        res.json(users);

    };


    // Update user
    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };




    // profile: Retrieving the Profile from the Server
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };


    //  Integrating Signout with a RESTful Web API
    const signout = (req, res) => {

        req.session.destroy();  // Users can be signed out by destroying the session.
        res.sendStatus(200);
    };


    // find courses for user
    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        if (currentUser.role === "ADMIN") {
            const courses = await courseDao.findAllCourses();
            res.json(courses);
            return;
        }
        let { uid } = req.params;
        if (uid === "current") {
            uid = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(uid);
        res.json(courses);
    };
    app.get("/api/users/:uid/courses", findCoursesForUser);


    // // retrieve courses the current user is enrolled in
    // const findCoursesForEnrolledUser = (req, res) => {
    //     let { userId } = req.params;
    //     if (userId === "current") {
    //         const currentUser = req.session["currentUser"];
    //         if (!currentUser) {
    //             res.sendStatus(401);
    //             return;
    //         }
    //         userId = currentUser._id;
    //     }
    //     const courses = courseDao.findCoursesForEnrolledUser(userId);
    //     res.json(courses);
    // };


    // Create course
    // const createCourse = (req, res) => {
    //     const currentUser = req.session["currentUser"];
    //     const newCourse = courseDao.createCourse(req.body);
    //     enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    //     res.json(newCourse);
    // };
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const newCourse = {
            ...req.body,
            owner: currentUser._id,
        };

        const createdCourse = courseDao.createCourse(newCourse);

        // 如果需要课程加入用户的enrollment
        enrollmentsDao.enrollUserInCourse(currentUser._id, createdCourse._id);

        res.json(createdCourse);
    };

    // enroll User in course
    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };


    // unenroll user from course
    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);


    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    // find user by id
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };


    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.get("/api/users/:userId", findUserById);

    app.get("/api/users", findAllUsers);
    app.post("/api/users/profile", profile);
    app.put("/api/users/:userId", updateUser);
    app.post("/api/users/signout", signout);
    // app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.post("/api/users", createUser);
    app.delete("/api/users/:userId", deleteUser);

}