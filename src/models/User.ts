import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

export type UserRole = 'Principal' | 'HOD' | 'Faculty';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Principal', 'HOD', 'Faculty'], required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    name: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: string };

export default models.User || model('User', UserSchema);
