import { GoalService } from "../../../../apps/apii/src/modules/goals/goal.service";
import type { GoalEntity } from "../../../../apps/apii/src/modules/goals/goal.entity";

describe("GoalService", () => {
  const service = Object.create(GoalService.prototype) as GoalService;

  it("syncs progress from a baseline instead of total project value", () => {
    const goal = {
      current: 0,
      currentBaseline: 1000,
      goals: 500,
      isOpen: true,
      status: "warning",
    } as GoalEntity;

    service.syncGoalWithCurrentValue(goal, 1250);

    expect(goal.current).toBe(250);
    expect(goal.isOpen).toBe(true);
    expect(goal.status).toBe("warning");
  });

  it("closes the goal when progress reaches the target", () => {
    const goal = {
      current: 0,
      currentBaseline: 1000,
      goals: 500,
      isOpen: true,
      status: "urgent",
    } as GoalEntity;

    service.syncGoalWithCurrentValue(goal, 1500);

    expect(goal.current).toBe(500);
    expect(goal.isOpen).toBe(false);
    expect(goal.status).toBeNull();
  });

  it("never sets a negative current value", () => {
    const goal = {
      current: 0,
      currentBaseline: 1000,
      goals: 500,
      isOpen: true,
      status: null,
    } as GoalEntity;

    service.syncGoalWithCurrentValue(goal, 900);

    expect(goal.current).toBe(0);
  });
});
