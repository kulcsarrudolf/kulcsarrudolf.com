import { useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

const Copyright = () => {
  const { t } = useTranslation();
  // Read once, in the initializer: reading the clock is impure, so it stays
  // out of the render itself.
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <div className="text-gray-600 dark:text-gray-400">
      {t("footer.copyright", { year: currentYear.toString() })}
    </div>
  );
};

export default Copyright;
