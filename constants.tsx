
import { Expert } from './types';

export const DEFAULT_EXPERTS: Expert[] = [
  {
    id: 'scientist',
    name: 'Dr. Aris Thorne',
    role: 'Lead Scientist',
    color: '#0ea5e9',
    avatar: 'https://picsum.photos/seed/scientist/200/200',
    description: 'Focuses on empirical data and peer-reviewed evidence.',
    domain: 'Technical Sciences',
    style: 'Analytical & Objective',
    principle: 'Empiricism'
  },
  {
    id: 'ethicist',
    name: 'Sophia Vane',
    role: 'Moral Philosopher',
    color: '#f43f5e',
    avatar: 'https://picsum.photos/seed/ethicist/200/200',
    description: 'Evaluates societal impact and human rights.',
    domain: 'Ethics & Sociology',
    style: 'Reflective & Socratic',
    principle: 'Human-Centricity'
  },
  {
    id: 'engineer',
    name: 'Marcus Gear',
    role: 'Systems Architect',
    color: '#10b981',
    avatar: 'https://picsum.photos/seed/engineer/200/200',
    description: 'Builds practical solutions and infrastructure.',
    domain: 'Applied Engineering',
    style: 'Pragmatic & Technical',
    principle: 'Efficiency'
  },
  {
    id: 'historian',
    name: 'Prof. Julian Past',
    role: 'Global Historian',
    color: '#f59e0b',
    avatar: 'https://picsum.photos/seed/historian/200/200',
    description: 'Draws parallels from human history.',
    domain: 'World History',
    style: 'Narrative & Comparative',
    principle: 'Contextualism'
  },
  {
    id: 'futurist',
    name: 'Xara Nova',
    role: 'Strategic Futurist',
    color: '#8b5cf6',
    avatar: 'https://picsum.photos/seed/futurist/200/200',
    description: 'Speculates on transformative trends.',
    domain: 'Future Studies',
    style: 'Visionary & Speculative',
    principle: 'Possibilism'
  }
];

const createPreset = (overrides: Record<string, Partial<Expert>>) => 
  DEFAULT_EXPERTS.map(e => ({ ...e, ...(overrides[e.id] || {}) }));

export const ASSEMBLY_PRESETS = {
  "Standard": DEFAULT_EXPERTS,
  "Dev Team": createPreset({
    scientist: { role: 'Product Lead', domain: 'User Needs', style: 'Pragmatic' },
    ethicist: { role: 'Security Expert', domain: 'Cybersecurity', style: 'Skeptical' },
    engineer: { role: 'Lead Dev', domain: 'Architecture', style: 'Technical' },
    historian: { role: 'UX Researcher', domain: 'Human Factors', style: 'Analytical' },
    futurist: { role: 'Cloud Architect', domain: 'Scalability', style: 'Visionary' }
  }),
  "Research Team": createPreset({
    scientist: { role: 'Principal Investigator', domain: 'Natural Sciences', style: 'Academic' },
    ethicist: { role: 'IRB Reviewer', domain: 'Ethics', style: 'Formal' },
    engineer: { role: 'Data Engineer', domain: 'Large Datasets', style: 'Analytical' },
    historian: { role: 'Archivist', domain: 'Documentary History', style: 'Narrative' },
    futurist: { role: 'Hypothesis Generator', domain: 'Theory', style: 'Speculative' }
  }),
  "Marketing Team": createPreset({
    scientist: { role: 'Market Analyst', domain: 'Demographics', style: 'Analytical' },
    ethicist: { role: 'Brand Sentinel', domain: 'Public Perception', style: 'Diplomatic' },
    engineer: { role: 'Ad Ops Manager', domain: 'Automation', style: 'Technical' },
    historian: { role: 'Copywriter', domain: 'Storytelling', style: 'Casual' },
    futurist: { role: 'Trend Forecaster', domain: 'Consumer Behavior', style: 'Visionary' }
  }),
  "Legal Counsel": createPreset({
    scientist: { role: 'Forensic Expert', domain: 'Criminology', style: 'Objective' },
    ethicist: { role: 'Constitutional Scholar', domain: 'Human Rights', style: 'Formal' },
    engineer: { role: 'Patent Attorney', domain: 'IP Law', style: 'Precise' },
    historian: { role: 'Case Historian', domain: 'Precedent', style: 'Narrative' },
    futurist: { role: 'Regulatory Advisor', domain: 'Future Policy', style: 'Diplomatic' }
  }),
  "Music Studio": createPreset({
    scientist: { role: 'Acoustic Engineer', domain: 'Sound Physics', style: 'Technical' },
    ethicist: { role: 'Copyright Agent', domain: 'Licensing', style: 'Formal' },
    engineer: { role: 'Producer', domain: 'Digital Audio', style: 'Pragmatic' },
    historian: { role: 'Musicologist', domain: 'Music Theory', style: 'Analytical' },
    futurist: { role: 'Sound Designer', domain: 'Synthesis', style: 'Poetic' }
  }),
  "System Design": createPreset({
    scientist: { role: 'Network Scientist', domain: 'Topology', style: 'Technical' },
    ethicist: { role: 'Safety Engineer', domain: 'Reliability', style: 'Skeptical' },
    engineer: { role: 'Systems Architect', domain: 'Infrastructure', style: 'Analytical' },
    historian: { role: 'Legacy Specialist', domain: 'Migration', style: 'Narrative' },
    futurist: { role: 'Scalability Expert', domain: 'High Availability', style: 'Visionary' }
  })
};

export const DOMAINS = ['Biology', 'Economics', 'Cybersecurity', 'Space', 'Philosophy', 'Law', 'Physics', 'Architecture', 'Statistics', 'UX Design', 'Music Theory', 'Marketing', 'Public Policy'];
export const STYLES = ['Socratic', 'Aggressive', 'Poetic', 'Formal', 'Casual', 'Skeptical', 'Diplomatic', 'Analytical', 'Technical', 'Speculative', 'Pragmatic', 'Visionary'];
export const PRINCIPLES = ['Safety', 'Profit', 'Equality', 'Decentralization', 'Speed', 'Sustainability', 'Efficiency', 'Empiricism', 'Contextualism', 'Transparency', 'Redundancy'];
