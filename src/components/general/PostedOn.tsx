import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

type PostedOnProps = {
  date: string;
};
export const PostedOn = ({ date }: PostedOnProps) => {
  return (
    <p className="text-sm">
      <FontAwesomeIcon
        icon={faCalendarAlt}
        style={{ color: "#4267B2" }}
        className="mr-1 text-sm"
      />
      Posted on:{` `}
      <span className="italic font-bold" style={{ color: "#4267b2" }}>
        {date}
      </span>
    </p>
  );
};

export default PostedOn;
