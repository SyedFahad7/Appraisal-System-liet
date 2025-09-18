import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const FacultySelfAppraisalSchema = new Schema(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    academicYear: { type: String, required: true, index: true },
    phases: { type: Object, required: true },
    attachments: [{ filename: String, path: String, size: Number, mimeType: String }],
    signed: { type: Boolean, default: false },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export type FacultySelfAppraisal = InferSchemaType<typeof FacultySelfAppraisalSchema> & { _id: string };

export default models.FacultySelfAppraisal || model('FacultySelfAppraisal', FacultySelfAppraisalSchema);
