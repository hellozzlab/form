// 新增组件：在 groups 中添加条目；在 articles 中添加对应正文。
const groups = [
  {name:'Foundations 基础规范',items:[['design-color','颜色','Color','palette'],['design-typography','文字','Typography','text_fields'],['design-spacing','间距','Spacing','space_bar'],['design-borders','边框','Borders','border_all'],['design-radius','圆角','Radius','rounded_corner'],['design-elevation','阴影','Shadow','layers'],['design-blur','模糊','Blur','layers'],['design-layout','布局','Layout','grid_view'],['design-motion','动效','Motion','animation'],['design-illustrations','插画','Illustrations','edit_note'],['design-writing','内容表达','Writing','text_fields']]},
  {name:'Formatting Menu 格式菜单',items:[['typography','文字样式','Text Styles','text_fields'],['inline-formatting','行内格式','Inline Formatting','format_bold'],['lists','列表','Lists','format_list_bulleted'],['content-blocks','内容块','Content Blocks','view_agenda'],['references','引用与注释','References','format_quote'],['table','表格','Table','grid_view'],['divider','分割线','Divider','view_agenda']]},
  {name:'Controls 基础控件',items:[['button','按钮','Buttons','buttons_alt'],['tabs','标签页','Tab','tab'],['input','文本输入','Input','input'],['select','选择框','Select','arrow_drop_down'],['checkbox','复选框','Checkboxes','check_box'],['radio','单选框','Radio Buttons','radio_button_checked'],['switch','开关','Switches','toggle_on'],['design-scrollbars','滚动条','Scrollbars','unfold_more']]},
  {name:'Containers 容器',items:[['card','卡片','Cards','crop_square'],['list','列表','Lists','list_alt']]},
  {name:'Overlays 浮层',items:[['dropdown','菜单','Menus','menu_open'],['dialog','对话框','Dialogs','chat_bubble'],['drawer','抽屉','Sheets','side_navigation'],['tooltip','文字提示','Tooltips','tooltip']]},
  {name:'Feedback 反馈提示',items:[['toast','轻提示','Toast','toast'],['progress','加载','Loading','progress_activity'],['empty-state','空状态','Empty State','crop_square']]},
  {name:'Navigation 导航',items:[['breadcrumb','面包屑','Breadcrumb','chevron_right'],['sidebar','导航侧栏','Sidebar','side_navigation'],['search','搜索','Search','search']]}

];
const footerPages = [
  {id:'introduction',zh:'介绍',en:'Introduction',icon:'info',group:'About 关于'},
  {id:'changelog',zh:'更新日志',en:'Changelog',icon:'history',group:'About 关于'},
  {id:'rights',zh:'使用说明',en:'Rights',icon:'description',group:'About 关于'}
];
const all = [...groups.flatMap(g=>g.items.map(i=>({id:i[0],zh:i[1],en:i[2],icon:i[3],group:g.name}))), ...footerPages];
const arrow = icon('arrow_forward');
const copyIcon = icon('content_copy');
const escapeHtml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// 预览与复制代码使用同一份 HTML，避免内容不一致。
function example(markup) {
  if (Array.isArray(markup)) {
    const codeId = markup[0].id + '-code';
    return `<div class="example tab-demo"><div class="example-toolbar" role="tablist" aria-label="预览尺寸与代码">${markup.map(({id,label,selected}) => `<button type="button" class="tab medium${selected?' active':''}" role="tab" id="${id}-tab" aria-controls="${id}-panel" aria-selected="${!!selected}" tabindex="${selected?0:-1}">${label}</button>`).join('')}<button type="button" class="tab medium" role="tab" id="${codeId}-tab" aria-controls="${codeId}-panel" aria-selected="false" tabindex="-1">代码</button><button type="button" class="copy-code" aria-label="复制代码">${copyIcon}</button></div>${markup.map(({id,html,selected}) => `<div class="preview" role="tabpanel" id="${id}-panel" aria-labelledby="${id}-tab"${selected?'':' hidden'}>${html}</div>`).join('')}<pre class="code-panel" role="tabpanel" id="${codeId}-panel" aria-labelledby="${codeId}-tab" hidden><code>${escapeHtml(markup.map(item=>item.html).join('\n\n'))}</code></pre></div>`;
  }

  return `<div class="example">
    <div class="example-toolbar">
      <button class="tab medium active" data-tab="preview">预览</button>
      <button class="tab medium" data-tab="code">代码</button>
      <button class="copy-code" aria-label="复制代码">${copyIcon}</button>
    </div>
    <div class="preview">${markup}</div>
    <pre class="code-panel" hidden><code>${escapeHtml(markup)}</code></pre>
  </div>`;
}
function sizePreviews(id, render) {
  return [['small','小号预览'],['medium','中号预览'],['large','大号预览']].map(([size,label],index) => ({id:id+'-'+size,label,selected:index===0,html:render(size)}));
}
const plus = icon('add');
const searchSvg = icon('search');
const buttonExamples = {
  basic: '<button class="ui-button" type="button">新建项目</button>',
  variants: `<div class="button-row">
  <button class="ui-button primary" type="button">主要按钮</button>
  <button class="ui-button danger" type="button">删除项目</button>
  <button class="ui-button secondary" type="button">次要按钮</button>
  <button class="ui-button tertiary" type="button">低强调按钮</button>
  <button class="ui-button ghost" type="button">文字按钮</button>
</div>`,
  icons: `<button class="ui-button" type="button">${plus}新建</button>
<button class="ui-button secondary" type="button">下一步${arrow}</button>
<button class="ui-button secondary icon-only" type="button" aria-label="搜索">${searchSvg}</button>`,
  states: ['primary','danger','secondary','tertiary','ghost'].map(type => `<div class="button-row">
  <button class="ui-button ${type}" type="button">常规</button>
  <button class="ui-button ${type} is-hover" type="button">Hover</button>
  <button class="ui-button ${type} is-pressed" type="button">点击</button>
  <button class="ui-button ${type}" type="button" disabled>禁用</button>
  <button class="ui-button ${type}" type="button" disabled aria-busy="true"><span class="spinner" aria-hidden="true"></span>加载中</button>
</div>`).join('\n')
};
const articles = {
  button: () => `<h1>Button 按钮</h1>
<p class="lead">用于提交、确认等操作，提供五种视觉类型和三档尺寸，适应不同的操作优先级与布局空间。</p>
<section id="basic">
  <h2>Basic 基础示例</h2>
  <p>主要按钮用于当前最重要的操作，标签直接说明点击后会发生什么。</p>
  ${example(buttonExamples.basic)}
</section>
<section id="variants">
  <h2>Variants 类型</h2>
  <p>提供主要、危险、次要、低强调与文字五种类型。主要按钮突出关键操作，危险按钮用于删除等高风险操作；次要按钮用描边区分，低强调按钮用浅底承载，文字按钮适合弱化的辅助操作。</p>
  ${example(buttonExamples.variants)}
</section>
<section id="sizes">
  <h2>Sizes 尺寸</h2>
  <p>根据区域密度选择尺寸：密集工具栏用小号，紧凑操作用中号，常规操作默认大号。</p>
  ${example(sizePreviews('button-size', size => `<button class="ui-button ${size}" type="button">新建项目</button>`))}
  <ul class="usage-notes">
    <li>小号：12px 字号，上下 4px、左右 8px 内边距。</li><li>中号：12px 字号；大号：14px 字号。两者均为上下 6px、左右 12px 内边距。</li>
  </ul>
</section>
<section id="icons">
  <h2>Icons 含图标</h2>
  <p>三档图标均为 16px（<code>--icon-md</code>），图文间距为 8px（<code>--space-4</code>）；图标可放在文字前后，纯图标按钮保持方形。</p>
  ${example(buttonExamples.icons)}
</section>
<section id="states">
  <h2>States 状态</h2>
  <p>每行对应一种类型，依次展示常规、Hover、点击、禁用与加载。Hover 与点击为固定状态演示。</p>
  ${example(buttonExamples.states)}
  <ul class="usage-notes">
    <li>主要按钮随主题配色，危险按钮始终使用红色；Hover 与点击使用相同配色。</li><li>禁用与加载状态不可操作。加载时同时设置 <code>disabled</code>、<code>aria-busy="true"</code>，并添加 <code>spinner</code> 圆环；沿用禁用配色，不降低整个按钮的不透明度。</li>
    <li>按下时下移 1px，松开后复位；颜色与位移过渡均为 100ms。减少动态效果时关闭过渡、位移与加载旋转，参数见<a href="#design-motion">动效规范</a>。</li>
  </ul>
</section>


<section id="guidelines">
  <h2>Guidelines 使用要点</h2>
  <ul class="usage-notes">
    <li>同一区域只突出一个主要操作；跳转页面使用链接。</li>
    <li>纯图标按钮用 <code>aria-label</code> 提供名称，装饰图标设为 <code>aria-hidden="true"</code>。</li>
    <li>表单内非提交按钮设置 <code>type="button"</code>，避免意外提交。</li>
  </ul>
</section>
<section id="api">
  <h2>API 参数参考</h2>
  <p>基础类名为 <code>ui-button</code>；<code>variant</code>、<code>size</code>、<code>layout</code> 通过修饰类名设置，其余为原生属性。</p>
  <div class="example guide-example"><div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}
    <thead><tr><th>参数 / 属性</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead>
    <tbody>
      <tr><td><code>variant</code></td><td><code>primary</code> / <code>danger</code> / <code>secondary</code> / <code>tertiary</code> / <code>ghost</code></td><td><code>primary</code></td><td>依次为主要、危险、次要、低强调、文字；省略类名时使用 primary</td></tr>
      <tr><td><code>size</code></td><td><code>small</code> / <code>medium</code> / <code>large</code></td><td><code>large</code></td><td>通过类名选择尺寸；省略时使用默认大号</td></tr>
      <tr><td><code>layout</code></td><td><code>auto</code> / <code>icon-only</code> / <code>full-width</code></td><td><code>auto</code></td><td>通过类名设置；auto 随内容，icon-only 为纯图标，full-width 撑满容器；省略时为 auto</td></tr>
      <tr><td><code>disabled</code></td><td><code>true</code> / <code>false</code></td><td><code>false</code></td><td>禁用操作；HTML 布尔属性存在即为 true，启用时须移除属性</td></tr>
      <tr><td><code>aria-busy</code></td><td><code>true</code> / <code>false</code></td><td><code>false</code></td><td>标记处理中，不自动禁用或显示圆环</td></tr>
      <tr><td><code>aria-label</code></td><td><code>字符串</code></td><td><code>无</code></td><td>纯图标按钮必填，提供可访问名称</td></tr>
      <tr><td><code>type</code></td><td><code>button</code> / <code>submit</code> / <code>reset</code></td><td><code>submit</code></td><td>指定原生按钮行为</td></tr>
    </tbody>
  </table></div></div>
</section>`
};
// Tab 演示复用预览 / 代码的 .tab 样式，使用独立控制器隔离嵌套示例。
function tabDemo(size = '', id = 'basic') {
  return `<div class="tab-demo">
  <div class="tab-list" role="tablist" aria-label="内容视图">
    <button type="button" class="tab ${size} active" role="tab" id="${id}-tab-preview" aria-controls="${id}-panel-preview" aria-selected="true" tabindex="0">预览</button>
    <button type="button" class="tab ${size}" role="tab" id="${id}-tab-code" aria-controls="${id}-panel-code" aria-selected="false" tabindex="-1">代码</button>
  </div>
  <div role="tabpanel" id="${id}-panel-preview" aria-labelledby="${id}-tab-preview" tabindex="0"><p>查看内容的呈现效果。</p></div>
  <div role="tabpanel" id="${id}-panel-code" aria-labelledby="${id}-tab-code" tabindex="0" hidden><p>查看对应的代码内容。</p></div>
</div>`;
}
articles.tabs = () => `<h1>Tab 标签页</h1>
<p class="lead">在同一区域切换相关视图或分类内容，每次显示一个面板。</p>
<section id="basic">
  <h2>Basic 基础示例</h2>
  ${example(tabDemo())}
</section>
<section id="sizes">
  <h2>Sizes 尺寸</h2>
  <p>切换查看小号、中号与大号。密集区域用小号，默认用中号，宽松区域可用大号。</p>
  ${example(sizePreviews('tabs-size', size => tabDemo(size,'tabs-demo-'+size)))}
  <ul class="usage-notes">
    <li>小号：12px 字号，上下 4px、左右 8px 内边距。</li><li>中号：12px 字号；大号：14px 字号。两者均为上下 6px、左右 12px 内边距。</li>
  </ul>
</section>
<section id="states">
  <h2>States 状态与交互</h2>
  <p>选中标签通过背景区分，按下即切换面板；重复选择当前标签不刷新。</p>
  <ul class="usage-notes">
    <li>左右方向键切换，Home / End 跳到首尾，Enter / Space 激活；Tab 键继续进入面板。</li>
    <li>Hover 与点击使用相同背景；未选中项保持次要文字色，选中项保持主要文字色，亮暗模式下规则一致。</li><li>按下时下移 1px，颜色与位移过渡均为 100ms；减少动态效果时关闭，参数见<a href="#design-motion">动效规范</a>。</li>
  </ul>
</section>
<section id="guidelines">
  <h2>Guidelines 使用要点</h2>
  <ul class="usage-notes">
    <li>名称简短，同组保持同一分类维度；页面跳转使用链接。</li>
    <li>标签单行排列，空间不足时仅容器内横向滚动。</li>
  </ul>
</section>
<section id="api"><h2>API 参数参考</h2><p>标签使用 <code>tab</code> 类与 <code>type="button"</code>，通过 <code>tablist</code>、<code>tab</code>、<code>tabpanel</code> 角色关联标签与面板；切换时同步 <code>active</code>、选中属性、焦点顺序及面板显隐，结构见示例。</p>
<div class="example guide-example"><div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>参数 / 属性</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>${[
 ['size','small / medium / large','medium','通过类名选择尺寸；省略时使用默认中号'],
 ['aria-selected','true / false','false','当前标签为 true，同组仅一项选中'],
 ['tabindex','0 / -1','0','当前标签和面板用 0，其余标签用 -1'],
 ['aria-controls','面板 ID','无','标签必填，指向对应面板'],
 ['aria-labelledby','标签 ID','无','面板必填，指向对应标签'],
 ['hidden','true / false','false','HTML 布尔属性；非当前面板添加 hidden，显示时移除属性']
].map(([name,options,value,use])=>`<tr><td><code>${name}</code></td><td>${options.split(' / ').map(x=>`<code>${x}</code>`).join(' / ')}</td><td>${value.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${use}</td></tr>`).join('')}</tbody></table></div></div></section>`;

// 指南只列用途与 token 名称；实际数值从 tokens.css 读取。
const tokenValue = (name, theme = '') => /^(palette-|color-|button-.*(?:bg|border))/.test(name)
  ? `<span class="hex-value${theme ? ' token-theme-'+theme : ''}"><span class="hex-color"><span class="hex-swatch" style="background:var(--${name})" aria-hidden="true"></span><code data-token-value="${name}"></code></span><wbr><span class="hex-opacity" data-token-opacity hidden></span></span>`
  : `<code data-token-value="${name}"></code>`;
const tokenCode = code => `<pre class="code-panel token-code"><code>${escapeHtml(code)}</code></pre>`;
function tableColumns(names) {
  return `<colgroup>${names.map(name => `<col class="column-${name}">`).join('')}</colgroup>`;
}
function tokenTable(rows, className = '') {
  const hasExample = rows.some(row => row[2]);
  return `<div class="table-scroll"><table class="token-table${hasExample ? ' has-example' : ''}${className ? ' '+className : ''}">${tableColumns(hasExample ? ['token','value','purpose','example'] : ['token','value','purpose'])}<thead><tr><th>Token</th><th>当前值</th><th>用途</th>${hasExample ? '<th>示例</th>' : ''}</tr></thead><tbody>${rows.map(([name,use,sample])=>`<tr><td><code>--${name}</code></td><td>${tokenValue(name)}</td><td>${use}</td>${hasExample ? `<td>${sample || ''}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;
}
function guide(title,description,sections,sectionsClass = '',sectionSeparator = '') {
  const content = sections.map(([id,title,content])=>`<section id="${id}"><h2>${title}</h2>${content}</section>`).join(sectionSeparator);
  return `<h1>${title}</h1><p class="lead">${description}</p>` + (sectionsClass ? `<div class="${sectionsClass}">${content}</div>` : content);
}
articles['design-writing'] = () => guide('Writing 内容表达', '让读者轻松理解，安心使用。用清楚的结构安排信息，用自然的语言说明选择与细节。', [
  ['voice', 'Voice 语气', `<p>文档面向正在设计与构建界面的人。像一位熟悉产品的同事，给出恰当的解释，也为读者留出判断的空间。</p>
<p><strong>清楚而自然。</strong> 使用熟悉的词，把条件、行为和结果说完整。简洁以容易理解为准，不用省略关键内容换取更少的字数。</p>
<p><strong>克制而具体。</strong> 说明组件能做什么、适合哪里。用尺寸、状态和行为支撑描述，少用“优雅”“强大”等评价，也不把常规功能写成亮点。</p>
<p><strong>温和而可靠。</strong> 正常操作直接说明；遇到限制或失败，解释原因与下一步。避免责备、催促和刻意俏皮，让文字帮助人继续完成手中的事。</p>`],
  ['structure', 'Structure 章节结构', `<p>顺着读者的使用过程组织内容：先理解用途，再了解具体规则，最后查阅使用要点与接入参数。主体章节随页面内容安排，不预设统一的属性分类。</p>
<div class="example guide-example"><div class="table-scroll"><table class="token-table">${tableColumns(['token','value','purpose'])}<thead><tr><th>章节</th><th>回答的问题</th><th>内容</th></tr></thead><tbody>
<tr><td>简介</td><td>用来做什么？</td><td>一句话说明用途，必要时补充适用场景。</td></tr>
<tr><td>主体章节</td><td>需要了解哪些内容？</td><td>按实际属性、概念或使用场景分章，以示例、说明和表格呈现差异与规则。</td></tr>
<tr><td>使用要点</td><td>哪些情况需要留意？</td><td>集中说明搭配、限制与容易误用的地方，放在 API 前，不重复主体内容。</td></tr>
<tr><td>API 参数参考</td><td>如何配置与接入？</td><td>整理相关属性、Token、可选值、默认行为与必要关联，作为页面的最后一节。</td></tr>
</tbody></table></div></div>
<p>主体章节的名称来自内容本身：按钮可按类型、尺寸、图标与状态展开；Tab 关注尺寸与切换；基础规范按尺度或语义组织，格式菜单按内容形式与用法组织。</p>
<p>说明页通常以“使用要点 → API 参数参考”收尾。API 只列真实可用的配置；纯表达原则等没有配置项的页面，以使用要点收尾，不为凑齐结构编造参数。</p>`],
  ['sections', 'Sections 章节内的层次', `<p>章节通常按“标题 → 导读 → 示例或表格 → 补充说明”展开。这个顺序帮助阅读，不要求每节填满所有部分。</p>
<ul class="usage-notes"><li><strong>标题</strong>点明主题，英文在前、中文在后，沿用一致的命名。</li><li><strong>导读</strong>解释用途、选择依据或示例顺序。示例已能独立说明时，可以省略。</li><li><strong>示例与表格</strong>展示实际效果与对应关系。可操作内容用示例，多项参数需要对照时用表格。</li><li><strong>补充列表</strong>承载尚未说明的尺寸、交互规则和例外。保留影响使用的细节，不逐项解说可见外观，也不重述导读或 API。</li></ul>
<p>使用要点直接列出规则；API 用简短的结构说明配合参数表。颜色与动效链接用于查阅完整定义，当前组件的关键行为仍在本页说清。</p>`],
  ['examples', 'Examples 表达示例', `<p>把抽象评价换成具体行为，把生硬提示换成可以采取的行动。短一些，也要让人读完就明白。</p>
<div class="example guide-example"><div class="table-scroll"><table class="token-table">${tableColumns(['token','value','purpose'])}<thead><tr><th>场景</th><th>原表达</th><th>建议表达</th></tr></thead><tbody>
<tr><td>介绍用途</td><td>灵活强大的开关，带来流畅体验。</td><td>用于开启或关闭一项设置，切换后立即生效。</td></tr>
<tr><td>说明动效</td><td>动效参数详见基础规范。</td><td>滑块以 300ms 平滑切换；减少动态效果时立即完成。</td></tr>
<tr><td>说明限制</td><td>禁用不可点击。</td><td>禁用时保留当前状态，暂时不可操作。</td></tr>
<tr><td>保存失败</td><td>操作失败，请正确操作！</td><td>未能保存更改，请重试。</td></tr>
</tbody></table></div></div>`],
  ['guidelines', 'Guidelines 使用要点', `<ul class="usage-notes"><li>先写读者需要知道的结论，再补充条件与细节；一段围绕一件事展开。</li><li>同一概念始终使用同一名称。界面名称与 API 保留准确写法，正文优先使用自然中文。</li><li>检查每句话是否帮助选择、操作或接入。删去重复，不删关键事实；不为统一外观增加空泛导读。</li><li>朗读一遍，确认语气自然、指代清楚，读者无需来回寻找才能理解。</li></ul>
<p>语气与清晰度参考 <a href="https://developer.apple.com/design/human-interface-guidelines/writing">Apple Human Interface Guidelines · Writing</a> 中的 Getting started，并结合 Form 的组件文档场景整理。</p>`]
]);

articles['design-illustrations'] = () => guide('Illustrations 插画', '用粗马克笔笔触、主题色块与简化手势表达界面状态，让空白、等待和完成都有清楚而温和的回应。', [
  ['collection', 'Collection 场景插画', `<p>十二个场景统一使用风格 A：粗马克笔轮廓、宽笔叠涂色块与舒展手势，不加入铅笔或细碎排线。背景透明，文案与操作放在画面外；页面使用 4:3 展示框收起上下留白，内部原稿仍保持 1:1。</p><p>插画以透明原稿为基础，通过预生成的轻量蒙版适配亮暗模式与主题色。本页仅用于展示设计效果，不提供资源下载。</p><div class="illustration-gallery">${Illustrations.items.map(item => `<figure class="ui-card illustration-specimen">${Illustrations.frame(item.id, {size: 160, decorative:true})}<div class="illustration-divider" aria-hidden="true"></div><figcaption><strong>${item.en} ${item.zh}</strong><p>${item.description}</p><span class="illustration-use">${item.use}</span></figcaption></figure>`).join('')}</div>`],
  ['theme', 'Theme 主题适配', `<p>Form 主题使用黑色线条与浅灰色块；选择其他配色主题时，色块跟随主题。暗色模式使用白色线条与深色纸面，保持结构清楚。</p><div class="example guide-example"><div class="illustration-theme-row"><div class="illustration-theme-panel token-theme-light">${Illustrations.frame('payment-success',{decorative:true})}<span>Light 亮色</span></div><div class="illustration-theme-panel token-theme-dark">${Illustrations.frame('payment-success',{decorative:true})}<span>Dark 暗色</span></div></div></div><p>透明 PNG 保留黑橙绘制原稿；网页使用预生成的三层蒙版分别处理线条、主题色与纸面，减少加载与实时滤镜运算。独立 SVG 使用默认灰阶，并适应系统亮暗偏好。</p>`],
  ['guidelines', 'Guidelines 使用要点', `<ul class="usage-notes"><li>先说清当前状态，再选择插画。支付失败与处理中分别使用对应画面，不提前暗示尚未确认的结果。</li><li>插画与文字共同表达含义，必要说明与操作仍放在画面外。附近已有完整说明时，将插画作为装饰隐藏于辅助技术；独立使用时提供简短名称。</li><li>一次状态只使用一幅主插画，不与多个大图标争夺注意力。避免压扁、裁掉手部，或为失败状态添加责备性的语气。</li><li>页面适配使用 SVG 蒙版；PNG 原稿不直接跟随网站主题。SVG 文件保留原稿像素内容，不是可逐条编辑的矢量路径。</li></ul>`],
  ['api', 'API 参数参考', `<p>保留 <code>assets/illustrations/masks/</code> 与渲染脚本。引入 <code>assets/illustrations/illustrations.js</code>，通过 <code>Illustrations.render(name, options)</code> 获取插画标记，并使用项目共用样式与 Token。与库中其他文案一样，插画说明也保持在 HTML 中。</p>${tokenCode(`Illustrations.frame('empty', { size: 160, decorative: true });
// render() 直接输出 1:1 插画，frame() 增加 4:3 展示框。
Illustrations.render('payment-success', { label: '支付已完成' });
// 插入页面后等待资源就绪，再淡入显示。
Illustrations.init(document.querySelector('#content'));`)}${controlApi([
    ['name', '十二个场景 ID', '必填', '资源文件名即 ID，例如 empty、offline、payment-success'],
    ['size', '160', '160', '统一宽度为 160px，容器较窄时等比收缩'],
    ['decorative', 'true / false', 'false', '有相邻完整说明时设置 true，避免重复播报'],
    ['label', '字符串', '场景中文名称', '非装饰插画的可访问名称，描述用途即可'],
    ['--illustration-ink / --illustration-fill / --illustration-paper', 'CSS 颜色', '随主题', '分别覆盖线条、主题色与纸面；默认引用插画语义颜色']
  ])}`]
]);

const categoryDescriptions = {
  'Foundations 基础规范':'视觉、交互与内容表达的统一规则。',
  'Formatting Menu 格式菜单':'标题、段落、列表、代码与文档编辑规范。',
  'Controls 基础控件':'按钮、文本输入、选择控件与滚动条。',
  'Containers 容器':'组织相关内容的卡片与列表。',
  'Overlays 浮层':'菜单、对话框与承载临时内容的抽屉。',
  'Feedback 反馈提示':'空状态、轻提示与进度反馈。',
  'Navigation 导航':'标签页、导航侧栏与搜索。'
};
function categoryCards() {
  const entries = groups.map(group=>({title:group.name,route:group.items[0][0],description:categoryDescriptions[group.name],icon:group.items[0][3]}));
  entries.push({title:'Changelog 更新日志',route:'changelog',description:'查看规范与组件的最新调整。',icon:'history'});
  return `<div class="category-grid">${entries.map(entry=>`<a class="ui-card ui-card-link category-card" href="#${entry.route}">${icon(entry.icon)}<span class="card-copy category-card-content"><strong class="category-card-title">${entry.title}</strong><span class="category-card-description">${entry.description}</span></span>${icon('chevron_right', 'card-arrow')}</a>`).join('')}</div>`;
}
function introductionBanner() {
  return `<div class="introduction-banner" aria-hidden="true">${['empty','all-done','collaboration'].map(name => Illustrations.render(name,{size: 160,decorative:true,banner:true})).join('')}</div>`;
}
function documentFooter() {
  return `<footer class="document-footer"><span class="footer-credit"><span class="brand-mark footer-brand-mark" aria-hidden="true">f</span><span>form by <a href="https://github.com/hellozzlab/form" target="_blank" rel="noopener noreferrer" aria-label="zz 的 GitHub 项目（在新标签页打开）">zz</a></span></span><span class="footer-copyright">2026 · <a href="#rights">Rights</a></span></footer>`;
}
articles.introduction = () => guide('Introduction 介绍','Form 是一个本地使用的轻量化网页组件库，承载我们对界面美学的理解。以克制的细节、微妙的动效和一致的交互，为日常构建提供可复用的基础。',[
  ['about-form','About 关于 Form',`<p>一直以来，我都很喜欢 Apple、Claude、OpenAI 和 Linear 的设计，尤其是它们介绍产品、讲述故事的方式。那些文字、画面和细节，似乎都经过精心雕琢，既不简陋粗糙，也不喧宾夺主。读起来，像有一位有见识的朋友在身边娓娓道来，让人感到舒服、亲切，带着浓厚的人文气息。我想，这正是品味的体现。</p><p>此前，我在工作当中收获了诸多构建 Html 组件库的宝贵经验，受到上述我所提及的个人感受的影响，Form 由此诞生。为了尽可能贴近我心中想要的气质，我还借助 AI 构建了插画与写作部分，让这种感受贯穿 Form 的整个文档。Form 的顶栏还支持主题色、圆角和亮暗模式的配置，你可以试着调整，感受这些细节带来的不同。</p>`],
  ['getting-started','Getting Started 开始使用','<p>从基础规范了解颜色、文字与间距，再按需要浏览组件。也可以使用顶部搜索或 ⌘K / Ctrl+K 查找内容。</p>'+categoryCards()+'<p>示例提供预览与代码，可以直接体验交互，或查看具体实现。</p>']
]).replace('<section id="about-form">', introductionBanner() + '<section id="about-form">');
articles.rights = () => guide('Rights 使用说明', '关于 Form 的内容来源与使用范围。', [
  ['about','About 关于本站','<p>Form 是由 zz 整理、设计与开发的个人实践项目，用来呈现对界面、交互与内容表达的探索。欢迎浏览、分享页面链接，也欢迎交流想法。</p><p>本站目前未以统一的开源许可证发布。公开展示与源码可访问，不表示其中所有内容都采用相同的使用许可。</p><p>第三方资源可以按照其各自许可使用。对于 Form 中未另行授权的代码、文档与视觉内容，如需复制到其他项目、修改后分发或用于产品，请先联系作者确认使用范围。</p>'],
  ['references','References 设计参考','<p>在构建 Form 之初，我查阅了 <a class="text-link" href="https://platform.claude.com/docs/en/home" target="_blank" rel="noopener noreferrer">Claude</a>、<a class="text-link" href="https://developers.openai.com/api/docs" target="_blank" rel="noopener noreferrer">OpenAI</a> 与 <a class="text-link" href="https://linear.app/docs" target="_blank" rel="noopener noreferrer">Linear</a> 的文档，了解它们在页面布局和章节组织上的处理方式，也调研了 <a class="text-link" href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">Ant Design</a>、<a class="text-link" href="https://tdesign.tencent.com/vue-next/overview" target="_blank" rel="noopener noreferrer">TDesign</a>、<a class="text-link" href="https://arco.design/react/docs/start" target="_blank" rel="noopener noreferrer">Arco Design</a>、<a class="text-link" href="https://www.fluidfunctionalism.com/" target="_blank" rel="noopener noreferrer">Fluid Functionalism</a> 等作品，留意它们在组件呈现、属性与状态划分上的差异。</p><p>结合这些观察与个人实践，Form 通过原生 HTML、CSS 和 JavaScript 的实现，逐步形成了现在的组件、视觉与内容表达。</p>'],
  ['resources','Resources 资源来源',`<p>Form 使用了以下资源。它们保留各自的权利与许可，本页说明不替代或限制这些资源原有的授权。</p><div class="example guide-example"><div class="table-scroll"><table class="token-table">${tableColumns(['token','value','purpose'])}<thead><tr><th>资源</th><th>用途</th><th>许可与说明</th></tr></thead><tbody><tr><td><a class="text-link" href="https://github.com/rsms/inter" target="_blank" rel="noopener noreferrer">Inter</a></td><td>界面字体</td><td><a class="text-link" href="assets/fonts/LICENSE.txt" target="_blank" rel="noopener noreferrer">SIL Open Font License 1.1</a></td></tr><tr><td><a class="text-link" href="https://github.com/google/material-design-icons" target="_blank" rel="noopener noreferrer">Google Material Symbols</a></td><td>界面图标</td><td><a class="text-link" href="assets/icons/LICENSE" target="_blank" rel="noopener noreferrer">Apache License 2.0</a></td></tr><tr><td><a class="text-link" href="https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css" target="_blank" rel="noopener noreferrer">Tailwind CSS</a></td><td>除 Form 灰阶外的基础色板</td><td><a class="text-link" href="assets/licenses/tailwindcss-LICENSE.txt" target="_blank" rel="noopener noreferrer">MIT License</a>；本站未引入 Tailwind 运行依赖。</td></tr><tr><td><a class="text-link" href="https://github.com/logos" target="_blank" rel="noopener noreferrer">GitHub</a></td><td>指向项目仓库的品牌标识</td><td><a class="text-link" href="https://docs.github.com/en/site-policy/other-site-policies/github-logo-policy" target="_blank" rel="noopener noreferrer">GitHub 标识使用规范</a></td></tr></tbody></table></div></div>`],
  ['illustrations','Illustrations 插画','<p>站内插画由作者策划，借助 AI 辅助生成并反复调整，用于 Form 的界面展示。目前不提供独立的插画资源授权；如希望在其他项目中使用，请先联系作者说明需求。</p>'],
  ['contact','Contact 交流',`<p>如果想交流设计、反馈问题，或聊聊一个想法，欢迎通过 <a class="text-link" href="https://github.com/hellozzlab/form" target="_blank" rel="noopener noreferrer">GitHub</a> 找到我。</p>`]
]);
articles.changelog = () => guide('Changelog 更新日志','记录主要新增与调整。',[
  ['release-2026-10-29','v1.0 2026-10-29',`<div class="changelog-groups">
<div class="changelog-group"><h3>Form 首次发布</h3>
<ul class="usage-notes"><li>完成基础规范、格式菜单与组件文档，提供交互示例和代码参考。</li><li>加入十二组场景插画，补充内容表达与使用说明。</li></ul></div>
<div class="changelog-group"><h3>Experience 使用体验</h3>
<ul class="usage-notes"><li>支持主题配色、亮暗模式与圆角配置，适配不同窗口尺寸。</li></ul></div>
</div>`]
], 'changelog-releases', '<hr class="changelog-divider">');
const colorRoles = [
  ['background','Background 背景','三种常规背景按区域用途区分，不代表固定的深浅顺序。反色背景与反色文字成对使用；亮色背景依次为白、浅灰、近白，暗色背景依次为深灰、次深灰、面板灰，按参考图的用途映射；模态遮罩保持黑色 70%。',[
    ['bg-primary','页面主体、卡片与弹窗底色'],['bg-sidebar','侧栏实色背景'],['bg-surface','菜单、选择框下拉、对话框与抽屉等浮层表面的共用背景'],['illustration-fill','插画强调色，Form 灰阶或当前主题色'],['illustration-paper','插画纸面，随亮暗模式使用页面底色'],['intro-banner-bg','介绍页横幅背景，Form 灰阶或当前主题色'],['intro-banner-fill','横幅内插画强调色，亮色白、暗色黑'],['bg-control-thumb','开关圆点，亮暗模式均为纯白'],['bg-secondary','次级内容区域'],['bg-tertiary','代码块与分组面板'],['bg-inverted','提示条等反色区域'],['bg-overlay','模态弹窗与侧栏抽屉后方的黑色遮罩'],['bg-hover','中性导航与轻量控件悬停'],['bg-hover-strong','低强调控件更明显的悬停反馈'],['bg-pressed','低强调控件按下反馈'],['state-pressed','按钮按下时压暗背景的状态层颜色'],['bg-selected','中性导航与控件持续选中']]],
  ['text','Text / Icon 文字与图标','三档常规文字色表达信息的重要程度，图标沿用同一层级；常规禁用与加载前景使用实色中性灰，删除按钮保留常规前景。辅助信息也应清晰可读；反色文字仅搭配反色背景。',[
    ['text-primary','标题、正文与主要图标'],['text-secondary','描述、说明与次要图标'],['text-tertiary','时间、来源等辅助信息'],['text-disabled','常规禁用与加载文字、图标，亮色 Form 500、暗色 Form 500；删除按钮除外'],['illustration-ink','插画线条，亮色纯黑、暗色纯白'],['text-inverted','反色背景及实心操作上的文字与图标']]],
  ['border','Border 描边','两档描边按强调程度选择：primary 较强，用于控件轮廓；secondary 较轻，用于容器与分隔线。反馈区域的描边与组件焦点样式由对应组件定义。',[
    ['border-primary','输入框等需要清楚辨认的轮廓'],['border-secondary','容器边界、表格与普通分隔线'],['border-control','次要按钮等低强调控件轮廓'],['border-swatch','HEX 色块的轻描边']]],
  ['effects','Shadow 阴影','默认与弹窗阴影均使用黑色加透明度，尺寸在阴影样式变量中维护。',[['shadow-default','菜单等普通浮层投影'],['shadow-dialog','弹窗投影']]],
  ['form-action','Form Action 形态操作','黑白主要操作具有独立背景与前景，前景包含常规及禁用、加载两档。亮色常规 / 交互 / 禁用为 Form 950 / 800 / 100，暗色为 50 / 200 / 800，切换品牌不改变这些基础规则。',
    [['form-action','中性常规'],['form-action-hover','中性 Hover'],['form-action-pressed','中性点击'],['form-action-disabled','中性禁用与加载'],['form-action-text','中性操作背景上的文字与图标'],['form-action-disabled-text','中性禁用背景上的文字与图标']]],
  ['brand','Brand Action 品牌操作','Brand Action 随当前主题更新：默认 Neutral 引用中性操作的背景与前景；选择任一基础色板后，常规引用该色板 500，Hover 与点击为 600，禁用与加载亮色 200、暗色 900，前景通过 <code>--color-text-on-brand</code> 引用与红色按钮一致的 <code>--color-text-inverted</code>（亮色 Form 50、暗色 Form 950），禁用与加载保留常规前景。切换主题不改写原始色板或状态色。',
    [['brand','品牌常规'],['brand-hover','品牌 Hover'],['brand-pressed','品牌点击'],['brand-disabled','品牌禁用与加载'],['text-on-brand','品牌操作前景']]],
  ['theme','Theme 主题映射','主题与亮暗模式独立：顶栏色板图标打开主题菜单，选项覆盖基础色板全部 27 组，Neutral 对应 Form，其余 26 组直接作为主题，并标记当前项，亮暗图标只控制明暗。默认中性主题；选中其他色板会更新 Brand Action，再通过 action-primary 应用于主要按钮、链接与焦点。次要、低强调与文字按钮继续引用中性色，危险操作保持红色。选择保存在本地。',
    [['action-primary','当前主题主要操作'],['action-primary-hover','当前主题 Hover'],['action-primary-pressed','当前主题点击'],['action-primary-disabled','当前主题禁用与加载'],['action-primary-text','当前主题主要前景'],['action-primary-disabled-text','当前主题禁用与加载前景']]],
  ['semantic','Status 反馈状态','信息、成功、警告与危险语义独立于品牌主题，统一采用彩色规则：亮暗常规 500、Hover 与点击 600、禁用与加载亮色 200 / 暗色 900，分别引用蓝、翡翠绿、琥珀、红色板。',
    [['info','信息'],['success','成功'],['warning','警告'],['danger','错误与危险']].flatMap(([name,label])=>[['','默认'],['-hover','悬停'],['-pressed','按下'],['-disabled','禁用']].map(([state,use])=>[name+state,label+use]))]

];
function colorTable(rows, prefix = 'color-') {
  const cells = (name,mode) => `<td><span class="token-theme-${mode} color-reference" data-token-source="${prefix}${name}" data-token-theme="${mode}"></span></td><td>${tokenValue(prefix+name,mode)}</td>`;
  return `<div class="table-scroll"><table class="color-table">${tableColumns(['token','source','hex','source','hex','purpose'])}<thead><tr><th>Token</th><th>亮色色板 Token</th><th>亮色 HEX</th><th>暗色色板 Token</th><th>暗色 HEX</th><th>用途</th></tr></thead><tbody>${rows.map(([name,use])=>`<tr><td><code>--${prefix}${name}</code></td>${cells(name,'light')}${cells(name,'dark')}<td>${use}</td></tr>`).join('')}</tbody></table></div>`;
}
const paletteGroups = [['form', '界面灰'], ['red', '红'], ['orange', '橙'], ['amber', '琥珀'], ['yellow', '黄'], ['lime', '黄绿'], ['green', '绿'], ['emerald', '翡翠绿'], ['teal', '蓝绿'], ['cyan', '青'], ['sky', '天蓝'], ['blue', '蓝'], ['indigo', '靛蓝'], ['violet', '紫罗兰'], ['purple', '紫'], ['fuchsia', '品红'], ['pink', '粉'], ['rose', '玫红'], ['slate', '蓝灰'], ['gray', '灰'], ['zinc', '锌灰'], ['neutral', '中性灰'], ['stone', '暖灰'], ['taupe', '褐灰'], ['mauve', '藕灰'], ['mist', '雾灰'], ['olive', '橄榄灰']];
const paletteSteps = [50,100,200,300,400,500,600,700,800,900,950];
function paletteTabs() {
  return `<div class="palette-tabs" role="tablist" aria-label="基础色板">${paletteGroups.map(([name,label],i)=>`<button type="button" class="palette-tab" role="tab" id="palette-tab-${name}" aria-controls="palette-panel-${name}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-palette="${name}" title="${name}"><span class="palette-dot" aria-hidden="true" style="background:var(--palette-${name}-500)"></span>${name==='form'?'Form':name[0].toUpperCase()+name.slice(1)} ${label}</button>`).join('')}</div>` + paletteGroups.map(([name,label],i)=>`<div role="tabpanel" id="palette-panel-${name}" aria-labelledby="palette-tab-${name}" tabindex="0" ${i===0?'':'hidden'}>${tokenTable(paletteSteps.map(step=>['palette-'+name+'-'+step,step===500?'基准色':step<500?'浅色阶':'深色阶']),'palette-table')}</div>`).join('');
}
function selectPalette(tab) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  const section = tab.closest('#palette');
  section.querySelectorAll('[role="tab"]').forEach(item=>{
    const active = item===tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex = active?0:-1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  const list = tab.parentElement;
  const bounds = tab.getBoundingClientRect();
  const viewport = list.getBoundingClientRect();
  if(bounds.left < viewport.left) list.scrollLeft += bounds.left - viewport.left;
  else if(bounds.right > viewport.right) list.scrollLeft += bounds.right - viewport.right;
  // 各面板在页面渲染与主题切换时已更新，选择色板无需刷新整页 Token。
}
document.addEventListener('click',event=>{
  const tab = event.target.closest('[data-palette]');
  if(tab) selectPalette(tab);
});
document.addEventListener('keydown',event=>{
  const tab = event.target.closest('[data-palette]');
  if(!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const index = tabs.indexOf(tab);
  const next = event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  selectPalette(tabs[next]);
  tabs[next].focus();
});
articles['design-color'] = () => designGuide('Color 颜色','基础色板提供色阶，界面中性色与五个标准色定义用途；品牌与状态提供统一交互色阶，具体组件负责场景配色与状态绑定。',[
  ['palette','Palette 基础色板','首组 Form 界面灰按所提供的界面用色整理，其余 26 个色系保留 Tailwind v4 色板。界面中性色语义统一引用 Form。每组均为 50–950 共 11 档，500 为基准色；品牌与反馈从色板库中选取。',paletteTabs()],
  ...colorRoles.map(([id,title,description,rows])=>[id,title,description,colorTable(rows)]),
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>品牌与状态定义默认、hover、pressed、disabled 四态，组件按用途绑定对应 token；静态反馈不需要套用交互状态。</li><li>组件配色集中维护在 tokens.css 的组件分组，默认色和交互状态优先引用品牌与状态 token，页面与组件样式统一引用本页语义色，组件 token 只作为语义色的映射，不直接引用色板或写入色值。</li><li>500 是标准色，不强制作为文字色；组件的背景、文字、描边应结合实际场景与对比度选择。</li><li>界面辅助层次采用单一色板色加透明度；模态遮罩为黑色 70%。反馈同时提供文字或图标，链接保留下划线，焦点保留可见轮廓。</li></ul>']
]);
// 设计指南共用标题、可选说明与示例容器；使用要点直接展示。
function designGuide(title, description, sections) {
  return `<h1>${title}</h1><p class="lead">${description}</p>` + sections.map(([id, title, description, content, standalone = false]) => `<section id="${id}"><h2>${title}</h2>${description ? `<p>${description}</p>` : ''}${id === 'rules' || standalone ? content : `<div class="example guide-example">${content}</div>`}</section>`).join('');
}
const typographyRoles = [
  ['page-title','页面标题','2xl','line-tight'],
  ['section-title','章节标题','lg','line-heading'],
  ['subsection-title','子章节标题','md','line-body'],
  ['label','表头与局部标题','sm','line-body'],
  ['body','正文','sm','line-body'],
  ['caption','辅助说明','xs','line-body']
];
function textStylesTable() {
  const property = token => `<code>--${token}</code><br>${tokenValue(token)}`;
  return `<div class="table-scroll"><table class="text-style-table">${tableColumns(['style-name','style-size','style-weight','style-line','style-purpose','style-example'])}<thead><tr><th>Token</th><th>字号</th><th>字重</th><th>行高</th><th>用途</th><th>示例</th></tr></thead><tbody>${typographyRoles.map(([name,use,size,line])=>{
    const weight = !['body','caption'].includes(name) ? 'weight-semibold' : 'weight-regular';
    return `<tr><td><code>text-${name}</code></td><td>${property('font-size-'+size)}</td><td>${property(weight)}</td><td>${property(line)}<br><code data-style-line-height></code></td><td>${use}</td><td><span class="font-size-example" style="font-size:var(--font-size-${size});font-weight:var(--${weight});line-height:var(--${line});line-height:round(nearest, 1em * var(--${line}), 1px)">文字 Aa</span></td></tr>`;
  }).join('')}</tbody></table></div>`;
}
articles['design-typography'] = () => designGuide('Typography 文字','字体统一设置，文字样式组合字号、字重与行高。按内容用途选择样式，各项属性通过基础 token 维护。',[
  ['font','Font Family 字体','提供常规与等宽两套字体：正文和界面使用 Inter，中文由系统字体补足；代码使用等宽字体，便于辨认与对照。',tokenTable([['font-sans','Inter 可变字体（本地加载）；中文使用系统字体'],['font-mono','代码与 token 名称']])],
  ['text-styles','Text Styles 文字样式','提供页面标题、章节标题、子章节标题、标签、正文和辅助说明六种用途样式。每种样式列出字号、字重、行高引用的 token 与当前值，字体继承统一设置；HTML 标题层级仍按文档结构选择。',textStylesTable()],
  ['scale','Font Size 字号','六档基础字号只定义大小，不包含字重或行高。以默认正文 14px 为基准，通过 rem 按固定倍率缩放；调整 font-size-base 即可同步改变整套字号，布局间距保持不变。倍率保留精确比例，实际渲染不取整，文档中的像素值最多显示两位小数。',tokenTable([['font-size-base','根字号基准，默认 14px','<span class="font-size-example" style="font-size:var(--font-size-base);font-weight:var(--weight-regular);line-height:var(--line-body); line-height: round(nearest, 1em * var(--line-body), 1px)">文字 Aa</span>'],...[
    ['2xl','32 / 14'],['xl','24 / 14'],['lg','20 / 14'],['md','16 / 14'],['sm','1'],['xs','12 / 14']
  ].map(([size,ratio])=>['font-size-'+size,`基准字号 × ${ratio}`,`<span class="font-size-example" style="font-size:var(--font-size-${size});font-weight:var(--weight-regular);line-height:var(--line-body); line-height: round(nearest, 1em * var(--line-body), 1px)">文字 Aa</span>`])],'font-size-table')],
  ['weight','Font Weight 字重','提供 regular 400、medium 500 与 semibold 600 三档字重。正文使用 400，快捷入口卡片标题使用 500，标题、表头与重点强调使用 600；侧导航普通与选中项均保持 400。',tokenTable([['weight-regular','body、caption 与侧导航'],['weight-medium','快捷入口卡片标题'],['weight-semibold','标题、label、strong / b 与重点强调']])],
  ['line-height','Line Height 行高','按字号与阅读用途分配三档行高倍率：大标题紧凑，小标题适当放松，正文保留连续阅读的空间。行高先按自身字号乘以倍率计算，再四舍五入到整数像素；字号改变后自动重新计算。不支持 CSS round() 的浏览器保留原倍率；这是一套默认排版方案，实际呈现需结合中文回退字体与换行内容检查。',tokenTable([['line-tight','page-title：32px × 1.2 → 38px'],['line-heading','section-title：20px × 1.3 → 26px'],['line-body','subsection-title / label / body / caption：16 / 14 / 12px × 1.6 → 26 / 22 / 19px']])],
  ['application','Usage 使用方式','字号比例由 tokens.css 统一维护。修改 font-size-base（例如 18px）即可调整整套字号，无需逐项修改；只改变 body 元素的字号不会改变 rem 的基准。',tokenCode(`/* tokens.css：整套字号的唯一基准 */
:root {
  --font-size-base: 14px;
}

/* 根元素建立 rem 基准 */
html { font-size: var(--font-size-base); }

.article-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--line-tight);
  line-height: round(nearest, 1em * var(--line-tight), 1px);
}

.description {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--weight-regular);
  line-height: var(--line-body);
  line-height: round(nearest, 1em * var(--line-body), 1px);
  color: var(--color-text-secondary);
}`)],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>按章节关系选择 HTML 标题层级，视觉字号单独引用对应 token；不要为了改变字号跳过标题层级。</li><li>H4 与 body-large、H5 与 body、H6 与 caption 分别共用字号和行高，标题使用 600，普通文字使用 400。</li><li>无序列表与有序列表继承所在正文的字号和行高，不另设字号档位。</li><li>行高控制同一段文字的行间距离；标题与正文、段落之间的距离使用间距 token。</li><li>字体大小调整后检查两行标题、长段落、中英文混排和列表，以及固定高度控件中的换行与容纳情况。</li></ul>']
]);
articles['design-radius'] = () => designGuide('Radius 圆角','以 radius-base 为统一基准，按固定倍率派生四档常规圆角，另保留直角与全圆角。主题通过基准值调整各档圆角，并由 radius-max 限制常规圆角的最大值。',[
  ['scale','Radius Scale 圆角尺度','基准默认 4px，xs / sm / md / lg 分别为基准的 1 / 1.5 / 2 / 3 倍，默认得到 4 / 6 / 8 / 12px。四档均取计算值与 radius-max（默认 24px）中的较小值；none 与 full 不受上限影响。当前值与示例随设置变化。',tokenTable([['radius-base','统一圆角基准，默认 4px'],['radius-max','常规圆角上限，默认 24px；不随基准缩放'],['radius-none','表格与连续内容的直角边界'],['radius-xs','基准 × 1；行内代码与侧导航项'],['radius-sm','基准 × 1.5；所有尺寸按钮、预览 / 代码与基础色板 Tab'],['radius-md','基准 × 2；示例容器与快捷入口卡片'],['radius-lg','基准 × 3；搜索对话框'],['radius-full','圆形图标按钮、状态点与滚动条滑块']].map(([name,use])=>[name,use,`<span class="radius-shape" style="border-radius:var(--${name})" aria-hidden="true"></span>`]))],
  ['themes','Radius Themes 圆角主题','顶栏配色按钮后可选择 Small 小圆角（基准 2px）、Default 默认（4px）、Soft 柔和（6px）与 Pill 胶囊（24px），选择保存在本地，独立于配色和亮暗模式；常规派生圆角继续受 24px 上限约束。菜单外框按内部选项实际圆角加容器留白与边框计算，不将全圆角和滚动条等独立圆形改成方形。',tokenTable([['radius-preset-small','Small 小圆角基准'],['radius-preset-default','Default 默认基准'],['radius-preset-soft','Soft 柔和基准'],['radius-preset-pill','Pill 胶囊基准'],['radius-menu','菜单外框：选项有效圆角 + menu-padding + border-width，受 radius-max 限制']])],
  ['shape','Full Radius 全圆角','radius-full 的 9999px 是实现充分圆角的上限值，实际轮廓受元素宽高限制。等宽等高形成圆形，宽度大于高度形成胶囊。',`<div class="preview radius-preview"><div class="radius-sample"><span class="radius-shape radius-circle" aria-hidden="true"></span><span>圆形 · 等宽等高</span></div><div class="radius-sample"><span class="radius-shape radius-pill" aria-hidden="true"></span><span>胶囊 · 宽度大于高度</span></div></div>`],
  ['application','Usage 使用方式','在 tokens.css 的 :root 或主题作用域中覆盖 radius-base。例如基准为 6px 时，四档为 6 / 9 / 12 / 18px；基准为 12px、上限为 24px 时，四档为 12 / 18 / 24 / 24px。四档使用 xs / sm / md / lg 尺寸名称，不绑定固定像素值。',tokenCode(`/* 主题设置：基准控制比例，上限限制最大值 */
