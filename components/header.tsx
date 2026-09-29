"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";
import Logo from "./ui/logo";
import FilterPost from "./ui/filter-post";
import Link from "next/link";
import { Plus } from "lucide-react";
import UserAvatar from "./ui/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import CreatePostForm from "./create-post-form";

const HeaderSkeleton = () => {
  return <Skeleton className="h-10 w-16 md:w-10 rounded-md md:rounded-full" />;
};

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Plus size={20} className="text-foreground" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-131.25">
              <DialogHeader>
                <DialogTitle>Criar nova publicação</DialogTitle>
              </DialogHeader>
              <CreatePostForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
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
