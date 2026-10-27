import { redirect } from "next/navigation"

export default function CadastroRedirectPage() {
  redirect("/authenticate/signup")
}
