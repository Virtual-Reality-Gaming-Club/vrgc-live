import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BlurText, ScrollFloat } from '@/components';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import {
  ClubEvent,
  EventType,
  EVENT_TYPES,
  EVENT_CATEGORY_THEMES,
  MOCK_PUBLIC_EVENTS,
} from '@/types/events';

export default function EventsPage() {
  useScrollAnimations();

  // Local events state (using initial verified mock events for frontend testing)
  const [events] = useState<ClubEvent[]>(MOCK_PUBLIC_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<EventType | 'All'>('All');

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter((ev) => ev.eventType === selectedCategory);
  }, [events, selectedCategory]);

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

  return (
    <>
      <Head>
        <title>Tournaments &amp; Events — VRGC VIT Bhopal</title>
        <meta
          name="description"
          content="Official esports tournaments, VR hackathons, and gaming community events at VRGC VIT Bhopal."
        />
      </Head>
      <main style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
        {/* HERO SECTION */}
        <section className="ink-hero" style={{ minHeight: '60vh', paddingTop: '8.5rem', paddingBottom: '3rem' }}>
          <div className="hero-glow-backlight"></div>

          <div className="hero-badge-pill">
            <span
              className="hbp-dot"
              style={{
                backgroundColor: hasActiveEvents ? '#4ade80' : '#fbbf24',
                boxShadow: hasActiveEvents ? '0 0 10px #4ade80' : '0 0 10px #fbbf24',
              }}
            ></span>
            {hasActiveEvents
              ? `CIRCUIT ACTIVE • ${events.length} UPCOMING ${events.length === 1 ? 'EVENT' : 'EVENTS'}`
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

          <p className="ink-hero-sub" style={{ marginBottom: '2rem', maxWidth: '680px' }}>
            From 100-player Battle Royale LANs in the central auditorium to 48-hour VR Game Jams in the spatial lab.
            Compete, collaborate, and register for official campus titles below.
          </p>

          <div className="ink-hero-actions">
            <a
              href="https://discord.gg/vrgc"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ink-primary"
              style={{ minHeight: '46px', display: 'inline-flex', alignItems: 'center' }}
            >
              Join Discord Server ↗
            </a>
            <Link
              href="/live"
              className="btn-ink-outline"
              style={{ minHeight: '46px', display: 'inline-flex', alignItems: 'center' }}
            >
              Watch Past Streams
            </Link>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div className="trust-signals-bar">
          <div className="trust-item">
            <span className="trust-icon">&#10003;</span>
            <span>VERIFIED VIT BHOPAL DSW / STUDENT WELFARE APPROVED</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">&#9733;</span>
            <span>1,850+ STUDENTS REGISTERED ACROSS SEASONS</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">&#9889;</span>
            <span>&#8377;15,00,000+ CASH PRIZES DISTRIBUTED</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">&#128274;</span>
            <span>100% SECURE DISCORD BOT CHECK-IN</span>
          </div>
        </div>

        {/* ── DYNAMIC EVENTS SHOWCASE SECTION ── */}
        <section className="ink-sec-layout" style={{ paddingTop: '3.5rem', paddingBottom: '7rem' }}>
          {hasActiveEvents ? (
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              {/* Category Filter Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '2.5rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: '#fff',
                      margin: 0,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    FEATURED SCHEDULE
                  </h2>
                  <p style={{ color: 'var(--white-muted)', fontSize: '0.85rem', margin: '0.35rem 0 0' }}>
                    Select an event below to inspect schedule guidelines and claim your registration slot.
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      border:
                        selectedCategory === 'All'
                          ? '1px solid #ef4444'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor:
                        selectedCategory === 'All' ? '#ef4444' : 'rgba(255, 255, 255, 0.04)',
                      color: selectedCategory === 'All' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.2s ease',
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
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          border: isSelected
                            ? `1px solid ${theme.accentColor}`
                            : '1px solid rgba(255, 255, 255, 0.12)',
                          backgroundColor: isSelected
                            ? theme.accentColor
                            : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {type} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.75rem',
                }}
              >
                {filteredEvents.map((ev) => {
                  const theme = EVENT_CATEGORY_THEMES[ev.eventType] || EVENT_CATEGORY_THEMES.Other;

                  return (
                    <div
                      key={ev.id}
                      className="dept-card"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 0%, rgba(26, 4, 48, 0.8) 0%, rgba(10, 1, 20, 0.95) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Top Accent Stripe */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
                        }}
                      ></div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {/* Badges Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              padding: '0.2rem 0.65rem',
                              borderRadius: '4px',
                              backgroundColor: theme.bgTint,
                              border: `1px solid ${theme.borderTint}`,
                              color: theme.accentColor,
                            }}
                          >
                            {theme.label}
                          </span>

                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: '#4ade80',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#4ade80',
                                boxShadow: '0 0 8px #4ade80',
                              }}
                            ></span>
                            REGISTRATION OPEN
                          </span>
                        </div>

                        {/* Event Title - Razor sharp with Space Grotesk */}
                        <h3
                          style={{
                            fontFamily: 'var(--font-head)',
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            letterSpacing: '-0.015em',
                            color: '#ffffff',
                            lineHeight: 1.25,
                            margin: 0,
                          }}
                        >
                          {ev.name}
                        </h3>

                        {/* Logistics Strip: Date & Venue */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffd700' }}>
                            <span style={{ fontSize: '0.9rem' }}>🗓</span>
                            <span>
                              {formatDateLabel(ev.eventDate)}
                              {ev.eventTime ? ` • ${ev.eventTime}` : ''}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                            <span style={{ fontSize: '0.9rem' }}>📍</span>
                            <span>{ev.venue}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            color: 'var(--white-muted, #94a3b8)',
                            fontSize: '0.85rem',
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

                      {/* Register Button CTA */}
                      <div
                        style={{
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                          OFFICIAL LAN
                        </span>

                        <a
                          href={ev.registrationLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="btn-ink-primary"
                          style={{
                            minHeight: '38px',
                            padding: '0.45rem 1.25rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                          }}
                        >
                          <span>Register Now</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
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
              {/* Ambient radar pulse */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.75rem',
                  fontSize: '1.8rem',
                  color: '#c084fc',
                  boxShadow: '0 0 35px rgba(168, 85, 247, 0.3)',
                }}
              >
                &#9881;
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
                  className="btn-ink-primary"
                  style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
                >
                  Join Discord Server ↗
                </a>
                <Link
                  href="/about"
                  className="btn-ink-outline"
                  style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
                >
                  Explore The Studio
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
