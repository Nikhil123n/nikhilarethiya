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

test("applies the approved warm paper surface and fine grain", async ({ page }) => {
  await page.goto("/");

  const surface = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body);
    const bodyTextureStyles = getComputedStyle(document.body, "::before");
    const noise = document.querySelector<HTMLElement>(".paper-noise");

    if (!noise) throw new Error("Paper noise overlay is missing");

    const noiseStyles = getComputedStyle(noise);

    return {
      paperBackground: rootStyles.getPropertyValue("--paper-bg").trim().toLowerCase(),
      bodyBackgroundColor: bodyStyles.backgroundColor,
      textureImage: bodyTextureStyles.backgroundImage,
      textureSize: bodyTextureStyles.backgroundSize,
      textureOpacity: Number(bodyTextureStyles.opacity),
      textureBlendMode: bodyTextureStyles.mixBlendMode,
      texturePointerEvents: bodyTextureStyles.pointerEvents,
      noiseAriaHidden: noise.getAttribute("aria-hidden"),
      noisePosition: noiseStyles.position,
      noiseImage: noiseStyles.backgroundImage,
      noiseOpacity: Number(noiseStyles.opacity),
      noisePointerEvents: noiseStyles.pointerEvents,
    };
  });

  expect(surface.paperBackground).toBe("#f8efe3");
  expect(surface.bodyBackgroundColor).toBe("rgb(248, 239, 227)");
  expect(surface.textureImage).toContain("paper-texture.svg");
  expect(surface.textureSize).toBe("280px 280px");
  expect(surface.textureOpacity).toBeGreaterThanOrEqual(0.55);
  expect(surface.textureOpacity).toBeLessThanOrEqual(0.65);
  expect(surface.textureBlendMode).toBe("multiply");
  expect(surface.texturePointerEvents).toBe("none");
  expect(surface.noiseAriaHidden).toBe("true");
  expect(surface.noisePosition).toBe("fixed");
  expect(surface.noiseImage).toContain("radial-gradient");
  expect(surface.noiseOpacity).toBeGreaterThan(0);
  expect(surface.noiseOpacity).toBeLessThanOrEqual(0.2);
  expect(surface.noisePointerEvents).toBe("none");
});

