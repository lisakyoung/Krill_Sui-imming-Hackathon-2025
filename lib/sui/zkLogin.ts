import { EnokiFlow } from "@mysten/enoki";
import { jwtDecode } from "jwt-decode";
import { Transaction } from "@mysten/sui/transactions";

const REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/login`
    : "http://localhost:3000/login";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const ENOKI_API_KEY = process.env.NEXT_PUBLIC_ENOKI_API_KEY!;

export class ZkLoginService {
  private enokiFlow: EnokiFlow;

  constructor() {
    if (!ENOKI_API_KEY) {
      throw new Error("NEXT_PUBLIC_ENOKI_API_KEY is not defined in .env.local");
    }
    this.enokiFlow = new EnokiFlow({
      apiKey: ENOKI_API_KEY,
    });
  }

  async beginZkLogin() {
    return this.enokiFlow.createAuthorizationURL({
      provider: "google",
      clientId: GOOGLE_CLIENT_ID,
      redirectUrl: REDIRECT_URI,
      network: "testnet",
    });
  }

  async completeZkLogin() {
    // Enoki SDK handles parsing the URL fragment and getting the user address
    const address = await this.enokiFlow.handleAuthCallback();

    if (!address) {
      // This can happen if the user navigates to /login manually with a hash.
      throw new Error("Failed to handle auth callback from Enoki.");
    }

    // The JWT is stored securely by the SDK, we can retrieve it to get user info
    const session = await this.enokiFlow.getSession();
    if (!session) {
      throw new Error("Failed to get session from Enoki");
    }

    const decodedJWT = jwtDecode(session.jwt!) as any;

    return {
      userAddress: address,
      email: decodedJWT.email,
      name: decodedJWT.name,
      picture: decodedJWT.picture,
    };
  }

}

export default ZkLoginService;
