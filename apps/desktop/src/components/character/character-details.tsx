/* eslint-disable max-len */
import { Card } from "../ui/card";
import { User } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { CharacterDto } from "@papyrus/source";
import { format } from "../../utils/date/date-utils";
import { parseZonedDateTime } from "@internationalized/date";
import { Badge } from "../ui/badge";

interface CharacterDetailProps {
  character: CharacterDto | undefined;
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const genderMap: Record<string, string> = {
    male: "Homme",
    female: "Femme",
    other: "Autre",
  };

  if (!character) {
    return (
      <Card className="rounded-lg p-6 w-full flex flex-col items-center justify-center text-muted-foreground">
        <User className="w-16 h-16 text-gray-300" />
        <p className="text-md text-gray-600">Sélectionnez un personnage</p>
        <p className="text-sm text-gray-400">
          Choisissez un personnage dans la liste pour voir ses détails
        </p>
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
          } flex items-center justify-center`}
        >
          <User className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-card-foreground">
            {character.firstName} {character.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {character.age} ans, né à {character.birthPlace}
          </p>

          {/* ROLE */}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">Rôle :</p>
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
          <AccordionTrigger>ETAT CIVIL</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">Prénom :</span> {character.firstName}
              </p>
              <p>
                <span className="font-semibold">Nom :</span> {character.lastName}
              </p>
              <p>
                <span className="font-semibold">Surnom :</span> {character.nickName}
              </p>
              <p>
                <span className="font-semibold">Pronoms :</span> {character.pronouns}
              </p>
              <p>
                <span className="font-semibold">Genre :</span>{" "}
                <span>{genderMap[character.gender ?? "male"]}</span>
              </p>
              <p>
                <span className="font-semibold">Nationalité :</span> {character.nationality}
              </p>
              <p>
                <span className="font-semibold">Date de naissance :</span>{" "}
                {character.birthDate
                  ? format(parseZonedDateTime(character.birthDate), "dd MMMM yyyy")
                  : "Non spécifié"}
              </p>
              <p>
                <span className="font-semibold">Lieu de résidence :</span>{" "}
                {character.residencePlace}
              </p>
              <p>
                <span className="font-semibold">Occupation :</span> {character.occupation}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PHYSIQUE */}
        <AccordionItem value="physical">
          <AccordionTrigger>PHYSIQUE</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">Taille :</span> {character.height} cm
              </p>
              <p>
                <span className="font-semibold">Poids :</span> {character.weight} kg
              </p>
              <p>
                <span className="font-semibold">Corpulence :</span> {character.corpulence}
              </p>
              <p>
                <span className="font-semibold">Cheveux :</span> {character.hairColor}
              </p>
              <p>
                <span className="font-semibold">Yeux :</span> {character.eyesColor}
              </p>
              <p>
                <span className="font-semibold">Voix :</span> {character.voice}
              </p>
              <p>
                <span className="font-semibold">Tenue :</span> {character.outfit}
              </p>
              <p>
                <span className="font-semibold">Accessoire :</span> {character.accessory}
              </p>
              <p>
                <span className="font-semibold">Description :</span> {character.description}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CARACTERE */}
        <AccordionItem value="trait">
          <AccordionTrigger>CARACTÈRE</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              <p>
                <span className="font-semibold">Qualités :</span>{" "}
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
                  "Non spécifié"
                )}
              </p>

              <p>
                <span className="font-semibold">Défauts :</span>{" "}
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
                  "Non spécifié"
                )}
              </p>
              <p>
                <span className="font-semibold">Goûts :</span> {character.tastes}
              </p>
              <p>
                <span className="font-semibold">Tics :</span> {character.tics}
              </p>
              <p>
                <span className="font-semibold">Peur(s) :</span> {character.fears}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PROFIL */}
        <AccordionItem value="profile">
          <AccordionTrigger>PROFIL</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">Éducation :</span> {character.education}
              </p>
              <p>
                <span className="font-semibold">Richesses :</span> {character.richesses}
              </p>
              <p>
                <span className="font-semibold">Croyances :</span> {character.belief}
              </p>
              <p>
                <span className="font-semibold">Secrets :</span> {character.secrets}
              </p>
              <p>
                <span className="font-semibold">Lieux notables :</span> {character.notablePlaces}
              </p>
              <p>
                <span className="font-semibold">Expression typique :</span>{" "}
                {character.typicalExpression}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EVOLUTION */}
        <AccordionItem value="development">
          <AccordionTrigger>ÉVOLUTION</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2">
              <p>
                <span className="font-semibold">Objectifs :</span> {character.goals}
              </p>
              <p>
                <span className="font-semibold">Passé :</span> {character.past}
              </p>
              <p>
                <span className="font-semibold">Présent :</span> {character.present}
              </p>
              <p>
                <span className="font-semibold">Futur :</span> {character.future}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* AUTRE */}
        <AccordionItem value="other">
          <AccordionTrigger>AUTRE</AccordionTrigger>
          <AccordionContent>
            <p>
              <span className="font-semibold">Notes :</span> {character.notes}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
