# Google Analytics + UTM Tracking Setup for Portfolio Website

**Goal:** Measure how many people reach your portfolio from LinkedIn, your resume PDF, GitHub, email, QR codes, and other sources by using Google Analytics 4 and UTM-tagged links.

This guide is written for a portfolio website that may be built as static HTML/CSS/JS, React, Next.js, or a similar frontend framework.

## Current Short UTM Convention

For this portfolio, keep public links short and readable:

```text
https://nikhilarethiya.vercel.app/?utm_source=resume&utm_medium=pdf
https://nikhilarethiya.vercel.app/?utm_source=linkedin&utm_medium=button
https://nikhilarethiya.vercel.app/?utm_source=github&utm_medium=button
```

Use `utm_campaign` and `utm_content` only if you later need more detailed campaign reporting.

---

## 0. What You Are Building

You will set up:

1. A **Google Analytics 4 property** for your portfolio.
2. A **Google tag** installed on your website.
3. A clean **UTM naming system** for every external place where your portfolio link appears.
4. Optional **custom portfolio events**, such as project-card clicks, contact clicks, resume downloads, and scroll-telling scene views.
5. A repeatable reporting workflow in GA4 to answer:
   - How many users came from LinkedIn?
   - How many users came from my resume PDF?
   - How many users came from GitHub?
   - Which source produced the most engaged visitors?
   - Which source led to contact clicks or project clicks?

---

## 1. Core Concepts

### 1.1 Google Analytics 4

GA4 records visits, page views, traffic sources, campaigns, events, and engagement metrics. For this use case, GA4 is mainly used to see where portfolio visitors came from.

Official setup reference:  
https://support.google.com/analytics/answer/9304153

### 1.2 UTM Parameters

UTM parameters are query parameters added to a URL so Google Analytics can identify the source of traffic.

Example:

```text
https://yourdomain.com/?utm_source=linkedin&utm_medium=social_profile&utm_campaign=portfolio_2026&utm_content=profile_website_link
```

Official GA4 UTM reference:  
https://support.google.com/analytics/answer/10917952

### 1.3 What Each UTM Field Means

| Parameter | Purpose | Portfolio Example |
|---|---|---|
| `utm_source` | Where the visitor came from | `linkedin`, `resume`, `github` |
| `utm_medium` | The type of channel/link | `social_profile`, `pdf`, `repository`, `email`, `qr` |
| `utm_campaign` | The larger campaign/context | `portfolio_2026`, `job_search_2026` |
| `utm_content` | Which exact link or placement | `profile_header`, `resume_header`, `github_readme` |
| `utm_term` | Usually paid search keyword | Not needed for your portfolio |

For your use case, the most important fields are:

```text
utm_source
utm_medium
utm_campaign
utm_content
```

---

## 2. Recommended UTM Naming Convention

Use lowercase, hyphens or underscores, and consistent names. Do not mix `LinkedIn`, `linkedin`, and `linked_in`; GA4 can treat inconsistent values as separate rows.

### 2.1 Standard Rules

Use:

```text
lowercase_only
no spaces
short but descriptive
same value every time for the same source
```

Avoid:

```text
LinkedIn
linked in
Linked-In
Resume Version 8
CompanyName_Private_Interview
```

### 2.2 Recommended Portfolio Campaign Name

Use one campaign for general tracking:

```text
portfolio_2026
```

Use another for job applications if needed:

```text
job_search_2026
```

---

## 3. Exact UTM Links to Use

Replace `https://yourdomain.com/` with your real portfolio URL.

### 3.1 LinkedIn Profile Website Link

Use this in your LinkedIn profile contact info or featured section:

```text
https://yourdomain.com/?utm_source=linkedin&utm_medium=social_profile&utm_campaign=portfolio_2026&utm_content=profile_website_link
```

### 3.2 LinkedIn Featured Post or Portfolio Post

Use this if you post your portfolio on LinkedIn:

```text
https://yourdomain.com/?utm_source=linkedin&utm_medium=social_post&utm_campaign=portfolio_2026&utm_content=launch_post
```

### 3.3 Resume PDF Header Link

