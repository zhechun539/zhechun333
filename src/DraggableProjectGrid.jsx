import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_EDGE = 20;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DraggableProjectGrid({ projects, onProjectOpen }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const canisterRef = useRef(null);
  const draggedRef = useRef(false);
  const resetDragRef = useRef(null);
  const finishUnspoolRef = useRef(null);
  const unspoolAnimationRef = useRef(null);
  const audioContextRef = useRef(null);
  const expandedRef = useRef(false);
  const unspoolingRef = useRef(false);
  const x = useMotionValue(GRID_EDGE);
  const y = useMotionValue(GRID_EDGE);
  const shouldReduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFilmReady, setIsFilmReady] = useState(false);
  const [constraints, setConstraints] = useState({
    left: GRID_EDGE,
    right: GRID_EDGE,
    top: GRID_EDGE,
    bottom: GRID_EDGE,
  });
  const sprocketCount = projects.length * 7 + 4;

  const measure = useCallback(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    const canister = canisterRef.current;
    if (!container || !grid) return;

    const nextIsCompact = container.clientWidth <= 760;
    setIsCompact(nextIsCompact);

    const next = {
      left: Math.min(GRID_EDGE, container.clientWidth - grid.scrollWidth - GRID_EDGE),
      right: GRID_EDGE,
      top: nextIsCompact
        ? GRID_EDGE
        : Math.min(GRID_EDGE, container.clientHeight - grid.scrollHeight - GRID_EDGE),
      bottom: GRID_EDGE,
    };

    setConstraints(next);
    y.set(Math.max(0, (container.clientHeight - grid.offsetHeight) / 2));

    if (!expandedRef.current && canister) {
      x.set(Math.max(GRID_EDGE, (container.clientWidth - canister.offsetWidth) / 2));
      return;
    }

    if (unspoolingRef.current) return;
    x.set(clamp(x.get(), next.left, next.right));
  }, [x, y]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => () => {
    if (resetDragRef.current) window.clearTimeout(resetDragRef.current);
    if (finishUnspoolRef.current) window.clearTimeout(finishUnspoolRef.current);
    unspoolAnimationRef.current?.stop();
    audioContextRef.current?.close().catch(() => {});
  }, []);

  const playFilmPullSound = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;
    context.resume().catch(() => {});
    const now = context.currentTime;
    const duration = shouldReduceMotion ? 0.34 : 1.5;
    const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
    const scrapeBuffer = context.createBuffer(1, frameCount, context.sampleRate);
    const scrapeData = scrapeBuffer.getChannelData(0);

    for (let index = 0; index < frameCount; index += 1) {
      const time = index / context.sampleRate;
      const progress = index / frameCount;
      const bodyEnvelope = Math.sin(Math.PI * progress) ** 0.65;
      const sprocketPulse = 0.28 + 0.72 * Math.max(0, Math.sin(time * Math.PI * 26)) ** 7;
      scrapeData[index] = (Math.random() * 2 - 1) * bodyEnvelope * sprocketPulse;
    }

    const scrape = context.createBufferSource();
    const scrapeFilter = context.createBiquadFilter();
    const scrapeGain = context.createGain();
    scrape.buffer = scrapeBuffer;
    scrapeFilter.type = 'bandpass';
    scrapeFilter.frequency.setValueAtTime(1180, now);
    scrapeFilter.frequency.linearRampToValueAtTime(760, now + duration);
    scrapeFilter.Q.value = 0.62;
    scrapeGain.gain.setValueAtTime(0.0001, now);
    scrapeGain.gain.linearRampToValueAtTime(0.065, now + 0.055);
    scrapeGain.gain.linearRampToValueAtTime(0.04, now + duration * 0.82);
    scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    scrape.connect(scrapeFilter).connect(scrapeGain).connect(context.destination);
    scrape.start(now);

    const spool = context.createOscillator();
    const spoolGain = context.createGain();
    spool.type = 'triangle';
    spool.frequency.setValueAtTime(92, now);
    spool.frequency.exponentialRampToValueAtTime(58, now + duration);
    spoolGain.gain.setValueAtTime(0.018, now);
    spoolGain.gain.linearRampToValueAtTime(0.009, now + duration * 0.72);
    spoolGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    spool.connect(spoolGain).connect(context.destination);
    spool.start(now);
    spool.stop(now + duration + 0.02);

    const stopClick = context.createOscillator();
    const stopGain = context.createGain();
    stopClick.type = 'square';
    stopClick.frequency.setValueAtTime(142, now + duration - 0.045);
    stopClick.frequency.exponentialRampToValueAtTime(66, now + duration + 0.025);
    stopGain.gain.setValueAtTime(0.0001, now + duration - 0.05);
    stopGain.gain.linearRampToValueAtTime(0.036, now + duration - 0.035);
    stopGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.03);
    stopClick.connect(stopGain).connect(context.destination);
    stopClick.start(now + duration - 0.05);
    stopClick.stop(now + duration + 0.04);
  };

  const unspoolFilm = () => {
    if (expandedRef.current) return;
    expandedRef.current = true;
    unspoolingRef.current = true;
    setIsExpanded(true);
    setIsFilmReady(false);
    playFilmPullSound();

    unspoolAnimationRef.current?.stop();
    unspoolAnimationRef.current = animate(x, GRID_EDGE, {
      duration: shouldReduceMotion ? 0.06 : 0.64,
      ease: [0.22, 1, 0.36, 1],
    });

    finishUnspoolRef.current = window.setTimeout(() => {
      unspoolingRef.current = false;
      setIsFilmReady(true);
      measure();
    }, shouldReduceMotion ? 90 : 1560);
  };

  const handleDragStart = () => {
    draggedRef.current = true;
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    resetDragRef.current = window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  };

  return (
    <div
      className={`draggable-project-grid${isDragging ? ' is-dragging' : ''}${isExpanded ? ' is-expanded' : ' is-collapsed'}${isFilmReady ? ' is-film-ready' : ''}`}
      ref={containerRef}
      aria-label={isFilmReady ? `${projects.length} 个项目组成的胶片，支持拖动浏览` : '项目胶卷，点击后展开胶片'}
      aria-busy={isExpanded && !isFilmReady}
    >
      <motion.div
        className="draggable-project-grid-track"
        ref={gridRef}
        style={{ x, y, '--project-count': projects.length }}
        drag={isFilmReady ? 'x' : false}
        dragConstraints={constraints}
        dragElastic={0}
        dragMomentum={!shouldReduceMotion}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <button
          className="project-film-canister-lead"
          ref={canisterRef}
          type="button"
          onClick={unspoolFilm}
          aria-label={isExpanded ? '项目胶片已展开' : '点击竖放胶卷，拉出项目胶片'}
          aria-controls="project-film-strip"
          aria-expanded={isExpanded}
          disabled={isExpanded}
        >
          <span className="project-film-canister-contact" />
          <span className="project-film-canister-throat" />
          <img
            src={`${import.meta.env.BASE_URL}assets/projects-film-canister-superia-200-powder-blue-clean.webp`}
            alt=""
            width="310"
            height="464"
            draggable="false"
          />
          <span className="project-film-canister-gloss" />
        </button>
        <div
          className="project-film-strip"
          id="project-film-strip"
          aria-hidden={!isFilmReady}
        >
          <span className="project-film-sprockets project-film-sprockets-top" aria-hidden="true">
            {Array.from({ length: sprocketCount }, (_, index) => <i key={`top-${index}`} />)}
          </span>
          <span className="project-film-roll-label" aria-hidden="true">35 MM · PROJECT FILM</span>
          {projects.map((project, index) => (
            <button
              className={`draggable-project-tile${project.title === 'Hatch Wheel Pet' ? ' is-pet-project' : ''}`}
              type="button"
              disabled={!isFilmReady}
              tabIndex={isFilmReady ? 0 : -1}
              onClick={(event) => {
                if (!draggedRef.current) onProjectOpen(index, event.currentTarget);
              }}
              aria-label={`查看项目 ${String(index + 1).padStart(2, '0')}：${project.title}`}
              key={project.title}
            >
              <span className="draggable-project-tile-visual film-project-visual">
                <img src={project.image} alt="" loading={index < 4 ? 'eager' : 'lazy'} draggable="false" />
                <span className="draggable-project-tile-number">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="draggable-project-tile-copy">
                <span>
                  <strong>{project.title}</strong>
                  <small>{project.aiProduct ? '独立产品实践 · AI 应用' : project.aiSkill ? '工作流实践 · AI Skill' : project.subtitle}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span className="draggable-project-tile-result">
                {project.stats[0].value} · {project.stats[0].label}
              </span>
            </button>
          ))}
          <span className="project-film-sprockets project-film-sprockets-bottom" aria-hidden="true">
            {Array.from({ length: sprocketCount }, (_, index) => <i key={`bottom-${index}`} />)}
          </span>
        </div>
      </motion.div>
      <span className="project-film-canister-guide" aria-hidden="true">
        <strong>点击胶卷</strong>
        <small>拉出项目胶片</small>
      </span>
      <span className="sr-only" aria-live="polite">
        {isFilmReady ? `胶片已展开，可以拖动浏览 ${projects.length} 个项目` : ''}
      </span>
    </div>
  );
}
