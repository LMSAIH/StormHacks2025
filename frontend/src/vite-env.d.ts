/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_ANALYTICS: string
  // Add more environment variables here as you create them
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
