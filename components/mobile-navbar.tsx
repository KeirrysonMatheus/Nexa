"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, UserRound } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const MobileNavBar = () => {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const profileHref = session?.user?.user_apelido
    ? `/users/${session.user.user_apelido}`
    : "/authenticate/login"

  const items = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/busca", label: "Buscar", icon: Search },
    { href: profileHref, label: "Perfil", icon: UserRound },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto flex h-14 max-w-lg items-center justify-around px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href)

          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.25px]")} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileNavBar
