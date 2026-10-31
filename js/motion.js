/* 动效模板仅负责视觉播放；焦点、模态、路由由组件负责。 */
const Motion = (() => {
  const running = new WeakMap();
  const visibility = new WeakMap();
  const expansions = new WeakMap();
  const backdrops = new WeakMap();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const templates = {
    sidebarBackdrop: { duration: '--duration-normal', offset: '--space-0', easing: '--easing-ease-in-out' },
    page: { duration: '--page-entry-duration', offset: '--motion-page-offset' },
    popover: { duration: '--duration-fast', offset: '--motion-popover-offset' },
    toast: { duration: '--duration-fast', offset: '--motion-toast-offset', easing: '--easing-ease-in-out' },
    tooltip: { duration: '--tooltip-duration', offset: '--motion-tooltip-offset', easing: '--easing-ease-in-out' },
    dialog: { duration: '--duration-fast', offset: '--motion-dialog-offset' },
    drawer: { duration: '--duration-normal', offset: '--motion-drawer-x', axis: 'X', easing: '--easing-ease-in-out' }
  };
  async function play(element, name, { exit = false } = {}) {
    const template = templates[name];
    if (!template) throw new Error(`Unknown motion template: ${name}`);
    running.get(element)?.cancel();
    backdrops.get(element)?.cancel();
    backdrops.delete(element);
    running.delete(element);
    if (reduced.matches || !element.animate) return true;
    const style = getComputedStyle(element);
    const time = style.getPropertyValue(template.duration).trim();
    const duration = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
    const frames = [
      { opacity: template.axis ? 1 : 0, transform: `translate${template.axis || 'Y'}(var(${template.offset}${template.axis ? ', 100%' : ''}))` },
      { opacity: 1, transform: `translate${template.axis || 'Y'}(0)` }
    ];
    const options = {
      duration, easing: style.getPropertyValue(template.easing || (exit ? '--easing-ease-in' : '--easing-ease-out')).trim(),
      fill: 'both'
    };
    const animation = element.animate(exit ? frames.reverse() : frames, options);
    const backdrop = element.matches('dialog[open]') && ['dialog','drawer'].includes(name)
      ? element.animate(exit ? [{opacity:1},{opacity:0}] : [{opacity:0},{opacity:1}], {...options, pseudoElement:'::backdrop'})
      : null;
    if (backdrop) {
      const start = document.timeline.currentTime;
      animation.startTime = start;
      backdrop.startTime = start;
      backdrops.set(element, backdrop);
      active.add(backdrop);
    }
    running.set(element, animation);
    active.add(animation);
    try {
      await Promise.all([animation.finished, ...(backdrop ? [backdrop.finished] : [])]);
      return running.get(element) === animation;
    } catch { return false; }
    finally {
      active.delete(animation);
      if (backdrop) {
        active.delete(backdrop);
        if (backdrops.get(element) === backdrop) { backdrops.delete(element); backdrop.cancel(); }
      }
      if (running.get(element) === animation) {
        running.delete(element);
        animation.cancel();
      }
    }
  }
  function resize(element, from, to) {
    if (reduced.matches || !element.animate || Math.abs(from - to) < 1) return null;
    const style = getComputedStyle(element);
    const time = style.getPropertyValue('--duration-fast').trim();
    const animation = element.animate([{height: from + 'px'}, {height: to + 'px'}], {
      duration: parseFloat(time) * (time.endsWith('ms') ? 1 : 1000),
      easing: style.getPropertyValue('--easing-ease-in-out').trim(), fill: 'both'
    });
    active.add(animation);
    animation.finished.catch(() => {}).finally(() => { active.delete(animation); animation.cancel(); });
    return animation;
  }
  async function expand(element, open) {
    const previous = expansions.get(element);
    if (!previous && element.hidden === !open) return;
    const from = element.hidden ? 0 : element.getBoundingClientRect().height;
    previous?.cancel();
    expansions.delete(element);
    element.inert = !open;
    element.hidden = false;
    element.style.overflow = 'hidden';
    const animation = resize(element, from, open ? element.scrollHeight : 0);
    if (!animation) {
      element.hidden = !open;
      element.style.removeProperty('overflow');
      return;
    }
    expansions.set(element, animation);
    try {
      await animation.finished;
      if (expansions.get(element) === animation) element.hidden = !open;
    } catch { /* A later toggle takes over the current height. */ }
    finally {
      if (expansions.get(element) === animation) {
        expansions.delete(element);
        element.style.removeProperty('overflow');
      }
    }
  }
  async function setVisible(element, open, template = 'popover') {
    const revision = {};
    visibility.set(element, revision);
    element.inert = !open;
    if (open) element.hidden = false;
    const completed = await play(element, template, { exit: !open });
    if (completed && visibility.get(element) === revision && !open) element.hidden = true;
    return completed;
  }
  reduced.addEventListener('change', event => {
    if (event.matches) active.forEach(animation => animation.finish());
  });
  return Object.freeze({ play, setVisible, resize, expand });
})();
