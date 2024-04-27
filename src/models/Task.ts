import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const //// este as const hace que todos los valores estén como ReadOnly

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus] /// keyof hace que TaskStatus solo acepte los valores definidos en taskStatus

export interface ITask extends Document { /// esto es de TypeScript
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({ /// esto es de Mongoose
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null,
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]

}, { timestamps: true }) //// agrega la fecha/hora de cuando fue modificado o realizado el registro


// Middleware -- Esto es de Mongoose y permite realizar tareas después o antes de realizar cierta acción en la base de datos "mongoose.com/docs/middleware.html"
//TaskSchema.pre('deleteOne', { document: true, query: false }, async function () {  /// pueden ir los dos parámetros o no
TaskSchema.pre('deleteOne', { document: true }, async function () {
    const taskId = this.id
    if (!taskId) return
    await Note.deleteMany({ task: taskId })
})


const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task