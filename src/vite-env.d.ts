/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "production" enables Vercel Analytics. Set per environment on Vercel. */
  readonly VITE_ENV?: string;
  /** Web3Forms access key used by the contact form. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
