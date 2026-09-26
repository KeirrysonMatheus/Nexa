"use client";

import Logo from "./ui/logo";
import FilterPost from "./ui/filter-post";
import Link from "next/link";
import { Plus } from 'lucide-react';
import UserAvatar from "./ui/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const Header = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="bg-background w-full p-4 flex justify-between max-h-20 border-b border-border items-center">
      <div className="flex flex-row items-center">
        <Logo />
        <span className="text-foreground font-semibold text-[18pt]">Nexa</span>
      </div>

      <div className="hidden bg-background md:flex md:flex-row">
        <FilterPost />
      </div>

      <div className="flex flex-row gap-3 items-center">
        {user && (
          <nav className="bg-background">
            <Link href="/novo-post">
              <Plus className="text-foreground" />
            </Link>
          </nav>
        )}
        
        {!user && (
          <Button variant="outline">
            <Link href="/">Login</Link>
          </Button>
        )}
        
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
