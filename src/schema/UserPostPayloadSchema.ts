import {z} from 'zod'

const UserPostPayload = z.object({
    cycle: z.object({
            cycleLength: z.number(),
            lastPeriodStart: z.string(),
        }
    ),
    onboarding: z.object({
        completed: z.boolean(),
        completedAt: z.string(),
        version: z.string(),
    }),
    preference: z.object({
        proteinTarget_g: z.number(),
        sensitivities: z.array(z.string()),
        vegetarian: z.boolean(),
    })
})

export default UserPostPayload;