:root {
  --radius-base: 6px;
  --radius-max: 24px;
}

/* 容器：min(基准 × 2, 上限) */
.card { border-radius: var(--radius-md); }

/* 按钮与 Tab：min(基准 × 1.5, 上限) */
.button,
.tab { border-radius: var(--radius-sm); }

/* 圆形：宽高相等；胶囊：宽度由内容撑开 */
.circle {
  width: var(--space-16);
  height: var(--space-16);
  border-radius: var(--radius-full);
}

.pill {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
}`)],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>通过 radius-base 定义主题圆角；亮暗模式仅覆盖颜色，悬停与选中状态沿用组件圆角。圆角不随字号缩放。</li><li>radius-max 独立于基准，统一限制四档常规圆角；达到上限后，相邻档位可能得到相同值。圆形与胶囊仍使用 radius-full。</li><li>嵌套元素结合内边距选择已有尺度；内层圆角通常不大于外层，不为等距关系新增零散值。</li><li>圆角只改变边界形状。需要裁切内部图片或背景时，在容器上设置 overflow: hidden，并检查焦点轮廓和浮层是否被裁切。</li><li>圆形元素保持等宽等高；胶囊保留足够的水平内边距，确保文字与两端弧线之间有空间。</li></ul>']
]);
articles['design-spacing'] = () => designGuide('Spacing 间距','间距采用 2px 基准，提供 0–128px 共十三档。Token 数字乘以 2 即为像素值，按内容关系与可用空间选择。',[
  ['scale','Spacing Scale 间距尺度','从大到小列出完整尺度。较大间距用于区域与页面留白，较小间距用于控件、文字和图标之间的细节。示例中两条竖线之间的淡色区域表示实际间距，0px 时竖线紧贴。',tokenTable([[64,'大区域分隔与宽松页面留白'],[32,'较大区域留白'],[24,'区域之间的留白'],[20,'较宽松的内容分组'],[16,'容器与内容分组'],[12,'面板内边距、容器内边距'],[8,'表格单元格左右留白'],[6,'主标题与说明间距、相邻控件间距'],[4,'二级标题与说明、图标与文字间距'],[3,'侧栏导航项上下内边距'],[2,'色块与文字、列表条目间距'],[1,'行内代码上下留白'],[0,'无需间距']].map(([n,use])=>['space-'+n,use,`<span class="space-track" style="--sample-space:var(--space-${n})" role="img" aria-label="两条竖线之间的间距为 ${n*2}px"><span class="space-endpoint"></span><span class="space-endpoint"></span></span>`]), 'spacing-table')],
  ['application','Usage 使用方式','Token 编号是像素值的一半：space-12 为 24px，space-32 为 64px，space-64 为 128px。页面与内容间距分别按用途选择。',tokenCode(`.document-layout {
  padding-block: var(--space-64); /* 上下留白 128px */
  padding-inline: var(--space-24); /* 左右留白 48px */
  column-gap: var(--space-32); /* 正文与目录间距 64px */
}

