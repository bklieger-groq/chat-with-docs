'use client'

import type { UIState } from '@/app/actions'

interface ChatMessagesProps {
  messages: UIState
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (!messages.length) {
    return null
  }

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.component}
        </div>
      ))}
    </>
  )
}