import type { ReactNode } from "react";

interface ContactCalloutProps {
  children: ReactNode;
}

/**
 * The centred line above the "or" divider on /contact, pointing at LinkedIn
 * before the form is offered as the second way to get in touch.
 */
const ContactCallout = ({ children }: ContactCalloutProps) => (
  <div className="text-center my-6">
    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{children}</p>
  </div>
);

export default ContactCallout;
