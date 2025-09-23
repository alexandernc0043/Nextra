import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  firstName: string
  setFirstName: Dispatch<SetStateAction<string>>
  middleInitial: string
  setMiddleInitial: Dispatch<SetStateAction<string>>
  preferredName: string
  setPreferredName: Dispatch<SetStateAction<string>>
  lastName: string
  setLastName: Dispatch<SetStateAction<string>>
}

export function NameFields({
  firstName,
  setFirstName,
  middleInitial,
  setMiddleInitial,
  preferredName,
  setPreferredName,
  lastName,
  setLastName,
}: Props) {
  return (
    <div className={`${styles.inlineRowNames} ${styles.fullSpan}`}>
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
          required
        />
      </div>
      <div className={`${styles.field} ${styles.mi}`}>
        <label className={styles.label} htmlFor="middle">Middle Initial</label>
        <input
          className={styles.input}
          id="middle"
          type="text"
          value={middleInitial}
          onChange={(e) => setMiddleInitial(e.target.value)}
          placeholder="Your middle initial."
          title="Provide your middle initial, if applicable"
          required
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
          required
        />
      </div>
    </div>
  )
}
