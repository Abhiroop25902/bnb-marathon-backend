import {z} from 'zod'

const LogPostPayloadSchema = z.object({
    imgUrl: z.string().optional(),
    // detectedFoods: z.array(z.string()),
    // estimatedMacros: z.object({
    //     carbs_g: z.number(),
    //     fat_g: z.number(),
    //     protein_g: z.number(),
    // }),
    mealType: z.enum(["breakfast", "lunch", "snacks", "dinner", "other"]),
    // processed: z.boolean(),
    rawText: z.string(),
    symptoms: z.array(z.string()).optional(),
    createdAt: z.string()
    //userId will be created on post request
})

export default LogPostPayloadSchema