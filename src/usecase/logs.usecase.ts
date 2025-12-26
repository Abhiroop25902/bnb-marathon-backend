import LogPostPayloadSchema from "../schema/LogPostPayloadSchema";
import {ai} from "../genkit";


export default async function getMacros(imgUrl: string) {
    const system: string = `You are a nutrition analysis expert.
Given an image of a meal, your task is to analyze the food and return structured nutritional information.

You must:
1. Identify all visible food items in the image.
2. Estimate the macronutrients of the entire meal:
   - protein (grams)
   - carbohydrates (grams)
   - fat (grams)
3. Determine whether the meal is processed or unprocessed.
   - Consider a meal "processed" if it contains refined, packaged, deep-fried, or industrially prepared components.
   - Consider it "unprocessed" if it is primarily whole foods such as fruits, vegetables, grains, legumes, eggs, or fresh meat.

Rules:
- Base your estimates only on what is visible in the image.
- If quantities are unclear, make reasonable approximations.
- Do not include explanations, commentary, or uncertainty statements.
- Do not invent foods that are not visible.
- Return only structured data that matches the provided output schema.`;

    const {output} = await ai.generate({
        system: system,
        prompt: [{media: {url: imgUrl}}],
        tools: [],
        output: {
            schema: LogPostPayloadSchema.pick({
                detectedFoods: true,
                estimatedMacros: true,
                processed: true
            })
                .required()
                .strict()
        },
    });

    return output;
}