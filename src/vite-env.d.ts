/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
    readonly VITE_CONVEX_URL: string
    readonly VITE_FACEBOOK_PIXEL_IDS?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
