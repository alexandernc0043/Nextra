import {LINK_LABELS, TEMPLATE_INTRO} from './formTemplate'
import {Course, IntroFormValues} from './types'

const ensureCustomValue = (value: string, _templateValue: string, label: string, errors: string[]) => {
  const trimmed = value.trim()
  if (!trimmed) {
    errors.push(`${label} is required.`)
  }
}

export const validateIntroValues = (values: IntroFormValues): string[] => {
  const errors: string[] = []

  ensureCustomValue(values.slug, TEMPLATE_INTRO.slug, 'Slug', errors);
  ensureCustomValue(values.firstName, TEMPLATE_INTRO.firstName, 'First name', errors);
  ensureCustomValue(values.middleInitial, TEMPLATE_INTRO.middleInitial, 'Middle initial', errors);
  ensureCustomValue(values.lastName, TEMPLATE_INTRO.lastName, 'Last name', errors);
  ensureCustomValue(values.divider, TEMPLATE_INTRO.divider, 'Divider', errors);
  ensureCustomValue(values.mascot, TEMPLATE_INTRO.mascot, 'Mascot', errors);

  if (!values.image || values.image === TEMPLATE_INTRO.image) {
    errors.push('Upload a custom introduction image.')
  }

  ensureCustomValue(values.imageCaption, TEMPLATE_INTRO.imageCaption, 'Image caption', errors);
  ensureCustomValue(values.personalStatement, TEMPLATE_INTRO.personalStatement, 'Personal statement', errors);
  ensureCustomValue(values.personalBackground, TEMPLATE_INTRO.personalBackground, 'Personal background', errors);
  ensureCustomValue(values.professionalBackground, TEMPLATE_INTRO.professionalBackground, 'Professional background', errors);
  ensureCustomValue(values.academicBackground, TEMPLATE_INTRO.academicBackground, 'Academic background', errors);
  ensureCustomValue(values.primaryComputer, TEMPLATE_INTRO.primaryComputer, 'Primary computer', errors);
  ensureCustomValue(values.quote, TEMPLATE_INTRO.quote, 'Quote', errors);
  ensureCustomValue(values.quoteAuthor, TEMPLATE_INTRO.quoteAuthor, 'Quote author', errors);

  (Object.keys(values.links) as Array<keyof typeof TEMPLATE_INTRO.links>).forEach((key) => {
    ensureCustomValue(values.links[key], TEMPLATE_INTRO.links[key], LINK_LABELS[key], errors);
  })

  if (!values.courses.length) {
    errors.push('Add at least one course with your own details.')
  }

  values.courses.forEach((course, idx) => {
    ensureCustomValue(course.dept, '', `Course ${idx + 1} department`, errors);
    ensureCustomValue(course.number, '', `Course ${idx + 1} number`, errors);
    ensureCustomValue(course.name, '', `Course ${idx + 1} name`, errors);
    ensureCustomValue(course.reason, '', `Course ${idx + 1} reason`, errors);
  })

  return Array.from(new Set(errors))
}
