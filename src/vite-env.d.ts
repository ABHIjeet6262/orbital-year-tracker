/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    isElectron: boolean;
    platform: string;
    version: string;
  };
}
