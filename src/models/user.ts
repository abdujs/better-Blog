import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    role: "admin" | "author" | "reader";
    bio?: string;
    avatar?: string;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ["admin", "author", "reader"], default: "reader" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" }
}, { timestamps: true });

const UserModel: Model<IUser> =
    mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);

export default UserModel;