'use client'
import { Button } from "./button"
import Link from "next/link"
import { Field } from "./field"
import { Input } from "./input"
import { useState } from "react"
import { Search } from "lucide-react"
import { Spinner } from "./spinner"
const FilterPost = () => {
const [busca,setBusca] = useState<string>("")
const [loading,setLoading] = useState(false)
  return(
    <>
        <Field>
          <Input
           placeholder="Pesquisar usuários,posts..."
           required
           onChange={e => setBusca(e.target.value)}
           />
        </Field>

    {loading ? (
        <Button disabled variant="link">
          <Link href={`/busca?termo=${busca}`}>
            <Spinner className="text-foreground size-4"/>
          </Link>
        </Button>
    ):(
        <Button onClick={() => setLoading(true)} variant="link">
          <Link href={`/busca?termo=${busca}`}>
            <Search className="text-foreground"/>
          </Link>
        </Button>
    ) }
        </>
  )
}
export default FilterPost