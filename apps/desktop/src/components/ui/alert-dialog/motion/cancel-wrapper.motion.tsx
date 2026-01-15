import React from "react";
import { MotionAlertDialogCancel } from "../alert-dialog-cancel";

interface MotionAlertDialogCancelWrapperProps {
  onClick: () => void;
}

export function MotionAlertDialogCancelWrapper({ onClick }: MotionAlertDialogCancelWrapperProps) {
  return (
    <MotionAlertDialogCancel
      onClick={onClick}
      whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
    >
      Annuler
    </MotionAlertDialogCancel>
  );
}
