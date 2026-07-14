/* istanbul ignore file */

export const createGoalSchema = {};
export const updateGoalSchema = {};

export const queryKeys = {
  dashboard: {
    get: (value: unknown) => value,
  },
  chapter: {
    getAll: (value: unknown) => value,
  },
  export: {
    docx: (value: unknown) => value,
    epub: (value: unknown) => value,
    pdf: (value: unknown) => value,
    txt: (value: unknown) => value,
  },
  goal: {
    getAll: (value: unknown) => value,
  },
  history: {
    getAll: (value: unknown) => value,
  },
  mindmap: {
    getAll: (value: unknown) => value,
  },
  part: {
    getAll: (value: unknown) => value,
  },
  setting: {
    get: (value: unknown) => value,
  },
  structure: {
    get: (value: unknown) => value,
  },
};

export const updateStructureSchema = {};
