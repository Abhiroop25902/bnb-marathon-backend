import {z} from "zod";

export const ScheduledPostPayloadSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    mealType: z.string(),
    protein_g: z.number().nullable(),
    carbs_g: z.number().nullable(),
    fat_g: z.number().nullable(),
    ingredients: z.array(z.string()),
    source: z.string().default('ai'),
    createdAt: z.string()
});