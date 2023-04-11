/// <reference types="vite/client" />

declare interface Window {
  ethereum: import('crossbell.js').utils.CustomProvider
}
