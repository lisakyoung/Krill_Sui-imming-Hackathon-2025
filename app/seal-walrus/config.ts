// Walrus and Seal configuration
export const WALRUS_CONFIG = {
  aggregator:
    process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR ||
    "https://aggregator.walrus-testnet.walrus.space",
  publisher:
    process.env.NEXT_PUBLIC_WALRUS_PUBLISHER ||
    "https://publisher.walrus-testnet.walrus.space",
  epochs: 5,
  blobSize: 100 * 1024 * 1024, // 100MB max
};

export const SEAL_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_SEAL_ENDPOINT || "http://localhost:8080",
  version: "1.0.0",
};

export const SUI_CONFIG = {
  network: process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet",
  rpcUrl: process.env.NEXT_PUBLIC_SUI_RPC || "https://fullnode.testnet.sui.io",
  packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || "0x...",
};
