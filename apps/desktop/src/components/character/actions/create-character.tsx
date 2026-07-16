/* eslint-disable max-lines */
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import {
  CharacterDto,
  ColorType,
  CreateCharacterDto,
  createCharacterSchema,
} from "@papyrus/source";
import { SingleSelector } from "../../ui/single-select";
import { FormField } from "../../ui/forms/form-field-context";
import { TypeOption, roleOptions } from "../../../utils/value-for-select";
import { FormControl } from "../../ui/forms/form-control";
import { FormItem } from "../../ui/forms/form-item";
import { FormMessage } from "../../ui/forms/form-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/forms/form";
import { client } from "../../../utils/client/client";
import { toast } from "sonner";
import { queryClient } from "../../../context/query-client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useAuth } from "../../../context/auth-provider";
import { useProject } from "../../../context/project-provider";
import { DatePicker } from "../../ui/date-picker";
import { FormLabel } from "../../ui/forms/form-label";
import { characterRoute } from "../../../routes/character/index.route";
import { useNavigate } from "@tanstack/react-router";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { createOfflineEntity } from "../../../local-db/offline-entity-store";
import { ColorPicker } from "../../ui/color-picker";
import { Tag } from "../../ui/tag";

interface CreateCharacterProps {
  onCancel?: () => void;
  // eslint-disable-next-line no-unused-vars
  onCreated?: (character: CharacterDto) => void;
}

