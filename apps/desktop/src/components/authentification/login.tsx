/* eslint-disable max-len */
import { ArrowLeft, BookOpen } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { registerRoute } from "../../routes/authentification/index.route";
import { useQueryClient } from "@tanstack/react-query";
import { LoginDto, loginSchema } from "@papyrus/source";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "../../utils/client/client";
import { indexRoute } from "../../routes/index.routes";
import { toast } from "sonner";
import { isFetchError } from "@ts-rest/react-query/v5";
import { Form } from "../ui/forms/form";
import { FormField } from "../ui/forms/form-field-context";
import { FormItem } from "../ui/forms/form-item";
import { FormLabel } from "../ui/forms/form-label";
import { FormControl } from "../ui/forms/form-control";
import { Input } from "../ui/input";
import { FormMessage } from "../ui/forms/form-message";
import { useAuth } from "../../context/auth-provider";
import { useTranslation } from "react-i18next";

export function Login() {
  const { t } = useTranslation("authentification/login");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuth();
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending } = client.authentification.login.useMutation({
    onSuccess: async ({ body }) => {
      toast.success(t("loginSuccess"));
      void queryClient.invalidateQueries({
        queryKey: ["auth.login"],
      });
      void setToken(body.token);
      void setUser(body.user);
      navigate({ to: indexRoute.to });
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("error"));
      }
    },
  });

  function onSubmit(data: LoginDto) {
    mutate({ body: data });
  }

  function handleBack() {
    void navigate({ to: indexRoute.to });
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-8 text-center items-center justify-items-center">
        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-secondary-900">{t("welcome")}</h1>
        <p className="text-secondary-500">{t("subtitle")}</p>
      </div>
      <Card className="w-96 p-6">
        <Button
          type="button"
          variant="ghost"
          className="mb-4 px-0 text-secondary-600 hover:text-secondary-900"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
        <h2 className="text-2xl font-bold mb-4 text-center">{t("title")}</h2>
        <Form {...form}>
          <form onReset={() => form.reset()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="email">
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input id="email" placeholder={t("emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="password">
                    {t("password")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder={t("passwordPlaceholder")}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button
          onClick={() => {
            form.handleSubmit(onSubmit)();
          }}
          type="submit"
          isLoading={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("submit")}
        </Button>
        <div className="text-center">
          {t("noAccount")}{" "}
          <a
            onClick={() => navigate({ to: registerRoute.to })}
            className="text-blue-500 hover:underline"
          >
            {t("register")}
          </a>
        </div>
      </Card>
    </div>
  );
}
