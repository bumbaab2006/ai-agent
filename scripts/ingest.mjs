import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import * as dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

dotenv.config({ path: ".env.local" });

async function run() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index(
    "assistant-ai-agent",
    "https://assistant-ai-agent-6dadvox.svc.aped-4627-b74a.pinecone.io"
  ); // Индексийн Dimension-ийг моделийнхтой тааруулаарай!

  // HuggingFace-ийн Granite модель ашиглах тохиргоо
  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "ibm-granite/granite-embedding-small-english-r2",
    apiKey: process.env.HF_token,
  });

  try {
    const text = fs.readFileSync("data.txt", "utf8");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const chunks = await textSplitter.createDocuments([text]);

    console.log(`Нийт ${chunks.length} хэсэг текст бэлдлээ.`);

    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`${i + 1}-р хэсгийг вектор болгож байна...`);
      const embedding = await embeddings.embedQuery(chunks[i].pageContent);

      vectors.push({
        id: `vec_${Date.now()}_${i}`,
        values: embedding,
        metadata: { text: chunks[i].pageContent },
      });
    }

    await index.upsert(vectors);
    console.log(
      "✅ Амжилттай! HuggingFace-ээр дамжуулан Pinecone-д хадгалагдлаа."
    );
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
  }
}

run();
