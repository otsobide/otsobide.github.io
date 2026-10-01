export const site = {
  name: 'Javier Parada',
  firstName: 'Javier',
  lastName: 'Parada',
  role: 'Cybersecurity Researcher · PhD Candidate',
  description:
    'Cybersecurity researcher, Cyber Threat Hunting, Adversary Emulation and Threat Intelligence for critical infrastructures.',
  url: 'https://javierparada.phd',
  email: 'javierparada@cervantic.com',
  location: 'Barcelona · Malaga, Spain',
  cv: '/pdf/cv.pdf',
}

export interface NavItem {
  label: string
  to: string
}

export const nav: NavItem[] = [
  { label: 'About', to: '/' },
  { label: 'Publications', to: '/publications' },
  { label: 'Projects', to: '/projects' },
  { label: 'CV', to: '/cv' },
  { label: 'Activities', to: '/activities' },
  { label: 'Gallery', to: '/gallery' },
]

export interface Social {
  name: string
  icon: string
  href: string
  label: string
}

export const socials: Social[] = [
  { name: 'email', icon: 'lucide:mail', href: `mailto:${site.email}`, label: 'Email' },
  { name: 'github', icon: 'simple-icons:github', href: 'https://github.com/otsobide', label: 'GitHub' },
  { name: 'orcid', icon: 'simple-icons:orcid', href: 'https://orcid.org/0009-0003-5115-1802', label: 'ORCID' },
  { name: 'scholar', icon: 'simple-icons:googlescholar', href: 'https://scholar.google.com/citations?user=19rAzcMAAAAJ', label: 'Google Scholar' },
  { name: 'researchgate', icon: 'simple-icons:researchgate', href: 'https://www.researchgate.net/profile/Javier-Parada-6', label: 'ResearchGate' },
  { name: 'linkedin', icon: 'simple-icons:linkedin', href: 'https://www.linkedin.com/in/javier-parada', label: 'LinkedIn' },
  { name: 'x', icon: 'simple-icons:x', href: 'https://x.com/otsobide', label: 'X (Twitter)' },
]
