import { AppShell } from "@/components/app-shell"
import { Chatbot } from "@/components/chatbot"
import { ProtectedRoute } from "@/components/protected-route"

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Chatbot />
      </AppShell>
    </ProtectedRoute>
  )
}
