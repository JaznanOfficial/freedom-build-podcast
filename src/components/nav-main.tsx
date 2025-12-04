"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Sparkles } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    special?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild 
                className={
                  item.special 
                    ? "cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground font-semibold shadow-sm" 
                    : "cursor-pointer"
                }
              >
                <a href={item.url}>
                  {item.special ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    item.icon && <item.icon />
                  )}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
