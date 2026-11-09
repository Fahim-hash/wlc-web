export type Gen3PanelSeed = {
  id: string;
  panelId: "GEN-3";
  panelName: "Executive Panel" | "Advisor Panel";
  group: "executive" | "advisor";
  department: string;
  name: string;
  role: string;
  sortOrder: number;
  status: "PUBLISHED";
  photoFileId: string;
};

export const GEN3_PANEL_SEED: Gen3PanelSeed[] = [
  ["executive","", "হাসনাত আযান","সভাপতি"],
  ["executive","", "তৌসিফ মাহমুদ গুঞ্জন","সহ সভাপতি"],
  ["executive","", "সুদিঠি বিনতে সাখাওয়াত","সাধারণ সম্পাদক"],
  ["executive","", "আয়েশা খান","সম্পাদক (সম্পাদনা বিভাগ)"],
  ["executive","", "ফারহানা তাসনিম রাইসা","সাংগঠনিক সম্পাদক"],
  ["executive","", "উম্মে ওয়াকিয়া জারা","মুখ্য সংগঠক"],
  ["executive","", "ওয়ালিন হোসেন সিকদার","নিয়ন্ত্রক (বাংলা সাহিত্য)"],
  ["executive","", "সামশিহা পরী","নিয়ন্ত্রক (ইংরেজি সাহিত্য)"],
  ["executive","", "সায়েম আহমেদ","নিয়ন্ত্রক (ধর্মীয় সাহিত্য)"],
  ["executive","", "আব্দুল কাইয়ুম ত্বোহা","নিয়ন্ত্রক (বিশেষ শিশু শাখা)"],
  ["executive","", "শেখ তাসিন","যোগাযোগ বিষয়ক সম্পাদক"],
  ["executive","", "আতিক আহরার","প্রকাশনা বিষয়ক সম্পাদক"],
  ["executive","", "সুরাইয়া আক্তার","গ্রন্থাগার বিষয়ক সম্পাদক"],
  ["executive","", "রাকিবুল ইসলাম আকাশ","চলচ্চিত্র বিষয়ক সম্পাদক"],
  ["executive","", "তানভীর আহমেদ","স্থিরচিত্র বিষয়ক সম্পাদক"],
  ["executive","", "মেঘলা আহসান","দেয়ালিকা বিষয়ক সম্পাদক"],
  ["executive","", "মেহরাব জামান আরিয়ান","দেয়ালিকা বিষয়ক সহ-সম্পাদক"],
  ["executive","", "আহনাফ অমি","নথিসংগ্রাহক"],
  ["executive","", "সুমাইয়া আল-আমিন ইশা","কার্যনির্বাহী"],
  ["executive","", "মিশকাত রহমান","কার্যনির্বাহী"],
  ["executive","", "আব্দুল্লাহ আহমেদ","কার্যনির্বাহী"],
  ["advisor","প্রশাসনিক বিভাগ", "আরিয়ান আজমাইন মিয়ন","উপদেষ্টা"],
  ["advisor","প্রশাসনিক বিভাগ", "এহসান আহমেদ সিয়াম","উপদেষ্টা"],
  ["advisor","প্রশাসনিক বিভাগ", "মোল্লা সৌম্য রহমান","পরামর্শদাতা"],
  ["advisor","প্রশাসনিক বিভাগ", "রাফিদুল আমিন সাব্বির","পরামর্শদাতা"],
  ["advisor","সম্পাদনা বিভাগ", "আইশান শান","উপদেষ্টা"],
  ["advisor","সম্পাদনা বিভাগ", "সৈয়দ ফাহিম মুদ্দাসির","পরামর্শদাতা"],
  ["advisor","সম্পাদনা বিভাগ", "নাজমুস সাকিব","পরামর্শদাতা"],
].map(([group, department, name, role], index) => ({
  id: "gen3-" + String(index + 1).padStart(2, "0"),
  panelId: "GEN-3" as const,
  panelName: group === "executive" ? "Executive Panel" as const : "Advisor Panel" as const,
  group: group as "executive" | "advisor",
  department,
  name,
  role,
  sortOrder: index + 1,
  status: "PUBLISHED" as const,
  photoFileId: "",
}));

export async function ensureGen3PanelSeed(db: FirebaseFirestore.Firestore) {
  const ref = db.collection("panel_members");
  const existing = await ref.where("panelId", "==", "GEN-3").limit(1).get();
  if (!existing.empty) return false;
  const batch = db.batch();
  const now = Date.now();
  for (const member of GEN3_PANEL_SEED) {
    batch.set(ref.doc(member.id), { ...member, createdAt: now, updatedAt: now, createdBy: "system:gen3-seed", updatedBy: "system:gen3-seed" });
  }
  await batch.commit();
  await db.collection("audit_logs").add({ action: "SEED_GEN3_PANEL", collection: "panel_members", recordCount: GEN3_PANEL_SEED.length, actor: "system", createdAt: now });
  return true;
}
