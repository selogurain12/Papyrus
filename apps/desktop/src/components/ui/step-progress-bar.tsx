import { Button } from "./button";
import { DialogTitle } from "./dialogs/dialog-title";
import { DialogHeader } from "./dialogs/dialog-header";
import { DialogDescription } from "./dialogs/dialog-description";
import { Progress } from "./progress";
import { DialogClose } from "./dialogs/dialog";
import React from "react";

interface StepProgressBarProps {
  stepsComponents: React.ReactNode[];
  stepsTitles: string[];
  currentStep: number;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  resetAll: () => void;
}

export function StepProgressBar({
  stepsComponents,
  stepsTitles,
  currentStep,
  goToPreviousStep,
  goToNextStep,
  resetAll,
}: StepProgressBarProps) {
  const totalSteps = stepsComponents.length;

  function handleNextStep(event: React.MouseEvent<HTMLButtonElement>) {
    if (currentStep === totalSteps - 1) {
      return;
    }
    event.preventDefault();
    goToNextStep();
  }

  function handlePreviousStep() {
    goToPreviousStep();
  }

  const progressBarWidth = (currentStep / totalSteps) * 100;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{stepsTitles[currentStep - 1]}</DialogTitle>
        <DialogDescription>
          <Progress value={progressBarWidth} />
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-4">{stepsComponents[currentStep - 1]}</div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            disabled={currentStep === 1 || currentStep === totalSteps}
            onClick={handlePreviousStep}
            type="button"
            variant="ghost"
          >
            Précédemment
          </Button>
          {currentStep === totalSteps ? (
            <DialogClose>
              <Button onClick={resetAll}>Terminer</Button>
            </DialogClose>
          ) : (
            <Button
              onClick={handleNextStep}
              type={currentStep === totalSteps - 1 ? "submit" : "button"}
            >
              {currentStep === totalSteps - 1 ? "Valider" : "Suivant"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
