/// <reference types="vite/client" />

declare interface Window {
  ethereum: import('eip1193-types').MetaMaskProvider
}
