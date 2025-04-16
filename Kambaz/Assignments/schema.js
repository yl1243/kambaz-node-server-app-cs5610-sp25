import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: String,
        title: { type: String, required: true },
        course: { type: String, ref: "CourseModel", required: true },
        type: { type: String, default: "Assignment" },
        points: { type: Number, default: 100 },
        availableDate: Date,
        dueDate: Date,
        description: String
    },
    { collection: "assignments" }
);

export default assignmentSchema;