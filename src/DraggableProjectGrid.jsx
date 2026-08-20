import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_EDGE = 20;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DraggableProjectGrid({ projects, onProjectOpen }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const draggedRef = useRef(false);
  const resetDragRef = useRef(null);
  const x = useMotionValue(GRID_EDGE);
  const y = useMotionValue(GRID_EDGE);
  const shouldReduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [constraints, setConstraints] = useState({
    left: GRID_EDGE,
    right: GRID_EDGE,
    top: GRID_EDGE,
    bottom: GRID_EDGE,
  });
  const sprocketCount = projects.length * 2 + 2;

  const measure = useCallback(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
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
    x.set(clamp(x.get(), next.left, next.right));
    y.set(clamp(y.get(), next.top, next.bottom));
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
  }, []);

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
      className={`draggable-project-grid${isDragging ? ' is-dragging' : ''}`}
      ref={containerRef}
      aria-label={`${projects.length} 个项目组成的可浏览项目总览`}
    >
      <motion.div
        className="draggable-project-grid-track"
        ref={gridRef}
        style={{ x, y, '--project-count': projects.length }}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0}
        dragMomentum={!shouldReduceMotion}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <span className="project-film-sprockets project-film-sprockets-top" aria-hidden="true">
          {Array.from({ length: sprocketCount }, (_, index) => <i key={`top-${index}`} />)}
        </span>
        <span className="project-film-roll-label" aria-hidden="true">FILM</span>
        {projects.map((project, index) => (
          <button
            className="draggable-project-tile"
            type="button"
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
      </motion.div>
    </div>
  );
}
