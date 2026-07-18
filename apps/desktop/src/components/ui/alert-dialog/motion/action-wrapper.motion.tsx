import React from "react";
import { MotionAlertDialogAction } from "../alert-dialog-action";
import { useTranslation } from "react-i18next";

interface MotionAlertDialogActionWrapperProps {
  onClick: () => void;
}

export function MotionAlertDialogActionWrapper({ onClick }: MotionAlertDialogActionWrapperProps) {
  const { t } = useTranslation();

  return (
    <MotionAlertDialogAction
      className="text-black"
      onClick={onClick}
      whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
    >
      {t("confirm")}
    </MotionAlertDialogAction>
  );
}
