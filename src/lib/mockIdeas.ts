
import type { DreamIdea, InvestmentOffer, Message } from '@/types';

const mockOffersIdea1: InvestmentOffer[] = [
  {
    id: 'offer-1-1',
    ideaId: 'idea-1',
    investorId: 'mock-investor-001', 
    investorName: 'Alpha Ventures',
    investorFocus: 'Early Stage Tech, SaaS', 
    type: 'investment',
    amount: 25000,
    message: 'Impressed with the seaweed concept. We propose an initial seed investment of $25,000 for 15% equity, contingent on prototype validation.',
    status: 'pending',
    createdAt: new Date(2024, 6, 1),
    updatedAt: new Date(2024, 6, 1),
  },
  {
    id: 'offer-1-2',
    ideaId: 'idea-1',
    investorId: 'mock-investor-002',
    investorName: 'EcoFund Partners',
    investorFocus: 'Sustainability, Circular Economy',
    type: 'investment',
    amount: 30000,
    message: 'We see great potential. Offering $30,000 for 18% equity. Interested in your go-to-market strategy.',
    status: 'pending',
    createdAt: new Date(2024, 6, 3),
    updatedAt: new Date(2024, 6, 3),
  },
];

const mockCommunicationsIdea1: Message[] = [
  {
    id: 'msg-1-1',
    ideaId: 'idea-1',
    senderId: 'mock-investor-001', 
    senderName: 'Alpha Ventures',
    content: 'Following up on our offer. Are you available for a call next week to discuss?',
    timestamp: new Date(2024, 6, 5, 10, 0),
    read: false,
  },
  {
    id: 'msg-1-2',
    ideaId: 'idea-1',
    senderId: 'dreamer-mock-user', 
    senderName: 'Dreamer (You)',
    content: 'Thank you for the offer and message! Yes, I am available. How about Tuesday at 2 PM?',
    timestamp: new Date(2024, 6, 5, 14, 0),
    read: true,
  },
];


