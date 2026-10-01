export const site = {
  name: 'Javier Parada',
  firstName: 'Javier',
  lastName: 'Parada',
  title: 'Cybersecurity Researcher & PhD Candidate',
  tagline: 'Cyber Threat Intelligence',
  description:
    'Cybersecurity researcher, Cyber Threat Hunting, Adversary Emulation and Threat Intelligence for critical infrastructures.',
  email: 'javierparada@cervantic.com',
  location: 'Barcelona · Málaga, Spain',
  cv: '/pdf/cv.pdf',
};

export interface Social {
  name: string;
  icon: 'mail' | 'github' | 'linkedin' | 'orcid' | 'scholar' | 'researchgate' | 'x';
  href: string;
  label: string;
}

export const socials: Social[] = [
  { name: 'email', icon: 'mail', href: `mailto:${site.email}`, label: 'Email' },
  { name: 'orcid', icon: 'orcid', href: 'https://orcid.org/0009-0003-5115-1802', label: 'ORCID' },
  {
    name: 'scholar',
    icon: 'scholar',
    href: 'https://scholar.google.com/citations?user=19rAzcMAAAAJ',
    label: 'Google Scholar',
  },
  {
    name: 'researchgate',
    icon: 'researchgate',
    href: 'https://www.researchgate.net/profile/Javier-Parada-6',
    label: 'ResearchGate',
  },
  { name: 'github', icon: 'github', href: 'https://github.com/otsobide', label: 'GitHub' },
  { name: 'linkedin', icon: 'linkedin', href: 'https://www.linkedin.com/in/javier-parada', label: 'LinkedIn' },
  { name: 'x', icon: 'x', href: 'https://x.com/otsobide', label: 'X (Twitter)' },
];

export const nav = [
  { label: 'About', href: '/' },
  { label: 'Activities', href: '/activities' },
  { label: 'Publications', href: '/publications' },
  { label: 'CV', href: '/cv' },
  // Projects and Gallery are hidden for now: to bring one back, restore its entry here
  // ({ label: 'Projects', href: '/projects' } / { label: 'Gallery', href: '/gallery' })
  // and rename src/pages/_projects.astro or src/pages/_gallery.astro back.
];
