import { PrismaClient } from "@prisma/client";
import { gymKnowledge } from "./knowledge-base";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const QWEN_API_URL = process.env.QWEN_API_URL || "http://localhost:5000";

async function embedText(text: string): Promise<number[]> {
    const res = await fetch(`${QWEN_API_URL}/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok)
        throw new Error(`Embed server responded with status ${res.status}`);
    const data = (await res.json()) as { vector: number[] };
    return data.vector;
}

async function seedKnowledge() {
    console.log("🌱 Seeding knowledge base...");

    for (const item of gymKnowledge) {
        try {
            const textToEmbed = `${item.title}: ${item.content}`;
            const embedding = await embedText(textToEmbed);
            const embeddingStr = `[${embedding.join(",")}]`;

            await prisma.$executeRaw`
        INSERT INTO "KnowledgeBase" (id, category, title, content, embedding, "createdAt")
        VALUES (
          gen_random_uuid()::text,
          ${item.category},
          ${item.title},
          ${item.content},
          ${embeddingStr}::vector,
          NOW()
        )
        ON CONFLICT DO NOTHING
      `;

            console.log(`✅ Embedded: ${item.title}`);
            await new Promise((r) => setTimeout(r, 200));
        } catch (err) {
            console.error(`❌ Failed: ${item.title}`, err);
        }
    }

    console.log("✅ Knowledge base seeded!");
}

seedKnowledge()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
