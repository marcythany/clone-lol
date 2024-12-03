'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from 'react-error-boundary'
import type { ProvidersProps } from '@/types/i18n'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Algo deu errado
        </h1>
        <p className="text-gray-400">
          {error.message}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-[#C89B3C] hover:bg-[#A17A2D] text-black px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
