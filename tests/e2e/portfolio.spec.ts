import { expect, test, type Page } from "@playwright/test";

const sectionIds = ["home", "about", "toolkit", "projects", "experience", "education", "contact"];

function captureHydrationErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|server rendered|did not match/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  return errors;
}

test("renders every migrated section without hydration errors", async ({ page }) => {
  const hydrationErrors = captureHydrationErrors(page);

  await page.goto("/?motion=full");
  await expect(page.locator("#experience")).toHaveAttribute("data-motion-preference", "full");

  const renderedSections = await page.locator("main > section[id]").evaluateAll((sections) =>
    sections.map((section) => section.id),
  );

  expect(renderedSections).toEqual(sectionIds);
  expect(hydrationErrors).toEqual([]);
});

test("uses the static experience fallback for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experience");

  const experience = page.locator("#experience");
  await expect(experience).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.locator(".experience-stop-callout")).toHaveCount(4);
  await expect(page.locator(".experience-stop-callout").first()).toBeVisible();
  await expect(page.locator(".experience-stop-callout").last()).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);

  expect(await page.locator(".experience-journey-stage").evaluate((stage) => getComputedStyle(stage).position)).toBe("relative");
});

test("contains the complete experience journey on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?motion=reduce#experience");
  await expect(page.locator("#experience")).toHaveAttribute("data-reduced-motion", "true");

  const geometry = await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>("#experience")!;
    const scene = document.querySelector<HTMLElement>(".experience-road-scene")!;
    const track = document.querySelector<HTMLElement>(".experience-road-track")!;
    const sectionRect = section.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const rects = (selector: string) =>
      [...document.querySelectorAll<HTMLElement>(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
      });

    return {
      section: { top: sectionRect.top, bottom: sectionRect.bottom },
      scene: { top: sceneRect.top, right: sceneRect.right, bottom: sceneRect.bottom, left: sceneRect.left, height: sceneRect.height },
      trackHeight: trackRect.height,
      callouts: rects(".experience-stop-callout"),
      pins: rects(".experience-map-pin"),
      hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });

  expect(geometry.hasHorizontalOverflow).toBe(false);
  expect(geometry.scene.height).toBeGreaterThanOrEqual(geometry.trackHeight);

  for (const item of [...geometry.callouts, ...geometry.pins]) {
    expect(item.left).toBeGreaterThanOrEqual(geometry.scene.left);
    expect(item.right).toBeLessThanOrEqual(geometry.scene.right);
    expect(item.top).toBeGreaterThanOrEqual(geometry.section.top);
    expect(item.bottom).toBeLessThanOrEqual(geometry.section.bottom);
  }
});

test("keeps contact constraints and intentional announcements", async ({ page }) => {
  await page.goto("/#contact");

  await expect(page.getByLabel("Name")).toHaveAttribute("minlength", "2");
  await expect(page.getByLabel("Name")).toHaveAttribute("maxlength", "80");
  await expect(page.getByRole("textbox", { name: "Email" })).toHaveAttribute("maxlength", "254");
  await expect(page.getByLabel("Message")).toHaveAttribute("minlength", "10");
  await expect(page.getByLabel("Message")).toHaveAttribute("maxlength", "2000");

  const formState = await page.locator(".contact-form").evaluate((form) => ({
    hasEndpoint: form.getAttribute("action") !== "#contact",
    submitDisabled: form.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled ?? true,
  }));
  expect(formState.submitDisabled).toBe(!formState.hasEndpoint);

  await expect(page.locator(".reactive-avatar[aria-live]")).toHaveCount(0);
  await expect(page.locator(".project-slider-window")).toHaveAttribute("aria-live", "polite");
});

test("preserves the legacy portfolio", async ({ page }) => {
  const response = await page.goto("/legacy/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle("Software Engineer Portfolio");
});
