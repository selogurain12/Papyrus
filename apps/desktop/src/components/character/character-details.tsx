/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { Card } from "../ui/card";
import { User } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { CharacterDto } from "@papyrus/source";
import { format } from "../../utils/date/date-utils";
import { parseZonedDateTime } from "@internationalized/date";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";

interface CharacterDetailProps {
  character: CharacterDto | undefined;
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const { t } = useTranslation("character/character-details");
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
    gray: "bg-gray-500",
    orange: "bg-orange-500",
  };

  if (!character) {
    return (
      <Card className="rounded-lg p-6 w-full flex flex-col items-center justify-center text-muted-foreground">
        <User className="w-16 h-16 text-gray-300" />
        <p className="text-md text-gray-600">{t("select.title")}</p>
        <p className="text-sm text-gray-400">{t("select.description")}</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg p-2 w-full">
      {/* HEADER */}
      <div className="flex items-center space-x-4">
        <div
          className={`w-16 h-16 rounded-full ${
            colorMap[character.color ?? "blue"]
          } flex items-center justify-center overflow-hidden`}
        >
          {character.avatarLink ? (
            <img
              src={character.avatarLink}
              alt={`${character.firstName} ${character.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-card-foreground">
            {character.firstName} {character.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("bornSummary", {
              age: character.age ?? t("notSpecified"),
              place: character.birthPlace ?? t("notSpecified"),
            })}
          </p>

          {/* ROLE */}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">{t("role")}</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index < character.roleStar ? "text-yellow-400" : "text-gray-400"}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACCORDIONS */}
      <Accordion type="multiple" className="w-full mt-4">
        {/* ETAT CIVIL */}
        <AccordionItem value="maritalStatus">
          <AccordionTrigger>{t("sections.maritalStatus")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">{t("fields.firstName")} :</span>{" "}
                {character.firstName ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.lastNameShort")} :</span>{" "}
                {character.lastName ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.nickName")} :</span>{" "}
                {character.nickName ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.pronouns")} :</span>{" "}
                {character.pronouns ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.genderDetail")} :</span>{" "}
                <span>
                  {t(`gender.${character.gender ?? "male"}`, {
                    defaultValue: character.gender ?? t("notSpecified"),
                  })}
                </span>
              </p>
              <p>
                <span className="font-semibold">{t("fields.nationality")} :</span>{" "}
                {character.nationality ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.birthDate")} :</span>{" "}
                {character.birthDate
                  ? format(parseZonedDateTime(character.birthDate), "dd MMMM yyyy")
                  : t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.residencePlace")} :</span>{" "}
                {character.residencePlace ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.occupation")} :</span>{" "}
                {character.occupation ?? t("notSpecified")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PHYSIQUE */}
        <AccordionItem value="physical">
          <AccordionTrigger>{t("sections.physical")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">{t("fields.heightShort")} :</span>{" "}
                {character.height ?? t("notSpecified")} cm
              </p>
              <p>
                <span className="font-semibold">{t("fields.weightShort")} :</span>{" "}
                {character.weight ?? t("notSpecified")} kg
              </p>
              <p>
                <span className="font-semibold">{t("fields.corpulence")} :</span>{" "}
                {character.corpulence ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.hairShort")} :</span>{" "}
                {character.hairColor ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.eyesShort")} :</span>{" "}
                {character.eyesColor ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.voice")} :</span>{" "}
                {character.voice ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.outfitShort")} :</span>{" "}
                {character.outfit ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.accessoryShort")} :</span>{" "}
                {character.accessory ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.descriptionShort")} :</span>{" "}
                {character.description ?? t("notSpecified")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CARACTERE */}
        <AccordionItem value="trait">
          <AccordionTrigger>{t("sections.trait")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              <p>
                <span className="font-semibold">{t("fields.characterQualitiesShort")} :</span>{" "}
                {character.characterQualities && character.characterQualities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    {character.characterQualities.map((quality, index) => (
                      <Badge
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                        key={index}
                      >
                        {quality}
                      </Badge>
                    ))}{" "}
                  </div>
                ) : (
                  t("notSpecified")
                )}
              </p>

              <p>
                <span className="font-semibold">{t("fields.characterFlawsShort")} :</span>{" "}
                {character.characterFlaws && character.characterFlaws.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    {character.characterFlaws.map((quality, index) => (
                      <Badge
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
                        key={index}
                      >
                        {quality}
                      </Badge>
                    ))}{" "}
                  </div>
                ) : (
                  t("notSpecified")
                )}
              </p>
              <p>
                <span className="font-semibold">{t("fields.tastes")} :</span>{" "}
                {character.tastes ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.tics")} :</span>{" "}
                {character.tics ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.fearsShort")} :</span>{" "}
                {character.fears ?? t("notSpecified")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PROFIL */}
        <AccordionItem value="profile">
          <AccordionTrigger>{t("sections.profile")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">{t("fields.education")} :</span>{" "}
                {character.education ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.class")} :</span>{" "}
                {character.class ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.beliefShort")} :</span>{" "}
                {character.belief ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.secrets")} :</span>{" "}
                {character.secrets ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.notablePlaces")} :</span>{" "}
                {character.notablePlaces ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.typicalExpressionShort")} :</span>{" "}
                {character.typicalExpression ?? t("notSpecified")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EVOLUTION */}
        <AccordionItem value="development">
          <AccordionTrigger>{t("sections.development")}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              <p>
                <span className="font-semibold">{t("fields.goals")} :</span>{" "}
                {character.goals ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.past")} :</span>{" "}
                {character.past ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.present")} :</span>{" "}
                {character.present ?? t("notSpecified")}
              </p>
              <p>
                <span className="font-semibold">{t("fields.future")} :</span>{" "}
                {character.future ?? t("notSpecified")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* AUTRE */}
        <AccordionItem value="other">
          <AccordionTrigger>{t("sections.other")}</AccordionTrigger>
          <AccordionContent>
            <p>
              <span className="font-semibold">{t("fields.notesShort")} :</span>{" "}
              {character.notes ?? t("notSpecified")}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
