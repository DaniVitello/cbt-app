import { describe, it, expect } from "vitest";
import { buildExportFilename } from "./download";

describe("buildExportFilename", () => {
  it("genera cbt-export-AAAA-MM-DD.json con la fecha dada", () => {
    expect(buildExportFilename(new Date("2026-10-11T03:30:00.000Z"))).toBe("cbt-export-2026-10-11.json");
  });

  it("por defecto usa la fecha actual", () => {
    expect(buildExportFilename()).toMatch(/^cbt-export-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
