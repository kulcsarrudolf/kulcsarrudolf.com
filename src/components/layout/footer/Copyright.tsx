import { useTranslation } from "@/i18n/useTranslation";

const Copyright = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-gray-600 dark:text-gray-400">
      {t("footer.copyright", { year: currentYear.toString() })}
    </div>
  );
};

export default Copyright;
