/* 单选选择框：原生 select 保存表单值，组合框负责展示与键盘导航。 */
const SelectControl = (() => {
  const instances = new WeakMap();
  let active = null;
  let search = '';
  let searchTimer;
  function close(restoreFocus = false, immediate = false) {
    const state = active;
    if (!state) return;
    active = null;
    state.trigger.setAttribute('aria-expanded', 'false');
    state.trigger.removeAttribute('aria-activedescendant');
    if (restoreFocus) state.trigger.focus();
    const finish = () => {
      if (active === state) return;
      state.menu.hidden = true;
      if (state.menu.matches(':popover-open')) state.menu.hidePopover();
    };
    if (immediate) finish();
    else Motion.setVisible(state.menu, false, 'popover').then(finish);
    clearTimeout(searchTimer);
    search = '';
  }
  function sync(state) {
    const {native, trigger, value, label, hint} = state;
    value.textContent = native.selectedOptions[0]?.textContent || '请选择';
    trigger.disabled = native.disabled;
    trigger.dataset.empty = String(!native.value);
    trigger.setAttribute('aria-invalid', native.getAttribute('aria-invalid') || 'false');
    trigger.setAttribute('aria-required', String(native.required));
    const description = native.getAttribute('aria-describedby');
    if (description) trigger.setAttribute('aria-describedby', description);
    else trigger.removeAttribute('aria-describedby');
    if (label) trigger.setAttribute('aria-labelledby', label.id + ' ' + value.id);
    else trigger.setAttribute('aria-label', native.getAttribute('aria-label') || '选择选项');
    if (hint && hint.dataset.error !== undefined) hint.hidden = native.getAttribute('aria-invalid') !== 'true';
    if (active === state && native.disabled) close(false, true);
  }
  function position(state) {
    const {menu, trigger} = state;
    const rect = trigger.getBoundingClientRect();
    state.anchor = {top: rect.top, left: rect.left};
    const gap = parseFloat(getComputedStyle(menu).getPropertyValue('--popover-gap')) || 4;
    const edge = parseFloat(getComputedStyle(menu).getPropertyValue('--space-4')) || 8;
    const below = window.innerHeight - rect.bottom - gap - edge;
    const above = rect.top - gap - edge;
    const up = below < menu.scrollHeight && above > below;
    const minimum = parseFloat(getComputedStyle(menu).getPropertyValue('--select-menu-min-width')) || parseFloat(getComputedStyle(menu).minWidth) || 0;
    menu.style.width = Math.min(Math.max(rect.width, minimum), window.innerWidth - edge * 2) + 'px';
    menu.style.maxHeight = '';
    const limit = parseFloat(getComputedStyle(menu).maxHeight);
    menu.style.maxHeight = Math.max(0, Math.min(limit, up ? above : below)) + 'px';
    menu.style.left = Math.max(edge, Math.min(rect.left, window.innerWidth - menu.offsetWidth - edge)) + 'px';
    menu.style.top = (up ? rect.top - gap - menu.offsetHeight : rect.bottom + gap) + 'px';
  }
  function highlight(state, index) {
    if (!state.items.length) return;
    state.index = (index + state.items.length) % state.items.length;
    state.menu.querySelectorAll('[data-active]').forEach(item => item.removeAttribute('data-active'));
    const item = state.items[state.index];
    item.dataset.active = 'true';
    state.trigger.setAttribute('aria-activedescendant', item.id);
    // Only scroll the list; scrollIntoView can also move the document and dismiss the popup.
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (top < state.menu.scrollTop) state.menu.scrollTop = top;
    else if (bottom > state.menu.scrollTop + state.menu.clientHeight) state.menu.scrollTop = bottom - state.menu.clientHeight;
  }
  function buildOptions(state) {
    const {native, menu} = state;
    menu.replaceChildren();
    [...native.children].forEach(child => {
      let target = menu;
      if (child.tagName === 'OPTGROUP') {
        const group = document.createElement('div');
        group.className = 'select-option-group';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', child.label);
        const title = document.createElement('div');
        title.className = 'select-group-label';
        title.setAttribute('aria-hidden', 'true');
        title.textContent = child.label;
        group.append(title);
        menu.append(group);
        target = group;
      }
      const options = child.tagName === 'OPTGROUP' ? [...child.children] : [child];
      options.forEach(option => {
        if (option.tagName !== 'OPTION' || option.hidden) return;
        const item = document.createElement('div');
        const index = [...native.options].indexOf(option);
        item.id = native.id + '-option-' + index;
        item.className = 'select-option';
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(option.selected));
        item.setAttribute('aria-disabled', String(option.disabled || child.disabled && child.tagName === 'OPTGROUP'));
        item.dataset.index = index;
        const text = document.createElement('span');
        text.className = 'select-option-label';
        text.textContent = option.textContent;
        item.append(text);
        item.insertAdjacentHTML('beforeend', icon('check', 'select-check'));
        target.append(item);
      });
    });
    state.items = [...menu.querySelectorAll('[role="option"]:not([aria-disabled="true"])')];
  }
  function open(state, last = false) {
    if (state.native.disabled) return;
    close(false, true);
    sync(state);
    buildOptions(state);
    active = state;
    state.menu.hidden = false;
    state.menu.showPopover();
    position(state);
    state.trigger.setAttribute('aria-expanded', 'true');
    const selected = state.items.findIndex(item => item.getAttribute('aria-selected') === 'true');
    highlight(state, selected < 0 ? last ? state.items.length - 1 : 0 : selected);
    Motion.setVisible(state.menu, true, 'popover');
  }
  function commit(state, item) {
    if (!item || item.getAttribute('aria-disabled') === 'true') return;
    const changed = state.native.selectedIndex !== Number(item.dataset.index);
    state.native.selectedIndex = Number(item.dataset.index);
    state.native.removeAttribute('aria-invalid');
    sync(state);
    close(true);
    if (changed) {
      state.native.dispatchEvent(new Event('input', {bubbles: true}));
      state.native.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }
  function init(root = document) {
    root.querySelectorAll('.ui-select > select').forEach(native => {
      if (instances.has(native)) { sync(instances.get(native)); return; }
      const field = native.parentElement;
      const label = field.querySelector('label');
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.id = native.id + '-trigger';
      trigger.className = 'select-trigger';
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', native.id + '-listbox');
      const value = document.createElement('span');
      value.className = 'select-value';
      value.id = native.id + '-value';
      trigger.append(value);
      trigger.insertAdjacentHTML('beforeend', icon('chevron_right', 'select-chevron'));
      const menu = document.createElement('div');
      menu.className = 'select-menu';
      menu.id = native.id + '-listbox';
      menu.setAttribute('role', 'listbox');
      menu.setAttribute('popover', 'manual');
      menu.setAttribute('aria-label', label?.textContent || native.getAttribute('aria-label') || '选项');
      menu.hidden = true;
      native.hidden = true;
      native.tabIndex = -1;
      native.setAttribute('aria-hidden', 'true');
      if (label) { label.id = native.id + '-label'; label.htmlFor = trigger.id; }
      native.after(trigger, menu);
      const state = {native, trigger, menu, value, label, hint: field.querySelector('.select-hint'), items: [], index: 0};
      instances.set(native, state);
      sync(state);
      trigger.addEventListener('click', () => active === state ? close() : open(state));
      trigger.addEventListener('keydown', event => {
        const key = event.key;
        if (key === 'Tab') { if (active === state) close(false, true); return; }
        if (key === 'Escape') { if (active === state) { event.preventDefault(); event.stopPropagation(); close(); } return; }
        if (['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(key)) {
          event.preventDefault();
          if (active !== state) { open(state, key === 'ArrowUp' || key === 'End'); if (key === 'Home') highlight(state, 0); if (key === 'End') highlight(state, state.items.length - 1); return; }
          if (key === 'Enter' || key === ' ') commit(state, state.items[state.index]);
          else highlight(state, key === 'Home' ? 0 : key === 'End' ? state.items.length - 1 : state.index + (key === 'ArrowDown' ? 1 : -1));
        } else if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.isComposing) {
          if (active !== state) open(state);
          clearTimeout(searchTimer);
          search += key.toLocaleLowerCase();
          const index = state.items.findIndex(item => item.textContent.trim().toLocaleLowerCase().startsWith(search));
          if (index >= 0) highlight(state, index);
          const delay = getComputedStyle(trigger).getPropertyValue('--select-typeahead-delay').trim();
          searchTimer = setTimeout(() => {search = '';}, parseFloat(delay) * (delay.endsWith('ms') ? 1 : 1000));
        }
      });
      menu.addEventListener('pointerdown', event => event.preventDefault());
      menu.addEventListener('pointermove', event => {
        const index = state.items.indexOf(event.target.closest('[role="option"]'));
        if (index >= 0) highlight(state, index);
      });
      menu.addEventListener('click', event => commit(state, event.target.closest('[role="option"]')));
      native.addEventListener('change', () => sync(state));
      native.addEventListener('invalid', event => {
        event.preventDefault();
        native.setAttribute('aria-invalid', 'true');
        sync(state);
        trigger.focus();
      });
      new MutationObserver(() => {
        sync(state);
        if (active === state) close(false, true);
      }).observe(native, {attributes: true, attributeFilter: ['disabled','required','aria-invalid','aria-describedby']});
    });
  }
  document.addEventListener('pointerdown', event => {
    if (active && !active.trigger.contains(event.target) && !active.menu.contains(event.target)) close(false, true);
  });
  document.addEventListener('focusin', event => {
    if (active && !active.trigger.contains(event.target) && !active.menu.contains(event.target)) close(false, true);
  });
  document.addEventListener('reset', event => setTimeout(() => init(event.target), 0));
  window.addEventListener('resize', () => close(false, true));
  window.addEventListener('scroll', event => {
    if (!active || active.menu.contains(event.target)) return;
    const rect = active.trigger.getBoundingClientRect();
    if (Math.abs(rect.top - active.anchor.top) > 1 || Math.abs(rect.left - active.anchor.left) > 1) close(false, true);
  }, true);
  return Object.freeze({init, close});
})();