#content {
  display: flex;
  flex-direction: column;
  gap: var(--space-32); /* 章节间距 64px */
}

#content section {
  display: flex;
  flex-direction: column;
  gap: var(--space-8); /* 章节内内容间距 16px */
  margin: 0;
}

.card {
  padding: var(--space-12); /* 内边距 24px */
}

.actions {
  display: flex;
  gap: var(--space-6); /* 操作间距 12px */
}`)],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>直接引用合适的间距 token，不用空格、空段落或重复换行制造留白。</li><li>内容越相关，间距越小；同类组件和区域复用相同间距。间距不随主题改变。</li><li>章节与正文、目录间距统一使用 space-32（64px）；正文上下留白使用 space-64（128px），移动端保持一致。</li></ul>']
]);
articles['design-layout'] = () => designGuide('Layout 布局','布局规范定义页面区域的尺寸与位置。元素之间的留白参考间距规范，控件尺寸由对应组件说明。',[
  ['dimensions','Dimensions 布局尺寸','侧栏、顶栏与目录使用固定尺寸，正文在最大宽度内按可用空间收缩。',tokenTable([['layout-sidebar','侧栏宽度，窄屏以抽屉展示'],['layout-header','固定主顶栏与侧栏顶栏高度'],['layout-content','显示目录时的正文最大宽度'],['layout-toc','页内目录宽度'],['layout-column-gap','正文与页内目录间距'],['layout-max','正文、目录与两侧内边距的总宽度上限']])],
  ['responsive','Responsive 响应式适配','侧栏按视口宽度切换，页内目录按内容区域宽度切换。两者独立判断：隐藏目录不会自动隐藏侧栏，也不会改变正文左右留白。',`<div class="table-scroll"><table class="token-table">${tableColumns(['token','value','purpose'])}<thead><tr><th>判断依据</th><th>条件</th><th>适配行为</th></tr></thead><tbody>
