import { EnokiClient } from '@mysten/enoki';

export const enoki = new EnokiClient({
  apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!, // Portal에서 받은 Public API Key
});
