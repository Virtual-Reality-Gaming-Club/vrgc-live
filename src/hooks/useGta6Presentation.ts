import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/gta6Event.module.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function smooth(value: number) {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
}

export function useGta6Presentation(introActive: boolean) {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const video = heroVideoRef.current;
    if (!hero || !video) return;

    const reducedMotion = window.matchMedia(reducedMotionQuery);
    let heroVisible = false;

    const syncPlayback = () => {
      const stop = introActive || paused || reducedMotion.matches || !heroVisible || document.hidden;
      hero.classList.toggle(styles.motionPaused, stop);
      if (stop) {
        video.pause();
      } else {
        // Keep the poster visible if the browser cannot play the background.
        void video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      syncPlayback();
    }, { threshold: 0.2 });

    observer.observe(hero);
    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, [introActive, paused]);

  useEffect(() => {
    const page = pageRef.current;
    const hero = heroRef.current;
    const reel = reelRef.current;
    const stage = stageRef.current;
    if (!page || !hero || !reel || !stage) return;

    const reducedMotion = window.matchMedia(reducedMotionQuery);
    const scenes = [...stage.querySelectorAll<HTMLElement>(`.${styles.reelScene}`)];
    const controls = [...stage.querySelectorAll<HTMLButtonElement>(`.${styles.reelControls} button`)];
    let animationFrame: number | null = null;
    let activeScene = 0;
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.inView);
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.18 });

    page.classList.add(styles.motionReady);
    page.querySelectorAll(`.${styles.reveal}`).forEach((element) => revealObserver.observe(element));

    const renderScroll = () => {
      animationFrame = null;
      const bounds = reel.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(stage).top);
      const travel = Math.max(1, reel.offsetHeight - stage.offsetHeight);
      const progress = clamp((stickyTop - bounds.top) / travel);
      const phase = progress * scenes.length;
      const lastScene = scenes.length - 1;
      const active = Math.min(lastScene, Math.floor(phase));
      const entry = smooth((window.innerHeight - bounds.top) / (window.innerHeight * 0.55));
      const reduced = reducedMotion.matches;

      scenes.forEach((scene, index) => {
        const entered = index === 0 ? 1 : smooth((phase - index + 0.28) / 0.56);
        const exited = index === lastScene ? 0 : smooth((phase - index - 1 + 0.28) / 0.56);
        const titleIn = index === 0 ? entry : smooth((phase - index) / 0.29);
        const titleOut = index === lastScene ? 0 : smooth((phase - index - 0.71) / 0.29);

        scene.style.setProperty('--opacity', String(reduced ? Number(index === active) : entered * (1 - exited)));
        scene.style.setProperty('--zoom', String(reduced ? 1 : 1.025 + clamp(phase - index + 0.2) * 0.085));
        scene.style.setProperty('--word-opacity', String(reduced ? 1 : titleIn * (1 - titleOut)));
        scene.style.setProperty('--word-y', `${reduced ? 0 : (1 - titleIn) * 110 - titleOut * 90}px`);
        scene.style.setProperty('--word-scale', String(reduced ? 1 : 0.94 + titleIn * 0.06));
        scene.style.setProperty('--word-clip', `${reduced ? -30 : (1 - titleIn) * 135 - 30}%`);
        controls[index].style.setProperty('--fill', `${clamp(phase - index) * 100}%`);
      });

      if (active !== activeScene) {
        activeScene = active;
        setSceneIndex(active);
      }

      const heroProgress = clamp(window.scrollY / Math.max(1, hero.offsetHeight));
      hero.style.setProperty('--heading-y', `${heroProgress * 75}px`);
      hero.style.setProperty('--heading-scale', String(1 - heroProgress * 0.065));
    };

    const requestScrollRender = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(renderScroll);
    };

    window.addEventListener('scroll', requestScrollRender, { passive: true });
    window.addEventListener('resize', requestScrollRender);
    reducedMotion.addEventListener('change', requestScrollRender);
    renderScroll();

    return () => {
      window.removeEventListener('scroll', requestScrollRender);
      window.removeEventListener('resize', requestScrollRender);
      reducedMotion.removeEventListener('change', requestScrollRender);
      revealObserver.disconnect();
      page.classList.remove(styles.motionReady);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const selectScene = (index: number) => {
    const reel = reelRef.current;
    const stage = stageRef.current;
    if (!reel || !stage) return;

    const stickyTop = parseFloat(getComputedStyle(stage).top);
    const reelTop = window.scrollY + reel.getBoundingClientRect().top - stickyTop;
    const travel = Math.max(1, reel.offsetHeight - stage.offsetHeight);
    const sceneCount = stage.querySelectorAll(`.${styles.reelScene}`).length;
    window.scrollTo({ top: reelTop + travel * (index + 0.5) / sceneCount, behavior: 'instant' });
  };

  return { pageRef, heroRef, heroVideoRef, reelRef, stageRef, sceneIndex, paused, togglePaused: () => setPaused((value) => !value), selectScene };
}
