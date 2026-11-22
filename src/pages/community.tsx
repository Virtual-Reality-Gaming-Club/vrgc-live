import Head from 'next/head';
import Link from 'next/link';
import { BlurText } from '@/components';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

export default function CommunityPage() {
  useScrollAnimations();

  return (
    <>
      <Head>
        <title>Community Citadel — VRGC Discord | VIT Bhopal</title>
        <meta
          name="description"
          content="Join the official VRGC Discord Citadel. Connect with 1,000+ collegiate gamers, competitive esports squads, game developers, and event organizers at VIT Bhopal."
        />
      </Head>
      <main>
        <section
          className="ink-hero"
          style={{
            minHeight: '86vh',
            paddingTop: '8.5rem',
            paddingBottom: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className="hero-glow-backlight"></div>

          {/* Discord Live Hub Badge */}
          <div
            className="hero-badge-pill"
            style={{
              borderColor: 'rgba(88, 101, 242, 0.45)',
              background: 'rgba(88, 101, 242, 0.1)',
              color: '#a5b4fc',
            }}
          >
            <span
              className="hbp-dot"
              style={{ background: '#5865F2', boxShadow: '0 0 10px #5865F2' }}
            ></span>
            OFFICIAL DISCORD CITADEL &bull; 1,000+ ACTIVE MEMBERS
          </div>

          <div style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            <BlurText
              text="CITADEL COMMUNITY"
              delay={70}
              animateBy="letters"
              direction="top"
              className="ink-mega-title"
              style={{
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                lineHeight: 0.95,
                color: '#fff',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <BlurText
              text="OUR CENTRAL HEADQUARTERS"
              delay={90}
              animateBy="words"
              direction="bottom"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
                color: '#5865F2',
                letterSpacing: '0.08em',
              }}
            />
          </div>

          <p
            className="ink-hero-sub"
            style={{
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
              fontSize: '1.08rem',
              lineHeight: 1.7,
              color: 'var(--white-muted)',
            }}
          >
            The entire VRGC ecosystem lives on Discord. Find team scrims, join varsity rosters, participate in game dev jams, get tournament tickets, and hang out with collegiate gamers across VIT Bhopal.
          </p>

          {/* Discord Focus Hero Card */}
          <div
            className="community-discord-card"
            style={{
              background: 'rgba(12, 4, 26, 0.85)',
              border: '1px solid rgba(88, 101, 242, 0.35)',
              borderRadius: '20px',
              padding: '2.25rem 2rem',
              maxWidth: '580px',
              width: '92%',
              margin: '0 auto 2.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(88, 101, 242, 0.15)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(88, 101, 242, 0.15)',
                  border: '1px solid rgba(88, 101, 242, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5865F2',
                  flexShrink: 0,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
                  VRGC Discord Citadel
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#4ade80', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                  COMMUNITY VOICE &amp; TEXT ARENAS LIVE
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>ESPORTS SCRIMS</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.2rem' }}>Daily LFG &amp; Custom Matches</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>DEV LABS</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.2rem' }}>Unreal, Unity &amp; Blender</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>SAMVITYA 2026</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.2rem' }}>Live Announcements &amp; Passes</div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.55 }}>
              Tap below to get instant role assignment and access channels for tournament registrations, campus announcements, and gaming squads.
            </p>
          </div>

          <div className="ink-hero-actions" style={{ justifyContent: 'center', gap: '1rem' }}>
            <a
              href="https://discord.gg/vrgc"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ink-primary"
              style={{
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#5865F2',
                borderColor: '#5865F2',
                color: '#fff',
                padding: '0.75rem 2rem',
                boxShadow: '0 4px 20px rgba(88, 101, 242, 0.45)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>ENTER DISCORD CITADEL &rarr;</span>
            </a>
            <Link
              href="/"
              className="btn-ink-outline"
              style={{ minHeight: '48px', display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.75rem' }}
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

