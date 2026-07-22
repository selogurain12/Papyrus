import { queryKeys } from "../../packages/source/src/query-client";

describe("query keys", () => {
  it("builds stable keys for routes without parameters", () => {
    expect(queryKeys.authentification.login()).toEqual(["authentification.login"]);
    expect(queryKeys.authentification.register()).toEqual(["authentification.register"]);
  });

  it("builds nested route keys with path parameters", () => {
    expect(queryKeys.project.get({ pathParams: { id: "project-1", userId: "user-1" } })).toEqual([
      "project.get",
      "project-1",
      "user-1",
    ]);
    expect(queryKeys.dashboard.get({ pathParams: { projectId: "project-1" } })).toEqual([
      "dashboard.get",
      "project-1",
    ]);
  });

  it("builds route keys with query filters", () => {
    expect(
      queryKeys.project.getAll({
        pathParams: { userId: "user-1" },
        query: { page: 2, itemsPerPage: 10 },
      })
    ).toEqual(["project.getAll", "user-1", { page: 2, itemsPerPage: 10 }]);
  });
});
