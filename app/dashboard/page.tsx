import { Suspense } from "react";
import MobileNavBar from "@/components/mobile-navbar";
import Header from "@/components/header";
import { Posts } from "@/components/posts";
import SkeletonCard from "@/components/skeleton-card";

const PostsSkeleton = () => (
  <div className="w-full max-w-xl flex flex-col gap-4">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export default function Dashboard() {
  return (
    <div className="min-h-dvh w-full">
      <Header />
      <main>
        <div className="bg-background flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8">
          <Suspense fallback={<PostsSkeleton />}>
            <Posts />
          </Suspense>
        </div>
      </main>
      <MobileNavBar/>
    </div>
  );
}
