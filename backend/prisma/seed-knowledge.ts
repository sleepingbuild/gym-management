import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { gymKnowledge } from './knowledge-base';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY!,
  apiVersion: 'v1',
});

async function embedText(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return result.embeddings![0].values!;
}

async function seedKnowledge() {
  console.log('🌱 Seeding knowledge base...');

  for (const item of gymKnowledge) {
    try {
      const textToEmbed = `${item.title}: ${item.content}`;
      const embedding = await embedText(textToEmbed);
      const embeddingStr = `[${embedding.join(',')}]`;

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
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`❌ Failed: ${item.title}`, err);
    }
  }

  console.log('✅ Knowledge base seeded!');
}

seedKnowledge()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
