import Image from "next/image";
import { assets, type SiteConfig } from "@/data";
import { MotionReveal } from "./MotionReveal";

type ContactSectionProps = {
  site: SiteConfig;
};

export function ContactSection({ site }: ContactSectionProps) {
  const emailHref = site.contactEmail ? `mailto:${site.contactEmail}` : "#contact";
  const phoneHref = site.contactPhone ? `tel:${site.contactPhone.replace(/[^\d+]/g, "")}` : "#contact";

  return (
    <section id="contact" className="scene section contact-section" aria-labelledby="contact-title">
      <MotionReveal className="contact-copy">
        <div className="section-kicker">Let&apos;s Connect</div>
        <h2 id="contact-title">Let&apos;s build something real.</h2>
        <p>I am open to software engineering roles, product engineering collaborations, and systems work with meaningful impact.</p>
        <div className="contact-links">
          <a className="contact-link" href={emailHref}>
            <Image src={assets.doodles.mail} alt="" width={34} height={34} aria-hidden="true" />
            <span>{site.contactEmail || "Email"}</span>
          </a>
          <a className="contact-link" href={phoneHref}>
            <Image src={assets.doodles.phone} alt="" width={34} height={34} aria-hidden="true" />
            <span>{site.contactPhone || "Phone"}</span>
          </a>
          <a className="contact-link" href={site.githubUrl} target="_blank" rel="noreferrer">
            <Image src={assets.doodles.github} alt="" width={34} height={34} aria-hidden="true" />
            GitHub
          </a>
          <a className="contact-link" href={site.linkedinUrl || "#contact"} target={site.linkedinUrl ? "_blank" : undefined} rel={site.linkedinUrl ? "noreferrer" : undefined}>
            <Image src={assets.doodles.linkedin} alt="" width={34} height={34} aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </MotionReveal>
      <MotionReveal className="contact-form-wrap" delay={0.08}>
        <form className="contact-form" action={site.contactFormEndpoint || "#contact"} method={site.contactFormMethod}>
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" autoComplete="name" minLength={2} maxLength={80} required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="your@email.com" autoComplete="email" maxLength={254} required />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={5}
              placeholder="Tell me about the project, role, or idea."
              minLength={10}
              maxLength={2000}
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={!site.contactFormEndpoint} title={!site.contactFormEndpoint ? "Set PUBLIC_CONTACT_FORM_ENDPOINT to enable this form." : undefined}>
            <span aria-hidden="true" />
            Send Note
          </button>
        </form>
      </MotionReveal>
    </section>
  );
}