Use this for the portfolio link inside your resume PDF:

```text
https://yourdomain.com/?utm_source=resume&utm_medium=pdf&utm_campaign=job_search_2026&utm_content=resume_header_link
```

### 3.4 Resume PDF Project Section Link

Use this if you add a portfolio/project link near your projects section:

```text
https://yourdomain.com/projects?utm_source=resume&utm_medium=pdf&utm_campaign=job_search_2026&utm_content=resume_project_section
```

### 3.5 GitHub Profile Link

Use this in your GitHub profile bio:

```text
https://yourdomain.com/?utm_source=github&utm_medium=profile&utm_campaign=portfolio_2026&utm_content=profile_bio_link
```

### 3.6 GitHub README Link

Use this in a pinned repository README:

```text
https://yourdomain.com/?utm_source=github&utm_medium=repository&utm_campaign=portfolio_2026&utm_content=readme_cta
```

### 3.7 Email Signature Link

Use this in your email signature:

```text
https://yourdomain.com/?utm_source=email&utm_medium=signature&utm_campaign=portfolio_2026&utm_content=email_footer
```

### 3.8 QR Code Link

Use this if you create a QR code for networking events:

```text
https://yourdomain.com/?utm_source=qr&utm_medium=offline&utm_campaign=portfolio_2026&utm_content=networking_card
```

### 3.9 Direct Job Application Link

Use this if a job application form asks for a portfolio link:

```text
https://yourdomain.com/?utm_source=job_application&utm_medium=form&utm_campaign=job_search_2026&utm_content=portfolio_field
```

### 3.10 Link Tracking Table

Maintain a small table like this in your notes:

| Placement | URL | Source | Medium | Campaign | Content |
|---|---|---:|---:|---:|---:|
| LinkedIn profile | `/` | `linkedin` | `social_profile` | `portfolio_2026` | `profile_website_link` |
| LinkedIn post | `/` | `linkedin` | `social_post` | `portfolio_2026` | `launch_post` |
| Resume header | `/` | `resume` | `pdf` | `job_search_2026` | `resume_header_link` |
| GitHub profile | `/` | `github` | `profile` | `portfolio_2026` | `profile_bio_link` |
| GitHub README | `/` | `github` | `repository` | `portfolio_2026` | `readme_cta` |
| Email signature | `/` | `email` | `signature` | `portfolio_2026` | `email_footer` |
| QR code | `/` | `qr` | `offline` | `portfolio_2026` | `networking_card` |

---

## 4. Create the GA4 Property

1. Go to Google Analytics:  
   https://analytics.google.com/
2. Create or select your Google Analytics account.
3. Create a new **GA4 property** for your portfolio.
4. Choose **Web** as the data stream type.
5. Enter your portfolio domain.
6. Copy the **Measurement ID**.

It will look like this:

```text
G-XXXXXXXXXX
```

Keep this value safe. You will use it in your website code.

Official setup guide:  
https://support.google.com/analytics/answer/9304153

---

## 5. Install Google Analytics on the Website

You have two good options:

1. **Direct Google tag / gtag.js** — simplest and best for a portfolio.
2. **Google Tag Manager** — useful if you want more marketing tags later.

For your current goal, use **direct Google tag** unless you specifically want Tag Manager.

---

## 6. Option A: Static HTML Website Setup

Add this inside the `<head>` of your `index.html`.

Replace `G-XXXXXXXXXX` with your real GA4 Measurement ID.

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```

After deployment, GA4 should receive page views.

---

## 7. Option B: Next.js App Router Setup

### 7.1 Add Environment Variable

Create or update `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 7.2 Create Google Analytics Component

Create:

```text
components/GoogleAnalytics.tsx
```

