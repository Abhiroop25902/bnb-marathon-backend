// src/schema/RecommendationSchema.ts
import { z } from "zod";

export const RecommendationItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    mealType: z.enum(["breakfast", "lunch", "snacks", "dinner", "other"]),
    calories: z.number().nullable().optional(),
    protein_g: z.number().nullable().optional(),
    carbs_g: z.number().nullable().optional(),
    fat_g: z.number().nullable().optional(),
    ingredients: z.array(z.string()).optional(),
    recipeSteps: z.array(z.string()).optional(),
    source: z.enum(["ai", "recipe_db"]).optional(),
    locked: z.boolean().optional(),
    createdAt: z.any().optional(),
    aiTrace: z.any().optional()
});

export const RecommendationDocSchema = z.object({
    meta: z.object({
        generatedAt: z.any(),
        model: z.string(),
        promptVersion: z.string().optional()
    }),
    items: z.array(RecommendationItemSchema)
});
