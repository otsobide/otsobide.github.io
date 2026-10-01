import type { ImageMetadata } from 'astro';
import etsi from '../assets/logos/etsi-informatica.png';
import nics from '../assets/logos/nics.png';
import uma from '../assets/logos/uma.png';

export interface Logo {
  src: ImageMetadata;
  alt: string;
}

/** Institution logos for the timeline; drop new ones into src/assets/logos/. */
const logos = {
  etsi: { src: etsi, alt: 'ETSI Informática, University of Málaga' },
  nics: { src: nics, alt: 'NICS Lab' },
  uma: { src: uma, alt: 'University of Málaga' },
} satisfies Record<string, Logo>;

export const researchProfile =
  'Cybersecurity Researcher and PhD Candidate. Focused on Cyber Threat Intelligence and Adversarial Emulation to simulate attacker behaviour, anticipate threats and strengthen defenses. Former Software Engineer with experience designing scalable, high-availability, event-driven systems.';

export interface TimelineEntry {
  /** Omitted when the date is not relevant. */
  period?: string;
  role: string;
  where: string;
  location?: string;
  summary?: string;
  bullets?: string[];
  skills?: string[];
  logo?: Logo;
}

export const education: TimelineEntry[] = [
  {
    period: 'May 2024 – Present',
    role: 'Ph.D. in Computer Science',
    logo: logos.uma,
    where: 'University of Málaga',
    location: 'Málaga, Spain',
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and tools and methodologies to anticipate and respond to security incidents in complex environments.',
    ],
    skills: ['Cybersecurity', 'Artificial Intelligence', 'Cyber Threat Intelligence', 'High Availability'],
  },
  {
    period: 'Oct 2021 – Mar 2024',
    role: "Master's in Computer Science",
    logo: logos.etsi,
    where: 'University of Málaga',
    location: 'Málaga, Spain',
    bullets: [
      "Master's Degree in Computer Engineering with a specialization in Cybersecurity.",
      'Advanced training in pentesting, malware analysis, secure programming, vulnerability discovery and exploitation, and methods to ensure system and data privacy and security.',
      "Master's Thesis: TanukiPot, Honeypot based on Digital Twins for Critical Infrastructures.",
    ],
    skills: ['Cybersecurity', 'Pentesting', 'Malware Analysis', 'Industrial Infrastructures'],
  },
  {
    period: 'Sep 2014 – Sep 2020',
    role: "Bachelor's in Computer Science",
    logo: logos.etsi,
    where: 'University of Málaga',
    location: 'Málaga, Spain',
    bullets: [
      "Bachelor's Degree in Computer Engineering with a specialization in Software Engineering.",
      'Education focused on data structures, algorithm analysis and design, software development, databases and cybersecurity.',
      'Final Degree Project: Emergency Control and Prevention Platform.',
    ],
    skills: ['Computer Science', 'Network Design', 'Cybersecurity', 'Programming', 'Project Management'],
  },
];

export const researchExperience: TimelineEntry[] = [
  {
    period: '2026 (4 months)',
    role: 'Cybersecurity Researcher',
    where: 'NICT, Japan National Cybersecurity Agency',
    location: 'Tokyo, Japan',
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and development of tools and methodologies to anticipate and respond to security incidents.',
    ],
  },
  {
    period: '2024 – Present',
    role: 'Cybersecurity Researcher',
    where: 'Eurecat, Technology Centre',
    location: 'Barcelona, Spain',
    bullets: [
      'Cybersecurity research focused on Cyber Threat Intelligence, Threat Hunting and Adversarial Emulation.',
      'Analysis and detection of advanced threats, simulation of malicious behaviors, and development of tools and methodologies to anticipate and respond to security incidents.',
    ],
  },
  {
    period: '2023 – Present',
    role: 'Cybersecurity Researcher',
    logo: logos.nics,
    where: 'NicsLab, Research Group',
    location: 'Málaga, Spain',
    bullets: [
      'Research in cybersecurity with a strong emphasis on Cyber Threat Intelligence and Adversary Emulation applied to Critical Infrastructures.',
      'Leveraging digital twins to model and simulate complex systems for threat anticipation, and deploying honeypots to attract, deceive and analyze adversarial behaviors.',
    ],
  },
];

export const industryExperience: TimelineEntry[] = [
  {
    period: '2020 – 2023',
    role: 'Software Engineer',
    where: 'T2C, IT Consulting Company',
    location: 'Barcelona, Spain',
    bullets: [
      'Design and development of systems using architectures like Domain-Driven Design (DDD), Microservices and Hexagonal Architecture, focused on high scalability and handling large data volumes.',
      'Emphasis on reliability, observability and event-driven communication.',
    ],
  },
  {
    period: '2019 – 2020',
    role: 'Software Developer',
    where: 'DeveryWare, IT Consulting Company',
    location: 'Paris, France',
    bullets: [
      'Development of applications using Bash, Linux, Angular, JavaScript, MongoDB, Docker and Node.js.',
      'Implementation of SOLID principles to ensure clean, scalable and maintainable code.',
    ],
  },
  {
    period: '2018 (4 months)',
    role: 'Software Developer',
    where: 'Internalia Group, Software Product Company',
    location: 'Málaga, Spain',
    bullets: [
      'Development of web applications using PHP, JavaScript, SQL and Linux systems.',
      'Implementation of SOLID principles to ensure clean, scalable and maintainable code.',
    ],
  },
];

export const awards: TimelineEntry[] = [
  {
    role: "Outstanding Master's Thesis Award",
    where: "RENIC Cybersecurity Awards for the Best National Master's Degree Thesis",
    location: 'Málaga, Spain',
    summary:
      "Honored with the RENIC Cybersecurity Award for the Best National Master's Degree Thesis in Spain, granted by the Red de Excelencia Nacional de Investigación en Ciberseguridad (RENIC).",
  },
];

export const certifications: TimelineEntry[] = [
  {
    period: 'Jul 2025',
    role: 'University Extension Course on Blockchain Technologies',
    logo: logos.uma,
    where: 'University of Málaga',
    location: 'Málaga, Spain',
  },
  {
    period: 'Jan 2025',
    role: 'Japanese Language Proficiency Test N3',
    where: 'The Japan Foundation',
    location: 'Málaga, Spain',
  },
];

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Basque', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
  { name: 'Japanese', level: 'JLPT N3' },
  { name: 'Chinese', level: 'Basic proficiency' },
];

export const researchInterests = [
  'Cyber Threat Intelligence',
  'Threat Hunting',
  'Adversary Emulation',
  'APT imitation',
  'Attack attribution',
  'CTI sharing',
];
