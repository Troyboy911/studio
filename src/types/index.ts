
export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  notes?: string;
}

export interface ResearchLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Message {
  id: string;
  ideaId: string;
  senderId: string; // Could be 'dreamer-mock-id' or 'investor-mock-id' or 'system'
  senderName: string; // e.g., "Investor X" or "Dreamer"
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface InvestmentOffer {
  id: string;
  ideaId: string;
  investorId: string; // Mock, replace with actual ID if auth is added
  investorName: string;
  type: 'buyout' | 'investment';
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface DreamIdea {
  id: string;
  title: string;
  originalText: string;
  refinedText?: string;
  suggestions?: string[];
  goals: Goal[];
  meetings: Meeting[];
  researchLinks?: ResearchLink[];
  contacts?: Contact[];
  researchNotes?: string; // Could be Markdown
  status: 'private' | 'submitted' | 'funded' | 'acquired' | 'reviewing_offers';
  createdAt: Date;
  updatedAt: Date;
  offers?: InvestmentOffer[];
  communications?: Message[];
  isPremier?: boolean;
  premierUntil?: Date;
}