<tr><td>视口宽度</td><td>&gt; 768px</td><td>侧栏固定为 280px，主顶栏与正文位于侧栏右侧。正文左右内边距为 48px，顶栏左右内边距为 24px；隐藏菜单按钮。</td></tr>
<tr><td>视口宽度</td><td>≤ 768px</td><td>侧栏收为抽屉，主顶栏与正文占满视口；正文左右内边距降为 24px。菜单按钮显示在搜索按钮后，打开抽屉后点击遮罩可关闭。</td></tr>
<tr><td>内容区域宽度</td><td>≥ 1040px</td><td>显示 240px 页内目录。正文最大宽度为 640px，两者间距为 64px，两侧各留白 48px；完整布局居中。</td></tr>
<tr><td>内容区域宽度</td><td>&lt; 1040px</td><td>隐藏目录及其占位，正文撑满剩余可用宽度。左右留白仍按视口规则：大于 768px 时为 48px，768px 及以下为 24px。</td></tr>
</tbody></table></div>`],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>视口指整个浏览器页面的可用宽度；内容区域指正文滚动容器的可用宽度，桌面需扣除 280px 侧栏，抽屉模式下不再扣除；滚动条留白不计入正文宽度。断点依据实际可用宽度判断，不直接按设备名称分类。</li><li>1040px 来自正文 640px、目录 240px、列间距 64px 与左右各 48px 留白之和；恰好达到该宽度时仍显示目录。</li><li>正文上下留白均为 128px，章节间距为 64px，各尺寸保持一致。主顶栏高度固定为 64px，正文在顶栏下独立滚动，滚动条从 Header 下方开始。</li><li>导航侧栏与主顶栏左右内边距始终为 24px；抽屉打开时侧栏仍为 280px，不压缩正文。</li><li>正文滚动区域预留滚动条空间，避免切换长短页面时左右移动。表格与色板 Tab 只在各自容器内横向滚动，不带动整页移动。</li></ul>']
]);
function updateColorReferences() {
  document.querySelectorAll('[data-token-source]').forEach(el=>{
    const style = getComputedStyle(el);
    const source = key => style.getPropertyValue('--source-'+key.replace(/^--/,'')).trim().replace(/^"|"$/g,'');
    const expand = (value,seen=new Set()) => value.replace(/var\((--(?:color-|button-|theme-)[\w-]+)\)/g,(match,key)=>{
      const value = source(key) || style.getPropertyValue(key).trim();
      if (seen.has(key) || !value) return match;
      return expand(value,new Set([...seen,key]));
    });
    const value = expand(source(el.dataset.tokenSource));
    el.title = value;
    const refs = [...value.matchAll(/var\((--palette-[\w-]+)\)(?:\s+([\d.]+%))?/g)];
    el.replaceChildren();
    refs.forEach((match,index)=>{
      if(index) el.append(document.createTextNode(' + '));
      const code = document.createElement('code');
      code.textContent = match[1];
      el.append(code);
      if(match[2]) el.append(document.createTextNode(' × '+match[2]));
      else if(index===1 && refs[0][2]) el.append(document.createTextNode(' × '+(100-parseFloat(refs[0][2]))+'%'));
    });
  });
}
function updateTokenValues() {
  const tokenCache = new Map();
  const colorCache = new Map();
  let colorContext;
  document.querySelectorAll('[data-token-value]').forEach(el => {
    const name = el.dataset.tokenValue;
    const theme = el.closest('.token-theme-light, .token-theme-dark');
    const cacheKey = (theme?.classList.contains('token-theme-dark') ? 'dark' : theme ? 'light' : 'current') + ':' + name;
    if (!tokenCache.has(cacheKey)) tokenCache.set(cacheKey, getComputedStyle(el).getPropertyValue('--'+name).trim());
    const value = tokenCache.get(cacheKey);
    const isColor = /^(palette-|color-|button-.*(?:bg|border))/.test(name);
    let alpha = null;
    let resolvedHex = value;
    if (isColor && /^#[\da-f]{6}$/i.test(value)) {
      resolvedHex = value.toUpperCase();
    } else if (isColor && colorCache.has(value)) {
      ({ resolvedHex, alpha } = colorCache.get(value));
    } else if (isColor) {
      if (!colorContext) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        colorContext = canvas.getContext('2d', { willReadFrequently: true });
      }
      const context = colorContext;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const rgba = context.getImageData(0, 0, 1, 1).data;
      resolvedHex = '#' + [...rgba.slice(0, 3)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      if (rgba[3] < 255) alpha = [null, resolvedHex, String(Number((rgba[3] / 255 * 100).toFixed(1)))];
      const declaredAlpha = value.match(/,\s*[^,]+?\s+([\d.]+)%\s*,\s*transparent\s*\)$/i);
      if (alpha && declaredAlpha) {
        alpha[2] = declaredAlpha[1];
        const baseHex = value.match(/^color-mix\(in srgb,\s*(#[\da-f]{6})\s+[\d.]+%\s*,\s*transparent\s*\)$/i);
        if (baseHex) alpha[1] = baseHex[1].toUpperCase();
      }
      colorCache.set(value, { resolvedHex, alpha });
    }
    let fontValue = value;
    if(name.startsWith('font-size-')) {
      const probe = document.createElement('span');
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;font-size:var(--${name})`;
      el.append(probe);
      const pixels = parseFloat(getComputedStyle(probe).fontSize);
      probe.remove();
      fontValue = `${Number(pixels.toFixed(2))}px`;
    }
    if(name.startsWith('radius-') || name === 'spinner-size' || name === 'spinner-stroke-width') {
      const probe = document.createElement('span');
      probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;display:block;width:var(--${name});height:0`;
      el.append(probe);
      const pixels = parseFloat(getComputedStyle(probe).width);
      probe.remove();
      fontValue = Number.isFinite(pixels) ? `${Number(pixels.toFixed(2))}px` : value;
    }
    if(name === 'layout-max') {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;display:block;width:var(--layout-max);height:0';
      document.body.append(probe);
      const pixels = parseFloat(getComputedStyle(probe).width);
      probe.remove();
      fontValue = Number.isFinite(pixels) ? `${value} = ${Number(pixels.toFixed(2))}px` : value;
    }
    el.textContent = alpha ? alpha[1].toUpperCase() : isColor ? resolvedHex : fontValue;
    const opacity = el.closest('.hex-value')?.querySelector('[data-token-opacity]');
    if(opacity) {
      opacity.hidden = !alpha;
      opacity.textContent = alpha ? alpha[2]+'%' : '';
      opacity.setAttribute('aria-label',alpha ? '不透明度 '+alpha[2]+'%' : '');
    }
  });
  document.querySelectorAll('[data-style-line-height]').forEach(el => {
    const sample = el.closest('tr').querySelector('.font-size-example');
    const height = parseFloat(getComputedStyle(sample).lineHeight);
    el.textContent = `${Number(height.toFixed(2))}px`;
  });
  updateColorReferences();
}

articles['design-borders'] = () => designGuide('Borders 边框','提供两种边框：primary 用于需要清楚辨认的轮廓，secondary 用于容器与内容分隔。两者组合统一线宽、实线样式和对应的语义颜色。',[
  ['borders','Border Styles 边框样式','当前值展示线宽与颜色引用，亮暗主题的颜色同时列出；示例随当前主题切换。',`<div class="table-scroll"><table class="token-table has-example border-style-table">${tableColumns(['token','value','purpose','example'])}<thead><tr><th>Token</th><th>当前值</th><th>用途</th><th>示例</th></tr></thead><tbody>${[
    ['primary','输入控件等需要明确辨认的轮廓'],
    ['secondary','容器边界、表格、列表与内容分隔']
  ].map(([role,use])=>`<tr><td><code>--border-${role}</code></td><td><div class="token-values"><div>线宽 <code>--border-width</code> ${tokenValue('border-width')}</div><div>样式 <code>--border-style</code> ${tokenValue('border-style')}</div><div>颜色 <code>--color-border-${role}</code></div><div>亮色 ${tokenValue('color-border-'+role,'light')}</div><div>暗色 ${tokenValue('color-border-'+role,'dark')}</div></div></td><td>${use}</td><td><div class="border-sample" style="border:var(--border-${role})">边框示例</div></td></tr>`).join('')}</tbody></table></div>`],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>完整轮廓使用 border: var(--border-primary) 或 border: var(--border-secondary)；分隔线可用于 border-top 等单侧属性。</li><li>边框颜色引用全局语义 token，随主题切换；圆角按元素形状单独选择。</li><li>同一容器避免叠加多层边框与阴影。</li><li>焦点轮廓表达键盘位置，与普通容器边框分开设置。</li></ul>'],
  ['api','API 参数参考','线宽与线型由基础 Token 统一维护，亮暗主题使用相同参数。',`<div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>Token</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>
    <tr><td><code>--border-width</code></td><td>CSS 长度</td><td>${tokenValue('border-width')}</td><td>统一控制两种组合边框的线宽</td></tr>
    <tr><td><code>--border-style</code></td><td><code>solid</code></td><td>${tokenValue('border-style')}</td><td>统一使用实线，保持轮廓与分隔线一致</td></tr>
  </tbody></table></div>`]
]);
articles['design-elevation'] = () => designGuide('Shadow 阴影','提供默认与弹窗两种阴影：普通浮层使用默认阴影，对话框使用范围更大的弹窗阴影。按钮与侧栏不添加投影。',[
  ['shadows','Shadow Styles 阴影样式','默认阴影采用 2px 向下偏移与 8px 模糊，弹窗阴影采用 4px 向下偏移与 24px 模糊。示例直接引用对应 Token，随当前主题切换。',tokenTable([
    ['shadow-default','菜单等普通浮层','<div class="elevation-stage"><span class="elevation-sample" style="box-shadow:var(--shadow-default)">默认阴影</span></div>'],
    ['shadow-dialog','对话框','<div class="elevation-stage"><span class="elevation-sample" style="box-shadow:var(--shadow-dialog)">弹窗阴影</span></div>'],
  ], 'elevation-table')],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>按钮不添加投影；页面与普通容器优先使用背景和边框区分，不叠加多层阴影。</li><li>侧栏使用实色背景，不添加投影；对话框按需引用浮层阴影。</li><li>阴影颜色使用语义 token 并适配亮暗主题，遮罩沿用 color-bg-overlay。</li></ul>']
]);
articles['design-blur'] = () => designGuide('Blur 模糊','基础模糊样式统一定义弱、常规、强三档强度。具体场景通过独立 Token 引用基础样式，便于复用与调整。',[
  ['styles','Blur Styles 模糊样式','按背景细节需要弱化的程度选择，前景文字与控件保持清晰。',tokenTable([
    ['blur-weak','弱模糊，保留较多背景细节'],
    ['blur-normal','常规模糊，用于一般背景弱化'],
    ['blur-strong','强模糊，进一步弱化背景细节']
  ])],
  ['mapping','Semantic Mapping 场景映射','场景 Token 引用基础模糊样式，不重复定义数值。目前遮罩引用常规档；后续有实际需要时再增加场景。',
    `<div class="table-scroll"><table class="token-table">${tableColumns(['token','value','purpose'])}<thead><tr><th>Token</th><th>当前值</th><th>用途</th></tr></thead><tbody><tr><td><code>--blur-overlay</code></td><td><code>--blur-normal</code><br>${tokenValue('blur-overlay')}</td><td>模态遮罩的背景模糊</td></tr></tbody></table></div>`],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>组件优先引用对应场景 Token；场景 Token 从三档基础模糊样式中选择。</li><li>使用 backdrop-filter 模糊背景，不对包含文字与控件的整个容器使用 filter: blur()。</li><li>遮罩颜色独立引用 color-bg-overlay（黑色 70%）；不支持背景模糊时，仍通过遮罩颜色区分前后层级。</li><li>亮暗主题沿用相同模糊值。</li></ul>'],
  ['api','API 参数参考','基础样式接受非负 CSS 长度，不支持百分比；场景参数引用基础样式 Token。',`<div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>Token</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>
    <tr><td><code>--blur-weak</code></td><td>非负 CSS 长度</td><td><code>4px</code></td><td>定义弱模糊强度</td></tr>
    <tr><td><code>--blur-normal</code></td><td>非负 CSS 长度</td><td><code>8px</code></td><td>定义常规模糊强度</td></tr>
    <tr><td><code>--blur-strong</code></td><td>非负 CSS 长度</td><td><code>16px</code></td><td>定义强模糊强度</td></tr>
    <tr><td><code>--blur-overlay</code></td><td><code>var(--blur-weak)</code> / <code>var(--blur-normal)</code> / <code>var(--blur-strong)</code></td><td><code>var(--blur-normal)</code></td><td>选择模态遮罩使用的模糊样式</td></tr>
  </tbody></table></div>`]
]);
articles['design-motion'] = () => designGuide('Motion 动效','动效由时长与缓动共同定义：时长决定变化持续多久，缓动决定速度如何变化。加载与过渡分开设置；关键反馈不只依赖动画表达。',[
  ['duration','Duration 时长','通用过渡提供 300ms、500ms、700ms 三档；控件颜色过渡与按钮按压位移分别使用独立的 100ms 参数，保证短促点击也有清晰反馈。一般位移用常规档，页面入场等需要看清过程的动效用慢档。',tokenTable([['control-color-duration','按钮、Tab 与图标按钮颜色过渡，100ms'],['button-press-duration','按钮、Tab 与图标按钮的按压位移，100ms'],['duration-fast','背景状态等短暂反馈'],['duration-normal','侧栏抽屉、目录指示条等一般位移，500ms'],['page-entry-duration','页面上移淡入，当前 700ms'],['duration-slow','页面入场等需要看清过程的动效']])],
  ['easing','Easing 缓动','沿用 CSS 原生名称：ease-in 加速，ease-out 减速，ease-in-out 先加速后减速，linear 匀速。按运动过程选择，不另设抽象名称。',tokenTable([['easing-ease-in','由慢到快；元素退出'],['easing-ease-out','由快到慢；元素进入、提示反馈'],['easing-ease-in-out','两端慢、中间快；状态切换与双向位移'],['easing-linear','速度恒定；加载图标持续旋转']])],
  ['templates','Motion Templates 动效模板','按场景选择模板；入场与出场共用所列时长，控件按压对应按下与松开。',`<div class="table-scroll"><table class="token-table motion-template-table"><colgroup><col class="column-token"><col><col><col><col><col></colgroup><thead><tr><th>模板</th><th>时长</th><th>入场 / 按下</th><th>出场 / 松开</th><th>缓动</th><th>用途</th></tr></thead><tbody>${[
    ['page 页面','page-entry-duration','下方 8px 上移、淡入','切页直接替换，无退场','入场 ease-out','首次打开、文档切换'],
    ['motion-press 控件','button-press-duration','下移 1px','回到原位','按下 / 松开 ease-in-out','按钮、Tab、图标按钮；颜色另用 control-color-duration（100ms）'],
    ['popover 菜单浮层','duration-fast','上方 4px 下移、淡入','上移 4px、淡出','入场 ease-out；出场 ease-in','顶栏下拉菜单等轻量浮层'],
    ['dialog 对话框','duration-fast','下方 8px 上移、淡入','下移 8px、淡出','入场 ease-out；出场 ease-in','对话框面板'],
    ['drawer 抽屉','duration-normal','从所在侧按自身全宽滑入','向原侧按自身全宽滑出','入场 / 出场 ease-in-out','导航抽屉、内容抽屉']
  ].map(([name,duration,enter,exit,easing,purpose])=>`<tr><td><code>${name.split(' ')[0]}</code><br>${name.split(' ').slice(1).join(' ')}</td><td><code>--${duration}</code><br>${tokenValue(duration)}</td><td>${enter}</td><td>${exit}</td><td>${easing}</td><td>${purpose}</td></tr>`).join('')}</tbody></table></div>`],
  ['application','Usage 使用方式','页面与浮层使用 Motion；按压与抽屉使用共用 CSS 模板。现有按钮、Tab、顶栏菜单、页面与导航抽屉已复用相应配方。',tokenCode(`// 页面入场，重复调用会取消上一次动画。
Motion.play(element, 'page');

// 普通菜单：显示后入场，退场完成后才隐藏。
Motion.setVisible(menu, true, 'popover');
Motion.setVisible(menu, false, 'popover');

// 原生 dialog 由组件负责 showModal、焦点与 close。
dialog.showModal();
Motion.play(dialog, 'dialog');
// 关闭前调用；返回 false 表示被新动画替代，不再关闭。
const completed = await Motion.play(dialog, 'dialog', { exit: true });
if (completed) dialog.close();

// 按压：class="motion-press"
// 抽屉：class="motion-drawer" data-open="true"
// 左侧抽屉设置 --motion-drawer-x: -100%; 默认从右侧滑入。
// 原生模态抽屉使用 Motion.play(sheet, 'drawer')，关闭时传 { exit: true }。`)],
  ['rules','Guidelines 使用要点','','<ul class="usage-notes"><li>进入使用 ease-out，退出使用 ease-in；抽屉与按压使用 ease-in-out。浮层退出时立即禁用交互，完成后隐藏；快速重开不会被旧回调隐藏。</li><li>尊重减少动态效果偏好，关闭非必要位移动画与平滑滚动。</li><li>减少动画后仍用文字、图标或状态属性表达加载与结果。</li><li>不为装饰添加持续动画，不用延长时长弥补状态不明确的问题。</li></ul>']
]);

// 只展开纯元素容器，保留段落内空白与 pre 中的原始代码。
function formatContentMarkup(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup;
  function format(node, depth) {
    const indent = '  '.repeat(depth);
    if (node.nodeType !== 1) return indent + node.textContent;
    const children = [...node.childNodes];
    const canExpand = node.tagName !== 'PRE' && node.children.length &&
      children.every(child => child.nodeType === 1 || !child.textContent.trim());
    if (!canExpand) return indent + node.outerHTML;
    const shell = node.cloneNode(false).outerHTML;
    const opening = shell.slice(0, shell.indexOf('>') + 1);
    return indent + opening + '\n' + [...node.children].map(child => format(child, depth + 1)).join('\n') +
      '\n' + indent + '</' + node.localName + '>';
  }
  return [...template.content.childNodes].map(node => format(node, 0)).join('\n');
}

// 内容排版页面：分类作为路由，具体元素在正文中展示。
function contentGuide(title, description, sections) {
  return guide(title, description, sections.map(([id, heading, text, markup]) => [id, heading,
    `${text ? `<p>${text}</p>` : ''}${id === 'rules' ? markup : example(formatContentMarkup(`<div class="content-demo${id === 'headings' ? ' heading-specimens' : ''}">${markup}</div>`))}`]));
}
const contentNotes = items => `<ul class="usage-notes">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
articles.typography = () => contentGuide('Text Styles 文字样式','标题表达章节关系，段落承载正文。这里说明文字样式如何应用；字体、字号倍率和字重的基础定义见设计指南中的文字页。',[
  ['headings','Headings 标题','标题示例包含页面、章节、子章节与 Label 局部标题，统一使用 600 字重。HTML 层级表达文档结构，样式名称表达视觉用途。',typographyRoles.filter(([name])=>name.endsWith('title') || name === 'label').map(([name,use])=>`<div class="type-specimen"><span class="text-${name}">${use} ${name === 'label' ? 'Label' : 'Heading'}</span></div>`).join('')],
  ['paragraphs','Paragraphs 段落','p 默认使用 text-body：14px、400、行高倍率 1.6，计算后取整。辅助说明使用 text-caption（默认 12px）。','<p>这是默认正文。用完整句子说明用途、条件和结果；不同段落之间用间距分隔。</p><p class="text-caption">这是辅助说明，用于简短补充。</p>'],
  ['captions','Captions 辅助文字','text-caption 默认 12px、400、行高倍率 1.6，用于日期、来源及补充信息。必要的操作说明仍使用正文大小。','<p class="text-caption">更新于 2026 年 10 月 23 日 · 内容来源：项目规范</p>'],
  ['rules','Guidelines 使用要点','文字样式负责呈现，HTML 标签负责语义。字号基准改变后，所有样式按精确比例缩放，行高重新计算并取整。',contentNotes(['每页保留一个主标题，章节层级保持连续。','默认正文与列表使用 14px，不用小字承载长篇说明。','标题按用途选择样式，正文使用 text-body。'])]
]);
articles['inline-formatting'] = () => contentGuide('Inline Formatting 行内格式','对段落中的部分文字增加强调、修饰或关联，保留所在段落的字号与阅读节奏。',[
  ['emphasis','Emphasis 强调与修饰','strong 表示重要内容，使用 600；em 表示语气强调，通常呈现为斜体。下划线用于明确的格式需要，避免与链接混淆。高亮标记使用当前主题色背景及对应前景，随配色与亮暗模式更新。','<p>正文中的 <strong>重要信息</strong>、<em>语气强调</em>、<u>下划线文字</u>、<del>已删除内容</del> 与 <mark>高亮标记</mark>。</p>'],
  ['inline-code','Inline Code 行内代码','code 表示代码、变量名或 token，使用等宽字体、辅助字号与浅色背景。它可以嵌入普通句子，不改变段落结构。','<p>正文引用 <code>text-body</code>；配置值为 <code>font-size-base: 14px</code>。</p>'],
  ['links','Links 链接','链接用于跳转，文字说明目的地并保留下划线。Form 主题引用 <code>--color-info</code> 及其 Hover / 点击色；其他主题引用 <code>--color-action-primary</code> 及对应状态色，随亮暗模式更新，键盘焦点保留轮廓。','<p>查看 <a href="#design-typography">文字设计指南</a>，了解基础尺度与引用关系。</p><p>状态对照：<a href="#design-typography">默认链接</a> · <a class="content-link-hover" href="#design-typography">Hover 悬停链接</a></p>'],
  ['additional','Additional Formats 补充格式','上下标适合简短标注；键盘输入使用 kbd，程序输出使用 samp。按内容含义选择元素。','<p>面积 24m<sup>2</sup>，水的化学式 H<sub>2</sub>O。按 <kbd>⌘</kbd> + <kbd>K</kbd> 打开搜索；输出为 <samp>完成</samp>。</p>']
]);
articles.lists = () => contentGuide('Lists 列表','列表用于组织并列条目、顺序步骤和待办事项。继承默认正文 14px 与行高倍率 1.6，条目间距由父列表的 gap 统一为 4px，文字与段落使用相同颜色，圆点与编号统一使用三级文字色。',[
  ['unordered','Unordered List 无序列表','ul 用于没有先后顺序的并列内容。使用浏览器原生标记，通过 ::marker 设置颜色。','<ul class="content-list"><li>统一文字与颜色规范</li><li>检查亮暗主题的呈现</li><li>确认窄屏下可以阅读</li></ul>'],
  ['ordered','Ordered List 有序列表','ol 用于步骤、顺序或排名。编号由浏览器生成，需要接续编号时使用 start 属性。','<ol class="content-list"><li>确定正文基准字号</li><li>选择相应文字样式</li><li>检查换行与行高</li></ol>'],
  ['tasks','Task List 任务列表','任务列表复用标准 Checkbox 表达完成状态，文字标签可以点击切换。完成项保留可读性，不只依靠颜色区分。',`<ul class="content-tasks"><li>${choiceDemo('checkbox','确定基础字号',{checked:true})}</li><li>${choiceDemo('checkbox','检查长段落与列表')}</li></ul>`],
  ['nesting','Nesting & Indentation 嵌套与缩进','子列表表达从属关系，放在所属父级 li 内。列表及每级子列表的左内边距使用 space-12（24px），条目间距使用 space-2（4px），换行文字与本条首行文字对齐。避免用空格模拟缩进；编号与圆点由原生列表样式生成。','<ul class="content-list"><li><div class="list-item-content"><span>设计检查</span><ul><li>文字与间距</li><li>颜色与状态</li></ul></div></li><li>交互检查</li></ul>']
]);
articles['content-blocks'] = () => contentGuide('Content Blocks 内容块','内容块包含代码块、提示框与公式块，分别用于展示代码、补充说明和数学表达。',[
  ['code','Code Block 代码块','pre 保留空格与换行，code 表达代码含义。使用等宽字体和独立滚动容器，长行不撑开正文。','<pre><code>:root {\n  --font-size-base: 14px;\n}\n\np {\n  font-size: var(--font-size-sm);\n}</code></pre>'],
  ['callout','Callout 提示框','提示框用于与当前内容有关的补充说明，文字说明用途，不仅依赖背景色传达信息。','<aside class="content-callout"><strong>说明</strong><p>修改字号基准后，重新检查固定高度控件和多行标题。</p></aside>'],
  ['math','Math Block 公式块','本项目不引入公式渲染依赖。简单公式使用原生 MathML；复杂 LaTeX 源码可用代码块展示，不能将未渲染的源码当作公式预览。','<div class="content-math"><math display="block" aria-label="行高等于字号乘以行高倍率"><mrow><mi>h</mi><mo>=</mo><mi>s</mi><mo>×</mo><mi>r</mi></mrow></math></div>'],
]);
articles.references = () => contentGuide('References 引用与注释','引用块展示来自其他来源的内容，脚注补充正文说明；根据内容长度和阅读位置选择。',[
  ['quote','Blockquote 引用块','blockquote 表示来自其他来源的引用；使用左侧竖线和缩进区分，来源说明放在引用后。','<blockquote><p>先明确内容结构，再选择合适的文字样式。</p><footer>— 排版记录</footer></blockquote>'],
  ['footnotes','Footnotes 脚注','正文通过编号跳到说明，脚注提供返回原位置的链接。编号与目标 id 在页面内保持唯一。','<p>字号以默认正文为基准缩放。<sup id="content-note-source"><a href="#content-note-detail" aria-label="查看脚注 1">[1]</a></sup></p><ol class="content-list content-footnotes"><li id="content-note-detail">默认基准为 14px，实际字号按精确比例计算。<a href="#content-note-source" aria-label="返回脚注引用">返回 ↑</a></li></ol>'],
]);
articles.table = () => contentGuide('Table 表格','表格用于对照具有共同字段的数据与说明。',[
  ['table','Table 表格','表格表达行列关系，表头标明字段。文字默认 14px，表头与内容均左对齐、垂直居中；单元格左右留白 16px。窄屏只在表格容器内横向滚动。','<div class="table-scroll content-table-frame"><table class="token-table content-data-table"><colgroup><col class="column-token"><col class="column-value"><col class="column-purpose"></colgroup><thead><tr><th scope="col">Token</th><th scope="col">当前值</th><th scope="col">用途</th></tr></thead><tbody><tr><td><code>text-body</code></td><td><code>14px</code></td><td>默认正文</td></tr><tr><td><code>text-label</code></td><td><code>14px / 600</code></td><td>表头与局部标题</td></tr></tbody></table></div>'],
  ['rules','Column Width & Sticky Column 列宽与固定列','列宽、固定列与分割线统一复用共享样式，避免按内容长度或单个页面另设宽度。',`<ul class="usage-notes">
    <li>表格使用 <code>table-layout: fixed</code>；首列宽度统一引用 <code>--table-first-column-width</code>，当前为 ${tokenValue('table-first-column-width')}，不随表格宽度改变。通过 <code>colgroup</code> 定义列，其余列按剩余宽度分配。</li>
    <li>普通 Token 表为“Token / 当前值 / 用途”，后两列按 <code>20:50</code> 分配；带示例时末列为“示例”，后三列按 <code>20:25:25</code> 分配。尺寸、状态等普通参数说明表沿用相同规则。</li>
    <li>基础色板后两列按 <code>30:25</code> 分配；语义颜色后五列按 <code>19:13:19:13:14</code> 分配。</li>
    <li>API 参数表后三列按 <code>30:14:32</code> 分配；文字组合样式表后五列按 <code>20:20:14:10:18</code> 分配。</li>
    <li>普通表格最小宽度引用 <code>--layout-table-min</code>，当前为 ${tokenValue('layout-table-min')}；字号表最小宽度为 640px，语义颜色与文字样式表为 1000px。长内容自动换行，超出宽度只在 <code>table-scroll</code> 容器中滚动，不撑宽整页；不为普通表格额外覆盖最小宽度。</li>
    <li>Token 表与 API 参数表横向滚动时，首列使用 <code>position: sticky</code>、<code>left: 0</code> 与 <code>z-index: 1</code> 固定在左侧；背景使用主题实色 <code>--color-bg-primary</code>，防止后方内容透出。容器使用 <code>overscroll-behavior-x: none</code> 禁用横向回弹。</li>
    <li>固定首列右侧始终显示 1px 分割线，颜色引用 <code>--color-border-secondary</code>。通过单元格的 <code>::after</code> 绝对定位绘制（<code>right: 0</code>、<code>inset-block: 0</code>），随首列一起固定，不参与列宽计算；表格使用 <code>border-collapse: separate</code> 与 <code>border-spacing: 0</code>。</li>
  </ul>`]
]);
articles.divider = () => contentGuide('Divider 分割线','分割线用于区分内容主题，与章节间距配合使用。',[
  ['divider','Divider 分隔线','hr 表达内容主题的转换。使用细线与上下留白，不代替章节标题。','<p>上一部分内容。</p><hr><p>下一部分内容。</p>']
]);
// 原生复选框保留键盘、标签点击及表单提交行为。
function switchDemo(name, {checked = false, disabled = false} = {}) {
  return `<label class="ui-switch">
  <input type="checkbox" role="switch" aria-label="${name}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>
  <span class="switch-track" aria-hidden="true"></span>
</label>`;
}
articles.switch = () => guide('Switches 开关', '用于开启或关闭一项设置，适合切换后立即生效的操作。', [
  ['basic', 'Basic 基础示例', '<p>统一使用中号：轨道 36 × 20px、滑块 16px，四周内间距 2px。</p>' + example(switchDemo('接收通知', {checked: true}))],
  ['states', 'States 状态与交互', '<p>从左到右依次为关闭、开启、禁用关闭、禁用开启；禁用时保留原状态，暂时不可操作。</p>' + example(`<div class="switch-states">
  <div class="switch-state">${switchDemo('关闭示例')}</div>
  <div class="switch-state">${switchDemo('开启示例', {checked: true})}</div>
  <div class="switch-state">${switchDemo('禁用关闭示例', {disabled: true})}</div>
  <div class="switch-state">${switchDemo('禁用开启示例', {checked: true, disabled: true})}</div>
