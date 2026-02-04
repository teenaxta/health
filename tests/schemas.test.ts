import { describe, it, expect } from "vitest";
import { WeightSchema, LabTestSchema } from "@/lib/types";

describe("zod schemas", () => {
  it("validates weight entries", () => {
    const parsed = WeightSchema.parse({
      entry_date: "2024-10-01",
      value: 70.5,
      unit: "kg"
    });
    expect(parsed.value).toBe(70.5);
  });

  it("allows text-only lab tests", () => {
    const parsed = LabTestSchema.parse({
      entry_date: "2024-10-01",
      test_name: "CBC",
      value: null,
      unit: null,
      result_text: "All values within normal limits"
    });
    expect(parsed.test_name).toBe("CBC");
  });
});
