import {ChangeEvent} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  mascot: string
  onMascotChange: (value: string) => void
  divider: string
  onDividerChange: (value: string) => void
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function MascotAndImageFields({
  mascot,
  onMascotChange,
  divider,
  onDividerChange,
  onImageFileChange,
}: Props) {
  return (
    <div className={`${styles.inlineRowMascot} ${styles.fullSpan}`}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="mascot">Mascot</label>
        <input
          className={styles.input}
          id="mascot"
          type="text"
          value={mascot}
          onChange={(e) => onMascotChange(e.target.value)}
          placeholder="Your mascot."
          title="Your chosen mascot for the course"
          required
        />
      </div>
      <div className={`${styles.field} ${styles.mi}`}>
        <label className={styles.label} htmlFor="divider">Divider</label>
        <input
          className={styles.input}
          id="divider"
          type="text"
          value={divider}
          onChange={(e) => onDividerChange(e.target.value)}
          placeholder="Divider"
          title="Symbol used to separate sections (e.g., ~ or |)"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="imageFile">Upload Image</label>
        <input
          className={styles.file}
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={onImageFileChange}
        />
      </div>
    </div>
  )
}
