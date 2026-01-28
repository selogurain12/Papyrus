/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Dispatch, SetStateAction } from "react";
import { DialogContent } from "../ui/dialogs/dialog-content";
import { DialogHeader } from "../ui/dialogs/dialog-header";
import { DialogTitle } from "../ui/dialogs/dialog-title";
import { Form } from "../ui/forms/form";
import { FormField } from "../ui/forms/form-field-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../context/auth-provider";
import { FormItem } from "../ui/forms/form-item";
import { FormLabel } from "../ui/forms/form-label";
import { FormControl } from "../ui/forms/form-control";
import { Input } from "../ui/input";
import { FormMessage } from "../ui/forms/form-message";
import { Textarea } from "../ui/textarea";
import { genre, languageOptions, TypeOption } from "../../utils/value-for-select";
import { SingleSelector } from "../ui/single-select";
import { BookOpen, Target } from "lucide-react";
import { DatePicker } from "../ui/date-picker";
import { CreateProjectDto, createProjectSchema } from "@papyrus/source";
import { Button } from "../ui/button";

interface CreateProjectFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateProjectForm({ setOpen }: CreateProjectFormProps) {
  const { user } = useAuth();
  if (user === null) {
    toast.error("Utilisateur non connecté");
    return null;
  }
  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      currentWordCount: 0,
      status: "planning",
      user,
    },
  });
  const { mutate } = client.project.create.useMutation({
    onSuccess: () => {
      toast.success("Projet créé avec succès");
      void queryClient.invalidateQueries({
        queryKey: ["project.list"],
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    },
  });
  function onSubmit(data: CreateProjectDto) {
    if (user === null) {
      toast.error("User is null");
      return;
    }
    mutate({
      body: {
        ...data,
      },
      params: { userId: user.id },
    });
  }

  return (
    <DialogContent
      className="overscroll-none sm:max-w-[800px] sm:max-h-[80%] bg-white p-8 overflow-y-scroll max-h-4/5"
      onInteractOutside={(event) => {
        event.preventDefault();
        setOpen(false);
        form.reset();
      }}
      onClose={() => {
        setOpen(false);
        form.reset();
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl">Créer un projet</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          onReset={() => form.reset}
          onSubmit={(event) => {
            const theReturnedFunction = form.handleSubmit(onSubmit);
            void theReturnedFunction(event);
          }}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              {" "}
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Informations du projet
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="title">Titre du projet</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      className="border border-gray-300 rounded-md p-2"
                      placeholder="Titre du projet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="description">Description du projet</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Description du projet"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="genre">Genre du projet</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={genre.find((genr) => genr.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder="Sélectionner un genre"
                      data={genre}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="author">Auteur du projet</FormLabel>
                  <FormControl>
                    <Input
                      id="author"
                      placeholder="Auteur du projet"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* --- Colonne 2 : Objectifs et paramètres --- */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Objectifs et paramètres
            </h2>

            <FormField
              control={form.control}
              name="targetWordCount"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="targetWordCount">Nombre de mots cible</FormLabel>
                  <FormControl>
                    <Input
                      id="targetWordCount"
                      placeholder="Nombre de mots cible"
                      {...field}
                      type="number"
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="language">Langue du projet</FormLabel>
                  <FormControl>
                    <SingleSelector<TypeOption>
                      {...field}
                      customDisplay={(item: TypeOption) => item.label}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{item.label}</span>
                      )}
                      value={languageOptions.find((lang) => lang.id === field.value)}
                      onChange={(value) => {
                        field.onChange(value?.id ?? "");
                      }}
                      placeholder="Sélectionner une langue"
                      data={languageOptions}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="mb-2 font-normal" htmlFor="deadline">
                    Deadline du projet
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      changeValue={field.onChange}
                      disabledRange={undefined}
                      placeholder="Séléctionner une date"
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <div>
                  {field.value?.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}

                  <Input
                    placeholder="Ajouter un tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        if (newTag) {
                          field.onChange([...(field.value ?? []), newTag]);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
              )}
            />
          </div>
        </form>
      </Form>
      <Button
        onClick={() => {
          form.handleSubmit(onSubmit)();
        }}
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Créer le projet
      </Button>
    </DialogContent>
  );
}