```tsx
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

### 7.3 Add Component to Layout

In `app/layout.tsx`:

```tsx
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
```

### 7.4 SPA Route Tracking

If your portfolio has multiple internal routes such as `/projects`, `/about`, or case-study pages, add route-change tracking.

Create:

```text
components/AnalyticsPageView.tsx
```

```tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    const queryString = searchParams.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }, [pathname, searchParams]);

  return null;
}
```

Then add it in your layout below `<GoogleAnalytics />`.

```tsx
<GoogleAnalytics />
<AnalyticsPageView />
```

If you manually send page views, configure the initial Google tag with `send_page_view: false` to avoid double counting:

```tsx
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
```

---

## 8. Option C: React / Vite Setup

Create:

```text
src/analytics.ts
```

```ts
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initGA() {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  window.gtag?.("event", eventName, params);
}
```

In `.env`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

In your app entry:

```ts
import { initGA } from "./analytics";

initGA();
```

---

## 9. Track Portfolio-Specific Events

GA4 page views will answer basic source questions. Custom events help answer deeper portfolio questions.

Recommended events:

| Event Name | Trigger | Why It Matters |
|---|---|---|
| `portfolio_landing` | First page load | Confirms UTM source on landing |
| `project_card_click` | User clicks a project card | Measures project interest |
| `case_study_click` | User opens case study | Measures deeper work interest |
| `resume_download` | User clicks resume download | Measures hiring intent |
| `contact_click` | User clicks email, LinkedIn, GitHub, or contact CTA | Measures conversion intent |
| `scene_view` | User reaches scroll-telling sections | Measures engagement through the story |

---

## 10. Add UTM Capture Helper

GA4 automatically reads UTM parameters from URLs for attribution. This helper is optional, but useful if you want to send a clean custom event on the first portfolio landing.

Create:

```text
src/utm.ts
```

```ts
type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
    const value = params.get(key);
    if (value) {
      utm[key as keyof UtmParams] = value.toLowerCase().trim();
    }
  });

  return utm;
}

export function persistUtmParams() {
  const utm = getUtmParams();
  if (Object.keys(utm).length === 0) return;

  sessionStorage.setItem("portfolio_utm", JSON.stringify({
    ...utm,
    landing_page: window.location.pathname,
    landing_url: window.location.href,
    captured_at: new Date().toISOString(),
  }));
}

export function getPersistedUtmParams(): Record<string, unknown> {
  try {
    return JSON.parse(sessionStorage.getItem("portfolio_utm") || "{}");
  } catch {
    return {};
  }
}
```

---

## 11. Send a `portfolio_landing` Event

```ts
import { trackEvent } from "./analytics";
import { getUtmParams, persistUtmParams } from "./utm";

export function trackPortfolioLanding() {
  const utm = getUtmParams();
  persistUtmParams();

  trackEvent("portfolio_landing", {
    ...utm,
    landing_page: window.location.pathname,
    page_location: window.location.href,
  });
}
```

Run it once after GA initializes:

```ts
initGA();
trackPortfolioLanding();
```

For Next.js, call it in a client component using `useEffect`.

---

## 12. Track Contact Clicks

Example HTML:

```html
<a
  href="mailto:n.arethiya@gwu.edu"
  data-analytics="contact_click"
  data-contact-type="email"
>
  Email Me
</a>

<a
  href="https://www.linkedin.com/in/nikhilarethiya/"
  data-analytics="contact_click"
  data-contact-type="linkedin"
>
  LinkedIn
</a>

<a
  href="https://github.com/Nikhil123n"
  data-analytics="contact_click"
  data-contact-type="github"
>
  GitHub
</a>
```

JavaScript:

```ts
import { trackEvent } from "./analytics";
import { getPersistedUtmParams } from "./utm";

document.querySelectorAll<HTMLElement>('[data-analytics="contact_click"]').forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent("contact_click", {
      contact_type: element.dataset.contactType,
      ...getPersistedUtmParams(),
    });
  });
});
```

---

## 13. Track Project Card Clicks

HTML:

```html
<a
  href="/projects/airbnb-recommendation-system"
  class="project-card"
  data-analytics="project_card_click"
  data-project="airbnb_recommendation_system"
>
  Airbnb Recommendation System
