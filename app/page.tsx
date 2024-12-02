'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Clone Legends</h1>
      <p className="text-lg text-muted-foreground mb-8">
        League of Legends Client Clone - Em desenvolvimento
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your dashboard content here */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p>View and edit your summoner profile</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Champions</h2>
          <p>Browse your champion collection</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Play</h2>
          <p>Start a new game</p>
        </div>
      </div>
    </main>
  );
}
