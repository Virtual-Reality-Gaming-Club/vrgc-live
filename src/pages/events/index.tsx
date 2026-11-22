import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ScrollFloat } from '@/components';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import {
  ClubEvent,
  EVENT_CATEGORY_THEMES,
  EVENT_STATUS_CONFIG,
  MOCK_PUBLIC_EVENTS,
} from '@/types/events';
import { subscribeToPublicEvents } from '@/services/eventService';

export default function EventsPage() {
  useScrollAnimations();

  // Real-time events with fallback to verified events so the page is never empty
  const [events, setEvents] = useState<ClubEvent[]>(MOCK_PUBLIC_EVENTS);

  useEffect(() => {
    const unsubscribe = subscribeToPublicEvents(
      (liveEvents) => {
        if (liveEvents && liveEvents.length > 0) {
          setEvents(liveEvents);
        }
      },
      (err) => {
        console.warn('Live events connection warning:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
        {/* ── EVENTS SHOWCASE SECTION ── */}
        <section className="ink-section" style={{ paddingTop: '8.5rem', paddingBottom: '8rem' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
            <div className="itp-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="ink-sec-tag" style={{ justifyContent: 'center', marginBottom: '0.6rem' }}>
                <span className="tag-sq"></span> CAMPUS COMPETITIONS &bull; LIVE SCHEDULE
              </div>
              <ScrollFloat
                as="h2"
                containerClassName="itp-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                  lineHeight: 1,
                  color: '#fff',
                }}
              >
                FEATURED EVENTS
              </ScrollFloat>
            </div>

            {/* ── FLAGSHIP SHOWCASE: GTA VI VICE CITY EVENT TILE ── */}
            <div className="gta-spotlight-tile-wrap">
              <div className="gta-spotlight-tile">
                {/* Floating Top Right Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(15, 3, 28, 0.85)',
                      border: '1px solid rgba(0, 240, 255, 0.5)',
                      boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#00f0ff',
                        boxShadow: '0 0 8px #00f0ff',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#00f0ff',
                        letterSpacing: '0.1em',
                      }}
                    >
                      SAMVITYA 2026
                    </span>
                  </div>

                  <div
                    className="gta-badge-slant"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.35rem 0.85rem',
                      backgroundColor: 'rgba(123, 47, 255, 0.95)',
                    }}
                  >
                    <span>VTOP PASS EXCLUSIVE</span>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="gta-spotlight-content">
                  <div>
                    {/* Top Badges Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1.25rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div className="gta-badge-slant">
                        <span>★ SAMVITYA 2026 OFFICIAL SHOWDOWN ★</span>
                      </div>

                      {/* Wanted Level 5 Stars & Leonida Access Tag */}
                      <div className="gta-wanted-badge" style={{ padding: '0.35rem 0.85rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: '#ff2a85',
                            letterSpacing: '0.12em',
                            fontWeight: 700,
                          }}
                        >
                          LEONIDA CLEARANCE
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="gta-wanted-star"
                              style={{ fontSize: '1rem', animationDelay: `${star * 0.18}s` }}
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Logo & Headline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <img
                          src="/gta6/gta6_official_logo.png"
                          alt="Grand Theft Auto VI"
                          style={{
                            height: 'clamp(76px, 9vw, 98px)',
                            width: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 25px rgba(255, 42, 133, 0.75)) drop-shadow(0 0 50px rgba(0, 240, 255, 0.4))',
                          }}
                        />
                        <div>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              letterSpacing: '0.15em',
                              color: '#00f0ff',
                              textTransform: 'uppercase',
                              fontWeight: 700,
                              display: 'block',
                            }}
                          >
                            ■ SAMVITYA 2026 CAMPUS FLAGSHIP
                          </span>
                          <h3
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                              lineHeight: 0.95,
                              margin: '0.2rem 0 0',
                              textTransform: 'uppercase',
                              background: 'linear-gradient(135deg, #ffffff 30%, #ff85a2 70%, #00f0ff 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            VICE CITY SHOWDOWN
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Replaced copy requested by user: VRGC brings GTA 6 to Samvitya */}
                    <p
                      style={{
                        fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                        lineHeight: 1.6,
                        color: 'rgba(255, 255, 255, 0.92)',
                        margin: '0',
                        fontWeight: 500,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      VRGC brings Grand Theft Auto VI to Samvitya 2026. Step into Vice City for collegiate heist trials, precision wheel time-attacks, and verified venue access.
                    </p>
                  </div>

                  {/* Action CTA & Rockstar Watermark */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid rgba(255, 42, 133, 0.25)',
                    }}
                  >
                    <Link href="/events/gta6" className="gta-btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.15rem' }}>
                      <span>ENTER VICE CITY &bull; GET PASS &rarr;</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src="/gta6/Rockstar_Standalone.png"
                        alt="Rockstar Games"
                        style={{ height: '24px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(255, 42, 133, 0.5))' }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: '#ffa3b5',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        OFFICIAL FESTIVAL PORTAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MORE UPCOMING CAMPUS TOURNAMENTS ── */}
            <div
              style={{
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="tag-sq" style={{ backgroundColor: '#7b2fff' }}></span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#c084fc',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  MORE CAMPUS COMPETITIONS &bull; SEASON ROSTER
                </span>
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
              {events
                .filter((ev) => !ev.id.includes('gta6'))
                .map((ev, index) => {
                const theme = EVENT_CATEGORY_THEMES[ev.eventType] || EVENT_CATEGORY_THEMES.Other;
                const statusKey = ev.status || 'upcoming';
                const statusConfig = EVENT_STATUS_CONFIG[statusKey] || EVENT_STATUS_CONFIG.upcoming;
                const isLive = statusKey === 'live';
                const isGta6 = ev.id.includes('gta6');

                return (
                  <div
                    key={ev.id}
                    className={isGta6 ? 'pillar-card gta-featured-card' : 'pillar-card'}
                    style={{
                      minHeight: 'auto',
                      padding: '2.25rem 2rem 2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '16px',
                    }}
                  >
                    {/* Top Accent Stripe */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: isGta6 ? '4px' : '3px',
                        background: isGta6
                          ? 'linear-gradient(90deg, #ff2a85, #00f0ff, #f6a800, #ff2a85)'
                          : isLive
                          ? 'linear-gradient(90deg, transparent, #ef4444, #ff3366, transparent)'
                          : `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
                        boxShadow: isGta6
                          ? '0 0 16px rgba(255, 42, 133, 0.8)'
                          : isLive
                          ? '0 0 12px #ef4444'
                          : undefined,
                      }}
                    />

                    <div>
                      {/* Top Badges Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.14em',
                            fontWeight: 700,
                            color: isGta6 ? '#ff2a85' : theme.accentColor,
                            textTransform: 'uppercase',
                          }}
                        >
                          &#9632; {isGta6 ? 'GRAND THEFT AUTO VI' : theme.label}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: isGta6 ? '#00f0ff' : statusConfig.color,
                            backgroundColor: isGta6 ? 'rgba(0, 240, 255, 0.12)' : statusConfig.bgTint,
                            border: `1px solid ${isGta6 ? 'rgba(0, 240, 255, 0.4)' : statusConfig.borderTint}`,
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isGta6 ? '#00f0ff' : statusConfig.dotColor,
                              boxShadow: `0 0 6px ${isGta6 ? '#00f0ff' : statusConfig.dotColor}`,
                            }}
                          />
                          {isGta6 ? 'LEONIDA FESTIVAL' : statusConfig.label}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
                          fontWeight: 900,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          color: '#ffffff',
                          lineHeight: 1.05,
                          marginBottom: '1rem',
                          background: isGta6
                            ? 'linear-gradient(135deg, #ffffff 40%, #ff80bf 80%, #00f0ff 100%)'
                            : undefined,
                          WebkitBackgroundClip: isGta6 ? 'text' : undefined,
                          WebkitTextFillColor: isGta6 ? 'transparent' : undefined,
                        }}
                      >
                        {ev.name}
                      </h3>

                      {/* Logistics Info Row */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(8, 2, 16, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          marginBottom: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                            Schedule:
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                            {formatDateLabel(ev.eventDate)} {ev.eventTime ? `// ${ev.eventTime}` : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                            Venue:
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                            {ev.venue}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="pillar-desc"
                        style={{
                          margin: 0,
                          fontSize: '0.92rem',
                          lineHeight: 1.6,
                          color: 'var(--white-muted)',
                        }}
                      >
                        {ev.description}
                      </p>
                    </div>

                    {/* Bottom CTA Action Button */}
                    <div
                      style={{
                        paddingTop: '1.25rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          color: 'rgba(255, 255, 255, 0.4)',
                          textTransform: 'uppercase',
                        }}
                      >
                        LAN TOURNAMENT
                      </span>

                      {ev.registrationLink ? (
                        ev.registrationLink.startsWith('/') ? (
                          <Link
                            href={ev.registrationLink}
                            className="btn-ink-primary"
                            style={{
                              padding: '0.6rem 1.4rem',
                              fontSize: '0.82rem',
                              borderRadius: '6px',
                              background: ev.id.includes('gta6')
                                ? 'linear-gradient(135deg, #ff2a85 0%, #7b2fff 100%)'
                                : undefined,
                            }}
                          >
                            Explore Event &rarr;
                          </Link>
                        ) : (
                          <a
                            href={ev.registrationLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="btn-ink-primary"
                            style={{
                              padding: '0.6rem 1.4rem',
                              fontSize: '0.82rem',
                              borderRadius: '6px',
                            }}
                          >
                            Register Now &rarr;
                          </a>
                        )
                      ) : (
                        <button
                          disabled
                          className="btn-ink-outline"
                          style={{
                            padding: '0.6rem 1.4rem',
                            fontSize: '0.82rem',
                            borderRadius: '6px',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                          }}
                        >
                          Standby
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
