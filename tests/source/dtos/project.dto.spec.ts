import { createProjectSchema, updateProjectSchema } from "../../../packages/source/src/dtos/project.dto";

const user = {
  id: "b8f1f9f4-6c83-4d8f-84ed-5cb2ca0bca11",
  firstName: "Lora",
  lastName: "Seguin",
  email: "lora@example.com",
  password: "hashed-password",
  createdAt: new Date("2026-07-14T12:00:00.000Z"),
};

describe("project dto schemas", () => {
  it("applies defaults for current word count and status", () => {
    const result = createProjectSchema.parse({
      title: "Papyrus",
      description: null,
      genre: "roman",
      author: "Lora",
      language: "fr",
      deadline: "2026-07-14T23:59[Europe/Paris]",
      user,
    });

    expect(result.currentWordCount).toBe(0);
    expect(result.status).toBe("planning");
    expect(result.targetWordCount).toBe(100000);
  });

  it("rejects more than 10 tags", () => {
    const result = createProjectSchema.safeParse({
      title: "Papyrus",
      description: null,
      genre: "roman",
      author: "Lora",
      language: "fr",
      deadline: null,
      tags: Array.from({ length: 11 }, (_, index) => `tag-${index}`),
      user,
    });

    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    const result = updateProjectSchema.parse({
      title: "Nouveau titre",
    });

    expect(result).toEqual({ title: "Nouveau titre" });
  });
});
