/* 页面组件共享浮层位置、焦点返回与生命周期；视觉动效统一交给 Motion。 */
const UIComponents = (() => {
  let menu = null, tooltip = null, tooltipTimer, tooltipCloseTimer, toastTimer, toastRevision = 0;
  let toastRemaining = 0, toastStarted = 0, toastTrigger = null;
  const dialogs = new Map(), progressTimers = new Map();
  const announcer = document.createElement('span');
  announcer.id = 'component-toast-announcer';
  announcer.className = 'component-sr-only';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  document.body.append(announcer);
  const duration = (element, name) => {
    const value = getComputedStyle(element).getPropertyValue(name).trim();
    return parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
  };
  function position(popup, anchor, preferred = 'bottom') {
    const rect = anchor.getBoundingClientRect(), style = getComputedStyle(popup);
    const gap = parseFloat(style.getPropertyValue('--popover-gap')), edge = parseFloat(style.getPropertyValue('--space-4'));
    popup.style.maxHeight = '';
    const height = Math.min(popup.scrollHeight + 2, parseFloat(getComputedStyle(popup).maxHeight) || innerHeight);
    if (anchor.dataset.menuPlacement === 'right') {
      popup.style.maxHeight = Math.max(0, innerHeight - edge * 2) + 'px';
      const right = rect.right + gap;
      popup.style.left = Math.max(edge, Math.min(right + popup.offsetWidth <= innerWidth - edge ? right : rect.left - gap - popup.offsetWidth, innerWidth - popup.offsetWidth - edge)) + 'px';
      popup.style.top = Math.max(edge, Math.min(rect.top, innerHeight - popup.offsetHeight - edge)) + 'px';
      return {top: rect.top, left: rect.left};
    }
    const below = innerHeight - rect.bottom - gap - edge, above = rect.top - gap - edge;
    const top = preferred === 'top' ? above >= height || above > below : below < height && above > below;
    if (popup.classList.contains('ui-tooltip')) popup.dataset.actualPlacement = top ? 'top' : 'bottom';
    popup.style.maxHeight = Math.max(0, Math.min(height, top ? above : below)) + 'px';
    const x = popup.classList.contains('ui-tooltip') ? rect.left + (rect.width - popup.offsetWidth) / 2 : rect.left;
    popup.style.left = Math.max(edge, Math.min(x, innerWidth - popup.offsetWidth - edge)) + 'px';
    popup.style.top = (top ? rect.top - popup.offsetHeight - gap : rect.bottom + gap) + 'px';
    return {top: rect.top, left: rect.left};
  }
  function closeMenu(restore = false, immediate = false) {
    const state = menu;
    if (!state) return;
    menu = null;
    state.trigger.setAttribute('aria-expanded', 'false');
    if (restore && state.trigger.isConnected) state.trigger.focus({preventScroll: true});
    const finish = () => {
      if (menu?.popup === state.popup) return;
      if (state.popup.matches(':popover-open')) state.popup.hidePopover();
      state.popup.hidden = true;
    };
    if (immediate) finish(); else Motion.setVisible(state.popup, false, 'popover').then(finish);
  }
  function openMenu(trigger, last = false) {
    const popup = document.getElementById(trigger.dataset.menuOpen);
    if (!popup || trigger.disabled) return;
    closeMenu(false, true); hideTooltip(true); SelectControl.close(false, true);
    popup.hidden = false; popup.inert = false; popup.showPopover();
    const items = [...popup.querySelectorAll('[role^="menuitem"]')].filter(item => !item.disabled && item.getAttribute('aria-disabled') !== 'true');
    menu = {trigger, popup, items, anchor: position(popup, trigger)};
    trigger.setAttribute('aria-expanded', 'true');
    (last ? items.at(-1) : items[0])?.focus({preventScroll: true});
    Motion.setVisible(popup, true, 'popover');
  }
  function hideTooltip(immediate = false) {
    clearTimeout(tooltipTimer);
    clearTimeout(tooltipCloseTimer);
    const state = tooltip;
    if (!state) return;
    tooltip = null;
    const finish = () => {
      if (tooltip?.popup === state.popup) return;
      if (state.popup.matches(':popover-open')) state.popup.hidePopover();
      state.popup.hidden = true;
    };
    if (immediate) finish(); else Motion.setVisible(state.popup, false, 'tooltip').then(finish);
  }
  function showTooltip(trigger, delay = true) {
    clearTimeout(tooltipCloseTimer);
    if (tooltip?.trigger === trigger) return;
    hideTooltip(true);
    const popup = document.getElementById(trigger.dataset.tooltip);
    if (!popup) return;
    const show = () => {
      if (!trigger.isConnected) return;
      popup.hidden = false; popup.showPopover();
      tooltip = {trigger, popup, anchor: position(popup, trigger, popup.dataset.placement || 'top')};
      Motion.setVisible(popup, true, 'tooltip');
    };
    const wait = delay ? duration(trigger, '--tooltip-delay') : 0;
    if (wait > 0) tooltipTimer = setTimeout(show, wait); else show();
  }
  function openDialog(trigger) {
    const dialog = document.getElementById(trigger.dataset.overlayOpen);
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
    closeMenu(false, true); hideTooltip(true); SelectControl.close(false, true);
    const closeButton = dialog.querySelector('.overlay-close');
    if (closeButton) closeButton.hidden = dialog.dataset.closeButton === 'false';
    const form = dialog.querySelector('form');
    form?.reset();
    form?.querySelectorAll('input, textarea').forEach(input => { input.setCustomValidity(''); input.removeAttribute('aria-invalid'); });
    form?.querySelectorAll('[data-field-error]').forEach(hint => hint.hidden = true);
    dialogs.set(dialog, {trigger, closing: false, restore: true});
    trigger.setAttribute('aria-expanded', 'true');
    dialog.showModal();
    if (!dialog.classList.contains('ui-drawer')) {
      const state = dialogs.get(dialog), content = dialog.querySelector('.overlay-content');
      state.height = dialog.offsetHeight;
      state.resizeObserver = new ResizeObserver(() => {
        if (!dialog.open || state.closing) return;
        const border = parseFloat(getComputedStyle(dialog).borderTopWidth) + parseFloat(getComputedStyle(dialog).borderBottomWidth);
        const target = Math.min(content.offsetHeight + border, parseFloat(getComputedStyle(dialog).maxHeight));
        if (Math.abs(target - state.height) < 1) return;
        const from = state.resizeAnimation ? dialog.getBoundingClientRect().height : state.height;
        state.resizeAnimation?.cancel();
        state.height = target;
        const animation = Motion.resize(dialog, from, target);
        state.resizeAnimation = animation;
        animation?.finished.catch(() => {}).finally(() => {
          if (state.resizeAnimation === animation) state.resizeAnimation = null;
        });
      });
      if (content) state.resizeObserver.observe(content);
    }
    dialog.querySelector('[autofocus]')?.focus({preventScroll: true});
    Motion.play(dialog, dialog.classList.contains('ui-drawer') ? 'drawer' : 'dialog');
  }
  async function closeDialog(dialog, result = '') {
    const state = dialogs.get(dialog);
    if (!dialog?.open || state?.closing) return;
    if (state) { state.closing = true; state.resizeObserver?.disconnect(); state.resizeAnimation?.cancel(); }
    await Motion.play(dialog, dialog.classList.contains('ui-drawer') ? 'drawer' : 'dialog', {exit: true});
    if (dialog.open) dialog.close(result);
  }
  function toastHost() {
    let host = document.getElementById('component-toast');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'component-toast'; host.className = 'ui-feedback-toast'; host.hidden = true;
    host.innerHTML = `${icon('info_filled','feedback-icon')}<span class="feedback-message"></span>`;
    document.body.append(host);
    host.addEventListener('pointerenter', pauseToast);
    host.addEventListener('pointerleave', () => { if (!host.contains(document.activeElement)) resumeToast(); });
    host.addEventListener('focusin', pauseToast);
    host.addEventListener('focusout', event => { if (!host.contains(event.relatedTarget) && !host.matches(':hover')) resumeToast(); });
    return host;
  }
  function pauseToast() {
    clearTimeout(toastTimer);
    if (toastStarted) toastRemaining = Math.max(0, toastRemaining - (performance.now() - toastStarted));
    toastStarted = 0;
  }
  function resumeToast() {
    if (!toastRemaining) return;
    clearTimeout(toastTimer); toastStarted = performance.now();
    toastTimer = setTimeout(() => dismissToast(), toastRemaining);
  }
  async function dismissToast(restore = false, immediate = false) {
    clearTimeout(toastTimer); toastRemaining = 0; toastStarted = 0;
    const revision = ++toastRevision, host = document.getElementById('component-toast');
    if (!host) return;
    if (restore && toastTrigger?.isConnected && host.contains(document.activeElement)) toastTrigger.focus({preventScroll: true});
    if (!immediate) await Motion.play(host, 'toast', {exit: true});
    if (revision === toastRevision) host.hidden = true;
  }
  function toast(message, {kind = 'info', placement = 'top'} = {}) {
    clearTimeout(toastTimer); const revision = ++toastRevision;
    const host = toastHost();
    toastTrigger = host.contains(document.activeElement) ? toastTrigger : document.activeElement;
    host.dataset.kind = ['success','error'].includes(kind) ? kind : 'info';
    host.querySelector('.feedback-icon').outerHTML = icon(kind === 'success' ? 'check_circle_filled' : kind === 'error' ? 'error_filled' : 'info_filled', 'feedback-icon');
    host.querySelector('.feedback-message').textContent = String(message);
    host.dataset.placement = placement === 'bottom' ? 'bottom' : 'top';
    host.hidden = false;
    announcer.textContent = '';
    requestAnimationFrame(() => { if (revision === toastRevision) announcer.textContent = String(message); });
    Motion.play(host, 'toast');
    toastRemaining = duration(host, '--toast-duration');
    toastStarted = 0;
    if (!host.matches(':hover') && !host.contains(document.activeElement)) resumeToast();
  }
  function resetProgress(root, cancelled = false) {
    cancelAnimationFrame(progressTimers.get(root)); progressTimers.delete(root);
    const progress = root.querySelector('progress');
    progress.value = 0; progress.classList.remove('is-success','is-error');
    root.querySelector('[data-progress-label]').textContent = '准备开始 · 0%';
    root.querySelectorAll('[data-progress-start], [data-progress-interrupt]').forEach(button => button.disabled = false);
    root.querySelector('[data-progress-cancel]').disabled = true;
    root.querySelector('[data-progress-status]').textContent = cancelled ? '已取消准备' : '';
  }
  function startProgress(root, interrupted = false) {
    resetProgress(root);
    const progress = root.querySelector('progress'), label = root.querySelector('[data-progress-label]');
    root.querySelectorAll('[data-progress-start], [data-progress-interrupt]').forEach(button => button.disabled = true);
    root.querySelector('[data-progress-cancel]').disabled = false;
    root.querySelector('[data-progress-status]').textContent = '开始准备文档';
    label.textContent = '进行中 · 0%';
    const started = performance.now(), total = duration(root, '--duration-fast') * 10;
    const limit = interrupted ? 40 : 100;
    const tick = now => {
      progress.value = Math.min(limit, (now - started) / total * 100);
      label.textContent = '进行中 · ' + Math.floor(progress.value) + '%';
      if (progress.value >= limit) {
        progressTimers.delete(root);
        progress.classList.add(interrupted ? 'is-error' : 'is-success');
        label.textContent = interrupted ? '中断 · ' + Math.floor(progress.value) + '%' : '已完成 · 100%';
        root.querySelector('[data-progress-status]').textContent = interrupted ? '连接中断，请检查网络后重试' : '文档已准备完成';
        root.querySelectorAll('[data-progress-start], [data-progress-interrupt]').forEach(button => button.disabled = false);
        root.querySelector('[data-progress-cancel]').disabled = true;
      } else progressTimers.set(root, requestAnimationFrame(tick));
    };
    progressTimers.set(root, requestAnimationFrame(tick));
  }

  function init(root) {
    root.querySelectorAll('[data-character-limit]').forEach(field => {
      const hint = root.querySelector(`#${field.id}-limit-hint`);
      if (!hint) return;
      const sync = () => {
        const limit = Number(field.dataset.characterLimit);
        const excess = field.value.length - limit;
        const message = excess > 0 ? `已超出 ${excess} 个字符，请控制在 ${limit} 个字符以内。` : '';
        field.setAttribute('aria-invalid', String(excess > 0));
        field.setCustomValidity(message);
        hint.hidden = excess <= 0;
        hint.textContent = message;
      };
      field.addEventListener('input', event => { if (!event.isComposing) sync(); });
      field.addEventListener('compositionend', sync);
      field.closest('form')?.addEventListener('reset', () => setTimeout(sync, 0));
      sync();
    });
    root.querySelectorAll('dialog.ui-dialog').forEach(dialog => {
      dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const items = [...dialog.querySelectorAll('a[href], button, input, textarea, select, [tabindex]')].filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length && !element.closest('[inert]'));
        const first = items[0], last = items.at(-1);
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
      dialog.addEventListener('click', event => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        const state = dialogs.get(dialog); state?.resizeObserver?.disconnect(); state?.resizeAnimation?.cancel(); dialogs.delete(dialog);
        state?.trigger.setAttribute('aria-expanded', 'false');
        if (state?.restore && state.trigger.isConnected) state.trigger.focus({preventScroll: true});
      });
    });
  }
  function cleanup() {
    closeMenu(false, true); hideTooltip(true); dismissToast(false, true); announcer.textContent = "";
    for (const [dialog, state] of dialogs) {
      state.restore = false;
      state.resizeObserver?.disconnect(); state.resizeAnimation?.cancel();
      dialog.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      if (dialog.open) dialog.close();
    }
    dialogs.clear();
    for (const timer of progressTimers.values()) cancelAnimationFrame(timer);
    progressTimers.clear();
  }
  document.addEventListener('click', async event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.dataset.menuOpen) menu?.trigger === target ? closeMenu(true) : openMenu(target);
    else if (target.dataset.overlayOpen) openDialog(target);
    else if (target.hasAttribute('data-overlay-close')) closeDialog(target.closest('dialog'));
    else if (target.dataset.navToggle) {
      const content = document.getElementById(target.dataset.navToggle), open = target.getAttribute('aria-expanded') !== 'true';
      target.setAttribute('aria-expanded', String(open)); Motion.expand(content, open);
    } else if (target.hasAttribute('data-progress-start')) startProgress(target.closest('[data-progress-demo]'));
    else if (target.hasAttribute('data-progress-interrupt')) startProgress(target.closest('[data-progress-demo]'), true);
    else if (target.hasAttribute('data-progress-cancel')) resetProgress(target.closest('[data-progress-demo]'), true);
    else if (target.hasAttribute('data-open-site-search')) document.getElementById('open-search').click();
    if (target.hasAttribute('data-ui-toast')) toast(target.dataset.uiToast, {kind: target.dataset.toastKind, placement: target.dataset.toastPlacement});
    const item = target.closest('[role^="menuitem"]');
    if (item && !item.dataset.menuOpen) {
      if (item.disabled || item.getAttribute('aria-disabled') === 'true') { event.preventDefault(); return; }
      if (item.getAttribute('role') === 'menuitemcheckbox') {
        const checked = item.getAttribute('aria-checked') !== 'true';
        item.setAttribute('aria-checked', String(checked));
        const details = document.getElementById(item.dataset.menuDetails);
        if (details) details.hidden = !checked;
      } else closeMenu(true);
    }
    if (target.hasAttribute('data-copy-text')) {
      try { await navigator.clipboard.writeText(target.dataset.copyText); toast('名称已复制', {kind: 'success'}); }
      catch { toast('未能复制，请使用系统复制功能', {kind: 'error'}); }
    }
    if (target.matches('a[href]') && target.closest('dialog.ui-dialog')) closeDialog(target.closest('dialog'));
  });
  document.addEventListener('submit', async event => {
    const form = event.target.closest('[data-overlay-form]');
    if (!form) return;
    event.preventDefault();
    const input = form.elements.namedItem('title');
    for (const field of form.querySelectorAll('input[required], textarea[required]')) {
      if (field.value.trim()) continue;
      field.setCustomValidity('请填写此项。');
      field.setAttribute('aria-invalid', 'true');
      const hint = field.closest('.text-field')?.querySelector('[data-field-error]');
      if (hint) hint.hidden = false;
      field.focus();
      return;
    }
    if (!form.reportValidity()) return;
    const value = input?.value.trim(), dialog = form.closest('dialog'), output = document.getElementById(form.dataset.overlayOutput);
    await closeDialog(dialog, 'confirm');
    if (output?.isConnected && dialog.returnValue === 'confirm') output.textContent = dialog.classList.contains('ui-drawer') ? `已保存：${value}` : `已创建项目“${value}”。`;
  });
  document.addEventListener('input', event => {
    const input = event.target;
    if (!input.matches('.ui-dialog input, .ui-dialog textarea') || input.hasAttribute('data-character-limit')) return;
    input.setCustomValidity('');
    if (input.value.trim()) {
      input.removeAttribute('aria-invalid');
      const hint = input.closest('.text-field')?.querySelector('[data-field-error]');
      if (hint) hint.hidden = true;
    }
  });
  document.addEventListener('keydown', event => {
    const trigger = event.target.closest('[data-menu-open]');
    if (trigger && trigger.dataset.menuPlacement === 'right' && event.key === 'ArrowRight') { event.preventDefault(); openMenu(trigger); return; }
    if (menu && menu.trigger.dataset.menuPlacement === 'right' && event.key === 'ArrowLeft') { event.preventDefault(); closeMenu(true); return; }
    if (trigger && trigger.dataset.menuPlacement !== 'right' && ['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); openMenu(trigger, event.key === 'ArrowUp'); return; }
    const localMenu = event.target.closest('.ui-menu');
    const navigationMenu = menu && menu.popup.contains(event.target) ? menu : localMenu?.classList.contains('menu-inline') ? {items: [...localMenu.querySelectorAll('[role^="menuitem"]')].filter(item => !item.disabled)} : null;
    if (navigationMenu) {
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const items = navigationMenu.items;
        const index = items.indexOf(document.activeElement), next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      } else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); }
      else if (event.key === 'Tab') closeMenu(true, true);
      else if (event.key === ' ' && event.target.matches('a')) { event.preventDefault(); event.target.click(); }
    }
    if (event.key === 'Escape') hideTooltip(true);
  });
  document.addEventListener('pointerdown', event => { if (menu && !menu.trigger.contains(event.target) && !menu.popup.contains(event.target)) closeMenu(false, true); });
  document.addEventListener('focusin', event => {
    if (menu && !menu.trigger.contains(event.target) && !menu.popup.contains(event.target)) closeMenu(false, true);
    const trigger = event.target.closest('[data-tooltip]');
    if (trigger) showTooltip(trigger, false); else if (tooltip && !tooltip.popup.contains(event.target)) hideTooltip();
  });
  // 短暂离开缓冲允许指针穿过触发器和提示框之间的间隙；不延迟显示。
  function scheduleTooltipClose() {
    clearTimeout(tooltipCloseTimer);
    const state = tooltip;
    if (!state) return;
    tooltipCloseTimer = setTimeout(() => {
      if (tooltip !== state || state.trigger.matches(':hover') || state.popup.matches(':hover') || state.trigger.contains(document.activeElement)) return;
      hideTooltip();
    }, duration(state.trigger, '--control-color-duration'));
  }
  document.addEventListener('pointerover', event => {
    const trigger = event.target.closest('[data-tooltip]');
    if (trigger && !trigger.contains(event.relatedTarget)) showTooltip(trigger);
    if (tooltip?.popup.contains(event.target)) clearTimeout(tooltipCloseTimer);
  });
  document.addEventListener('pointerout', event => {
    const trigger = event.target.closest('[data-tooltip]');
    if (trigger && !trigger.contains(event.relatedTarget) && !tooltip?.popup.contains(event.relatedTarget)) {
      clearTimeout(tooltipTimer);
      if (!trigger.contains(document.activeElement)) scheduleTooltipClose();
    }
    if (tooltip?.popup.contains(event.target) && !tooltip.popup.contains(event.relatedTarget) && !tooltip.trigger.contains(event.relatedTarget)) scheduleTooltipClose();
  });
  window.addEventListener('scroll', event => {
    for (const state of [menu, tooltip]) {
      if (!state || state.popup.contains(event.target)) continue;
      const rect = state.trigger.getBoundingClientRect();
      if (Math.abs(rect.top - state.anchor.top) > 1 || Math.abs(rect.left - state.anchor.left) > 1) state === menu ? closeMenu(false, true) : hideTooltip(true);
    }
  }, true);
  window.addEventListener('resize', () => {
    if (menu) menu.anchor = position(menu.popup, menu.trigger);
    if (tooltip) tooltip.anchor = position(tooltip.popup, tooltip.trigger, tooltip.popup.dataset.placement || 'top');
  });
  return Object.freeze({init, cleanup, toast});
})();
