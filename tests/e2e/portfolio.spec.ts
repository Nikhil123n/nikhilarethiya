import { expect, test, type Page } from "@playwright/test";

const sectionIds = ["home", "about", "toolkit", "projects", "experience", "education", "contact"];

const experienceEntries = [
  {
    id: "nic",
    date: "Jan 2023 – Jun 2024",
    role: "Software Developer",
    company: "National Informatics Centre",
    impact:
      "Modernized a 12-year-old Java platform supporting 708 districts and millions of citizens.",
    tags: ["Java", "JSP", "Oracle", "Spring", "Linux"],
  },
  {
    id: "sndl",
    date: "Mar 2025 - May 2025",
    role: "Backend Software Engineer",
    company: "System Neural Development Lab",
    impact:
      "Automated terabyte-scale neural data processing with Django, Celery, Redis, and containerized node orchestration.",
    tags: ["Django", "Celery", "Redis", "Docker", "Kubernetes"],
    takeaway: "Reliable pipelines start with boring, observable foundations.",
    metric: { value: "TB-scale", label: "neural data processing" },
  },
  {
    id: "un",
    date: "May 2025 - Aug 2025",
    role: "Data Research Intern",
    company: "United Nations",
    impact:
      "Validated 100K+ records through Python ETL and audits that reduced manual processing overhead.",
    tags: ["Python", "ETL", "Data QA", "Research"],
    takeaway: "Data quality is product quality when decisions depend on it.",
    metric: { value: "100K+", label: "records validated" },
  },
  {
    id: "hive",
    date: "May 2025 - Dec 2025",
    role: "Software Engineer",
    company: "HIVE Labs",
    impact:
      "Built Spark ingestion and real-time dashboard workflows for participant-scale glucose prediction research.",
    tags: ["Spark", "Vue.js", "AWS EKS", "pytest", "ML"],
    takeaway: "Research tools still need production-grade ergonomics.",
    metric: { value: "Real-time", label: "research dashboard workflows" },
  },
] as const;

async function waitForExperienceHydration(page: Page, preference: "full" | "reduce" | "system") {
  const experience = page.locator("#experience");

  await expect(experience).toHaveAttribute("data-motion-preference", preference);
  await expect(experience.locator(".experience-stop-callout")).toHaveCount(experienceEntries.length);
  await expect(experience).toHaveAttribute("data-hydrated", "true");

  return experience;
}

async function scrollExperienceTo(page: Page, progress: number) {
  await page.locator("#experience").evaluate((section, requestedProgress) => {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;
    const pinSpacer = section.querySelector<HTMLElement>(":scope .pin-spacer");
    const storyHeight = pinSpacer?.getBoundingClientRect().height ?? sectionRect.height;
    const scrollDistance = Math.max(1, storyHeight - window.innerHeight);

    window.scrollTo({
      top: sectionTop + scrollDistance * requestedProgress,
      behavior: "auto",
    });
  }, progress);
}

function captureHydrationErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|server rendered|did not match/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  return errors;
}

const finalStatValues = ["2+", "10+", "5+", "1000+", "24/7"];
const zeroStatValues = ["0+", "0+", "0+", "0+", "0/7"];