test("uses color-coded pushpins on the intended paper surfaces", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/?motion=reduce");

  const expectedPins = [
    { selector: ".reactive-avatar__pin", color: "red" },
    { selector: ".plan-note__pin", color: "green" },
    { selector: ".certifications-card--toolkit .certifications-card__pin", color: "purple" },
  ];

  for (const { selector, color } of expectedPins) {
    const pin = page.locator(selector);
    await expect(pin).toHaveCount(1);
    await expect(pin).toHaveAttribute("data-pin-color", color);
    await expect(pin).toHaveAttribute("aria-hidden", "true");
    const artifact = pin.locator("img");
    await expect(artifact).toHaveCount(1);
    await expect(artifact).toHaveAttribute("alt", "");
    await expect(artifact).toHaveAttribute("src", /pushpin-sketchbook-red/);
    await expect
      .poll(() => artifact.evaluate((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))
      .toBe(true);
  }

  const pinColorFilters = await page.locator(".pushpin").evaluateAll((pins) =>
    Object.fromEntries(
      pins.map((pin) => [
        pin.getAttribute("data-pin-color"),
        getComputedStyle(pin.querySelector(".pushpin__artifact") as HTMLElement).filter,
      ]),
    ),
  );
  expect(Object.keys(pinColorFilters)).toEqual(expect.arrayContaining(["blue", "red", "green", "purple"]));
  expect(Object.values(pinColorFilters)).not.toContain("none");
  expect(new Set(Object.values(pinColorFilters)).size).toBe(4);

  const pinShadowTreatment = await page.locator(".pushpin").evaluateAll((pins) =>
    pins.map((pin) => {
      const artifact = pin.querySelector<HTMLElement>(".pushpin__artifact");
      if (!artifact) throw new Error("Pushpin artifact is missing");

      const filter = getComputedStyle(artifact).filter;
      return {
        wrapperShadow: getComputedStyle(pin).boxShadow,
        filter,
        dropShadowCount: filter.match(/drop-shadow\(/g)?.length ?? 0,
      };
    }),
  );

  for (const shadow of pinShadowTreatment) {
    expect(shadow.wrapperShadow).toBe("none");
    expect(shadow.filter).toContain("drop-shadow");
    expect(shadow.dropShadowCount).toBeGreaterThanOrEqual(3);
  }

  const paperNotePinPoses = await page
    .locator(".hero .plan-note > .plan-note__pin, .certifications-card--toolkit > .certifications-card__pin")
    .evaluateAll((pins) =>
      pins.map((pin) => {
        const paper = pin.parentElement;
        if (!paper) throw new Error("Pushpin paper surface is missing");

        const pinStyles = getComputedStyle(pin);
        const paperStyles = getComputedStyle(paper);
        const pinMatrix = new DOMMatrixReadOnly(pinStyles.transform);
        const paperMatrix = new DOMMatrixReadOnly(paperStyles.transform);
        const pinAngle = (Math.atan2(pinMatrix.b, pinMatrix.a) * 180) / Math.PI;
        const paperAngle = (Math.atan2(paperMatrix.b, paperMatrix.a) * 180) / Math.PI;

        return {
          color: pin.getAttribute("data-pin-color"),
          leftPercent: (parseFloat(pinStyles.left) / paper.clientWidth) * 100,
          top: parseFloat(pinStyles.top),
          renderedAngle: pinAngle + paperAngle,
        };
      }),
    );

  expect(paperNotePinPoses).toHaveLength(2);
  expect(paperNotePinPoses[0].color).toBe("green");
  expect(paperNotePinPoses[0].leftPercent).toBeCloseTo(48, 0);
  expect(paperNotePinPoses[0].top).toBeCloseTo(-8, 0);
  expect(paperNotePinPoses[0].renderedAngle).toBeCloseTo(8, 1);
  expect(paperNotePinPoses[1].color).toBe("purple");
  expect(paperNotePinPoses[1].leftPercent).toBeCloseTo(52, 0);
  expect(paperNotePinPoses[1].top).toBeCloseTo(-14, 0);
  expect(paperNotePinPoses[1].renderedAngle).toBeCloseTo(-5, 1);

  const scenePinGeometry = await page.locator(".reactive-avatar__pin").evaluate((pin) => {
    const styles = getComputedStyle(pin);
    const matrix = new DOMMatrixReadOnly(styles.transform);
    return {
      width: parseFloat(styles.width),
      height: parseFloat(styles.height),
      angle: styles.getPropertyValue("--pushpin-angle").trim(),
      renderedAngle: (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI,
    };
  });
  expect(scenePinGeometry.width).toBe(28);
  expect(scenePinGeometry.height).toBe(36);
  expect(scenePinGeometry.angle).toBe("8deg");
  expect(scenePinGeometry.renderedAngle).toBeCloseTo(8, 1);

  const projectPins = page.locator(".project-card__pin");
  await expect(projectPins).toHaveCount(3);
  expect(await projectPins.evaluateAll((pins) => pins.map((pin) => pin.getAttribute("data-pin-color")))).toEqual([
    "blue",
    "green",
    "purple",
  ]);

  const projectPinPoses = await projectPins.evaluateAll((pins) =>
    pins.map((pin) => {
      const card = pin.parentElement;
      const styles = getComputedStyle(pin);
      const cardStyles = card ? getComputedStyle(card) : null;
      const pinMatrix = new DOMMatrixReadOnly(styles.transform);
      const cardMatrix = new DOMMatrixReadOnly(cardStyles?.transform ?? "none");
      const pinAngle = (Math.atan2(pinMatrix.b, pinMatrix.a) * 180) / Math.PI;
      const cardAngle = (Math.atan2(cardMatrix.b, cardMatrix.a) * 180) / Math.PI;
      return {
        leftPercent: card ? (parseFloat(styles.left) / card.clientWidth) * 100 : 0,
        top: parseFloat(styles.top),
        renderedAngle: pinAngle + cardAngle,
      };
    }),
  );

  const expectedProjectPinPoses = [
    { leftPercent: 21, top: -43, renderedAngle: -12 },
    { leftPercent: 45, top: -50, renderedAngle: 1 },
    { leftPercent: 42, top: -45, renderedAngle: 11 },
  ];

  projectPinPoses.forEach((pose, index) => {
    const expected = expectedProjectPinPoses[index];
    expect(pose.leftPercent).toBeCloseTo(expected.leftPercent, 0);
    expect(pose.top).toBeCloseTo(expected.top, 0);
    expect(pose.renderedAngle).toBeCloseTo(expected.renderedAngle, 1);
  });

  const pinLayout = await page.locator(".pushpin").evaluateAll((pins) =>
    pins.map((pin) => {
      const styles = getComputedStyle(pin);
      const rect = pin.getBoundingClientRect();
      const artifactRect = pin.querySelector(".pushpin__artifact")?.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        artifactWidth: artifactRect?.width ?? 0,
        artifactHeight: artifactRect?.height ?? 0,
        pointerEvents: styles.pointerEvents,
        position: styles.position,
      };
    }),
  );

  expect(pinLayout.length).toBeGreaterThanOrEqual(6);
  for (const pin of pinLayout) {
    expect(pin.width).toBeGreaterThan(20);
    expect(pin.height).toBeGreaterThan(28);
    expect(pin.artifactWidth).toBeLessThanOrEqual(pin.width + 0.5);
    expect(pin.artifactHeight).toBeLessThanOrEqual(pin.height + 0.5);
    expect(pin.pointerEvents).toBe("none");
    expect(pin.position).toBe("absolute");
  }

  await page.getByRole("button", { name: "Next projects" }).click();
  await expect(page.locator(".project-pager__count")).toHaveText("02 / 02");
  await expect(projectPins).toHaveCount(2);
  expect(await projectPins.evaluateAll((pins) => pins.map((pin) => pin.getAttribute("data-pin-color")))).toEqual([
    "blue",
    "green",
  ]);
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
