export type EventType =
  | 'Tournament'
  | 'LAN Battle'
  | 'Workshop'
  | 'Hackathon'
  | 'Game Jam'
  | 'VR Experience'
  | 'Community Night'
  | 'Other';

export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface ClubEvent {
  id: string;
  name: string;
  description: string;
  venue: string;
  eventDate: string;       // YYYY-MM-DD
  eventTime?: string;      // e.g. "17:00 IST" or "10:00 AM - 48 Hours"
  eventType: EventType;
  registrationLink: string; // Target external registration URL
  status: EventStatus;
  bannerUrl?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const EVENT_TYPES: EventType[] = [
  'Tournament',
  'LAN Battle',
  'Workshop',
  'Hackathon',
  'Game Jam',
  'VR Experience',
  'Community Night',
  'Other',
];

export const EVENT_CATEGORY_THEMES: Record<
  EventType,
  { label: string; accentColor: string; bgTint: string; borderTint: string; glow: string }
> = {
  Tournament: {
    label: 'TOURNAMENT',
    accentColor: '#ef4444',
    bgTint: 'rgba(239, 68, 68, 0.12)',
    borderTint: 'rgba(239, 68, 68, 0.4)',
    glow: 'rgba(239, 68, 68, 0.25)',
  },
  'LAN Battle': {
    label: 'LAN BATTLE',
    accentColor: '#00f0ff',
    bgTint: 'rgba(0, 240, 255, 0.12)',
    borderTint: 'rgba(0, 240, 255, 0.4)',
    glow: 'rgba(0, 240, 255, 0.25)',
  },
  Workshop: {
    label: 'WORKSHOP',
    accentColor: '#c084fc',
    bgTint: 'rgba(192, 132, 252, 0.12)',
    borderTint: 'rgba(192, 132, 252, 0.4)',
    glow: 'rgba(192, 132, 252, 0.25)',
  },
  Hackathon: {
    label: 'HACKATHON',
    accentColor: '#fbbf24',
    bgTint: 'rgba(251, 191, 36, 0.12)',
    borderTint: 'rgba(251, 191, 36, 0.4)',
    glow: 'rgba(251, 191, 36, 0.25)',
  },
  'Game Jam': {
    label: 'GAME JAM',
    accentColor: '#f43f5e',
    bgTint: 'rgba(244, 63, 94, 0.12)',
    borderTint: 'rgba(244, 63, 94, 0.4)',
    glow: 'rgba(244, 63, 94, 0.25)',
  },
  'VR Experience': {
    label: 'VR DEMO',
    accentColor: '#818cf8',
    bgTint: 'rgba(129, 140, 248, 0.12)',
    borderTint: 'rgba(129, 140, 248, 0.4)',
    glow: 'rgba(129, 140, 248, 0.25)',
  },
  'Community Night': {
    label: 'COMMUNITY',
    accentColor: '#4ade80',
    bgTint: 'rgba(74, 222, 128, 0.12)',
    borderTint: 'rgba(74, 222, 128, 0.4)',
    glow: 'rgba(74, 222, 128, 0.25)',
  },
  Other: {
    label: 'EVENT',
    accentColor: '#94a3b8',
    bgTint: 'rgba(148, 163, 184, 0.12)',
    borderTint: 'rgba(148, 163, 184, 0.4)',
    glow: 'rgba(148, 163, 184, 0.25)',
  },
};

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  {
    label: string;
    color: string;
    dotColor: string;
    bgTint: string;
    borderTint: string;
    glow?: string;
    pulse: boolean;
    buttonText: string;
    isActionable: boolean;
  }
> = {
  live: {
    label: 'LIVE NOW',
    color: '#ef4444',
    dotColor: '#ef4444',
    bgTint: 'rgba(239, 68, 68, 0.15)',
    borderTint: 'rgba(239, 68, 68, 0.5)',
    glow: '0 0 10px rgba(239, 68, 68, 0.5)',
    pulse: true,
    buttonText: 'Join Event',
    isActionable: true,
  },
  upcoming: {
    label: 'UPCOMING',
    color: '#4ade80',
    dotColor: '#4ade80',
    bgTint: 'rgba(74, 222, 128, 0.12)',
    borderTint: 'rgba(74, 222, 128, 0.35)',
    glow: '0 0 8px rgba(74, 222, 128, 0.3)',
    pulse: false,
    buttonText: 'Register Now',
    isActionable: true,
  },
  completed: {
    label: 'COMPLETED',
    color: '#94a3b8',
    dotColor: '#64748b',
    bgTint: 'rgba(148, 163, 184, 0.1)',
    borderTint: 'rgba(148, 163, 184, 0.25)',
    pulse: false,
    buttonText: 'Concluded',
    isActionable: false,
  },
  cancelled: {
    label: 'CANCELLED',
    color: '#f87171',
    dotColor: '#dc2626',
    bgTint: 'rgba(239, 68, 68, 0.08)',
    borderTint: 'rgba(239, 68, 68, 0.25)',
    pulse: false,
    buttonText: 'Cancelled',
    isActionable: false,
  },
};

export const MOCK_PUBLIC_EVENTS: ClubEvent[] = [
  {
    id: 'event-valorant-2026',
    name: 'VRGC Valorant Campus Championship 2026',
    description: 'Annual 5v5 collegiate tactical shooter LAN tournament. Teams battle across Ascent, Haven, and Bind for a prize pool of ₹25,000 and the championship trophy.',
    venue: 'Central Auditorium & Spatial Lab (Lab 304)',
    eventDate: '2026-11-28',
    eventTime: '17:00 IST',
    eventType: 'Tournament',
    registrationLink: 'https://discord.gg/vrgc',
    status: 'upcoming',
    createdAt: '2026-11-17T10:00:00Z',
  },
  {
    id: 'event-vr-jam-2026',
    name: '48-Hour Spatial VR Game Jam',
    description: 'Build immersive Unity / Unreal VR experiences for Meta Quest 3 headsets. Mentors from the technical division will provide SDK walkthroughs and device hardware.',
    venue: 'Spatial Computing Lab • Academic Block 2',
    eventDate: '2026-12-05',
    eventTime: '10:00 AM - 48 Hours',
    eventType: 'Game Jam',
    registrationLink: 'https://discord.gg/vrgc',
    status: 'upcoming',
    createdAt: '2026-11-17T10:30:00Z',
  },
  {
    id: 'event-unreal-workshop',
    name: 'Unreal Engine 5 Shader & Lumen Masterclass',
    description: 'Hands-on practical session covering Nanite geometries, custom HLSL shader graphs, and real-time ray-traced lighting pipelines for next-generation interactive titles.',
    venue: 'Lab 102 • Computer Center',
    eventDate: '2026-12-12',
    eventTime: '14:30 - 17:30 IST',
    eventType: 'Workshop',
    registrationLink: 'https://discord.gg/vrgc',
    status: 'upcoming',
    createdAt: '2026-11-17T11:00:00Z',
  },
];
