import React from "react";
import { MotionAlertDialogAction } from "../alert-dialog-action";

interface MotionAlertDialogActionWrapperProps {
  onClick: () => void;
}

export function MotionAlertDialogActionWrapper({ onClick }: MotionAlertDialogActionWrapperProps) {
  return (
    <MotionAlertDialogAction
      className="text-white"
      onClick={onClick}
      whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
    >
      Confirmer
    </MotionAlertDialogAction>
  );
}
