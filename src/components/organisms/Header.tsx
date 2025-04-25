import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../atoms/button";
import { FolderOpen, PenBox } from "lucide-react";
import UserMenu from "../molecules/UserMenu";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();

  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <Image src={'/images/halologo.png'} alt="logo" width={200} height={60} className="h-20 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline">
                <FolderOpen size={18} />
                <span className="hidden md:inline">
                  Dashboard
                </span>
              </Button>
            </Link>
          </SignedIn>

          <Link href="/journal/write">
            <Button variant="journal" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">
                Write New
              </span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button variant="outline">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}
