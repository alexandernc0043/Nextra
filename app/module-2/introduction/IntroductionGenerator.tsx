"use client";
import { SignInButton, SignedIn, SignedOut, useAuth, Protect } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react';
import styles from './IntroductionGenerator.module.css'

import { cloneTemplateCourses, TEMPLATE_INTRO } from './formTemplate'
import { validateIntroValues } from './validation'
import { Course, IntroFormValues, IntroLinks } from './types'
import { NameFields } from './components/NameFields'
import { MascotAndImageFields } from './components/MascotAndImageFields'
import { BioFields } from './components/BioFields'
import { FactsFields } from './components/FactsFields'
import { QuoteFields } from './components/QuoteFields'
import { LinksFields } from './components/LinksFields'
import { CourseEditor } from './components/CourseEditor'

export default function Page() {
    const { isSignedIn } = useAuth()
    const [firstName, setFirstName] = useState<string>(TEMPLATE_INTRO.firstName);
    const [preferredName, setPreferredName] = useState<string>(TEMPLATE_INTRO.preferredName);
    const [middleInitial, setMiddleInitial] = useState<string>(TEMPLATE_INTRO.middleInitial);
    const [lastName, setLastName] = useState<string>(TEMPLATE_INTRO.lastName);
    const [slug, setSlug] = useState<string>(TEMPLATE_INTRO.slug);
    const [customSlug, setCustomSlug] = useState(false);
    const [divider, setDivider] = useState<string>(TEMPLATE_INTRO.divider);
    const [mascot, setMascot] = useState<string>(TEMPLATE_INTRO.mascot);
    const [image, setImage] = useState<string>(TEMPLATE_INTRO.image)
    const [imageDataUrl, setImageDataUrl] = useState<string>("");
    const [imageFilename, setImageFilename] = useState<string>(() => {
        const parts = TEMPLATE_INTRO.image.split("/")
        return parts[parts.length - 1] || "image"
    })
    const imageObjectUrlRef = useRef<string | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)
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
    const [imageCaption, setImageCaption] = useState<string>(TEMPLATE_INTRO.imageCaption)
    const [today, setToday] = useState("")
    const [personalBackground, setPersonalBackground] = useState<string>(TEMPLATE_INTRO.personalBackground)
    const [personalStatement, setPersonalStatement] = useState<string>(TEMPLATE_INTRO.personalStatement)
    const [professionalBackground, setProfessionalBackground] = useState<string>(TEMPLATE_INTRO.professionalBackground)
    const [academicBackground, setAcademicBackground] = useState<string>(TEMPLATE_INTRO.academicBackground)
    const [primaryComputer, setPrimaryComputer] = useState<string>(TEMPLATE_INTRO.primaryComputer)
    const [courses, setCourses] = useState<Course[]>(() => cloneTemplateCourses())
    const [showCourses, setShowCourses] = useState(true)
    // New: quote and links
    const [quote, setQuote] = useState<string>(TEMPLATE_INTRO.quote)
    const [quoteAuthor, setQuoteAuthor] = useState<string>(TEMPLATE_INTRO.quoteAuthor)
    const [funnyThing, setFunnyThing] = useState<string>(TEMPLATE_INTRO.funnyThing)
    const [interestingThing, setInterestingThing] = useState<string>(TEMPLATE_INTRO.interestingThing)
    const [linkCltWeb, setLinkCltWeb] = useState<string>(TEMPLATE_INTRO.links.cltWeb)
    const [linkGithub, setLinkGithub] = useState<string>(TEMPLATE_INTRO.links.github)
    const [linkGithubIo, setLinkGithubIo] = useState<string>(TEMPLATE_INTRO.links.githubIo)
    const [linkCourseIo, setLinkCourseIo] = useState<string>(TEMPLATE_INTRO.links.courseIo)
    const [linkFreeCodeCamp, setLinkFreeCodeCamp] = useState<string>(TEMPLATE_INTRO.links.freeCodeCamp)
    const [linkCodecademy, setLinkCodecademy] = useState<string>(TEMPLATE_INTRO.links.codecademy)
    const [linkLinkedIn, setLinkLinkedIn] = useState<string>(TEMPLATE_INTRO.links.linkedIn)


    const slugify = (v: string) => v
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'intro';

    const [slugAvailability, setSlugAvailability] = useState<'unknown' | 'checking' | 'available' | 'taken'>('unknown')
    // Check if slug exists in DB (if configured). Debounced.
    useEffect(() => {
        const s = slugify(slug)
        if (s !== slug) {
            setSlug(s)
        }
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
    const collectData = (): IntroFormValues => ({
        slug,
        firstName,
        preferredName,
        middleInitial,
        lastName,
        divider,
        mascot,
        image: imageDataUrl || image || TEMPLATE_INTRO.image,
        imageCaption,
        personalStatement,
        personalBackground,
        professionalBackground,
        academicBackground,
        primaryComputer,
        courses,
        quote,
        quoteAuthor,
        funnyThing,
        interestingThing,
        links: {
            cltWeb: linkCltWeb,
            github: linkGithub,
            githubIo: linkGithubIo,
            courseIo: linkCourseIo,
            freeCodeCamp: linkFreeCodeCamp,
            codecademy: linkCodecademy,
            linkedIn: linkLinkedIn,
        } as IntroLinks,
    })

    const applyDataToForm = (json: any) => {
        try {
            setFirstName(json.firstName || '')
            setPreferredName(json.preferredName || '')
            setMiddleInitial(json.middleInitial || '')
            setLastName(json.lastName || '')
            if (typeof json.slug === 'string' && json.slug.trim()) {
                setSlug(json.slug)
                setCustomSlug(true)
            }
            setDivider(json.divider || TEMPLATE_INTRO.divider)
            setMascot(json.mascot || TEMPLATE_INTRO.mascot)
            if (json.image) {
                setImage(json.image)
                setImageDataUrl(typeof json.image === 'string' && json.image.startsWith('data:') ? json.image : '')
            } else {
                setImage(TEMPLATE_INTRO.image)
                setImageDataUrl('')
            }
            setImageCaption(json.imageCaption || TEMPLATE_INTRO.imageCaption)
            setPersonalBackground(json.personalBackground || TEMPLATE_INTRO.personalBackground)
            setPersonalStatement(json.personalStatement || TEMPLATE_INTRO.personalStatement)
            setProfessionalBackground(json.professionalBackground || TEMPLATE_INTRO.professionalBackground)
            setAcademicBackground(json.academicBackground || TEMPLATE_INTRO.academicBackground)
            setPrimaryComputer(json.primaryComputer || TEMPLATE_INTRO.primaryComputer)
            setCourses(Array.isArray(json.courses) ? json.courses.map((course: any) => ({
                dept: typeof course?.dept === 'string' ? course.dept : '',
                number: typeof course?.number === 'string' ? course.number : '',
                name: typeof course?.name === 'string' ? course.name : '',
                reason: typeof course?.reason === 'string' ? course.reason : '',
            })) : cloneTemplateCourses())
            setQuote(json.quote || TEMPLATE_INTRO.quote)
            setQuoteAuthor(json.quoteAuthor || TEMPLATE_INTRO.quoteAuthor)
            setFunnyThing(json.funnyThing || TEMPLATE_INTRO.funnyThing)
            setInterestingThing(json.interestingThing || TEMPLATE_INTRO.interestingThing)
            const links = json.links || {}
            setLinkCltWeb(links.cltWeb || TEMPLATE_INTRO.links.cltWeb)
            setLinkGithub(links.github || TEMPLATE_INTRO.links.github)
            setLinkGithubIo(links.githubIo || TEMPLATE_INTRO.links.githubIo)
            setLinkCourseIo(links.courseIo || TEMPLATE_INTRO.links.courseIo)
            setLinkFreeCodeCamp(links.freeCodeCamp || TEMPLATE_INTRO.links.freeCodeCamp)
            setLinkCodecademy(links.codecademy || TEMPLATE_INTRO.links.codecademy)
            setLinkLinkedIn(links.linkedIn || TEMPLATE_INTRO.links.linkedIn)
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
    }, [slug, firstName, preferredName, middleInitial, lastName, divider, mascot, image, imageDataUrl, imageCaption, personalBackground, personalStatement, professionalBackground, academicBackground, primaryComputer, courses, quote, quoteAuthor, funnyThing, interestingThing, linkCltWeb, linkGithub, linkGithubIo, linkCourseIo, linkFreeCodeCamp, linkCodecademy, linkLinkedIn])

    // const validateForm = () => validateIntroValues(collectData())

    const publish = async () => {
        if (!isSignedIn) {
            alert('Please sign in to publish your introduction.')
            return
        }
        if (formRef.current && !formRef.current.reportValidity()) {
            return
        }
        if (slugAvailability === 'taken') {
            alert('Slug is already taken, try another slug.')
            return
        }
        // const validationErrors = validateForm()
        // if (validationErrors.length > 0) {
        //     alert(`Please update your introduction before publishing:\n- ${validationErrors.join('\n- ')}`)
        //     return
        // }

        const s = slugify(slug)
        const dataToSave = {
            firstName,
            preferredName,
            middleInitial,
            lastName,
            divider,
            mascot,
            image: imageDataUrl || image || TEMPLATE_INTRO.image,
            imageCaption,
            personalStatement,
            personalBackground,
            professionalBackground,
            academicBackground,
            primaryComputer,
            courses,
            quote,
            quoteAuthor,
            funnyThing,
            interestingThing,
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
            if (!r.ok) {
                if (r.status === 401) {
                    alert('Please sign in to publish your introduction.')
                    return
                }
                if (r.status === 403) {
                    alert('You do not have permission to publish this introduction.')
                    return
                }
                throw new Error('Publish failed')
            }
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
        <SignedOut>
            <h3>You must be signed in to use this page.</h3>
        </SignedOut>
        <Protect>
            <div className={styles.page}>
                <div className={`${styles.max} ${styles.full}`}>
                    <div className={styles.container}>
                        <section className={styles.section}>
                            <div className={styles.header}>
                                <h2 className={styles.title}>Introduction Generator</h2>
                                <p className={styles.subtitle}>Fill out your details, then preview a polished introduction page.</p>
                            </div>
                            <h2>Form</h2>
                            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className={styles.form}>
                                <div className={styles.card}>
                                    <div className={styles.rowBetween}>
                                        <div className={styles.toolbar}>
                                            <span className={`${styles.badge} ${slugAvailability === 'available' ? styles.badgeSuccess : slugAvailability === 'taken' ? styles.badgeWarn : ''}`}>
                                                {slugAvailability === 'checking' ? 'Checking…' : slugAvailability === 'available' ? 'Available' : slugAvailability === 'taken' ? 'Taken' : 'Unknown'}
                                            </span>
                                            <input
                                                className={styles.input}
                                                type="text"
                                                value={slug}
                                                onChange={(e) => {
                                                    setSlug(e.target.value);
                                                    setCustomSlug(true);
                                                }}
                                                placeholder="my-intro-slug"
                                                title="Slug for the preview page"
                                                required
                                            />

                                            <SignedIn>
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    type="button"
                                                    onClick={publish}
                                                    aria-label="Publish introduction"
                                                    title="Save to the database and copy a shareable link"
                                                >
                                                    Publish
                                                </button>
                                            </SignedIn>
                                            <SignedOut>
                                                <SignInButton mode="modal">
                                                    <button
                                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                                        type="button"
                                                        aria-label="Sign in to publish introduction"
                                                        title="Sign in to publish introduction"
                                                    >
                                                        Sign in to publish
                                                    </button>
                                                </SignInButton>
                                            </SignedOut>


                                        </div>
                                    </div>

                                    <div className={styles.gridTwo}>
                                        <NameFields
                                            firstName={firstName}
                                            setFirstName={setFirstName}
                                            middleInitial={middleInitial}
                                            setMiddleInitial={setMiddleInitial}
                                            preferredName={preferredName}
                                            setPreferredName={setPreferredName}
                                            lastName={lastName}
                                            setLastName={setLastName}
                                        />
                                        <MascotAndImageFields
                                            mascot={mascot}
                                            onMascotChange={setMascot}
                                            divider={divider}
                                            onDividerChange={setDivider}
                                            onImageFileChange={handleImageFileChange}
                                        />
                                        <BioFields
                                            imageCaption={imageCaption}
                                            setImageCaption={setImageCaption}
                                            personalStatement={personalStatement}
                                            setPersonalStatement={setPersonalStatement}
                                            personalBackground={personalBackground}
                                            setPersonalBackground={setPersonalBackground}
                                            professionalBackground={professionalBackground}
                                            setProfessionalBackground={setProfessionalBackground}
                                            academicBackground={academicBackground}
                                            setAcademicBackground={setAcademicBackground}
                                            primaryComputer={primaryComputer}
                                            setPrimaryComputer={setPrimaryComputer}
                                        />
                                    </div>

                                    <hr className={styles.divider} />

                                    <FactsFields
                                        funnyThing={funnyThing}
                                        setFunnyThing={setFunnyThing}
                                        interestingThing={interestingThing}
                                        setInterestingThing={setInterestingThing}
                                    />

                                    <hr className={styles.divider} />

                                    <QuoteFields
                                        quote={quote}
                                        setQuote={setQuote}
                                        quoteAuthor={quoteAuthor}
                                        setQuoteAuthor={setQuoteAuthor}
                                    />

                                    <hr className={styles.divider} />

                                    <LinksFields
                                        linkCltWeb={linkCltWeb}
                                        setLinkCltWeb={setLinkCltWeb}
                                        linkGithub={linkGithub}
                                        setLinkGithub={setLinkGithub}
                                        linkGithubIo={linkGithubIo}
                                        setLinkGithubIo={setLinkGithubIo}
                                        linkCourseIo={linkCourseIo}
                                        setLinkCourseIo={setLinkCourseIo}
                                        linkFreeCodeCamp={linkFreeCodeCamp}
                                        setLinkFreeCodeCamp={setLinkFreeCodeCamp}
                                        linkCodecademy={linkCodecademy}
                                        setLinkCodecademy={setLinkCodecademy}
                                        linkLinkedIn={linkLinkedIn}
                                        setLinkLinkedIn={setLinkLinkedIn}
                                    />

                                    <CourseEditor
                                        courses={courses}
                                        setCourses={setCourses}
                                        showCourses={showCourses}
                                        setShowCourses={setShowCourses}
                                    />



                                </div>
                            </form>
                        </section>


                    </div>
                </div>
            </div>
        </Protect>

    </>
}
