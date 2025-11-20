import {z} from 'zod'

export const UserPatchPayloadSchema = z.object({
    cycle: z.object({
        cycleLength: z.number().optional(),
        lastPeriodStart: z.string().optional(),
        previousPeriodStart: z.string().nullable().optional(),
        thirdLastPeriodStart: z.string().nullable().optional(),
    }).optional(),

    onboarding: z.object({
        completed: z.boolean().optional(),
        completedAt: z.string().optional(),
        version: z.string().optional(),
    }).optional(),

    preference: z.object({
        proteinTarget: z.number().optional(),
        sensitivities: z.array(z.string()).optional(),
        vegetarian: z.boolean().optional(),
    }).optional(),

    id: z.string().optional()
});
