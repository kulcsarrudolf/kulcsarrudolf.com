import type { ReactNode } from "react";

/** Shared by the inputs and the message textarea, so they focus alike. */
export const FIELD_CONTROL =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-hidden transition-all";

interface FormFieldProps {
  /** Doubles as the control's `name`, so the payload keys match the labels. */
  id: string;
  label: ReactNode;
  type?: string;
  required?: boolean;
  placeholder?: string;
  /** Set on the fields that may be left empty, e.g. "(optional)". */
  optionalNote?: ReactNode;
}

/** A labelled single-line input. The textarea is laid out on its own. */
const FormField = ({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  optionalNote,
}: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {optionalNote ? (
        <>
          {" "}
          <span className="text-gray-500 font-normal">({optionalNote})</span>
        </>
      ) : null}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      required={required}
      className={FIELD_CONTROL}
      placeholder={placeholder}
    />
  </div>
);

export default FormField;
