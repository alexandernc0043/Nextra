import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  funnyThing: string
  setFunnyThing: Dispatch<SetStateAction<string>>
  interestingThing: string
  setInterestingThing: Dispatch<SetStateAction<string>>
}

export function FactsFields({
  funnyThing,
  setFunnyThing,
  interestingThing,
  setInterestingThing,
}: Props) {
  return (
    <div className={styles.gridTwo}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="funnyThing">Funny thing about me</label>
        <textarea
          className={styles.textarea}
          id="funnyThing"
          value={funnyThing}
          onChange={(e) => setFunnyThing(e.target.value)}
          placeholder="Share a lighthearted fact or quirk."
          title="Something funny or quirky about you"
          rows={2}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="interestingThing">Interesting thing about me</label>
        <textarea
          className={styles.textarea}
          id="interestingThing"
          value={interestingThing}
          onChange={(e) => setInterestingThing(e.target.value)}
          placeholder="Highlight an interesting skill, experience, or fact."
          title="Something intriguing or unique about you"
          rows={2}
        />
      </div>
    </div>
  )
}
