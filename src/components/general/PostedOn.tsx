import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

type PostedOnProps = {
  date: string;
};
export const PostedOn = ({ date }: PostedOnProps) => {
  // Format date for datetime attribute (ISO 8601)
  const dateObj = new Date(date);
  const isoDate = dateObj.toISOString();

  return (
    <p className="text-sm">
      <FontAwesomeIcon
        icon={faCalendarAlt}
        style={{ color: "#4267B2" }}
        className="mr-1 text-sm"
        aria-hidden="true"
      />
      Posted on:{` `}
      <time
        dateTime={isoDate}
        className="italic font-bold"
        style={{ color: "#4267b2" }}
        itemProp="datePublished"
      >
        {date}
      </time>
    </p>
  );
};

export default PostedOn;
