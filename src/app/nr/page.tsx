import type { Metadata } from "next";
import WeddingCountdown from "@/components/nr/WeddingCountdown";

export const metadata: Metadata = {
  title: "Rudolf és Nóra",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const NrPage = () => {
  return <WeddingCountdown />;
};

export default NrPage;
