import { Home,Search,MessageCircle } from "lucide-react"
const MobileNavBar = () => {
  return(
    <div className="md:hidden w-full fixed bottom-0">
      <nav className="bg-background p-4 rounded-b-md mx-auto items-center flex flex-row gap-5 justify-center border-t border-border">
        <div>
          <button className="cursor-pointer">
          <Home size={20} />
          </button>
          </div>
        <div>
          <button className="cursor-pointer">
          <Search size={20}/>
          </button>
          </div>
        <div>
          <button className="cursor-pointer">
          <MessageCircle size={20}/>
          </button>
          </div>

      </nav>
    </div>
  )
}
export default MobileNavBar