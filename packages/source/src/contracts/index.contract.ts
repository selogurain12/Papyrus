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
import { exportContract } from "./export.contract";
import { dashboardContract } from "./dashboard.contract";
import { goalContract } from "./goal.contract";
import { historyContract } from "./history.contract";

const contract = initContract();

type PapyrusContract = {
  authentification: typeof authContract;
  chapter: typeof chapterContract;
  character: typeof characterContract;
  dashboard: typeof dashboardContract;
  event: typeof eventContract;
  export: typeof exportContract;
  goal: typeof goalContract;
  history: typeof historyContract;
  mindmap: typeof mindmapContract;
  note: typeof noteContract;
  object: typeof objectContract;
  part: typeof partContract;
  place: typeof placeContract;
  project: typeof projectContract;
  relationship: typeof relationshipContract;
  research: typeof researchContract;
  s3: typeof s3Contract;
  setting: typeof settingContract;
  structure: typeof structureContract;
  user: typeof userContract;
};

export const papyrusContract: PapyrusContract = contract.router({
  authentification: authContract,
  chapter: chapterContract,
  character: characterContract,
  dashboard: dashboardContract,
  event: eventContract,
  export: exportContract,
  goal: goalContract,
  history: historyContract,
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
