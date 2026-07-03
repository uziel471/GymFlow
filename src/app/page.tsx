import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/authentication/services/session";
import {
  ROLE_HOME,
  LOGIN_PATH,
} from "@/features/authentication/constants/auth.constants";

export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? ROLE_HOME[user.role] : LOGIN_PATH);
}
