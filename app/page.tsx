import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"



export default function HomePage() {
  const user = authClient.useSession()
  if (user) {
    redirect("/dashboard")
  }
  redirect("/authenticate/login")
}
