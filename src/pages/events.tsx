import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BlurText, ScrollFloat, ScrollVelocity } from '@/components';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import {
  ClubEvent,
  EventType,
  EventStatus,
  EVENT_TYPES,
  EVENT_CATEGORY_THEMES,
  EVENT_STATUS_CONFIG,
} from '@/types/events';
import { subscribeToPublicEvents } from '@/services/eventService';

export default function EventsPage() {
  useScrollAnimations();

  // Real-time events state subscribed directly to Cloud Firestore
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<EventType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'All'>('All');

  // Real-time listener subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublicEvents(
      (liveEvents) => {
        setEvents(liveEvents);
        setLoading(false);
      },
      (err) => {
        console.warn('Live events spectator connection warning:', err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Filtered events by category and status
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory = selectedCategory === 'All' || ev.eventType === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || (ev.status || 'upcoming') === selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }, [events, selectedCategory, selectedStatus]);

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {}
    return dateStr;
  };

  const hasActiveEvents = events && events.length > 0;
  const liveCount = events.filter((e) => (e.status || 'upcoming') === 'live').length;
  const upcomingCount = events.filter((e) => (e.status || 'upcoming') === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;
  const cancelledCount = events.filter((e) => e.status === 'cancelled').length;

  return (
    <>
      <Head>
        <title>Tournaments &amp; Events — VRGC VIT Bhopal</title>
        <meta
          name="description"
          content="Official esports tournaments, VR hackathons, and gaming community events at VRGC VIT Bhopal."
        />
      </Head>

      {/* Bespoke Esports Animations & Hover Physics */}
      <style jsx global>{`
        @keyframes eventCardReveal {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes radarPing {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        @keyframes liveSheen {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .esports-event-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease !important;
          will-change: transform, box-shadow;
        }

        .esports-event-card:hover {
          transform: translateY(-8px) scale(1.012) !important;
          border-color: rgba(168, 85, 247, 0.55) !important;
          box-shadow: 0 25px 50px -12px rgba(123, 47, 255, 0.35),
                      0 0 30px rgba(168, 85, 247, 0.18) !important;
        }

        .esports-event-card.is-live-pulse {
          border-color: rgba(239, 68, 68, 0.6) !important;
          box-shadow: 0 15px 40px rgba(239, 68, 68, 0.22) !important;
        }

        .esports-event-card.is-live-pulse:hover {
          border-color: #ef4444 !important;
          box-shadow: 0 25px 60px -10px rgba(239, 68, 68, 0.45),
                      0 0 35px rgba(239, 68, 68, 0.3) !important;
        }

        .tactical-cta-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tactical-cta-btn:hover svg {
          transform: translate(2px, -2px);
        }

        .filter-chip-tab {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .filter-chip-tab:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <main style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
        {/* HERO SECTION */}
        <section className="ink-hero" style={{ minHeight: '62vh', paddingTop: '8.5rem', paddingBottom: '3.5rem' }}>
          <div className="hero-glow-backlight"></div>

          {/* Tactical Status Pill */}
          <div className="hero-badge-pill">
            <span
              className="hbp-dot"
              style={{
                backgroundColor: liveCount > 0 ? '#ef4444' : hasActiveEvents ? '#4ade80' : '#fbbf24',
                boxShadow: liveCount > 0 ? '0 0 12px #ef4444' : hasActiveEvents ? '0 0 10px #4ade80' : '0 0 10px #fbbf24',
                animation: liveCount > 0 ? 'dotPulse 1.2s infinite' : undefined,
              }}
            ></span>
            {liveCount > 0
              ? `LIVE NOW • ${liveCount} TOURNAMENT IN PROGRESS`
              : hasActiveEvents
              ? `CIRCUIT SCHEDULE • ${events.length} ACTIVE ${events.length === 1 ? 'EVENT' : 'EVENTS'}`
              : 'CIRCUIT OFF-SEASON • PLANNING NEXT EDITION'}
          </div>

          <div style={{ margin: '0.75rem 0 1.25rem', display: 'flex', justifyContent: 'center' }}>
            <BlurText
              text="COLLEGIATE TOURNAMENTS"
              delay={75}
              animateBy="words"
              direction="top"
              className="ink-mega-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 7.5vw, 6rem)',
                lineHeight: 0.94,
                justifyContent: 'center',
                textAlign: 'center',
              }}
            />
          </div>

          <p className="ink-hero-sub" style={{ marginBottom: '2.25rem', maxWidth: '680px' }}>
            From 100-player Battle Royale LANs in the central auditorium to 48-hour VR Game Jams in the spatial lab.
            Inspect verified schedules, live match states, and claim your registration slot.
          </p>

          <div className="ink-hero-actions">
            <a
              href="https://discord.gg/vrgc"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ink-primary tactical-cta-btn"
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Join Discord Server</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease' }}>
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
            <Link
              href="/live"
              className="btn-ink-outline"
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center' }}
            >
              Watch Live Stream Broadcasts
            </Link>
          </div>
        </section>

        {/* SIGNATURE VELOCITY TICKER MARQUEE */}
        <div
          style={{
            margin: '0 auto',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.1rem 0',
            background: 'linear-gradient(90deg, rgba(8, 2, 16, 0.9) 0%, rgba(18, 5, 36, 0.8) 50%, rgba(8, 2, 16, 0.9) 100%)',
          }}
        >
          <ScrollVelocity
            texts={[
              'CAMPUS LAN FINALS ✦ VR SPATIAL JAMS ✦ ₹50,000+ PRIZE POOLS ✦ ZERO LATENCY MATCHES ✦ 1000+ CONTENDERS ✦ OFFICIAL VIT BHOPAL DSW ✦ ',
              'CAMPUS LAN FINALS ✦ VR SPATIAL JAMS ✦ ₹50,000+ PRIZE POOLS ✦ ZERO LATENCY MATCHES ✦ 1000+ CONTENDERS ✦ OFFICIAL VIT BHOPAL DSW ✦ ',
            ]}
            velocity={30}
            className="scroll-velocity-item"
            scrollerStyle={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 2.2vw, 1.65rem)',
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '0.08em',
            }}
          />
        </div>

        {/* ── DYNAMIC EVENTS SHOWCASE SECTION ── */}
        <section className="ink-sec-layout" style={{ paddingTop: '4rem', paddingBottom: '7.5rem' }}>
          {/* Subtle loading state while establishing initial Firestore handshake */}
          {loading && !hasActiveEvents && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--white-muted)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  borderTopColor: '#c084fc',
                  margin: '0 auto 1.25rem',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '0.06em' }}>
                Connecting to live tournament schedule...
              </p>
            </div>
          )}

          {!loading && hasActiveEvents ? (
            <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '0 1rem' }}>
              {/* COMMAND DECK FILTER TOOLBAR */}
              <div
                style={{
                  background: 'rgba(12, 3, 24, 0.75)',
                  border: '1px solid rgba(168, 85, 247, 0.22)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.05)',
                  marginBottom: '2.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Header & Status Segmented Switcher */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#ef4444' }}></span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', color: '#c084fc', textTransform: 'uppercase' }}>
                        CIRCUIT SCHEDULE DIRECTORY
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#fff',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      FEATURED EVENTS
                    </h2>
                  </div>

                  {/* High-Tech Status Segmented Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(5, 1, 10, 0.8)',
                      padding: '0.35rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {[
                      { key: 'All', label: 'All Status' },
                      { key: 'live', label: 'Live Now', count: liveCount, isLive: true },
                      { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
                      { key: 'completed', label: 'Concluded', count: completedCount },
                      { key: 'cancelled', label: 'Cancelled', count: cancelledCount },
                    ].map((tab) => {
                      const isSelected = selectedStatus === tab.key;
                      const hasCount = tab.count !== undefined && tab.count > 0;

                      return (
                        <button
                          key={tab.key}
                          onClick={() => setSelectedStatus(tab.key as any)}
                          className="filter-chip-tab"
                          style={{
                            padding: '0.4rem 0.95rem',
                            borderRadius: '7px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            border: isSelected
                              ? tab.isLive
                                ? '1px solid rgba(239, 68, 68, 0.6)'
                                : '1px solid rgba(255, 255, 255, 0.2)'
                              : '1px solid transparent',
                            backgroundColor: isSelected
                              ? tab.isLive
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(255, 255, 255, 0.12)'
                              : 'transparent',
                            color: isSelected
                              ? '#ffffff'
                              : tab.isLive && hasCount
                              ? '#f87171'
                              : 'rgba(255, 255, 255, 0.55)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          {tab.isLive && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#ef4444',
                                boxShadow: hasCount ? '0 0 6px #ef4444' : undefined,
                                animation: hasCount ? 'dotPulse 1.2s infinite' : undefined,
                              }}
                            />
                          )}
                          {tab.label}
                          {hasCount && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                opacity: 0.8,
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Filter Chips Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.55rem',
                    alignItems: 'center',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginRight: '0.35rem',
                    }}
                  >
                    DISCIPLINE:
                  </span>

                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="filter-chip-tab"
                    style={{
                      padding: '0.4rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      border:
                        selectedCategory === 'All'
                          ? '1px solid #ef4444'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor:
                        selectedCategory === 'All' ? '#ef4444' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedCategory === 'All' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    All Events ({events.length})
                  </button>

                  {EVENT_TYPES.filter((t) => events.some((e) => e.eventType === t)).map((type) => {
                    const isSelected = selectedCategory === type;
                    const theme = EVENT_CATEGORY_THEMES[type] || EVENT_CATEGORY_THEMES.Other;
                    const count = events.filter((e) => e.eventType === type).length;

                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedCategory(type)}
                        className="filter-chip-tab"
                        style={{
                          padding: '0.4rem 0.95rem',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          border: isSelected
                            ? `1px solid ${theme.accentColor}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected
                            ? theme.accentColor
                            : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                          boxShadow: isSelected ? `0 0 15px ${theme.glow}` : undefined,
                        }}
                      >
                        {type} [{count}]
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EVENT CARDS SHOWCASE GRID */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '2rem',
                }}
              >
                {filteredEvents.map((ev, index) => {
                  const theme = EVENT_CATEGORY_THEMES[ev.eventType] || EVENT_CATEGORY_THEMES.Other;
                  const statusKey = ev.status || 'upcoming';
                  const statusConfig = EVENT_STATUS_CONFIG[statusKey] || EVENT_STATUS_CONFIG.upcoming;
                  const isLive = statusKey === 'live';
                  const isConcluded = statusKey === 'completed' || statusKey === 'cancelled';

                  return (
                    <div
                      key={ev.id}
                      className={`dept-card esports-event-card ${isLive ? 'is-live-pulse' : ''}`}
                      style={{
                        background: isLive
                          ? 'radial-gradient(ellipse at 50% 0%, rgba(45, 6, 20, 0.85) 0%, rgba(12, 1, 16, 0.97) 100%)'
                          : 'radial-gradient(ellipse at 50% 0%, rgba(28, 5, 48, 0.82) 0%, rgba(10, 1, 20, 0.96) 100%)',
                        border: isLive
                          ? '1px solid rgba(239, 68, 68, 0.5)'
                          : '1px solid rgba(168, 85, 247, 0.28)',
                        borderRadius: '20px',
                        padding: '1.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        opacity: isConcluded ? 0.72 : 1,
                        animation: 'eventCardReveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
                        animationDelay: `${index * 0.08}s`,
                      }}
                    >
                      {/* Watermark Index Number in Top-Right Corner */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1.25rem',
                          fontFamily: 'var(--font-display)',
                          fontSize: '4.5rem',
                          fontWeight: 900,
                          color: isLive ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255, 255, 255, 0.035)',
                          lineHeight: 1,
                          pointerEvents: 'none',
                          userSelect: 'none',
                          zIndex: 0,
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Top Glowing Laser Accent Stripe */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: isLive
                            ? 'linear-gradient(90deg, transparent, #ef4444, #ff3366, transparent)'
                            : `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
                          boxShadow: isLive ? '0 0 12px #ef4444' : undefined,
                        }}
                      ></div>

                      {/* Tactical HUD Corner Cut Bracket */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          width: '10px',
                          height: '10px',
                          borderRight: `2px solid ${isLive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                          borderBottom: `2px solid ${isLive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                          pointerEvents: 'none',
                        }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', position: 'relative', zIndex: 1 }}>
                        {/* Header Badges Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                          }}
                        >
                          {/* Discipline Category Badge */}
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              padding: '0.22rem 0.7rem',
                              borderRadius: '5px',
                              backgroundColor: theme.bgTint,
                              border: `1px solid ${theme.borderTint}`,
                              color: theme.accentColor,
                              boxShadow: `0 0 10px ${theme.bgTint}`,
                            }}
                          >
                            {theme.label}
                          </span>

                          {/* Dynamic Status Badge */}
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: statusConfig.color,
                              backgroundColor: statusConfig.bgTint,
                              border: `1px solid ${statusConfig.borderTint}`,
                              padding: '0.22rem 0.7rem',
                              borderRadius: '5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              boxShadow: statusConfig.glow || undefined,
                              position: 'relative',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: statusConfig.dotColor,
                                boxShadow: `0 0 6px ${statusConfig.dotColor}`,
                                animation: statusConfig.pulse ? 'dotPulse 1.2s infinite' : undefined,
                              }}
                            />
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Event Title */}
                        <h3
                          style={{
                            fontFamily: 'var(--font-head)',
                            fontSize: '1.38rem',
                            fontWeight: 700,
                            letterSpacing: '-0.015em',
                            color: '#ffffff',
                            lineHeight: 1.25,
                            margin: 0,
                          }}
                        >
                          {ev.name}
                        </h3>

                        {/* Logistics Tactical Match Pass */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.65rem',
                            padding: '0.95rem 1.05rem',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(8, 2, 16, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          {/* Schedule row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                            <span
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#f87171',
                                flexShrink: 0,
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                            </span>
                            <div style={{ overflow: 'hidden' }}>
                              <span style={{ display: 'block', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Schedule
                              </span>
                              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {formatDateLabel(ev.eventDate)}
                                {ev.eventTime ? ` // ${ev.eventTime}` : ''}
                              </span>
                            </div>
                          </div>

                          {/* Venue row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', paddingTop: '0.55rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                background: 'rgba(0, 240, 255, 0.12)',
                                border: '1px solid rgba(0, 240, 255, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#00f0ff',
                                flexShrink: 0,
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                            </span>
                            <div style={{ overflow: 'hidden' }}>
                              <span style={{ display: 'block', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Venue Arena
                              </span>
                              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {ev.venue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            color: 'var(--white-muted, #94a3b8)',
                            fontSize: '0.86rem',
                            lineHeight: 1.6,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {ev.description}
                        </p>
                      </div>

                      {/* Card Action Footer CTA */}
                      <div
                        style={{
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span style={{ fontSize: '0.68rem', color: isLive ? '#f87171' : 'rgba(255, 255, 255, 0.45)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {isLive
                            ? 'STAGE // BROADCAST'
                            : ev.status === 'completed'
                            ? 'ARCHIVED'
                            : ev.status === 'cancelled'
                            ? 'VOID'
                            : 'OFFICIAL LAN'}
                        </span>

                        {statusConfig.isActionable && ev.registrationLink ? (
                          <a
                            href={ev.registrationLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="btn-ink-primary tactical-cta-btn"
                            style={{
                              minHeight: '40px',
                              padding: '0.5rem 1.35rem',
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              background: isLive
                                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                                : undefined,
                              boxShadow: isLive
                                ? '0 0 20px rgba(239, 68, 68, 0.55)'
                                : '0 4px 15px rgba(123, 47, 255, 0.25)',
                            }}
                          >
                            <span>{statusConfig.buttonText}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease' }}>
                              <line x1="7" y1="17" x2="17" y2="7"/>
                              <polyline points="7 7 17 7 17 17"/>
                            </svg>
                          </a>
                        ) : (
                          <button
                            disabled
                            style={{
                              minHeight: '40px',
                              padding: '0.5rem 1.25rem',
                              fontSize: '0.74rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              color: 'rgba(255, 255, 255, 0.35)',
                              cursor: 'not-allowed',
                            }}
                          >
                            <span>{statusConfig.buttonText}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '4.5rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                    }}
                  >
                    <p style={{ color: 'var(--white-muted)', fontSize: '0.98rem', marginBottom: '1.25rem' }}>
                      No events found matching the active status and discipline filters.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedStatus('All');
                      }}
                      className="btn-ink-outline"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 1.35rem', cursor: 'pointer' }}
                    >
                      Reset Filter Deck
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : !loading && !hasActiveEvents ? (
            /* ── FALLBACK STANDBY CARD (When 0 active events exist) ── */
            <div
              className="events-standby-card"
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                background:
                  'radial-gradient(ellipse at 50% 30%, rgba(26, 4, 48, 0.7) 0%, rgba(10, 1, 20, 0.95) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '24px',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(168, 85, 247, 0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Radar scanner pulse beacon */}
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.75rem',
                  color: '#c084fc',
                  boxShadow: '0 0 35px rgba(168, 85, 247, 0.3)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    animation: 'radarPing 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                  }}
                />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>

              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.15em',
                  color: '#a855f7',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                CIRCUIT STATUS &bull; STANDBY
              </span>

              <ScrollFloat
                as="h2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                  color: '#fff',
                  lineHeight: 1.05,
                  marginBottom: '1.25rem',
                }}
              >
                NO ACTIVE EVENTS RIGHT NOW
              </ScrollFloat>

              <p
                style={{
                  color: 'var(--white-muted)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '540px',
                  margin: '0 auto 2.5rem',
                }}
              >
                All tournament brackets, LAN stages, and hackathons have concluded for this phase.
                Our team is actively engineering the upcoming circuit schedules and flagship campus LANs.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'center',
                }}
              >
                <a
                  href="https://discord.gg/vrgc"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ink-primary tactical-cta-btn"
                  style={{ minHeight: '46px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Join Discord Server</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </a>
                <Link
                  href="/about"
                  className="btn-ink-outline"
                  style={{ minHeight: '46px', display: 'inline-flex', alignItems: 'center' }}
                >
                  Explore The Studio
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
