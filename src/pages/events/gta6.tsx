import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SamvityaPassHolder, GeneratedGtaTicket } from '@/types/samvitya';
import { verifySamvityaBuyer, issueGta6Ticket, signInWithOfficialGoogleEmail } from '@/services/samvityaService';
import { useGta6Presentation } from '@/hooks/useGta6Presentation';
import styles from '@/styles/gta6Event.module.css';

const assets = '/gta6/event-ui';
const eventDate = '2026-12-04T10:00:00+05:30';
const emptyCountdown = { days: 0, hours: 0, minutes: 0, seconds: 0, complete: false };
const countdownUnits = ['days', 'hours', 'minutes', 'seconds'] as const;
const introDuration = 2600;
const introFadeDuration = 800;

const heroShots = ['coast.jpg', 'waterfront.jpg', 'sunset.jpg'];
const scenes = [
  { image: 'skyline.jpg', word: 'WELCOME', label: 'City lights', tone: '' },
  { image: 'sunset.jpg', word: 'TO', label: 'Neon horizon', tone: styles.warm },
  { image: 'nightlife.jpg', word: 'SAMVITYA', label: 'Night shift', tone: styles.pink },
];

const missionTracks = [
  {
    id: 'The Port Gellhorn Heist Run (4P Squad)',
    title: 'Port Gellhorn Heist',
    subtitle: '4P Co-op Time-Attack',
    image: '/gta6/an-extended-look.0zw.9~1j0ne~4.jpg',
  },
  {
    id: 'Ocean Drive Racing Wheel Time-Trial (1v1)',
    title: 'Ocean Drive Sprint',
    subtitle: '1v1 Direct-Drive Fanatec Rigs',
    image: '/gta6/launch-trailer.0.fbrrtu5j-9_.jpg',
  },
  {
    id: 'Vice Spatial VR & Photomode Lounge (Open)',
    title: 'Vice Spatial Free Roam',
    subtitle: 'Photomode & VR Arena',
    image: '/gta6/onlyInLeonidaDesktop.15y2n40f3axwo.jpg',
  },
];

function playTheme(theme: HTMLAudioElement | null) {
  // Autoplay may require a gesture. The intro and sound button also offer playback.
  void theme?.play().catch(() => {});
}

