import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StewMaker Stock Transfer',
  description: 'App for managing stock transfers to outlets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-brand-blue text-white p-4 shadow-md flex items-center">
          <Image src="/logo.png" alt="StewMaker Logo" width={60} height={60} />
          <h1 className="text-2xl font-bold ml-4">Stock Transfer</h1>
        </header>
        <main className="bg-gray-50 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}