</div>`) + `<ul class="usage-notes"><li>开启使用主题操作色，关闭使用中性背景；Hover 与按下使用对应悬停色，开启后的禁用背景引用主题 disabled 色。</li><li>圆点始终为白色；暗色禁用时不透明度为 50%，其他状态保持不透明。</li><li>Tab 聚焦，Space 切换，键盘焦点显示轮廓；禁用项不进入焦点顺序，也不参与表单提交。</li><li>滑块平移与颜色渐变均为 300ms，使用 ease-in-out 缓动；减少动态效果时立即切换。</li></ul>`],
  ['guidelines', 'Guidelines 使用要点', `<ul class="usage-notes"><li>适用于立即生效的二元设置；需要点击提交后保存的表单选项优先使用复选框。</li><li>让开关与设置名称明确关联，名称在切换时保持一致。</li><li>异步保存期间禁用重复操作；失败时恢复原状态，并提示原因。</li></ul>`],
  ['api', 'API 参数参考', `<p>使用 <code>ui-switch</code> 包裹 <code>input type="checkbox" role="switch"</code> 与装饰轨道，结构见示例。状态由原生 <code>checked</code> 表达，无需重复设置 <code>aria-checked</code>；监听 <code>change</code> 并读取 <code>event.target.checked</code> 获取当前值。 HTML 布尔属性以存在表示 true、移除表示 false，不能写成属性值 false；ARIA 属性使用字符串 true / false。</p><div class="example guide-example"><div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>参数 / 属性</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>${[
    ['checked', 'true / false', 'false', 'HTML 属性指定初始状态；运行时读取或修改 input.checked'],
    ['disabled', 'true / false', 'false', '不可交互且不参与原生表单提交'],
    ['name / value', '字符串', '无 / on', '提供 name 后，仅开启且未禁用的开关提交 value'],
    ['aria-label / aria-labelledby', '文字 / 元素 ID', '无', '必填其一，为开关提供名称；关联现有设置名称时使用 aria-labelledby']
  ].map(([name, options, value, use]) => `<tr><td><code>${name}</code></td><td>${options.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${value.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${use}</td></tr>`).join('')}</tbody></table></div></div>`]
]);

function selectDemo(id, {label = '公开范围', size = '', layout = 'fixed', width = '', placeholder = false, disabled = false, invalid = false, options = ''} = {}) {
  return `<div class="ui-select${size ? ' ' + size : ''}${layout !== 'fixed' ? ' ' + layout : ''}"${width ? ` style="--select-width: ${width}"` : ''}>
  <select id="${id}" name="visibility" aria-label="${label}"${disabled ? ' disabled' : ''}${placeholder ? ' required' : ''}${invalid ? ` aria-invalid="true" aria-describedby="${id}-hint"` : ''}>
    ${placeholder ? '<option value="" disabled selected hidden>请选择公开范围</option>\n    ' : ''}${options || '<option value="private">仅自己</option>\n    <option value="team">团队成员</option>\n    <option value="public">所有人</option>'}
  </select>${invalid ? `\n  <span class="select-hint" data-error id="${id}-hint">请选择公开范围。</span>` : ''}
</div>`;
}
articles.select = () => guide('Select 选择框', '从一组已知选项中选择一个值。收起时显示当前选择，适合节省空间，也让表单保持清晰。', [
  ['basic', 'Basic 基础示例', '<p>展开后选择一项，选项随即收起，当前值保留在选择框中。没有合适的默认值时，先提示选择，避免替人作出决定。</p>' + example(selectDemo('select-basic'))],
  ['sizes', 'Sizes 尺寸', '<p>切换查看小号、中号与大号。密集工具栏用小号，默认用中号，常规表单可用大号。</p>' + example(sizePreviews('select-size', size => selectDemo('select-'+size, {label:'公开范围',size}))) + '<ul class="usage-notes"><li>小号：12px 字号，上下 4px、左右 8px 内边距。</li><li>中号：12px 字号；大号：14px 字号。两者均为上下 6px、左右 12px 内边距，沿用按钮的尺寸尺度。</li></ul>'],
  ['width', 'Width 宽度', '<p>根据内容适配、撑满容器或指定宽度，与字号尺寸独立配置。控件不设最小宽度；下拉菜单最小宽度为 200px，视口空间不足时收缩到可用范围内。</p>' + example(`<div class="control-demo-stack">
  ${selectDemo('select-fit-width', {label: '不设定宽度', layout: 'fit-content'})}
  ${selectDemo('select-fixed-width', {label: '200px 宽度', width: 'var(--layout-theme-menu)'})}
  ${selectDemo('select-full-width', {label: '撑满宽度', layout: 'full-width'})}
