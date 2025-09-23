import {Dispatch, SetStateAction} from 'react'
import styles from '../IntroductionGenerator.module.css'
import {Course} from '../types'

type Props = {
  courses: Course[]
  setCourses: Dispatch<SetStateAction<Course[]>>
  showCourses: boolean
  setShowCourses: Dispatch<SetStateAction<boolean>>
}

const emptyCourse: Course = { dept: '', number: '', name: '', reason: '' }

export function CourseEditor({ courses, setCourses, showCourses, setShowCourses }: Props) {
  const addCourse = () => setCourses((prev) => [...prev, { ...emptyCourse }])

  const removeCourse = (index: number) =>
    setCourses((prev) => prev.filter((_, i) => i !== index))

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    setCourses((prev) =>
      prev.map((course, i) => (i === index ? { ...course, [field]: value } : course))
    )
  }

  return (
    <div className={styles.courses}>
      <div className={styles.rowBetween}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Courses</h4>
        <div className={styles.toolbar} style={{ width: 'fit-content' }}>
          {showCourses && (
            <button className={styles.btn} type="button" onClick={addCourse} aria-label="Add course">
              + Add Course
            </button>
          )}
          <button
            className={styles.btn}
            type="button"
            onClick={() => setShowCourses((prev) => !prev)}
            aria-label={showCourses ? 'Hide course editor' : 'Show course editor'}
          >
            {showCourses ? 'Hide Courses' : 'Show Courses'}
          </button>
        </div>
      </div>

      {!showCourses && (
        <p className={styles.hint}>
          {courses.length > 0 ? `${courses.length} course${courses.length === 1 ? '' : 's'} saved.` : 'No courses added yet.'}
        </p>
      )}

      {showCourses && (
        <>
          {courses.length === 0 && (
            <p className={styles.hint}>No courses added. Use "Add Course" to include one.</p>
          )}

          <div>
            {courses.map((course, idx) => (
              <div key={idx} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <span className={styles.muted}>Course {idx + 1}</span>
                  <button
                    className={styles.btn}
                    type="button"
                    onClick={() => removeCourse(idx)}
                    aria-label={`Remove course ${idx + 1}`}
                  >
                    Remove
                  </button>
                </div>
                <div className={styles.courseGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`course-dept-${idx}`}>Department Prefix</label>
                    <input
                      className={styles.input}
                      id={`course-dept-${idx}`}
                      type="text"
                      value={course.dept}
                      onChange={(e) => updateCourse(idx, 'dept', e.target.value)}
                      placeholder="Prefix"
                      title="Department prefix (e.g., ITIS, MATH)"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`course-number-${idx}`}>Course #</label>
                    <input
                      className={styles.input}
                      id={`course-number-${idx}`}
                      type="text"
                      value={course.number}
                      onChange={(e) => updateCourse(idx, 'number', e.target.value)}
                      placeholder="####"
                      title="Numeric course identifier (e.g., 3135)"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={`course-name-${idx}`}>Course Name</label>
                    <input
                      className={styles.input}
                      id={`course-name-${idx}`}
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                      placeholder="Name of the course..."
                      title="Full course title (no section)"
                      required
                    />
                  </div>
                  <div className={`${styles.field} ${styles.full}`}>
                    <label className={styles.label} htmlFor={`course-reason-${idx}`}>Reason for taking</label>
                    <textarea
                      className={styles.input}
                      id={`course-reason-${idx}`}
                      value={course.reason}
                      onChange={(e) => updateCourse(idx, 'reason', e.target.value)}
                      placeholder="Why you're taking the course..."
                      title="Why you selected or need this course"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
