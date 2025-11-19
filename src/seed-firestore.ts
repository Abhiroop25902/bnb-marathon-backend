import admin from "firebase-admin";

// -----------------------------
// 1. FIREBASE INIT (Matches your firebase.ts)
// -----------------------------
if (process.env.FIREBASE_ADMIN_JSON) {
    // DEV / Local / Docker
    const adminJson = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
    admin.initializeApp({
        credential: admin.credential.cert(adminJson),
    });
    console.log("🔥 Firebase initialized using FIREBASE_ADMIN_JSON");
} else {
    // Cloud Run / Firebase Hosting
    admin.initializeApp();
    console.log("🔥 Firebase initialized using application default credential");
}

const db = admin.firestore();

// -----------------------------
// 2. SEED DATA (3 USERS + logs + recs + feedback)
// -----------------------------
const users = [
    {
        id: "u_niyati",
        data: {
            name: "Niyati Shah",
            email: "niyati@example.com",
            timezone: "Asia/Kolkata",
            cycle: { lastPeriodStart: "2025-11-05", cycleLength: 28, phase: "LUTEAL" },
            preferences: {
                vegetarian: true,
                proteinTarget_g: 40,
                sensitivities: ["spinach", "paneer", "dry_red_chilies"],
            },
            onboarding: {
                completed: true,
                completedAt: "2025-10-05T09:00:00.000Z",
                version: "v1",
            },
        },
    },
    {
        id: "u_aaradhya",
        data: {
            name: "Aaradhya Mehta",
            email: "aaru@example.com",
            timezone: "Asia/Kolkata",
            cycle: { lastPeriodStart: "2025-11-10", cycleLength: 31, phase: "FOLLICULAR" },
            preferences: {
                vegetarian: true,
                proteinTarget_g: 55,
                sensitivities: ["high_oil"],
            },
            onboarding: {
                completed: true,
                completedAt: "2025-09-08T07:00:00.000Z",
                version: "v1",
            },
        },
    },
    {
        id: "u_sara",
        data: {
            name: "Sara Fernandes",
            email: "sara@example.com",
            timezone: "Asia/Kolkata",
            cycle: { lastPeriodStart: "2025-11-15", cycleLength: 26, phase: "OVULATORY" },
            preferences: {
                vegetarian: false,
                proteinTarget_g: 65,
                sensitivities: ["lactose"],
            },
            onboarding: {
                completed: true,
                completedAt: "2025-09-30T10:00:00.000Z",
                version: "v1",
            },
        },
    },
];

