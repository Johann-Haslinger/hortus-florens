import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  LeanScopeClient,
  LeanScopeClientApp,
} from "@leanscope/api-client/node";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <LeanScopeClientApp
      leanScopeClient={
        new LeanScopeClient({
          // remote: {
          //   supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
          //   supabaseKey: import.meta.env.VITE_SUPABASE_KEY ?? "",
          //   openAIOrgId: import.meta.env.VITE_OPENAI_ORG_ID ?? "",
          //   openAIApiKey: import.meta.env.VITE_OPENAI_KEY ?? "",
          // },
        })
      }
    >
    <App />
    </LeanScopeClientApp>
  </React.StrictMode>,
)
