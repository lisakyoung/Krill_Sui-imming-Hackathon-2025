"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";
import { useEffect } from 'react'
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';


const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <RegisterEnokiWallets />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

function RegisterEnokiWallets() {
	const { client, network } = useSuiClientContext();
 
	useEffect(() => {
		if (!isEnokiNetwork(network)) return;
 
		const { unregister } = registerEnokiWallets({
			apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
			providers: {
				// Provide the client IDs for each of the auth providers you want to use:
				google: {
					clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
				},
			},
			client,
			network,
		});
 
		return unregister;
	}, [client, network]);
 
	return null;
}