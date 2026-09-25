"use client";

import { Button } from "./button";
import { Field } from "./field";
import { Input } from "./input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Spinner } from "./spinner";
import { useRouter } from "next/navigation";

const FilterPost = () => {
  const [busca, setBusca] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busca.trim()) return;

    setLoading(true);
    router.push(`/busca?termo=${encodeURIComponent(busca)}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-background flex items-center gap-2">
      <Field>
        <Input
          placeholder="Pesquisar usuários, posts..."
          required
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </Field>

      <Button type="submit" disabled={loading} variant={loading ? "ghost" : "link"}>
        {loading ? (
          <Spinner className="text-foreground size-4" />
        ) : (
          <Search className="text-foreground" />
        )}
      </Button>
    </form>
  );
};

export default FilterPost;