async function statValues(page: Page) {
  return page.locator("#about .stat-card strong").evaluateAll((values) =>
    values.map((value) => value.textContent?.trim() ?? ""),
  );
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

test("animates the portfolio stats once when they enter the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const stats = page.locator("#about .stat-card");
  await expect(stats).toHaveCount(5);
  await expect.poll(() => statValues(page)).toEqual(zeroStatValues);

  const cardGeometryBefore = await stats.evaluateAll((cards) =>
    cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect.poll(() => statValues(page), { timeout: 3_000 }).toEqual(finalStatValues);
  await expect(page.locator("#about")).toHaveAttribute("data-count-state", "complete");

  const cardGeometryAfter = await stats.evaluateAll((cards) =>
    cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );

  cardGeometryAfter.forEach((card, index) => {
    expect(card.width).toBeCloseTo(cardGeometryBefore[index].width, 0);
    expect(card.height).toBeCloseTo(cardGeometryBefore[index].height, 0);
  });

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  expect(await statValues(page)).toEqual(finalStatValues);
  await expect(page.locator("#about")).toHaveAttribute("data-count-state", "complete");
});

test("replays the portfolio stats every 30 seconds and waits when offscreen", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.clock.install({ time: new Date("2026-08-09T12:00:00") });
  await page.goto("/");

  const about = page.locator("#about");
  await expect.poll(() => statValues(page)).toEqual(zeroStatValues);
  await about.scrollIntoViewIfNeeded();
  await page.clock.runFor(2_400);

  await expect.poll(() => statValues(page)).toEqual(finalStatValues);
  await expect(about).toHaveAttribute("data-count-state", "complete");
  await expect(about).toHaveAttribute("data-count-cycle", "0");

  await page.clock.fastForward(29_000);
  expect(await statValues(page)).toEqual(finalStatValues);
  await expect(about).toHaveAttribute("data-count-cycle", "0");

  await page.clock.fastForward(1_000);
  await expect(about).toHaveAttribute("data-count-cycle", "1");
  await expect(about).toHaveAttribute("data-count-state", "counting");

  await page.clock.runFor(2_400);
  await expect.poll(() => statValues(page)).toEqual(finalStatValues);
  await expect(about).toHaveAttribute("data-count-state", "complete");

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.clock.fastForward(30_000);

  await expect(about).toHaveAttribute("data-count-cycle", "2");
  await expect(about).toHaveAttribute("data-count-state", "idle");
  await expect.poll(() => statValues(page)).toEqual(zeroStatValues);

  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveAttribute("data-count-state", "counting");
  await page.clock.runFor(2_400);
  await expect.poll(() => statValues(page)).toEqual(finalStatValues);
  await expect(about).toHaveAttribute("data-count-state", "complete");
});

