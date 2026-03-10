import { MongoClient } from "mongodb";

async function test() {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://manishabanerjeefiemece22_db_user:NiDEgBZidhRwjUyx@cluster4.a9s0oub.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("✅ Connected to MongoDB!");
    client.close();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
}

test();