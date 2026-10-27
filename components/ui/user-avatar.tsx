"use client"

import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserAvatar() {
  const { data: session } = authClient.useSession()
  const user = session?.user
  const router = useRouter()

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleLogout() {
    await authClient.signOut()
    router.push("/authenticate/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm leading-none font-medium">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={`/users/${user.user_apelido}`} className="flex w-full items-center">
            <UserIcon className="mr-2 h-4 w-4" /> Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" /> Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
