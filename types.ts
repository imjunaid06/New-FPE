
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  clientId: string;
  assignedTo?: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  aiAnalysis?: string;
}

export interface AIAnalysisResponse {
  priority: TicketPriority;
  category: string;
  summary: string;
  sentiment: string;
}

export interface SystemSettings {
  appName: string;
  organizationName: string;
  supportEmail: string;
  aiModel: string;
  autoCategorization: boolean;
  defaultPriority: TicketPriority;
  retentionDays: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