const logs = [
    // ----------------- NIYATI -----------------
    {
        id: "n_log_1",
        data: {
            userId: "u_niyati",
            createdAt: "2025-11-19T08:00:00.000Z",
            mealType: "breakfast",
            rawText: "Banana + soaked almonds",
            detectedFoods: ["banana", "almonds"],
            estimatedMacros: { protein_g: 4, carbs_g: 20, fat_g: 6 },
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "n_log_2",
        data: {
            userId: "u_niyati",
            createdAt: "2025-11-19T12:45:00.000Z",
            mealType: "lunch",
            rawText: "Tofu bowl with vegetables",
            detectedFoods: ["tofu", "mixed veggies"],
            estimatedMacros: { protein_g: 22, carbs_g: 30, fat_g: 10 },
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "n_log_3",
        data: {
            userId: "u_niyati",
            createdAt: "2025-11-19T16:00:00.000Z",
            mealType: "snacks",
            rawText: "Roasted makhana",
            detectedFoods: ["makhana"],
            estimatedMacros: { protein_g: 3, carbs_g: 15, fat_g: 1 },
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "n_log_4",
        data: {
            userId: "u_niyati",
            createdAt: "2025-11-19T18:30:00.000Z",
            mealType: "dinner",
            rawText: "Moong dal khichdi",
            detectedFoods: ["moong dal khichdi"],
            estimatedMacros: { protein_g: 14, carbs_g: 50, fat_g: 4 },
            symptoms: ["light bloating"],
            processed: true,
        },
    },
    {
        id: "n_log_5",
        data: {
            userId: "u_niyati",
            createdAt: "2025-11-19T21:00:00.000Z",
            mealType: "other",
            typeName: "herbal_tea",
            rawText: "Cinnamon ginger herbal tea",
            detectedFoods: ["ginger", "cinnamon"],
            estimatedMacros: {},
            symptoms: [],
            processed: true,
        },
    },

    // ----------------- AARADHYA -----------------
    {
        id: "a_log_1",
        data: {
            userId: "u_aaradhya",
            createdAt: "2025-11-19T07:45:00.000Z",
            mealType: "breakfast",
            rawText: "Greek yogurt with chia seeds",
            detectedFoods: ["yogurt", "chia"],
            estimatedMacros: { protein_g: 12 },
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "a_log_2",
        data: {
            userId: "u_aaradhya",
            createdAt: "2025-11-19T11:45:00.000Z",
            mealType: "lunch",
            rawText: "Paneer bhurji + 2 rotis",
            detectedFoods: ["paneer", "roti"],
            estimatedMacros: { protein_g: 20 },
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "a_log_3",
        data: {
            userId: "u_aaradhya",
            createdAt: "2025-11-19T15:30:00.000Z",
            mealType: "snacks",
            rawText: "Fruit bowl",
            detectedFoods: ["fruits"],
            estimatedMacros: {},
            symptoms: [],
            processed: true,
        },
    },
    {
        id: "a_log_4",
        data: {
            userId: "u_aaradhya",
            createdAt: "2025-11-19T17:00:00.000Z",
            mealType: "other",
            typeName: "coffee",
            rawText: "Black coffee",
            detectedFoods: ["coffee"],
            estimatedMacros: {},
            symptoms: ["slight anxiety"],
            processed: true,
        },
    },
    {
        id: "a_log_5",
        data: {
            userId: "u_aaradhya",
            createdAt: "2025-11-19T20:00:00.000Z",
            mealType: "dinner",
            rawText: "Vegetable upma",
            detectedFoods: ["upma"],
            estimatedMacros: {},
            symptoms: [],
            processed: true,
        },
    },

    // ----------------- SARA -----------------
    {
        id: "s_log_1",
        data: {
            userId: "u_sara",
            createdAt: "2025-11-19T08:15:00.000Z",
            mealType: "breakfast",
            rawText: "2 boiled eggs + apple",
            detectedFoods: ["eggs", "apple"],
            estimatedMacros: { protein_g: 12 },
            processed: true,
        },
    },
    {
        id: "s_log_2",
        data: {
            userId: "u_sara",
            createdAt: "2025-11-19T12:45:00.000Z",
            mealType: "lunch",
            rawText: "Grilled chicken salad",
            detectedFoods: ["chicken", "salad"],
            estimatedMacros: { protein_g: 30 },
            processed: true,
        },
    },
    {
        id: "s_log_3",
        data: {
            userId: "u_sara",
            createdAt: "2025-11-19T16:00:00.000Z",
            mealType: "snacks",
            rawText: "Protein bar",
            detectedFoods: ["protein bar"],
            estimatedMacros: { protein_g: 10 },
            processed: true,
        },
    },
    {
        id: "s_log_4",
        data: {
            userId: "u_sara",
            createdAt: "2025-11-19T18:00:00.000Z",
            mealType: "other",
            typeName: "protein_shake",
            rawText: "Whey protein shake",
            detectedFoods: ["protein shake"],
            estimatedMacros: { protein_g: 25 },
            symptoms: ["mild bloating"],
            processed: true,
        },
    },
    {
        id: "s_log_5",
        data: {
            userId: "u_sara",
            createdAt: "2025-11-19T21:00:00.000Z",
            mealType: "dinner",
            rawText: "Vegetable stir fry",
            detectedFoods: ["veggies"],
            estimatedMacros: {},
            processed: true,
        },
    },
];

const today = [
    {
        id: "u_niyati_2025-11-20",
        data: {
            userId: "u_niyati",
            date: "2025-11-20",
            generatedAt: "2025-11-20T02:00:00.000Z",
            recs: {
                breakfast: [{ title: "Ragi dosa + mint chutney", reason: "Low GI", confidence: 0.88 }],
                lunch: [{ title: "Tofu quinoa bowl", reason: "High protein", confidence: 0.92 }],
                dinner: [{ title: "Moong dal khichdi", reason: "Light for evening", confidence: 0.9 }],
                snacks: [{ title: "Roasted chana", reason: "High fibre", confidence: 0.7 }],
                other: [{ title: "Herbal ginger tea", typeName: "herbal_tea", reason: "Anti-inflammatory", confidence: 0.85 }],
            },
        },
    },
    {
        id: "u_aaradhya_2025-11-20",
        data: {
            userId: "u_aaradhya",
            date: "2025-11-20",
            generatedAt: "2025-11-20T03:00:00.000Z",
            recs: {
                breakfast: [{ title: "Besan chilla", reason: "High protein", confidence: 0.85 }],
                lunch: [{ title: "Paneer salad bowl", reason: "Protein", confidence: 0.8 }],
                dinner: [{ title: "Oats khichdi", reason: "Light meal", confidence: 0.77 }],
                snacks: [{ title: "Fruit + nuts", reason: "Balanced", confidence: 0.71 }],
                other: [{ title: "Black coffee", typeName: "coffee", reason: "Limit to 1 cup", confidence: 0.65 }],
            },
        },
    },
    {
        id: "u_sara_2025-11-20",
        data: {
            userId: "u_sara",
            date: "2025-11-20",
            generatedAt: "2025-11-20T04:00:00.000Z",
            recs: {
                breakfast: [{ title: "Egg scramble", reason: "High protein", confidence: 0.9 }],
                lunch: [{ title: "Chicken quinoa bowl", reason: "Balanced macros", confidence: 0.93 }],
                dinner: [{ title: "Vegetable soup", reason: "Light and warm", confidence: 0.8 }],
                snacks: [{ title: "Greek yogurt cup", reason: "Protein + probiotics", confidence: 0.75 }],
                other: [{ title: "Plant-based protein shake", typeName: "protein_shake", reason: "Low lactose", confidence: 0.81 }],
            },
        },
    },
];

const feedback = [
    {
        id: "fb_1",
        data: { userId: "u_niyati", logId: "n_log_4", rating: 3, symptoms: ["bloating"], note: "Felt heavy", createdAt: "2025-11-19T20:00:00.000Z" },
    },
    {
        id: "fb_2",
        data: { userId: "u_aaradhya", logId: "a_log_4", rating: 2, symptoms: ["anxiety"], note: "Coffee caused jitters", createdAt: "2025-11-19T18:00:00.000Z" },
    },
    {
        id: "fb_3",
        data: { userId: "u_sara", logId: "s_log_4", rating: 3, symptoms: ["bloating"], note: "Whey protein didn’t sit well", createdAt: "2025-11-19T19:00:00.000Z" },
    },
];

const scheduled = [
    {
        id: "sch_1",
        data: {
            userId: "u_niyati",
            date: "2025-11-20",
            mealType: "dinner",
            suggestion: { title: "Moong dal khichdi", reason: "Light meal" },
            lockedAt: "2025-11-19T18:00:00.000Z",
            status: "locked",
        },
    },
    {
        id: "sch_2",
        data: {
            userId: "u_aaradhya",
            date: "2025-11-20",
            mealType: "other",
            typeName: "coffee",
            suggestion: { title: "Black coffee" },
            lockedAt: "2025-11-19T09:00:00.000Z",
            status: "locked",
        },
    },
    {
        id: "sch_3",
        data: {
            userId: "u_sara",
            date: "2025-11-20",
            mealType: "other",
            typeName: "protein_shake",
            suggestion: { title: "Plant protein shake" },
            lockedAt: "2025-11-19T12:00:00.000Z",
            status: "locked",
        },
    },
];

// -----------------------------
// 3. RUN THE SEED
// -----------------------------
async function run() {
    console.log("\n🌱 Seeding Firestore...\n");

    for (const u of users) {
        await db.collection("users").doc().set(u.data);
        console.log(`✔ users/${u.id}`);
    }

    // for (const l of logs) {
    //     await db.collection("logs").doc(l.id).set(l.data);
    //     console.log(`✔ logs/${l.id}`);
    // }
    //
    // for (const t of today) {
    //     await db.collection("today_recommendations").doc(t.id).set(t.data);
    //     console.log(`✔ today_recommendations/${t.id}`);
    // }
    //
    // for (const s of scheduled) {
    //     await db.collection("scheduled").doc(s.id).set(s.data);
    //     console.log(`✔ scheduled/${s.id}`);
    // }
    //
    // for (const f of feedback) {
    //     await db.collection("feedback").doc(f.id).set(f.data);
    //     console.log(`✔ feedback/${f.id}`);
    // }

    console.log("\n🎉 DONE — Full dataset seeded!\n");
    process.exit(0);
}

run();
