import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SamvityaPassHolder, GeneratedGtaTicket } from '@/types/samvitya';
import { verifySamvityaBuyer, issueGta6Ticket, signInWithOfficialGoogleEmail } from '@/services/samvityaService';

export default function GTA6EventPage() {
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for interactive Vice City parallax & sunset lighting shifts
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer to Samvitya GTA 6 Event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isMuted, setIsMuted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingSplash, setIsFadingSplash] = useState(false);
  const playerRef = useRef<any>(null);

  const dismissSplash = () => {
    setIsFadingSplash(true);
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
        setIsMuted(false);
      } catch {}
    }
    setTimeout(() => {
      setShowSplash(false);
    }, 700);
  };

  // Authentic Rockstar Games Logo reveal duration: 2.6s, then cleanly fades into GTA 6 page
  useEffect(() => {
    const timer = setTimeout(() => {
      dismissSplash();
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize and loop video precisely between 20s (0:20) and 86s (1:26) with sound autostart
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let loopInterval: NodeJS.Timeout | null = null;

    const onYouTubeIframeAPIReady = () => {
      if (!(window as any).YT || !(window as any).YT.Player) return;

      playerRef.current = new (window as any).YT.Player('gta6-yt-bg-player', {
        videoId: '3JUboYgqIxc',
        playerVars: {
          autoplay: 1,
          mute: 0,
          start: 20,
          end: 86,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          disablekb: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.unMute();
              event.target.setVolume(100);
            } catch {}
            event.target.seekTo(20, true);
            const playPromise = event.target.playVideo();

            // If browser blocks unmuted playback, immediately fallback to muted and unmute on any gesture
            setTimeout(() => {
              try {
                if (event.target.isMuted && event.target.isMuted()) {
                  setIsMuted(true);
                } else {
                  setIsMuted(false);
                }
              } catch {}
            }, 500);

            // Interval to enforce strict 0:20 - 1:26 boundary
            loopInterval = setInterval(() => {
              if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                const currentTime = playerRef.current.getCurrentTime();
                if (currentTime >= 86 || currentTime < 19.5) {
                  playerRef.current.seekTo(20, true);
                  playerRef.current.playVideo();
                }
              }
            }, 300);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED is 0
            if (event.data === 0) {
              event.target.seekTo(20, true);
              event.target.playVideo();
            }
          },
        },
      });
    };

    // User gesture listener to aggressively unmute if browser policy initially held sound
    const handleGestureUnmute = () => {
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.unMute === 'function') {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
          }
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
          setIsMuted(false);
        } catch {}
      }
      window.removeEventListener('click', handleGestureUnmute);
      window.removeEventListener('touchstart', handleGestureUnmute);
      window.removeEventListener('scroll', handleGestureUnmute);
      window.removeEventListener('keydown', handleGestureUnmute);
    };

    window.addEventListener('click', handleGestureUnmute);
    window.addEventListener('touchstart', handleGestureUnmute);
    window.addEventListener('scroll', handleGestureUnmute);
    window.addEventListener('keydown', handleGestureUnmute);

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else if ((window as any).YT && (window as any).YT.Player) {
      onYouTubeIframeAPIReady();
    }

    return () => {
      window.removeEventListener('click', handleGestureUnmute);
      window.removeEventListener('touchstart', handleGestureUnmute);
      window.removeEventListener('scroll', handleGestureUnmute);
      window.removeEventListener('keydown', handleGestureUnmute);
      if (loopInterval) clearInterval(loopInterval);
      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch {}
    };
  }, []);

  const toggleSound = () => {
    if (playerRef.current && typeof playerRef.current.isMuted === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Verification & Ticket Generation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifiedBuyer, setVerifiedBuyer] = useState<SamvityaPassHolder | null>(null);

  // Ticket Options
  const [chosenDiscipline, setChosenDiscipline] = useState('The Port Gellhorn Heist Run (4P Squad)');
  const [chosenSlot, setChosenSlot] = useState('Slot 1: 17:00 - 18:30 IST');
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
  const [activeTicket, setActiveTicket] = useState<GeneratedGtaTicket | null>(null);

  useEffect(() => {
    // Target event date: Dec 3, 2026, 10:00 AM IST
    const targetDate = new Date('2026-12-03T10:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Check for cached local ticket if available
    if (typeof window !== 'undefined') {
      const savedTicket = localStorage.getItem('vrgc_gta6_active_ticket');
      if (savedTicket) {
        try {
          setActiveTicket(JSON.parse(savedTicket));
        } catch {}
      }
    }

    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignInVerify = async () => {
    setIsVerifying(true);
    setVerifyError('');

    try {
      const { userEmail } = await signInWithOfficialGoogleEmail();
      const result = await verifySamvityaBuyer(userEmail);

      if (result.verified && result.passHolder) {
        setVerifiedBuyer(result.passHolder);
      } else {
        setVerifyError(
          `Signed in as ${userEmail}, but no verified Samvitya pass from VTOP was found in VRGC Forms. Please ensure you purchased your pass on VTOP with this official account.`
        );
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setVerifyError('Google sign-in popup was cancelled.');
      } else {
        setVerifyError(err.message || 'Google verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGenerateTicket = async () => {
    if (!verifiedBuyer) return;

    setIsGeneratingTicket(true);
    try {
      const ticket = await issueGta6Ticket(verifiedBuyer, chosenDiscipline, chosenSlot);
      setActiveTicket(ticket);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vrgc_gta6_active_ticket', JSON.stringify(ticket));
      }
    } catch (err) {
      alert('Error creating GTA 6 ticket. Please retry.');
    } finally {
      setIsGeneratingTicket(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <Head>
        <title>GTA VI: VICE CITY CAMPUS SHOWDOWN — Samvitya 2026 | VRGC</title>
        <meta
          name="description"
          content="Official Grand Theft Auto VI launch festival at Samvitya 2026, VIT Bhopal. VTOP Samvitya ticket holders login here to generate their verified GTA 6 venue access pass."
        />
      </Head>

      <div className="gta6-page-root">
        {/* ── AUTHENTIC ROCKSTAR LOGO REVEAL SPLASH ── */}
        {showSplash && (
          <div
            className={`rstar-loading-screen ${isFadingSplash ? 'fading-out' : ''}`}
            onClick={dismissSplash}
          >
            <div className="rstar-logo-stage">
              <img
                src="/gta6/gta6_official_logo.png"
                alt="Grand Theft Auto VI"
                className="rstar-standalone-img"
                style={{
                  width: 'clamp(280px, 45vw, 560px)',
                  filter: 'drop-shadow(0 0 45px rgba(255, 42, 133, 0.7)) drop-shadow(0 0 90px rgba(0, 240, 255, 0.4))',
                }}
              />
            </div>

            {/* Skip pill */}
            <div className="rstar-skip-pill">CLICK TO SKIP &rarr;</div>
          </div>
        )}

        {/* Cinematic CRT scanlines & vignette framing */}
        <div className="gta-crt-overlay" />
        <div className="gta-vignette" />

        {/* ── BACKGROUND VIDEO CONTAINER (LOOPING 0:20 - 1:26 WITH SOUND) ── */}
        <div className="gta-video-bg-container">
          <div id="gta6-yt-bg-player" />
        </div>

        {/* Ambient Dusk Sky, Vice City Glow & 3D Perspective Grid */}
        <div className="gta6-sunset-backdrop" />
        <div className="gta-palms-backdrop" />
        <div className="gta6-grid-floor" />

        {/* Palm tree vector silhouettes framing the horizon */}
        <svg className="gta-palm-left no-print" viewBox="0 0 100 120" fill="url(#palmGradPink)">
          <defs>
            <linearGradient id="palmGradPink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a85" />
              <stop offset="100%" stopColor="#2c0638" />
            </linearGradient>
          </defs>
          <path d="M50 120 C52 90 56 60 70 30 C58 35 48 45 42 60 C38 45 30 35 15 28 C30 38 38 52 42 70 C30 65 18 63 0 66 C18 72 32 80 40 92 C32 100 24 105 10 110 C28 108 40 105 46 120 Z" />
        </svg>
        <svg className="gta-palm-right no-print" viewBox="0 0 100 120" fill="url(#palmGradCyan)">
          <defs>
            <linearGradient id="palmGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#1e0533" />
            </linearGradient>
          </defs>
          <path d="M50 120 C52 90 56 60 70 30 C58 35 48 45 42 60 C38 45 30 35 15 28 C30 38 38 52 42 70 C30 65 18 63 0 66 C18 72 32 80 40 92 C32 100 24 105 10 110 C28 108 40 105 46 120 Z" />
        </svg>

        {/* Floating Sound Toggle with Audio Visualizer Bars */}
        <button
          onClick={toggleSound}
          className="no-print"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.35rem',
            borderRadius: '999px',
            backgroundColor: isMuted ? 'rgba(15, 3, 28, 0.88)' : 'rgba(255, 42, 133, 0.95)',
            border: isMuted ? '1px solid rgba(0, 240, 255, 0.45)' : '1px solid #ff2a85',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            boxShadow: isMuted ? '0 0 20px rgba(0, 240, 255, 0.35)' : '0 0 30px rgba(255, 42, 133, 0.8)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          {!isMuted ? (
            <div className="gta-audio-wave">
              <span className="gta-audio-bar" />
              <span className="gta-audio-bar" />
              <span className="gta-audio-bar" />
              <span className="gta-audio-bar" />
            </div>
          ) : (
            <span>🔇</span>
          )}
          <span>{isMuted ? 'UNMUTE SOUND' : 'MUTE SOUND'}</span>
        </button>

        {/* ── TOP HUD BAR ── */}
        <header
          className="no-print"
          style={{
            position: 'relative',
            zIndex: 20,
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '7rem 1.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/events"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#00f0ff',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.15)',
              }}
            >
              &larr; BACK TO EVENTS
            </Link>
          </div>

          {/* Wanted Level 5 Stars & Leonida Access Clearance Tag */}
          <div className="gta-wanted-badge">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#ff2a85',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}
            >
              LEONIDA BORDER CLEARANCE
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="gta-wanted-star"
                  style={{ animationDelay: `${star * 0.18}s` }}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── HERO BANNER ── */}
        <section
          className="no-print"
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '2.5rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          {/* Samvitya Flagship Ribbon with authentic Vice City skew badge */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="gta-badge-slant">
              <span>★ SAMVITYA 2026 OFFICIAL SHOWDOWN ★</span>
            </div>
          </div>

          {/* Official GTA VI Headline Typography in Vice City Sunset & Interactive Scroll Style */}
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto 3rem',
              textAlign: 'center',
            }}
          >
            <h1
              className="gta-sunset-title"
              style={{
                backgroundPosition: `${Math.min(scrollY * 0.25, 100)}% center`,
              }}
            >
              Grand Theft Auto VI
            </h1>

            <div className="gta-sunset-subhead">
              Vice City, USA.
            </div>

            <p className="gta-sunset-body">
              Jason and Lucia have always known the deck is stacked against them. But when an easy score goes wrong,
              they find themselves on the darkest side of the sunniest place in America, in the middle of a criminal
              conspiracy stretching across the state of Leonida — forced to rely on each other more than ever if they want to make it out alive.
            </p>
          </div>

          {/* ── COUNTDOWN TO DEC 3, 10:00 AM HUD ── */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1.25rem 2.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 3, 28, 0.9)',
              border: '1px solid rgba(255, 42, 133, 0.45)',
              boxShadow: '0 0 35px rgba(255, 42, 133, 0.3)',
              margin: '1.5rem auto 3.5rem',
              position: 'relative',
              zIndex: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  color: '#ff2a85',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.12em' }}>
                DAYS
              </span>
            </div>
            <span style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>:</span>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  color: '#00f0ff',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.12em' }}>
                HOURS
              </span>
            </div>
            <span style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>:</span>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  color: '#c084fc',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.12em' }}>
                MINS
              </span>
            </div>
            <span style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>:</span>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  color: '#f6a800',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.12em' }}>
                SECS
              </span>
            </div>
          </div>
        </section>

        {/* ── VTOP SAMVITYA AUTHENTICATION & TICKET GENERATOR ── */}
        <section
          id="ticket-generator-portal"
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '860px',
            margin: '0 auto',
            padding: '1rem 1.5rem 6rem',
          }}
        >
          {/* STEP 1: Not Verified yet */}
          {!verifiedBuyer && !activeTicket && (
            <div
              className="gta-card"
              style={{
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                borderColor: 'rgba(255, 42, 133, 0.45)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.2em',
                    color: '#00f0ff',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  OPERATION 01 &bull; LEONIDA AIRSPACE ENTRY &bull; AUTH PROTOCOL
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                    color: '#ffffff',
                    lineHeight: 1.05,
                    margin: '0 0 1rem',
                  }}
                >
                  AUTHENTICATE SAMVITYA PASS
                </h2>
                <p
                  style={{
                    color: '#cbd5e1',
                    fontSize: '0.98rem',
                    lineHeight: 1.6,
                    maxWidth: '680px',
                    margin: '0 auto',
                  }}
                >
                  Purchased your <strong>Samvitya Fest Pass on VTOP</strong>? Authenticate your
                  official VIT student Google email via <strong>VRGC Forms</strong> to unlock your
                  verified <strong>Leonida District Venue Pass</strong> with encrypted security barcode.
                </p>
              </div>

              {/* Primary Action: One-Click Google Sign-In with Official Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleGoogleSignInVerify}
                  disabled={isVerifying}
                  className="gta-btn-primary"
                  style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '1.1rem 2rem',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#ffffff"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#ffffff"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#ffffff"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#ffffff"
                    />
                  </svg>
                  {isVerifying ? 'ACCESSING LEONIDA DATANET...' : 'LOGIN VIA OFFICIAL MAIL'}
                </button>

                {verifyError && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '460px',
                      padding: '1rem 1.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span>&#9888;</span> {verifyError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Buyer Verified & Selecting Slot / Category */}
          {verifiedBuyer && !activeTicket && (
            <div
              className="gta-card"
              style={{
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                borderColor: 'rgba(0, 240, 255, 0.5)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#22c55e',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    marginBottom: '0.5rem',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                  }}
                >
                  &#x2714; LEONIDA PROTOCOL: OPERATIVE IDENTIFIED
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                    color: '#ffffff',
                    lineHeight: 1,
                    margin: '0.5rem 0 0.8rem',
                  }}
                >
                  CLEARANCE GRANTED: {verifiedBuyer.name}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                  OPERATIVE ID: <strong style={{ color: '#fff' }}>{verifiedBuyer.regNumber}</strong> &bull; VTOP
                  SECURE PASS: <strong style={{ color: '#00f0ff' }}>{verifiedBuyer.vtopTransactionId}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '0.8rem',
                    }}
                  >
                    SELECT YOUR LEONIDA MISSION TRACK
                  </label>

                  {/* Visual Track Selection Cards with Official Rockstar Artworks */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {[
                      {
                        id: 'The Port Gellhorn Heist Run (4P Squad)',
                        title: 'Port Gellhorn Heist',
                        subtitle: '4P Co-op Time-Attack',
                        img: '/gta6/an-extended-look.0zw.9~1j0ne~4.jpg',
                      },
                      {
                        id: 'Ocean Drive Racing Wheel Time-Trial (1v1)',
                        title: 'Ocean Drive Sprint',
                        subtitle: '1v1 Direct-Drive Fanatec Rigs',
                        img: '/gta6/launch-trailer.0.fbrrtu5j-9_.jpg',
                      },
                      {
                        id: 'Vice Spatial VR & Photomode Lounge (Open)',
                        title: 'Vice Spatial Free Roam',
                        subtitle: 'Photomode & VR Arena',
                        img: '/gta6/onlyInLeonidaDesktop.15y2n40f3axwo.jpg',
                      },
                    ].map((track) => {
                      const isSelected = chosenDiscipline === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => setChosenDiscipline(track.id)}
                          style={{
                            cursor: 'pointer',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.15)',
                            backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(15, 3, 28, 0.85)',
                            boxShadow: isSelected ? '0 0 25px rgba(0, 240, 255, 0.4)' : 'none',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          <div
                            style={{
                              height: '110px',
                              backgroundImage: `url(${track.img})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(180deg, transparent 30%, rgba(15, 3, 28, 0.95) 100%)',
                              }}
                            />
                            {isSelected && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  backgroundColor: '#00f0ff',
                                  color: '#000',
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  fontFamily: 'var(--font-mono)',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                }}
                              >
                                SELECTED
                              </span>
                            )}
                          </div>
                          <div style={{ padding: '0.8rem 1rem' }}>
                            <div
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.15rem',
                                color: isSelected ? '#00f0ff' : '#ffffff',
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                              }}
                            >
                              {track.title}
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.72rem',
                                color: '#94a3b8',
                                marginTop: '4px',
                              }}
                            >
                              {track.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ARENA DEPLOYMENT WINDOW
                  </label>
                  <select
                    value={chosenSlot}
                    onChange={(e) => setChosenSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      borderRadius: '8px',
                      backgroundColor: '#120422',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Slot 1: 17:00 - 18:30 IST">Phase 1 &bull; 17:00 - 18:30 IST (Early Heist Wave)</option>
                    <option value="Slot 2: 18:30 - 20:00 IST">Phase 2 &bull; 18:30 - 20:00 IST (Prime Sunset Bracket)</option>
                    <option value="Slot 3: 20:00 - 21:30 IST">Phase 3 &bull; 20:00 - 21:30 IST (Central Auditorium Grand Finals)</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateTicket}
                  disabled={isGeneratingTicket}
                  className="gta-btn-primary"
                  style={{
                    marginTop: '0.5rem',
                    padding: '1.15rem 2rem',
                    fontSize: '1.25rem',
                  }}
                >
                  {isGeneratingTicket ? 'PRINTING LEONIDA ACCESS PASS...' : 'ISSUE LEONIDA VENUE PASS &rarr;'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Printable GTA 6 Event Ticket */}
          {activeTicket && (
            <div id="printable-gta-ticket">
              <div className="gta-samvitya-ticket" style={{ padding: 'clamp(2rem, 5vw, 3rem)' }}>
                <div className="gta-ticket-punch-left" />
                <div className="gta-ticket-punch-right" />

                {/* Ticket Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingBottom: '1.5rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#ff2a85',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      STATE OF LEONIDA &bull; OFFICIAL ARENA ACCESS
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                        color: '#ffffff',
                        lineHeight: 1,
                        margin: '0.3rem 0',
                      }}
                    >
                      GTA VI: VICE CITY SHOWDOWN
                    </div>
                    <div style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      VTOP AUTH CODE: {activeTicket.vtopTransactionId}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#22c55e',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      STATUS: ACCESS GRANTED
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        marginTop: '0.4rem',
                      }}
                    >
                      PASS ID: {activeTicket.ticketId}
                    </div>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    margin: '2rem 0',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>
                      PARTICIPANT NAME
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                      {activeTicket.userName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ff80bf' }}>
                      {activeTicket.regNumber}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>
                      DISCIPLINE
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                      {activeTicket.category}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>
                      ALLOCATED VENUE &amp; SLOT
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#00f0ff' }}>
                      {activeTicket.slotTime}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{activeTicket.venue}</div>
                  </div>
                </div>

                <div className="gta-ticket-perforation" />

                {/* Barcode & Security Verification Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Simulated Authentic Barcode */}
                    <div
                      style={{
                        padding: '0.6rem 1rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          height: '42px',
                          width: '180px',
                          backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 8px, #fff 8px, #fff 10px, #000 10px, #000 13px, #fff 13px, #fff 15px, #000 15px, #000 19px, #fff 19px, #fff 21px)`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: '#000',
                          letterSpacing: '0.12em',
                          fontWeight: 700,
                          marginTop: '2px',
                        }}
                      >
                        {activeTicket.verificationCode}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ff2a85', fontWeight: 700 }}>
                        SCAN AT ENTRANCE GATE
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '320px' }}>
                        Bring this digital pass or printed copy along with your physical VIT student ID card
                        to Lab 304 / Central Auditorium.
                      </div>
                    </div>
                  </div>

                  <div className="no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handlePrint} className="gta-btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
                      &#128438; PRINT TICKET
                    </button>
                    <button
                      onClick={() => {
                        setActiveTicket(null);
                        setVerifiedBuyer(null);
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('vrgc_gta6_active_ticket');
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.6)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                      }}
                    >
                      CLEAR &amp; LOGOUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
