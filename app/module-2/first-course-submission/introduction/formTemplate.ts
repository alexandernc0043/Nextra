import {Course, IntroLinks} from './types'

export const TEMPLATE_INTRO = {
  firstName: 'Alexander',
  preferredName: 'Alex',
  middleInitial: 'J',
  lastName: 'Prechtel',
  slug: 'alexander-prechtel',
  divider: '~',
  mascot: 'Advanced Pegasus',
  image: '/headshot.jpeg',
  imageCaption: 'At the beach on the eastern coast of Florida (2024)',
  personalStatement: 'I’m a junior at UNC Charlotte studying Computer Science with a focus in Cybersecurity. I’m excited to collaborate and build secure, user‑friendly systems this semester.',
  personalBackground: 'Grew up north of Charlotte, and have always had a love of computers.',
  professionalBackground: 'This is my first semester as an Instructional Assistant/Teachers Assistant, but before that I was a Peer Tutor for CCI.',
  academicBackground: 'I’m currently a Junior at UNC Charlotte studying computer science with a focus in Cybersecurity. Before that I attended Highschool in Mooresville, North Carolina.',
  primaryComputer: 'The laptop I use for university is a Macbook Pro M2 14 inch. I also use a custom built Windows 11 computer.',
  funnyThing: 'I can identify movie plots from their soundtrack within seconds.',
  interestingThing: 'I once built a solar-powered Raspberry Pi weather station for my neighborhood.',
  quote: 'Do what is right, not what is easy nor what is popular.',
  quoteAuthor: 'Roy T. Bennett',
  links: {
    cltWeb: 'https://webpages.charlotte.edu/aprechte',
    github: 'https://github.com/alexandernc0043',
    githubIo: 'https://alexandernc0043.github.io/',
    courseIo: 'https://alexandernc0043.github.io/itis3135/',
    freeCodeCamp: 'https://www.freecodecamp.org/aprechte',
    codecademy: 'https://www.codecademy.com/profiles/aprechte',
    linkedIn: 'https://www.linkedin.com/in/alexander-prechtel-b4a0a9283/',
  } as IntroLinks,
  courses: [
    {
      dept: 'ITIS',
      number: '4250',
      name: 'Computer Forensics',
      reason: 'Required course for my concentration but the course’s subject also interests me.',
    },
    {
      dept: 'ITIS',
      number: '3246',
      name: 'IT Infrastructure and Security',
      reason: 'Another required course for my concentration but this is another class I am interested in.',
    },
    {
      dept: 'THEA',
      number: '1512',
      name: 'Theatre in the United States',
      reason: 'I needed to take one more theme course and this one was recommended to me by a friend who took it previously.',
    },
    {
      dept: 'MATH',
      number: '2164',
      name: 'Matrices & Linear Algebra',
      reason: 'Required course for the Computer Science degree.',
    },
    {
      dept: 'BIOL',
      number: '1110',
      name: 'Principles of Biology I',
      reason: 'I needed to take another science course and this was recommended to me by a friend.',
    },
    {
      dept: 'BIOL',
      number: '1110L',
      name: 'Principles of Biology I Lab',
      reason: 'I needed to take a science course with its lab.',
    },
  ] as Course[],
} as const

export const LINK_LABELS: Record<keyof typeof TEMPLATE_INTRO.links, string> = {
  cltWeb: 'CLT Web URL',
  github: 'GitHub profile URL',
  githubIo: 'GitHub.io URL',
  courseIo: 'Course.io URL',
  freeCodeCamp: 'freeCodeCamp profile URL',
  codecademy: 'Codecademy profile URL',
  linkedIn: 'LinkedIn profile URL',
}

export const cloneTemplateCourses = (): Course[] =>
  TEMPLATE_INTRO.courses.map((course) => ({ ...course }))
