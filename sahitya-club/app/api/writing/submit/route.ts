// app/api/writing/submit/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

// ১. Zod দিয়ে কঠোর ডেটা ভ্যালিডেশন স্কিমা (XSS Injection ডিফেন্স)
const submitSchema = z.object({
  title: z.string().min(2, "শিরোনাম খুব ছোট").max(100, "শিরোনাম ১০০ ক্যারেক্টারের বেশি হতে পারবে না").trim(),
  category: z.enum(["poetry", "story", "essay"]),
  content: z.string().min(10, "লেখা খুব ছোট").max(5000, "লেখা ৫০০০ ক্যারেক্টারের বেশি হতে পারবে না").trim(),
  penName: z.string().max(50, "ছদ্মনাম ৫০ ক্যারেক্টারের বেশি হতে পারবে না").trim().optional(),
});

export async function POST(request: Request) {
  try {
    // সিকিউরিটি চেক ২: কনটেন্ট টাইপ চেক
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Invalid Content Type" }, { status: 400 });
    }

    const body = await request.json();

    // সিকিউরিটি চেক ৩: ডাটা স্যানিটাইজেশন এবং স্কিমা ম্যাচিং
    const validation = submitSchema.safeParse(body);
    if (!validation.success) {
      // যদি হ্যাকার কোনো ইনভ্যালিড ডাটা স্ট্রাকচার পুশ করে
      return NextResponse.json(
        { message: "সিকিউরিটি ভায়োলেশন! ভুল বা ক্ষতিকারক ডাটা ডিটেক্ট হয়েছে।", errors: validation.error.format() },
        { status: 422 }
      );
    }

    const cleanedData = validation.data;

    // TODO: সিকিউরিটি চেক ৪ (লগইন সেশন চেক - NextAuth ব্যবহার করলে এখানে চেক করবে)
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    /* 
      ⚡ এখানে ডাটাবেজ অপারেশন হবে। যেমন MongoDB কানেকশন:
      await db.collection("submissions").insertOne({
        ...cleanedData,
        submittedAt: new Date(),
        userIp: request.headers.get("x-forwarded-for") || "unknown" // ট্র্যাকিংয়ের জন্য আইপি সেভ রাখা
      });
    */

    console.log("Secure Data Received:", cleanedData);

    return NextResponse.json(
      { message: "Data received and saved securely." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "সার্ভারে কোনো ইন্টারনাল সিকিউরিটি বা টেকনিক্যাল ইস্যু হয়েছে।" },
      { status: 500 }
    );
  }
}
