// src/routes/ai.ts
import { Router } from "express";
import { ai } from "../genkit";
import { db, admin } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { RecommendationDocSchema } from "../schema/RecommendationSchema";
import verifyJwtMiddleware from "../middleware/verifyJwtMiddleware";

const router = Router();

/**
 * POST /ai/recommendations/generate
 * Body: { date?: 'YYYY-MM-DD', count?: number }
 * Auth: Bearer <Firebase ID token>
 */
router.post("/recommendations/generate", verifyJwtMiddleware, async (req, res) => {
    try {
        const uid = (res as any).locals.uid as string;
        const date = req.body.date || new Date().toISOString().slice(0, 10);
        const count = Number(req.body.count || 3);

        // Fetch user document
        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();
        if (!userSnap.exists) return res.status(404).json({ error: "User not found" });
        const userData = userSnap.data() || {};

        // Build concise prompt with explicit JSON output requirement
        const prompt = `
You are a nutrition assistant generating meal recommendations for a user with PCOD.
User preferences: ${JSON.stringify(userData.preferences || {})}

Generate ${count} meal recommendations for date ${date} (prefer 1 breakfast, 1 lunch, 1 dinner).
Return ONLY a JSON array (no extra text). Each item must have:
id, title, description (or null), mealType (breakfast|lunch|dinner|snacks|other),
calories (number|null), protein_g (number|null), carbs_g (number|null), fat_g (number|null),
ingredients (array of strings).

Example:
[
  {
    "id":"rec-1",
    "title":"Protein Smoothie",
    "description":"Quick protein smoothie",
    "mealType":"breakfast",
    "calories":320,
    "protein_g":28,
    "carbs_g":40,
    "fat_g":8,
    "ingredients":["banana","whey","almond milk"]
  }
]

Use null for unknown numeric values.
`;

        // Call Genkit/Genie (Gemini) and request JSON output
        const response = await ai.generate({
            model: process.env.GENKIT_MODEL || "models/gemini-1.5-flash",
            prompt,
            output: { format: "json" }
        });

        // Genkit returns parsed JSON for format: "json"
        const rawOut = response.output();
        if (!rawOut) {
            console.error("Genkit returned empty output", response);
            return res.status(500).json({ error: "AI returned empty output" });
        }

        // Normalize items and attach metadata
        const items = (rawOut as any[]).map((it: any, i: number) => ({
            id: it.id || uuidv4(),
            title: it.title,
            description: it.description ?? null,
            mealType: it.mealType,
            calories: typeof it.calories === "number" ? it.calories : null,
            protein_g: typeof it.protein_g === "number" ? it.protein_g : null,
            carbs_g: typeof it.carbs_g === "number" ? it.carbs_g : null,
            fat_g: typeof it.fat_g === "number" ? it.fat_g : null,
            ingredients: Array.isArray(it.ingredients) ? it.ingredients : [],
            recipeSteps: Array.isArray(it.recipeSteps) ? it.recipeSteps : undefined,
            source: "ai",
            locked: false,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
            aiTrace: { raw: response, promptUsed: prompt }
        }));

        const doc = {
            meta: {
                generatedAt: admin.firestore.Timestamp.fromDate(new Date()),
                model: process.env.GENKIT_MODEL || "models/gemini-1.5-flash",
                promptVersion: "v1"
            },
            items
        };

        // Validate with Zod
        const parsedDoc = RecommendationDocSchema.safeParse(doc);
        if (!parsedDoc.success) {
            console.error("Zod validation failed:", parsedDoc.error.format());
            return res.status(500).json({ error: "Validation failed", details: parsedDoc.error.format() });
        }

        // Save to Firestore: users/{uid}/recommendations/{date}
        const recRef = db.collection("users").doc(uid).collection("recommendations").doc(date);
        await recRef.set({
            meta: {
                generatedAt: doc.meta.generatedAt,
                model: doc.meta.model,
                promptVersion: doc.meta.promptVersion
            },
            items: doc.items.map(it => ({
                ...it,
                createdAt: it.createdAt
            }))
        } as any);

        return res.json({ ok: true, items: doc.items });
    } catch (err) {
        console.error("AI generate error:", err);
        return res.status(500).json({ error: "server error", details: err instanceof Error ? err.message : err });
    }
});

export default router;
