import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  linkCltWeb: string
  setLinkCltWeb: Dispatch<SetStateAction<string>>
  linkGithub: string
  setLinkGithub: Dispatch<SetStateAction<string>>
  linkGithubIo: string
  setLinkGithubIo: Dispatch<SetStateAction<string>>
  linkCourseIo: string
  setLinkCourseIo: Dispatch<SetStateAction<string>>
  linkFreeCodeCamp: string
  setLinkFreeCodeCamp: Dispatch<SetStateAction<string>>
  linkCodecademy: string
  setLinkCodecademy: Dispatch<SetStateAction<string>>
  linkLinkedIn: string
  setLinkLinkedIn: Dispatch<SetStateAction<string>>
}

export function LinksFields({
  linkCltWeb,
  setLinkCltWeb,
  linkGithub,
  setLinkGithub,
  linkGithubIo,
  setLinkGithubIo,
  linkCourseIo,
  setLinkCourseIo,
  linkFreeCodeCamp,
  setLinkFreeCodeCamp,
  linkCodecademy,
  setLinkCodecademy,
  linkLinkedIn,
  setLinkLinkedIn,
}: Props) {
  return (
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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
          required
        />
      </div>
    </div>
  )
}
