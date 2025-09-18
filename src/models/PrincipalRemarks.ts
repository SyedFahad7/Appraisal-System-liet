import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const PrincipalRemarksSchema = new Schema(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    academicYear: { type: String, required: true, index: true },
    hodAppraisalId: { type: Schema.Types.ObjectId, ref: 'HodAppraisal', required: true },
    remarks: { type: String },
    finalRating: { type: Number },
    signed: { type: Boolean, default: false },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export type PrincipalRemarks = InferSchemaType<typeof PrincipalRemarksSchema> & { _id: string };

export default models.PrincipalRemarks || model('PrincipalRemarks', PrincipalRemarksSchema);