export function CreateCharacter({ onCancel, onCreated }: CreateCharacterProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { t } = useTranslation(["character/actions/create-character", "common"]);
  if (!currentProject) {
    return <div>{t("common:loading")}</div>;
  }
  const form = useForm({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      role: "secondary character",
      roleStar: 1,
      firstName: "",
      lastName: "",
      nickName: "",
      pronouns: "",
      gender: "female",
      nationality: null,
      age: 0,
      birthDate: null,
      birthPlace: null,
      residencePlace: null,
      occupation: null,
      height: 0,
      weight: 0,
      corpulence: null,
      hairColor: null,
      eyesColor: null,
      voice: null,
      outfit: null,
      accessory: null,
      description: null,
      characterQualities: [],
      characterFlaws: [],
      tastes: null,
      tics: null,
      fears: null,
      education: null,
      richesses: 0,
      belief: null,
      secrets: null,
      notablePlaces: null,
      typicalExpression: null,
      goals: null,
      past: null,
      present: null,
      future: null,
      notes: null,
      color: "blue",
      project: currentProject,
    },
  });

  const { mutate } = client.character.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.success"));
      void queryClient.invalidateQueries({
        queryKey: ["character.getAll"],
      });
      form.reset();
      onCancel?.();
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("common:errors.generic"));
      }
    },
  });

  function onSubmit(data: CreateCharacterDto) {
    if (user === null) {
      toast.error(t("common:errors.unauthenticated"));
      return;
    }
    if (currentProject === null) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }

    if (!isOnline) {
      void createOfflineEntity<CreateCharacterDto, CharacterDto>(
        "characters",
        currentProject.id,
        data
      )
        .then((character) => {
          toast.success(t("create.offlineSuccess"));
          onCreated?.(character);
          form.reset();
          onCancel?.();
        })
        .catch((error: unknown) => {
          console.error("Offline character creation failed", error);
          toast.error(t("common:error"));
        });
      return;
    }

    mutate({
      body: {
        ...data,
      },
      params: { projectId: currentProject.id },
    });
  }

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  return (
    <Card className="rounded-lg w-full h-full flex flex-col">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="flex flex-col flex-1 overflow-y-auto p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t("create.title")}</h2>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="shrink-0">
              <div
                className={`w-24 h-24 rounded-full ${
                  colorMap[form.watch("color") ?? "blue"]
                } flex items-center justify-center`}
              >
                <span className="text-white text-4xl font-bold">
                  {form.watch("firstName").charAt(0) || "?"}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3">
                  <FormLabel htmlFor="role" className="font-semibold">
                    {t("role")}
                  </FormLabel>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => form.setValue("roleStar", index + 1)}
                        className={`text-xl ${
                          index < form.watch("roleStar") ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start mt-2">
                      <FormControl>
                        <SingleSelector
                          {...field}
                          customDisplay={(item: TypeOption) => t(`roles.${item.id}`)}
                          customLabel={(item: TypeOption) => (
                            <span className="font-medium">{t(`roles.${item.id}`)}</span>
                          )}
                          value={roleOptions.find((role) => role.id === field.value)}
                          onChange={(value) => {
                            field.onChange(value?.id ?? "");
                          }}
                          placeholder={t("placeholders.role")}
                          data={roleOptions}
                        />
                      </FormControl>
                      <FormMessage className="mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ACCORDIONS */}
          <Accordion type="multiple" className="w-full">
            {/* ETAT CIVIL */}
            <AccordionItem value="maritalStatus">
              <AccordionTrigger>{t("sections.maritalStatus")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="firstName">{t("fields.firstName")}</FormLabel>
                        <FormControl>
                          <Input {...field} id="firstName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="lastName">{t("fields.lastName")}</FormLabel>
                        <FormControl>
                          <Input {...field} id="lastName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nickName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="nickName">{t("fields.nickName")}</FormLabel>
                        <FormControl>
                          <Input {...field} id="nickName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pronouns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="pronouns">{t("fields.pronouns")}</FormLabel>
                        <FormControl>
                          <Input {...field} id="pronouns" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="gender">{t("fields.gender")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value)}
                            className="w-fit flex mt-3"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">{t("gender.female")}</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">{t("gender.male")}</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">{t("gender.other")}</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="nationality">{t("fields.nationality")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="nationality"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="age">{t("fields.age")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="age"
                            type="number"
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(Number(event.target.value) || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="birthDate">{t("fields.birthDate")}</FormLabel>
                        <FormControl>
                          <DatePicker
                            changeValue={(date) => field.onChange(date ?? null)}
                            disabledRange={undefined}
                            placeholder={t("placeholders.date")}
                            value={field.value ?? undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="birthPlace">{t("fields.birthPlace")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="birthPlace"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="residencePlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="residencePlace">{t("fields.residencePlace")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="residencePlace"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="occupation">{t("fields.occupation")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="occupation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PHYSIQUE */}
            <AccordionItem value="physical">
              <AccordionTrigger>{t("sections.physical")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="height">{t("fields.height")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="height"
                            type="number"
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(Number(event.target.value) || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="weight">{t("fields.weight")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="weight"
                            type="number"
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(Number(event.target.value) || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="corpulence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="corpulence">{t("fields.corpulence")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="corpulence"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hairColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="hairColor">{t("fields.hairColor")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="hairColor"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eyesColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="eyesColor">{t("fields.eyesColor")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="eyesColor"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="voice">{t("fields.voice")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="voice"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outfit"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="outfit">{t("fields.outfit")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="outfit"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessory"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="accessory">{t("fields.accessory")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="accessory"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="description">{t("fields.description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="description"
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* CARACTÈRE */}
            <AccordionItem value="character">
              <AccordionTrigger>{t("sections.trait")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="characterQualities"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t("fields.characterQualities")}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 mb-2">
                            <Tag
                              value={form.watch("characterQualities")}
                              onChange={(tags) => form.setValue("characterQualities", tags)}
                              placeholder={t("placeholders.quality")}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="characterFlaws"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t("fields.characterFlaws")}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 mb-2">
                            <Tag
                              value={form.watch("characterFlaws")}
                              onChange={(tags) => form.setValue("characterFlaws", tags)}
                              placeholder={t("placeholders.flaw")}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tastes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="tastes">{t("fields.tastes")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="tastes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="tics">{t("fields.tics")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="tics"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fears">{t("fields.fears")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="fears"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="typicalExpression"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="typicalExpression">
                          {t("fields.typicalExpression")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="typicalExpression"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PROFIL */}
            <AccordionItem value="profile">
              <AccordionTrigger>{t("sections.profile")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="education">{t("fields.education")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="education"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="richesses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="richesses">
                          {t("fields.richesses")} : {field.value}
                        </FormLabel>

                        <FormControl>
                          <Slider
                            value={[field.value ?? 0]}
                            max={100}
                            step={1}
                            className="w-full mt-3"
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="belief"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="belief">{t("fields.belief")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="belief"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secrets"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="secrets">{t("fields.secrets")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="secrets"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notablePlaces"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel htmlFor="notablePlaces">{t("fields.notablePlaces")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="notablePlaces"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ÉVOLUTION */}
            <AccordionItem value="evolution">
              <AccordionTrigger>{t("sections.development")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="goals">{t("fields.goals")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="goals"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="past"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="past">{t("fields.past")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="past"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="present"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="present">{t("fields.present")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="present"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="future"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="future">{t("fields.future")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="future"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* NOTES */}
            <AccordionItem value="notes">
              <AccordionTrigger>{t("sections.notes")}</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="notes">{t("fields.notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value || null)}
                          id="notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* COLOR SELECTOR */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="my-6">
                <FormLabel>{t("fields.color")}</FormLabel>
                <FormControl>
                  <ColorPicker
                    className="mt-3"
                    value={field.value as ColorType | null | undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                if (onCancel) {
                  onCancel();
                } else {
                  void navigate({ to: characterRoute.to, params: { name: "new" } });
                }
              }}
            >
              {t("common:cancel")}
            </Button>
            <Button type="submit" variant="blue">
              {t("create.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
