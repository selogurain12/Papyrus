import { LogOut } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/auth-provider";
import { useProject } from "../../context/project-provider";
import { loginRoute } from "../../routes/authentification/index.route";
import { Button, type ButtonProps } from "../ui/button";

type LogoutButtonProps = Omit<ButtonProps, "children" | "isLoading" | "onClick"> & {
  showLabel?: boolean;
};

export function LogoutButton({ showLabel = true, ...props }: LogoutButtonProps) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuth();
  const { setCurrentProject } = useProject();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    await clearAuth();
    setCurrentProject(null);
    queryClient.clear();
    void navigate({ to: loginRoute.to });
  };

  return (
    <Button
      type="button"
      aria-label={t("logout")}
      isLoading={isLoggingOut}
      onClick={() => void handleLogout()}
      {...props}
    >
      {!isLoggingOut && <LogOut className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />}
      {showLabel ? t("logout") : null}
    </Button>
  );
}
