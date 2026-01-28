/* eslint-disable max-len */
import { BookOpen } from "lucide-react";
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

export function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuth();
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate } = client.authentification.login.useMutation({
    onSuccess: async ({ body }) => {
      toast.success("Vous êtes connecté");
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
        toast.error("Une erreur est survenue");
      }
    },
  });

  function onSubmit(data: LoginDto) {
    mutate({ body: data });
  }
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="mb-8 text-center items-center justify-items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-secondary-900">Bienvenue sur Papyrus</h1>
        <p className="text-secondary-500">Connectez-vous pour continuer</p>
      </div>
      <Card className="w-96 p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
        <Form {...form}>
          <form onReset={() => form.reset()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="email">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Mot de passe" type="password" {...field} />
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
          Se connecter
        </Button>
        <div className="text-center">
          Pas encore de compte ?{" "}
          <a
            onClick={() => navigate({ to: registerRoute.to })}
            className="text-blue-500 hover:underline"
          >
            S'inscrire
          </a>
        </div>
      </Card>
    </div>
  );
}
