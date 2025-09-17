// This file sets default values for Vite env variables at runtime for local testing.
if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
  (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY = "AIzaSyBKF57APna5m5IOBctajRZdtrbDiJYeziw";
}
if (!import.meta.env.AZURE_AI_ENDPOINT) {
  (import.meta.env as any).AZURE_AI_ENDPOINT = "https://daywell-ai.services.ai.azure.com/api/projects/daywell-ai-planner";
}
if (!import.meta.env.AZURE_AI_API_KEY) {
  (import.meta.env as any).AZURE_AI_API_KEY = "Do0xJMw0uoR9CgwByTeO928mnDafiwRXPZG9KS7jx0bKYfaY3ixnJQQJ99BIACYeBjFXJ3w3AAAAACOGPLM3";
}
if (!import.meta.env.AZURE_AI_DEPLOYMENT_NAME) {
  (import.meta.env as any).AZURE_AI_DEPLOYMENT_NAME = "gpt-4.1";
}
if (!import.meta.env.VITE_PREDICTHQ_API_KEY) {
  (import.meta.env as any).VITE_PREDICTHQ_API_KEY = "VXd6jVUcGedyL397rDKPLDFbFfHyFFCXQw8nI61q";
}
