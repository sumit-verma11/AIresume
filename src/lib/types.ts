export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface Resume {
  _id?: string;
  title: string;
  template: 'modern' | 'minimal' | 'professional';
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  sectionOrder: string[];
}

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
];

export const createEmptyResume = (): Omit<Resume, '_id'> => ({
  title: 'Untitled Resume',
  template: 'modern',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
});
