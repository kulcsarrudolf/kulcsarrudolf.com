import type { ReactNode } from "react";

interface NoteProps {
  children: ReactNode;
}

/** Small muted print for a parting aside, rather than body copy. */
const Note = ({ children }: NoteProps) => <p className="text-gray-600 text-sm">{children}</p>;

export default Note;
