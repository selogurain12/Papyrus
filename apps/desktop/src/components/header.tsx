/* eslint-disable max-len */
import { ConnectionStatus } from "./connection-status";
import { AppTourButton } from "./onboarding/app-tour";

interface HeaderProps {
  name: string;
}

export function Header({ name }: HeaderProps) {
  return (
    <div
      className="bg-background h-20 w-full align-items-center flex justify-between border-b border-gray-300"
      data-tour="header"
    >
      <h1 className="text-xl font-bold text-secondary-900 p-6" data-tour="project-title">
        {name}
      </h1>
      <div className="flex items-center gap-3 p-6">
        <AppTourButton />
        <ConnectionStatus />
      </div>
    </div>
  );
}
