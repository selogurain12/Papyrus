/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { useState } from "react";
import { CharacterDto, UpdateCharacterDto, updateCharacterSchema } from "@papyrus/source";
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

interface UpdateCharacterProps {
  onCancel?: () => void;
  character: CharacterDto;
}

// eslint-disable-next-line complexity
export function UpdateCharacter({ onCancel, character }: UpdateCharacterProps) {
  const user = useAuth();
  const { currentProject } = useProject();
  const navigate = useNavigate();
  if (!currentProject) {
    return <div>Loading...</div>;
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
      richesses: character.richesses ?? 0,
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
    },
  });

  const [qualitiesInput, setQualitiesInput] = useState("");
  const [flawsInput, setFlawsInput] = useState("");

  const handleAddQuality = () => {
    if (qualitiesInput.trim()) {
      const currentQualities = form.getValues("characterQualities") || [];
      form.setValue("characterQualities", [...currentQualities, qualitiesInput.trim()]);
      setQualitiesInput("");
    }
  };

  const handleRemoveQuality = (index: number) => {
    const currentQualities = form.getValues("characterQualities") || [];
    form.setValue(
      "characterQualities",
      currentQualities.filter((_, i) => i !== index)
    );
  };

  const handleAddFlaw = () => {
    if (flawsInput.trim()) {
      const currentFlaws = form.getValues("characterFlaws") || [];
      form.setValue("characterFlaws", [...currentFlaws, flawsInput.trim()]);
      setFlawsInput("");
    }
  };

  const handleRemoveFlaw = (index: number) => {
    const currentFlaws = form.getValues("characterFlaws") || [];
    form.setValue(
      "characterFlaws",
      currentFlaws.filter((_, i) => i !== index)
    );
  };

  const { mutate } = client.character.update.useMutation({
    onSuccess: () => {
      toast.success("Personnage modifié avec succès !");
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
        toast.error("Une erreur est survenue");
      }
    },
  });

  function onSubmit(data: UpdateCharacterDto) {
    if (user === null) {
      toast.error("User is null");
      return;
    }
    if (currentProject === null) {
      toast.error("Current project is null");
      return;
    }
    mutate({
      body: {
        ...data,
      },
      params: { projectId: currentProject.id, id: character.id },
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
            <h2 className="text-2xl font-bold text-foreground">Créer un nouveau personnage</h2>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="flex-shrink-0">
              <div
                className={`w-24 h-24 rounded-full ${
                  colorMap[form.watch("color") ?? "blue"]
                } flex items-center justify-center`}
              >
                <span className="text-white text-4xl font-bold">
                  {(form.watch("firstName") ?? "?").charAt(0)}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3">
                  <FormLabel htmlFor="role" className="font-semibold">
                    Rôle :
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
                          customDisplay={(item: TypeOption) => item.label}
                          customLabel={(item: TypeOption) => (
                            <span className="font-medium">{item.label}</span>
                          )}
                          value={roleOptions.find((role) => role.id === field.value)}
                          onChange={(value) => {
                            field.onChange(value?.id ?? "");
                          }}
                          placeholder="Sélectionner un rôle"
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
              <AccordionTrigger>ÉTAT CIVIL</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="firstName">Prénom</FormLabel>
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
                        <FormLabel htmlFor="lastName">Nom de famille</FormLabel>
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
                        <FormLabel htmlFor="nickName">Surnom</FormLabel>
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
                        <FormLabel htmlFor="pronouns">Pronoms</FormLabel>
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
                        <FormLabel htmlFor="gender">Sexe</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value ?? ""}
                            onValueChange={(value) => field.onChange(value)}
                            className="w-fit flex mt-3"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Femme</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Homme</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Autre</Label>
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
                        <FormLabel htmlFor="nationality">Nationalité</FormLabel>
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
                        <FormLabel htmlFor="age">Âge</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="age"
                            type="number"
                            value={field.value ?? 0}
                            onChange={(event) => field.onChange(event.target.value || null)}
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
                        <FormLabel htmlFor="birthDate">Date de naissance</FormLabel>
                        <FormControl>
                          <DatePicker
                            changeValue={(date) => field.onChange(date ?? null)}
                            disabledRange={undefined}
                            placeholder="Sélectionner une date"
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
                        <FormLabel htmlFor="birthPlace">Lieu de naissance</FormLabel>
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
                        <FormLabel htmlFor="residencePlace">Lieu de résidence</FormLabel>
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
                        <FormLabel htmlFor="occupation">Occupation</FormLabel>
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
              <AccordionTrigger>PHYSIQUE</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="height">Taille (cm)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="height"
                            type="number"
                            value={field.value ?? 0}
                            onChange={(event) => field.onChange(event.target.value || null)}
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
                        <FormLabel htmlFor="weight">Poids (kg)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="weight"
                            type="number"
                            value={field.value ?? 0}
                            onChange={(event) => field.onChange(event.target.value || null)}
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
                        <FormLabel htmlFor="corpulence">Corpulence</FormLabel>
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
                        <FormLabel htmlFor="hairColor">Couleur de cheveux</FormLabel>
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
                        <FormLabel htmlFor="eyesColor">Couleur des yeux</FormLabel>
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
                        <FormLabel htmlFor="voice">Voix</FormLabel>
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
                        <FormLabel htmlFor="outfit">Tenue vestimentaire</FormLabel>
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
                        <FormLabel htmlFor="accessory">Accessoires</FormLabel>
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
                        <FormLabel htmlFor="description">Description générale</FormLabel>
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
              <AccordionTrigger>CARACTÈRE</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="characterQualities"
                    render={() => (
                      <FormItem>
                        <FormLabel>Qualités caractéristiques</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder="Ajouter une qualité..."
                              value={qualitiesInput}
                              onChange={(e) => setQualitiesInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddQuality();
                                }
                              }}
                            />
                            <Button
                              className="border border-gray-300 bg-blue-500 text-white"
                              type="button"
                              onClick={handleAddQuality}
                            >
                              +
                            </Button>
                          </div>
                        </FormControl>
                        <div className="flex flex-wrap gap-2">
                          {(form.watch("characterQualities") || []).map((quality, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                            >
                              {quality}
                              <button
                                type="button"
                                onClick={() => handleRemoveQuality(index)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="characterFlaws"
                    render={() => (
                      <FormItem>
                        <FormLabel>Défauts caractéristiques</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder="Ajouter un défaut..."
                              value={flawsInput}
                              onChange={(e) => setFlawsInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddFlaw();
                                }
                              }}
                            />
                            <Button
                              className="border border-gray-300 bg-red-500 text-white"
                              type="button"
                              onClick={handleAddFlaw}
                            >
                              +
                            </Button>
                          </div>
                        </FormControl>
                        <div className="flex flex-wrap gap-2">
                          {(form.watch("characterFlaws") || []).map((flaw, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
                            >
                              {flaw}
                              <button
                                type="button"
                                onClick={() => handleRemoveFlaw(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tastes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="tastes">Goûts</FormLabel>
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
                        <FormLabel htmlFor="tics">Tics, manies, habitudes et addictions</FormLabel>
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
                        <FormLabel htmlFor="fears">Peurs et doutes</FormLabel>
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
                          Phrases ou expressions typiques
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
              <AccordionTrigger>PROFIL</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="education">Éducation</FormLabel>
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
                        <FormLabel htmlFor="richesses">Richesses : {field.value}</FormLabel>

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
                        <FormLabel htmlFor="belief">Croyances et idéologies</FormLabel>
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
                        <FormLabel htmlFor="secrets">Secrets</FormLabel>
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
                        <FormLabel htmlFor="notablePlaces">Lieux marquants</FormLabel>
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
              <AccordionTrigger>ÉVOLUTION</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="goals">Buts / Objectifs</FormLabel>
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
                        <FormLabel htmlFor="past">Passé</FormLabel>
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
                        <FormLabel htmlFor="present">Présent</FormLabel>
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
                        <FormLabel htmlFor="future">Futur</FormLabel>
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
              <AccordionTrigger>NOTES</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="notes">Notes supplémentaires</FormLabel>
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
                <FormLabel>Couleur d'identification</FormLabel>
                <FormControl>
                  <div className="flex mt-3 gap-3 flex-wrap">
                    {[
                      { value: "blue", label: "Bleu", bg: "bg-blue-500" },
                      { value: "red", label: "Rouge", bg: "bg-red-500" },
                      { value: "green", label: "Vert", bg: "bg-green-500" },
                      { value: "purple", label: "Violet", bg: "bg-purple-500" },
                      { value: "yellow", label: "Jaune", bg: "bg-yellow-500" },
                      { value: "pink", label: "Rose", bg: "bg-pink-500" },
                      { value: "cyan", label: "Cyan", bg: "bg-cyan-500" },
                      { value: "gray", label: "Gris", bg: "bg-gray-500" },
                    ].map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => field.onChange(color.value)}
                        className={`w-8 h-8 rounded-full ${color.bg} transition-transform ${
                          field.value === color.value
                            ? "ring-2 ring-offset-2 ring-foreground scale-110"
                            : "hover:scale-105"
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
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
              Annuler
            </Button>
            <Button type="submit" variant="default">
              Modifier le personnage
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
