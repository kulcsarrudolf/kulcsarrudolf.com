import { Suspense } from "react";
import ContactPage from "@/pages/ContactPage";

const Contact = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
};

export default Contact;
