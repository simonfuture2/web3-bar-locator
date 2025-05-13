import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Magic } from "magic-sdk";
import { Web3Storage } from "web3.storage";
import "@solana/wallet-adapter-react-ui/styles.css";

const magic = new Magic("pk_live_99E473DEB1F02C46");
const web3StorageClient = new Web3Storage({ token: "z6Mkj49U5XQVcQyXkHbcnHC3ku9ZoD5LQXEHH5K1xehkUViq" });

export default function BarListingApp() {
  const [bars, setBars] = useState([
    {
      name: "Electric Avenue",
      vibe: 8.5,
      music: "Hip-Hop / Top 40",
      genderRatio: "60% Women / 40% Men",
      specials: "Ladies Night Thursdays - Free drinks until 10PM",
      clip: "https://video-cdn.com/sampleclip1.mp4"
    },
    {
      name: "Neon Jungle",
      vibe: 7.9,
      music: "Afrobeats / Dancehall",
      genderRatio: "50% Women / 50% Men",
      specials: "Happy Hour 6-9PM Daily",
      clip: "https://video-cdn.com/sampleclip2.mp4"
    }
  ]);

  const [user, setUser] = useState(null);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  const handleLoginEmail = async () => {
    const email = prompt("Enter your email to log in:");
    if (email) {
      await magic.auth.loginWithMagicLink({ email });
      const userMetadata = await magic.user.getMetadata();
      setUser(userMetadata);
      alert("Logged in with Magic Link as " + userMetadata.email);
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">✨ Discover the Vibe</h1>
              <div className="space-x-4">
                <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 text-white" />
                <Button onClick={handleLoginEmail} className="bg-blue-600 hover:bg-blue-700 text-white">Login with Email</Button>
              </div>
            </div>
            {user && (
              <div className="mb-4 text-green-400 font-semibold">Welcome, {user.email}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bars.map((bar, index) => (
                <Card key={index} className="rounded-2xl shadow-xl border-none bg-gradient-to-br from-gray-800 to-gray-700 hover:scale-105 transition-transform">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-purple-300">{bar.name}</h2>
                    <p className="text-sm"><strong>🎶 Music:</strong> {bar.music}</p>
                    <p className="text-sm"><strong>🔥 Vibe Meter:</strong> <span className="text-yellow-400">{bar.vibe}/10</span></p>
                    <p className="text-sm"><strong>👥 Ratio:</strong> {bar.genderRatio}</p>
                    <p className="text-sm"><strong>🍹 Specials:</strong> <span className="text-green-300">{bar.specials}</span></p>
                    <video className="w-full rounded-xl border border-purple-500" controls>
                      <source src={bar.clip} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function BarOwnerDashboard() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a video file.");
    setStatus("Uploading to IPFS...");
    const cid = await web3StorageClient.put([file]);
    setStatus(`Uploaded! IPFS CID: ${cid}`);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-6">🍸 Bar Owner Dashboard</h2>
      <form onSubmit={handleUpload} className="max-w-2xl mx-auto space-y-4">
        <Input placeholder="Bar Name" className="bg-gray-700 text-white" />
        <Input placeholder="Music Genre" className="bg-gray-700 text-white" />
        <Input placeholder="Vibe Meter (1-10)" className="bg-gray-700 text-white" />
        <Input placeholder="Gender Ratio (e.g., 60% Women / 40% Men)" className="bg-gray-700 text-white" />
        <Textarea placeholder="Specials (e.g., Happy Hour, Ladies Night)" className="bg-gray-700 text-white" />
        <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} className="bg-gray-700 text-white" />
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">Upload Bar Info</Button>
        {status && <p className="text-green-400 mt-2">{status}</p>}
      </form>
    </div>
  );
}

// Full component code injected from the canvas (already shown above)
// For this example, we will assume it's stored as Web3BarLocator.jsx