</a>
```

JavaScript:

```ts
document.querySelectorAll<HTMLElement>('[data-analytics="project_card_click"]').forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent("project_card_click", {
      project: element.dataset.project,
      ...getPersistedUtmParams(),
    });
  });
});
```

---

## 14. Track Scroll-Telling Scene Views

For your sketchbook portfolio, this is especially useful. You can measure whether visitors reach sections like `journey`, `projects`, `experience`, and `contact`.

HTML:

```html
<section id="journey" data-scene="journey">...</section>
<section id="projects" data-scene="featured_projects">...</section>
<section id="experience" data-scene="experience_highlights">...</section>
<section id="contact" data-scene="contact">...</section>
```

JavaScript:

```ts
import { trackEvent } from "./analytics";
import { getPersistedUtmParams } from "./utm";

const viewedScenes = new Set<string>();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target as HTMLElement;
      const scene = element.dataset.scene;

      if (!scene || viewedScenes.has(scene)) return;
      viewedScenes.add(scene);

      trackEvent("scene_view", {
        scene_name: scene,
        ...getPersistedUtmParams(),
      });
    });
  },
  {
    threshold: 0.45,
  }
);

document.querySelectorAll<HTMLElement>("[data-scene]").forEach((section) => {
  observer.observe(section);
});
```

This helps answer:

```text
Did LinkedIn users reach the projects section?
Did resume users reach the contact section?
Did GitHub users spend time in the toolkit or project sections?
```

---

## 15. Enable Enhanced Measurement

In GA4:

```text
Admin → Data Streams → Web Stream → Enhanced Measurement
```

Turn on useful portfolio measurements:

- Page views
- Scrolls
- Outbound clicks
- File downloads
- Video engagement, if you have embedded demos

Official outbound-click reference:  
https://support.google.com/analytics/answer/13566436

---

## 16. Where to View UTM Data in GA4

### 16.1 Traffic Acquisition

Use this report for session-level traffic:

```text
Reports → Acquisition → Traffic acquisition
```

Change the primary dimension to:

```text
Session source / medium
```

Useful dimensions:

```text
Session source
Session medium
Session source / medium
Session campaign
Landing page + query string
```

Useful metrics:

```text
Users
Sessions
Engaged sessions
Engagement rate
Average engagement time per session
Event count
Key events
```

### 16.2 User Acquisition

Use this when you want to know where a user first came from:

```text
Reports → Acquisition → User acquisition
```

Useful dimensions:

```text
First user source / medium
First user campaign
```

### 16.3 Explorations

Use Explorations to build a custom dashboard.

Go to:

```text
Explore → Free form
```

Add dimensions:

```text
Session source
Session medium
Session source / medium
Session campaign
Landing page + query string
Event name
```

Add metrics:

```text
Total users
Sessions
Engaged sessions
Event count
Average engagement time
```

Recommended table:

| Rows | Columns | Values |
|---|---|---|
| `Session source / medium` | `Event name` | `Total users`, `Sessions`, `Event count` |

This will show traffic and actions by source.

Official traffic-source reference:  
https://support.google.com/analytics/answer/11242870

---

## 17. Mark Important Events as Key Events

GA4 uses **key events** to mark events that matter most.

Recommended key events for a portfolio:

```text
contact_click
resume_download
case_study_click
```

Steps:

```text
Admin → Events → Find event → Mark as key event
```

If the event has not appeared yet, trigger it manually once from your site, wait for GA4 to receive it, then mark it as a key event.

---

## 18. Create Custom Dimensions for Optional Event Parameters

If you send custom parameters like `project`, `contact_type`, or `scene_name`, register them so they are easier to use in GA4 reports.

Go to:

```text
Admin → Custom definitions → Create custom dimension
```

Suggested custom dimensions:

| Dimension Name | Scope | Event Parameter |
|---|---|---|
| Project | Event | `project` |
| Contact Type | Event | `contact_type` |
| Scene Name | Event | `scene_name` |
| UTM Content | Event | `utm_content` |

You generally do **not** need to create custom dimensions for source, medium, and campaign because GA4 already provides traffic-source dimensions.

---

## 19. Test the Setup

### 19.1 Test Using a UTM Link

Open this in an incognito/private browser window after replacing the domain:

```text
https://yourdomain.com/?utm_source=test&utm_medium=manual&utm_campaign=ga4_setup_test&utm_content=incognito_test
```

### 19.2 Check Realtime

Go to:

```text
Reports → Realtime
```

You should see at least one active user.

### 19.3 Check DebugView

GA4 DebugView shows events in near real time and is useful while testing your tag installation.

Go to:

```text
Admin → DebugView
```

Official DebugView reference:  
https://support.google.com/analytics/answer/7201382

### 19.4 Use Browser DevTools

Open DevTools → Network tab, then search for:

```text
collect
```

You should see requests going to Google Analytics after page load or event triggers.

---

## 20. Validation Checklist

Before publishing your final links everywhere, verify:

- [ ] GA4 property exists.
- [ ] Web data stream exists.
- [ ] Measurement ID is added to the website.
- [ ] Website is deployed.
- [ ] Realtime report shows visits.
- [ ] Test UTM link appears in traffic reports.
- [ ] LinkedIn profile link uses UTM.
- [ ] Resume PDF link uses UTM.
- [ ] GitHub profile link uses UTM.
- [ ] GitHub README links use UTM.
- [ ] Email signature uses UTM.
- [ ] Contact clicks are tracked.
- [ ] Project card clicks are tracked.
- [ ] Important events are marked as key events.

---

## 21. Privacy and Safety Checklist

Do not send personally identifiable information to Google Analytics.

Avoid putting names, emails, phone numbers, company-specific confidential labels, or private job-application details inside UTM parameters.

Good:

```text
utm_source=resume
utm_medium=pdf
utm_campaign=job_search_2026
utm_content=resume_header_link
```

Avoid:

```text
utm_campaign=application_to_specific_private_company_name
utm_content=email_to_recruiter_jane_doe
```

Official PII reference:  
https://support.google.com/analytics/answer/7686480

If your site may receive visitors from regions with cookie/consent requirements, consider adding a consent banner and Google Consent Mode.

Official Consent Mode reference:  
https://developers.google.com/tag-platform/security/guides/consent

---

## 22. Optional Consent Mode Example

If you want analytics storage to wait for consent, add this before the GA script:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
</script>
```

