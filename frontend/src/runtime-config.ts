// src/runtime-config.ts

export interface RuntimeConfig {
  VITE_GOOGLE_MAPS_API_KEY: string;
  AZURE_AI_ENDPOINT: string;
  AZURE_AI_API_KEY: string;
  AZURE_AI_DEPLOYMENT_NAME: string;
  VITE_PREDICTHQ_API_KEY: string;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/config.json');
  if (!response.ok) throw new Error('Failed to load runtime config');
  return response.json();
}
