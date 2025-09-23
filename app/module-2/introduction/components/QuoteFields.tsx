import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'

type Props = {
  quote: string
  setQuote: Dispatch<SetStateAction<string>>
  quoteAuthor: string
  setQuoteAuthor: Dispatch<SetStateAction<string>>
}

export function QuoteFields({ quote, setQuote, quoteAuthor, setQuoteAuthor }: Props) {
  return (
    <div className={styles.gridTwo}>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="quote">Quote</label>
        <textarea
          className={styles.textarea}
          id="quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="An inspiring or meaningful quote"
          title="Add a quote to appear after courses"
          rows={2}
          required
        />
      </div>
      <div className={`${styles.field} ${styles.fullSpan}`}>
        <label className={styles.label} htmlFor="quoteAuthor">Quote Author</label>
        <input
          className={styles.input}
          id="quoteAuthor"
          type="text"
          value={quoteAuthor}
          onChange={(e) => setQuoteAuthor(e.target.value)}
          placeholder="Who said the quote"
          title="Name of the quote's author"
          required
        />
      </div>
    </div>
  )
}
