import { Action } from "@radix-ui/react-alert-dialog";
import React, { forwardRef, type ComponentRef, type ComponentPropsWithoutRef } from "react";
import { motion } from "motion/react";

import { cn } from "../../../lib/utils";
import { buttonVariants } from "../button";

const alertDialogAction = forwardRef<
  ComponentRef<typeof Action>,
  ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, reference) => (
  <Action
    className={cn(buttonVariants({ variant: "destructive" }), className)}
    ref={reference}
    {...props}
  />
));
alertDialogAction.displayName = Action.displayName;

const motionAlertDialogAction = motion(alertDialogAction);

export {
  alertDialogAction as AlertDialogAction,
  motionAlertDialogAction as MotionAlertDialogAction,
};
