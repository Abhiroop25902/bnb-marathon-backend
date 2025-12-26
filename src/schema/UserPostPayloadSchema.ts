import {z} from 'genkit'

const UserPostPayload = z.object({
    cycle: z.object({
            cycleLength: z.number(),
            lastPeriodStart: z.string(),
            previousPeriodStart: z.string().optional().nullable(),
            thirdLastPeriodStart: z.string().optional().nullable(),
        }
    ),
    onboarding: z.object({
        completed: z.boolean(),
        completedAt: z.string(),
        version: z.string(),
    }),
    preference: z.object({
        proteinTarget_g: z.number(),
        sensitivities: z.array(z.object({
            ingredient: z.string(),
            isSensitive: z.boolean(),
        })),
        vegetarian: z.boolean(),
    })
})

export default UserPostPayload;