import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";
import { SuiClient } from "@mysten/sui.js/client";
import { jwtDecode } from "jwt-decode";

const REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/login`
    : "http://localhost:3000/login";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export class ZkLoginService {
  private suiClient: SuiClient;
  private currentEpoch: number = 0;

  constructor() {
    this.suiClient = new SuiClient({
      url: process.env.NEXT_PUBLIC_FULLNODE_URL || getFullnodeUrl("testnet"),
    });
  }

  async beginZkLogin() {
    const { epoch } = await this.suiClient.getLatestSuiSystemState();
    this.currentEpoch = Number(epoch);

    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const ephemeralPublicKey = getExtendedEphemeralPublicKey(
      ephemeralKeyPair.getPublicKey()
    );
    const nonce = generateNonce(
      ephemeralPublicKey,
      this.currentEpoch,
      randomness
    );

    // Store in session storage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("randomness", randomness);
      sessionStorage.setItem(
        "ephemeralPrivateKey",
        Buffer.from(ephemeralKeyPair.getSecretKey()).toString("base64")
      );
      sessionStorage.setItem(
        "ephemeralPublicKey",
        ephemeralKeyPair.getPublicKey().toBase64()
      );
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "id_token",
      scope: "openid email profile",
      nonce: nonce,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async completeZkLogin(jwt: string) {
    const decodedJWT = jwtDecode(jwt) as any;
    const iss = decodedJWT.iss;
    const aud = decodedJWT.aud;
    const sub = decodedJWT.sub;

    const salt = await this.getSalt(sub);
    const userAddress = await this.getUserAddress(jwt, salt);

    return {
      userAddress,
      email: decodedJWT.email,
      name: decodedJWT.name,
      picture: decodedJWT.picture,
    };
  }

  private async getSalt(sub: string): Promise<string> {
    // In production, generate and store salt securely
    return Buffer.from(sub).toString("base64").slice(0, 16);
  }

  private async getUserAddress(jwt: string, salt: string): Promise<string> {
    // Simplified version - in production, use Enoki API
    // This is a placeholder address generation
    const randomAddress =
      "0x" +
      Buffer.from(jwt + salt)
        .toString("hex")
        .slice(0, 40);
    return randomAddress;
  }
}

export default ZkLoginService;
