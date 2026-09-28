"use client";

import Logo from "./ui/logo";
import FilterPost from "./ui/filter-post";
import Link from "next/link";
import { Plus } from "lucide-react";
import UserAvatar from "./ui/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const HeaderSkeleton = () => {
  return <Skeleton className="h-10 w-16 md:w-10 rounded-md md:rounded-full" />;
};

const Header = () => {

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="bg-background border-border text-foreground flex max-h-20 w-full items-center justify-between border-b p-4">
      <div className="flex flex-row items-center gap-2">
        <Logo />
        <span className="font-semibold text-2xl">Nexa</span>
      </div>

      <div className="hidden md:flex md:flex-row">
        <FilterPost />
      </div>

      <div className="flex flex-row items-center gap-3">
        {user && (
          <nav className="bg-background">
            <Link href="/novo-post" aria-label="Criar novo post">
              <Plus className="text-foreground h-6 w-6" />
            </Link>
          </nav>
        )}

        {isPending ? (
          <HeaderSkeleton />
        ) : !user ? (
          <Button variant="outline">
            <Link href="/">Login</Link>
          </Button>
        ) : (
          <UserAvatar />
        )}
      </div>
    </header>
  );
};

export default Header;
