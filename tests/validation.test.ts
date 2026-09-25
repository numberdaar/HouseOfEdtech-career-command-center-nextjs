import { describe, expect, it } from "vitest";
import { opportunitySchema } from "../src/lib/validation";

describe("opportunity validation", () => {
  it("accepts a valid opportunity", () => {
    const result = opportunitySchema.safeParse({
      company: "Acme",
      role: "Software Developer",
      stage: "interview",
      priority: "high",
      jobUrl: "https://example.com/jobs/1"
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid URL", () => {
    const result = opportunitySchema.safeParse({
      company: "Acme",
      role: "Developer",
      stage: "saved",
      priority: "medium",
      jobUrl: "not-a-url"
    });
    expect(result.success).toBe(false);
  });
});