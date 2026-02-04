"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { processCommand } from "@/lib/chatbot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function Chatbot() {
  const store = useStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Bonjour ! Je suis l'assistant IA de MoreFix. Je peux vous aider à gérer votre stock.\n\nTapez "aide" pour voir les commandes disponibles.`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    const result = processCommand(input, {
      state: store.state,
      addCategory: store.addCategory,
      updateCategory: store.updateCategory,
      deleteCategory: store.deleteCategory,
      addSupplier: store.addSupplier,
      addProduct: store.addProduct,
      updateProduct: store.updateProduct,
      deleteProduct: store.deleteProduct,
      getCategoryById: store.getCategoryById,
      getSupplierById: store.getSupplierById,
      getLowStockProducts: store.getLowStockProducts,
      getOutOfStockProducts: store.getOutOfStockProducts,
    })

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
    inputRef.current?.focus()
  }

  const quickCommands = [
    { label: "Ruptures", command: "Quels produits sont en rupture ?" },
    { label: "Stock faible", command: "Stock faible" },
    { label: "Valeur stock", command: "Valeur du stock" },
    { label: "Aide", command: "aide" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Chatbot IA</h1>
        <p className="mt-1 text-muted-foreground">
          Assistant intelligent pour la gestion de votre stock
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              Assistant MoreFix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "assistant"
                          ? "bg-primary"
                          : "bg-secondary"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-secondary-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        message.role === "assistant"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                      <p className="mt-1 text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="rounded-lg bg-secondary px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tapez votre message..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button type="submit" disabled={isTyping || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Quick Commands */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Commandes rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.label}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setInput(cmd.command)}
                >
                  {cmd.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exemples de commandes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Ajouter du stock</p>
                <p>&quot;Ajoute 10 claviers Logitech&quot;</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Modifier le stock</p>
                <p>&quot;Change le stock de la RTX 3060 à 5&quot;</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Créer une catégorie</p>
                <p>&quot;Crée une catégorie Écrans&quot;</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Informations produit</p>
                <p>&quot;Info sur RTX 4070&quot;</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
