import mongoose, { Schema, Document, Model } from "mongoose";
export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }
);

const Comment: Model<IComment> =
    mongoose.models.Comment ||
    mongoose.model<IComment>("Comment", commentSchema);
export default Comment;