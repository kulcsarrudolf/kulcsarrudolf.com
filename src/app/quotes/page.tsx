import { Suspense } from "react";
import QuotesPage from "@/pages/QuotesPage";

const Quotes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotesPage />
    </Suspense>
  );
};

export default Quotes;
