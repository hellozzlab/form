/* 原稿保持不变；默认使用预生成蒙版，避免浏览器实时计算滤镜。 */
const Illustrations = (() => {
  const items = Object.freeze([
    {id:'empty', en:'Empty state', zh:'首次空白', description:'展开的空白笔记本张开双手，欢迎第一条内容。', use:'还没有文档、项目或收藏'},
    {id:'no-results', en:'No results', zh:'搜索无结果', description:'放大镜摊开双手，轻松表达暂时没有找到结果。', use:'搜索、筛选未找到匹配内容'},
    {id:'all-done', en:'All done', zh:'全部完成', description:'带对勾的卡片挥手，表达完成后的轻快。', use:'待办清空、检查完成'},
    {id:'offline', en:'Offline', zh:'无网络', description:'暂时分开的插头伸出手，等待重新连接。', use:'离线、连接断开'},
    {id:'load-error', en:'Load error', zh:'加载失败', description:'纸页上的重试箭头，提示可以再试一次。', use:'请求失败、内容暂时无法加载'},
    {id:'access-denied', en:'No access', zh:'无访问权限', description:'关闭的门与摊开的双手，温和表达访问边界。', use:'需要登录、申请或获得访问权限'},
    {id:'not-found', en:'Not found', zh:'页面未找到', description:'地图上的路径停在空圈前，提示换个方向继续。', use:'页面不存在、链接失效'},
    {id:'payment-success', en:'Payment complete', zh:'支付成功', description:'收据上的对勾与挥手，确认支付成功。', use:'支付结果已确认成功'},
    {id:'payment-failed', en:'Payment failed', zh:'支付失败', description:'收据上的叉号与摊手，提示本次支付未完成。', use:'已确认支付失败，不用于等待确认'},
    {id:'processing', en:'Processing', zh:'处理中', description:'沙漏安静等待，结果仍在处理中。', use:'提交后处理中、结果仍待确认'},
    {id:'upload', en:'Upload files', zh:'上传文件', description:'文件夹伸手接住纸页，表达上传与导入。', use:'上传入口、导入文件'},
    {id:'collaboration', en:'Collaboration', zh:'邀请协作', description:'两个对话气泡击掌，邀请一起完成。', use:'邀请成员、分享与协作'}
  ]);
  // 按原稿主体占比校准视觉大小，统一展示尺寸不变。
  const artworkScale = Object.freeze({
    'load-error': 0.78, 'access-denied': 0.78,
    'payment-success': 0.78, 'payment-failed': 0.78,
    processing: 0.78, upload: 0.78, collaboration: 0.82
  });
  let sequence = 0;
  const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function render(name, {size = 160, decorative = false, label, source, banner = false} = {}) {
    const item = items.find(item => item.id === name);
    if (!item) throw new Error('Unknown illustration: ' + name);
    if (size !== 160) throw new Error('Unknown illustration size: ' + size);
    const scale = artworkScale[name] || 1;
    const inset = (1000 - 1000 * scale) / 2;
    const layers = banner ? ['banner-outer','banner-inner','ink'] : ['paper','fill','ink'];
    const key = 'art-' + name + '-' + (++sequence);
    return `<svg class="illustration-art" data-illustration-loading viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" focusable="false"${decorative ? ' aria-hidden="true"' : ` role="img" aria-labelledby="${key}-title"`}>${decorative ? '' : `<title id="${key}-title">${escape(label || item.zh)}</title>`}
  <defs>
    ${source ? `    <image id="${key}-source" href="${escape(source || 'assets/illustrations/' + name + '.png')}" x="${inset}" y="${inset}" width="${1000 * scale}" height="${1000 * scale}" preserveAspectRatio="xMidYMid meet"/>
    ${[['ink','-1 0 0 0 1'],['fill','1 0 -1 0 0'],['paper','0 0 1 0 0']].map(([layer,row]) => `<filter id="${key}-${layer}-filter" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix values="${row} ${row} ${row} 0 0 0 1 0"/><feComponentTransfer><feFuncR type="linear" slope="1.1" intercept="-0.1"/><feFuncG type="linear" slope="1.1" intercept="-0.1"/><feFuncB type="linear" slope="1.1" intercept="-0.1"/><feFuncA type="discrete" tableValues="0 0 0 0 1"/></feComponentTransfer></filter><mask id="${key}-${layer}" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" style="mask-type:luminance"><use href="#${key}-source" filter="url(#${key}-${layer}-filter)"/></mask>`).join('')}` : layers.map(layer => `<mask id="${key}-${layer}" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000" style="mask-type:alpha"><image href="assets/illustrations/masks/${name}-${layer}.png" x="${inset}" y="${inset}" width="${1000 * scale}" height="${1000 * scale}" preserveAspectRatio="xMidYMid meet"/></mask>`).join('')}
  </defs>
  ${layers.map(layer => `<rect class="illustration-${layer}" width="1000" height="1000" mask="url(#${key}-${layer})" fill="var(--illustration-${layer}, ${layer === 'ink' ? '#000000' : '#ffffff'})"/>`).join('')}
</svg>`;
  }
  function frame(name, options = {}) {
    return `<div class="illustration-frame${name==='no-results'?' illustration-frame-inset':''}">${render(name,options)}</div>`;
  }
  const loading = new Map();
  const initialized = new WeakSet();
  function preload(url) {
    const absolute = new URL(url, document.baseURI).href;
    if (!loading.has(absolute)) {
      const task = new Promise(resolve => {
        const image = new Image();
        image.onload = async () => {
          try { await image.decode(); } catch { /* Loaded images can still be drawn. */ }
          resolve(true);
        };
        image.onerror = () => resolve(false);
        image.src = absolute;
      });
      loading.set(absolute, task);
      task.then(ok => { if (!ok) loading.delete(absolute); });
    }
    return loading.get(absolute);
  }
  function init(container = document) {
    container.querySelectorAll('.illustration-art[data-illustration-loading]').forEach(art => {
      if (initialized.has(art)) return;
      initialized.add(art);
      const urls = [...new Set([...art.querySelectorAll('image[href]')].map(image => image.getAttribute('href')))];
      Promise.all(urls.map(preload)).then(() => {
        // Wait for the initial hidden state to paint, including cache hits.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (art.isConnected) art.removeAttribute('data-illustration-loading');
        }));
      });
    });
  }
  return Object.freeze({items, render, frame, init});
})();
