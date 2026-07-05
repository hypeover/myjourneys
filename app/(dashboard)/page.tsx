import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import ModernMap from '@/components/map'

const Page = () => {
  return (
    <div>
      <Link href="/luggage"><Button>backpack</Button></Link>
      <ModernMap />
    </div>
  )
}

export default Page
