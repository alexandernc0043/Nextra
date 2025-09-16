"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './IntroductionGenerator.module.css'
type Course = { dept: string; number: string; name: string; reason: string }

export default function Page() {
    const [firstName, setFirstName] = useState("Alexander");
    const [preferredName, setPreferredName] = useState("Alex");
    const [middleInitial, setMiddleInitial] = useState("J");
    const [lastName, setLastName] = useState("Prechtel");
    const [slug, setSlug] = useState("alexander-prechtel");
    const [customSlug, setCustomSlug] = useState(false);
    const [divider, setDivider] = useState("~");
    const [mascot, setMascot] = useState("Advanced Pegasus");
    const [image, setImage] = useState("/headshot.jpeg")
    const [imageDataUrl, setImageDataUrl] = useState<string>("");
    const [imageFilename, setImageFilename] = useState<string>(() => {
        const parts = "/headshot.jpeg".split("/")
        return parts[parts.length - 1] || "image"
    })
    const imageObjectUrlRef = useRef<string | null>(null)
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (imageObjectUrlRef.current) {
            URL.revokeObjectURL(imageObjectUrlRef.current)
        }
        const url = URL.createObjectURL(file)
        imageObjectUrlRef.current = url
        setImage(url)
        setImageFilename(file.name)
        // Also read as data URL for persistence across reloads
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setImageDataUrl(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }
    useEffect(() => {
        return () => {
            if (imageObjectUrlRef.current) {
                URL.revokeObjectURL(imageObjectUrlRef.current)
            }
        }
    }, [])
    useEffect(() => {
        setToday(new Date().toLocaleDateString())
    }, [])
    const [imageCaption, setImageCaption] = useState("At the beach on the eastern coast of Florida (2024)")
    const [today, setToday] = useState("")
    const [personalBackground, setPersonalBackground] = useState("Grew up north of Charlotte, and have always had a love of computers.")
    const [personalStatement, setPersonalStatement] = useState("I’m a junior at UNC Charlotte studying Computer Science with a focus in Cybersecurity. I’m excited to collaborate and build secure, user‑friendly systems this semester.")
    const [professionalBackground, setProfessionalBackground] = useState("This is my first semester as an Instructional Assistant/Teachers Assistant, but before that I was a Peer Tutor for CCI.")
    const [academicBackground, setAcademicBackground] = useState("I’m currently a Junior at UNC Charlotte studying computer science with a focus in Cybersecurity. Before that I attended Highschool in Mooresville, North Carolina.")
    const [primaryComputer, setPrimaryComputer] = useState("The laptop I use for university is a Macbook Pro M2 14 inch. I also use a custom built Windows 11 computer.")
    const [courses, setCourses] = useState([
        {
            dept: "ITIS",
            number: "4250",
            name: "Computer Forensics",
            reason: "Required course for my concentration but the course’s subject also interests me."
        },
        {
            dept: "ITIS",
            number: "3246",
            name: "IT Infrastructure and Security",
            reason: "Another required course for my concentration but this is another class I am interested in."
        },
        {
            dept: "THEA",
            number: "1512",
            name: "Theatre in the United States",
            reason: "I needed to take one more theme course and this one was recommended to me by a friend who took it previously."
        },
        {
            dept: "MATH",
            number: "2164",
            name: "Matrices & Linear Algebra",
            reason: "Required course for the Computer Science degree."
        },
        {
            dept: "BIOL",
            number: "1110",
            name: "Principles of Biology I",
            reason: "I needed to take another science course and this was recommended to me by a friend."
        },
        {
            dept: "BIOL",
            number: "1110L",
            name: "Principles of Biology I Lab",
            reason: "I needed to take a science course with its lab."
        },
    ])
    // New: quote and links
    const [quote, setQuote] = useState("Do what is right, not what is easy nor what is popular.")
    const [quoteAuthor, setQuoteAuthor] = useState("Roy T. Bennett")
    const [linkCltWeb, setLinkCltWeb] = useState("https://webpages.charlotte.edu/aprechte")
    const [linkGithub, setLinkGithub] = useState("https://github.com/alexandernc0043")
    const [linkGithubIo, setLinkGithubIo] = useState("https://alexandernc0043.github.io/")
    const [linkCourseIo, setLinkCourseIo] = useState("https://alexandernc0043.github.io/itis3135/")
    const [linkFreeCodeCamp, setLinkFreeCodeCamp] = useState("https://www.freecodecamp.org/aprechte")
    const [linkCodecademy, setLinkCodecademy] = useState("https://www.codecademy.com/profiles/aprechte")
    const [linkLinkedIn, setLinkLinkedIn] = useState("https://www.linkedin.com/in/alexander-prechtel-b4a0a9283/")
    

    const slugify = (v: string) => v
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'intro';

    const [slugAvailability, setSlugAvailability] = useState<'unknown'|'checking'|'available'|'taken'>('unknown')
    // Check if slug exists in DB (if configured). Debounced.
    useEffect(() => {
        const s = slugify(slug)
        setSlugAvailability('checking')
        const ctrl = new AbortController()
        const t = setTimeout(async () => {
            try {
                const r = await fetch(`/api/intros/${s}`, { cache: 'no-store', signal: ctrl.signal })
                if (r.ok) setSlugAvailability('taken')
                else if (r.status === 404) setSlugAvailability('available')
                else setSlugAvailability('unknown')
            } catch {
                setSlugAvailability('unknown')
            }
        }, 350)
        return () => { ctrl.abort(); clearTimeout(t) }
    }, [slug])

    // Auto-suggest slug from name when not customized
    useEffect(() => {
        if (!customSlug) {
            setSlug(slugify([firstName, lastName].filter(Boolean).join('-')))
        }
    }, [firstName, lastName, customSlug])

    

    // Persist editor state to localStorage so users can preview and keep editing later
    const collectData = () => ({
        firstName,
        preferredName,
        middleInitial,
        lastName,
        divider,
        mascot,
        image: imageDataUrl || image || "/headshot.jpeg",
        imageCaption,
        personalBackground,
        professionalBackground,
        academicBackground,
        primaryComputer,
        courses,
        quote,
        quoteAuthor,
        links: {
            cltWeb: linkCltWeb,
            github: linkGithub,
            githubIo: linkGithubIo,
            courseIo: linkCourseIo,
            freeCodeCamp: linkFreeCodeCamp,
            codecademy: linkCodecademy,
            linkedIn: linkLinkedIn,
        }
    })

    const applyDataToForm = (json: any) => {
        try {
            setFirstName(json.firstName || '')
            setPreferredName(json.preferredName || '')
            setMiddleInitial(json.middleInitial || '')
            setLastName(json.lastName || '')
            setDivider(json.divider || '~')
            setMascot(json.mascot || '')
            if (json.image) {
                setImage(json.image)
                setImageDataUrl(typeof json.image === 'string' && json.image.startsWith('data:') ? json.image : '')
            }
            setImageCaption(json.imageCaption || '')
            setPersonalBackground(json.personalBackground || '')
            setPersonalStatement(json.personalStatement || '')
            setProfessionalBackground(json.professionalBackground || '')
            setAcademicBackground(json.academicBackground || '')
            setPrimaryComputer(json.primaryComputer || '')
            setCourses(Array.isArray(json.courses) ? json.courses : [])
            setQuote(json.quote || '')
            setQuoteAuthor(json.quoteAuthor || '')
            const links = json.links || {}
            setLinkCltWeb(links.cltWeb || '')
            setLinkGithub(links.github || '')
            setLinkGithubIo(links.githubIo || '')
            setLinkCourseIo(links.courseIo || '')
            setLinkFreeCodeCamp(links.freeCodeCamp || '')
            setLinkCodecademy(links.codecademy || '')
            setLinkLinkedIn(links.linkedIn || '')
        } catch { /* ignore */ }
    }

    // Auto-load any saved draft for the slug
    useEffect(() => {
        const s = slugify(slug)
        try {
            const raw = localStorage.getItem(`intro:${s}`)
            if (raw) {
                const json = JSON.parse(raw)
                applyDataToForm(json)
            }
        } catch { /* ignore */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    // Debounced autosave of form data to localStorage by slug
    useEffect(() => {
        const s = slugify(slug)
        const t = setTimeout(() => {
            try {
                localStorage.setItem(`intro:${s}`, JSON.stringify(collectData()))
            } catch { /* ignore */ }
        }, 500)
        return () => clearTimeout(t)
        // Include all fields that contribute to the data shape
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, firstName, preferredName, middleInitial, lastName, divider, mascot, image, imageDataUrl, imageCaption, personalBackground, personalStatement, professionalBackground, academicBackground, primaryComputer, courses, quote, quoteAuthor, linkCltWeb, linkGithub, linkGithubIo, linkCourseIo, linkFreeCodeCamp, linkCodecademy, linkLinkedIn])

    const publish = async () => {
        const s = slugify(slug)
        if (!firstName && !preferredName) {
            alert('Please enter at least a first or preferred name.')
            return
        }
        if (!lastName) {
            alert('Please enter a last name.')
            return
        }
        if (slugAvailability === 'taken') {
            const proceed = confirm('This slug already exists and will be overwritten. Continue?')
            if (!proceed) return
        }
        const dataToSave = {
            firstName,
            preferredName,
            middleInitial,
            lastName,
            divider,
            mascot,
            image: imageDataUrl || image || "/headshot.jpeg",
            imageCaption,
            personalBackground,
            professionalBackground,
            academicBackground,
            primaryComputer,
            courses,
            quote,
            quoteAuthor,
            links: {
                cltWeb: linkCltWeb,
                github: linkGithub,
                githubIo: linkGithubIo,
                courseIo: linkCourseIo,
                freeCodeCamp: linkFreeCodeCamp,
                codecademy: linkCodecademy,
                linkedIn: linkLinkedIn,
            }
        }
        try {
            const r = await fetch(`/api/intros/${s}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            })
            if (!r.ok) throw new Error('Publish failed')
            const url = `${window.location.origin}/module-2/first-course-submission/introduction/${s}`
            try {
                await navigator.clipboard.writeText(url)
                alert('Published! Link copied to clipboard.')
            } catch {
                alert(`Published! Visit: ${url}`)
            }
        } catch (e) {
            alert('Publishing failed. Check your database configuration.')
        }
    }

    return <>
        <div className={styles.page}>
            <div className={`${styles.max} ${styles.full}`}>
            <div className={styles.container}>
            <section className={styles.section}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Introduction Generator</h2>
                    <p className={styles.subtitle}>Fill out your details, then preview a polished introduction page.</p>
                </div>
                <h2>Form</h2>
                <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                    <div className={styles.card}>
                        <div className={styles.rowBetween}>
                            <div className={styles.toolbar}>
                                
                                <span className={`${styles.badge} ${slugAvailability === 'available' ? styles.badgeSuccess : slugAvailability === 'taken' ? styles.badgeWarn : ''}`}>
                                    {slugAvailability === 'checking' ? 'Checking…' : slugAvailability === 'available' ? 'Available' : slugAvailability === 'taken' ? 'Taken' : 'Unknown'}
                                </span>
                                <input
                                    className={styles.input}
                                    style={{ flex: '1 1 260px', minWidth: 180 }}
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        setCustomSlug(true);
                                    }}
                                    placeholder="my-intro-slug"
                                    title="Slug for the preview page"
                                />
                                
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    type="button"
                                    onClick={publish}
                                    aria-label="Publish introduction"
                                    title="Save to the database and copy a shareable link"
                                >
                                    Publish
                                </button>
                                
                                
                            </div>
                        </div>

                        <div className={styles.gridTwo}>
                            {/* <div className={styles.nameGrid}> */}
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="name">First Name</label>
                                <input
                                    className={styles.input}
                                    id="name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Your name"
                                    title="Enter your legal first name"
                                />
                            </div>
                            <div className={`${styles.field}`}>
                                <label className={styles.label} htmlFor="middle">Middle Initial</label>
                                <input
                                    className={styles.input}
                                    id="middle"
                                    type="text"
                                    value={middleInitial}
                                    onChange={(e) => setMiddleInitial(e.target.value)}
                                    placeholder="Your middle initial."
                                    title="Provide your middle initial, if applicable"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="preferred">Preferred Name</label>
                                <input
                                    className={styles.input}
                                    id="preferred"
                                    type="text"
                                    value={preferredName}
                                    onChange={(e) => setPreferredName(e.target.value)}
                                    placeholder="Your preferred name."
                                    title="What you prefer to be called"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="last">Last Name</label>
                                <input
                                    className={styles.input}
                                    id="last"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Your last name."
                                    title="Enter your family/last name"
                                />
                            </div>


                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="mascot">Mascot</label>
                                <input
                                    className={styles.input}
                                    id="mascot"
                                    type="text"
                                    value={mascot}
                                    onChange={(e) => setMascot(e.target.value)}
                                    placeholder="Your mascot."
                                    title="Your chosen mascot for the course"

                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}
                                    htmlFor="divider">Divider</label>
                                <input
                                    className={styles.input}
                                    id="divider"
                                    type="text"
                                    value={divider}
                                    onChange={(e) => setDivider(e.target.value)}
                                    placeholder="Divider"
                                    title="Symbol used to separate sections (e.g., ~ or |)"

                                />
                            </div>


                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="imageFile">Upload
                                    Image</label>
                                <input
                                    className={styles.file}
                                    id="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}

                                />
                                <p className={styles.hint}>PNG, JPG, or GIF. Stays local in your
                                    browser.</p>
                            </div>

                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="imageCaption">Image
                                    Caption</label>
                                <input
                                    className={styles.input}
                                    id="imageCaption"
                                    type="text"
                                    value={imageCaption}
                                    onChange={(e) => setImageCaption(e.target.value)}
                                    placeholder="Short description of the image"
                                    title="Describe the image for accessibility"

                                />
                            </div>
                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="personalStatement">Personal
                                    Statement</label>
                                <textarea
                                    className={styles.textarea}
                                    id="personalStatement"
                                    value={personalStatement}
                                    onChange={(e) => setPersonalStatement(e.target.value)}
                                    placeholder="A brief personal statement or summary"
                                    title="Add a short personal statement to include in your intro"
                                    rows={3}

                                />
                            </div>

                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="personalBackground">Personal
                                    Background</label>
                                <textarea
                                    className={styles.textarea}
                                    id="personalBackground"
                                    value={personalBackground}
                                    onChange={(e) => setPersonalBackground(e.target.value)}
                                    placeholder="A few sentences about you"
                                    title="Share a bit about your personal background"
                                    rows={3}
                                />
                            </div>



                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label}
                                    htmlFor="professionalBackground">Professional
                                    Background</label>
                                <textarea
                                    className={styles.textarea}
                                    id="professionalBackground"
                                    value={professionalBackground}
                                    onChange={(e) => setProfessionalBackground(e.target.value)}
                                    placeholder="Work experience or roles"
                                    title="Jobs, internships, roles, notable projects"
                                    rows={3}

                                />
                            </div>

                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="academicBackground">Academic
                                    Background</label>
                                <textarea
                                    className={styles.textarea}
                                    id="academicBackground"
                                    value={academicBackground}
                                    onChange={(e) => setAcademicBackground(e.target.value)}
                                    placeholder="Schools, major, focus, etc."
                                    title="Academic interests, research, concentrations, honors"
                                    rows={3}

                                />
                            </div>

                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="primaryComputer">Primary
                                    Computer</label>
                                <input
                                    className={styles.input}
                                    id="primaryComputer"
                                    type="text"
                                    value={primaryComputer}
                                    onChange={(e) => setPrimaryComputer(e.target.value)}
                                    placeholder="Your main device(s)"
                                    title="Your primary computer(s) or devices"

                                />
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.courses}>
                            <div className={styles.rowBetween}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Courses</h4>
                                <button
                                    className={styles.btn}
                                    type="button"
                                    onClick={() => setCourses(prev => [...prev, {
                                        name: "",
                                        reason: "",
                                        dept: "",
                                        number: ""
                                    }])}

                                    aria-label="Add course"
                                >
                                    + Add Course
                                </button>
                            </div>

                            {courses.length === 0 && (
                                <p className={styles.hint}>No courses added. Use "Add Course" to include one.</p>
                            )}

                            <div>
                                {courses.map((c, idx) => (
                                    <div key={idx} className={styles.courseCard}>
                                        <div className={styles.courseHeader}>
                                            <span className={styles.muted}>Course {idx + 1}</span>
                                            <button
                                                className={styles.btn}
                                                type="button"
                                                onClick={() => setCourses(prev => prev.filter((_, i) => i !== idx))}

                                                aria-label={`Remove course ${idx + 1}`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className={styles.courseGrid}>
                                            <div className={styles.field}>
                                                <label className={styles.label}
                                                    htmlFor={`course-dept-${idx}`}>Department Prefix</label>
                                                <input
                                                    className={styles.input}
                                                    id={`course-dept-${idx}`}
                                                    type="text"
                                                    value={c.dept}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setCourses(prev => prev.map((pc, i) => i === idx ? ({
                                                            ...pc,
                                                            dept: v
                                                        }) : pc));
                                                    }}
                                                    placeholder="Prefix"
                                                    title="Department prefix (e.g., ITIS, MATH)"

                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.label}
                                                    htmlFor={`course-number-${idx}`}>Course #</label>
                                                <input
                                                    className={styles.input}
                                                    id={`course-number-${idx}`}
                                                    type="text"
                                                    value={c.number}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setCourses(prev => prev.map((pc, i) => i === idx ? ({
                                                            ...pc,
                                                            number: v
                                                        }) : pc));
                                                    }}
                                                    placeholder="####"
                                                    title="Numeric course identifier (e.g., 3135)"

                                                />
                                            </div>
                                            <div className={`${styles.field} ${styles.full}`}>
                                                <label className={styles.label}
                                                    htmlFor={`course-name-${idx}`}>Course Name</label>
                                                <input
                                                    className={styles.input}
                                                    id={`course-name-${idx}`}
                                                    type="text"
                                                    value={c.name}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setCourses(prev => prev.map((pc, i) => i === idx ? ({
                                                            ...pc,
                                                            name: v
                                                        }) : pc));
                                                    }}
                                                    placeholder="Name of the course..."
                                                    title="Full course title (no section)"

                                                />
                                            </div>
                                            <div className={`${styles.field} ${styles.full}`}>
                                                <label className={styles.label}
                                                    htmlFor={`course-reason-${idx}`}>Reason for taking</label>
                                                <textarea
                                                    className={styles.input}
                                                    id={`course-reason-${idx}`}
                                                    // type="text"
                                                    value={c.reason}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setCourses(prev => prev.map((pc, i) => i === idx ? ({
                                                            ...pc,
                                                            reason: v
                                                        }) : pc));
                                                    }}
                                                    placeholder="Why you're taking the course..."
                                                    title="Why you selected or need this course"

                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        {/* Quote */}
                        <div className={styles.gridTwo}>
                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="quote">Quote</label>
                                <textarea
                                    className={styles.textarea}
                                    id="quote"
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    placeholder="An inspiring or meaningful quote"
                                    title="Add a quote to appear after courses"
                                    rows={2}
                                />
                            </div>
                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label} htmlFor="quoteAuthor">Quote Author</label>
                                <input
                                    className={styles.input}
                                    id="quoteAuthor"
                                    type="text"
                                    value={quoteAuthor}
                                    onChange={(e) => setQuoteAuthor(e.target.value)}
                                    placeholder="Who said the quote"
                                    title="Name of the quote's author"
                                />
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        {/* Links */}
                        <div className={styles.gridTwo}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="cltWeb">CLT Web</label>
                                <input
                                    className={styles.input}
                                    id="cltWeb"
                                    type="url"
                                    value={linkCltWeb}
                                    onChange={(e) => setLinkCltWeb(e.target.value)}
                                    placeholder="https://webpages.charlotte.edu/username/"
                                    title="UNC Charlotte personal web URL"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="github">GitHub (profile)</label>
                                <input
                                    className={styles.input}
                                    id="github"
                                    type="url"
                                    value={linkGithub}
                                    onChange={(e) => setLinkGithub(e.target.value)}
                                    placeholder="https://github.com/username"
                                    title="GitHub profile URL"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="githubIo">GitHub.io</label>
                                <input
                                    className={styles.input}
                                    id="githubIo"
                                    type="url"
                                    value={linkGithubIo}
                                    onChange={(e) => setLinkGithubIo(e.target.value)}
                                    placeholder="https://username.github.io/"
                                    title="GitHub Pages (username.github.io)"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="courseIo">Course.io</label>
                                <input
                                    className={styles.input}
                                    id="courseIo"
                                    type="url"
                                    value={linkCourseIo}
                                    onChange={(e) => setLinkCourseIo(e.target.value)}
                                    placeholder="https://username.github.io/course/"
                                    title="Course page hosted on GitHub Pages"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="freeCodeCamp">freeCodeCamp (profile)</label>
                                <input
                                    className={styles.input}
                                    id="freeCodeCamp"
                                    type="url"
                                    value={linkFreeCodeCamp}
                                    onChange={(e) => setLinkFreeCodeCamp(e.target.value)}
                                    placeholder="https://www.freecodecamp.org/username"
                                    title="freeCodeCamp profile URL"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="codecademy">Codecademy (profile)</label>
                                <input
                                    className={styles.input}
                                    id="codecademy"
                                    type="url"
                                    value={linkCodecademy}
                                    onChange={(e) => setLinkCodecademy(e.target.value)}
                                    placeholder="https://www.codecademy.com/profiles/username"
                                    title="Codecademy profile URL"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="linkedIn">LinkedIn (profile)</label>
                                <input
                                    className={styles.input}
                                    id="linkedIn"
                                    type="url"
                                    value={linkLinkedIn}
                                    onChange={(e) => setLinkLinkedIn(e.target.value)}
                                    placeholder="https://www.linkedin.com/in/username/"
                                    title="LinkedIn profile URL"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            
            </div>
            </div>
        </div>
    </>
}
