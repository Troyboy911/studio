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

export interface DreamIdea {
  id: string;
  title: string;
  originalText: string;
  refinedText?: string;
  suggestions?: string[];
  goals: Goal[];
  meetings: Meeting[];
  status: 'private' | 'submitted' | 'funded' | 'acquired';
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentOffer {
  id: string;
  ideaId: string;
  investorName: string; // Mock, replace with investorId if auth is added
  type: 'buyout' | 'investment';
  amount: number;
  message?: string;
  createdAt: Date;
}
