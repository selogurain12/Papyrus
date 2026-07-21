/* eslint-disable max-lines */

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import {
  CharacterDto,
  ColorType,
  UpdateCharacterDto,
  updateCharacterSchema,
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
import { useTranslation } from "react-i18next";
import { ColorPicker } from "../../ui/color-picker";
import { Tag } from "../../ui/tag";
import { useOnlineStatus } from "../../../hooks/use-online-status";
import { updateOfflineEntity } from "../../../local-db/offline-entity-store";
import { useEffect, useState } from "react";
import { getAgeOfZonedDate } from "../../../utils/date/date-utils";
import { FileUpload } from "../../ui/file-attachment";
import { clientFile } from "../../../utils/client/client-file";
import { saveLocalAttachment } from "../../../local-db/local-file-store";

interface UpdateCharacterProps {
  onCancel?: () => void;
  character: CharacterDto;
}

// eslint-disable-next-line complexity
export function UpdateCharacter({ onCancel, character }: UpdateCharacterProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { t } = useTranslation(["character/actions/update-character", "common"]);
  const isOnline = useOnlineStatus();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  if (!currentProject) {
    return <div>{t("common:loading")}</div>;
  }
  const form = useForm({
    resolver: zodResolver(updateCharacterSchema),
    defaultValues: {
      role: character.role,
      roleStar: character.roleStar ?? 1,
      firstName: character.firstName,
      lastName: character.lastName,
      nickName: character.nickName,
      pronouns: character.pronouns,
      gender: character.gender ?? "female",
      nationality: character.nationality,
      age: character.age ?? 0,
      birthDate: character.birthDate,
      birthPlace: character.birthPlace,
      residencePlace: character.residencePlace,
      occupation: character.occupation,
      height: character.height ?? 0,
      weight: character.weight ?? 0,
      corpulence: character.corpulence,
      hairColor: character.hairColor,
      eyesColor: character.eyesColor,
      voice: character.voice,
      outfit: character.outfit,
      accessory: character.accessory,
      description: character.description,
      characterQualities: character.characterQualities ?? [],
      characterFlaws: character.characterFlaws ?? [],
      tastes: character.tastes,
      tics: character.tics,
      fears: character.fears,
      education: character.education,
      class: character.class,
      belief: character.belief,
      secrets: character.secrets,
      notablePlaces: character.notablePlaces,
      typicalExpression: character.typicalExpression,
      goals: character.goals,
      past: character.past,
      present: character.present,
      future: character.future,
      notes: character.notes,
      color: character.color ?? "blue",
      avatarLink: character.avatarLink ?? null,
    },
  });
  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();

  const { mutate } = client.character.update.useMutation({
    onSuccess: () => {
      toast.success(t("update.success"));
      void queryClient.invalidateQueries({
        queryKey: ["character.getAll"],
      });
      form.reset();
      setAvatarFile(null);
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

  async function onSubmit(data: UpdateCharacterDto) {
    if (user === null) {
      toast.error(t("common:errors.unauthenticated"));
      return;
    }
    if (currentProject === null) {
      toast.error(t("common:currentProjectMissing"));
      return;
    }

    let avatarLink = data.avatarLink ?? character.avatarLink ?? null;

    if (avatarFile) {
      if (isOnline) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await uploadFile({ body: formData });
        avatarLink = res.body.url;
      } else {
        avatarLink = await saveLocalAttachment(avatarFile);
      }
    }

    const payload = {
      ...data,
      avatarLink,
    };

    if (!isOnline) {
      await updateOfflineEntity<UpdateCharacterDto, CharacterDto>(
        "characters",
        currentProject.id,
        character,
        payload
      );
      toast.success(t("update.success"));
      await queryClient.invalidateQueries({ queryKey: ["character.getAll"] });
      form.reset();
      setAvatarFile(null);
      onCancel?.();
      return;
    }

    mutate({
      body: payload,
      params: { projectId: currentProject.id, id: character.id },
    });
  }

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const birthDate = form.watch("birthDate");

  useEffect(() => {
    if (birthDate !== null && birthDate !== undefined) {
      form.setValue("age", getAgeOfZonedDate(birthDate), {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [birthDate, form]);

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
            <h2 className="text-2xl font-bold text-foreground">{t("update.title")}</h2>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="shrink-0">
              <div
                className={`w-24 h-24 rounded-full ${
                  colorMap[form.watch("color") ?? "blue"]
                } flex items-center justify-center overflow-hidden`}
              >
                {form.watch("avatarLink") ? (
                  <img
                    src={form.watch("avatarLink") ?? ""}
                    alt={t("fields.avatar")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {(form.watch("firstName") ?? "?").charAt(0)}
                  </span>
                )}
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
                          index < (form.watch("roleStar") ?? 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
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

          <div className="mb-6">
            <FileUpload
              label={t("fields.avatar")}
              accept="image/*"
              maxSize={5}
              onFileSelected={(file) => {
                setAvatarFile(file);
                form.setValue(
                  "avatarLink",
                  file ? URL.createObjectURL(file) : (character.avatarLink ?? null)
                );
              }}
            />
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
                          <Input
                            {...field}
                            id="firstName"
                            placeholder={t("placeholders.firstName")}
                          />
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
                          <Input
                            {...field}
                            id="lastName"
                            placeholder={t("placeholders.lastName")}
                          />
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
                          <Input
                            {...field}
                            id="nickName"
                            placeholder={t("placeholders.nickName")}
                          />
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
                          <Input
                            {...field}
                            id="pronouns"
                            placeholder={t("placeholders.pronouns")}
                          />
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
                            placeholder={t("placeholders.nationality")}
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
                            placeholder={t("placeholders.age")}
                            onChange={(event) => {
                              const age = Number(event.target.value) || null;
                              if (birthDate !== null) {
                                form.setValue("birthDate", null, {
                                  shouldValidate: false,
                                  shouldDirty: true,
                                });
                              }
                              field.onChange(age);
                            }}
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
                            placeholder={t("placeholders.birthPlace")}
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
                            placeholder={t("placeholders.residencePlace")}
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
                            placeholder={t("placeholders.occupation")}
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
                            placeholder={t("placeholders.height")}
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
                            placeholder={t("placeholders.weight")}
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
                            placeholder={t("placeholders.corpulence")}
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
                            placeholder={t("placeholders.hairColor")}
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
                            placeholder={t("placeholders.eyesColor")}
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
                            placeholder={t("placeholders.voice")}
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
                            placeholder={t("placeholders.outfit")}
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
                            placeholder={t("placeholders.accessory")}
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
                            placeholder={t("placeholders.description")}
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
                            placeholder={t("placeholders.tastes")}
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
                            placeholder={t("placeholders.tics")}
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
                            placeholder={t("placeholders.fears")}
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
                            placeholder={t("placeholders.typicalExpression")}
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
                            placeholder={t("placeholders.education")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="class">
                          {t("fields.class")} : {field.value}
                        </FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value || null)}
                            id="class"
                            placeholder={t("placeholders.class")}
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
                            placeholder={t("placeholders.belief")}
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
                            placeholder={t("placeholders.secrets")}
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
                            placeholder={t("placeholders.notablePlaces")}
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
                            placeholder={t("placeholders.goals")}
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
                            placeholder={t("placeholders.past")}
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
                            placeholder={t("placeholders.present")}
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
                            placeholder={t("placeholders.future")}
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
                          placeholder={t("placeholders.notes")}
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
              {t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
