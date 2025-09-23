export type Course = {
  dept: string
  number: string
  name: string
  reason: string
}

export type IntroLinks = {
  cltWeb: string
  github: string
  githubIo: string
  courseIo: string
  freeCodeCamp: string
  codecademy: string
  linkedIn: string
}

export type IntroFormValues = {
  slug: string
  firstName: string
  preferredName: string
  middleInitial: string
  lastName: string
  divider: string
  mascot: string
  image: string
  imageCaption: string
  personalStatement: string
  personalBackground: string
  professionalBackground: string
  academicBackground: string
  primaryComputer: string
  courses: Course[]
  quote: string
  quoteAuthor: string
  funnyThing: string
  interestingThing: string
  links: IntroLinks
}
