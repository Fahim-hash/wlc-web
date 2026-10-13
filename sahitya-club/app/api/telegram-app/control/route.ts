import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getVerifiedTelegramMiniAppAdmin } from "@/lib/telegram-mini-app-auth-v2";
import { sendGlobalPushNotification, getPushSubscriberCount } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CMS = ["events","members","committee","achievements","writing","announcements","albums","media","shobdo","kothasokhi_knowledge"] as const;
type CmsCollection = typeof CMS[number];
const KOTHASOKHI_URL = () => ((process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/,"") + "/api/telegram-ai/webhook");

async function telegram(token: string, method: string, body: Record<string, unknown> = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body), cache:"no-store" });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || `Telegram ${method} failed`);
  return result.result;
}
function error(message: string, status = 400) { return NextResponse.json({ok:false,error:message},{status}); }

export async function GET(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return error("Telegram admin verification failed. Open this app from the WLC Control Hub bot.",401);
  try {
    const db = getAdminDb();
    const [subscriberCount, memberCount, attendanceCount, cmsCounts, mediaSnap] = await Promise.all([
      getPushSubscriberCount(),
      db.collection("registered_members").count().get(),
      db.collection("member_attendance").count().get(),
      Promise.all(CMS.map(async name => ({ name, count: (await db.collection(name).count().get()).data().count }))),
      db.collection("telegram_media").orderBy("updatedAt","desc").limit(20).get().catch(()=>null),
    ]);
    let kothasokhi: Record<string,unknown> = {configured:Boolean(process.env.TELEGRAMAI_BOT_TOKEN),available:false};
    const aiToken = process.env.TELEGRAMAI_BOT_TOKEN?.trim();
    if (aiToken) {
      try {
        const [me, info] = await Promise.all([telegram(aiToken,"getMe"),telegram(aiToken,"getWebhookInfo")]);
        kothasokhi = {configured:true,available:true,username:me.username || "",webhookUrl:info.url || "",expectedUrl:KOTHASOKHI_URL(),pendingUpdates:info.pending_update_count || 0,lastError:info.last_error_message || ""};
      } catch (e) { kothasokhi = {configured:true,available:false,error:e instanceof Error?e.message:"Unable to check bot"}; }
    }
    const albums = (mediaSnap?.docs || []).map(doc => ({id:doc.id,...doc.data()})).filter((item:any)=>item.fileId && item.mimeType?.startsWith("image/")).slice(0,12).map((item:any)=>({id:item.id,messageId:item.messageId,caption:item.caption||"",chatId:item.chatId||"",fileId:item.fileId}));
    return NextResponse.json({ok:true,admin:{id:admin.id,firstName:admin.firstName||"WLC Admin"},stats:{subscribers:subscriberCount,members:memberCount.data().count,attendance:attendanceCount.data().count,cms:cmsCounts},albums,kothasokhi});
  } catch { return error("Could not load Control Hub data.",500); }
}