When a user accepts analytics cookies:

```js
gtag('consent', 'update', {
  analytics_storage: 'granted'
});
```

For a personal portfolio with no ads, you can keep ad-related storage denied:

```js
gtag('consent', 'update', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
```

---

## 23. Do Not UTM-Tag Internal Links

Do not add UTM parameters to links inside your own website.

Bad:

```text
https://yourdomain.com/projects?utm_source=homepage&utm_medium=internal&utm_campaign=nav
```

Why this is bad:

- It can overwrite the original traffic attribution.
- It makes LinkedIn, resume, GitHub, or email traffic harder to trust.
- It pollutes reports with fake internal campaigns.

Use custom events for internal clicks instead.

---

## 24. Best Portfolio Reports to Build

### Report 1: Source Quality

Question:

```text
Which external source sends the best visitors?
```

Rows:

```text
Session source / medium
```

Metrics:

```text
Users
Sessions
Engagement rate
Average engagement time
contact_click count
case_study_click count
```

### Report 2: Resume vs LinkedIn vs GitHub

Question:

```text
Are recruiters coming from my resume, LinkedIn, or GitHub?
```

Filter:

```text
Session source contains linkedin OR resume OR github
```

Rows:

```text
Session source / medium
Session campaign
```

Metrics:

```text
Users
Sessions
Engaged sessions
Event count
```

### Report 3: Scroll-Telling Engagement

Question:

```text
Which visitors reach deeper parts of the portfolio?
```

Rows:

```text
Session source / medium
```

Columns:

```text
scene_name
```

Metric:

```text
Event count
```

### Report 4: Project Interest

Question:

```text
Which project attracts the most attention?
```

Rows:

```text
project
```

Columns:

```text
Session source / medium
```

Metric:

```text
project_card_click count
case_study_click count
```

---

## 25. Recommended UTM Strategy for Your Portfolio

Use these exact links when publishing your portfolio:

