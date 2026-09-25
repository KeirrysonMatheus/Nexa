import Header from "@/components/header"
import { Posts } from "@/components/posts";
export default function Dashboard() {
  return (
      <div className="min-h-dvh w-full">
          <Header/>
          <main>
            <Posts/>
          </main>
        </div>
  );
}
