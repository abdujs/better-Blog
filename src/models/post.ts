import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string; 
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema: Schema<IPost> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Post: Model<IPost> =
  mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);

export default Post;