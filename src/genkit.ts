import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

export const ai = genkit({
    plugins: [googleAI()],
    // Optional. Specify a default model.
    model: googleAI.model('gemini-2.5-flash'),
});

// async function run() {
//     const response = await ai.generate('Invent a menu item for a restaurant with a pirate theme.');
//     console.log(response.text);
// }
