import { initContract } from "@ts-rest/core";
import { authContract } from "./auth.contract";
import { chapterContract } from "./chapter.contract";
import { characterContract } from "./character.contract";
import { eventContract } from "./event.contract";
import { mindmapContract } from "./mindmap.contract";
import { noteContract } from "./note.contract";
import { objectContract } from "./object.contract";
import { partContract } from "./part.contract";
import { placeContract } from "./place.contract";
import { projectContract } from "./project.contract";
import { relationshipContract } from "./relationship.contract";
import { researchContract } from "./research.contract";
import { settingContract } from "./setting.contract";
import { userContract } from "./user.contract";
import { s3Contract } from "./s3.contract";
import { structureContract } from "./structure.contract";

const contract = initContract();
export const papyrusContract = contract.router({
  authentification: authContract,
  chapter: chapterContract,
  character: characterContract,
  event: eventContract,
  mindmap: mindmapContract,
  note: noteContract,
  object: objectContract,
  part: partContract,
  place: placeContract,
  project: projectContract,
  relationship: relationshipContract,
  research: researchContract,
  s3: s3Contract,
  setting: settingContract,
  structure: structureContract,
  user: userContract,
});
