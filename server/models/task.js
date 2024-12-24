import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, default: new Date() },
        priority: {
            type: String,
            default: "normal",
            enum: ["high", "medium", "normal", "low"],
        },
        stage: {
            type: String,
            default: "todo",
            enum: ["todo", "in-progress", "completed"],
        },
        activities: [
            {
                type: {
                    type: String,
                    default: "assigned",
                    enum: [
                        "assigned",
                        "started",
                        "in progress",
                        "bug",
                        "completed",
                        "commented",
                    ],
                },
                activity: String,
                date: { type: Date, default: new Date().getTime() },
                by: { type: Schema.Types.ObjectId, ref: "User" },
            },
        ],
        subTasks: [
            {
                title: String,
                date: Date,
                tag: String,
            },
        ],
        assets: [String],
        team: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        isTrashed: {
            type: Boolean,
            default: false
        },
        organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true }, // Add organization field
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
