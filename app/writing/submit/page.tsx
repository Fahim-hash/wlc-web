import { redirect } from "next/navigation";

// Public writing submissions are temporarily disabled.
// Member Portal submissions remain available through their separate route.
export default function WritingSubmitPage() {
  redirect("/");
}