export async function POST(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return error("Telegram admin verification failed.",401);
  try {
    const body = await request.json();
    const action = String(body?.action || "");
    const db = getAdminDb();

    if (action === "push_test" || action === "push_send") {
      const title = action === "push_test" ? "উইল্‌স সাহিত্য ক্লাব" : String(body?.title||"").trim();
      const message = action === "push_test" ? "পরীক্ষামূলক নোটিফিকেশন" : String(body?.message||"").trim();
      const url = typeof body?.url === "string" && body.url.startsWith("/") ? body.url : "/";
      const image = typeof body?.image === "string" && /^https?:\/\//i.test(body.image) ? body.image : undefined;
      if (!title || !message || title.length > 80 || message.length > 300) return error("Title (max 80) and message (max 300) are required.");
      const result = await sendGlobalPushNotification(title,message,url,image);
      await db.collection("audit_logs").add({action:action==="push_test"?"TEST_PUSH":"SEND_PUSH",actor:"telegram:"+admin.id,createdAt:Date.now(),sent:result.sent,failed:result.failed});
      return NextResponse.json({ok:true,result});
    }

    if (action === "cms_stats") {
      const counts = await Promise.all(CMS.map(async name=>({name,count:(await db.collection(name).count().get()).data().count})));
      return NextResponse.json({ok:true,counts});
    }
    if (action === "cms_list") {
      const collection = String(body?.collection||"events") as CmsCollection;
      if (!CMS.includes(collection)) return error("Unsupported CMS collection.");
      const snap = await db.collection(collection).orderBy("updatedAt","desc").limit(30).get().catch(()=>db.collection(collection).limit(30).get());
      return NextResponse.json({ok:true,collection,records:snap.docs.map(doc=>({id:doc.id,...doc.data()}))});
    }
    if (action === "cms_save") {
      const collection = String(body?.collection||"") as CmsCollection;
      if (!CMS.includes(collection)) return error("Unsupported CMS collection.");
      const title = String(body?.title||"").trim();
      if (!title || title.length>180) return error("Title is required (max 180 characters).");
      const now=Date.now();
      const data:Record<string,unknown> = {title, status:body?.publish===true?"PUBLISHED":"DRAFT",updatedAt:now,updatedBy:"telegram:"+admin.id,createdAt:now};
      for (const key of ["description","date","time","venue","message","link","name","role","batch","bio","author","category","body","answer","source"]) {
        if (typeof body?.[key] === "string" && body[key].length <= 12000) data[key]=body[key].trim();
      }
      const ref = db.collection(collection).doc();
      await ref.set(data);
      await db.collection("audit_logs").add({action:body?.publish===true?"PUBLISH":"CREATE_DRAFT",collection,recordId:ref.id,actor:"telegram:"+admin.id,createdAt:now});
      return NextResponse.json({ok:true,id:ref.id,status:data.status});
    }
    if (action === "cms_archive") {
      const collection=String(body?.collection||"") as CmsCollection, id=String(body?.id||"").trim();
      if (!CMS.includes(collection)||!id||id.length>150) return error("Invalid collection or record ID.");
      await db.collection(collection).doc(id).set({status:"ARCHIVED",updatedAt:Date.now(),updatedBy:"telegram:"+admin.id},{merge:true});
      await db.collection("audit_logs").add({action:"ARCHIVE",collection,recordId:id,actor:"telegram:"+admin.id,createdAt:Date.now()});
      return NextResponse.json({ok:true});
    }
    if (action === "member_search") {
      const query=String(body?.query||"").trim().toLowerCase().slice(0,100);
      const batch=String(body?.batch||"").trim().toLowerCase().slice(0,60);
      const snap=await db.collection("registered_members").orderBy("createdAt","desc").limit(500).get();
      const records=snap.docs.map(doc=>({id:doc.id,...doc.data()})).filter((m:any)=>(!query||String(m.name||"").toLowerCase().includes(query)||String(m.memberId||m.id).toLowerCase().includes(query))&&(!batch||String(m.batch||"").toLowerCase().includes(batch))).slice(0,50).map((m:any)=>({memberId:m.memberId||m.id,name:m.name||"",batch:m.batch||"",status:m.status||"",phone:m.phone||""}));
      await db.collection("audit_logs").add({action:"MEMBER_SEARCH",actor:"telegram:"+admin.id,query,batch,resultCount:records.length,createdAt:Date.now()});
      return NextResponse.json({ok:true,records,scanned:snap.size});
    }
    if (action === "album_list") {
      const snap=await db.collection("telegram_media").orderBy("updatedAt","desc").limit(30).get().catch(()=>db.collection("telegram_media").limit(30).get());
      const records=snap.docs.map(doc=>({id:doc.id,...doc.data()})).filter((m:any)=>m.fileId&&m.mimeType?.startsWith("image/")).slice(0,20).map((m:any)=>({id:m.id,messageId:m.messageId,caption:m.caption||"",chatId:m.chatId||"",fileId:m.fileId}));
      return NextResponse.json({ok:true,records});
    }
    if (action === "album_caption") {
      const id=String(body?.id||"").trim(), caption=String(body?.caption||"").trim();
      if(!id||caption.length>1024) return error("Select an album record and use a caption up to 1024 characters.");
      const snap=await db.collection("telegram_media").doc(id).get();
      if(!snap.exists) return error("Album record not found.",404);
      const item=snap.data()!;
      const token=process.env.TELEGRAM_BOT_TOKEN?.trim();
      if(!token||!item.messageId||!item.chatId) return error("Telegram media configuration is incomplete.",503);
      await telegram(token,"editMessageCaption",{chat_id:item.chatId,message_id:item.messageId,caption});
      await db.collection("telegram_media").doc(id).set({caption,updatedAt:Date.now()},{merge:true});
      await db.collection("audit_logs").add({action:"EDIT_ALBUM_CAPTION",recordId:id,actor:"telegram:"+admin.id,createdAt:Date.now()});
      return NextResponse.json({ok:true});
    }
    if (action === "kothasokhi_status") {
      const token=process.env.TELEGRAMAI_BOT_TOKEN?.trim(); if(!token)return error("TELEGRAMAI_BOT_TOKEN is not configured.",503);
      const [me,info]=await Promise.all([telegram(token,"getMe"),telegram(token,"getWebhookInfo")]);
      return NextResponse.json({ok:true,username:me.username||"",url:info.url||"",expectedUrl:KOTHASOKHI_URL(),pendingUpdates:info.pending_update_count||0,lastError:info.last_error_message||""});
    }
    if (action === "kothasokhi_setup") {
      const token=process.env.TELEGRAMAI_BOT_TOKEN?.trim(); if(!token)return error("TELEGRAMAI_BOT_TOKEN is not configured.",503);
      await telegram(token,"setWebhook",{url:KOTHASOKHI_URL(),secret_token:process.env.TELEGRAMAI_WEBHOOK_SECRET?.trim()||crypto.createHash("sha256").update(token).digest("hex"),allowed_updates:["message"],max_connections:10,drop_pending_updates:false});
      await telegram(token,"setMyCommands",{commands:[{command:"start",description:"Start chatting with Kothasokhi"},{command:"help",description:"How to use Kothasokhi"}]});
      const info=await telegram(token,"getWebhookInfo");
      await db.collection("audit_logs").add({action:"KOTHASOKHI_SETUP",actor:"telegram:"+admin.id,createdAt:Date.now()});
      return NextResponse.json({ok:true,url:info.url||"",pendingUpdates:info.pending_update_count||0,lastError:info.last_error_message||""});
    }
    if (action === "kothasokhi_test") {
      const origin=(process.env.NEXT_PUBLIC_SITE_URL||"https://wlc.pro.bd").replace(/\/$/,"");
      const response=await fetch(origin+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:"তুমি কে? এক বাক্যে পরিচয় দাও।"}]}),cache:"no-store"});
      const data=await response.json();
      if(!response.ok||typeof data.reply!=="string")return error(data.error||"AI test failed.",502);
      return NextResponse.json({ok:true,reply:String(data.reply).slice(0,3000)});
    }
    if (action === "kothasokhi_stats") {
      const [conversations,knowledge]=await Promise.all([db.collection("telegram_ai_conversations").count().get(),db.collection("kothasokhi_knowledge").where("status","==","PUBLISHED").count().get()]);
      return NextResponse.json({ok:true,conversations:conversations.data().count,knowledge:knowledge.data().count});
    }
    if (action === "member_count") {
      const snap=await db.collection("registered_members").count().get();
      return NextResponse.json({ok:true,count:snap.data().count});
    }
    return error("Unsupported action.",400);
  } catch (e) {
    console.error("Telegram Mini App control action failed:",e);
    return error(e instanceof Error?e.message:"Control action failed.",500);
  }
}
