"use client"

import { useParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string
  
  const { messages, append, isLoading } = useChat({
    id: chatId,
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI veterinary assistant. How can I help you today? You can describe your pet's symptoms or ask me about past assessments.",
        createdAt: new Date(),
      }
    ],
    body: { chatId },
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {/* Chat Header */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">AI Chat</h1>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Agentic
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">ID: {chatId.slice(0, 8)}...</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ask about your pet's symptoms or search through past assessments
                </p>
              </div>

              {/* Chat Container */}
              <Card className="flex flex-col h-[calc(100vh-280px)] md:h-[calc(100vh-240px)]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role === 'data' ? 'assistant' : message.role}
                      content={message.content}
                      timestamp={message.createdAt || new Date()}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 mb-4">
                      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                        AI
                      </div>
                      <div className="flex items-center gap-1 bg-muted rounded-2xl px-4 py-2.5">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <ChatInput 
                  onSendMessage={(content) => append({ role: 'user', content })} 
                  isLoading={isLoading} 
                />
              </Card>

              {/* Disclaimer */}
              <p className="mt-2 text-xs text-center text-muted-foreground">
                This is a triage tool. Always consult with a licensed veterinarian for medical advice.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
