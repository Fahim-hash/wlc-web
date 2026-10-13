import crypto from "node:crypto";
export function verifyTelegramMiniAppAdmin(initData: string): { id: number; firstName?: string } | null {
 const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
 if (!token || !initData) return null;
 const params = new URLSearchParams(initData);
 const hash = params.get("hash") || "";
 const authDate = Number(params.get("auth_date"));
 const userRaw = params.get("user");
 if (!userRaw || !/^[a-f0-9]{64}$/i.test(hash) || !Number.isFinite(authDate)) return null;
 const now = Math.floor(Date.now()/1000);
 if (now-authDate > 86400 || authDate > now+60) return null;
 const data = [...params.entries()].filter(([k])=>k!=="hash").sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+"="+v).join("\n");
 const secret = crypto.createHmac("sha256","WebAppData").update(token).digest();
 const expected = crypto.createHmac("sha256",secret).update(data).digest();
 const actual = Buffer.from(hash,"hex");
 if (actual.length !== expected.length || !crypto.timingSafeEqual(actual,expected)) return null;
 try {
  const user = JSON.parse(userRaw) as {id?:number;first_name?:string};
  const admins=(process.env.TELEGRAM_ADMIN_IDS||"").split(",").map(v=>v.trim());
  if (!user.id || !admins.includes(String(user.id))) return null;
  return {id:user.id,firstName:user.first_name};
 } catch { return null; }
}
export function getVerifiedTelegramMiniAppAdmin(request: Request) {
 return verifyTelegramMiniAppAdmin(request.headers.get("x-telegram-init-data") || "");
}