import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './MainRoutes.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = '427408818914-2fs6vg5tselbmp2l5b4jk0ojl6p5ud39.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <MainRoutes />
    </GoogleOAuthProvider>
  </StrictMode>
)
