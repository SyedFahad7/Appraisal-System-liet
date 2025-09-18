import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const HodAppraisalSchema = new Schema(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    academicYear: { type: String, required: true, index: true },
    selfAppraisalId: { type: Schema.Types.ObjectId, ref: 'FacultySelfAppraisal', required: true },
    scores: { type: Object, required: true },
    remarks: { type: String },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export type HodAppraisal = InferSchemaType<typeof HodAppraisalSchema> & { _id: string };

export default models.HodAppraisal || model('HodAppraisal', HodAppraisalSchema);
