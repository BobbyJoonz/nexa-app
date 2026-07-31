import { z } from "zod";

export const verificationStatusSchema = z.enum([
  "verified",
  "conflicting",
  "missing",
  "needs-review"
]);

export const sourceReferenceSchema = z.object({
  documentId: z.string().min(1),
  fileName: z.string().min(1),
  page: z.number().int().positive(),
  section: z.string().optional()
});

export const verifiedValueSchema = <T extends z.ZodType>(valueSchema: T) =>
  z.object({
    value: valueSchema.nullable(),
    unit: z.string().optional(),
    verificationStatus: verificationStatusSchema,
    sources: z.array(sourceReferenceSchema),
    notes: z.string().optional()
  });

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  fa: z.string().min(1)
});

export const settingProgramSchema = z.object({
  number: z.string().regex(/^\d{2}$/),
  label: localizedTextSchema,
  summary: localizedTextSchema,
  options: z.array(localizedTextSchema).min(1),
  defaultValue: localizedTextSchema.nullable(),
  category: z.enum(["power", "battery", "display", "safety", "advanced"]),
  basic: z.boolean(),
  source: sourceReferenceSchema
});

export const faultCodeSchema = z.object({
  code: z.string().regex(/^\d{2}$/),
  title: localizedTextSchema,
  safeCheck: localizedTextSchema,
  escalation: z.boolean(),
  source: sourceReferenceSchema
});

export const lessonSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  source: sourceReferenceSchema,
  safetyCritical: z.boolean()
});

export const productModelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  brand: z.literal("NEXA"),
  modelName: verifiedValueSchema(z.string().min(1)),
  ratedPowerKw: verifiedValueSchema(z.number().positive()),
  batteryVoltageVdc: verifiedValueSchema(z.number().positive()),
  heroImage: z.string().min(1),
  cutoutImage: z.string().min(1),
  manualDocumentId: z.string().nullable(),
  datasheetDocumentId: z.string().nullable(),
  settings: z.array(settingProgramSchema),
  faultCodes: z.array(faultCodeSchema),
  lessons: z.array(lessonSchema)
});

export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type SettingProgram = z.infer<typeof settingProgramSchema>;
export type FaultCode = z.infer<typeof faultCodeSchema>;
export type LessonModule = z.infer<typeof lessonSchema>;
export type ProductModel = z.infer<typeof productModelSchema>;
export type LocalizedText = z.infer<typeof localizedTextSchema>;
