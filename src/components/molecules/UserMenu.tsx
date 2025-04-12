'use client'

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

export default function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-10 w-10",
        }
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Dashboard"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/dashboard"
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  )
}
