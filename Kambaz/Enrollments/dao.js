import model from "./model.js";
import { v4 as uuidv4 } from "uuid";


export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    console.log("Enrollments populated:", enrollments); // 👈 加这个
    return enrollments.map((enrollment) => enrollment.user);
}

// export function enrollUserInCourse(user, course) {
//     const newEnrollment = { user, course, _id: `${user}-${course}` };
//     return model.create(newEnrollment);
// }

// py的
export async function enrollUserInCourse(user, course) {
    // 先检查是否已经报名
    const existing = await model.findOne({ user, course });
    if (existing) {
        // 如果已经报名，返回现有记录
        return existing;
    }
    // 没有报名，创建新记录
    return model.create({ _id: uuidv4(), user, course });
}

export function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
}

//py的
export async function findEnrollmentsByUser(userId) {
    return await model.find({ user: userId }).populate("course");
}

// find all enrollments
export async function findAllEnrollments() {
    return model.find(); // 返回所有 enrollments
}



// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";


// export function enrollUserInCourse(userId, courseId) {
//     const { enrollments } = Database;
//     enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
// }

// export function findAllEnrollments() {
//     return Database.enrollments;
// }

// export function findEnrollmentsForCourse(courseId) {
//     const { enrollments } = Database;
//     return enrollments.filter((enrollment) => enrollment.course === courseId);
// }

// export function deleteEnrollment(enrollmentId) {
//     const { enrollments } = Database;
//     Database.enrollments = enrollments.filter(
//         (enrollment) => enrollment._id !== enrollmentId
//     );
// }