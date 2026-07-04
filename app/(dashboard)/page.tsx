import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <Link href="/packing"><Button>backpack</Button></Link>
    </div>
  )
}

export default Page
