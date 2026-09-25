import Image from "next/image"
import NexaLogo from "@/public/logo.png"
const Logo = () => {
  return(
    <>
    <Image 
    src={NexaLogo}
    width={50}
    height={50}
    unoptimized
    alt="Nexa Logo"
    className="max-h-14"
    />
    </>
  )
}
export default Logo