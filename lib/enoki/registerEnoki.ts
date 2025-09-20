import { useEffect } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';

const ENOKI_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const GOOGLE_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_ENOKI_API_KEY as string;


function Register() {
const { client, network } = useSuiClientContext();


useEffect(() => {
// Enoki 네트워크가 아닌 경우(로컬 등)엔 스킵
if (!isEnokiNetwork(network)) return;
if (!ENOKI_PUBLIC_API_KEY) {
console.warn('ENOKI PUBLIC API KEY is missing');
return;
}


const { unregister } = registerEnokiWallets({
apiKey: ENOKI_PUBLIC_API_KEY,
client,
network,
providers: {
google: { clientId: GOOGLE_OAUTH_CLIENT_ID },
// 필요 시 다른 OAuth 공급자 추가 가능
},
});


return unregister;
}, [client, network]);


return null;
}


export const registerEnoki = {
Component: Register,
};