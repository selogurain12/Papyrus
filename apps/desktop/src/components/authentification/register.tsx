/* eslint-disable max-len */
import { BookOpen } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { loginRoute } from "../../routes/authentification/index.route";
import { useForm } from "react-hook-form";
import { RegisterDto, registerSchema } from "@papyrus/source";
import { Form } from "../ui/forms/form";
import { FormField } from "../ui/forms/form-field-context";
import { FormItem } from "../ui/forms/form-item";
import { FormLabel } from "../ui/forms/form-label";
import { FormControl } from "../ui/forms/form-control";
import { Input } from "../ui/input";
import { FormMessage } from "../ui/forms/form-message";
import { client } from "../../utils/client/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { indexRoute } from "../../routes/index.routes";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../context/auth-provider";
import { useTranslation } from "react-i18next";

export function Register() {
  const { t } = useTranslation("authentification/register");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuth();
  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });
  const { mutate } = client.authentification.register.useMutation({
    onSuccess: async ({ body }) => {
      toast.success(t("registerSuccess"));
      void queryClient.invalidateQueries({
        queryKey: ["auth.register"],
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

  function onSubmit(data: RegisterDto) {
    mutate({ body: data });
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-6 text-center items-center justify-items-center">
        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-secondary-900">{t("welcome")}</h1>
        <p className="text-secondary-500">{t("subtitle")}</p>
      </div>
      <Card className="w-96 p-5">
        <h2 className="text-2xl font-bold mb-4 text-center">{t("title")}</h2>
        <Form {...form}>
          <form onReset={() => form.reset()}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="frenchName">
                    {t("firstName")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("firstNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="lastName">
                    Nom de famille
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de famille" {...field} />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="email">
                    {t("lastName")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("lastNamePlaceholder")} {...field} />
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
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("emailPlaceholder")} type="password" {...field} />
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("submit")}
        </Button>
        <div className="text-center">
          {t("alreadyAccount")}{" "}
          <a
            onClick={() => navigate({ to: loginRoute.to })}
            className="text-blue-500 hover:underline"
          >
            {t("login")}
          </a>
        </div>
      </Card>
    </div>
  );
}
