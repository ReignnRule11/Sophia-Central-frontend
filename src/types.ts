export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  team: string;
  avatar: string;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  status: 'positive' | 'neutral' | 'warning';
};

export type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  risk: 'Low' | 'Medium' | 'High';
  due: string;
  status: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  tone: 'positive' | 'neutral' | 'warning';
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  capacity: number;
  focus: string;
  availability: string;
};

export type Insight = {
  id: string;
  title: string;
  summary: string;
  section: string;
  confidence: string;
  impact: string;
};
