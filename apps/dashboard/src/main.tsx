import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProviderWrapper } from '@turbo-with-tailwind-v4/auth'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.MODE === 'development' ? (
      <ClerkProviderWrapper>
        <App />
      </ClerkProviderWrapper>
    ) : (
      <App />
    )}
  </StrictMode>,
)
