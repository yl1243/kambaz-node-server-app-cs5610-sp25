import Database from "../Database/index.js";
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export async function createAssignment(assignment) {
    // ✅ Debug 输出
    // console.log("🔍 [DEBUG] Database.assignments 类型:", typeof Database.assignments);
    // console.log("🔍 [DEBUG] Database.assignments 是数组吗？", Array.isArray(Database.assignments));
    // console.log("🔍 [DEBUG] 当前 assignments 内容:", Database.assignments);

    // const newAssignment = { ...assignment, _id: uuidv4() };
    // Database.assignments = [...Database.assignments, newAssignment];
    // return newAssignment;
    return await model.create({ _id: uuidv4(), ...assignment });
}

export async function findAllAssignments() {
    // return Database.assignments;
    return await model.find();
}

export async function findAssignmentById(assignmentId) {
    // return Database.assignments.find(
    //     (assignment) => assignment._id === assignmentId
    // );
    return await model.findById(assignmentId);
}

export async function findAssignmentsForCourse(courseId) {
    // return Database.assignments.filter(
    //     (assignment) => assignment.course === courseId
    // );
    return await model.find({ course: courseId });
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
    return await model.findByIdAndUpdate(
        assignmentId,
        assignmentUpdates,
        { new: true }
    );
    // const index = Database.assignments.findIndex(
    //     (assignment) => assignment._id === assignmentId
    // );
    // if (index !== -1) {
    //     Database.assignments[index] = {
    //         ...Database.assignments[index],
    //         ...assignmentUpdates,
    //     };
    //     return Database.assignments[index];
    // }
    // return null;
}

export async function deleteAssignment(assignmentId) {
    const status = await model.findByIdAndDelete(assignmentId);
    return !!status;
    // const index = Database.assignments.findIndex(
    //     (assignment) => assignment._id === assignmentId
    // );
    // if (index !== -1) {
    //     Database.assignments.splice(index, 1);
    //     return true;
    // }
    // return false;
}
