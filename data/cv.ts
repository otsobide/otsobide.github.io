export interface Logo {
  /** Path under public/, e.g. /img/logos/uma.png */
  src: string
  alt: string
}

const logos = {
  uma: { src: '/img/logos/uma.png', alt: 'University of Malaga' },
  etsi: { src: '/img/logos/etsi-informatica.png', alt: 'ETSI Informática, University of Malaga' },
  nics: { src: '/img/logos/nics.png', alt: 'NICS Lab' },
} satisfies Record<string, Logo>

export const researchProfile =
  'Cybersecurity Researcher and PhD Candidate. Focused on Cyber Threat Intelligence and Adversarial Emulation to simulate attacker behaviour, anticipate threats and strengthen defenses. Former Software Engineer with experience designing scalable, high-availability, event-driven systems.'

export const researchInterests = [
  'Cyber Threat Intelligence',
  'Threat Hunting',
  'Adversary Emulation',
  'APT Imitation',
  'Attack Attribution',
  'CTI Sharing',
  'Critical Infrastructures',
]

export interface TimelineEntry {
  role: string
  where: string
  location?: string
  period: string
  bullets?: string[]
  skills?: string[]
  /** Institution logo shown on the timeline; a dot is drawn when missing. */
  logo?: Logo
}

export const experience: TimelineEntry[] = [
  {
    role: 'Cybersecurity Researcher',
    where: 'Eurecat, Technology Centre',
    location: 'Barcelona, Spain',
    period: '2024, Present',
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and development of tools and methodologies to anticipate and respond to security incidents.',
    ],
  },
  {
    role: 'Cybersecurity Researcher',
    where: 'NicsLab, Research Group',
    location: 'Malaga, Spain',
    period: '2023, Present',
    logo: logos.nics,
    bullets: [
      'Research in cybersecurity with a strong emphasis on Cyber Threat Intelligence and Adversary Emulation applied to Critical Infrastructures.',
      'Leveraging digital twins to model and simulate complex systems for threat anticipation, and deploying honeypots to attract, deceive and analyze adversarial behaviors.',
    ],
  },
  {
    role: 'Cybersecurity Researcher',
    where: 'NICT, Japan National Cybersecurity Agency',
    location: 'Tokyo, Japan',
    period: '2026 (4 months)',
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and development of tools and methodologies to anticipate and respond to security incidents.',
    ],
  },
  {
    role: 'Software Engineer',
    where: 'T2C, IT Consulting Company',
    location: 'Barcelona, Spain',
    period: '2020, 2023',
    bullets: [
      'Design and development of systems using architectures like Domain-Driven Design (DDD), Microservices and Hexagonal Architecture, focused on high scalability and handling large data volumes.',
      'Emphasis on reliability, observability and event-driven communication.',
    ],
  },
  {
    role: 'Software Developer',
    where: 'DeveryWare, IT Consulting Company',
    location: 'Paris, France',
    period: '2019, 2020',
    bullets: [
      'Development of applications using Bash, Linux, Angular, JavaScript, MongoDB, Docker and Node.js.',
      'Implementation of SOLID principles to ensure clean, scalable and maintainable code.',
    ],
  },
  {
    role: 'Software Developer',
    where: 'Internalia Group, Software Product Company',
    location: 'Malaga, Spain',
    period: '2018 (4 months)',
    bullets: [
      'Development of web applications using PHP, JavaScript, SQL and Linux systems.',
      'Implementation of SOLID principles to ensure clean, scalable and maintainable code.',
    ],
  },
]

export const education: TimelineEntry[] = [
  {
    role: 'Ph.D. in Computer Science',
    where: 'University of Malaga',
    location: 'Malaga, Spain',
    period: 'May 2024, ongoing',
    logo: logos.uma,
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and tools and methodologies to anticipate and respond to security incidents in complex environments.',
    ],
    skills: ['Cybersecurity', 'Artificial Intelligence', 'Cyber Threat Intelligence', 'High Availability'],
  },
  {
    role: "Master's in Computer Science",
    where: 'University of Malaga',
    location: 'Malaga, Spain',
    period: 'Oct 2021, Mar 2024',
    logo: logos.etsi,
    bullets: [
      "Master's Degree in Computer Engineering with a specialization in Cybersecurity.",
      'Advanced training in pentesting, malware analysis, secure programming, vulnerability discovery and exploitation, and methods to ensure system and data privacy and security.',
      "Master's Thesis: TanukiPot, Honeypot based on Digital Twins for Critical Infrastructures.",
    ],
    skills: ['Cybersecurity', 'Pentesting', 'Malware Analysis', 'Industrial Infrastructures'],
  },
  {
    role: "Bachelor's in Computer Science",
    where: 'University of Malaga',
    location: 'Malaga, Spain',
    period: 'Sep 2014, Sep 2020',
    logo: logos.etsi,
    bullets: [
      "Bachelor's Degree in Computer Engineering with a specialization in Software Engineering.",
      'Education focused on data structures, algorithm analysis and design, software development, databases and cybersecurity.',
      'Final Degree Project: Emergency Control and Prevention Platform.',
    ],
    skills: ['Computer Science', 'Network Design', 'Cybersecurity', 'Programming', 'Project Management'],
  },
]

export interface Certification {
  title: string
  issuer: string
  location: string
  date: string
  category: string
}

export const certifications: Certification[] = [
  {
    category: 'Languages',
    title: 'Japanese Language Proficiency Test N3',
    issuer: 'The Japan Foundation',
    location: 'Malaga, Spain',
    date: 'Jan 2025',
  },
  {
    category: 'Technology',
    title: 'University Extension Course on Blockchain Technologies',
    issuer: 'University of Malaga',
    location: 'Malaga, Spain',
    date: 'Jul 2025',
  },
]

export interface Award {
  title: string
  subtitle: string
  location: string
  description: string
}

export const awards: Award[] = [
  {
    title: "Outstanding Master's Thesis Award",
    subtitle: "RENIC Cybersecurity Awards for the Best National Master's Degree Thesis",
    location: 'Málaga, Spain',
    description:
      "Honored with the RENIC Cybersecurity Award for the Best National Master's Degree Thesis in Spain, granted by the Red de Excelencia Nacional de Investigación en Ciberseguridad (RENIC).",
  },
]

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Basque', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
  { name: 'Japanese', level: 'JLPT N3' },
  { name: 'Chinese', level: 'Basic proficiency' },
]
