import React from "react";
import { Loader2 } from "lucide-react";
import { MotionAlertDialogAction } from "../alert-dialog-action";
import { useTranslation } from "react-i18next";

interface MotionAlertDialogActionWrapperProps {
  isLoading?: boolean;
  onClick: () => void;
}

export function MotionAlertDialogActionWrapper({
  isLoading = false,
  onClick,
}: MotionAlertDialogActionWrapperProps) {
  const { t } = useTranslation();

  return (
    <MotionAlertDialogAction
      className="text-black"
      disabled={isLoading}
      onClick={onClick}
      whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t("confirm")}
    </MotionAlertDialogAction>
  );
}
