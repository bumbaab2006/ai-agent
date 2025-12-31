import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexes = await pc.listIndexes();
console.log(
  "Одоо байгаа индексүүд:",
  indexes.indexes.map((i) => i.name)
);
