import { redirect } from "next/navigation";
import { localePath } from "@/lib/i18n/paths";
import { getLang } from "@/lib/i18n/server";

export default async function Page() {
  redirect(localePath("/boss", await getLang()));
}