</div>`) + '<ul class="usage-notes"><li>示例依次为不设定宽度（随选中内容适配）、指定 200px、撑满容器。</li><li>下拉菜单通常与选择框等宽，并保持 200px 的最小宽度。</li></ul>'],
  ['options', 'Options 选项组织', '<p>相关选项可以分组，组名说明共同含义。暂不可用的选项保留名称，并补充原因，帮助理解当前限制。</p>' + example(selectDemo('select-groups', {label: '发布到', options: '<optgroup label="团队空间">\n      <option value="design">设计团队</option>\n      <option value="product">产品团队</option>\n    </optgroup>\n    <optgroup label="个人空间">\n      <option value="personal">个人文档</option>\n      <option value="archive" disabled>归档空间（只读）</option>\n    </optgroup>'}))],
  ['states', 'States 状态与交互', '<p>依次为常规、错误与禁用，窄屏时自动换行。错误提示说明如何继续；禁用时保留当前值，暂时不可操作。</p>' + example(`<div class="select-demo-row align-start">${selectDemo('select-normal', {label: '常规'})}${selectDemo('select-error', {label: '错误', placeholder: true, invalid: true})}${selectDemo('select-disabled', {label: '禁用', disabled: true})}</div>`) + '<ul class="usage-notes"><li>Hover 与展开只将描边改为主题色，背景保持不变；箭头收起朝下、展开朝上，旋转为 300ms，减少动态效果时直接切换；未选中项使用次要灰色文字，选中项使用主要文字色与勾选标记；标记与焦点轮廓使用主题色。禁用使用中性背景与禁用文字色，不降低整个控件的不透明度。</li><li>Enter、Space 或上下方向键展开；上下方向键移动，Home / End 到首尾，Enter / Space 确认。Escape 取消，Tab 关闭并继续移动焦点；导航时跳过不可用选项。</li><li>错误状态以描边和文字共同提示。选择有效值后清除提示；接入表单时仍需校验实际内容。</li><li>控件颜色与按压位移为 100ms，展开与收起复用浮层动效（300ms）；减少动态效果时关闭。空间不足时向上展开，较长列表在浮层内滚动。</li></ul>'],
  ['guidelines', 'Guidelines 使用要点', '<ul class="usage-notes"><li>示例通过 aria-label 提供无障碍名称；实际表单中仍需让字段用途清晰可辨。选项名称简短明确，同一组保持相同的表达方式。</li><li>少量选项需要同时比较时使用单选框；执行操作使用菜单。当前选择框只支持单选，不提供搜索。</li><li>有合理默认值时直接显示；必须主动选择时使用空值提示，并设置 <code>required</code>。</li></ul>'],
  ['api', 'API 参数参考', `<p>在 <code>ui-select</code> 容器中放置原生 <code>select</code>，通过 <code>aria-label</code> 提供名称，由 <code>SelectControl.init()</code> 增强为单选组合框。原生元素保留表单值与校验；监听它的 <code>change</code> 事件并读取 <code>value</code>。通过脚本赋值后，派发 <code>change</code> 事件同步展示。 HTML 布尔属性以存在表示 true、移除表示 false，不能写成属性值 false；ARIA 属性使用字符串 true / false。</p><div class="example guide-example"><div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>参数 / 属性</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>${[
    ['size', 'small / medium / large', 'medium', '通过容器类名选择尺寸；省略时使用默认中号，不使用原生 select 的 size 属性'],
    ['layout', 'fixed / fit-content / full-width', 'fixed', '通过容器类名选择指定宽度、随选中内容适配或撑满容器'],
    ['--select-width', 'CSS 长度', '200px', 'fixed 模式的控件宽度；设置在 ui-select 容器上，不设最小宽度'],
    ['name', '字符串', '无', '原生 select 的提交字段名'],
    ['value', '选项值', '首个可用选项', '运行时读取或设置原生 select.value；初始值由 option 的 selected 属性决定'],
    ['disabled', 'true / false', 'false', '设置在 select 上禁用整个控件，或在 option / optgroup 上禁用部分选项；整项禁用时不提交'],
    ['required', 'true / false', 'false', '值为空时不通过原生表单校验'],
    ['aria-invalid', 'true / false', 'false', '标记错误状态；与 aria-describedby 关联的提示一起使用'],
    ['aria-describedby', '提示元素 ID', '无', '关联辅助说明或错误信息'],
    ['aria-label', '字符串', '无', '无可见标签时必填；增强后同步到触发按钮'],
    ['optgroup / label', '分组名称', '无', '为相关选项提供组名，不作为可选值']
  ].map(([name, options, value, use]) => `<tr><td><code>${name}</code></td><td>${options.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${value.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${use}</td></tr>`).join('')}</tbody></table></div></div>`]
]);

// 参数表共用既有列宽与行内代码格式。
function controlApi(rows) {
  return `<div class="example guide-example"><div class="table-scroll"><table class="api-table">${tableColumns(['property','options','default','purpose'])}<thead><tr><th>参数 / 属性</th><th>可选值</th><th>默认</th><th>作用</th></tr></thead><tbody>${rows.map(([name, options, value, use]) => `<tr><td><code>${name}</code></td><td>${options.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${value.split(' / ').map(x => `<code>${x}</code>`).join(' / ')}</td><td>${use}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function textFieldDemo(id, {label = '项目名称', size = '', multiline = false, disabled = false, readonly = false, invalid = false, value = '', placeholder = '例如：界面规范', name = id, required = false, maxlength} = {}) {
  const attributes = `class="ui-text-input${size ? ' ' + size : ''}" id="${id}" name="${name}"${required ? ` required aria-describedby="${id}-hint"` : ''}${maxlength ? ` maxlength="${maxlength}"` : ''}${label ? '' : ' aria-label="项目名称"'} placeholder="${placeholder}"${disabled ? ' disabled' : ''}${readonly ? ' readonly' : ''}${invalid ? ` required aria-invalid="true" aria-describedby="${id}-hint" data-validate` : ''}`;
  return `<div class="text-field">${label ? `\n  <label for="${id}">${label}</label>` : ''}
  ${multiline ? `<textarea ${attributes} rows="4" data-character-limit="240" aria-describedby="${id}-limit-hint">${value}</textarea>` : `<input type="text" ${attributes} value="${value}">`}${invalid || required ? `\n  <span class="field-hint" id="${id}-hint" data-field-error${invalid ? '' : ' hidden'}>请输入${label || '项目名称'}。</span>` : ''}${multiline ? `\n  <span class="field-hint field-limit-hint" id="${id}-limit-hint" role="status" hidden></span>` : ''}
</div>`;
}
articles.input = () => guide('Input 文本输入', '用于输入和编辑文字。单行适合名称等简短信息，多行适合描述、备注与较长内容。', [
  ['basic', 'Basic 基础示例', '<p>标签说明需要填写什么，占位文字给出格式或示例。输入后标签仍然保留，方便回看与修改。</p>' + example(textFieldDemo('input-basic'))],
  ['sizes', 'Sizes 尺寸', '<p>切换查看小号、中号与大号。密集区域用小号，默认用中号，常规表单可用大号。</p>' + example(sizePreviews('input-size', size => textFieldDemo('input-'+size, {label:'',size}))) + '<ul class="usage-notes"><li>小号：12px 字号，上下 4px、左右 8px 内边距。</li><li>中号：12px 字号；大号：14px 字号。两者均为上下 6px、左右 12px 内边距，与选择框保持一致。</li></ul>'],
  ['multiline', 'Multiline 多行输入', '<p>内容需要分段时使用多行输入，Enter 换行。选择尺寸可查看字号与内边距的变化，与单行输入共用同一套尺寸，默认中号。</p>' + example(sizePreviews('textarea-size', size => textFieldDemo('input-description-'+size,{label:'项目说明',size,multiline:true,placeholder:'简要介绍项目的目标与范围'}))) + '<ul class="usage-notes"><li>初始显示 4 行，行高随字号变化；可向下拖动调整高度。</li><li>建议不超过 240 个字符；超出时保留已输入内容，用主题色描边与文字提示超出的字符数，缩减到限制内后清除提示。</li></ul>'],
  ['states', 'States 状态与反馈', '<p>从上到下依次为常规、错误、只读与禁用。只读内容可以聚焦、选取和复制；禁用内容暂不可操作。</p>' + example(`<div class="control-demo-stack">${textFieldDemo('input-normal', {label: '', value: '界面规范'})}${textFieldDemo('input-error', {label: '', invalid: true})}${textFieldDemo('input-readonly', {label: '', readonly: true, value: '只读项目'})}${textFieldDemo('input-disabled', {label: '', disabled: true, value: '暂不可编辑'})}</div>`) + '<ul class="usage-notes"><li>Hover 与获焦只将边框改为主题色，输入时背景保持不变；禁用使用中性背景和禁用文字色，颜色过渡为 100ms。</li><li>错误以描边与提示共同表达。示例填写后清除提示；实际表单应按字段规则校验，并保留已输入内容。</li><li>只读值仍参与表单提交，禁用值不提交；减少动态效果时关闭过渡。</li></ul>'],
  ['guidelines', 'Guidelines 使用要点', '<ul class="usage-notes"><li>实际表单保留清楚的字段标签。占位文字只作补充；无可见标签时提供 <code>aria-label</code>。</li><li>只有确需限制时才设置必填或长度上限。错误提示说明如何修正，不责备输入者。</li><li>电子邮件、密码等场景使用对应原生类型，并设置合适的 <code>autocomplete</code>，减少重复输入。</li></ul>'],
  ['api', 'API 参数参考', '<p>单行使用 <code>input.ui-text-input</code>，多行使用 <code>textarea.ui-text-input</code>。监听 <code>input</code> 获取即时内容，监听 <code>change</code> 处理已确认的修改；校验由接入表单负责。 HTML 布尔属性以存在表示 true、移除表示 false，不能写成属性值 false；ARIA 属性使用字符串 true / false。</p>' + controlApi([
    ['size', 'small / medium / large', 'medium', '单行与多行共用尺寸类名，字号和内边距同步变化；省略时为中号'],
    ['type', 'text / email / password / search / tel / url', 'text', '仅 input；按内容选择输入行为与键盘'],
    ['name / value', '字符串', '无 / 空字符串', '提交字段名与当前内容；textarea 的初始内容放在标签内'],
    ['placeholder', '字符串', '无', '输入前的格式提示，不能代替字段名称'],
    ['disabled / readonly', 'true / false', 'false / false', '分别用于不可操作与仅查看；readonly 仍提交'],
    ['required', 'true / false', 'false', 'HTML 布尔属性；添加后须填写，移除后为非必填'],
    ['maxlength', '非负整数', '无限制', '限制输入字符数；仅在需要时设置'],
    ['rows', '正整数', '2', '仅 textarea；指定初始可见行数'],
    ['autocomplete', 'on / off / 原生自动填充标识', 'on', '按字段用途支持浏览器自动填充；未设置时继承表单配置'],
    ['aria-invalid / aria-describedby', 'true 或 false / 提示元素 ID', 'false / 无', '表达错误并关联说明；不会自动执行校验']
  ])]
]);
function choiceDemo(type, label, {id = '', name = '', value = 'on', checked = false, disabled = false, mixed = false, showLabel = true, attributes = ''} = {}) {
  return `<label class="ui-choice">
  <span class="choice-indicator">
    <input type="${type}"${id ? ` id="${id}"` : ''}${name ? ` name="${name}"` : ''} value="${value}"${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}${mixed ? ' data-indeterminate' : ''}${showLabel ? '' : ` aria-label="${label}"`}${attributes ? ' ' + attributes : ''}>
    <span class="choice-control" aria-hidden="true">${type === 'checkbox' ? icon('check', 'choice-check') : ''}</span>
  </span>${showLabel ? `\n  <span class="choice-label">${label}</span>` : ''}
</label>`;
}
articles.checkbox = () => guide('Checkboxes 复选框', '用于选择一项或多项独立选项。每项可以分别勾选或取消，适合偏好设置与表单多选。', [
  ['basic', 'Basic 基础示例', '<p>标签描述所选内容，点击方框或文字均可切换。多项之间彼此独立，不限定只能选择一个。</p>' + example(choiceDemo('checkbox', '接收产品更新', {id: 'checkbox-basic', name: 'updates'}))],
  ['group', 'Group 分组与全选', '<p>相关选项用分组组织共同用途。全选项汇总当前选择：全部选中时勾选，只选择部分时显示半选。</p>' + example(`<fieldset class="choice-group" data-checkbox-group aria-label="通知渠道">
  ${choiceDemo('checkbox', '全选', {id: 'checkbox-all', attributes: 'data-check-all'})}
  <div class="choice-children">
    ${choiceDemo('checkbox', '电子邮件', {id: 'checkbox-email', name: 'channels', value: 'email', checked: true, attributes: 'data-check-item'})}
    ${choiceDemo('checkbox', '站内通知', {id: 'checkbox-site', name: 'channels', value: 'site', attributes: 'data-check-item'})}
  </div>
</fieldset>`) + '<ul class="usage-notes"><li>半选仅表示部分选中，不是第三个可提交的值；点击半选的全选项会选中全部可用子项。</li></ul>'],
  ['states', 'States 状态与交互', '<p>从左到右为未选、已选、禁用未选与禁用已选。禁用保留当前状态，暂时不可操作。</p>' + example(`<div class="choice-state-row">${choiceDemo('checkbox', '未选示例', {showLabel: false})}${choiceDemo('checkbox', '已选示例', {checked: true, showLabel: false})}${choiceDemo('checkbox', '禁用未选示例', {disabled: true, showLabel: false})}${choiceDemo('checkbox', '禁用已选示例', {checked: true, disabled: true, showLabel: false})}</div>`) + '<ul class="usage-notes"><li>已选与半选使用主题操作色，Hover 整行显示圆角中性背景，描边改为主题色；禁用已选保留主题 disabled 色，标记保留常规颜色，文字使用禁用色。</li><li>Tab 聚焦，Space 切换；键盘焦点显示主题色轮廓。颜色过渡为 100ms，减少动态效果时关闭。</li><li>同名复选框可提交多个值；只有已选且未禁用的项目参与提交。</li></ul>'],
  ['guidelines', 'Guidelines 使用要点', '<ul class="usage-notes"><li>需要立即开启或关闭设置时用开关；一组只能选一项时用单选框。</li><li>标签使用清楚的肯定表达，避免通过否定句要求读者反推勾选后的含义。</li><li>要求“至少选一项”时按组校验；不要给每个复选框都设置 required，以免变成每项必选。</li></ul>'],
  ['api', 'API 参数参考', '<p>在 <code>ui-choice</code> 标签内，用 <code>choice-indicator</code> 包裹原生 <code>input type="checkbox"</code> 与装饰标记，文字使用 <code>choice-label</code>；监听 <code>change</code> 并读取 <code>checked</code>。全选示例通过 <code>data-checkbox-group</code>、<code>data-check-all</code> 与 <code>data-check-item</code> 关联父子项，不给汇总项设置提交名称。 HTML 布尔属性以存在表示 true、移除表示 false，不能写成属性值 false；ARIA 属性使用字符串 true / false。</p>' + controlApi([
    ['checked', 'true / false', 'false', '指定初始勾选；运行时通过 input.checked 读取或设置'],
    ['indeterminate', 'true / false', 'false', 'DOM 属性，表示半选；示例可通过 data-indeterminate 初始化'],
    ['name / value', '字符串', '无 / on', '同名项逐项提交各自的 value'],
    ['disabled', 'true / false', 'false', '不响应操作，也不参与表单提交'],
    ['required', 'true / false', 'false', '设置后该项必须勾选，不表示组内至少选一项'],
    ['aria-label / aria-describedby', '名称 / 提示元素 ID', '无', '无文字时提供名称，附加说明时关联提示']
  ])]
]);
function radioGroupDemo(name, {inline = false, error = false} = {}) {
  return `<fieldset class="choice-group${inline ? ' inline' : ''}" aria-label="${error ? '联系偏好' : '共享权限'}"${error ? ` aria-invalid="true" aria-describedby="${name}-hint" data-radio-error` : ''}>
  ${choiceDemo('radio', error ? '电子邮件' : '可查看', {name, value: error ? 'email' : 'view', checked: !error, attributes: error ? 'required' : ''})}
  ${choiceDemo('radio', error ? '站内通知' : '可编辑', {name, value: error ? 'site' : 'edit'})}${error ? `\n  <span class="field-hint" id="${name}-hint" data-field-error>请选择一种联系方式。</span>` : ''}
</fieldset>`;
}
articles.radio = () => guide('Radio Buttons 单选框', '用于在一组互斥选项中选择一个值。各项同时可见，适合少量选项之间的比较与决定。', [
  ['basic', 'Basic 基础示例', '<p>同组只能选择一项，选择新项时取消原来的选择。存在合理默认值时预先选中，减少不必要的操作。</p>' + example(radioGroupDemo('permission-basic'))],
  ['layout', 'Layout 排列方式', '<p>默认纵向排列，便于比较与阅读较长标签。选项较少且名称简短时可以横向排列，空间不足时自然换行。</p>' + example(radioGroupDemo('permission-inline', {inline: true}))],
  ['states', 'States 状态与交互', '<p>从左到右为未选、已选、禁用未选与禁用已选。当前选项可以改选，不能通过再次点击取消。</p>' + example(`<div class="choice-state-row">${choiceDemo('radio', '未选示例', {name: 'radio-state-off', showLabel: false})}${choiceDemo('radio', '已选示例', {name: 'radio-state-on', checked: true, showLabel: false})}${choiceDemo('radio', '禁用未选示例', {name: 'radio-state-disabled-off', disabled: true, showLabel: false})}${choiceDemo('radio', '禁用已选示例', {name: 'radio-state-disabled-on', disabled: true, checked: true, showLabel: false})}</div>`) + '<ul class="usage-notes"><li>选中使用主题操作色，Hover 整行显示圆角中性背景，描边改为主题色；禁用选中保留主题 disabled 色，圆点保留常规颜色，文字使用禁用色。</li><li>Tab 进入或离开选项组，方向键在可用项间移动并选择，Space 选择当前项；键盘焦点显示轮廓。</li><li>颜色过渡为 100ms，减少动态效果时关闭。同组仅已选且未禁用的值参与表单提交。</li></ul>'],
  ['validation', 'Validation 选择与校验', '<p>没有合适的默认值时允许暂不选择。必须作出决定时，在组旁说明要求，校验失败后给出明确提示。</p>' + example(radioGroupDemo('contact-required', {error: true})) + '<ul class="usage-notes"><li>示例选择后清除提示；错误属于整组，不给每个选项重复显示相同信息。</li></ul>'],
  ['guidelines', 'Guidelines 使用要点', '<ul class="usage-notes"><li>同组使用相同 name，不同组保持独立；示例通过 fieldset 与 aria-label 提供组名。</li><li>需要允许“不选择”时提供明确的“无”选项；多项可以同时选择时使用复选框。</li><li>选项较多或需要节省空间时使用选择框，不把一长串单选项挤在同一行。</li></ul>'],
  ['api', 'API 参数参考', '<p>在 <code>ui-choice</code> 标签内，用 <code>choice-indicator</code> 包裹原生 <code>input type="radio"</code> 与装饰圆点，文字使用 <code>choice-label</code>。浏览器管理同名项的互斥与方向键选择；监听 <code>change</code> 获取当前项的 <code>value</code>。 HTML 布尔属性以存在表示 true、移除表示 false，不能写成属性值 false；ARIA 属性使用字符串 true / false。</p>' + controlApi([
    ['name', '字符串', '无', '定义互斥组；同一表单内同名项属于一组'],
    ['value', '字符串', 'on', '每项使用不同且稳定的提交值'],
    ['checked', 'true / false', 'false', '指定初始选择；一组最多预选一项'],
    ['disabled', 'true / false', 'false', '该项不可选择，也不参与提交'],
    ['required', 'true / false', 'false', '同名组中任一项设置后，整组必须选中一项'],
    ['layout', 'vertical / inline', 'vertical', '通过类名设置；vertical 纵向，inline 横向并允许换行；省略时为 vertical'],
    ['aria-invalid / aria-describedby', 'true 或 false / 提示元素 ID', 'false / 无', '设置在组上，表达错误并关联一次提示']
  ])]
]);
articles['design-scrollbars'] = () => guide('Scrollbars 滚动条', '在内容超出可见区域时提供浏览与定位入口。保留页面与局部容器的边界，让滚动发生在需要的地方。', [
  ['vertical', 'Vertical 纵向滚动', '<p>为内容较长的局部区域设置最大高度，超出后再出现滚动条。容器可以聚焦，键盘也能继续浏览。</p>' + example(`<div class="scroll-demo scroll-demo-vertical" tabindex="0" role="region" aria-label="项目检查清单">
  <ul class="scroll-demo-list">${['确认内容结构','检查文字层级','核对颜色与状态','确认标签名称','检查键盘焦点','检查亮暗模式','检查窄屏换行','复核交互与动效'].map(text => `<li>${text}</li>`).join('')}</ul>
</div>`)],
  ['horizontal', 'Horizontal 横向滚动', '<p>表格或并列内容需要保留宽度时，让所在容器横向滚动，不撑宽整页。长段落仍应自然换行。</p>' + example(`<div class="scroll-demo scroll-demo-horizontal" tabindex="0" role="region" aria-label="规范与组件按钮">
  <div class="scroll-demo-strip">${['颜色规范','文字规范','间距规范','边框规范','圆角规范','阴影规范','模糊规范','布局规范','动效规范','按钮组件','标签页组件','选择框组件'].map(text => `<button class="ui-button medium tertiary" type="button">${text}</button>`).join('')}</div>
</div>`)],
  ['appearance', 'Appearance 外观与行为', '<p>滑块使用中性色，亮暗模式分别适配，轨道保持透明。保留系统滚动方式与触控惯性，不模拟拖动。</p><ul class="usage-notes"><li>WebKit 滚动条宽高为 6px，滑块为全圆角；标准 scrollbar-width 使用 thin，实际宽度由浏览器决定。</li><li>常规与 Hover 分别引用 color-scrollbar、color-scrollbar-hover；标准属性不区分 Hover，系统也可能按设置自动隐藏滚动条。</li><li>局部容器使用 overscroll-behavior 限制滚动传递。焦点进入后，方向键、Page Up / Down 等按浏览器原生方式滚动。</li></ul>'],
  ['guidelines', 'Guidelines 使用要点', '<ul class="usage-notes"><li>仅在内容确实超出时滚动，不为短内容强行保留空白高度。</li><li>避免多层同方向的滚动区域；局部区域需要限制滚动传递时，仍应保留清楚的离开路径。</li><li>可聚焦的滚动区域提供名称与焦点轮廓。表格与代码只在自身容器滚动，页面预留滚动条空间，避免布局左右跳动。</li></ul>'],
  ['api', 'API 参数参考', '<p>使用原生 CSS 溢出与滚动属性，项目全局样式负责滚动条配色。以下配置根据内容选用，不需要脚本初始化。</p>' + controlApi([
    ['overflow-x / overflow-y', 'visible / auto / scroll / hidden / clip', 'visible', '通常使用 auto，仅在对应方向超出时滚动'],
    ['max-height', 'none / CSS 长度', 'none', '限制纵向区域的高度，不强制撑开短内容'],
    ['overscroll-behavior', 'auto / contain / none', 'auto', 'contain 阻止边界滚动传递；none 同时抑制边界回弹'],
    ['tabindex', '整数', '浏览器默认', '需要键盘直接访问的区域显式设置 0，并提供名称；省略时是否可聚焦由浏览器决定'],
    ['scrollbar-size', 'CSS 长度', '6px', '项目 Token，控制 WebKit 滚动条宽高'],
    ['scrollbar-width', 'auto / thin / none', 'thin', '项目默认 thin；浏览器决定实际厚度，避免用 none 隐藏入口'],
    ['color-scrollbar / color-scrollbar-hover', '语义颜色 Token', '随亮暗主题', '项目 Token，控制滑块常规与 WebKit Hover 配色']
  ])]
]);

// 示例只补充全选与提示反馈；原生控件负责输入、选择、校验和提交。
function initControlDemos(root) {
  root.querySelectorAll('input[data-indeterminate]').forEach(input => { input.indeterminate = true; });
  root.querySelectorAll('[data-checkbox-group]').forEach(group => {
    const all = group.querySelector('[data-check-all]');
    const items = [...group.querySelectorAll('[data-check-item]')].filter(input => !input.disabled);
    const sync = () => {
      const count = items.filter(input => input.checked).length;
      all.checked = items.length > 0 && count === items.length;
      all.indeterminate = count > 0 && count < items.length;
    };
    all.addEventListener('change', () => {
      const checked = all.checked;
      items.forEach(input => {
        if (input.checked === checked) return;
        input.checked = checked;
        input.dispatchEvent(new Event('change', {bubbles: true}));
      });
      sync();
    });
    items.forEach(input => input.addEventListener('change', sync));
    group.closest('form')?.addEventListener('reset', () => setTimeout(sync, 0));
    sync();
  });
  root.querySelectorAll('[data-validate]').forEach(input => input.addEventListener('input', () => {
    const invalid = !input.validity.valid;
    input.setAttribute('aria-invalid', String(invalid));
    input.closest('.text-field').querySelector('[data-field-error]').hidden = !invalid;
  }));
  root.querySelectorAll('[data-radio-error]').forEach(group => group.addEventListener('change', () => {
    if (!group.querySelector('input:checked')) return;
    group.setAttribute('aria-invalid', 'false');
    group.querySelector('[data-field-error]').hidden = true;
  }));
}

const uiNotes = items => items?.length ? `<ul class="usage-notes">${items.map(item => `<li>${item}</li>`).join('')}</ul>` : '';
function componentPage(title, lead, sections, notes, apiIntro, rows) {
  return guide(title, lead, [...sections.map(([id, title, intro, markup, notes]) => [id, title, `${intro ? `<p>${intro}</p>` : ''}${markup ? example(markup) : ''}${uiNotes(notes)}`]), ['guidelines', 'Guidelines 使用要点', uiNotes(notes)], ['api', 'API 参数参考', `<p>${apiIntro}</p>${controlApi(rows)}`]]);
}
function projectCard(link = false) {
  const content = `${icon('grid_view')}<span class="card-copy"><strong>界面规范</strong><span>颜色、文字与常用控件的统一约定。</span></span>${link ? icon('chevron_right', 'card-arrow') : ''}`;
  return link ? `<a class="ui-card ui-card-link" href="#design-color">${content}</a>` : `<article class="ui-card">${content}</article>`;
}
articles.card = () => componentPage('Cards 卡片', '将相关信息组织为独立单元，帮助浏览、比较与进入详情。内容保持围绕同一主题。', [
  ['basic', 'Basic 信息卡片', '标题帮助识别内容，说明补充范围。没有跳转行为时，卡片保持普通内容语义。', projectCard()],
  ['linked-card', 'Navigation 可点击卡片', '整张卡片只有一个目的地时，使用链接覆盖卡片。示例进入颜色规范。', projectCard(true), ['Hover 使用中性背景，箭头复用侧导航图标，常显并垂直居中；焦点保留主题色轮廓，文字与图标保持各自颜色，不添加投影。']],
  ['actions', 'Actions 内容与操作', '标题与说明保持 2px 间距，文字组与操作区间隔 12px。多个操作各自独立，不将按钮嵌套在整卡链接中。', `<article class="ui-card card-column"><div class="card-copy"><strong class="card-title">组件文档</strong><p>查看写作约定，或继续浏览基础控件。</p></div><div class="component-actions"><a class="ui-button medium" href="#design-writing">内容表达</a><a class="ui-button medium secondary" href="#button">基础控件</a></div></article>`]
], ['同类卡片使用一致的信息顺序。内容较少时，不为了对齐高度补充空泛说明。','单一跳转使用链接，多项操作使用独立按钮；标题应能说明目的地。'], '卡片由原生 article 或 a 组成，使用 ui-card 类；内部按内容选择标题、说明与操作。', [
  ['variant','不设置 / ui-card-link','不设置','普通信息使用 article，可点击卡片使用 a 并添加 ui-card-link'],['layout','不设置 / card-column','不设置','默认横向，card-column 用于纵向内容与操作'],['href','目标 URL','未设置','仅链接卡片需要；保留浏览器新窗口与修饰键行为'],['aria-label','字符串','未设置','可见标题无法完整说明目的地时补充名称']
]);
function documentList(interactive = false) {
  return `<ul class="ui-list">${[['design-typography','文字规范','字体、字号与行高'],['design-color','颜色规范','色板与语义映射'],['design-motion','动效规范','时长、缓动与交互']].map(([route,title,description]) => `<li>${interactive ? `<a class="ui-list-row" href="#${route}">` : '<div class="ui-list-row">'}${icon(groups.flatMap(group => group.items).find(item => item[0] === route)[3])}<span class="list-copy"><strong>${title}</strong><span>${description}</span></span>${interactive ? icon('chevron_right', 'list-arrow') : ''}${interactive ? '</a>' : '</div>'}</li>`).join('\n')}</ul>`;
}
articles.list = () => componentPage('Lists 列表', '以统一结构呈现一组相关内容，适合连续浏览、比较与进入详情。这里介绍界面列表，文档排版见格式菜单中的列表。', [
  ['basic','Basic 内容列表','图标与文字垂直居中，图文间距与四周留白均为 16px；标题与说明间隔 2px，沿用卡片的文字层次。',documentList()],
  ['linked-list','Navigation 链接列表','需要进入详情时，让整行成为链接，右侧常显的侧导航同款箭头提示后续内容，并与整行垂直居中。',documentList(true),['Hover 使用中性背景，键盘焦点保留轮廓；链接保持原生跳转行为。']],
], ['使用 ul / li 表达并列内容；需要表达顺序时使用 ol。','行内已有多个操作时，分别提供按钮，不在整行链接中嵌套交互元素。','没有内容时说明当前状态与可采取的下一步，不保留空白列表框。'], 'ui-list 提供行分隔，ui-list-row 组织单行内容。列表本身不承担选择逻辑，需要选择时使用相应表单控件。', [
  ['href','目标 URL','未设置','行需要跳转时使用 a'],['aria-label','字符串','未设置','附近没有明确标题时，为列表说明共同用途']
]);
function menuDemo(id, variant = 'text', size = 'medium', popup = false) {
  const leading = name => variant === 'text' ? '' : icon(name);
  const branch = variant === 'submenu';
  return `<div class="${popup ? 'component-menu-demo' : 'menu-specimen'}">${popup ? `<div class="ui-select fit-content"><button class="select-trigger" type="button" data-menu-open="${id}" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}"><span>项目操作</span>${icon('chevron_right','select-chevron icon-chevron')}</button></div>` : ''}<div class="ui-menu ${popup ? '' : 'menu-inline '}${size}"${popup ? ` id="${id}" popover="manual" hidden` : ''} role="menu" aria-label="${branch ? '含子菜单' : variant === 'text' ? '纯文字' : '图标与文字'}操作">
    <button class="ui-menu-item" type="button" role="menuitem" tabindex="0" data-copy-text="界面规范">${leading('content_copy')}<span>复制名称</span></button>
    ${branch ? `<button class="ui-menu-item" type="button" role="menuitem" tabindex="-1" data-menu-open="${id}-child" data-menu-placement="right" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}-child">${leading('text_fields')}<span>查看规范</span>${icon('chevron_right','icon-chevron')}</button>` : `<a class="ui-menu-item" role="menuitem" tabindex="-1" href="#design-writing">${leading('text_fields')}<span>查看内容规范</span></a>`}
    <a class="ui-menu-item" role="menuitem" tabindex="-1" href="#card">${leading('crop_square')}<span>查看项目卡片</span></a>
    <button class="ui-menu-item" type="button" role="menuitem" tabindex="-1" data-ui-toast="项目链接已准备好">${leading('arrow_forward')}<span>分享项目</span></button>
    <button class="ui-menu-item" type="button" role="menuitem" tabindex="-1" disabled>${leading('layers')}<span>归档项目（暂不可用）</span></button>
  </div>${branch ? `<div class="ui-menu ${size}" id="${id}-child" role="menu" aria-label="规范分类" popover="manual" hidden><a class="ui-menu-item" role="menuitem" tabindex="-1" href="#design-writing">内容表达</a><a class="ui-menu-item" role="menuitem" tabindex="-1" href="#design-color">颜色规范</a></div>` : ''}</div>`;
}
articles.dropdown = () => componentPage('Menus 菜单', '将当前场景的操作集中呈现，帮助人们继续手边的任务。菜单执行操作；选择框填写并保留一个值，两者共用浮层外观与状态反馈。', [
  ['basic','Basic 基础示例','点击入口展开菜单，选择操作后收起；最后一项暂不可用。入口宽度随内容自适应，菜单使用默认中号。',menuDemo('menu-basic','icons','medium',true)],
  ['composition','Composition 基础组合','依次为纯文字、图标＋文字，以及含子菜单的组合。右箭头只出现在通往下一级的项目上；每组最后一项暂不可用，不添加分组分割线。',`<div class="menu-composition-grid">${menuDemo('menu-text')}${menuDemo('menu-icons','icons')}${menuDemo('menu-submenu','submenu')}</div>`],
  ['sizes','Sizes 尺寸','提供小号、中号与大号，组件默认中号，示例从小号开始。尺寸控制菜单项的字号与内边距；菜单宽度独立于入口，入口随内容自适应。',[['small','小号预览'],['medium','中号预览'],['large','大号预览']].map(([size,label])=>({id:'menu-size-'+size,label,selected:size==='small',html:menuDemo('menu-size-'+size,'icons',size)})),['小号：12px 字号，上下 4px、左右 8px 内边距。中号：12px 字号，上下 6px、左右 12px 内边距。大号：14px 字号，内边距与中号相同。']],
  ['height','Max Height 最大高度','示例宽度为 200px，最大高度为 360px；视口较小时进一步收缩，超出内容仅在菜单内部纵向滚动。',`<div class="menu-specimen"><div class="ui-menu menu-inline menu-scroll-demo" role="menu" aria-label="文档导航">${groups.slice(0,3).flatMap(group=>group.items).map(([route,zh,en,symbol],i)=>`<a class="ui-menu-item" role="menuitem" tabindex="${i===0?0:-1}" href="#${route}">${icon(symbol)}<span>${zh}</span></a>`).join('')}</div></div>`],
], ['图标帮助识别操作，右箭头表示下一级，对勾表示可切换设置；按含义选用，不为对齐而给所有项目添加装饰。','菜单保持简短；不可逆操作先说明后果，复杂输入放入对话框。'], '菜单项使用原生按钮或链接。浮层由 data-menu-open 关联，UIComponents.init() 管理展开、定位与焦点；外观复用共用设计 Token。', [
  ['size','small / medium / large','medium','设置在 ui-menu 容器上，统一控制菜单项尺寸'],['--component-menu-height','CSS 长度','360px','浮层最大高度，实际高度同时受视口剩余空间约束'],['data-menu-open','菜单 ID','未设置','与 aria-controls 指向同一浮层'],['data-menu-placement','right / 不设置','不设置','子菜单使用 right，空间不足时自动向左展开'],['aria-expanded','true / false','false','同步入口展开状态'],['role','menuitem / menuitemcheckbox','menuitem','普通操作或可勾选设置；可勾选项同时提供 aria-checked'],['disabled','布尔属性','未设置','保留暂不可用项目，键盘导航跳过']
]);
function dialogDemo(id = 'project-dialog', drawer = '') {
  return `<button class="ui-button medium secondary" type="button" data-overlay-open="${id}" aria-haspopup="dialog" aria-controls="${id}">${drawer ? '填写反馈信息' : '新建项目'}</button>
<dialog class="ui-dialog${drawer ? ` ui-drawer ${drawer}` : ''}" id="${id}" aria-labelledby="${id}-title" aria-describedby="${id}-description">
  <form class="overlay-content" novalidate data-overlay-form${drawer ? '' : ` data-overlay-output="${id}-result"`}>
    <header class="overlay-heading overlay-heading-closable"><div class="overlay-heading-copy"><h2 id="${id}-title">${drawer ? '问题反馈' : '新建项目'}</h2><p id="${id}-description">${drawer ? '填写姓名、邮箱与问题反馈，帮助我们了解你的情况。' : '给项目起一个清楚的名称，方便之后查找。'}</p></div><button class="icon-button overlay-close" type="button" data-overlay-close aria-label="${drawer ? '关闭抽屉' : '关闭对话框'}">${icon('close')}</button></header>
    <div class="overlay-body">${drawer ? textFieldDemo(id+'-name',{label:'姓名',name:'name',required:true,maxlength:40,placeholder:'请输入姓名'}) + textFieldDemo(id+'-email',{label:'邮箱',name:'email',required:true,maxlength:254,placeholder:'请输入邮箱地址'}) + textFieldDemo(id+'-feedback',{label:'问题反馈',name:'feedback',multiline:true,placeholder:'请描述你遇到的问题'}) : textFieldDemo(id+'-name',{label:'项目名称',name:'title',required:true,maxlength:40})}</div>
    <footer class="component-actions overlay-actions"><button class="ui-button medium secondary" type="button" data-overlay-close autofocus>取消</button><button class="ui-button medium" type="submit">${drawer ? '保存' : '创建'}</button></footer>
  </form>
</dialog>
${drawer ? '' : `<output class="component-caption" id="${id}-result" aria-live="polite"></output>`}`;
}
articles.dialog = () => componentPage('Dialogs 对话框', '在当前页面上聚焦一项需要确认或填写的任务。背景暂不可操作，完成或取消后回到原来的位置。', [
  ['basic','Basic 基础示例','标题说明任务，正文只保留完成任务所需的信息。正文复用标准 Input；示例输入名称后创建，也可以随时取消。标题为 16px，描述为 12px，两者间距 4px。各区域之间不设分割线；标题区内边距为 24px，正文仅保留左右 24px，操作区内边距为 24px。',dialogDemo()],
  ['behavior','Behavior 关闭与焦点','打开时将焦点放在取消按钮，避免误触主要操作。Tab 在对话框内移动，关闭后返回触发入口。','',['标题区默认显示关闭图标，可通过 data-close-button="false" 隐藏。关闭图标、取消、Escape 或点击遮罩均不保存输入；未填写时复用 Input 的错误描边与字段提示。','常规宽度 400px，窄屏保留边缘留白；内容过长时在对话框内滚动，不遮住操作。','使用弹窗阴影与无模糊的黑色遮罩，蒙层与弹窗同步开始、同步完成；入场和退场均为 300ms，减少动态效果时立即完成。']]
], ['一个对话框只处理一项任务，避免叠加另一个模态窗口。','主要操作写清结果，例如“创建”或“删除副本”。高风险操作使用危险按钮，并明确影响范围。','错误尽量放在对应字段附近，保留已填写内容，让人可以继续修正。'], '使用原生 dialog.showModal() 管理模态与焦点边界，UIComponents 负责动效和关闭后的焦点返回。标题必填，用于说明当前任务；说明可选，没有补充信息时省略说明元素及 aria-describedby。示例表单只更新本地反馈，不创建真实项目。', [
  ['data-close-button','true / false','true','设置在 dialog 上，控制标题区关闭图标'],['data-overlay-open','dialog ID','未设置','触发按钮指向对话框'],['data-overlay-close','布尔标记','未设置','设置在取消或关闭按钮上'],['aria-labelledby','标题元素 ID','必填','关联必填的可见标题，作为对话框名称'],['aria-describedby','说明元素 ID','不设置','说明可选；提供说明时关联对应元素，省略说明时不设置'],['autofocus','布尔属性','未设置','指定打开时的初始焦点'],['data-overlay-form','布尔标记','未设置','示例表单执行原生校验后关闭'],['data-overlay-output','output ID','未设置','接收示例提交结果，不代替业务保存逻辑']
]);
articles.drawer = () => componentPage('Sheets 抽屉', '从页面边缘展开补充内容或操作，适合详情、属性与较长表单。复用对话框的标题、字段、操作与关闭规则，以全高布局容纳更多内容。', [
  ['basic','Basic 右侧抽屉','默认从右侧展开，宽度 480px、高度铺满视口。标题 16px、说明 12px，两者间距 4px；各区域内边距为 24px，保留标题区与操作区的分割线。正文使用标准 Input 输入姓名与邮箱，问题反馈使用多行输入框；按钮间距为 12px。',dialogDemo('details-drawer','from-right')],
  ['width','Width 宽度','提供 400px 与 480px 两档，默认 480px。较短表单可用 400px；需要更多横向空间时，通过 --drawer-width 自定义，窄屏仍保留边缘留白。',`<div class="component-actions">${[['400','400px'],['480','480px'],['custom','自定义 560px']].map(([width,label]) => dialogDemo('drawer-width-'+width,'from-right').replace('填写反馈信息',label).replace('id="drawer-width-'+width+'"', 'id="drawer-width-'+width+'" '+(width==='custom'?'style="--drawer-width: 560px"':'data-width="'+width+'"'))).join('')}</div>`],
  ['behavior','Behavior 关闭与滚动','正文独立滚动，标题与操作区保持可见。抽屉高度固定，字段错误提示在正文内展开，不推动面板边界。','',['标题必填，说明可选；省略说明时同时省略说明元素和 aria-describedby，不保留空白间距。','右侧默认显示关闭图标，可通过 data-close-button="false" 隐藏。关闭图标、取消、Escape 或点击遮罩均不保存输入；关闭后焦点返回入口。Tab 在面板内部移动。','保存前校验必填项，错误描边和提示复用 Input 样式，填写后清除；再次打开时恢复示例初始值。','与网站侧导航共用动画配方：入场从所在侧按自身全宽滑入，退场滑回原侧，面板不淡入淡出；进退场均为 500ms、ease-in-out。黑色 70% 蒙层无模糊，与面板同步开始、同步完成；减少动态效果时立即完成。']]
], ['用抽屉补充当前任务，独立的新任务进入页面；避免叠加模态窗口。','长表单的主要操作保留在底部，按钮名称写清结果，例如“保存”。'], 'ui-drawer 基于 ui-dialog，复用模态、标准 Input、表单校验与焦点管理；方向由类名指定，动画由 Motion 的 drawer 模板统一管理。', [
  ['placement','from-right / from-left','from-right','方向可选；默认从右向左展开，from-left 从左向右展开，退场反向播放'],['data-width','400 / 480','480','选择预设宽度，省略时使用 480px'],['--drawer-width','CSS 长度','不设置','设置在抽屉上，自定义宽度并优先于预设；窄屏受可用宽度约束'],['data-close-button','true / false','true','设置在 dialog 上，控制标题区关闭图标'],['aria-labelledby','标题元素 ID','必填','关联必填的可见标题'],['aria-describedby','说明元素 ID','不设置','说明可选；提供说明时关联对应元素'],['data-overlay-open','dialog ID','未设置','触发按钮指向抽屉'],['data-overlay-close','布尔标记','未设置','设置在关闭或取消按钮上'],['autofocus','布尔属性','未设置','指定打开时初始焦点，示例为取消按钮'],['data-overlay-form','布尔标记','未设置','校验后关闭；示例不在外部入口旁显示保存提示']
]);
function tooltipDemo(id, placement = 'top') {
  return `<span class="tooltip-demo"><button class="icon-button" type="button" aria-label="复制项目名称" aria-describedby="${id}" data-tooltip="${id}" data-copy-text="界面规范">${icon('content_copy')}</button><span class="ui-tooltip" id="${id}" role="tooltip" popover="manual" data-placement="${placement}" hidden>复制项目名称</span></span>`;
}
articles.tooltip = () => componentPage('Tooltips 文字提示', '为图标或简短标签补充一句说明，帮助确认操作含义。提示保持简短，不承担完成任务所必需的信息。', [
  ['basic','Basic 基础示例','悬停或用键盘聚焦复制按钮查看提示，点击按钮复制项目名称。',tooltipDemo('copy-tooltip')],
  ['placement','Placement 位置','默认在上方，空间不足时自动换到另一侧；也可以指定优先从下方显示。',tooltipDemo('bottom-tooltip','bottom')],
  ['behavior','Behavior 显示与关闭','Hover 或键盘聚焦时立即显示，与触发元素的状态反馈同步开始。离开触发器与提示区域后收起，Escape 可立即关闭。','',['提示不抢焦点，也不放链接或按钮；鼠标移入提示时保持显示，避免阅读过程中消失。','字号 12px，上下 padding 6px、左右 12px；使用反色背景与文字。','入场与退场均引用 duration-fast（300ms），伴随 2px 位移与淡入淡出；上方展示时向上入场，下方展示时向下入场，退场方向相反。自动换边后按实际位置播放；减少动态效果时立即完成。']]
], ['触发按钮始终提供独立的可访问名称，不能只依靠 Tooltip 命名。','触屏无法可靠悬停，必要说明应直接显示；不要把错误原因仅放在提示里。'], 'data-tooltip 与 role="tooltip" 元素的 ID 关联，同时通过 aria-describedby 建立说明关系。', [
  ['data-tooltip','提示 ID','未设置','触发元素必填'],['aria-describedby','提示 ID','未设置','将提示作为补充说明关联到触发元素'],['data-placement','top / bottom','top','设置在提示上，表示优先显示方向'],['tooltip-delay','时长','0ms','默认无等待；设置在触发元素上，可按需调整悬停等待时间']
]);
articles['empty-state'] = () => guide('Empty State 空状态', '当页面暂时没有内容时，说明当前情境，并给出一个明确的下一步。插画辅助表达情绪，标题与说明负责传达信息。', [
  ['structure', 'Structure 组成结构', `<p>由插画、标题、说明与可选操作组成。下面用首次空白示例展示层次，其他场景沿用相同结构。</p>${example(`<div class="ui-empty-state" role="group" aria-labelledby="empty-demo-title" aria-describedby="empty-demo-description">
  ${Illustrations.frame('empty',{decorative:true})}
  <div class="empty-state-content"><div class="empty-state-copy"><h3 id="empty-demo-title">还没有文档</h3><p id="empty-demo-description">新建一份文档，记录你的第一个想法。</p></div>
  <button class="ui-button medium" type="button">新建文档</button></div>
</div>`)}<ul class="usage-notes"><li>插画：从 <a href="#design-illustrations">Illustrations 插画</a> 选择对应场景，随主题配色。</li><li>标题与说明：先说清当前状态，再解释原因或下一步。</li><li>操作：有明确下一步时提供一个主要入口；不需要操作时省略。</li></ul>`],
  ['guidelines', 'Guidelines 使用要点', `<ul class="usage-notes"><li>首次空白、筛选无结果与加载失败要分别说明，避免都写成“暂无数据”。</li><li>插画已有相邻说明时作为装饰，不重复播报；不要只靠插画表达状态。</li><li>保持居中与充足留白，使用所在内容区域的空间，不强制撑满视口。</li><li>此处仅展示组成结构；按钮的实际行为由使用页面接入。</li></ul>`]
]);

articles.toast = () => componentPage('Toast 轻提示', '用短暂、不中断任务的消息反馈操作结果。内容说明发生了什么，需要持续处理的问题应在页面中保留。', [
  ['basic','Basic 基础示例','点击按钮预览保存结果。消息默认从页面顶部出现，不改变当前焦点；使用面状状态图标，图标为 20px，字号为 14px，内边距上下 12px、左右 16px，图文间距为 8px；文字使用主要文字色。','<button class="ui-button medium secondary" type="button" data-ui-toast="更改已保存" data-toast-kind="success">显示保存结果</button>'],
  ['feedback','Feedback 反馈类型','成功反馈确认结果，普通消息补充信息；错误消息简短说明下一步。',`<div class="component-actions"><button class="ui-button medium secondary" type="button" data-ui-toast="更改已保存" data-toast-kind="success">成功</button><button class="ui-button medium secondary" type="button" data-ui-toast="已复制项目名称" data-toast-kind="info">消息</button><button class="ui-button medium secondary" type="button" data-ui-toast="未能保存更改，请重试" data-toast-kind="error">错误</button></div>`],
  ['options','Placement 位置','默认从顶部出现，也可切换到底部；不显示关闭按钮。',`<div class="component-actions"><button class="ui-button medium secondary" type="button" data-ui-toast="更改已保存" data-toast-kind="success" data-toast-placement="top">顶部提示</button><button class="ui-button medium secondary" type="button" data-ui-toast="更改已保存" data-toast-kind="success" data-toast-placement="bottom">底部提示</button></div>`],
  ['behavior','Behavior 停留与关闭','所有类型均在显示 2 秒后自动收起，鼠标悬停时暂停计时。','',['同一时间显示一条消息，新消息替换旧消息。','通过礼貌的状态播报传达消息，不自动移动焦点；消息与图标共同表达含义，不只依赖颜色。','进出沿用 300ms 浮层动效，减少动态效果时立即完成。']]
], ['文字围绕一个结果展开，避免长篇解释；字段错误应放回字段附近。','需要确认才能继续时使用对话框。重要信息也应在页面保留记录，不仅出现在短暂提示里。'], 'UIComponents.toast(message, {kind, placement}) 用于显示消息；按钮示例通过 data-ui-toast 与 data-toast-kind 触发。', [
  ['message / data-ui-toast','字符串','未设置','必填，说明操作结果或下一步'],['kind / data-toast-kind','info / success / error','info','控制语义图标及颜色'],['placement / data-toast-placement','top / bottom','top','控制顶部或底部出现，进退场均为 300ms'],['toast-duration','时长','2000ms','所有类型的显示时长，悬停时暂停']
]);
function progressDemo() {
  return `<div class="progress-demo" data-progress-demo>
  <div class="progress-group"><progress class="ui-progress" max="100" value="0" aria-label="文档准备进度"></progress><output data-progress-label>准备开始 · 0%</output></div>
  <span class="component-sr-only" data-progress-status role="status"></span>
  <div class="component-actions"><button class="ui-button medium" type="button" data-progress-start>成功演示</button><button class="ui-button medium secondary" type="button" data-progress-interrupt>中断演示</button><button class="ui-button medium secondary" type="button" data-progress-cancel disabled>取消</button></div>
</div>`;
}
articles.progress = () => componentPage('Loading 加载', '说明任务仍在进行，并在可测量时展示完成比例。让等待有明确的反馈，也保留必要的取消方式。', [
  ['indeterminate','Indeterminate 未知进度','无法估计完成量时，不显示虚构的百分比。用加载标记配合简短状态说明。','<div class="loading-message" role="status"><span class="spinner" aria-hidden="true"></span><span>正在准备文档…</span></div>'],
  ['determinate','Determinate 明确进度','能够计算完成量时使用进度条。成功演示递增至 100%，中断演示停在 40%；运行中可取消，结束后可重新演示。',progressDemo()],
  ['results','Results 完成与中断','完成后给出明确结果；任务中断时保留已知进度，并说明下一步。',`<div class="progress-examples"><div class="progress-group"><progress class="ui-progress is-success" max="100" value="100" aria-label="已完成，进度100%"></progress><output>已完成 · 100%</output></div><div class="progress-group"><progress class="ui-progress is-error" max="100" value="40" aria-label="中断，进度40%"></progress><output>中断 · 40%</output></div></div>`,['进度条使用主题色，完成与错误分别使用成功和危险语义色；文字同时说明结果。','加载圆环沿用现有 spinner；减少动态效果时停止旋转，保留状态文字。']]
], ['进度应来自实际完成量，不用固定动画假装真实进展；本页按钮仅用于演示。','长任务尽量提供取消方式。状态文字保持稳定，不为每一次细小变化触发重复播报。'], '明确进度使用原生 progress，加载标记使用 spinner。示例按钮只更新本地数值，实际任务应由业务进度更新 value。', [
  ['value / max','非负数 / 正数','未设置 / 1','原生 progress 属性；明确进度同时设置两者'],['status','不设置 / is-success / is-error','不设置','通过类名切换结果颜色，配合结果说明'],['aria-label','字符串','未设置','说明任务名称或已知结果'],['data-progress-demo','布尔标记','未设置','初始化本地演示，不用于真实任务进度']
]);
function breadcrumbDemo(compact = false) {
  return `<nav class="ui-breadcrumb" aria-label="面包屑"><ol><li><a href="#introduction">Form</a></li><li aria-hidden="true">${icon('chevron_right')}</li>${compact ? `<li><button class="breadcrumb-more" type="button" data-menu-open="breadcrumb-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="breadcrumb-menu" aria-label="显示上级页面">${icon('more_horiz')}</button><div class="ui-menu" id="breadcrumb-menu" role="menu" aria-label="上级页面" popover="manual" hidden><a class="ui-menu-item" role="menuitem" tabindex="-1" href="#button">基础控件</a></div></li>` : '<li><a href="#button">基础控件</a></li>'}<li aria-hidden="true">${icon('chevron_right')}</li><li><span aria-current="page">Select 选择框</span></li></ol></nav>`;
}
articles.breadcrumb = () => componentPage('Breadcrumb 面包屑', '展示当前内容在层级中的位置，并提供返回上级的入口。路径从整体到局部排列，帮助理解所在位置。', [
  ['basic','Basic 基础示例','上级页面使用链接，末项为当前内容，不重复提供指向自身的跳转。',breadcrumbDemo()],
  ['compact','Compact 收起中间层级','路径较长时，可将中间层级收进菜单，保留起点与当前项。点击展开后仍使用真实链接。',breadcrumbDemo(true),['分隔箭头使用项目本地 Google Material Symbols 图标，并对辅助技术隐藏。','窄屏允许路径换行，不让整页横向溢出；菜单沿用方向键与 Escape 行为。']]
], ['面包屑反映内容层级，不记录临时的浏览历史。','每项名称应与对应页面一致，避免把完整长标题塞进很窄的路径。'], '使用 nav、ol 与链接组织路径；当前项设置 aria-current="page"。收起层级时复用菜单组件。', [
  ['aria-label','字符串','未设置','为 nav 提供名称，例如“面包屑”'],['href','目标 URL','未设置','仅上级路径项使用'],['aria-current','page','未设置','仅当前项设置，同一路径保留一个'],['data-menu-open','菜单 ID','未设置','需要收起中间层级时使用']
]);
function navigationDemo(id = 'navigation-demo', showIcons = true) {
  return `<nav class="ui-navigation document-navigation-demo" aria-label="组件文档导航">${groups.filter(group=>['Controls 基础控件','Overlays 浮层'].includes(group.name)).map((group,index)=>`<div class="nav-group"><button class="group-title" type="button" data-nav-toggle="${id}-${index}" aria-controls="${id}-${index}" aria-expanded="true">${group.name}${icon('chevron_right','group-chevron nav-chevron')}</button><div class="group-items" id="${id}-${index}">${group.items.slice(0,3).map(([route,zh,en,symbol])=>`<a class="nav-link${route==='button'?' active':''}" href="#${route}"${route==='button'?' aria-current="page"':''}>${showIcons && symbol ? `<span class="nav-icon">${icon(symbol)}</span>` : ''}<span class="nav-label">${en} ${zh}</span></a>`).join('')}</div></div>`).join('')}</nav>`;
}
articles.sidebar = () => componentPage('Sidebar 侧导航', '以本文档的侧导航为基础：一级按用途分组，二级链接到具体页面。分组负责展开与收起，页面入口负责跳转，当前位置持续可见。', [
  ['structure','Structure 层级结构','一级为 Foundations、Controls、Overlays 等分组；二级为按钮、输入框等页面。二级可配置 Google 图标，也可仅显示文字。示例截取基础控件与浮层，点击分组标题可收起。',navigationDemo()],
  ['icons','Icons 二级图标','图标用于辅助识别页面，尺寸为 16px，与文字间距 8px。未配置图标时直接显示文字，不保留空的图标占位。',navigationDemo('navigation-text',false)],
  ['spacing','Spacing 间距与布局','本文档侧栏固定宽度 280px，导航区域左右留白 24px，顶部与底部留白 20px；内容过长时仅导航区域纵向滚动。','',['一级分组之间、分组标题与二级列表之间 gap 均为 4px；二级条目之间 gap 为 2px。','一级、二级字号均为 12px，常规字重 400。每项上下 padding 为 6px；一级左右不额外留白，二级左右 padding 为 12px。','分组箭头使用 16px 图标，展开时朝下，收起时朝右；旋转为 300ms。侧栏无投影，圆角与配色引用共用 Token。']],
  ['behavior','Behavior 收起与选中','一级分组可独立展开或收起，选中页面所在的分组会自动展开。二级选中使用背景标记，字重保持不变。','',['通过 aria-expanded 与 aria-controls 关联分组；二级链接用 aria-current="page" 标记当前页，保留原生链接与浏览器历史。','Hover 使用中性背景，暗色选中使用同款背景；选中文字与图标使用主要文字色。Tab 移动焦点，Enter 激活。','视口宽度不超过 768px 时切换为导航抽屉；入口打开、遮罩或 Escape 关闭，选择页面后收起，导航结构保持一致。']]
], ['一级名称说明共同用途，二级名称与页面标题保持一致。','分组标题只切换展开状态，不同时承担页面跳转；图标保持同一套风格。'], '本文档通过 groups 生成一级分组与二级链接；二级条目按 [route, 中文名, 英文名, 图标名] 配置，图标名可省略。示例复用实际导航的结构与样式。', [
  ['groups[].name','字符串','必填','一级分组名称'],['groups[].items','页面条目数组','必填','定义二级页面、名称与可选图标'],['items[][3]','Google 图标名','不设置','二级前置图标，省略时仅显示文字'],['aria-expanded / aria-controls','true 或 false / 区域 ID','false / 必填','同步一级分组状态并关联二级列表'],['aria-current','page','不设置','标记当前二级页面'],['href','页面 URL','必填','二级链接目的地'],['data-nav-toggle','分组区域 ID','不设置','示例用来切换分组；与实际侧栏共用300ms高度过渡']
]);
articles.search = () => componentPage('Search 搜索', '通过名称或正文查找文档，帮助快速抵达需要的内容。搜索结果保留页面名称与相关片段，便于判断是否相关。', [
  ['basic','Basic 全站搜索','顶部搜索入口覆盖全部文档正文。使用按钮或 ⌘K / Ctrl+K 打开，输入关键词后选择结果进入对应页面。','<button class="ui-button medium secondary" type="button" data-open-site-search>'+icon('search')+'打开全站搜索</button>'],
  ['behavior','Behavior 输入与结果','没有结果时保留关键词并提示换个说法，不自动跳转页面。输入与结果展示沿用本文档的全站搜索。','',['中文输入法组字期间不触发跳转，确认文字后再匹配。','Enter 打开首条结果；Tab 按自然顺序访问结果，Escape 关闭并返回搜索入口。','结果使用真实链接，保留浏览器历史。搜索覆盖全部页面正文，不只匹配侧导航名称。']]
], ['占位文字说明搜索范围，结果名称与目标页面保持一致。','重要内容应可通过导航到达，搜索作为补充入口。'], '全站搜索复用 Header 的搜索对话框；示例按钮通过 data-open-site-search 打开，无需单独配置页内搜索。', [
  ['data-open-site-search','布尔标记','不设置','按钮打开全站搜索对话框'],['aria-label','字符串','搜索','为图标入口提供可访问名称']
]);

const componentDescriptions = {
  "input": "用于输入和编辑文字；单行适合简短信息，多行适合描述与较长内容。",
  "select": "从一组已知选项中选择一个值，适合选项较多或需要节省空间的场景。",
  "checkbox": "用于选择一项或多项独立选项，各项可以分别勾选或取消。",
  "radio": "用于在一组互斥选项中选择一个值，适合需要同时展示各选项的场景。",
  "switch": "用于开启或关闭一项设置，适合切换后立即生效的操作。",
  "design-scrollbars": "在内容超出可见区域时提供滚动入口，帮助浏览和定位隐藏内容。",
  "card": "将相关内容与操作组织为独立单元，适合概览、浏览和进入详情。",
  "list": "按统一结构展示一组相关条目，便于连续浏览、比较与选择。",
  "dropdown": "集中展示当前场景下可用的操作或选项，由触发入口按需展开。",
  "dialog": "在当前页面上聚焦一项任务，适合需要确认或补充信息的操作。",
  "drawer": "从页面边缘展开补充内容或操作，适合保留当前页面上下文的任务。",
  "tooltip": "为图标或简短标签补充说明，适合无需持续展示的辅助信息。",
  "toast": "以短暂提示反馈操作结果，适合无需中断当前任务的信息。",
  "progress": "展示任务的进行状态，帮助用户判断操作是否仍在处理。",
  "breadcrumb": "展示当前页面在层级中的位置，并提供返回上级页面的入口。",
  "sidebar": "持续展示主要页面入口与分组，适合需要频繁切换内容的界面。",
  "search": "通过关键词查找内容，适合已知目标或需要快速定位的场景。"
};
// 未实现页面仅显示标题区，正文按实际需求逐项补充。
for (const group of groups) {
  for (const [id, zh, en] of group.items) {
    if (!articles[id]) articles[id] = () => `<div class="content-heading"><h1>${escapeHtml(en)} ${escapeHtml(zh)}</h1><p class="lead">${escapeHtml(componentDescriptions[id] || '')}</p></div>`;
  }
}

const documentScroller = document.querySelector('.document-scroll');
const navigation=document.querySelector('#navigation');
navigation.innerHTML=groups.map((g,index)=>`<div class="nav-group"><button class="group-title" type="button" aria-expanded="false" aria-controls="nav-group-${index}">${g.name}${icon('chevron_right','group-chevron nav-chevron')}</button><div class="group-items" hidden id="nav-group-${index}">${g.items.map(i=>`<a class="nav-link" href="#${i[0]}" data-id="${i[0]}">${i[3] ? `<span class="nav-icon" aria-hidden="true">${icon(i[3])}</span>` : ''}<span class="nav-label">${i[2]} ${i[1]}</span></a>`).join('')}</div></div>`).join('');
function setGroupExpanded(button,expanded){button.setAttribute('aria-expanded',String(expanded));Motion.expand(document.getElementById(button.getAttribute('aria-controls')),expanded);}
navigation.addEventListener('click',event=>{const button=event.target.closest('.group-title');if(button)setGroupExpanded(button,button.getAttribute('aria-expanded')!=='true');});
// 从搜索、页面链接或浏览器历史切换页面时，展开当前条目所属分类。
function revealActiveGroup(){const active=navigation.querySelector('.nav-link.active');if(active)setGroupExpanded(active.closest('.nav-group').querySelector('.group-title'),true);}
let current;
function animatePageEntry() {
  Motion.play(document.querySelector('.document-layout'), 'page');
}
function render(){const id=location.hash.slice(1)||'introduction';const item=all.find(i=>i.id===id);if(!item)return;if(current===id)return;current=id;UIComponents.cleanup();SelectControl.close(false, true);document.title=`${item.en} ${item.zh} · Form`;document.querySelector('#crumb-group').textContent=item.group;document.querySelector('#crumb-title').textContent=`${item.en} ${item.zh}`;document.querySelectorAll('.nav-link, .sidebar-footer a').forEach(a=>{const active=(a.dataset.id || a.getAttribute('href').slice(1))===id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.querySelector('#content').innerHTML=articles[id]?articles[id]():`<h1>${item.en} <span>${item.zh}</span></h1><div class="empty-space"></div>`;document.querySelector('#content').insertAdjacentHTML('beforeend',documentFooter());document.querySelectorAll('#content h1, #content h2, #content h3').forEach(heading => {
  // 按用途应用视觉样式，不覆盖示例中显式指定的样式。
  if (!heading.matches('.text-page-title, .text-section-title, .text-subsection-title, .text-label, .text-body, .text-caption')) {
    heading.classList.add({H1:'text-page-title',H2:'text-section-title',H3:'text-subsection-title'}[heading.tagName]);
  }
  const description = heading.nextElementSibling;
  if (description?.tagName !== 'P' || heading.parentElement.matches('section') || heading.closest('.overlay-heading') || heading.parentElement.classList.contains('content-heading')) return;
  const group = document.createElement('div');
  group.className = 'content-heading';
  heading.before(group);
  group.append(heading, description);
});Illustrations.init(document.querySelector("#content"));initControlDemos(document.querySelector("#content"));SelectControl.init(document.querySelector("#content"));UIComponents.init(document.querySelector("#content"));updateTokenValues();const headings = [...document.querySelectorAll('main section > h2, main section > .content-heading > h2')];
// 目录直接读取正文标题，新增章节只需维护正文。
document.querySelector('#toc').innerHTML = headings.length
  ? '<ul class="toc-list">' + headings.map((heading,index) => {
      const key = heading.closest('section').id;
      return `<li><a href="#${key}" data-section="${key}" class="${index===0?'active':''}"><span>${heading.textContent}</span></a></li>`;
    }).join('') + '</ul>'
  : '';
setSidebarOpen(false);revealActiveGroup();documentScroller.scrollTo({top:0,left:0,behavior:'instant'});if(articles[id])scheduleToc();animatePageEntry();}
function updateToc() {
  const sections = [...document.querySelectorAll('main section')];
  if (!sections.length) return;
  const offset = documentScroller.getBoundingClientRect().top + (parseFloat(getComputedStyle(documentScroller).scrollPaddingTop) || 0);
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset + 1) active = section;
  }
  if (documentScroller.scrollTop > 0 && documentScroller.clientHeight + documentScroller.scrollTop >= documentScroller.scrollHeight - 2) active = sections.at(-1);
  document.querySelectorAll('.toc a').forEach(link => {
    const selected = link.dataset.section === active.id;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const link = document.querySelector('.toc a.active');
  const list = document.querySelector('.toc-list');
  if (!link || !list || !list.getClientRects().length) return;
  const label = link.querySelector('span');
  const rect = label.getBoundingClientRect();
  list.style.setProperty('--toc-top', `${rect.top - list.getBoundingClientRect().top}px`);
  list.style.setProperty('--toc-height', `${rect.height}px`);
}
let tocFrame;
function scheduleToc() { cancelAnimationFrame(tocFrame); tocFrame = requestAnimationFrame(updateToc); }
documentScroller.addEventListener('scroll', scheduleToc, {passive:true});
window.addEventListener('resize', scheduleToc);
document.fonts.ready.then(scheduleToc);
window.addEventListener('hashchange',render);
window.addEventListener('hashchange',()=>{if(all.some(item=>item.id===location.hash.slice(1)))revealActiveGroup();});
render();
function notify(text){UIComponents.toast(text);}
async function copy(text){try{await navigator.clipboard.writeText(text);notify('已复制到剪贴板')}catch{notify('当前浏览器无法复制，请手动选择内容')}}
function selectExampleTab(tab) {
  if (tab.classList.contains('active')) return;
  const card = tab.closest('.example');
  card.querySelectorAll('.example-toolbar > .tab').forEach(item => item.classList.toggle('active', item === tab));
  card.querySelector('.preview').hidden = tab.dataset.tab !== 'preview';
  card.querySelector('.code-panel').hidden = tab.dataset.tab !== 'code';
}
function selectDemoTab(tab) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  const demo = tab.closest('.tab-demo');
  if (demo.classList.contains('example') && tab.getAttribute('aria-controls')?.endsWith('-panel')) {
    const current = [...demo.children].find(panel => panel.matches('.preview') && !panel.hidden) || document.getElementById(demo.dataset.lastPreview || '');
    if (current) demo.dataset.lastPreview = current.id;
    const next = document.getElementById(tab.getAttribute('aria-controls'));
    const source = current?.querySelector('input, textarea, select');
    const target = next?.querySelector('input, textarea, select');
    if (source && target && source.tagName === target.tagName) {
      target.value = source.value;
      target.dispatchEvent(new Event(target.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true}));
    }
  }

  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  if (panel?.matches('.preview')) demo.dataset.lastPreview = panel.id;
  [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')].forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    demo.querySelector('#' + item.getAttribute('aria-controls')).hidden = !selected;
  });
}
document.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.isPrimary === false || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const tab = event.target.closest('.tab-demo [role="tab"]');
  if (tab) selectDemoTab(tab);
});
document.addEventListener('click', event => {
  const tab = event.target.closest('.tab-demo [role="tab"]');
  if (tab) selectDemoTab(tab);
});
document.addEventListener('keydown', event => {
  const tab = event.target.closest('.tab-demo [role="tab"]');
  if (!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  selectDemoTab(tabs[index]);
  tabs[index].focus();
});
// 按下即切换选中项，让旧选中背景立即开始退场；click 保留键盘及辅助技术支持。
document.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.isPrimary === false || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('.nav-link, .sidebar-footer a');
  if (link) {
    // 触屏与触控笔等待 click 确认激活，避免滚动起手触发页面跳转。
    if (event.pointerType !== 'mouse') return;
    const href = link.getAttribute('href');
    if (!href?.startsWith('#') || !all.some(item => item.id === href.slice(1))) return;
    location.hash = href;
    // hashchange 异步派发；立即渲染，使旧项在按下当帧就取消选中。
    render();
    return;
  }
  const tab = event.target.closest('[data-tab], [data-palette]');
  if (!tab || tab.disabled) return;
  if (tab.matches('[data-palette]')) selectPalette(tab);
  else selectExampleTab(tab);
});
document.addEventListener('click',e=>{const tab=e.target.closest('[data-tab]');if(tab)selectExampleTab(tab);const cp=e.target.closest('.copy-code');if(cp)copy(cp.closest('.example').querySelector(':scope > .code-panel > code').textContent);const section=e.target.closest('[data-section]');if(section){e.preventDefault();document.getElementById(section.dataset.section).scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}});
const dialog = document.querySelector('#search-dialog'), input = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
function highlightSearch(text, query) {
  const lower = text.toLowerCase();
  let result = '', offset = 0, index;
  while ((index = lower.indexOf(query, offset)) !== -1) {
    result += escapeHtml(text.slice(offset, index)) + '<mark>' + escapeHtml(text.slice(index, index + query.length)) + '</mark>';
    offset = index + query.length;
  }
  return result + escapeHtml(text.slice(offset));
}
let searchIndex = [];
function buildSearchIndex() {
  searchIndex = all.flatMap(item => {
    const template = document.createElement('template');
    template.innerHTML = articles[item.id]?.() || '';
    template.content.querySelectorAll('script, style, button, svg').forEach(node => node.remove());
    const title = item.en + ' ' + item.zh;
    const entries = [{item, text: title}];
    const seen = new Set([title]);
    // Index paragraphs, list items, table rows and code blocks separately so one page can yield multiple matches.
    template.content.querySelectorAll('h2, h3, p, li, tr, pre, blockquote, .text-demo').forEach(node => {
      if (node.querySelector('p, li, tr, pre, blockquote')) return;
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (text && !seen.has(text)) { seen.add(text); entries.push({item, text}); }
    });
    // Include any remaining prose or examples that do not use the standard block elements.
    const fullText = template.content.textContent.replace(/\s+/g, ' ').trim();
    return {item, entries, fullText};
  });
}
function searchExcerpt(text, query) {
  const index = text.toLowerCase().indexOf(query);
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, Math.max(start + 140, index + query.length + 40));
  return (start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}
function search() {
  const query = input.value.trim().toLowerCase();
  const matches = query ? searchIndex.flatMap(page => {
    const entries = page.entries.filter(entry => entry.text.toLowerCase().includes(query));
    if (!entries.length && page.fullText.toLowerCase().includes(query)) return [{item: page.item, text: page.fullText}];
    return entries;
  }) : [];
  searchResults.hidden = !query;
  searchResults.innerHTML = !query ? '' : matches.length
    ? matches.map(({item, text}) => `<a class="search-result" href="#${item.id}">${icon(item.icon)}<span class="search-result-copy"><span class="search-result-path">${escapeHtml(item.group)}${icon('chevron_right')}<span>${escapeHtml(item.en)} ${escapeHtml(item.zh)}</span></span><span class="search-result-title">${highlightSearch(searchExcerpt(text, query), query)}</span></span></a>`).join('')
    : '<p class="search-empty">没有找到相关内容</p>';
}
function openSearch() { input.value = ''; buildSearchIndex(); search(); document.documentElement.classList.add('search-open'); dialog.showModal(); input.focus({preventScroll:true}); }
let searchResultOpened = false;
dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('search-open');
  if (searchResultOpened) {
    const content = document.querySelector('#content');
    content.setAttribute('tabindex', '-1');
    content.focus({preventScroll:true});
    searchResultOpened = false;
  }
});
document.querySelector('#open-search').onclick = openSearch;
let searchComposing = false;
input.addEventListener('compositionstart', () => {
  searchComposing = true;
  searchResults.hidden = true;
  searchResults.innerHTML = '';
});
input.addEventListener('compositionend', () => {
  searchComposing = false;
  search();
});
input.oninput = event => {
  if (!searchComposing && !event.isComposing) search();
};
input.onkeydown = event => {
  if (event.key === 'Enter' && !searchComposing && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault();
    searchResults.querySelector('a')?.click();
  }
};
searchResults.onclick = event => { if (event.target.closest('a')) { searchResultOpened = true; dialog.close(); } };
dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault();
    if (dialog.open) dialog.close(); else openSearch();
  }
});
function updateThemeButton() {
  const dark = document.body.classList.contains('dark');
  const button = document.querySelector('#theme-toggle');
  button.setAttribute('aria-label', dark ? '切换亮色模式' : '切换深色模式');
  button.setAttribute('aria-pressed', String(dark));
}
const accentThemes = paletteGroups.map(([name, label]) => ({
  id: name === 'form' ? 'neutral' : name === 'neutral' ? 'palette-neutral' : name,
  palette: name,
  label: `${name[0].toUpperCase() + name.slice(1)} ${label}`
}));
const accentPicker = document.querySelector('.accent-picker');
const accentMenu = document.querySelector('#accent-menu');
const accentToggle = document.querySelector('#accent-toggle');
accentMenu.innerHTML = accentThemes.map(theme => `<button type="button" class="accent-option" role="menuitemradio" aria-checked="false" tabindex="-1" data-accent-option="${theme.id}"><span class="palette-dot" aria-hidden="true" style="background:var(--palette-${theme.palette}-500)"></span><span class="accent-option-label">${theme.label}</span>${icon('check', 'accent-current')}</button>`).join('');
function updateAccentButton() {
  const currentTheme = accentThemes.find(theme => theme.id === document.body.dataset.accent) || accentThemes[0];
  accentToggle.setAttribute('aria-label', '选择配色主题，当前：' + currentTheme.label);
  accentToggle.title = '选择配色主题，当前：' + currentTheme.label;
  accentMenu.querySelectorAll('[data-accent-option]').forEach(option => {
    option.setAttribute('aria-checked', String(option.dataset.accentOption === currentTheme.id));
  });
}
const radiusPresets = [
  { id: 'small', label: 'Small 小圆角', value: '2px' },
  { id: 'default', label: 'Default 默认', value: '4px' },
  { id: 'soft', label: 'Soft 柔和', value: '6px' },
  { id: 'pill', label: 'Pill 胶囊', value: '24px' }
];
const radiusPicker = document.querySelector('.radius-picker');
const radiusMenu = document.querySelector('#radius-menu');
const radiusToggle = document.querySelector('#radius-toggle');
radiusMenu.innerHTML = radiusPresets.map(preset => `<button type="button" class="accent-option" role="menuitemradio" aria-checked="false" tabindex="-1" data-radius-option="${preset.id}"><span class="radius-option-preview" aria-hidden="true" style="border-radius:var(--radius-preview-${preset.id})"></span><span class="accent-option-label">${preset.label}（${preset.value}）</span>${icon('check', 'accent-current')}</button>`).join('');
function updateRadiusButton() {
  const currentPreset = radiusPresets.find(preset => preset.id === document.documentElement.dataset.radius) || radiusPresets[1];
  radiusToggle.setAttribute('aria-label', '选择圆角，当前：' + currentPreset.label);
  radiusToggle.title = '选择圆角，当前：' + currentPreset.label + '（' + currentPreset.value + '）';
  radiusMenu.querySelectorAll('[data-radius-option]').forEach(option => {
    option.setAttribute('aria-checked', String(option.dataset.radiusOption === currentPreset.id));
  });
}
// 顶栏配置菜单共用键盘、外部关闭、焦点恢复与互斥展开逻辑。
const headerMenuClosers = [];
function bindHeaderMenu(picker, toggle, menu, selector, select) {
  function positionMenu() {
    const rect = toggle.getBoundingClientRect(), style = getComputedStyle(menu);
    const gap = parseFloat(style.getPropertyValue('--popover-gap'));
    const edge = parseFloat(style.getPropertyValue('--space-12'));
    menu.style.top = rect.bottom + gap + 'px';
    const header = picker.closest('.main-header'), bounds = header.getBoundingClientRect(), headerStyle = getComputedStyle(header);
    const left = bounds.left + parseFloat(headerStyle.paddingLeft);
    const right = bounds.right - parseFloat(headerStyle.paddingRight);
    menu.style.left = Math.max(left, Math.min(rect.left, right - menu.offsetWidth)) + 'px';
    menu.style.right = 'auto';
    menu.style.maxHeight = '';
    menu.style.maxHeight = Math.max(0, Math.min(parseFloat(getComputedStyle(menu).maxHeight), innerHeight - rect.bottom - gap - edge)) + 'px';
  }
  window.addEventListener('resize', () => { if (toggle.getAttribute('aria-expanded') === 'true') positionMenu(); });
  function setOpen(open, restoreFocus = false) {
    if (open === (toggle.getAttribute('aria-expanded') === 'true')) return;
    if (open) headerMenuClosers.forEach(close => close(false));
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && (restoreFocus || menu.contains(document.activeElement))) toggle.focus();
    Motion.setVisible(menu, open, 'popover');
    if (open) {
      positionMenu();
      (menu.querySelector('[aria-checked="true"]') || menu.querySelector(selector))?.focus({preventScroll: true});
    }
  }
  headerMenuClosers.push(setOpen);
  toggle.onclick = () => setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  toggle.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    setOpen(true);
    if (event.key === 'ArrowUp') menu.querySelector(selector + ':last-child')?.focus();
  });
  menu.addEventListener('click', event => {
    const option = event.target.closest(selector);
    if (!option) return;
    select(option);
    setOpen(false, true);
  });
  menu.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const options = [...menu.querySelectorAll(selector)];
    const index = options.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options[next].focus();
  });
  picker.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || menu.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !picker.contains(event.target)) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (!menu.hidden && !picker.contains(event.target)) setOpen(false);
  });
  return setOpen;
}
try {
  if (localStorage.getItem('form-theme') === 'dark') document.body.classList.add('dark');
  const savedAccent = localStorage.getItem('form-accent');
  document.body.dataset.accent = accentThemes.some(theme => theme.id === savedAccent) ? savedAccent : 'neutral';
} catch { document.body.dataset.accent = 'neutral'; }
try {
  const storedRadius = localStorage.getItem('form-radius');
  const savedRadius = storedRadius === 'square' ? 'small' : storedRadius;
  document.documentElement.dataset.radius = radiusPresets.some(preset => preset.id === savedRadius) ? savedRadius : 'default';
} catch { document.documentElement.dataset.radius = 'default'; }
updateTokenValues();
updateThemeButton();
updateAccentButton();
updateRadiusButton();
let themeTransitionFrame;
function refreshTheme(change) {
  cancelAnimationFrame(themeTransitionFrame);
  document.body.classList.add('theme-switching');
  change();
  updateTokenValues();
  updateThemeButton();
  updateAccentButton();
  updateRadiusButton();
  themeTransitionFrame = requestAnimationFrame(() => {
    themeTransitionFrame = requestAnimationFrame(() => document.body.classList.remove('theme-switching'));
  });
}
document.querySelector('#theme-toggle').onclick = () => {
  refreshTheme(() => document.body.classList.toggle('dark'));
  try { localStorage.setItem('form-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch {}
};
bindHeaderMenu(accentPicker, accentToggle, accentMenu, '[data-accent-option]', option => {
  const id = option.dataset.accentOption;
  if (!accentThemes.some(theme => theme.id === id) || document.body.dataset.accent === id) return;
  refreshTheme(() => { document.body.dataset.accent = id; });
  try { localStorage.setItem('form-accent', id); } catch {}
});
bindHeaderMenu(radiusPicker, radiusToggle, radiusMenu, '[data-radius-option]', option => {
  const id = option.dataset.radiusOption;
  if (!radiusPresets.some(preset => preset.id === id) || document.documentElement.dataset.radius === id) return;
  refreshTheme(() => { document.documentElement.dataset.radius = id; });
  try { localStorage.setItem('form-radius', id); } catch {}
});
function setSidebarOpen(open, restoreFocus = false) {
  const sidebar = document.querySelector('#sidebar');
  const menu = document.querySelector('#mobile-menu');
  const narrow = window.matchMedia('(max-width:768px)').matches;
  const expanded = narrow && open;
  sidebar.classList.toggle('open', expanded);
  sidebar.inert = narrow && !expanded;
  const backdrop = document.querySelector('#sidebar-backdrop');
  if (!narrow) { backdrop.getAnimations().forEach(animation => animation.cancel()); backdrop.hidden = true; }
  else if (expanded || !backdrop.hidden) Motion.setVisible(backdrop, expanded, 'sidebarBackdrop');
  document.body.classList.toggle('sidebar-open', expanded);
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? '关闭导航' : '展开导航');
  if (restoreFocus && narrow) menu.focus();
}
document.querySelector('#mobile-menu').onclick = () => {
  setSidebarOpen(!document.querySelector('#sidebar').classList.contains('open'));
};
window.matchMedia('(max-width:768px)').addEventListener('change', () => setSidebarOpen(false));
document.addEventListener('click', event => {
  const sidebar = document.querySelector('#sidebar');
  if (!sidebar.classList.contains('open')) return;
  if (event.target.closest('#mobile-menu')) return;
  if (!sidebar.contains(event.target) || event.target.closest('.nav-link, .sidebar-footer a')) setSidebarOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector('#sidebar').classList.contains('open')) setSidebarOpen(false, true);
});
