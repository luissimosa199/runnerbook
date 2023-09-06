import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { useMemo } from 'react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const queryClient = useMemo(() => new QueryClient(), []);

  return (<SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
    </QueryClientProvider>
  </SessionProvider>)
}
