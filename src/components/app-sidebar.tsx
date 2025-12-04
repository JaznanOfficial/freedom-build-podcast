"use client"

import * as React from "react"
import {
  IconMessageCircle,
  IconLayoutDashboard,
  IconHistory,
  IconCreditCard,
  IconPaw,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "AI Agent",
      url: "/chat",
      icon: IconMessageCircle,
      special: true,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Previous History",
      url: "/history",
      icon: IconHistory,
    },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: IconCreditCard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer"
            >
              <a href="/">
                <IconPaw className="!size-5 text-primary" />
                <span className="text-base font-semibold">Vet AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
