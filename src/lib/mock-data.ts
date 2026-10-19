import { ActivityItem, Insight, Metric, Project, TeamMember, User } from '../types';

export const currentUser: User = {
  id: 'u-1',
  name: 'Maya Lopez',
  email: 'maya@sophiacentral.com',
  role: 'Head of Operations',
  title: 'Executive Director',
  team: 'Command Center',
  avatar: 'ML'
};

export const navItems = [
  { label: 'Overview', href: '/dashboard', icon: 'layout-grid' },
  { label: 'Projects', href: '/projects', icon: 'folder-kanban' },
  { label: 'Team', href: '/team', icon: 'users' },
  { label: 'Insights', href: '/insights', icon: 'chart-no-axes-combined' }
];

export const metrics: Metric[] = [
  { label: 'Active initiatives', value: '18', delta: '+3 this week', status: 'positive' },
  { label: 'Completion rate', value: '84%', delta: '+6.4% vs last month', status: 'positive' },
  { label: 'At-risk items', value: '5', delta: '2 require review', status: 'warning' },
  { label: 'Avg. cycle time', value: '11.2d', delta: '-1.3d faster', status: 'positive' }
];

export const projects: Project[] = [
  { id: 'p-1', name: 'AI Knowledge Hub', owner: 'Data Platform', progress: 76, risk: 'Low', due: 'Nov 12', status: 'On track' },
  { id: 'p-2', name: 'Partner CRM rollout', owner: 'Revenue Ops', progress: 52, risk: 'Medium', due: 'Nov 19', status: 'In review' },
  { id: 'p-3', name: 'Ops automation sprint', owner: 'Automation Guild', progress: 61, risk: 'Low', due: 'Nov 24', status: 'On track' },
  { id: 'p-4', name: 'Security patch migration', owner: 'Infrastructure', progress: 34, risk: 'High', due: 'Dec 02', status: 'Needs escalation' }
];

export const teamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Ariana Chen', role: 'Product Lead', capacity: 82, focus: 'Customer funnels', availability: 'Available now' },
  { id: 'tm-2', name: 'Jordan Smith', role: 'Platform Engineer', capacity: 68, focus: 'System resilience', availability: '2h blocked' },
  { id: 'tm-3', name: 'Priya Nair', role: 'Data Analyst', capacity: 91, focus: 'Insights', availability: 'Fully available' },
  { id: 'tm-4', name: 'Noah Patel', role: 'Operations PM', capacity: 57, focus: 'Risk review', availability: '1 dependency' }
];

export const activities: ActivityItem[] = [
  { id: 'a-1', title: 'Quarterly plan signed off', detail: 'Leadership approved the 2026 operating roadmap.', timestamp: '12 minutes ago', tone: 'positive' },
  { id: 'a-2', title: 'Security review flagged 3 checks', detail: 'Infrastructure is triaging platform access permissions.', timestamp: '1 hour ago', tone: 'warning' },
  { id: 'a-3', title: 'Partner feedback loop updated', detail: 'Customer success uploaded new churn signals to the Ops board.', timestamp: '3 hours ago', tone: 'neutral' },
  { id: 'a-4', title: 'Automation adoption crossed 60%', detail: 'Workflow completion improved across key teams.', timestamp: 'Yesterday', tone: 'positive' }
];

export const insights: Insight[] = [
  { id: 'i-1', title: 'Faster handoff from sales to onboarding', summary: 'Lead routing and onboarding touchpoints were trimmed by 2 days for the top 3 accounts.', section: 'Revenue', confidence: 'High', impact: 'Large' },
  { id: 'i-2', title: 'Support backlog trending down', summary: 'Support load is stabilizing after the new triage workflow.', section: 'Customer Success', confidence: 'Medium', impact: 'Medium' },
  { id: 'i-3', title: 'Platform reliability risk elevated', summary: 'A small cluster of services still shows intermittent latency spikes during peak load.', section: 'Infrastructure', confidence: 'High', impact: 'Large' }
];

export const pipeline = [68, 54, 72, 85, 76, 92, 81];
