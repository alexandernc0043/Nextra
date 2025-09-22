import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  imageCaption: string
  setImageCaption: Dispatch<SetStateAction<string>>
  personalStatement: string
  setPersonalStatement: Dispatch<SetStateAction<string>>
  personalBackground: string
  setPersonalBackground: Dispatch<SetStateAction<string>>
  professionalBackground: string
  setProfessionalBackground: Dispatch<SetStateAction<string>>
  academicBackground: string
  setAcademicBackground: Dispatch<SetStateAction<string>>
  primaryComputer: string
  setPrimaryComputer: Dispatch<SetStateAction<string>>
}

export function BioFields({
  imageCaption,
  setImageCaption,
  personalStatement,
  setPersonalStatement,
  personalBackground,
  setPersonalBackground,
  professionalBackground,
  setProfessionalBackground,
  academicBackground,
  setAcademicBackground,
  primaryComputer,
  setPrimaryComputer,
}: Props) {
  return (
    <>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="imageCaption">Image Caption</label>
        <input
          className={styles.input}
          id="imageCaption"
          type="text"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          placeholder="Short description of the image"
          title="Describe the image for accessibility"
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="personalStatement">Personal Statement</label>
        <textarea
          className={styles.textarea}
          id="personalStatement"
          value={personalStatement}
          onChange={(e) => setPersonalStatement(e.target.value)}
          placeholder="A brief personal statement or summary"
          title="Add a short personal statement to include in your intro"
          rows={3}
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="personalBackground">Personal Background</label>
        <textarea
          className={styles.textarea}
          id="personalBackground"
          value={personalBackground}
          onChange={(e) => setPersonalBackground(e.target.value)}
          placeholder="A few sentences about you"
          title="Share a bit about your personal background"
          rows={3}
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="professionalBackground">Professional Background</label>
        <textarea
          className={styles.textarea}
          id="professionalBackground"
          value={professionalBackground}
          onChange={(e) => setProfessionalBackground(e.target.value)}
          placeholder="Work experience or roles"
          title="Jobs, internships, roles, notable projects"
          rows={3}
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="academicBackground">Academic Background</label>
        <textarea
          className={styles.textarea}
          id="academicBackground"
          value={academicBackground}
          onChange={(e) => setAcademicBackground(e.target.value)}
          placeholder="Schools, major, focus, etc."
          title="Academic interests, research, concentrations, honors"
          rows={3}
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="primaryComputer">Primary Computer</label>
        <input
          className={styles.input}
          id="primaryComputer"
          type="text"
          value={primaryComputer}
          onChange={(e) => setPrimaryComputer(e.target.value)}
          placeholder="Your main device(s)"
          title="Your primary computer(s) or devices"
          required
        />
      </div>
    </>
  )
}
