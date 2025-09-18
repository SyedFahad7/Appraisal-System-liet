import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String },
  },
  { timestamps: true }
);

export type Department = InferSchemaType<typeof DepartmentSchema> & { _id: string };

export default models.Department || model('Department', DepartmentSchema);
