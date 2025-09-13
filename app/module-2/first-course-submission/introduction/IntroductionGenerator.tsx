"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './IntroductionGenerator.module.css'
type Course = { dept: string; number: string; name: string; reason: string }

export default function Page() {
    const [firstName, setFirstName] = useState("Alexander");
    const [preferredName, setPreferredName] = useState("Alex");
    const [middleInitial, setMiddleInitial] = useState("J");
    const [lastName, setLastName] = useState("Prechtel");
    const [divider, setDivider] = useState("~");
    const [mascot, setMascot] = useState("Advanced Pegasus");
    const [image, setImage] = useState("/headshot.jpeg")
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
    }
    useEffect(() => {
        return () => {
            if (imageObjectUrlRef.current) {
                URL.revokeObjectURL(imageObjectUrlRef.current)
            }
        }
    }, [])
    const [imageCaption, setImageCaption] = useState("At the beach on the eastern coast of Florida (2024)")
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
    const exportToJson = () => {
        const inferredFilename = imageFilename || (image ? (image.split("/").pop() || "image") : "image")
        const data = {
            firstName,
            preferredName,
            middleInitial,
            lastName,
            divider,
            mascot,
            image: `images/${inferredFilename}`,
            imageCaption,
            personalBackground,
            professionalBackground,
            academicBackground,
            primaryComputer,
            courses,
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        const safeName = [firstName, middleInitial, lastName].filter(Boolean).join("_") || "introduction"
        a.href = url
        a.download = `${safeName}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return <>
        <div className={styles.container}>
            <section className={styles.section}>
                <h2>Form</h2>
                <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                    <div className={styles.card}>
                        <div className={styles.rowBetween}>
                            <h3 style={{ margin: 0 }}>Edit Introduction</h3>
                            {/* <div>
                                <button
                                    type="button"
                                    onClick={exportToJson}

                                    aria-label="Export introduction to JSON"
                                    title="Download your introduction data as a JSON file"
                                >
                                    Export JSON
                                </button>
                            </div> */}
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
                    </div>
                </form>
            </section>

            <section className={styles.section}>
                <h2>Example</h2>
                <div>
                    <div className={`${styles.card} ${styles.preview}`}>
                        <p className={styles.hint}>I understand that what I put here is publicly available
                            on the web and I won’t put anything here I don’t
                            want the public to see {divider} {[
                                firstName?.trim()?.[0],
                                (middleInitial || "").trim()?.[0],
                                lastName?.trim()?.[0]
                            ].filter(Boolean).join("")} {divider} {new Date().toLocaleDateString()}</p>
                        <h3 style={{ marginTop: 0 }}>{firstName} {middleInitial}. &#34;{preferredName}&#34; {lastName} {divider} {mascot}</h3>
                        <figure>
                            {image === "" ? <img src={"/headshot.jpeg"} alt={imageCaption} width={500} height={500} /> :
                                <img src={image} alt={imageCaption} width={500} height={500} />}
                            <figcaption className={styles.hint}>
                                <em>{imageCaption}</em>
                            </figcaption>
                        </figure>

                        <ul>
                            <li>
                                {personalStatement && (
                                    <p>{personalStatement}</p>
                                )}
                            </li>
                            <li><strong>Personal
                                Background: </strong>{personalBackground === "" ? "None." : personalBackground}
                            </li>
                            <li><strong>Professional
                                Background: </strong>{professionalBackground === "" ? "None." : professionalBackground}
                            </li>
                            <li><strong>Academic
                                Background: </strong>{academicBackground === "" ? "None." : academicBackground}
                            </li>
                            <li><strong>Primary Computer: </strong>{primaryComputer === "" ? "None." : primaryComputer}
                            </li>
                            <li>
                                <strong>Courses:</strong>
                                <ul style={{ marginTop: '0.25rem' }}>
                                    {courses.length === 0 ? <li>No courses.</li> : courses.map(({
                                        dept,
                                        number,
                                        name,
                                        reason
                                    }, index) => <li
                                        key={index}><strong>{dept} {number} &mdash; {name}</strong>: {reason}</li>)}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </>
}
