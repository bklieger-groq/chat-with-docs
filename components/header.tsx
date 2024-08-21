import React from 'react'
import { ModeToggle } from './mode-toggle'

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <span className="sr-only">Chat with Docs</span>
        </a>
      </div>
      <div className="flex gap-0.5">
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
