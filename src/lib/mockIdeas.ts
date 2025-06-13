import type { DreamIdea } from '@/types';

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
    status: 'private',
    createdAt: new Date(2024, 4, 10),
    updatedAt: new Date(2024, 5, 20),
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
    status: 'private',
    createdAt: new Date(2024, 5, 1),
    updatedAt: new Date(2024, 5, 15),
  },
  {
    id: 'idea-3',
    title: 'Community Skill-Share Platform',
    originalText: 'A local platform where people can offer and find services or lessons based on skills, like tutoring, gardening help, etc.',
    status: 'submitted', // This one is submitted
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
    createdAt: new Date(2024, 3, 20),
    updatedAt: new Date(2024, 6, 1),
  },
];