test("counts the portfolio stats without spatial movement for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const about = page.locator("#about");
  await expect(about.locator(".stat-card")).toHaveCount(5);
  await expect.poll(() => statValues(page)).toEqual(zeroStatValues);
  await expect(about).toHaveAttribute("data-count-state", "idle");

  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveAttribute("data-count-state", "counting");

  const cardContentMotion = await about.locator(".stat-card__content").evaluateAll((cards) =>
    cards.map((card) => {
      const styles = getComputedStyle(card);
      return { opacity: styles.opacity, transform: styles.transform };
    }),
  );

  expect(cardContentMotion).toEqual(
    Array.from({ length: 5 }, () => ({ opacity: "1", transform: "none" })),
  );
  await expect.poll(() => statValues(page), { timeout: 3_000 }).toEqual(finalStatValues);
  await expect(about).toHaveAttribute("data-count-state", "complete");
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

test.describe("Living Systems Road", () => {
  test("defaults to the system motion preference when no override is supplied", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#experience");

    const experience = await waitForExperienceHydration(page, "system");
    const toggle = experience.locator(".experience-motion-toggle");

    await expect(experience).toHaveAttribute("data-reduced-motion", "true");
    await expect(toggle).toHaveText(/Experience Motion:\s*Reduced/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAttribute("aria-label", /Experience motion is reduced/i);
    await expect(experience).toHaveAttribute("data-layout", "natural");
    await expect(experience.locator(".pin-spacer")).toHaveCount(0);
  });

  test("inherits the shared paper surface without an extra section background", async ({ page }) => {
    await page.goto("/?motion=reduce#experience");
    const experience = await waitForExperienceHydration(page, "reduce");

    const surfaces = await experience.evaluate((section) => {
      const stage = section.querySelector<HTMLElement>(".experience-journey-stage");
      const roadScene = section.querySelector<HTMLElement>(".experience-road-scene");
      const storyCard = section.querySelector<HTMLElement>(".experience-story-card");

      if (!stage || !roadScene || !storyCard) throw new Error("Experience surfaces are missing");

      const sectionStyles = getComputedStyle(section);
      const stageStyles = getComputedStyle(stage);
      const roadStyles = getComputedStyle(roadScene);
      const cardStyles = getComputedStyle(storyCard);

      return {
        sectionBackgroundColor: sectionStyles.backgroundColor,
        sectionBackgroundImage: sectionStyles.backgroundImage,
        stageBackgroundColor: stageStyles.backgroundColor,
        stageBackgroundImage: stageStyles.backgroundImage,
        roadBackgroundImage: roadStyles.backgroundImage,
        cardBackgroundImage: cardStyles.backgroundImage,
      };
    });

    expect(surfaces.sectionBackgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(surfaces.sectionBackgroundImage).toBe("none");
    expect(surfaces.stageBackgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(surfaces.stageBackgroundImage).toBe("none");
    expect(surfaces.roadBackgroundImage).toContain("radial-gradient");
    expect(surfaces.cardBackgroundImage).not.toBe("none");
  });

  test("matches the Education heading font treatment", async ({ page }) => {
    await page.goto("/?motion=reduce#experience");

    const headingTypography = await page.evaluate(() => {
      const experienceHeading = document.querySelector<HTMLElement>("#experience-title");
      const educationHeading = document.querySelector<HTMLElement>("#education-title");

      if (!experienceHeading || !educationHeading) throw new Error("Section headings are missing");

      const experienceStyles = getComputedStyle(experienceHeading);
      const educationStyles = getComputedStyle(educationHeading);

      return {
        experienceFamily: experienceStyles.fontFamily,
        experienceWeight: experienceStyles.fontWeight,
        educationFamily: educationStyles.fontFamily,
        educationWeight: educationStyles.fontWeight,
      };
    });

    expect(headingTypography.experienceFamily).toBe(headingTypography.educationFamily);
    expect(headingTypography.experienceWeight).toBe(headingTypography.educationWeight);
  });

  test("renders the complete evidence for every experience chapter", async ({ page }) => {
    await page.goto("/?motion=reduce#experience");
    const experience = await waitForExperienceHydration(page, "reduce");

    for (const entry of experienceEntries) {
      const chapter = experience.locator(
        `.experience-stop-callout[data-experience-id="${entry.id}"]`,
      );

      await expect(chapter).toHaveCount(1);
      await expect(chapter.getByText(entry.date, { exact: true })).toBeVisible();
      await expect(chapter.getByText(entry.company, { exact: true })).toBeVisible();
      await expect(chapter.getByText(entry.role, { exact: true })).toBeVisible();
      await expect(chapter.locator(".experience-impact")).toHaveText(entry.impact);
      const tags = chapter.locator(".experience-tags");
      await expect(tags).toHaveCount(1);
      for (const tag of entry.tags) {
        await expect(tags.getByText(tag, { exact: true })).toBeVisible();
      }
      if ("takeaway" in entry && "metric" in entry) {
        await expect(chapter.locator(".experience-takeaway")).toHaveText(entry.takeaway);
        await expect(chapter.locator(".experience-story-metric strong")).toHaveText(entry.metric.value);
        await expect(chapter.locator(".experience-story-metric span")).toHaveText(entry.metric.label);
      }
    }
  });

  test("renders the NIC-only reference card without changing the generic chapters", async ({ page }) => {
    await page.goto("/?motion=reduce#experience");
    const experience = await waitForExperienceHydration(page, "reduce");
    const nic = experience.locator(
      'article[data-experience-id="nic"].experience-story-card--nic',
    );

    await expect(nic).toHaveCount(1);
    await expect(nic.locator(".experience-nic-card__main")).toHaveCount(1);
    await expect(
      nic.getByRole("heading", { name: "National Informatics Centre", exact: true }),
    ).toBeVisible();
    await expect(nic.getByText("Software Developer", { exact: true })).toBeVisible();
    await expect(nic.locator(".experience-nic-date")).toHaveText("Jan 2023 – Jun 2024");

    const description = nic.locator(".experience-impact");
    await expect(description).toHaveText(
      "Modernized a 12-year-old Java platform supporting 708 districts and millions of citizens.",
    );
    const highlightedDistricts = description.locator(".experience-impact-highlight");
    await expect(highlightedDistricts).toHaveText("708 districts");
    await expect(highlightedDistricts).toBeVisible();

    await expect(nic.locator(".experience-tags .experience-tag")).toHaveText([
      "Java",
      "JSP",
      "Oracle",
      "Spring",
      "Linux",
    ]);

    const pin = nic.locator(".experience-nic-card__pin");
    await expect(pin).toHaveCount(1);
    await expect(pin).toHaveAttribute("data-pin-color", "red");
    const pinImage = pin.locator("img");
    await expect(pinImage).toHaveCount(1);
    const pinSource = await pinImage.getAttribute("src");
    expect(decodeURIComponent(pinSource ?? "")).toContain("/assets/pushpin-sketchbook-red.png");

    const keyImpact = nic.locator(".experience-nic-key-impact");
    await expect(keyImpact).toHaveCount(1);
    await expect(keyImpact.locator(".experience-nic-key-impact__title")).toHaveText("KEY IMPACT");
    await expect(keyImpact.locator(".experience-nic-key-impact__list > li")).toHaveText([
      "708 districts served",
      "~8s → ~4s latency",
      "22 official languages",
      "63% fewer complaints",
      "5 zero-fail releases",
    ]);

    const colorTokens = await nic.evaluate((card) => {
      const styles = getComputedStyle(card);

      return {
        cardPaper: styles.getPropertyValue("--experience-nic-card-paper").trim(),
        cardInk: styles.getPropertyValue("--experience-nic-card-ink").trim(),
        cardBorder: styles.getPropertyValue("--experience-nic-card-border").trim(),
        cardShadow: styles.getPropertyValue("--experience-nic-card-shadow").trim(),
        accent: styles.getPropertyValue("--experience-nic-accent").trim().toLowerCase(),
        notePaper: styles.getPropertyValue("--experience-nic-note-paper").trim().toLowerCase(),
        noteRule: styles.getPropertyValue("--experience-nic-note-rule").trim(),
        tagPaper: styles.getPropertyValue("--experience-nic-tag-paper").trim(),
      };
    });

    for (const value of Object.values(colorTokens)) {
      expect(value).not.toBe("");
    }
    expect(colorTokens.accent).toBe("#e12a1e");
    expect(colorTokens.notePaper).toBe("#f6d982");
    await expect(
      nic.locator(".experience-story-metric, .experience-story-diagram, .experience-takeaway"),
    ).toHaveCount(0);

    for (const entry of experienceEntries.slice(1)) {
      if (!("takeaway" in entry)) throw new Error("Generic experience evidence is missing");

      const chapter = experience.locator(
        `article[data-experience-id="${entry.id}"]`,
      );

      await expect(chapter).not.toHaveClass(/(?:^|\s)experience-story-card--nic(?:\s|$)/);
      await expect(
        chapter.locator(
          ".experience-nic-card__main, .experience-nic-card__pin, .experience-nic-date, .experience-impact-highlight, .experience-nic-key-impact, .experience-nic-key-impact__title, .experience-nic-key-impact__list",
        ),
      ).toHaveCount(0);
      await expect(
        chapter.locator(".experience-story-card-head > .experience-story-diagram"),
      ).toHaveCount(1);
      await expect(chapter.locator(".experience-takeaway")).toHaveText(entry.takeaway);
    }
  });

  test("keeps every full-motion chapter in the semantic tree before scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?motion=full");
    const experience = await waitForExperienceHydration(page, "full");

    await expect(experience.getByRole("article")).toHaveCount(experienceEntries.length);

    const semanticStates = await experience.locator(".experience-stop-callout").evaluateAll((chapters) =>
      chapters.map((chapter) => {
        const styles = getComputedStyle(chapter);
        return {
          hidden: (chapter as HTMLElement).hidden,
          ariaHidden: chapter.getAttribute("aria-hidden"),
          display: styles.display,
          visibility: styles.visibility,
        };
      }),
    );

    for (const state of semanticStates) {
      expect(state.hidden).toBe(false);
      expect(state.ariaHidden).not.toBe("true");
      expect(state.display).not.toBe("none");
      expect(state.visibility).not.toBe("hidden");
    }
  });

  for (const viewport of [
    { width: 1200, height: 900, layout: "pinned" },
    { width: 1440, height: 900, layout: "pinned" },
    { width: 1920, height: 1080, layout: "pinned" },
    { width: 900, height: 800, layout: "natural" },
    { width: 390, height: 844, layout: "natural" },
  ]) {
    test(`aligns the experience intro text block with the hero intro at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/?motion=full");
      const experience = await waitForExperienceHydration(page, "full");
      const heroIntro = page.locator(".hero-copy");

      await expect.poll(() => experience.getAttribute("data-layout"), { timeout: 3_000 }).toBe(viewport.layout);
      await expect.poll(() => heroIntro.evaluate((intro) => getComputedStyle(intro).transform)).toBe("none");

      const alignment = await page.evaluate(() => {
        const heroIntro = document.querySelector<HTMLElement>(".hero-copy");
        const experienceIntro = document.querySelector<HTMLElement>(".experience-journey-heading");

        if (!heroIntro || !experienceIntro) throw new Error("Intro containers are missing");

        const heroRect = heroIntro.getBoundingClientRect();
        const experienceRect = experienceIntro.getBoundingClientRect();

        return {
          heroLeft: heroRect.left,
          experienceLeft: experienceRect.left,
          delta: Math.abs(experienceRect.left - heroRect.left),
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });

      expect(alignment.delta, JSON.stringify(alignment)).toBeLessThanOrEqual(2);
      expect(alignment.hasHorizontalOverflow).toBe(false);
    });
  }

  test("reveals one continuous road without a ghost, fork, or future stations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?motion=full#experience");
    const experience = await waitForExperienceHydration(page, "full");

    await expect.poll(() => experience.getAttribute("data-layout"), { timeout: 3_000 }).toBe("pinned");
    await expect(experience.locator(".experience-road image.experience-road-artifact")).toHaveCount(1);
    await expect(experience.locator(".experience-road-artifact--ghost")).toHaveCount(0);
    const roadRevealWindow = experience.locator(".experience-road-reveal-window");
    await expect(roadRevealWindow).toHaveCount(1);
    await expect(roadRevealWindow).toHaveAttribute("fill", "white");
    await expect(experience.locator(".experience-road-reveal-mask")).toHaveCount(0);
    await expect(
      experience.locator(
        ".experience-road-centerline, .experience-road-branch, .experience-road-branch-shadow, .experience-route-fork-note",
      ),
    ).toHaveCount(0);
    await expect(experience.getByText(/Parallel work/i)).toHaveCount(0);

    const revealFraction = () =>
      roadRevealWindow.evaluate((window) => {
        const height = Number.parseFloat(window.getAttribute("height") ?? "-1");
        return Math.max(0, Math.min(1, height / 1600));
      });

    await scrollExperienceTo(page, 0);
    await expect.poll(revealFraction, { timeout: 3_000 }).toBeLessThanOrEqual(0.03);

    const openingStationOpacity = await experience.locator(".experience-route-station").evaluateAll((stations) =>
      stations.map((station) => Number.parseFloat(getComputedStyle(station).opacity)),
    );
    expect(openingStationOpacity).toHaveLength(experienceEntries.length);
    expect(openingStationOpacity[0]).toBeGreaterThanOrEqual(0.95);
    for (const futureStationOpacity of openingStationOpacity.slice(1)) {
      expect(futureStationOpacity).toBeLessThanOrEqual(0.02);
    }

    await scrollExperienceTo(page, 0.5);
    await expect.poll(revealFraction, { timeout: 3_000 }).toBeGreaterThan(0.25);
    expect(await revealFraction()).toBeLessThan(0.75);

    await scrollExperienceTo(page, 0.97);
    await expect.poll(revealFraction, { timeout: 3_000 }).toBeGreaterThanOrEqual(0.98);
  });

  test("pins once on large desktop and advances through four chapters into synthesis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?motion=full#experience");
    const experience = await waitForExperienceHydration(page, "full");

    await expect(experience).toHaveAttribute("data-layout", "pinned");
    await expect(experience.locator(".pin-spacer")).toHaveCount(1);

    await expect
      .poll(() =>
        experience
          .locator('.experience-stop-callout[data-active="true"]')
          .evaluateAll((chapters) => chapters.map((chapter) => chapter.getAttribute("data-experience-id"))),
      )
      .toEqual(["nic"]);
    await expect(experience.locator('.experience-stop-callout[data-experience-id="nic"]')).toBeVisible();

    const checkpoints = [
      { progress: 0.16, id: "nic" },
      { progress: 0.38, id: "sndl" },
      { progress: 0.6, id: "un" },
      { progress: 0.82, id: "hive" },
    ] as const;

    for (const checkpoint of checkpoints) {
      await scrollExperienceTo(page, checkpoint.progress);
      await expect
        .poll(
          () =>
            experience
              .locator('.experience-stop-callout[data-active="true"]')
              .evaluateAll((chapters) => chapters.map((chapter) => chapter.getAttribute("data-experience-id"))),
          { timeout: 3_000 },
        )
        .toEqual([checkpoint.id]);

      const activeGeometry = await experience.evaluate((section, activeId) => {
        const stage = section.querySelector<HTMLElement>(".experience-journey-stage")!;
        const activeCard = section.querySelector<HTMLElement>(
          `.experience-stop-callout[data-experience-id="${activeId}"]`,
        )!;
        const stageRect = stage.getBoundingClientRect();
        const cardRect = activeCard.getBoundingClientRect();

        return {
          stageTop: stageRect.top,
          stageBottom: stageRect.bottom,
          cardTop: cardRect.top,
          cardBottom: cardRect.bottom,
        };
      }, checkpoint.id);

      expect(activeGeometry.cardTop).toBeGreaterThanOrEqual(activeGeometry.stageTop - 1);
      expect(activeGeometry.cardBottom).toBeLessThanOrEqual(activeGeometry.stageBottom + 1);
    }

    await scrollExperienceTo(page, 0.97);
    const synthesis = experience.locator('.experience-synthesis[data-active="true"]');
    await expect(synthesis).toHaveCount(1);
    await expect(synthesis).toContainText(/public systems/i);
    await expect(synthesis).toContainText(/reliable infrastructure/i);
    await expect(synthesis).toContainText(/trusted data/i);
    await expect(synthesis).toContainText(/human/i);

    const synthesisGeometry = await synthesis.evaluate((element) => {
      const stage = element.closest(".experience-journey-stage")!;
      const stageRect = stage.getBoundingClientRect();
      const synthesisRect = element.getBoundingClientRect();
      return {
        stageTop: stageRect.top,
        stageBottom: stageRect.bottom,
        synthesisTop: synthesisRect.top,
        synthesisBottom: synthesisRect.bottom,
      };
    });
    expect(synthesisGeometry.synthesisTop).toBeGreaterThanOrEqual(synthesisGeometry.stageTop - 1);
    expect(synthesisGeometry.synthesisBottom).toBeLessThanOrEqual(synthesisGeometry.stageBottom + 1);
  });

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 900, height: 800 },
    { width: 899, height: 800 },
    { width: 390, height: 844 },
  ]) {
    test(`uses an unpinned, unclipped natural layout at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/?motion=full#experience");
      const experience = await waitForExperienceHydration(page, "full");

      await expect(experience).toHaveAttribute("data-layout", "natural");
      await expect(experience.locator(".pin-spacer")).toHaveCount(0);

      const geometry = await experience.evaluate((section) => {
        const sectionRect = section.getBoundingClientRect();
        const chapters = [...section.querySelectorAll<HTMLElement>(".experience-stop-callout")].map(
          (chapter) => {
            const rect = chapter.getBoundingClientRect();
            return {
              id: chapter.dataset.experienceId,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            };
          },
        );
        const overlaps = chapters.flatMap((chapter, index) =>
          chapters.slice(index + 1).flatMap((other) => {
            const overlapWidth = Math.min(chapter.right, other.right) - Math.max(chapter.left, other.left);
            const overlapHeight = Math.min(chapter.bottom, other.bottom) - Math.max(chapter.top, other.top);
            return overlapWidth > 1 && overlapHeight > 1 ? [`${chapter.id}:${other.id}`] : [];
          }),
        );

        return {
          sectionTop: sectionRect.top,
          sectionBottom: sectionRect.bottom,
          viewportWidth: window.innerWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          chapters,
          overlaps,
        };
      });

      expect(geometry.hasHorizontalOverflow).toBe(false);
      expect(geometry.overlaps).toEqual([]);
      for (const chapter of geometry.chapters) {
        expect(chapter.width).toBeGreaterThan(0);
        expect(chapter.height).toBeGreaterThan(0);
        expect(chapter.left).toBeGreaterThanOrEqual(-1);
        expect(chapter.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
        expect(chapter.top).toBeGreaterThanOrEqual(geometry.sectionTop - 1);
        expect(chapter.bottom).toBeLessThanOrEqual(geometry.sectionBottom + 1);
      }
    });
  }

  test("reduced motion shows the chronological story without pinning", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?motion=system#experience");
    const experience = await waitForExperienceHydration(page, "system");

    await expect(experience).toHaveAttribute("data-reduced-motion", "true");
    await expect(experience).toHaveAttribute("data-layout", "natural");
    await expect(experience.locator(".pin-spacer")).toHaveCount(0);

    const chapters = experience.locator(".experience-stop-callout");
    await expect(chapters).toHaveCount(experienceEntries.length);
    expect(await chapters.evaluateAll((items) => items.map((item) => item.getAttribute("data-experience-id")))).toEqual(
      experienceEntries.map((entry) => entry.id),
    );

    for (const entry of experienceEntries) {
      await expect(
        experience.locator(`.experience-stop-callout[data-experience-id="${entry.id}"]`),
      ).toBeVisible();
    }
  });

  test("keeps the complete chronology available when JavaScript is disabled", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    try {
      await page.goto("/#experience");
      const experience = page.locator("#experience");
      const chapters = experience.locator(".experience-stop-callout");

      await expect(experience).toHaveAttribute("data-layout", "natural");
      await expect(experience).toHaveAttribute("data-hydrated", "false");
      await expect(experience.locator(".experience-road-artifact")).toHaveCSS("opacity", "0");
      await expect(chapters).toHaveCount(experienceEntries.length);
      await expect(experience.locator(".pin-spacer")).toHaveCount(0);
      expect(await chapters.evaluateAll((items) => items.map((item) => item.getAttribute("data-experience-id")))).toEqual(
        experienceEntries.map((entry) => entry.id),
      );

      for (const entry of experienceEntries) {
        await expect(experience.getByRole("heading", { name: entry.role, exact: true })).toBeVisible();
        await expect(experience.getByText(entry.impact, { exact: true })).toBeVisible();
      }
    } finally {
      await context.close();
    }
  });

  test("keeps the motion preference control keyboard-accessible after hydration", async ({ page }) => {
    await page.goto("/?motion=full");
    const experience = await waitForExperienceHydration(page, "full");
    const toggle = experience.locator(".experience-motion-toggle");

    await expect(toggle).toHaveCount(1);
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeEnabled();
    expect(await toggle.evaluate((button) => (button as HTMLElement).tabIndex)).toBe(0);

    await toggle.focus();
    await expect(toggle).toBeFocused();
    await toggle.press("Enter");
    await expect(experience).toHaveAttribute("data-reduced-motion", "true");
    await expect(toggle).toBeVisible();

    await toggle.focus();
    await toggle.press("Space");
    await expect(experience).toHaveAttribute("data-reduced-motion", "false");
    await expect(toggle).toBeVisible();
  });
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