```text
LinkedIn profile:
https://yourdomain.com/?utm_source=linkedin&utm_medium=social_profile&utm_campaign=portfolio_2026&utm_content=profile_website_link

LinkedIn post:
https://yourdomain.com/?utm_source=linkedin&utm_medium=social_post&utm_campaign=portfolio_2026&utm_content=launch_post

Resume PDF:
https://yourdomain.com/?utm_source=resume&utm_medium=pdf&utm_campaign=job_search_2026&utm_content=resume_header_link

GitHub profile:
https://yourdomain.com/?utm_source=github&utm_medium=profile&utm_campaign=portfolio_2026&utm_content=profile_bio_link

GitHub README:
https://yourdomain.com/?utm_source=github&utm_medium=repository&utm_campaign=portfolio_2026&utm_content=readme_cta

Email signature:
https://yourdomain.com/?utm_source=email&utm_medium=signature&utm_campaign=portfolio_2026&utm_content=email_footer

QR code:
https://yourdomain.com/?utm_source=qr&utm_medium=offline&utm_campaign=portfolio_2026&utm_content=networking_card
```

---

## 26. Recommended Events for a Software Engineering Portfolio

Because your portfolio is technical and project-driven, track these events:

```text
portfolio_landing
scene_view
project_card_click
case_study_click
github_project_click
resume_download
contact_click
```

Suggested event parameters:

```text
project
scene_name
contact_type
link_location
utm_source
utm_medium
utm_campaign
utm_content
```

Examples:

```js
gtag('event', 'case_study_click', {
  project: 'medical_document_ai_rag',
  link_location: 'featured_projects',
});
```

```js
gtag('event', 'contact_click', {
  contact_type: 'email',
  link_location: 'footer',
});
```

---

## 27. Deployment Checklist

### If deploying on Vercel

1. Add environment variable:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Redeploy.
3. Test Realtime report.
4. Test UTM link.

### If deploying on Netlify

1. Add environment variable in Site Settings.
2. Redeploy.
3. Test Realtime report.
4. Test UTM link.

### If deploying static HTML on GitHub Pages

1. Add GA script directly in `index.html`.
2. Commit and push.
3. Wait for GitHub Pages to deploy.
4. Test Realtime report.
5. Test UTM link.

---

## 28. Troubleshooting

### Problem: Realtime shows no users

Check:

- Measurement ID is correct.
- Script is present in the deployed HTML.
- Ad blocker is not blocking the request.
- You are testing the deployed site, not only a local file.
- Browser DevTools shows GA network requests.

### Problem: UTM source does not appear immediately

GA4 standard reports may take time to process. Use Realtime or DebugView first, then check Acquisition reports later.

### Problem: LinkedIn shows as referral instead of your UTM source

Check that the LinkedIn link actually contains the UTM parameters after saving. Some platforms shorten or modify displayed links, but the destination should still include the UTM query string.

### Problem: Resume traffic appears as Direct

Make sure the portfolio link inside the PDF includes the full UTM URL. If the PDF only contains `https://yourdomain.com`, GA4 will not know it came from the resume.

### Problem: GitHub traffic is not separated by profile vs README

Use different `utm_content` values:

```text
profile_bio_link
readme_cta
repo_about_link
```

---

## 29. Final Implementation Order

1. Create GA4 property.
2. Get Measurement ID.
3. Add Google tag to website.
4. Deploy website.
5. Test basic page view in Realtime.
6. Create UTM links.
7. Replace portfolio links in LinkedIn, resume, GitHub, email signature, and QR code.
8. Add optional custom events.
9. Register custom dimensions if using custom event parameters.
10. Mark important events as key events.
11. Build Acquisition and Exploration reports.
12. Review performance weekly.

---

## 30. Sources

- Google Analytics setup for a website/app: https://support.google.com/analytics/answer/9304153
- GA4 URL builders and custom campaign data: https://support.google.com/analytics/answer/10917952
- GA4 traffic-source dimensions and manual tagging: https://support.google.com/analytics/answer/11242870
- GA4 DebugView: https://support.google.com/analytics/answer/7201382
- GA4 outbound clicks: https://support.google.com/analytics/answer/13566436
- Google Consent Mode for websites: https://developers.google.com/tag-platform/security/guides/consent
- Google Analytics PII policy guidance: https://support.google.com/analytics/answer/7686480
