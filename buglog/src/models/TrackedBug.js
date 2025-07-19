import { Schema } from "mongoose";



export const TrackedBugSchema = new Schema({
    bugId: { type: Schema.ObjectId, ref: "Bug", required: true },
    accountId: { type: Schema.ObjectId, ref: "Account", required: true }
} , { toJSON: { virtuals: true }  })

TrackedBugSchema.virtual("bug", {
    ref: "Bug",
    localField: "bugId",
    foreignField: "_id",
    justOne: true
})

TrackedBugSchema.virtual("tracker", {
    ref: "Account",
    localField: "accountId",
    foreignField: "_id",
    justOne: true
})