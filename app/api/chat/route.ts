export const runtime = "nodejs";

import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextResponse } from "next/server";

type MatchMetadata = {
  text?: string;
};

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(
      "assistant-ai-agent",
      "https://assistant-ai-agent-6dadvox.svc.aped-4627-b74a.pinecone.io"
    );

    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "ibm-granite/granite-embedding-small-english-r2",
      apiKey: process.env.HF_token,
    });
    console.log("GOOGLE KEY:", process.env.GOOGLE_API_KEY);

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
    });

    const queryEmbedding = await embeddings.embedQuery(question);
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 6, // 3 байсныг 6 болгож байна. Ингэснээр илүү их мэдээлэл шүүрдэнэ.
      includeMetadata: true,
    });

    // Metadata-аас текст авахдаа төрлийг нь зааж өгөх (TypeScript)
    const context = queryResponse.matches
      .map((match) => {
        const metadata = match.metadata as MatchMetadata | undefined;
        return metadata?.text || "";
      })
      .join("\n\n---\n\n"); // Контекстүүдийг зааглаж өгөх нь AI-д ойлгоход амар

    const prompt = `
Чи бол тусгай мэдээллийн санд суурилсан ухаалаг AI туслах. 
Доорх "КОНТЕКСТ" хэсэгт өгөгдсөн мэдээллийг ашиглан хэрэглэгчийн асуултад дэлгэрэнгүй, үнэн зөв хариулна уу.

Зарчмууд:
1. Зөвхөн өгөгдсөн контекст доторх баримтад тулгуурла.
2. Хэрэв шууд хариулт байхгүй ч, контекст дотор холбоотой мэдээлэл байвал түүнийг ашиглан дүгнэлт хийж хариул.
3. Хариултаа Монгол хэлээр, ойлгомжтой, найрсаг хэлбэрээр бич.
4. Хэрэв үнэхээр ямар ч холбоотой мэдээлэл олдохгүй бол "Уучлаарай, энэ талаар мэдээллийн санд байхгүй байна" гэж хариул.

КОНТЕКСТ:
${context}

АСУУЛТ:
${question}

ХАРИУЛТ:
`;
    const result = await llm.invoke(prompt);

    return NextResponse.json({ answer: result.content });
  } catch (error: unknown) {
    console.error("Chat API Error Details:", error);
    const message =
      error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
