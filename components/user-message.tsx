import React from 'react'

type UserMessageProps = {
  message: string
  chatId?: string
  showShare?: boolean
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  chatId,
  showShare = false
}) => {
  return (
    <div className="flex items-center w-full space-x-1 mt-2 min-h-10">
      <div className="text-xl flex-1 break-words w-full">{message}</div>
    </div>
  )
}
