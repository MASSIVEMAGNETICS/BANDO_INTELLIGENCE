
export type PersonaType = 'scientist' | 'ethicist' | 'engineer' | 'historian' | 'futurist';

export interface Expert {
  id: PersonaType;
  name: string;
  role: string;
  color: string;
  avatar: string;
  description: string;
  // Customizable attributes
  domain: string;
  style: string;
  principle: string;
}

export interface Message {
  id: string;
  expertId: PersonaType | 'director';
  content: string;
  timestamp: Date;
  isSearchUsed?: boolean;
  sources?: string[];
  targetExpertId?: PersonaType; // For directed questions
}

export interface DebateSession {
  topic: string;
  messages: Message[];
  status: 'idle' | 'generating' | 'paused';
}
