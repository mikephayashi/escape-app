import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen w-full items-end justify-center bg-cover bg-center pb-6"
      style={{ backgroundImage: "url('/island-background.png')" }}
    >
      <Link href="/island">
        <Image
          src="/Start Button.svg"
          alt="Start Game"
          width={600}
          height={200}
          priority
        />
      </Link>
    </main>
  );
}