export default function GTA6EventPage() {
  const [timeLeft, setTimeLeft] = useState(emptyCountdown);
  const presentation = useGta6Presentation(heroShots.length);
  const [intro, setIntro] = useState<'playing' | 'fading' | 'done'>('playing');
  const [themePlaying, setThemePlaying] = useState(false);
  const themeRef = useRef<HTMLAudioElement>(null);
  const introButtonRef = useRef<HTMLButtonElement>(null);
  const soundButtonRef = useRef<HTMLButtonElement>(null);

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
    if (intro === 'done') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro('done');
      return;
    }

    const timeout = window.setTimeout(() => {
      if (intro === 'playing') {
        setIntro('fading');
      } else {
        if (document.activeElement === introButtonRef.current) {
          soundButtonRef.current?.focus({ preventScroll: true });
        }
        setIntro('done');
      }
    }, intro === 'playing' ? introDuration : introFadeDuration);

    return () => window.clearTimeout(timeout);
  }, [intro]);

  useEffect(() => {
    const theme = themeRef.current;
    playTheme(theme);
    return () => theme?.pause();
  }, []);

  const skipIntro = () => {
    if (intro !== 'playing') return;
    playTheme(themeRef.current);
    setIntro('fading');
  };

  const toggleTheme = () => {
    const theme = themeRef.current;
    if (!theme) return;

    if (theme.paused) playTheme(theme);
    else theme.pause();
  };

  useEffect(() => {
    const targetDate = Date.parse(eventDate);

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          complete: false,
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ ...emptyCountdown, complete: true });
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
        <title>Vice City · Samvitya 2026 | VRGC</title>
        <meta name="description" content="VRGC presents a 35-minute Grand Theft Auto VI gameplay session at Samvitya 2026, VIT Bhopal." />
        <meta name="theme-color" content="#0c0c10" />
      </Head>

      <div className={styles.page} ref={presentation.pageRef} data-intro-active={intro !== 'done'}>
        <audio
          ref={themeRef}
          src="/events/theme_song.mp3"
          preload="none"
          loop
          onPlay={() => setThemePlaying(true)}
          onPause={() => setThemePlaying(false)}
          onError={() => setThemePlaying(false)}
        />
        {intro !== 'done' && (
          <button
            ref={introButtonRef}
            className={`${styles.introScreen} rstar-loading-screen no-print ${intro === 'fading' ? 'fading-out' : ''}`}
            type="button"
            onClick={skipIntro}
            tabIndex={intro === 'fading' ? -1 : 0}
          >
            <span className="rstar-logo-stage">
              <img
                className={`${styles.introLogo} rstar-standalone-img`}
                src="/gta6/gta6_official_logo.png"
                alt="Grand Theft Auto VI"
                fetchPriority="high"
              />
            </span>
            <span className="rstar-skip-pill">{themePlaying ? 'Skip intro' : 'Skip intro and play theme'}</span>
          </button>
        )}
        <a className={styles.skip} href="#experience">Skip to event details</a>
        <header className={styles.header}>
          <a className={styles.brands} href="#home" aria-label="VIT Bhopal and VRGC">
            <img className={styles.vit} src={`${assets}/vit.svg`} alt="VIT Bhopal" />
            <span aria-hidden="true" />
            <img className={styles.vrgc} src={`${assets}/vrgc.webp`} alt="VRGC" />
          </a>
          <nav aria-label="Event navigation">
            <a href="#experience">The event</a>
            <a href="#city">Explore Leonida</a>
            <a href="#countdown">Countdown</a>
          </nav>
          <div className={styles.headerActions}>
            <button
              ref={soundButtonRef}
              className={styles.soundToggle}
              type="button"
              aria-label="GTA VI theme music"
              aria-pressed={themePlaying}
              title={themePlaying ? 'Pause theme music' : 'Play theme music'}
              onClick={toggleTheme}
            >
              <span className={styles.soundIcon} aria-hidden="true">♫</span>
            </button>
            <a className={`${styles.button} ${styles.headerButton}`} href="#pass">Get your pass</a>
          </div>
        </header>

        <main id="home">
          <section className={styles.hero} ref={presentation.heroRef} aria-labelledby="hero-title">
            <div className={styles.heroFilm} aria-hidden="true">
              {heroShots.map((image, index) => (
                <div key={image} className={`${styles.heroShot} ${index === presentation.heroIndex ? styles.active : ''}`}>
                  <img src={`${assets}/${image}`} width={3840} height={2160} alt="" fetchPriority={index === 0 ? 'high' : 'low'} />
                </div>
              ))}
            </div>
            <div className={styles.heroOverlay} />
            <div className={styles.heroInner}>
              <p className={`${styles.introLabel} ${styles.heroEnter}`}>
                <span className={styles.neonLine} aria-hidden="true" /> VIT Bhopal presents · Samvitya 2026
              </p>
              <h1 className={styles.heroTitle} id="hero-title" aria-label="Vice City">
                {['VICE', 'CITY'].map((word) => (
                  <span key={word} className={styles.titleMask}>
                    <span className={styles.titleFace}>
                      <span className={styles.titleDepth} aria-hidden="true">{word}</span>
                      <span className={styles.titleFront}>{word}</span>
                    </span>
                  </span>
                ))}
              </h1>
              <div className={`${styles.heroDetails} ${styles.heroEnter}`}>
                <p className={styles.game}>GRAND THEFT AUTO VI</p>
                <p>35 minutes of gameplay at VIT Bhopal.</p>
                <a className={`${styles.button} ${styles.mainButton}`} href="#pass">Access your venue pass</a>
              </div>
            </div>
            <div className={styles.heroBottom}>
              <div>
                <span className={styles.smallLabel}>EVENT DATE</span>
                <strong><time dateTime={eventDate}>4 December · 10 AM IST</time></strong>
              </div>
              <a href="#experience" className={styles.explore}>
                <span className={styles.scrollMark} aria-hidden="true" /> Scroll to explore
              </a>
              <button
                className={styles.motionToggle}
                type="button"
                aria-pressed={presentation.paused}
                onClick={presentation.togglePaused}
              >
                <span className={styles.pauseIcon} aria-hidden="true" />
                <span>{presentation.paused ? 'Play background' : 'Pause background'}</span>
              </button>
            </div>
          </section>

          <section className={styles.countdown} id="countdown" aria-labelledby="count-title">
            <div className={styles.countLabel}>
              <p className={styles.smallLabel}><span className={styles.signal} aria-hidden="true" /> COUNTDOWN TO THE SESSION</p>
              <h2 id="count-title">{timeLeft.complete ? 'THE COUNTDOWN IS COMPLETE' : '4 DECEMBER 2026'}</h2>
              <p><time dateTime={eventDate}>10:00 AM IST</time> · VIT Bhopal</p>
            </div>
            <div className={styles.clock} role="timer" aria-label="Time until the event">
              {countdownUnits.map((unit) => (
                <div key={unit}>
                  <strong>{String(timeLeft[unit]).padStart(2, '0')}</strong>
                  <span>{unit}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.experience} id="experience" aria-labelledby="experience-title">
            <div className={`${styles.sectionCopy} ${styles.reveal}`}>
              <p className={`${styles.smallLabel} ${styles.accent}`}>THE SESSION</p>
              <h2 className={styles.sectionTitle} id="experience-title">
                <span className={styles.lineReveal}><span>35 MINUTES</span></span>
                <span className={styles.lineReveal}><span>IN <em>LEONIDA.</em></span></span>
              </h2>
              <p>Join the Virtual Reality &amp; Gaming Club at Samvitya 2026 for a dedicated 35-minute Grand Theft Auto VI gameplay session on campus.</p>
              <a className={styles.textLink} href="#pass">Get your venue pass</a>
            </div>
            <figure className={`${styles.sceneImage} ${styles.reveal}`}>
              <div className={styles.imageMask}>
                <img src={`${assets}/cars.jpg`} alt="A character sitting on a pink sports car at a Vice City car meet" width={3840} height={2160} loading="lazy" />
              </div>
              <figcaption>VICE CITY / ROCKSTAR GAMES</figcaption>
            </figure>
          </section>

          <section className={styles.reel} id="city" ref={presentation.reelRef} aria-labelledby="reel-heading">
            <h2 className={styles.srOnly} id="reel-heading">Welcome to Samvitya</h2>
            <div className={styles.reelStage} ref={presentation.stageRef}>
              <div className={styles.reelScenes} aria-hidden="true">
                {scenes.map((scene, index) => (
                  <div key={scene.image} className={`${styles.reelScene} ${scene.tone} ${index === 0 ? styles.active : ''}`}>
                    <img src={`${assets}/${scene.image}`} alt="" width={3840} height={2160} loading="lazy" />
                    <div className={styles.sceneDark} />
                    <div className={`${styles.reelWord} ${index === 1 ? styles.shortWord : ''}`}>{scene.word}</div>
                  </div>
                ))}
              </div>
              <div className={styles.reelControls} role="group" aria-label="Choose a Leonida scene">
                {scenes.map((scene, index) => (
                  <button key={scene.label} type="button" aria-pressed={index === presentation.sceneIndex} onClick={() => presentation.selectScene(index)}>
                    <span className={styles.track} aria-hidden="true"><i /></span>{scene.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.access} id="pass" aria-label="Leonida District venue pass">
            <div id="ticket-generator-portal" className={styles.accessGrid}>
              <div className={`${styles.sectionCopy} ${styles.reveal}`} hidden={Boolean(verifiedBuyer || activeTicket)}>
                <p className={`${styles.smallLabel} ${styles.accent}`}>LEONIDA AIRSPACE ENTRY · AUTH PROTOCOL</p>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.lineReveal}><span>YOUR CITY.</span></span>
                  <span className={styles.lineReveal}><span><em>YOUR PASS.</em></span></span>
                </h2>
                <h3>Authenticate your Samvitya pass</h3>
                <p>Purchased your <strong>Samvitya Fest Pass on VTOP</strong>? Authenticate your official VIT student Google email via <strong>VRGC Forms</strong> to unlock your verified Leonida District Venue Pass.</p>
                <button className={`${styles.button} ${styles.mainButton}`} type="button" onClick={handleGoogleSignInVerify} disabled={isVerifying}>
                  {isVerifying ? 'Verifying your pass…' : 'Log in via official mail'}
                </button>
                {verifyError && <p className={styles.verifyError} role="alert">{verifyError}</p>}
              </div>

              <div className={`${styles.ticketWrap} ${styles.reveal}`} hidden={Boolean(verifiedBuyer || activeTicket)}>
                <div
                  className={styles.ticket}
                  role="group"
                  aria-label="Sample Leonida District venue pass"
                  onPointerMove={(event) => {
                    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    const position = (event.clientX - bounds.left) / bounds.width - 0.5;
                    event.currentTarget.style.setProperty('--ticket-tilt', `${position * 24 - 5}deg`);
                  }}
                  onPointerLeave={(event) => event.currentTarget.style.removeProperty('--ticket-tilt')}
                >
                  <div className={styles.ticketTop}><span>VRGC × SAMVITYA</span><time dateTime={eventDate}>04.12.26</time></div>
                  <div className={styles.ticketName}>LEONIDA<br />DISTRICT</div>
                  <div className={styles.ticketTop}><span>VENUE PASS</span><span>10:00 IST</span></div>
                  <div className={styles.barcode} aria-hidden="true" />
                  <small>SAMPLE PASS · DESIGN PREVIEW</small>
                </div>
              </div>

              {verifiedBuyer && !activeTicket && (
                <div className={styles.passPanel}>
                  <p className={`${styles.smallLabel} ${styles.accent}`}>SAMVITYA PASS VERIFIED</p>
                  <h2 className={styles.panelTitle}>Clearance granted, {verifiedBuyer.name}</h2>
                  <p className={styles.panelCopy}>
                    Operative ID <strong>{verifiedBuyer.regNumber}</strong> · VTOP pass <strong>{verifiedBuyer.vtopTransactionId}</strong>
                  </p>
                  <fieldset className={styles.missionField}>
                    <legend className={styles.smallLabel}>SELECT YOUR LEONIDA MISSION TRACK</legend>
                    <div className={styles.missionTracks}>
                      {missionTracks.map((track) => (
                        <label key={track.id} className={styles.missionCard}>
                          <input
                            className={styles.srOnly}
                            type="radio"
                            name="gta6-mission"
                            value={track.id}
                            checked={chosenDiscipline === track.id}
                            onChange={() => setChosenDiscipline(track.id)}
                          />
                          <img src={track.image} alt="" loading="lazy" />
                          <span><strong>{track.title}</strong>{track.subtitle}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className={styles.smallLabel} htmlFor="gta6-slot">ARENA DEPLOYMENT WINDOW</label>
                  <select id="gta6-slot" className={styles.slotSelect} value={chosenSlot} onChange={(event) => setChosenSlot(event.target.value)}>
                    <option value="Slot 1: 17:00 - 18:30 IST">Phase 1 · 17:00 - 18:30 IST (Early Heist Wave)</option>
                    <option value="Slot 2: 18:30 - 20:00 IST">Phase 2 · 18:30 - 20:00 IST (Prime Sunset Bracket)</option>
                    <option value="Slot 3: 20:00 - 21:30 IST">Phase 3 · 20:00 - 21:30 IST (Central Auditorium Grand Finals)</option>
                  </select>
                  <button className={`${styles.button} ${styles.mainButton}`} type="button" onClick={handleGenerateTicket} disabled={isGeneratingTicket}>
                    {isGeneratingTicket ? 'Issuing your venue pass…' : 'Issue Leonida venue pass'}
                  </button>
                </div>
              )}

              {activeTicket && (
                <div id="printable-gta-ticket" className={styles.passPanel}>
                  <div className={styles.issuedTicket}>
                    <div className={styles.ticketTop}><span>VRGC × SAMVITYA</span><span>ACCESS GRANTED</span></div>
                    <h2 className={styles.panelTitle}>Leonida District Venue Pass</h2>
                    <div className={styles.ticketIds}>
                      <span>VTOP AUTH CODE {activeTicket.vtopTransactionId}</span>
                      <span>PASS ID {activeTicket.ticketId}</span>
                    </div>
                    <dl className={styles.ticketDetails}>
                      <div><dt>PARTICIPANT NAME</dt><dd><strong>{activeTicket.userName}</strong><br />{activeTicket.regNumber}</dd></div>
                      <div><dt>DISCIPLINE</dt><dd>{activeTicket.category}</dd></div>
                      <div><dt>ALLOCATED VENUE &amp; SLOT</dt><dd><strong>{activeTicket.slotTime}</strong><br />{activeTicket.venue}</dd></div>
                    </dl>
                    <div className={styles.ticketGate}>
                      <div className={styles.ticketCode}>
                        <div className={styles.barcode} aria-hidden="true" />
                        <span>{activeTicket.verificationCode}</span>
                      </div>
                      <div>
                        <strong>Scan at entrance gate</strong>
                        <p>Bring this digital pass or a printed copy with your physical VIT student ID card to Lab 304 / Central Auditorium.</p>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.ticketActions} no-print`}>
                    <button className={styles.button} type="button" onClick={handlePrint}>Print ticket</button>
                    <button
                      className={`${styles.button} ${styles.headerButton}`}
                      type="button"
                      onClick={() => {
                        setActiveTicket(null);
                        setVerifiedBuyer(null);
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('vrgc_gta6_active_ticket');
                        }
                      }}
                    >
                      Clear &amp; logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <strong>VRGC × SAMVITYA 2026</strong>
          <span>VIT Bhopal University</span>
          <Link href="/events">Back to events</Link>
          <a href="#home">Back to top</a>
        </footer>
      </div>
    </>
  );
}