export const mockUserIdeas: DreamIdea[] = [
  {
    id: 'idea-1',
    title: 'Eco-Friendly Packaging Solution',
    originalText: 'A new type of biodegradable packaging made from seaweed that dissolves in water after use.',
    refinedText: 'A revolutionary biodegradable packaging solution derived from sustainably sourced seaweed. This innovative material not only decomposes naturally but is also designed to dissolve harmlessly in water, addressing plastic pollution at its core. Potential applications span food, cosmetics, and e-commerce industries.',
    suggestions: [
      'Research patentability of the seaweed processing technique.',
      'Develop a prototype and test its durability and shelf-life.',
      'Identify key target industries and their specific packaging needs.',
      'Explore partnerships with environmental organizations.',
    ],
    goals: [
      { id: 'g1-1', text: 'Finalize seaweed formula', completed: true },
      { id: 'g1-2', text: 'Build MVP prototype', completed: false },
      { id: 'g1-3', text: 'Contact 3 potential clients', completed: false },
    ],
    meetings: [
      { id: 'm1-1', title: 'Material Scientist Consultation', date: new Date(2024, 6, 15, 10, 0) },
      { id: 'm1-2', title: 'Investor Pitch Practice', date: new Date(2024, 7, 1, 14, 0) },
    ],
    researchLinks: [
      { id: 'rl1-1', title: 'Seaweed Packaging Innovations 2024', url: 'https://example.com/seaweed-innovations', description: 'Recent breakthroughs in seaweed-based materials.'},
      { id: 'rl1-2', title: 'Biodegradable Material Standards EU', url: 'https://example.com/eu-biodegradable-standards', description: 'EU regulations for biodegradable products.'},
    ],
    contacts: [
      { id: 'c1-1', name: 'Dr. Algae Bloom', email: 'dralgae@example.com', notes: 'Expert in marine botanicals.'},
    ],
    researchNotes: "Key findings on seaweed tensile strength:\n- Varies by species and processing method.\n- Optimal drying temperature seems to be 60°C.\n- Need to investigate UV resistance.\n\nMarket competitors:\n- Company X: Focuses on mushroom-based packaging.\n- Company Y: Uses cornstarch PLA. Our seaweed solution offers better water solubility.\n",
    category: 'Sustainability', 
    status: 'reviewing_offers', 
    createdAt: new Date(2024, 4, 10),
    updatedAt: new Date(2024, 6, 5),
    offers: mockOffersIdea1,
    communications: mockCommunicationsIdea1,
    isPremier: true,
    premierUntil: new Date(Date.now() + 12 * 60 * 60 * 1000), 
  },
  {
    id: 'idea-2',
    title: 'AI Language Learning Companion',
    originalText: 'An app that uses AI to have realistic conversations with language learners, adapting to their skill level.',
    refinedText: 'An AI-powered language learning companion app that offers immersive, adaptive conversational practice. Utilizing advanced natural language processing, the app simulates realistic dialogues, dynamically adjusting complexity based on the user\'s proficiency. It provides real-time feedback on pronunciation, grammar, and vocabulary.',
    suggestions: [
      'Focus on a niche language pair for initial launch.',
      'Integrate gamification elements to enhance user engagement.',
      'Develop a clear monetization strategy (subscription, freemium).',
    ],
    goals: [
      { id: 'g2-1', text: 'Define core AI features', completed: true },
      { id: 'g2-2', text: 'Design UI/UX mockups', completed: true },
      { id: 'g2-3', text: 'Develop beta version', completed: false },
    ],
    meetings: [],
    researchLinks: [],
    contacts: [],
    researchNotes: '',
    category: 'Technology', 
    status: 'private',
    createdAt: new Date(2024, 5, 1),
    updatedAt: new Date(2024, 5, 15),
    offers: [],
    communications: [], 
    isPremier: false,
  },
  {
    id: 'idea-3',
    title: 'Community Skill-Share Platform',
    originalText: 'A local platform where people can offer and find services or lessons based on skills, like tutoring, gardening help, etc.',
    status: 'submitted',
    category: 'Social Impact', 
    refinedText: 'A hyper-local, community-driven skill-sharing platform designed to connect individuals for peer-to-peer services and learning. Users can offer or find expertise in various domains such as academic tutoring, home repairs, creative arts, and wellness coaching, fostering local economies and social connections.',
    suggestions: [
      'Implement a robust verification system for user safety.',
      'Consider a barter system alongside monetary transactions.',
      'Partner with local community centers or libraries for promotion.'
    ],
    goals: [
      { id: 'g3-1', text: 'Research competitor platforms', completed: true},
      { id: 'g3-2', text: 'Outline platform features', completed: true},
      { id: 'g3-3', text: 'Seek initial community feedback', completed: false}
    ],
    meetings: [
       { id: 'm3-1', title: 'Focus group with local residents', date: new Date(2024, 7, 10, 18, 0) }
    ],
    researchLinks: [],
    contacts: [],
    researchNotes: '',
    createdAt: new Date(2024, 3, 20),
    updatedAt: new Date(2024, 6, 1),
    offers: [
        {
        id: 'offer-3-1',
        ideaId: 'idea-3',
        investorId: 'mock-investor-003',
        investorName: 'Community First Fund',
        investorFocus: 'Social Enterprises, Local Impact',
        type: 'investment',
        amount: 10000,
        message: 'We support community initiatives. Offering $10,000 grant-like investment for pilot program.',
        status: 'pending',
        createdAt: new Date(2024, 6, 10),
        updatedAt: new Date(2024, 6, 10),
      }
    ],
    communications: [], 
    isPremier: true, 
    premierUntil: new Date(Date.now() + 36 * 60 * 60 * 1000), 
  },
  {
    id: 'idea-4',
    title: 'Urban Vertical Farming Kits',
    originalText: 'Easy-to-use vertical farming kits for city dwellers with limited space.',
    category: 'Sustainability', 
    refinedText: 'Compact, modular vertical farming kits designed for urban environments, enabling individuals to grow fresh produce indoors regardless of space constraints. Kits include automated lighting and watering systems, and are paired with an app for guidance and community support.',
    suggestions: [
        'Source sustainable materials for kit components.',
        'Develop a subscription model for seeds and nutrients.',
        'Create partnerships with local organic stores.'
    ],
    goals: [
        {id: 'g4-1', text: 'Design Phase 1 Kit', completed: true},
        {id: 'g4-2', text: 'Test with 10 urban users', completed: false}
    ],
    meetings: [],
    researchLinks: [],
    contacts: [],
    researchNotes: '',
    status: 'funded', 
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 6, 10),
    offers: [
      {
        id: 'offer-4-1',
        ideaId: 'idea-4',
        investorId: 'mock-investor-004',
        investorName: 'GreenGrowth Capital',
        investorFocus: 'Sustainable AgTech',
        type: 'investment',
        amount: 75000,
        message: 'We love the sustainability angle and market potential. Offer: $75,000 for 20% equity.',
        status: 'accepted', // This offer is accepted
        createdAt: new Date(2024, 5, 15),
        updatedAt: new Date(2024, 6, 10),
      },
    ],
    communications: [ 
        {
            id: 'msg-4-1',
            ideaId: 'idea-4',
            senderId: 'mock-investor-004',
            senderName: 'GreenGrowth Capital',
            content: 'Congratulations on accepting our offer! Let\'s schedule a kick-off meeting.',
            timestamp: new Date(2024, 6, 11, 9, 0),
            read: true,
          },
    ],
     isPremier: false,
  },
   {
    id: 'idea-5',
    title: 'Personalized Story App for Kids',
    originalText: 'An app that generates personalized stories for children using their name, interests, and selected characters.',
    refinedText: 'An interactive mobile application that leverages AI to create unique, personalized stories for children. Parents can input their child\'s name, interests (e.g., dinosaurs, space), and choose from a library of characters and themes. The app then generates an engaging story with illustrations, promoting literacy and creativity.',
    suggestions: [
      'Ensure content safety and age-appropriateness with robust filtering.',
      'Explore options for professional voice narration of stories.',
      'Consider a feature for children to draw or color illustrations within the app.'
    ],
    goals: [
      { id: 'g5-1', text: 'Develop story generation algorithm V1', completed: false },
      { id: 'g5-2', text: 'Design 10 character archetypes', completed: true },
      { id: 'g5-3', text: 'User testing with 20 families', completed: false },
    ],
    meetings: [
      { id: 'm5-1', title: 'Child Psychologist Consultation (Content Appropriateness)', date: new Date(2024, 8, 5, 11, 0) },
    ],
    researchLinks: [
       { id: 'rl5-1', title: 'Benefits of Personalized Learning', url: 'https://example.com/personalized-learning', description: 'Studies on how personalization impacts child development.'},
    ],
    contacts: [],
    researchNotes: "Potential illustration styles to explore: whimsical, cartoonish, storybook classic.\nMonetization: subscription for unlimited stories, or packs of new characters/themes.",
    category: 'Education',
    status: 'private',
    createdAt: new Date(2024, 6, 15),
    updatedAt: new Date(2024, 6, 20),
    offers: [],
    communications: [],
    isPremier: false,
  },
];

export const INVESTOR_MOCK_ID = 'mock-investor-001'; // Used as a generic ID for any investor action for now
export const INVESTOR_MOCK_NAME = 'Alpha Ventures'; // Used as a generic name
export const DREAMER_MOCK_ID = 'dreamer-mock-user';
export const DREAMER_MOCK_NAME = 'Dreamer (You)';
