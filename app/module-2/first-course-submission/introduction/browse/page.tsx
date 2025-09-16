"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../IntroductionGenerator.module.css";

type Intro = {
  slug: string;
  firstName?: string;
  preferredName?: string;
  middleInitial?: string;
  lastName?: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
};

export default function BrowseIntrosPage() {
  return (
    <Suspense fallback={<div className={styles.page}><div className={styles.max}><div className={styles.card}>Loading…</div></div></div>}>
      <BrowseIntrosContent />
    </Suspense>
  );
}

function BrowseIntrosContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params?.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [items, setItems] = useState<Intro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQ = useDebounce(q, 250);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);
      try {
        const u = new URL(`/api/intros`, window.location.origin);
        if (debouncedQ) u.searchParams.set("q", debouncedQ);
        const r = await fetch(u.toString(), { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as { items: Intro[] };
        setItems(j.items || []);
      } catch (e: any) {
        setError("Unable to load introductions. Make sure MongoDB is configured.");
      } finally {
        setLoading(false);
      }
    };
    // update query in URL (shallow)
    const url = new URL(window.location.href);
    if (debouncedQ) url.searchParams.set("q", debouncedQ); else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
    fetchList();
  }, [debouncedQ]);

  return (
    <div className={styles.page}>
      <div className={styles.max}>
        <div className={styles.header}>
          <h2 className={styles.title}>Browse Introductions</h2>
          <p className={styles.subtitle}>Search saved intros by name or slug, then open to view.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.toolbar}>
            <input
              className={styles.input}
              placeholder="Search by name or slug…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ maxWidth: 420 }}
            />
            <button className={styles.btn} onClick={() => router.push("/module-2/first-course-submission/introduction")}>New introduction</button>
          </div>

          {loading && <p className={styles.muted}>Loading…</p>}
          {error && <p className={styles.muted}>{error}</p>}
          {!loading && !error && (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'grid', gap: '.75rem' }}>
              {items.length === 0 && <li className={styles.muted}>No introductions found.</li>}
              {items.map((it) => (
                <li key={it.slug} className={styles.card}>
                  <div className={styles.rowBetween}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        <a href={`/module-2/first-course-submission/introduction/${encodeURIComponent(it.slug)}`}
                           title={`Open ${it.slug}`}
                        >
                          {displayName(it)}
                        </a>
                      </div>
                      <div className={styles.muted} style={{ fontSize: '.9rem' }}>
                        {it.slug}
                        {renderUpdated(it)}
                      </div>
                    </div>
                    <div className={styles.toolbar}>
                      <button
                        className={styles.btn}
                        onClick={() => router.push(`/module-2/first-course-submission/introduction/${it.slug}`)}
                      >
                        Open
                      </button>
                      <button
                        className={styles.btn}
                        onClick={() => copyLink(`/module-2/first-course-submission/introduction/${it.slug}`)}
                      >
                        Copy link
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function displayName(it: Intro) {
  const parts = [it.firstName, it.middleInitial && `${it.middleInitial}.`, it.lastName]
    .filter(Boolean)
    .join(' ');
  if (parts) return parts;
  return it.preferredName || it.slug;
}

function renderUpdated(it: Intro) {
  const ts = it.updatedAt || it.createdAt;
  if (!ts) return null;
  try {
    const d = typeof ts === 'string' ? new Date(ts) : ts;
    return <span> • Updated {d.toLocaleString()}</span>;
  } catch {
    return null;
  }
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

async function copyLink(path: string) {
  try {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      alert('Link copied');
    } else {
      prompt('Copy this URL', url);
    }
  } catch {}
}
