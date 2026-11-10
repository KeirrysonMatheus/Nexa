import Image from "next/image"

const Logo = () => {
  return (
    <>
      <Image
        src="/logo.png"
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