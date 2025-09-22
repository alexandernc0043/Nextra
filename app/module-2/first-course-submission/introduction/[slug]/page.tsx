"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "../IntroductionGenerator.module.css";
import { Course, IntroLinks } from "../types";
type IntroData = {
  firstName: string;
  preferredName: string;
  middleInitial: string;
  lastName: string;
  divider: string;
  mascot: string;
  image: string; // data URL or path
  imageCaption: string;
  personalStatement?: string;
  personalBackground: string;
  professionalBackground: string;
  academicBackground: string;
  primaryComputer: string;
  courses: Course[];
  quote?: string;
  quoteAuthor?: string;
  funnyThing?: string;
  interestingThing?: string;
  links?: Partial<IntroLinks>;
};

export default function IntroPreviewPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const slug = params?.slug;
  const [data, setData] = useState<IntroData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [today, setToday] = useState<string>("");

  // Try to load from server (DB), then query params (?src= or ?data=), hash (#data=), then localStorage
  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        // 1) Server (database) — shareable by slug
        try {
          const r = await fetch(`/api/intros/${slug}`, { cache: 'no-store' })
          if (r.ok) {
            const j = (await r.json()) as IntroData
            setData(j)
            setNotFound(false)
            return
          }
        } catch { }

        const src = search?.get("src");
        const dataParam = search?.get("data");
        if (src) {
          const r = await fetch(src);
          const j = (await r.json()) as IntroData;
          setData(j);
          setNotFound(false);
          return;
        }
        if (dataParam) {
          try {
            const j = JSON.parse(decodeURIComponent(dataParam)) as IntroData;
            setData(j);
            setNotFound(false);
            return;
          } catch (e) {
            console.error("Invalid data param");
          }
        }
        if (typeof window !== 'undefined' && window.location.hash.includes('data=')) {
          const hash = window.location.hash.replace(/^#/, '');
          const params = new URLSearchParams(hash);
          const hv = params.get('data');
          if (hv) {
            try {
              const j = JSON.parse(decodeURIComponent(hv)) as IntroData;
              setData(j);
              setNotFound(false);
              return;
            } catch { }
          }
        }
        const raw = localStorage.getItem(`intro:${slug}`);
        if (!raw) {
          setNotFound(true);
          return;
        }
        const parsed = JSON.parse(raw) as IntroData;
        setData(parsed);
        setNotFound(false);
      } catch (e) {
        console.error("Failed to load intro", e);
        setNotFound(true);
      }
    };
    load();
  }, [slug, search]);

  // Compute today's date on client to avoid hydration mismatch
  useEffect(() => {
    setToday(new Date().toLocaleDateString());
  }, []);

  if (notFound) {
    return (
      <div className={styles.card}>
        <p>Couldn’t find an introduction for this slug.</p>
        <button className={styles.btn} onClick={() => router.push("/module-2/first-course-submission/introduction/browse")}>Back to browse</button>
      </div>
    );
  }

  if (!data) {
    return <div className={styles.card}>Loading…</div>;
  }

  const {
    firstName,
    preferredName,
    middleInitial,
    lastName,
    divider,
    mascot,
    image,
    imageCaption,
    personalBackground,
    professionalBackground,
    academicBackground,
    primaryComputer,
    courses,
    quote,
    quoteAuthor,
    funnyThing,
    interestingThing,
    links,
  } = data;

  const initials = [firstName?.trim()?.[0], (middleInitial || "").trim()?.[0], lastName?.trim()?.[0]]
    .filter(Boolean)
    .join("");

  const linksArr: { label: string; href: string }[] = [];
  if (links?.cltWeb) linksArr.push({ label: "CLT Web", href: links.cltWeb });
  if (links?.github) linksArr.push({ label: "GitHub", href: links.github });
  if (links?.githubIo) linksArr.push({ label: "GitHub.io", href: links.githubIo });
  if (links?.courseIo) linksArr.push({ label: "Course.io", href: links.courseIo });
  if (links?.freeCodeCamp) linksArr.push({ label: "freeCodeCamp", href: links.freeCodeCamp });
  if (links?.codecademy) linksArr.push({ label: "Codecademy", href: links.codecademy });
  if (links?.linkedIn) linksArr.push({ label: "LinkedIn", href: links.linkedIn });

  return (
    <div className={styles.page}>
      <div className={styles.max}>
        <div className={styles.preview}>
          <div className={styles.rowBetween}>
            <div className={styles.toolbar}>
              <button
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={() => router.push("/module-2/first-course-submission/introduction/browse")}
              >
                Back to browse
              </button>
              <button
                className={styles.btn}
                onClick={() => {
                  try {
                    const filename = buildFilename(data, slug);
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  } catch { }
                }}
              >
                Export JSON
              </button>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.hint} suppressHydrationWarning>
              I understand that what I put here is publicly available on the web and I won’t put anything here I don’t want the public to see {divider} {initials} {divider} {today}
            </p>
            <div className={styles.nameLine}>
              {firstName}{" "}
              {middleInitial ? `${middleInitial}. ` : ""}
              {preferredName ? `“${preferredName}” ` : ""}
              {lastName} {divider} {mascot}
            </div>

            <figure>
              <img src={image || "/headshot.jpeg"} alt={imageCaption} width={500} height={500} />
              {imageCaption ? (
                <figcaption className={styles.hint}>
                  <em>{imageCaption}</em>
                </figcaption>
              ) : null}
            </figure>
            {data.personalStatement ? (
              <p className={styles.quoteText}><em>“{data.personalStatement}”</em></p>
            ) : null}
            <ul>
              <li>
                <strong>Personal Background: </strong>
                {personalBackground || "None."}
              </li>
              <li>
                <strong>Professional Background: </strong>
                {professionalBackground || "None."}
              </li>
              <li>
                <strong>Academic Background: </strong>
                {academicBackground || "None."}
              </li>
              <li>
                <strong>Primary Computer: </strong>
                {primaryComputer || "None."}
              </li>
              <li>
                <strong>Funny thing about me: </strong>
                {funnyThing || "None yet."}
              </li>
              <li>
                <strong>Interesting thing about me: </strong>
                {interestingThing || "None yet."}
              </li>
              <li>
                <strong>Courses I'm Taking and Why:</strong>
                <ol style={{ marginTop: "0.25rem" }}>
                  {courses?.length
                    ? courses.map(({ dept, number, name, reason }, index) => (
                      <li key={index}>
                        <strong>
                          {dept} {number} — {name}
                        </strong>
                        : {reason}
                      </li>
                    ))
                    : <li>No courses.</li>}
                </ol>
              </li>
            </ul>
            {(quote || quoteAuthor) && (
                <div>
                  {quote ? <div className={styles.quoteText}><em>“{quote}”</em></div> : null}
                  {quoteAuthor ? <span className={styles.quoteAuthor}>— {quoteAuthor}</span> : null}
                </div>
              )}
              {linksArr.length > 0 && (
                  <div className={styles.linkRow}>
                    {linksArr.map((l, idx) => (
                      <span key={`${l.label}-${idx}`} className={styles.linkItem}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                        {idx < linksArr.length - 1 ? <span className={styles.linkSep}>{` ${divider} `}</span> : null}
                      </span>
                    ))}
                  </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildFilename(data: IntroData | null, slug: string) {
  if (!data) return `${slug}.json`;
  const name = [data.firstName, data.middleInitial && `${data.middleInitial}`, data.lastName]
    .filter(Boolean)
    .join('_');
  return `${name || slug}.json`;
}
