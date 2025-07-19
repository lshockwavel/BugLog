import { Schema } from "mongoose";




export const NoteSchema = new Schema({
    body: { type: String, minLength: 5, maxLength: 500, required: true },
    bugId: { type: Schema.ObjectId, ref: "Bug", required: true },
    creatorId: { type: Schema.ObjectId, ref: "Account", required: true }
}, { toJSON: { virtuals: true }  });

NoteSchema.virtual("creator", {
    ref: "Account",
    localField: "creatorId",
    foreignField: "_id",
    justOne: true
});
