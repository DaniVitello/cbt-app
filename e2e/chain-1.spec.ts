import { test, expect, request as baseRequest } from "@playwright/test";

/**
 * Cadena 1 end-to-end (criterio de aceptación del MVP 1):
 * downward-arrow → core-beliefs-suitcases → disputing-irrational-beliefs,
 * con precarga entre pasos, gate del link (?source= solo tras guardar)
 * y cadena persistida en la API.
 *
 * Corre contra una DB temporal vacía (ver playwright.config.ts).
 */
test("cadena 1 completa con prefill, gate y persistencia", async ({ page }) => {
  const BELIEF = `E2E creencia ${Date.now()}`;

  // Ralentizar los guardados para observar el gate: el link al siguiente
  // ejercicio debe estar deshabilitado MIENTRAS guarda.
  // El glob necesita matchear CON y SIN slash: POST /api/entries y los GET
  // con query no tienen slash tras "entries" (solo PUT/GET-por-id lo tienen).
  // Con "**/api/entries/**" el delay no se aplicaba y el gate era suerte.
  await page.route("**/api/entries*", async (route) => {
    if (route.request().method() === "PUT" || route.request().method() === "POST") {
      await new Promise((r) => setTimeout(r, 2000));
    }
    await route.continue();
  });

  // --- Hop 1: downward-arrow (4 pasos, 1 campo cada uno) ---
  await page.goto("/es/exercises/downward-arrow");
  await expect(page.getByText("Paso 1 de 4")).toBeVisible({ timeout: 120_000 });
  await page.getByRole("textbox", { name: /situación te está generando/ }).fill("E2E situación");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Paso 2 de 4")).toBeVisible();
  await page.getByRole("textbox", { name: /pensamientos acompañan/ }).fill("E2E pensamiento");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Paso 3 de 4")).toBeVisible();
  await page.getByRole("textbox", { name: /significa este pensamiento negativo/ }).first().fill("E2E significado");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Paso 4 de 4")).toBeVisible();
  await page.getByRole("textbox", { name: /sobre vos/ }).fill(BELIEF);
  await page.getByRole("button", { name: "Finalizar" }).click();
  await expect(page.getByText("¡Ejercicio completado!")).toBeVisible();

  // Gate: botón deshabilitado mientras guarda…
  await expect(
    page.getByRole("button", { name: /Creencias fundamentales/ }),
  ).toBeDisabled();
  // …y link con ?source= cuando termina.
  const coreLink = page.getByRole("link", { name: /Creencias fundamentales/ });
  await expect(coreLink).toBeEnabled({ timeout: 30_000 });
  const coreHref = await coreLink.getAttribute("href");
  expect(coreHref).toMatch(/\/es\/exercises\/core-beliefs-suitcases\?source=[0-9a-f-]+/);

  // --- Hop 2: core-beliefs (prefill en el grupo anidado belief-1) ---
  await coreLink.click();
  await expect(page.getByText(/Completamos algunos campos/)).toBeVisible();
  const beliefField = page.getByRole("textbox", { name: "La creencia fundamental" }).first();
  await expect(beliefField).toHaveValue(BELIEF);
  await page.getByRole("button", { name: "Finalizar" }).click();
  await expect(page.getByText("¡Ejercicio completado!")).toBeVisible();

  await expect(page.getByRole("button", { name: /Disputar/ })).toBeDisabled();
  const disputingLink = page.getByRole("link", { name: /Disputar/ });
  await expect(disputingLink).toBeEnabled({ timeout: 30_000 });
  const disputingHref = await disputingLink.getAttribute("href");
  expect(disputingHref).toMatch(/\/es\/exercises\/disputing-irrational-beliefs\?source=[0-9a-f-]+/);

  // --- Hop 3: disputing (prefill en campo top-level) ---
  await disputingLink.click();
  await expect(page.getByText(/Completamos algunos campos/)).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: /creencia irracional/ }),
  ).toHaveValue(BELIEF);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Paso 2 de 2")).toBeVisible();
  await page.getByRole("button", { name: "Finalizar" }).click();
  await expect(page.getByText("¡Ejercicio completado!")).toBeVisible();

  // --- Persistencia: la cadena quedó linkeada en la API ---
  // OJO: la pantalla muestra el cierre ANTES de que el PUT resuelva
  // (visible ≠ persistido). Se espera por los 3 completados, no por tiempo.
  const api = await baseRequest.newContext({ baseURL: "http://localhost:3001" });
  try {
    const IDS = ["downward-arrow", "core-beliefs-suitcases", "disputing-irrational-beliefs"] as const;
    await expect
      .poll(
        async () => {
          const out: Array<string | null> = [];
          for (const ex of IDS) {
            const res = await api.get(`/api/entries?exercise_id=${ex}`);
            const [e] = (await res.json()) as Array<{ status: string }>;
            out.push(e?.status ?? null);
          }
          return out;
        },
        { timeout: 30_000 },
      )
      .toEqual(["completed", "completed", "completed"]);

    const list = async (exerciseId: string) => {
      const res = await api.get(`/api/entries?exercise_id=${exerciseId}`);
      expect(res.ok()).toBe(true);
      return (await res.json()) as Array<{ id: string; source_entry_id: string | null }>;
    };
    const [down] = await list("downward-arrow");
    const [core] = await list("core-beliefs-suitcases");
    const [disputing] = await list("disputing-irrational-beliefs");
    expect(down.source_entry_id).toBeNull();
    expect(core.source_entry_id).toBe(down.id);
    expect(disputing.source_entry_id).toBe(core.id);
  } finally {
    await api.dispose();
  }
});
