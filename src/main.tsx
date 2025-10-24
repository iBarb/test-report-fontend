import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import AppRouter from './router/AppRouter'
import { Provider } from 'react-redux'
import { store } from './redux/store/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

        {/* Toaster */}
        <Toaster
          position='top-right'
          richColors
          visibleToasts={5}
        />

        {/* App Router */}
        <AppRouter />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
