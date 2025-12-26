import {z} from 'genkit';

const LogPostPayloadSchema = z.object({
    imgUrl: z.string().optional(),
    detectedFoods: z.array(z.string()).optional().describe('Detected Food from the image given'),
    estimatedMacros: z.object({
        carbs_g: z.number().describe('Carbs in gram estimated from the image given'),
        fat_g: z.number().describe('Fats in gram estimated from the image given'),
        protein_g: z.number().describe('Protein protein from the image given'),
    }).optional().describe('Estimated Macros detected from the image given'),
    mealType: z.enum(["breakfast", "lunch", "snacks", "dinner", "other"]),
    processed: z.boolean().optional().describe('If the image contains processed food or not'),
    rawText: z.string(),
    symptoms: z.array(z.string()).optional(),
    createdAt: z.string()
    //userId will be created on post request
})

export default LogPostPayloadSchema