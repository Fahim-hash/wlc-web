import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { buildMemberMessage, buildWhatsAppUrl, createRegisteredMember, isMemberAdminAuthenticated, updateEmailStatus, type MemberNotification, type RegisteredMember } from "@/lib/member-management";
import { createActivationLink, sendActivationEmail } from "@/lib/member-portal";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
 if (!(await isMemberAdminAuthenticated())) return NextResponse.json({message:"Unauthorized."},{status:401});
 const snapshot=await getAdminDb().collection("registered_members").orderBy("createdAt","desc").limit(500).get();
 return NextResponse.json({members:snapshot.docs.map(doc=>{const data=doc.data() as RegisteredMember;return {...data,id:doc.id,portalStatus:(data as any).portalStatus||"NOT_SETUP",username:(data as any).username||null,whatsappUrl:data.phone?buildWhatsAppUrl(data.phone,buildMemberMessage(data)):null};})});
}
export async function POST(request:Request) {
 if (!(await isMemberAdminAuthenticated())) return NextResponse.json({message:"Unauthorized."},{status:401});
 try {
  const body=await request.json();
  const notification:MemberNotification=["email","whatsapp","both"].includes(body?.notification)?body.notification:"none";
  const member=await createRegisteredMember({name:body?.name,email:body?.email,phone:body?.phone,batch:body?.batch,notes:body?.notes,actor:"memberhub"});
  let email:{status:"not_requested"|"sent"|"failed";message?:string}={status:"not_requested"};
  if ((notification==="email"||notification==="both")&&member.email) {
   try {
    const activation=await createActivationLink(member.memberId);
    const messageId=await sendActivationEmail({name:member.name,email:member.email,memberId:member.memberId},activation.url);
    await updateEmailStatus(member.memberId,"SENT",{emailSentAt:Date.now(),emailMessageId:messageId||null,lastEmailError:null});
    email={status:"sent"};
   } catch(error) {
    const message=error instanceof Error?error.message:"Activation email failed.";
    await updateEmailStatus(member.memberId,"FAILED",{lastEmailError:message});
    email={status:"failed",message};
   }
  }
  return NextResponse.json({success:true,member:{...member,portalStatus:email.status==="sent"?"PENDING":"NOT_SETUP",whatsappUrl:member.phone?buildWhatsAppUrl(member.phone,buildMemberMessage(member)):null,whatsappText:member.phone?buildMemberMessage(member):null},email},{status:201});
 } catch(error) { return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to add member."},{status:400}); }
}
