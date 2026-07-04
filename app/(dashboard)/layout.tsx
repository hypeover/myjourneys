import { ModeToggle } from '@/components/ui/mode-toggle';
import React from 'react'

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-dvh">
      <nav className='border-b shadow-xs'>
        <ModeToggle />
      </nav>
      <main className='flex flex-col'>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
