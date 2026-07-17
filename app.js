  const state = {
  fileName: "",
  rawText: "",
  draftUploadItems: [],
  uploadItems: [],
  uploadBatchSaved: false,
  uploadAnalysisCompleted: false,
  analysis: null,
  activeTopic: 0,
  uploadLocked: false,
  allDocuments: [],
  documents: [],
  materialSources: [],
  materialTypes: [],
  topicSkills: [],
  articleSkills: [],
  articleSkillNotice: { message: "", tone: "info" },
  skillNotice: { message: "", tone: "info" },
  skillRefreshState: { docId: "", percent: 0, message: "" },
  skillBatchRefresh: {
    active: false,
    background: false,
    completed: false,
    modalOpen: false,
    skillTypeId: "",
    skillVersion: "",
    selectedIds: [],
    progressByDoc: {},
    logs: [],
  },
  topicSearch: "",
  topicSourceFilter: "",
  topicTypeFilter: "",
  topicOwnerFilter: "",
  topicDocFilter: "",
  topicFavoriteOnly: false,
  topicPage: 1,
  topicPageSize: 20,
  topicArticleIdeas: {},
  generatedArticles: [],
  generatedArticleSearch: "",
  activeGeneratedArticleId: "",
  generatedArticleEditingId: "",
  articleGeneration: {
    active: false,
    background: false,
    completed: false,
    mode: "",
    topicRowId: "",
    articleId: "",
    percent: 0,
    title: "",
    message: "",
    logs: [],
    abortController: null,
  },
  sidebarCollapsed: false,
  activeTopicRef: null,
  activeTopicPane: "analysis",
  mindMapSelectedNodeId: "",
  mindMapCollapsedNodeIds: [],
  mindMapZoom: 1,
  mindMapFullscreen: false,
  activeOriginalKeyword: "",
  activeMaterialPane: "source",
  materialSearchComposing: false,
  materialListSearch: "",
  materialListSourceFilter: "",
  materialListTypeFilter: "",
  materialListOwnerFilter: "",
  materialFavoriteOnly: false,
  activeMaterialDocId: "",
  activeMaterialTopicIndex: 0,
  activeMaterialSkillVersion: "",
  users: [],
  docCategories: [],
  currentUser: null,
  currentDocId: "",
  activeTag: "",
  activeDocCategory: "",
  activeOwner: "all",
  librarySearch: "",
  libraryTagSearch: "",
  drillStack: [],
  categoryTransferSource: "",
  categoryTransferTarget: "",
  categoryTransferScope: "all",
  categoryAdminNotice: { message: "", tone: "info" },
  lastViewedDocId: "",
  materialConfigNotice: { message: "", tone: "info" },
  activeSkillMaterialTypeId: "type-executive-view",
  recycleUserFilter: "",
  recycleExpandedDocIds: [],
  recyclePreview: { type: "", docId: "", topicIndex: 0 },
  fontSettings: { bodySize: "15px", buttonSize: "14px", titleSize: "24px" },
  deepseekTestSignature: "",
  analysisLogs: [],
  isAnalyzing: false,
  allowAnalysisBackground: false,
  analysisAbortController: null,
};

const DB_NAME = "wistalk-learning-db";
const LEGACY_DB_NAME = "ceo-speech-learning-db";
const DB_VERSION = 6;
const DOC_STORE = "documents";
const USER_STORE = "users";
const EVENT_STORE = "events";
const CATEGORY_STORE = "docCategories";
const PENDING_UPLOAD_STORE = "pendingUploads";
const GENERATED_ARTICLE_STORE = "generatedArticles";
const MATERIAL_SOURCES_KEY = "wistalk-material-sources";
const MATERIAL_TYPES_KEY = "wistalk-material-types";
const ANALYSIS_COMPLETED_REDIRECT_KEY = "wistalk-analysis-completed-redirect";
const ANALYSIS_RUNNING_KEY = "wistalk-analysis-running";
const SYSTEM_VERSION_STATE_KEY = "wistalk-system-version-state";
const LEGACY_SYSTEM_VERSION_STATE_KEY = "talktoceo-system-version-state";
const MAX_UPLOAD_FILES = 10;
const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024;
const SYSTEM_VERSIONS = [
  { version: "v1.8.52", date: "2026-06-08", updatedAt: "2026-06-08T00:00:00+08:00", title: "SKILL 保存防重复", changes: ["修复从页面弹出的 SKILL 编辑窗口中，确认弹窗被编辑窗口遮挡的问题。", "SKILL 保存按钮会同时校验当前打开版本和当前最新版本，内容没有变化时不能保存成新版本。", "保存 SKILL 过程中按钮会临时锁定，避免连续点击生成重复版本。"] },
  { version: "v1.8.51", date: "2026-06-07", updatedAt: "2026-06-07T21:15:00+08:00", title: "生成文章阅读样式优化", changes: ["生成文章页的文章 SKILL 标签改为更小字号、轻字重和浅色底。", "生成文章正文去掉“正文内容”标签，减少阅读干扰。", "文章正文标题改为左对齐，并支持 h2/h3/h4 多级标题层次。"] },
  { version: "v1.8.50", date: "2026-06-07", updatedAt: "2026-06-07T21:05:00+08:00", title: "列表宽度与默认用户筛选优化", changes: ["缩小左侧导航与内容列表之间的留白，让页面横向空间更紧凑。", "材料列表、话题列表、生成文章等左侧列表列宽收窄，右侧主体阅读区更宽。", "管理员进入材料/话题视图时默认只筛选自己的邮箱，需要看其他用户时再手动搜索。"] },
  { version: "v1.8.49", date: "2026-06-07", updatedAt: "2026-06-07T20:55:00+08:00", title: "系统配色重设计", changes: ["重新设计 11 组系统配色，整体改为更现代、更清爽的产品化色彩。", "去掉偏暖黄、土色和脏灰的搭配，改用蓝、青、紫、玫红等更耐看的冷调与高亮色。", "保留原有主题 id，用户已选择的配色不会丢失，只会自动换成新版视觉。"] },
  { version: "v1.8.48", date: "2026-06-07", updatedAt: "2026-06-07T20:45:00+08:00", title: "材料管理标题可编辑", changes: ["材料管理列表新增材料名称输入框，支持直接修改已分析材料标题。", "标题、资料来源、材料类型任一变化时，单行更新按钮才会启用。", "保存材料标题后，材料列表、话题来源和生成文章来源会使用新的材料名称。"] },
  { version: "v1.8.47", date: "2026-06-07", updatedAt: "2026-06-07T20:35:00+08:00", title: "元信息与 SKILL 标识统一", changes: ["材料、话题、文章的编号、来源、用户、时间等元信息统一改为最小字号。", "材料和话题详情中的 SKILL 改为末尾彩色可点击标识，可直接查看并编辑保存新版本。", "材料详情的 SKILL 版本查看区改为同一行展示，并提升材料标题字号。"] },
  { version: "v1.8.46", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "生成文章阅读编辑分离", changes: ["生成文章默认进入阅读态，点击编辑后才允许修改标题、核心观点和正文。", "文章核心观点改为独立色块展示。", "行动建议和学习提示从正文中拆成正文后的两类提示卡。"] },
  { version: "v1.8.45", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "生成文章直接编辑", changes: ["生成文章页的标题、核心观点和正文改为直接展示并可原位编辑。", "文章 SKILL 弹窗支持直接修改 SKILL.md 并保存为新版本。", "保存新文章 SKILL 后，旧文章会提示可按最新 SKILL 刷新。"] },
  { version: "v1.8.44", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "生成文章正式正文展示", changes: ["生成文章页的文章 SKILL 支持点击查看完整内容。", "生成文章编辑区移除重复标题和文章框架字段。", "正文生成和展示改为正式文章段落，自动清理 Markdown 标记。"] },
  { version: "v1.8.43", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "生成文章进度与离开保护", changes: ["生成文章和刷新文章时新增进度、百分比和执行日志。", "生成过程中切换页面会提示停止执行或后台继续。", "浏览器刷新或关闭页面时会提示当前生成任务仍在执行。"] },
  { version: "v1.8.42", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "文章观点选择逻辑修正", changes: ["推荐文章后默认不再自动选择文章和观点。", "选中文章时才启用并默认选择该文章下的主要观点。", "某篇文章下所有观点取消后，文章会自动取消选择。"] },
  { version: "v1.8.41", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "文章观点多选生成", changes: ["延伸文章推荐升级为每个选题输出 5 个主要观点。", "文章选题和选题下的核心观点都支持多选。", "生成文章时会同时使用选中的选题、观点和文章 SKILL。"] },
  { version: "v1.8.40", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "文章生成 SKILL", changes: ["SKILL 大厅新增文章 SKILL，可编辑并按版本管理延伸文章写作规则。", "延伸文章推荐支持多选后批量生成，生成时明确使用当前文章 SKILL。", "生成文章可按最新文章 SKILL 重新刷新正文，并记录使用的 SKILL 版本。"] },
  { version: "v1.8.39", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "话题延伸文章生成", changes: ["高层视角话题底部新增 10 个可写文章选题推荐。", "支持调用大模型刷新推荐并基于选题生成完整文章。", "思想洞察新增生成文章管理页，支持编辑和删除生成文章。"] },
  { version: "v1.8.38", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "材料页脑图入口收敛", changes: ["材料页移除单独的话题脑图入口，只保留文章层面的脑图。", "文章脑图继续展示整篇材料逻辑，并可穿透到具体话题解析。", "话题列表里的单个话题详情仍保留话题脑图能力。"] },
  { version: "v1.8.37", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "脑图脚本缓存修复", changes: ["本地页面引用 app.js 和 styles.css 时增加版本号，避免浏览器继续运行旧脚本。", "刷新页面后材料页会显示“文章脑图”和“话题脑图”两个入口。", "文章脑图用于整篇材料逻辑，话题脑图用于单个话题逻辑。"] },
  { version: "v1.8.36", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "材料脑图与话题脑图区分", changes: ["材料页的知识脑图改为文章全局脑图，展示全文主线、主题分类、案例场景、话题地图和金句标签。", "话题脑图保留单个话题内部结构，和材料脑图分开展示。", "材料脑图中的话题节点支持穿透到对应话题解析或话题脑图。"] },
  { version: "v1.8.35", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "高层案例场景拆解增强", changes: ["高层视角 SKILL 升级为案例场景驱动：先识别独立案例，再逐个反向生成学习话题。", "识别到“案例 1、案例 2”等连续案例结构时，话题数量不得明显少于案例数量。", "高层长文分析提高模型输出预算，减少大模型因输出过长而合并话题。"] },
  { version: "v1.8.34", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "知识脑图交互优化", changes: ["脑图节点展示标题和一句话内容摘要，导出后也能看清节点含义。", "点击脑图节点改为局部更新详情，避免画布滚动位置跳回顶部。", "右侧详情支持点击父级节点返回，并将 PDF 导出改为直接生成下载。"] },
  { version: "v1.8.33", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "导航收缩与脑图全页面", changes: ["左侧导航增加收缩和展开按钮，收缩后主内容区域自动变宽。", "知识脑图增加全页面查看模式。", "脑图节点尺寸和文字字号收紧，默认可看到更多节点内容。"] },
  { version: "v1.8.32", date: "2026-06-07", updatedAt: "2026-06-07T00:00:00+08:00", title: "知识脑图页面", changes: ["话题详情新增知识脑图标签页。", "脑图节点支持点击查看对应内容，并支持节点收起、展开和缩放。", "知识脑图支持导出为图片，也可打开打印流程导出为 PDF。"] },
  { version: "v1.8.31", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训弱话题容错", changes: ["培训和会议分析遇到证据不足的话题时自动过滤，不再让整份材料刷新失败。", "培训 SKILL 默认版本升级到 v1.5，禁止把课程预告、转场和下一节安排强行生成知识点话题。", "被过滤的话题会写入 topicExtractionNote，便于回看模型输出问题。"] },
  { version: "v1.8.30", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "SKILL 版本去重修复", changes: ["话题 SKILL 版本列表按资料类型和版本号去重。", "最新版判断改为按 v1.x 语义版本排序，避免旧自定义版本压过系统新版。", "发布新 SKILL 时会基于当前最大版本生成下一个版本号。"] },
  { version: "v1.8.29", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训 SKILL 深度展开", changes: ["培训 SKILL 默认版本升级到 v1.4。", "培训话题要求同时输出核心观点和详细展开，避免只生成简短提纲。", "知识体系延伸要求明确区分原文依据、模型扩展、行业案例和迁移应用。"] },
  { version: "v1.8.28", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "品牌更名为 Wistalk", changes: ["系统名称由 TalktoCEO 更名为 Wistalk。", "前端标题、侧边栏品牌、README、GitHub Pages 工作流名称同步更新。", "浏览器本地数据库和登录态 key 更名为 Wistalk，并保留旧数据迁移兼容。"] },
  { version: "v1.8.27", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训细颗粒话题拆解", changes: ["培训 SKILL 默认版本升级到 v1.3。", "培训材料要求按知识点、概念、方法、工具、步骤、误区和场景进行细颗粒拆解。", "约一小时培训默认拆出 10 个左右可学习话题，避免只生成少量大模块。"] },
  { version: "v1.8.26", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "记住登录稳定性修复", changes: ["记住登录状态改为 localStorage 与 Cookie 双通道保存。", "登录恢复成功后会按 7 天、30 天或永远自动续期。", "增加记住登录取值校验，避免异常值导致登录状态提前失效。"] },
  { version: "v1.8.25", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训话题页面重构", changes: ["培训材料的话题解析不再沿用 CEO 高层讲话组织风格。", "培训话题改为按知识点/概念、讲解场景、注意问题、知识扩展、练习任务和整体逻辑组织。", "培训 SKILL 默认版本升级到 v1.2，刷新后话题页会按培训学习框架展示。"] },
  { version: "v1.8.24", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训讲话知识点闭环", changes: ["培训讲话分析从课程报告改为知识点/概念驱动。", "每个知识点下沉到讲解场景、注意问题、行业案例扩展和知识延伸。", "培训分析增加整体逻辑总结与用户富文本笔记，支持保存和更新。", "培训 SKILL 默认版本升级到 v1.1，已分析培训材料会提示可按新 SKILL 刷新。"] },
  { version: "v1.8.23", date: "2026-06-06", updatedAt: "2026-06-06T00:00:00+08:00", title: "培训讲话分析 SKILL", changes: ["新增培训讲话资料类型，适配技术培训、业务培训、产品培训和方法论培训。", "新增培训讲话分析 SKILL.md，输出培训基础信息、学习目标、知识地图、关键概念、方法步骤、练习任务、误区纠偏、应用场景和后续计划。", "培训材料支持按需提炼话题，不再强行套高层视角文章结构。", "无话题但已完成分析的会议或培训材料，也可进入材料管理并参与 SKILL 刷新。"] },
  { version: "v1.8.22", date: "2026-05-28", updatedAt: "2026-05-28T13:08:00+08:00", title: "资料分类键值同步", changes: ["资料来源和资料类型统一按 id/name 键值引用。", "历史材料可按名称反查并补齐资料来源和类型 id。", "材料列表、材料管理、话题筛选和 SKILL 刷新候选统一使用键值解析。"] },
  { version: "v1.8.21", date: "2026-05-28", updatedAt: "2026-05-28T12:48:00+08:00", title: "材料与话题收藏", changes: ["SKILL 批量刷新提示增加待刷新材料的话题数量。", "材料列表支持收藏材料和只看已收藏材料。", "话题列表支持收藏话题和只看已收藏话题。", "SKILL 刷新时尽量保留已收藏话题标记。"] },
  { version: "v1.8.20", date: "2026-05-28", updatedAt: "2026-05-28T12:28:00+08:00", title: "SKILL 批量刷新执行器", changes: ["话题 SKILL 页新增按最新版本批量刷新材料入口。", "批量刷新弹窗可勾选未使用最新 SKILL 的材料并集中执行。", "批量执行支持每份材料进度、执行日志和后台继续运行。"] },
  { version: "v1.8.19", date: "2026-05-28", updatedAt: "2026-05-28T12:08:00+08:00", title: "上传分析 SKILL 展示", changes: ["材料上传待分析清单展示每份材料将使用的 SKILL 名称和版本。", "执行分析进度与日志明确记录当前调用的是哪个 SKILL.md 版本。"] },
  { version: "v1.8.18", date: "2026-05-28", updatedAt: "2026-05-28T11:58:00+08:00", title: "SKILL 历史版本对比", changes: ["话题 SKILL 版本差异日志改为按相邻版本动态计算。", "话题 SKILL 版本管理复用左右差异对比弹窗。", "新增任意两个历史 SKILL 版本切换对比能力。"] },
  { version: "v1.8.17", date: "2026-05-28", updatedAt: "2026-05-28T11:42:00+08:00", title: "SKILL 差异对比联动", changes: ["SKILL 新旧版本差异弹窗支持左右内容按匹配行同步滚动。", "材料卡片的新版差异入口展示最新 SKILL 版本缩写。"] },
  { version: "v1.8.16", date: "2026-05-28", updatedAt: "2026-05-28T11:28:00+08:00", title: "资料类型配置简化", changes: ["资料管理移除分析模板字段。", "资料类型只负责选择材料场景，具体拆解方式由对应的话题 SKILL.md 管理。", "新增或修改资料类型时，同步保持 SKILL 类型联动。"] },
  { version: "v1.8.15", date: "2026-05-28", updatedAt: "2026-05-28T11:14:58+08:00", title: "材料 SKILL 刷新体验增强", changes: ["材料卡片出现新版 SKILL 时新增差异查看入口。", "新增当前 SKILL 与最新 SKILL 的左右对比弹窗，带行号和差异颜色标注。", "SKILL 刷新时在当前材料卡片内显示执行进度。", "材料详情 SKILL 版本下拉框宽度收敛，切换时同步显示对应应用时间。"] },
  { version: "v1.8.14", date: "2026-05-28", updatedAt: "2026-05-28T10:59:27+08:00", title: "SKILL 版本差异日志", changes: ["SKILL 版本管理中展示每个版本相对上一版的差异日志。", "发布新 SKILL 版本前会自动对比上一版，并在确认弹窗中展示差异摘要。"] },
  { version: "v1.8.13", date: "2026-05-28", updatedAt: "2026-05-28T10:52:04+08:00", title: "SKILL 编辑体验优化", changes: ["发布话题 SKILL 新版本按钮改为紧凑宽度。", "SKILL.md 编辑框高度加长，便于编辑长模版。"] },
  { version: "v1.8.12", date: "2026-05-28", updatedAt: "2026-05-28T10:48:19+08:00", title: "话题卡片展示 SKILL 来源", changes: ["话题列表卡片增加使用的 SKILL 名称和版本。", "话题搜索文本纳入 SKILL 名称，便于按高层视角或会议纪要 SKILL 搜索。"] },
  { version: "v1.8.11", date: "2026-05-28", updatedAt: "2026-05-28T10:41:02+08:00", title: "配置页表单宽度优化", changes: ["系统配置页账号和大模型表单宽度收敛。", "配置页按钮不再默认撑满整行。", "资料管理表单改为紧凑宽度并左对齐。", "移动端仍保持自适应满宽。"] },
  { version: "v1.8.10", date: "2026-05-28", updatedAt: "2026-05-28T10:26:36+08:00", title: "SKILL 页面字号与命名优化", changes: ["话题 SKILL 页面说明、输入框和 SKILL.md 内容区统一为普通文本字号。", "SKILL 类型来源与下拉框改为同一行。", "下拉框宽度按内容和场景收敛。", "SKILL 文件名按资料类型区分，并在材料列表中展示具体 SKILL 名称。"] },
  { version: "v1.8.9", date: "2026-05-28", updatedAt: "2026-05-28T10:13:44+08:00", title: "资料配置与 SKILL 类型联动", changes: ["资料管理中资料来源和资料类型改为各自全行配置。", "资料来源和资料类型支持下拉选择后修改或新增，不再提供删除入口。", "配置名称增加必填和20字符长度限制。", "话题 SKILL 按资料类型选择，资料类型名称修改后同步到对应 SKILL 类型。"] },
  { version: "v1.8.8", date: "2026-05-28", updatedAt: "2026-05-28T09:52:18+08:00", title: "高层视角话题 SKILL 模版", changes: ["话题 SKILL 页面改为上下布局。", "发布新版本时默认带出上一版本内容。", "扩写高层视角话题拆解 SKILL.md 标准模版。", "SKILL 数据增加适用材料类型，为会议纪要等后续 SKILL 预留扩展。"] },
  { version: "v1.8.7", date: "2026-05-28", updatedAt: "2026-05-28T09:31:25+08:00", title: "系统配置体验优化", changes: ["统一系统配置页账号设置锚点定位。", "重新设计 11 套系统配色，提升常用界面搭配质感。", "更新 Wistalk 侧边栏标语。"] },
  { version: "v1.8.6", date: "2026-05-28", updatedAt: "2026-05-28T09:07:13+08:00", title: "话题 SKILL 大厅", changes: ["SKILL 大厅新增话题 SKILL 子菜单。", "话题 SKILL 支持版本管理和新版本发布。", "材料列表可提示并刷新到最新 SKILL 版本。", "材料详情支持切换查看不同 SKILL 版本下的话题分析。"] },
  { version: "v1.8.5", date: "2026-05-28", updatedAt: "2026-05-28T08:57:02+08:00", title: "一级菜单扩展", changes: ["左侧一级菜单新增 PRISM。", "左侧一级菜单新增 SKILL 大厅。"] },
  { version: "v1.8.4", date: "2026-05-28", updatedAt: "2026-05-28T00:00:00+08:00", title: "材料编号", changes: ["材料列表增加材料编号展示。", "新分析材料自动生成 MA0001 形式的唯一材料编号。", "历史材料没有编号时按创建顺序兼容显示编号。"] },
  { version: "v1.8.3", date: "2026-05-27", updatedAt: "2026-05-27T23:49:03+08:00", title: "上传保存与待分析队列重构", changes: ["上传页拆分为本次待保存清单和已保存待分析清单。", "未点击保存前执行分析保持不可用，不会调用大模型。", "保存后的材料写入本地待分析队列，刷新后仍在下方待分析清单展示。", "执行分析只处理下方已保存待分析清单中的勾选材料。"] },
  { version: "v1.8.2", date: "2026-05-27", updatedAt: "2026-05-27T23:41:00+08:00", title: "材料列表与执行规则优化", changes: ["新增思想洞察下的材料列表视角，先看材料再看材料话题。", "上传材料保存后保持未执行状态，只有选中已保存材料才可执行分析。", "材料管理支持单行更新和单行删除。", "话题列表增加分页和每页数量设置。", "系统版本时间对管理员显示到秒，普通用户只显示日期。"] },
  { version: "v1.8.1", date: "2026-05-27", updatedAt: "2026-05-27T23:35:00+08:00", title: "回收站与后台统计优化", changes: ["回收站材料名称支持再次点击收起关联话题。", "清理界面与模型结构中的旧延展学习内容。", "回收站话题预览去除重复标题。", "用户与平台管理增加文档和话题数量统计。"] },
  { version: "v1.8.0", date: "2026-05-27", updatedAt: "2026-05-27T21:40:00+08:00", title: "资料生命周期与回收站", changes: ["思想洞察菜单更新，已分析材料可在材料上传页集中管理。", "支持资料软删除、管理员回收站恢复和彻底删除。", "话题编号升级为 TC0001 形式的唯一编号。", "管理员可按用户筛选话题列表。", "用户配置改为按账号隔离。"] },
  { version: "v1.7.0", date: "2026-05-27", updatedAt: "2026-05-27T19:20:00+08:00", title: "材料上传与执行进度", changes: ["支持批量上传材料并选择执行分析。", "增加文件数量、大小限制和分析进度日志。", "分析完成后弹窗提示并跳转话题列表。"] },
  { version: "v1.6.0", date: "2026-05-27", updatedAt: "2026-05-27T17:30:00+08:00", title: "个人大模型配置", changes: ["每位用户独立配置 Base URL、模型和 API Key。", "测试连接成功后才能保存大模型配置。"] },
  { version: "v1.5.0", date: "2026-05-27", updatedAt: "2026-05-27T16:00:00+08:00", title: "话题驱动学习", changes: ["学习总览改为话题列表驱动。", "每份资料可拆出多个话题并查看原文。"] },
];
const ADMIN_EMAIL = "Simon.Lv@fanruan.com";
const ADMIN_EMAIL_KEY = ADMIN_EMAIL.toLowerCase();
const SESSION_KEY = "wistalk-session";
const LEGACY_SESSION_KEY = "ceo-speech-session";
const SESSION_COOKIE_NAME = "wistalk_session";
const LEGACY_SESSION_COOKIE_NAME = "talktoceo_session";
const ADMIN_BOOTSTRAP_PASSWORD_KEY = "wistalk-admin-bootstrap-password";
const LEGACY_ADMIN_BOOTSTRAP_PASSWORD_KEY = "talktoceo-admin-bootstrap-password";
const FONT_SIZE_PRESETS = [
  { id: "xsmall", name: "较小", note: "紧凑阅读", bodySize: "14px", buttonSize: "13px", titleSize: "22px" },
  { id: "small", name: "小", note: "当前推荐", bodySize: "15px", buttonSize: "14px", titleSize: "24px" },
  { id: "medium", name: "中", note: "浏览器常见正文", bodySize: "16px", buttonSize: "15px", titleSize: "26px" },
  { id: "large", name: "大", note: "舒展阅读", bodySize: "17px", buttonSize: "16px", titleSize: "28px" },
  { id: "xlarge", name: "较大", note: "大屏展示", bodySize: "18px", buttonSize: "17px", titleSize: "30px" },
];
const DEFAULT_FONT_SETTINGS = {
  presetId: "small",
  bodySize: "15px",
  buttonSize: "14px",
  titleSize: "24px",
};
const DEFAULT_DEEPSEEK_SETTINGS = {
  provider: "deepseek",
  apiKey: "",
  baseUrl: "https://api.deepseek.com",
  model: "deepseek-v4-flash",
  thinking: "enabled",
  reasoningEffort: "high",
};
const MODEL_PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com", model: "deepseek-v4-flash" },
  { id: "fineres", name: "帆软内网模型", baseUrl: "https://it-ai.fineres.com/v1", model: "deepseek-v4-pro" },
  { id: "openai-compatible", name: "OpenAI 兼容接口", baseUrl: "https://api.example.com/v1", model: "model-name" },
  { id: "custom", name: "自定义", baseUrl: "https://api.example.com/v1", model: "model-name" },
];
const PRESET_CATEGORIES = [
  { id: "preset-strategy", name: "战略" },
  { id: "preset-organization", name: "组织管理" },
  { id: "preset-culture", name: "文化建设" },
  { id: "preset-ai", name: "AI" },
  { id: "preset-digital", name: "数字化" },
  { id: "preset-other", name: "其他" },
];
const DEFAULT_MATERIAL_SOURCES = [
  { id: "source-ceo-marks", name: "CEO Marks", isPreset: true },
];
const DEFAULT_MATERIAL_TYPES = [
  { id: "type-executive-view", name: "高层视角", isPreset: true },
  { id: "type-meeting-notes", name: "会议纪要", isPreset: true },
  { id: "type-training-speech", name: "培训讲话", isPreset: true },
];
const DEFAULT_TOPIC_SKILL_PROMPT = `# 高层视角话题拆解 SKILL.md

## 1. 适用范围
- 适用材料类型：高层视角。
- 典型材料：CEO 讲话、高管观点、战略分享、经营复盘、组织管理讲话、数字化/AI 转型观点。
- 当前 SKILL 不用于会议纪要、访谈逐字稿、项目日报等材料。若材料类型为会议纪要，应使用单独的会议拆解 SKILL。

## 2. 核心任务
你要把一份高层视角材料拆解为若干个“可学习的话题文章”。
每个话题必须来自原文，每个话题只解决一个核心问题。
不要把材料简单摘要成观点清单，而要把高层表达背后的管理问题、底层矛盾、关键动作和可迁移启示拆出来。
如果材料本身是案例复盘、组织变革实录、经营案例集、案例 1/案例 2 这类结构，必须采用“案例场景驱动”的拆解方式：先识别每一个独立案例场景，再围绕每个案例反向提炼一个核心管理问题。

## 3. 输入理解规则
- 先通读全文，识别讲话对象、业务场景、关键矛盾、管理动作和反复出现的关键词。
- 区分三类内容：核心判断、支撑案例、情绪表达。话题优先来自核心判断和关键管理动作。
- 对案例复盘类材料，支撑案例不只是观点的证据，而是话题生成的基本单元。每个独立案例、故事、业务试错、组织变革动作，都要先作为候选话题登记。
- 如果原文明确出现“十五大案例”“案例 1：”“案例 2：”等连续结构，要逐一识别案例编号、案例名称、关键矛盾和组织动作，不得把多个案例合并成一个宏观话题。
- 不要因为系统预设了战略、组织、数字化、AI、数据、领导力等分类，就强行套分类。分类必须服从原文。
- 如果原文没有直接或间接依据，不允许生成对应话题。

## 4. 话题抽取规则
- 话题标题要写成问题，适合读者点击学习。
- 标题中尽量保留原文里的具体名词、业务对象、组织场景或管理动作。
- 每个话题至少提供 2 条原文证据，证据必须能直接支撑这个话题。
- 一个话题只处理一个核心问题，不要把战略、组织、数据、AI 全部塞进一个话题。
- 普通短讲话优先抽取 4-8 个高质量话题；但案例复盘类、长篇组织变革实录、经营案例集不能套用 4-8 个限制。
- 若材料明确包含 N 个独立案例场景，原则上输出 N 个话题；如果某个案例内部有两个相互独立的故事，也可以拆成 N+ 个话题。
- 对“十五大案例实录”这类材料，通常应该输出 15 个左右话题；少于案例数量时，必须说明哪个案例没有形成话题以及原因。
- 不要为了追求“主题统一”把多个案例合并成“组织隔离”“战略拉通”这类大话题。可以让多个话题共享标签，但话题本身必须保留案例边界。
- 话题生成顺序应尽量与原文案例顺序一致，便于用户从材料列表回到原文学习。

## 5. 话题文章标准结构
每个话题文章必须按以下模块组织：

### 难度等级
用 1-5 星表示，判断依据是这个问题的抽象程度、跨组织难度和落地复杂度。

### 问题类型
可以多选，例如：战略 / 数据 / 领导力。必须贴合原文，不要泛化。

### 问题实质
用 2-4 段说明这个问题真正要解决的底层矛盾。
至少包含一个管理学或组织行为视角；如果适合，可以加入心理学、认识论、毛泽东思想中的实践论/矛盾论视角。

### 表面现象
还原 CEO 在原文中讨论的具体场景、比喻、判断或管理动作。

### 深层本质
从三个维度展开：
1. 心理学维度：人的认知、信任、偏误、动机或习惯如何影响这个问题。
2. 管理学维度：组织结构、流程、权责、信息、激励如何塑造这个问题。
3. 认识论维度：从实践论、调查研究、主要矛盾、群众路线等角度解释这个问题。

### CEO 的解法与关键动作
必须拆成：
- 核心判断：CEO 对这个问题最关键的一句话判断。
- 验证方法：如何证明这个判断有效，至少 3 条。
- 关键行动：组织实际应该怎么做，至少 3 条。

### 底层逻辑（理论锚点）
- 关联理论/模型：列出 3-4 个理论锚点。
- 逻辑拆解：说明这些理论如何解释 CEO 的解法。
- 不要空喊理论，必须回到原文场景。

### 案例对照（跨时空验证）
包含反例、正例、历史类比。案例可以是通用管理案例，但不能替代原文依据。

### 更多解法与选择
至少给出 3 种替代解法，每种包含：
- 解法名称
- 具体步骤
- 适用场景
- 风险或边界

### 可迁移的启示
包含：
- 对团队的启示
- 对读者的行动建议
- 下一次遇到类似问题时，应该先问自己的一个问题

## 6. 输出质量要求
- 语言必须中文，表达要像一篇可学习的管理文章，不要像机器摘要。
- 不允许出现“这篇讲话围绕若干维度建立机制”这类空泛句。
- 不允许脱离话题标题发散成通用管理文章。
- 对案例场景驱动的话题，sourceSummary 必须写清楚“来自案例 X：案例名称/业务场景”，不能只写“来自组织变革相关内容”。
- 对案例场景驱动的话题，surfacePhenomenon 必须还原该案例中的具体矛盾、组织动作、结果或复盘坑点。
- 若多个案例都属于同一管理主题，也必须分别形成多个话题，因为用户学习的是不同场景下的具体解法，而不是抽象主题归纳。
- 不允许编造原文没有的事实、组织名称、数字或事件。
- 如果引用案例，必须说明它是案例对照，不要伪装成原文事实。
- 任何判断都要能回到原文证据。

## 7. 输出 JSON 约束
- 必须严格输出系统要求的 JSON。
- topics 中每个话题都要包含 evidence、sourceSummary、problemEssence、surfacePhenomenon、deepNature、ceoSolution、theoryAnchors、caseComparison、moreSolutions、transferableInsights。
- 若输出 caseScenes 字段，它应列出识别到的独立案例场景：caseNo、caseTitle、coreConflict、managementAction、topicTitle。caseScenes 主要用于自检，topics 仍然是前端学习的主内容。
- quotes 只选择原文中最值得反复学习的句子。
- suggestedTags 必须是便于后续检索的短标签。`;

const DEFAULT_MEETING_SKILL_PROMPT = `# 会议纪要分析 SKILL.md

## 1. 适用范围
- 适用材料：多人会议文字记录、逐字稿、会议笔记、语音转文字结果。
- 典型场景：项目例会、决策会、复盘会、跨部门协调会、评审会、推进会。
- 不适用：个人访谈、高层战略讲话、纯文章解读、单人工作总结。

## 2. 核心目标
把会议纪要拆成一份可直接学习和复盘的结构化报告。它的主内容是会议纪要分析，不是强行生成学习文章。

必须提取的内容：
- 会议基础信息
- 已做出的决策
- 行动项与责任人
- 各议题的讨论逻辑与分歧点
- 会议中的情感/协作态势
- 明确或隐含的风险与依赖
- 待定问题与后续跟进

如果原文中出现了足够清晰、可以继续深挖的问题，再额外提炼 topics；如果没有，不要强行提炼，topics 直接返回空数组。

## 3. 输入理解规则
- 先识别发言人、时间线、议题切换节点，再做结构化拆分。
- 区分事实陈述、观点判断、情绪表达、临时共识、保留意见。
- 缺失信息如负责人、截止日期、会议时间、主持人、记录人等，统一写“未提及”或“需补充”。
- 不做超出原文的推断；只有在必要且明确标注 [推断] 时才允许推断。
- 同一句话里如果既有结论又有态度，要分别进入对应模块，不要混写。

## 4. 输出结构
### 4.1 meetingAnalysis（必须输出）
1. meetingInfo
   - 会议主题
   - 会议目标
   - 会议时间
   - 会议时长
   - 参会人
   - 缺席人
   - 主持人
   - 记录人
2. decisions
   - 每条决策都要包含：序号、议题、决定内容、依据/理由
3. actionItems
   - 每条行动项都要包含：序号、行动内容、负责人、截止日期、来源
4. discussionSummary
   - 每个议题都要包含：议题名称、背景、关键观点、分歧点、结论/走向
5. collaboration
   - 整体氛围
   - 态度分布
   - 关键冲突点
   - 虚假同意或带保留同意
6. risksAndDependencies
   - 明确风险
   - 隐含风险
   - 外部/跨部门依赖
   - 信息缺失
7. pendingQuestions
   - 问题
   - 当前状态
   - 跟进建议
8. topicExtractionNote
   - 说明是否有可提炼话题
   - 如果没有，说明为什么没有

### 4.2 topics（可选）
- 只有在会议中出现清晰问题、关键矛盾、可学习的决策逻辑、组织协同问题时才输出。
- 不要把普通待办事项、流程提醒、时间安排强行包装成话题。
- 话题必须有原文证据，且标题要能被证据直接支撑。
- 没有适合展开的话题时，topics 返回 []。
- 若输出 topics，每个 topic 仍然沿用高层视角话题文章结构，但标题和证据必须严格来自会议原文。

## 5. 输出原则
- 事实优先，所有内容基于原文。
- 不编造，没有的信息写“未提及”。
- 保留模糊，原文模糊就原样引用。
- 先事实后分析，先原文后判断。
- 语言必须中文，表达要像一份认真整理过的会议学习材料，不要像机器摘要。`;

const DEFAULT_TRAINING_SKILL_PROMPT = `# 培训讲话分析 SKILL.md

## 1. 适用范围
- 适用材料：技术培训、业务培训、产品培训、方法论培训、内部分享、培训逐字稿、课程讲稿、培训复盘材料。
- 典型场景：技术方案讲解、产品能力培训、销售/交付方法培训、业务流程培训、管理工具培训、新人培训。
- 不适用：多人会议纪要、高层战略讲话、纯制度文件、没有教学目的的普通文章。

## 2. 核心目标
把一份培训讲话拆成“知识点/概念驱动”的学习闭环。主输出是 trainingAnalysis，不要强行套高层视角的管理话题文章。

必须围绕以下逻辑输出：
1. 先识别培训里讲到的各个知识点、概念、方法、工具、步骤、公式、判断标准、误区、案例和场景。
2. 每个知识点/概念下面，整理老师讲到的一个或多个具体场景。
3. 每个知识点/概念下面，整理学习和应用过程中需要注意的问题、误区、边界和风险。
4. 基于原文知识点和场景，用大模型扩展行业案例、关联知识点和迁移场景，必须标注 [扩展]。
5. 总结整场培训的知识点整体逻辑，说明这些知识点之间如何层层递进或相互支撑。
6. 为用户后续笔记预留空间，前端会提供富文本笔记保存能力。

内容深度要求：
- 每个知识点都要先给“核心观点”，再做“详细展开”。
- 核心观点可以精简，一般 1-2 句，用于快速抓住结论。
- 详细展开必须充分，通常 120-220 字，解释概念含义、适用前提、运作机制、为什么成立、与原文场景的关系。
- 老师原文讲得简短时，不能只复述短句；要在不编造事实的前提下，把原文隐含的业务逻辑、技术逻辑、操作逻辑讲透。
- 所有大模型补充的行业案例、类比、迁移场景、学习建议必须显式标注 [扩展]；基于原文合理推导但原文未明说的内容标注 [推断]。
- 不允许只输出“是什么”的标签化结论，还要解释“为什么重要、怎么用、什么情况下会失效、如何练习”。

培训材料必须尽量细颗粒拆解。topics 不是可有可无的摘要模块，而是用户真正学习的“细知识点文章”。除非原文极短或完全没有教学内容，否则必须输出 topics。
数量要求：
- 短培训或片段材料：至少 5-8 个话题。
- 约 1 小时培训材料：通常至少 10 个左右话题，建议 10-15 个。
- 信息密度很高的技术/业务培训：可以拆到 15 个以上，但不要重复。
- 不要把多个不同知识点合并成一个大话题；宁可拆细，也不要粗略概括。

## 3. 输入理解规则
- 先识别培训类型：技术培训 / 业务培训 / 产品培训 / 方法论培训 / 混合培训。
- 识别讲师、学员对象、课程目标、知识点边界、场景案例、练习要求、操作步骤和易错点。
- 区分：知识点/概念、老师原文解释、具体场景、操作过程、注意事项、误区纠偏、行动要求。
- 看到列表、步骤、工具菜单、判断标准、案例、提问、提醒、注意事项时，要优先判断是否可以单独拆成一个学习话题。
- 课程预告、目录提示、转场衔接、下一节安排、寒暄和纯时间安排，不属于知识点/概念/方法/工具/步骤/误区/场景，不能作为 topics 输出；除非原文在该段里已经讲清楚了可学习的知识内容。
- 缺失信息统一写“未提及”，不要编造讲师、时长、对象、工具、数字和案例。
- 对原文没有明确说出的应用建议、行业案例、知识延伸，必须标注 [扩展] 或 [推断]。

## 4. 输出结构
### 4.1 trainingAnalysis（必须输出）
1. trainingInfo
   - 培训主题
   - 培训类型
   - 目标学员
   - 讲师/来源
   - 培训时长
   - 前置基础
2. knowledgeItems
   - 每个元素代表一个知识点、概念、方法或工具。
   - 必须包含：名称、类型、核心观点、原文解释、详细展开、为什么重要、原文依据。
   - 必须包含：老师讲到的场景列表，每个场景说明场景名称、业务/技术语境、老师如何讲、场景详细展开、适用条件、原文依据。
   - 必须包含：注意问题列表，说明误区/风险/边界、为什么容易出错、详细分析、纠偏方式、原文依据。
   - 必须包含：知识扩展列表，用 [扩展] 标注行业案例、案例详细展开、关联知识点、迁移场景、学习建议。
   - 必须包含：练习任务，帮助学员把这个知识点用出来。
3. overallLogic
   - 整体逻辑一句话
   - 课程推进路径
   - 知识点之间的关系
   - 学习者应该形成的能力闭环
4. topicExtractionNote
   - 说明是否有可提炼话题；如果没有，说明原因

### 4.2 topics（可选）
- 对培训材料来说，topics 原则上必须输出，除非原文极短或没有教学内容。
- 每个 topic 只解决一个细知识点、一个概念、一个方法、一个工具、一个步骤、一个误区、一个判断标准或一个典型场景。
- 不要把 3 个以上不同知识点合并为一个 topic。
- 不要把“下午课程预告”“接下来讲某模块”“稍后介绍某主题”这类预告句包装成 topic；这类内容可以写入 overallLogic、followUpPlan 或 topicExtractionNote，但不能进入 topics。
- 不要把 topic 写成管理文章，也不要把普通知识点包装成 CEO 战略话题。
- 若输出 topics，每个话题必须按培训学习框架组织：知识点/概念、讲解场景、注意问题、知识扩展、练习任务、整体逻辑和学习者收获。
- 约 1 小时培训内容，topics 数量通常不少于 10 个；如果少于 8 个，必须在 topicExtractionNote 里解释为什么无法继续细拆。
- 每个 trainingTopic 必须包含：coreViewpoint 和 detailedExplanation。
- 每个 trainingTopic 的 detailedExplanation 要能成为一段完整学习文章，不少于 120 字；不要只写一句话。
- 讲解场景、注意问题、知识体系延伸也要尽量展开，不能只给短语。

## 5. 输出原则
- 事实优先，所有内容基于原文。
- 不编造，没有的信息写“未提及”。
- 技术培训要保留术语、步骤、输入输出、边界条件。
- 业务培训要保留业务对象、场景、流程、指标、角色动作。
- 原文没有说但为了学习体系延伸而补充的内容，必须显式标注 [扩展]。
- 表达要像一份认真整理过的学习笔记和训练手册，不要像机器摘要。`;
const DEFAULT_TOPIC_SKILL = {
  id: "topic-skill-default-v1",
  name: skillNameForMaterialTypeName("高层视角"),
  version: "v1.2",
  versionNumber: 3,
  summary: `面向高层视角材料的标准${skillFileNameForMaterialTypeName("高层视角")}，支持案例场景驱动拆解，避免把多案例长文合并成少量大主题。`,
  prompt: DEFAULT_TOPIC_SKILL_PROMPT,
  targetMaterialTypeId: "type-executive-view",
  targetMaterialTypeName: "高层视角",
  skillFileName: skillFileNameForMaterialTypeName("高层视角"),
  changeLog: ["v1.2：新增案例场景驱动拆解规则，要求先识别独立案例，再逐个生成可学习话题；多案例长文不再套用 4-8 个话题限制。"],
  createdAt: "2026-06-07T13:45:00+08:00",
  isPreset: true,
};
const DEFAULT_ARTICLE_SKILL_PROMPT = `# 文章生成 SKILL.md

## 1. 适用范围
- 适用于“高层视角”话题下的延伸文章写作。
- 输入通常包括：话题标题、话题来源、问题实质、表面现象、原文证据、CEO解法、理论锚点、可迁移启示，以及用户选中的文章选题。
- 输出是一篇可学习、可复盘、可迁移的中文管理文章，而不是提纲、摘要或口号。

## 2. 输出篇幅
- 正文控制在 1500 字左右，允许 1300-1800 字浮动。
- 每一节都要有具体展开，不能只写小标题或短句。
- 文章要先精炼表达核心观点，再通过现象、原因、方法和理论总结逐层展开。

## 3. 固定结构
文章必须按以下六个部分组织，标题要自然化、业务化，并使用“一、二、三……”中文序号；顺序不能改变，但不要把“先讲结论和观点”等模板字段原样作为标题：

### 3.1 结论与观点
- 开头直接说清楚文章的核心结论。
- 用 1-2 段说明这个观点为什么值得学习。
- 不要先铺垫背景太久。

### 3.2 现象呈现
- 描述原话题中能看到的管理现象、组织行为或业务场景。
- 必须尽量引用或转述原话题证据。
- 说明这个现象在企业经营里为什么常见。

### 3.3 深层原因分析
- 至少从 2-3 个维度展开，例如：认知、机制、组织、利益、文化、数据、流程、领导力。
- 要讲清“表面问题”和“底层矛盾”的区别。
- 可以引入管理学、心理学、组织行为学等理论，但不能装作这是原文事实。

### 3.4 解决方式
- 输出可操作的方法，而不是泛泛建议。
- 至少包含 3 个动作：怎么启动、怎么执行、怎么反馈校准。
- 说明适用条件和可能失效的边界。

### 3.5 毛泽东思想与毛选视角
- 可以结合《实践论》《矛盾论》《反对本本主义》、群众路线、调查研究、从实践到认识再到实践等视角。
- 不要生硬贴标签，要把毛选观点和当前管理问题之间的关系说清楚。
- 避免长篇引用，重点做解释和转化。

### 3.6 总结收尾
- 回到文章核心观点。
- 正文内只做文章总结，不要把“马上可以执行的小行动”“学习的感觉在于”混入正文。
- 如果需要行动建议和学习提示，请单独输出为文章外部提示。

## 4. 写作要求
- 语言中文，表达清晰、具体、克制，不要夸张。
- 必须区分“原话题事实”和“大模型延伸理解”；延伸内容可以写成“可以进一步理解为”“在类似组织中常见的是”。
- 不编造 CEO 原文没有出现的事实。
- 文章要像一篇认真写出来的学习文章，而不是模板填空。
- 输出正式文章正文，不使用 Markdown 标记；正文用自然段组织，重要金句或关键判断可以加粗。
- 正文标题使用 <h2>、<h3>、<h4> 形成层级：一级标题用 <h2>一、具体标题</h2>，二级标题用 <h3>（一）具体标题</h3>，三级标题用 <h4>1. 具体标题</h4>；标题默认左对齐，不要出现“先讲结论和观点”“展示现象”“分析现象的深层次原因”“解决方式是什么”等模板词。`;

const DEFAULT_ARTICLE_SKILL = {
  id: "article-skill-default-v1",
  name: "高层视角延伸文章 SKILL",
  version: "v1.0",
  versionNumber: 1,
  summary: "面向高层视角话题的默认文章生成 SKILL，要求 1500 字左右，并按结论、现象、原因、解法、毛选总结、收尾六段组织。",
  prompt: DEFAULT_ARTICLE_SKILL_PROMPT,
  skillFileName: "高层视角延伸文章 SKILL.md",
  changeLog: ["v1.0：建立延伸文章写作的默认六段结构和 1500 字左右篇幅要求。"],
  createdAt: "2026-06-07T15:30:00+08:00",
  isPreset: true,
};
const THEMES = [
  { id: "fineres-minglan", name: "星舰溟蓝", scope: "默认（帆软本部）", description: "钴蓝与电光青的组合，像数据平台的深海仪表盘，冷静、锋利、耐看。", ink: "#101828", primary: "#2563eb", accent: "#06b6d4", soft: "#eff6ff", bg: "#edf5ff" },
  { id: "jingjin-dansha", name: "曜石绯红", scope: "京津战区", description: "绯红只做高亮，搭配冷蓝压住火气，保留力量感但不沉闷。", ink: "#1f1720", primary: "#e11d48", accent: "#2563eb", soft: "#fff1f5", bg: "#f7eef3" },
  { id: "dongbei-xuantie", name: "极夜冰蓝", scope: "东北战区", description: "极夜石墨与冰蓝高光，克制、硬朗，有清晰的科技质感。", ink: "#111827", primary: "#0f172a", accent: "#38bdf8", soft: "#f1f5f9", bg: "#eaf1f8" },
  { id: "xibei-jinpo", name: "星河钴蓝", scope: "西北战区", description: "用星河蓝紫替代旧版暖黄，让视觉更轻、更酷，也更适合长时间使用。", ink: "#171a2f", primary: "#4f46e5", accent: "#0ea5e9", soft: "#f1f3ff", bg: "#eef2ff" },
  { id: "huabei-cangcui", name: "山岚青松", scope: "华北战区", description: "松青与湖蓝组合，稳但不老气，适合管理后台的高频操作场景。", ink: "#12231f", primary: "#0f766e", accent: "#0284c7", soft: "#ecfdf5", bg: "#eaf7f4" },
  { id: "shanghai-huanyin", name: "申江霓紫", scope: "上海战区", description: "霓虹紫与蓝灰底色，保留都市感和未来感，避免大面积金属灰发脏。", ink: "#1d2333", primary: "#6366f1", accent: "#a855f7", soft: "#f5f3ff", bg: "#eef1fb" },
  { id: "suwan-shuimo", name: "青瓷雾蓝", scope: "苏皖战区", description: "青瓷蓝绿配浅雾背景，干净、柔和，适合阅读和知识管理。", ink: "#17252f", primary: "#0e7490", accent: "#14b8a6", soft: "#ecfeff", bg: "#eaf7fa" },
  { id: "zhemin-danyan", name: "海岸珊瑚", scope: "浙闽战区", description: "珊瑚红作为活力点缀，主色偏清爽蓝绿，热烈但不过火。", ink: "#231b2b", primary: "#0891b2", accent: "#f43f5e", soft: "#ecfeff", bg: "#eef8fb" },
  { id: "huanan-jianghong", name: "木棉玫曜", scope: "华南战区", description: "玫红与紫调形成醒目的南方活力，比深红和橙色更现代。", ink: "#2a1730", primary: "#db2777", accent: "#7c3aed", soft: "#fdf2f8", bg: "#f7eef8" },
  { id: "xinan-ziying", name: "雪域极紫", scope: "西南战区", description: "极紫配冰青，既有神秘感又不压抑，适合作为更个性的高亮主题。", ink: "#201b3a", primary: "#7c3aed", accent: "#22d3ee", soft: "#f5f3ff", bg: "#f0eefb" },
  { id: "huazhong-tonglv", name: "云梦青碧", scope: "华中战区", description: "青碧与蓝色形成清爽的湖面感，去掉铜绿的旧感和厚重感。", ink: "#10251f", primary: "#059669", accent: "#0ea5e9", soft: "#ecfdf5", bg: "#eaf8f3" },
];

const categoryDefs = [
  {
    id: "strategy",
    name: "战略",
    color: "#3267a8",
    keywords: ["战略", "方向", "选择", "定位", "机会", "行业", "客户", "市场", "增长", "竞争", "价值", "取舍", "长期", "未来"],
    question: "企业如何在不确定环境中做出清晰的战略选择？",
    essence: "核心矛盾是外部机会很多、内部资源有限，必须把战略从愿望变成取舍。",
    logic: "先从真实市场和客户实践中取得认识，再用关键矛盾牵引资源配置，最后通过反馈修正判断。",
  },
  {
    id: "digital",
    name: "数字化",
    color: "#087c76",
    keywords: ["数字化", "系统", "平台", "在线", "工具", "技术", "业务", "协同", "自动化", "中台", "软件", "数据化"],
    question: "数字化到底应该解决业务中的哪个核心问题？",
    essence: "核心矛盾是业务动作分散在个人经验里，组织无法沉淀、复用和放大。",
    logic: "数字化不是先买工具，而是把关键业务过程显性化，让实践经验进入系统并形成可迭代的机制。",
  },
  {
    id: "ai",
    name: "AI",
    color: "#7652a4",
    keywords: ["AI", "人工智能", "大模型", "算法", "智能", "模型", "生成式", "机器", "自动", "智能化", "机器人"],
    question: "AI 应该优先嵌入企业的哪些经营管理场景？",
    essence: "核心矛盾是组织知识增长速度慢，而 AI 可以把分析、生成、复盘和训练的成本快速降下来。",
    logic: "AI 的价值不在替代全部判断，而在把高频、可描述、可反馈的认知劳动变成组织能力。",
  },
  {
    id: "organization",
    name: "组织管理",
    color: "#407a4c",
    keywords: ["组织", "团队", "人才", "干部", "一线", "协同", "共创", "责任", "授权", "管理", "机制", "能力", "部门"],
    question: "组织怎样把 CEO 的判断转化为一线可执行的共同动作？",
    essence: "核心矛盾是战略判断在少数人脑中，而执行发生在一线和跨部门协同里。",
    logic: "群众路线在管理中的体现，是从一线实践中来，到一线行动中去；共创可以降低认知偏差，也提高执行承诺。",
  },
  {
    id: "process",
    name: "流程",
    color: "#b7791f",
    keywords: ["流程", "SOP", "标准", "闭环", "执行", "落地", "节点", "复盘", "计划", "节奏", "会议", "项目"],
    question: "如何把好的管理想法变成稳定可复制的流程？",
    essence: "核心矛盾是一次性成功不能代表组织能力，必须把经验变成可检查、可复盘、可改进的动作链条。",
    logic: "实践论强调认识要回到实践中检验；流程的价值就是让检验和反馈有固定入口。",
  },
  {
    id: "data",
    name: "数据",
    color: "#c6533f",
    keywords: ["数据", "指标", "分析", "事实", "报表", "看板", "衡量", "反馈", "增长率", "成本", "利润", "效率", "转化"],
    question: "管理者如何用数据逼近事实，而不是被数据表象带偏？",
    essence: "核心矛盾是经验判断有速度但容易偏，数据判断有依据但需要解释和场景。",
    logic: "数据是实践的压缩表达，真正的管理判断要把数据、场景和人的行为放在一起看。",
  },
  {
    id: "incentive",
    name: "激励",
    color: "#8a5a22",
    keywords: ["激励", "奖励", "奖金", "分配", "考核", "绩效", "利益", "薪酬", "目标", "约束", "评价"],
    question: "怎样设计激励，让组织成员主动奔向关键目标？",
    essence: "核心矛盾是组织目标与个人收益之间天然存在距离，激励要把两者重新连接起来。",
    logic: "激励不是简单奖惩，而是通过利益结构推动矛盾转化，让被动执行转成主动创造。",
  },
  {
    id: "culture",
    name: "文化",
    color: "#5e6b2f",
    keywords: ["文化", "价值观", "使命", "愿景", "信任", "奋斗", "长期主义", "透明", "学习", "反思", "心态"],
    question: "文化如何从口号变成组织面对困难时的真实选择？",
    essence: "核心矛盾是文化容易停留在表达层，真正的文化必须体现在取舍、分配和关键时刻的行为中。",
    logic: "文化是长期实践沉淀出的共同标准，只有在反复选择中被验证，才会成为组织的稳定力量。",
  },
  {
    id: "leadership",
    name: "领导力",
    color: "#4d6178",
    keywords: ["CEO", "领导", "决策", "认知", "判断", "带领", "沟通", "信心", "危机", "变革", "问题", "方法"],
    question: "领导者如何把复杂问题讲清楚，并带动组织行动？",
    essence: "核心矛盾是复杂环境需要统一认知，而组织成员看到的问题往往局部、分散、短期。",
    logic: "领导力的底层是定义问题、抓住主要矛盾、组织实践并持续校准，而不只是表达愿景。",
  },
];

const deepeningModes = [
  {
    title: "系统重构",
    goal: "把多篇讲话融合成 CEO 的经营管理体系。",
    questions: ["哪些命题反复出现？", "哪些做法只是阶段性策略？", "能否形成一张战略到反馈的总图？"],
  },
  {
    title: "深度复盘",
    goal: "用时间线看 CEO 思想和实践如何演变。",
    questions: ["每个阶段解决什么矛盾？", "变化来自外部压力还是主动进化？", "当前组织处在哪个阶段？"],
  },
  {
    title: "角色扮演",
    goal: "代入 CEO 视角解决一个新问题。",
    questions: ["他会先看什么事实？", "他会先建机制还是先调整人？", "你的方案与他的差距在哪里？"],
  },
  {
    title: "智慧传承",
    goal: "把讲话转化为可教学、可训练的课程。",
    questions: ["核心原理是什么？", "学员最容易卡在哪里？", "怎样设计演练让方法被用出来？"],
  },
  {
    title: "批判反思",
    goal: "识别 CEO 方法的边界条件和改进空间。",
    questions: ["什么情况下会失效？", "失效是规模、行业还是文化原因？", "改进版方案如何设计？"],
  },
  {
    title: "未来推演",
    goal: "在 AI 时代重新审视这些经营方法。",
    questions: ["哪些环节会被 AI 增强？", "哪些底层逻辑不会变？", "今天应该先准备什么能力？"],
  },
];

const sampleText = `今天我想讲三个关键词：战略、数字化和组织能力。企业越是在不确定的环境里，越不能把战略理解成口号。战略首先是选择，是对客户、行业和资源的重新排序。我们过去几年犯过一个错误，就是每个机会都想抓，结果资源被摊薄，一线也不知道什么是最重要的目标。

数字化不是 IT 部门的项目，而是业务管理方式的变化。我们要求每个关键流程都在线，每个客户触点都能沉淀数据，每个项目结束后都要复盘。数据不是为了做漂亮报表，而是为了让管理者看见真实问题。只有看见真实问题，组织才有机会改进。

AI 会改变知识工作，但不会替代管理者对业务本质的判断。我们要把 AI 用在行业研究、客户洞察、销售训练、流程复盘和知识沉淀上，让每个一线员工都能站在组织经验的肩膀上工作。AI 不是一个单点工具，而是未来组织学习速度的放大器。

组织管理最重要的是让一线参与共创。总部不能坐在办公室里设计所有规则，规则必须从现场来，再回到现场验证。我们会奖励那些主动发现问题、提出方案、把经验沉淀为标准动作的人。考核只告诉大家不能做什么，奖励才能告诉大家什么是真正重要的。

最后，领导者要敢于做减法。越复杂的时候，越要回到客户价值、关键流程、核心人才和真实数据。只要我们持续复盘，持续学习，持续把经验变成机制，就能在变化中建立长期能力。`;

const els = {
  fileInput: document.querySelector("#fileInput"),
  fileInputWrapper: document.querySelector("#fileInput")?.parentElement,
  urlImportForm: document.querySelector("#urlImportForm"),
  urlInput: document.querySelector("#urlInput"),
  authScreen: document.querySelector("#authScreen"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  forgotForm: document.querySelector("#forgotForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  rememberDuration: document.querySelectorAll("input[name='rememberDuration']"),
  registerEmail: document.querySelector("#registerEmail"),
  forgotEmail: document.querySelector("#forgotEmail"),
  authMessage: document.querySelector("#authMessage"),
  authTabs: document.querySelectorAll(".auth-tab"),
  dropZone: document.querySelector("#dropZone"),
  docNameInput: document.querySelector("#docNameInput"),
  docCategorySelect: document.querySelector("#docCategorySelect"),
  materialSourceSelect: document.querySelector("#materialSourceSelect"),
  materialTypeSelect: document.querySelector("#materialTypeSelect"),
  tagInput: document.querySelector("#tagInput"),
  sourceText: document.querySelector("#sourceText"),
  analyzeBtn: document.querySelector("#analyzeBtn"),
  saveUploadBtn: document.querySelector("#saveUploadBtn"),
  sampleBtn: document.querySelector("#sampleBtn"),
  clearBtn: document.querySelector("#clearBtn"),
  parseHint: document.querySelector("#parseHint"),
  analysisProgressBar: document.querySelector("#analysisProgressBar"),
  analysisProgressPercent: document.querySelector("#analysisProgressPercent"),
  analysisLog: document.querySelector("#analysisLog"),
  librarySearch: document.querySelector("#librarySearch"),
  libraryTagSearch: document.querySelector("#libraryTagSearch"),
  libraryCategoryFilter: document.querySelector("#libraryCategoryFilter"),
  libraryOwnerFilter: document.querySelector("#libraryOwnerFilter"),
  libraryTags: document.querySelector("#libraryTags"),
  documentList: document.querySelector("#documentList"),
  resetFilterBtn: document.querySelector("#resetFilterBtn"),
  topicTableBody: document.querySelector("#topicTableBody"),
  materialOverviewPage: document.querySelector("#materialOverviewPage"),
  topicHomeList: document.querySelector("#topicHomeList"),
  topicHomeArticle: document.querySelector("#topicHomeArticle"),
  uploadMaterialList: document.querySelector("#uploadMaterialList"),
  pendingUploadMaterialList: document.querySelector("#pendingUploadMaterialList"),
  topicSearchInput: document.querySelector("#topicSearchInput"),
  topicSourceFilter: document.querySelector("#topicSourceFilter"),
  topicTypeFilter: document.querySelector("#topicTypeFilter"),
  topicFavoriteFilter: document.querySelector("#topicFavoriteFilter"),
  topicOwnerFilter: document.querySelector("#topicOwnerFilter"),
  topicOwnerOptions: document.querySelector("#topicOwnerOptions"),
  newMaterialBtn: document.querySelector("#newMaterialBtn"),
  topNewMaterialBtn: document.querySelector("#topNewMaterialBtn"),
  appShell: document.querySelector(".app-shell"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  analyzedMaterialList: document.querySelector("#analyzedMaterialList"),
  deleteAnalyzedMaterialsBtn: document.querySelector("#deleteAnalyzedMaterialsBtn"),
  userBadge: document.querySelector("#userBadge"),
  accountBtn: document.querySelector("#accountBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  adminPage: document.querySelector("#adminPage"),
  categoryAdminPage: document.querySelector("#categoryAdminPage"),
  configPage: document.querySelector("#configPage"),
  materialManagePage: document.querySelector("#materialManagePage"),
  topicSkillPage: document.querySelector("#topicSkillPage"),
  articleSkillPage: document.querySelector("#articleSkillPage"),
  generatedArticlePage: document.querySelector("#generatedArticlePage"),
  recyclePage: document.querySelector("#recyclePage"),
  versionPage: document.querySelector("#versionPage"),
  configAnalyzeMode: document.querySelector("#configAnalyzeMode"),
  analysisSourceBadge: document.querySelector("#analysisSourceBadge"),
  docTitle: document.querySelector("#docTitle"),
  originalTextBody: document.querySelector("#originalTextBody"),
  oneLine: document.querySelector("#oneLine"),
  logicLine: document.querySelector("#logicLine"),
  metricTopics: document.querySelector("#metricTopics"),
  metricCategories: document.querySelector("#metricCategories"),
  metricQuotes: document.querySelector("#metricQuotes"),
  metricWords: document.querySelector("#metricWords"),
  categoryBoard: document.querySelector("#categoryBoard"),
  topicList: document.querySelector("#topicList"),
  topicArticle: document.querySelector("#topicArticle"),
  drillPage: document.querySelector("#drillPage"),
  quoteList: document.querySelector("#quoteList"),
  deepeningBoard: document.querySelector("#deepeningBoard"),
  exportBtn: document.querySelector("#exportBtn"),
  copyBtn: document.querySelector("#copyBtn"),
  moduleTabs: document.querySelectorAll(".module-tab"),
  studyTabs: document.querySelectorAll(".study-tab"),
};

const STORE_NAMES = [DOC_STORE, USER_STORE, EVENT_STORE, CATEGORY_STORE, PENDING_UPLOAD_STORE, GENERATED_ARTICLE_STORE];

function ensureObjectStores(db) {
  if (!db.objectStoreNames.contains(DOC_STORE)) {
    const store = db.createObjectStore(DOC_STORE, { keyPath: "id" });
    store.createIndex("updatedAt", "updatedAt");
  }
  if (!db.objectStoreNames.contains(USER_STORE)) {
    const store = db.createObjectStore(USER_STORE, { keyPath: "emailKey" });
    store.createIndex("role", "role");
    store.createIndex("status", "status");
    store.createIndex("createdAt", "createdAt");
  }
  if (!db.objectStoreNames.contains(EVENT_STORE)) {
    const store = db.createObjectStore(EVENT_STORE, { keyPath: "id" });
    store.createIndex("emailKey", "emailKey");
    store.createIndex("type", "type");
    store.createIndex("createdAt", "createdAt");
  }
  if (!db.objectStoreNames.contains(CATEGORY_STORE)) {
    const store = db.createObjectStore(CATEGORY_STORE, { keyPath: "id" });
    store.createIndex("ownerEmailKey", "ownerEmailKey");
    store.createIndex("createdAt", "createdAt");
  }
  if (!db.objectStoreNames.contains(PENDING_UPLOAD_STORE)) {
    const store = db.createObjectStore(PENDING_UPLOAD_STORE, { keyPath: "ownerEmailKey" });
    store.createIndex("updatedAt", "updatedAt");
  }
  if (!db.objectStoreNames.contains(GENERATED_ARTICLE_STORE)) {
    const store = db.createObjectStore(GENERATED_ARTICLE_STORE, { keyPath: "id" });
    store.createIndex("ownerEmailKey", "ownerEmailKey");
    store.createIndex("topicRef", "topicRef");
    store.createIndex("updatedAt", "updatedAt");
  }
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openNamedDatabase(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      ensureObjectStores(request.result);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function databaseExists(name) {
  if (!indexedDB.databases) {
    return false;
  }
  const databases = await indexedDB.databases();
  return databases.some((db) => db.name === name);
}

async function copyStoreData(sourceDb, targetDb, storeName) {
  if (!sourceDb.objectStoreNames.contains(storeName) || !targetDb.objectStoreNames.contains(storeName)) {
    return;
  }
  const targetCount = await idbRequest(targetDb.transaction(storeName, "readonly").objectStore(storeName).count());
  if (targetCount > 0) {
    return;
  }
  const items = await idbRequest(sourceDb.transaction(storeName, "readonly").objectStore(storeName).getAll());
  if (!items.length) {
    return;
  }
  await new Promise((resolve, reject) => {
    const transaction = targetDb.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    items.forEach((item) => store.put(item));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function migrateLegacyDatabase(targetDb) {
  const migrationKey = "wistalk-db-migrated-from-ceo-speech";
  if (localStorage.getItem(migrationKey) === "true" || !(await databaseExists(LEGACY_DB_NAME))) {
    return;
  }
  const sourceDb = await openNamedDatabase(LEGACY_DB_NAME);
  try {
    for (const storeName of STORE_NAMES) {
      await copyStoreData(sourceDb, targetDb, storeName);
    }
    localStorage.setItem(migrationKey, "true");
  } finally {
    sourceDb.close();
  }
}

async function openDatabase() {
  const db = await openNamedDatabase(DB_NAME);
  await migrateLegacyDatabase(db);
  return db;
}

async function withStore(storeName, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = callback(store);
    transaction.oncomplete = () => {
      db.close();
      resolve(result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function persistPendingUploads() {
  if (!state.currentUser) {
    return;
  }
  if (!state.uploadItems.length) {
    await withStore(PENDING_UPLOAD_STORE, "readwrite", (store) => store.delete(state.currentUser.emailKey));
    return;
  }
  const now = new Date().toISOString();
  const record = {
    ownerEmailKey: state.currentUser.emailKey,
    ownerEmail: state.currentUser.email,
    items: state.uploadItems,
    uploadBatchSaved: state.uploadBatchSaved,
    uploadAnalysisCompleted: state.uploadAnalysisCompleted,
    rawText: state.rawText,
    fileName: state.fileName,
    updatedAt: now,
  };
  await withStore(PENDING_UPLOAD_STORE, "readwrite", (store) => store.put(record));
}

async function clearPendingUploads() {
  if (!state.currentUser) {
    return;
  }
  await withStore(PENDING_UPLOAD_STORE, "readwrite", (store) => store.delete(state.currentUser.emailKey));
}

async function loadPendingUploads() {
  if (!state.currentUser) {
    return;
  }
  const record = await withStore(PENDING_UPLOAD_STORE, "readonly", (store) => {
    const request = store.get(state.currentUser.emailKey);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
  if (!record?.items?.length) {
    renderUploadMaterialList();
    renderPendingUploadMaterialList();
    updateUploadButtons();
    return;
  }
  state.uploadItems = removeCompletedPendingUploads(record.items.map((item) => ({ selected: true, overwrite: false, ...item })));
  state.uploadBatchSaved = true;
  state.uploadAnalysisCompleted = Boolean(record.uploadAnalysisCompleted);
  state.rawText = state.uploadItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
  state.fileName = record.fileName || state.uploadItems.map((item) => item.fileName).join("、");
  if (els.sourceText) {
    els.sourceText.value = state.rawText;
  }
  if (!state.uploadItems.length) {
    state.uploadBatchSaved = false;
    state.uploadAnalysisCompleted = false;
    state.rawText = "";
    state.fileName = "";
    await clearPendingUploads();
    setAnalysisIdle("暂无已保存待分析材料。");
    renderUploadMaterialList();
    renderPendingUploadMaterialList();
    return;
  } else if (state.uploadItems.length !== record.items.length) {
    state.uploadAnalysisCompleted = false;
    await persistPendingUploads();
  }
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
  setAnalysisIdle("已恢复未执行分析的材料，请勾选后执行分析。");
}

async function loadDocuments() {
  if (!state.currentUser) {
    state.allDocuments = [];
    state.documents = [];
    renderDocumentLibrary();
    return;
  }
  const docs = await withStore(DOC_STORE, "readonly", (store) => {
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
  state.allDocuments = docs;
  const materialCodeFixes = ensureUniqueMaterialCodes(state.allDocuments);
  if (materialCodeFixes.length) {
    await withStore(DOC_STORE, "readwrite", (store) => {
      materialCodeFixes.forEach((doc) => store.put(doc));
    });
    state.allDocuments = state.allDocuments.map((doc) => materialCodeFixes.find((item) => item.id === doc.id) || doc);
  }
  await normalizeCurrentUserMaterialReferences();
  const activeDocs = state.allDocuments.filter((doc) => !doc.deletedAt);
  const visibleDocs = isAdmin()
    ? activeDocs.filter((doc) => state.activeOwner === "all" || (doc.ownerEmailKey || "") === state.activeOwner)
    : activeDocs.filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === state.currentUser.emailKey);
  state.documents = visibleDocs.sort((a, b) => new Date(b.lastStudiedAt || b.updatedAt) - new Date(a.lastStudiedAt || a.updatedAt));
  renderDocumentLibrary();
  renderAnalyzedMaterialList();
  renderTopicFilters();
  renderMaterialOverviewPage();
  renderTopicHome();
  renderCategoryAdminPage();
  renderRecyclePage();
  if (isAdmin()) {
    renderAdminPage();
  }
}

async function loadGeneratedArticles() {
  if (!state.currentUser) {
    state.generatedArticles = [];
    renderGeneratedArticlePage();
    return;
  }
  const articles = await withStore(GENERATED_ARTICLE_STORE, "readonly", (store) => storeRequest(store, (s) => s.getAll()));
  const visible = isAdmin()
    ? articles
    : articles.filter((item) => item.ownerEmailKey === state.currentUser.emailKey);
  state.generatedArticles = visible.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  if (!state.generatedArticles.some((item) => item.id === state.activeGeneratedArticleId)) {
    state.activeGeneratedArticleId = state.generatedArticles[0]?.id || "";
  }
  renderGeneratedArticlePage();
}

async function saveGeneratedArticle(article) {
  await withStore(GENERATED_ARTICLE_STORE, "readwrite", (store) => store.put(article));
  await loadGeneratedArticles();
}

async function deleteGeneratedArticle(id) {
  const article = state.generatedArticles.find((item) => item.id === id);
  if (!article || (!isAdmin() && article.ownerEmailKey !== state.currentUser?.emailKey)) {
    return;
  }
  await withStore(GENERATED_ARTICLE_STORE, "readwrite", (store) => store.delete(id));
  if (state.activeGeneratedArticleId === id) {
    state.activeGeneratedArticleId = "";
  }
  await loadGeneratedArticles();
}

function resetArticleGeneration(mode = "", title = "") {
  state.articleGeneration = {
    active: false,
    background: false,
    completed: false,
    mode,
    topicRowId: "",
    articleId: "",
    percent: 0,
    title,
    message: "",
    logs: [],
    abortController: null,
  };
}

function setArticleGenerationProgress(percent, message, title = "") {
  state.articleGeneration.percent = Math.max(0, Math.min(100, Number(percent) || 0));
  state.articleGeneration.message = message || "";
  if (title) {
    state.articleGeneration.title = title;
  }
}

function appendArticleGenerationLog(message) {
  const line = {
    id: `article-log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    time: new Date().toISOString(),
    message,
  };
  state.articleGeneration.logs = [...(state.articleGeneration.logs || []), line].slice(-40);
}

function renderArticleGenerationProgressHtml(scope = "topic") {
  const task = state.articleGeneration;
  if (!task.active && !task.completed && !task.message) {
    return "";
  }
  const logs = (task.logs || []).slice(-6);
  const title = task.title || (task.mode === "refresh" ? "刷新生成文章" : "生成文章");
  return `
    <section class="article-generation-progress" data-scope="${escapeHtml(scope)}">
      <div class="article-generation-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(String(task.percent || 0))}%</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width:${escapeHtml(String(task.percent || 0))}%"></div>
      </div>
      <p>${escapeHtml(task.message || "等待执行。")}</p>
      ${logs.length ? `<div class="article-generation-log">${logs.map((log) => `<span>${escapeHtml(formatDate(log.time))} · ${escapeHtml(log.message)}</span>`).join("")}</div>` : ""}
    </section>
  `;
}

function showSkillContentModal(skill, title = "SKILL 内容", options = {}) {
  if (!skill) {
    return;
  }
  const editable = Boolean(options.editable);
  const skillKind = options.kind || "article";
  const overlay = document.createElement("div");
  overlay.className = "skill-diff-overlay skill-content-overlay";
  const close = () => overlay.remove();
  overlay.innerHTML = `
    <section class="skill-diff-dialog skill-content-dialog" role="dialog" aria-modal="true" aria-labelledby="skillContentTitle">
      <header class="skill-diff-header">
        <div>
          <p class="section-kicker">Skill.md</p>
          <h3 id="skillContentTitle">${escapeHtml(title)}</h3>
        </div>
        <button class="mini-button" type="button" data-skill-content-close>关闭</button>
      </header>
      <div class="topic-meta source-meta">
        <span class="pill">${escapeHtml(skill.skillFileName || skill.name || "SKILL.md")}</span>
        <span class="pill">${escapeHtml(skill.version || "未记录版本")}</span>
        <span class="pill">${escapeHtml(skill.summary || "暂无说明")}</span>
      </div>
      ${editable ? `
        <label class="skill-content-summary">
          <span>新版本说明</span>
          <input class="text-input compact-text-input" data-skill-content-summary maxlength="80" value="${escapeHtml(skillKind === "topic" ? "从材料/话题页修改话题 SKILL" : "从生成文章页修改文章 SKILL")}" />
        </label>
        <textarea class="text-input skill-content-editor" data-skill-content-editor>${escapeHtml(skill.prompt || "")}</textarea>
        <p class="category-notice compact" data-skill-content-message data-tone="info">只有 SKILL.md 内容发生变化时，才能保存为新版本。</p>
        <div class="skill-content-actions">
          <button class="mini-button" type="button" data-skill-content-close>取消</button>
          <button class="primary mini-button" type="button" data-skill-content-save disabled>保存为新 SKILL</button>
        </div>
      ` : `<pre class="skill-content-pre">${escapeHtml(skill.prompt || "暂无 SKILL 内容。")}</pre>`}
    </section>
  `;
  overlay.querySelectorAll("[data-skill-content-close]").forEach((button) => button.addEventListener("click", close));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  if (editable) {
    const editor = overlay.querySelector("[data-skill-content-editor]");
    const summaryInput = overlay.querySelector("[data-skill-content-summary]");
    const saveButton = overlay.querySelector("[data-skill-content-save]");
    const messageNode = overlay.querySelector("[data-skill-content-message]");
    let saving = false;
    const latestSkillForModal = () => skillKind === "topic"
      ? currentTopicSkill(skillTypeId(skill) || options.targetMaterialTypeId || "type-executive-view")
      : currentArticleSkill();
    const setMessage = (message, tone = "info") => {
      if (messageNode) {
        messageNode.textContent = message;
        messageNode.dataset.tone = tone;
      }
    };
    const syncSave = () => {
      if (saveButton) {
        const prompt = editor?.value || "";
        const latestSkill = latestSkillForModal();
        const empty = !normalizeSkillPromptForCompare(prompt);
        const sameAsOpened = sameSkillPrompt(prompt, skill.prompt || "");
        const sameAsLatest = sameSkillPrompt(prompt, latestSkill?.prompt || "");
        saveButton.disabled = saving || empty || sameAsOpened || sameAsLatest;
        if (empty) {
          setMessage("SKILL.md 内容不能为空。", "error");
        } else if (sameAsOpened) {
          setMessage("当前内容与打开的版本一致，不能保存为新版本。", "info");
        } else if (sameAsLatest) {
          setMessage("当前内容与最新版本一致，不能重复保存为新版本。", "info");
        } else {
          setMessage("已检测到内容变化，可以保存为新版本。", "success");
        }
      }
    };
    editor?.addEventListener("input", syncSave);
    saveButton?.addEventListener("click", async () => {
      const prompt = editor?.value.trim() || "";
      const summary = summaryInput?.value.trim() || (skillKind === "topic" ? "从材料/话题页修改话题 SKILL" : "从生成文章页修改文章 SKILL");
      const latestSkill = latestSkillForModal();
      if (!prompt || sameSkillPrompt(prompt, skill.prompt || "") || sameSkillPrompt(prompt, latestSkill?.prompt || "")) {
        syncSave();
        return;
      }
      const diffLog = buildSkillDiffLog(skill, { summary, prompt });
      const ok = await confirmAction({
        title: skillKind === "topic" ? "保存话题 SKILL 新版本" : "保存文章 SKILL 新版本",
        message: `确认将当前修改保存为新的${skillKind === "topic" ? "话题" : "文章"} SKILL 版本吗？\n\n与当前版本差异：\n${diffLog.map((item) => `- ${item}`).join("\n")}`,
        confirmText: "确认保存",
      });
      if (!ok) {
        return;
      }
      saving = true;
      saveButton.disabled = true;
      saveButton.textContent = "保存中...";
      try {
        if (skillKind === "topic") {
          const created = await createTopicSkillVersion(summary, prompt, diffLog, skillTypeId(skill) || options.targetMaterialTypeId || "type-executive-view");
          if (!created) {
            saving = false;
            saveButton.textContent = "保存为新 SKILL";
            syncSave();
            return;
          }
        } else {
          const created = await createArticleSkillVersion(summary, prompt, diffLog);
          if (!created) {
            saving = false;
            saveButton.textContent = "保存为新 SKILL";
            syncSave();
            return;
          }
        }
        close();
      } catch (error) {
        console.error(error);
        saving = false;
        saveButton.textContent = "保存为新 SKILL";
        setMessage(`保存失败：${error.message || "请稍后重试"}`, "error");
        syncSave();
      }
    });
    syncSave();
  }
  document.body.appendChild(overlay);
  overlay.querySelector("[data-skill-content-close]")?.focus();
}

function rowForGeneratedArticle(article) {
  if (!article) {
    return null;
  }
  return buildTopicRows().find((row) => row.docId === article.docId && Number(row.topicIndex) === Number(article.topicIndex))
    || {
      id: article.topicRef || `${article.docId || "doc"}::${article.topicIndex || 0}`,
      docId: article.docId || "",
      docTitle: article.docTitle || "",
      title: article.topicTitle || "",
      source: article.source || "",
      type: article.type || "",
      topicIndex: Number(article.topicIndex || 0),
      topic: {
        title: article.topicTitle || "",
        sourceSummary: article.source || "",
        problemEssence: article.coreViewpoint || "",
        evidence: [],
      },
    };
}

async function refreshGeneratedArticleWithLatestSkill(id) {
  const article = state.generatedArticles.find((item) => item.id === id);
  if (!article || (!isAdmin() && article.ownerEmailKey !== state.currentUser?.emailKey)) {
    return;
  }
  resetArticleGeneration("refresh", `刷新文章：${article.title || "未命名文章"}`);
  state.articleGeneration.active = true;
  state.articleGeneration.articleId = id;
  state.articleGeneration.abortController = new AbortController();
  setArticleGenerationProgress(8, "正在准备文章刷新上下文。");
  appendArticleGenerationLog(`准备刷新文章：${article.title || "未命名文章"}`);
  renderGeneratedArticlePage();
  const articleSkill = currentArticleSkill();
  const row = rowForGeneratedArticle(article);
  const idea = {
    title: article.ideaTitle || article.title,
    coreViewpoint: article.coreViewpoint,
    viewpoints: article.ideaViewpoints || article.selectedViewpoints || [],
    framework: article.framework || [],
  };
  const settings = readDeepSeekSettings();
  const selectedViewpoints = Array.isArray(article.selectedViewpoints) && article.selectedViewpoints.length
    ? article.selectedViewpoints
    : normalizeIdeaViewpoints(idea);
  try {
    setArticleGenerationProgress(25, `正在调用大模型，使用 ${skillDisplayName(articleSkill, "文章 SKILL.md")}。`);
    appendArticleGenerationLog(`调用大模型刷新正文，使用 ${skillDisplayName(articleSkill, "文章 SKILL.md")}`);
    renderGeneratedArticlePage();
    const payload = await callDeepSeek(settings, buildGeneratedArticlePrompt(row, idea, articleSkill, selectedViewpoints), { maxTokens: 14000, temperature: 0.45, signal: state.articleGeneration.abortController.signal });
    setArticleGenerationProgress(72, "大模型已返回，正在解析文章内容。");
    appendArticleGenerationLog("大模型已返回，开始解析 JSON。");
    renderGeneratedArticlePage();
    const parsed = parseJsonFromText(payload?.choices?.[0]?.message?.content || "");
    const result = parsed?.article || {};
    const now = new Date().toISOString();
    const updated = {
      ...article,
      title: result.title || article.title,
      coreViewpoint: result.coreViewpoint || article.coreViewpoint,
      framework: Array.isArray(result.framework) && result.framework.length ? result.framework : article.framework,
      content: normalizeGeneratedArticleContent(result.content || article.content),
      actionTip: result.actionTip || article.actionTip || "",
      learningTip: result.learningTip || article.learningTip || "",
      topicContext: topicWritingContext(row),
      ideaViewpoints: normalizeIdeaViewpoints(idea),
      selectedViewpoints,
      articleSkillId: articleSkill.id,
      articleSkillName: articleSkill.name,
      articleSkillVersion: articleSkill.version,
      articleSkillSummary: articleSkill.summary,
      articleSkillFileName: articleSkill.skillFileName,
      articleSkillAppliedAt: now,
      updatedAt: now,
    };
    setArticleGenerationProgress(88, "正在保存刷新后的文章。");
    appendArticleGenerationLog("正在保存刷新后的文章。");
    await saveGeneratedArticle(updated);
    await logEvent("refresh_generated_article_skill", { articleId: id, articleSkillVersion: articleSkill.version });
    state.articleGeneration.active = false;
    state.articleGeneration.completed = true;
    setArticleGenerationProgress(100, "文章已按最新 SKILL 刷新完成。");
    appendArticleGenerationLog("文章刷新完成。");
    renderGeneratedArticlePage();
  } catch (error) {
    state.articleGeneration.active = false;
    setArticleGenerationProgress(0, error.message || "文章刷新失败。");
    appendArticleGenerationLog(`刷新失败：${error.message}`);
    renderGeneratedArticlePage();
    throw error;
  } finally {
    state.articleGeneration.abortController = null;
    state.articleGeneration.background = false;
  }
}

async function loadDocCategories() {
  if (!state.currentUser) {
    state.docCategories = [];
    renderCategoryControls();
    renderCategoryAdminPage();
    return;
  }
  const categories = await withStore(CATEGORY_STORE, "readonly", (store) => storeRequest(store, (s) => s.getAll()));
  const visible = isAdmin()
    ? categories
    : categories.filter((item) => item.ownerEmailKey === state.currentUser.emailKey);
  state.docCategories = [...PRESET_CATEGORIES.map((item) => ({ ...item, isPreset: true })), ...visible.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))];
  renderCategoryControls();
  renderCategoryAdminPage();
}

function categoryById(id) {
  return state.docCategories.find((item) => item.id === id);
}

function setCategoryAdminNotice(message, tone = "info") {
  state.categoryAdminNotice = { message, tone };
}

function docBelongsToCategory(doc, categoryId) {
  if (categoryId === "preset-other") {
    return !doc.categoryId || doc.categoryId === categoryId;
  }
  return doc.categoryId === categoryId;
}

function canManageDoc(doc) {
  return isAdmin() || (doc.ownerEmailKey || "").toLowerCase() === state.currentUser.emailKey;
}

function manageableDocsForCategory(categoryId, scope = "all") {
  return state.allDocuments.filter((doc) => {
    if (!docBelongsToCategory(doc, categoryId) || !canManageDoc(doc)) {
      return false;
    }
    if (isAdmin() && scope !== "all") {
      return (doc.ownerEmailKey || "").toLowerCase() === scope;
    }
    return true;
  });
}

async function createDocCategory(name) {
  const normalized = String(name || "").trim().slice(0, 40);
  if (!normalized) {
    return;
  }
  const exists = state.docCategories.some((item) => item.name === normalized && item.ownerEmailKey === state.currentUser.emailKey);
  if (exists) {
    els.parseHint.textContent = "这个分类已经存在。";
    return;
  }
  const now = new Date().toISOString();
  const category = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalized,
    ownerEmail: state.currentUser.email,
    ownerEmailKey: state.currentUser.emailKey,
    createdAt: now,
  };
  await withStore(CATEGORY_STORE, "readwrite", (store) => store.put(category));
  await logEvent("create_category", { categoryId: category.id, name: category.name });
  await loadDocCategories();
}

async function deleteDocCategory(id) {
  const category = categoryById(id);
  if (!category || category.isPreset || (!isAdmin() && category.ownerEmailKey !== state.currentUser.emailKey)) {
    return;
  }
  const affectedDocs = state.allDocuments.filter((doc) => docBelongsToCategory(doc, id));
  if (affectedDocs.length) {
    setCategoryAdminNotice(`该分类下还有 ${affectedDocs.length} 篇文档，不能删除。请先迁移或清空后再删除。`, "error");
    renderCategoryAdminPage();
    return;
  }
  await withStore(CATEGORY_STORE, "readwrite", (store) => store.delete(id));
  await logEvent("delete_category", { categoryId: id, name: category.name });
  await loadDocCategories();
  await loadDocuments();
}

async function transferCategoryDocs(sourceCategoryId, targetCategoryId, scope = "all") {
  const source = categoryById(sourceCategoryId);
  const target = categoryById(targetCategoryId);
  if (!source || !target || source.id === target.id) {
    setCategoryAdminNotice("请选择不同的来源分类和目标分类。", "error");
    renderCategoryAdminPage();
    return;
  }
  const docs = manageableDocsForCategory(source.id, scope);
  if (!docs.length) {
    setCategoryAdminNotice("当前没有可转移的文档。", "info");
    renderCategoryAdminPage();
    return;
  }
  const now = new Date().toISOString();
  for (const doc of docs) {
    await withStore(DOC_STORE, "readwrite", (store) =>
      store.put({
        ...doc,
        categoryId: target.id,
        categoryName: target.name,
        updatedAt: now,
      }));
  }
  await logEvent("transfer_category_docs", {
    sourceCategoryId: source.id,
    targetCategoryId: target.id,
    count: docs.length,
    scope,
  });
  setCategoryAdminNotice(`已将 ${docs.length} 篇文档从“${source.name}”转移到“${target.name}”。`, "success");
  await loadDocuments();
  await loadDocCategories();
}

function renderCategoryControls() {
  const currentDocValue = els.docCategorySelect.value;
  const filterValue = state.activeDocCategory;
  const options = []
    .concat(state.docCategories.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  els.docCategorySelect.innerHTML = options;
  els.docCategorySelect.value = currentDocValue && categoryById(currentDocValue) ? currentDocValue : "preset-other";

  const filterOptions = [`<option value="">全部分类</option>`]
    .concat(state.docCategories.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  els.libraryCategoryFilter.innerHTML = filterOptions;
  els.libraryCategoryFilter.value = filterValue;
}

function renderCategoryAdminPage() {
  if (!els.categoryAdminPage) {
    return;
  }
  state.categoryTransferSource = state.categoryTransferSource || state.docCategories[0]?.id || "";
  state.categoryTransferTarget = state.categoryTransferTarget || state.docCategories[1]?.id || state.docCategories[0]?.id || "";
  const rows = state.docCategories
    .map((category) => {
      const count = state.allDocuments.filter((doc) => docBelongsToCategory(doc, category.id)).length;
      const owner = isAdmin() ? `<td>${escapeHtml(category.isPreset ? "系统预设" : category.ownerEmail || "")}</td>` : "";
      const action = category.isPreset
        ? `<span class="muted-text">固定分类</span>`
        : `<button class="mini-button danger" type="button" data-category-delete="${escapeHtml(category.id)}" ${count ? "disabled" : ""}>删除</button>`;
      return `
        <tr>
          <td>${escapeHtml(category.name)}${category.isPreset ? `<span class="fixed-mark">预设</span>` : ""}</td>
          ${owner}
          <td>${count}</td>
          <td>${category.isPreset ? "系统预设" : formatDate(category.createdAt)}</td>
          <td>${action}</td>
        </tr>
      `;
    })
    .join("");
  const ownerHead = isAdmin() ? "<th>创建人</th>" : "";
  const ownerScopeOptions = isAdmin()
    ? [
        `<option value="all">所有用户</option>`,
        `<option value="${escapeHtml(state.currentUser.emailKey)}">只看自己</option>`,
        ...state.users
          .filter((user) => user.emailKey !== state.currentUser.emailKey)
          .map((user) => `<option value="${escapeHtml(user.emailKey)}">${escapeHtml(user.email)}</option>`),
      ].join("")
    : "";
  const sourceOptions = state.docCategories.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
  const targetOptions = state.docCategories.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
  const notice = state.categoryAdminNotice?.message
    ? `<p class="category-notice" data-tone="${escapeHtml(state.categoryAdminNotice.tone || "info")}">${escapeHtml(state.categoryAdminNotice.message)}</p>`
    : "";
  els.categoryAdminPage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Document Taxonomy</p>
        <h2>文档分类管理</h2>
      </div>
      <p>有文档占用的分类不能删除；先把文档转移出去，再删除分类。</p>
    </div>
    <form class="category-create-form" id="categoryCreateForm">
      <input class="text-input" id="newCategoryName" type="text" placeholder="新分类，例如：战略会、AI专题、组织管理" />
      <button class="primary" type="submit">创建分类</button>
    </form>
    <section class="category-transfer-panel">
      <div class="panel-head">
        <h3>转移分类文档</h3>
        <p>把某个分类下的文档批量迁移到另一个分类，迁移后原分类才可删除。</p>
      </div>
      <div class="category-transfer-form">
        <select class="text-input" id="transferSourceCategory">${sourceOptions}</select>
        <select class="text-input" id="transferTargetCategory">${targetOptions}</select>
        ${isAdmin() ? `<select class="text-input" id="transferScope">${ownerScopeOptions}</select>` : ""}
        <button class="primary" type="button" id="transferCategoryDocsBtn">执行转移</button>
      </div>
    </section>
    ${notice}
    <section class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>分类名称</th>
            ${ownerHead}
            <th>文档数</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="${isAdmin() ? 5 : 4}">还没有分类。</td></tr>`}</tbody>
      </table>
    </section>
  `;
  els.categoryAdminPage.querySelector("#categoryCreateForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const ok = await confirmAction({
      title: "创建分类",
      message: "确认创建这个文档分类吗？创建后会出现在分类筛选和文档分类中。",
      confirmText: "确认创建",
    });
    if (!ok) {
      return;
    }
    const input = els.categoryAdminPage.querySelector("#newCategoryName");
    await createDocCategory(input.value);
    input.value = "";
  });
  const transferSource = els.categoryAdminPage.querySelector("#transferSourceCategory");
  const transferTarget = els.categoryAdminPage.querySelector("#transferTargetCategory");
  const transferScope = els.categoryAdminPage.querySelector("#transferScope");
  if (transferSource) {
    transferSource.value = state.categoryTransferSource || transferSource.value || "";
    transferSource.addEventListener("change", () => {
      state.categoryTransferSource = transferSource.value;
    });
  }
  if (transferTarget) {
    transferTarget.value = state.categoryTransferTarget || transferTarget.value || "";
    transferTarget.addEventListener("change", () => {
      state.categoryTransferTarget = transferTarget.value;
    });
  }
  if (transferScope) {
    transferScope.value = state.categoryTransferScope || "all";
    transferScope.addEventListener("change", () => {
      state.categoryTransferScope = transferScope.value;
      renderCategoryAdminPage();
    });
  }
  const transferButton = els.categoryAdminPage.querySelector("#transferCategoryDocsBtn");
  if (transferButton) {
    transferButton.addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "执行分类转移",
        message: "确认把所选分类下的文档转移到目标分类吗？转移后会影响这些文档的分类归属。",
        confirmText: "确认转移",
      });
      if (!ok) {
        return;
      }
      const sourceId = transferSource?.value || state.categoryTransferSource;
      const targetId = transferTarget?.value || state.categoryTransferTarget;
      await transferCategoryDocs(sourceId, targetId, state.categoryTransferScope || "all");
    });
  }
  els.categoryAdminPage.querySelectorAll("[data-category-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "删除分类",
        message: "确认删除这个分类吗？如果里面还有文档，系统会阻止删除。",
        confirmText: "确认删除",
        tone: "danger",
      });
      if (ok) {
        await deleteDocCategory(button.dataset.categoryDelete);
      }
    });
  });
}

async function saveCurrentDocument() {
  if (!state.analysis) {
    return null;
  }

  const now = new Date().toISOString();
  const title = normalizeDocTitle(els.docNameInput.value || state.fileName || "未命名材料");
  const tags = parseTags(els.tagInput.value);
  const category = categoryById(els.docCategorySelect.value);
  const materialSource = materialSourceById(els.materialSourceSelect?.value);
  const materialType = materialTypeById(els.materialTypeSelect?.value);
  const existing = state.documents.find((doc) => doc.id === state.currentDocId);
  const materialCode = existing?.materialCode || nextMaterialCode(state.allDocuments.map((doc) => doc.materialCode).filter(Boolean));
  const doc = {
    id: state.currentDocId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    materialCode,
    title,
    fileName: state.fileName || title,
    categoryId: category?.id || "",
    categoryName: category?.name || "",
    materialSourceId: materialSource?.id || "",
    materialSourceName: materialSource?.name || "",
    materialTypeId: materialType?.id || "",
    materialTypeName: materialType?.name || "",
    materialTypeTemplate: materialType?.name || "",
    tags,
    rawText: state.rawText,
    analysis: state.analysis,
    ownerEmail: state.currentUser.email,
    ownerEmailKey: state.currentUser.emailKey,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    lastStudiedAt: now,
  };

  await withStore(DOC_STORE, "readwrite", (store) => store.put(doc));
  await logEvent("upload", { docId: doc.id, title: doc.title });
  state.currentDocId = doc.id;
  await loadDocuments();
  return doc;
}

function withSkillMetadata(analysis, skill) {
  return {
    ...analysis,
    skillId: skill.id,
    skillName: skill.name,
    skillVersion: skill.version,
    skillSummary: skill.summary,
    targetMaterialTypeId: skill.targetMaterialTypeId || "type-executive-view",
    targetMaterialTypeName: skill.targetMaterialTypeName || "高层视角",
    skillFileName: skill.skillFileName || "SKILL.md",
    skillAppliedAt: new Date().toISOString(),
  };
}

async function saveAnalyzedDocument(item, analysis) {
  const now = new Date().toISOString();
  const materialSource = materialSourceByKey(item.materialSourceId, item.materialSourceName);
  const materialType = materialTypeByKey(item.materialTypeId, item.materialTypeName);
  const skill = item.skill || currentTopicSkill(materialType?.id || item.materialTypeId || "type-executive-view");
  const category = categoryById("preset-other");
  const existingDoc = item.overwrite && item.existingDocId
    ? state.allDocuments.find((doc) => doc.id === item.existingDocId)
    : null;
  const materialCode = existingDoc?.materialCode || nextMaterialCode(state.allDocuments.map((doc) => doc.materialCode).filter(Boolean));
  const codedAnalysis = preserveTopicFavorites(existingDoc, withSkillMetadata(assignTopicCodesToAnalysis(analysis, existingDoc?.id || ""), skill));
  const skillAnalyses = { ...(existingDoc?.skillAnalyses || {}), [skill.version]: codedAnalysis };
  const doc = {
    id: existingDoc?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    materialCode,
    title: normalizeDocTitle(item.title || item.fileName || "未命名材料"),
    fileName: item.fileName || item.title,
    sourceUrl: item.sourceUrl || existingDoc?.sourceUrl || "",
    fileSize: item.fileSize || 0,
    fileFingerprint: item.fileFingerprint || materialFingerprint(item.fileName, item.fileSize, item.rawText),
    categoryId: category?.id || "",
    categoryName: category?.name || "其他",
    materialSourceId: materialSource?.id || "",
    materialSourceName: materialSource?.name || "",
    materialTypeId: materialType?.id || "",
    materialTypeName: materialType?.name || "",
    materialTypeTemplate: materialType?.name || "",
    tags: codedAnalysis.suggestedTags || [],
    rawText: item.rawText,
    analysis: codedAnalysis,
    skillAnalyses,
    currentSkillVersion: skill.version,
    currentSkillName: skill.name,
    currentSkillAppliedAt: now,
    ownerEmail: state.currentUser.email,
    ownerEmailKey: state.currentUser.emailKey,
    createdAt: existingDoc?.createdAt || now,
    updatedAt: now,
    lastStudiedAt: now,
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(doc));
  await logEvent("upload", { docId: doc.id, title: doc.title });
  await loadDocuments();
  return doc;
}

async function deleteDocument(id) {
  const doc = state.allDocuments.find((item) => item.id === id);
  if (!doc || (!isAdmin() && doc.ownerEmailKey !== state.currentUser.emailKey)) {
    return;
  }
  const updated = {
    ...doc,
    deletedAt: new Date().toISOString(),
    deletedBy: state.currentUser.email,
    updatedAt: new Date().toISOString(),
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await logEvent("delete_doc", { docId: id, title: doc.title });
  if (state.currentDocId === id) {
    clearWorkspace();
  }
  await loadDocuments();
}

async function restoreDocument(id) {
  if (!isAdmin()) {
    return;
  }
  const doc = state.allDocuments.find((item) => item.id === id);
  if (!doc) {
    return;
  }
  const updated = { ...doc, deletedAt: "", deletedBy: "", updatedAt: new Date().toISOString() };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await logEvent("restore_doc", { docId: id, title: doc.title });
  await loadDocuments();
}

async function hardDeleteDocument(id) {
  if (!isAdmin()) {
    return;
  }
  const doc = state.allDocuments.find((item) => item.id === id);
  if (!doc) {
    return;
  }
  await withStore(DOC_STORE, "readwrite", (store) => store.delete(id));
  await logEvent("hard_delete_doc", { docId: id, title: doc.title });
  await loadDocuments();
}

function parseTags(value) {
  return [...new Set(
    String(value || "")
      .split(/[,，、\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8),
  )];
}

function normalizeDocTitle(value) {
  return String(value || "").trim().slice(0, 80) || "未命名材料";
}

function normalizeEmail(value) {
  return String(value || "").trim();
}

function emailKey(value) {
  return normalizeEmail(value).toLowerCase();
}

function isFanruanEmail(value) {
  return /^[^\s@]+@fanruan\.com$/i.test(normalizeEmail(value));
}

function isAdmin(user = state.currentUser) {
  return Boolean(user && user.role === "admin");
}

function validatePassword(password) {
  const rules = [
    { ok: password.length >= 10, text: "至少 10 位" },
    { ok: /[A-Z]/.test(password), text: "包含大写字母" },
    { ok: /[a-z]/.test(password), text: "包含小写字母" },
    { ok: /\d/.test(password), text: "包含数字" },
    { ok: /[^A-Za-z0-9]/.test(password), text: "包含特殊字符" },
  ];
  const failed = rules.filter((rule) => !rule.ok).map((rule) => rule.text);
  return {
    ok: failed.length === 0,
    message: failed.length ? `密码复杂度不足：${failed.join("、")}。` : "",
  };
}

function selectedRememberDuration() {
  return [...els.rememberDuration].find((input) => input.checked)?.value || "7";
}

function normalizeRememberDuration(value) {
  return ["7", "30", "forever"].includes(String(value)) ? String(value) : "7";
}

function rememberLabel(value) {
  const duration = normalizeRememberDuration(value);
  if (duration === "forever") {
    return "永远";
  }
  return `${duration} 天`;
}

function buildSession(emailKeyValue, duration) {
  const now = Date.now();
  const normalizedDuration = normalizeRememberDuration(duration);
  const expiresAt = normalizedDuration === "forever"
    ? null
    : now + Number(normalizedDuration) * 24 * 60 * 60 * 1000;
  return {
    emailKey: emailKeyValue,
    remember: normalizedDuration,
    createdAt: now,
    expiresAt,
  };
}

function sessionMaxAge(duration) {
  const normalizedDuration = normalizeRememberDuration(duration);
  return normalizedDuration === "forever"
    ? 10 * 365 * 24 * 60 * 60
    : Number(normalizedDuration) * 24 * 60 * 60;
}

function writeSessionCookie(session) {
  const maxAge = sessionMaxAge(session?.remember);
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function readCookieJson(name) {
  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(decodeURIComponent(item.slice(name.length + 1)));
  } catch (error) {
    return null;
  }
}

function readSessionCookie() {
  const session = readCookieJson(SESSION_COOKIE_NAME) || readCookieJson(LEGACY_SESSION_COOKIE_NAME);
  if (!session) {
    clearSessionCookie();
  }
  return session;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = `${LEGACY_SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function persistSession(session) {
  writeSessionCookie(session);
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(LEGACY_SESSION_KEY);
    localStorage.removeItem("ceo-speech-current-user");
  } catch (error) {
    // Cookie fallback keeps the remember-login flow working if localStorage is restricted.
  }
}

function saveSession(emailKeyValue, duration) {
  persistSession(buildSession(emailKeyValue, duration));
}

function readSession() {
  let raw = "";
  try {
    raw = localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
  } catch (error) {
    return readSessionCookie();
  }
  if (!raw) {
    let legacyKey = "";
    try {
      legacyKey = localStorage.getItem("ceo-speech-current-user");
    } catch (error) {
      legacyKey = "";
    }
    return legacyKey ? buildSession(legacyKey, "7") : readSessionCookie();
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LEGACY_SESSION_KEY);
    } catch (storageError) {
      // Ignore and continue with cookie fallback.
    }
    return readSessionCookie();
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
    localStorage.removeItem("ceo-speech-current-user");
  } catch (error) {
    // Ignore storage cleanup errors; cookie cleanup below is the important fallback.
  }
  clearSessionCookie();
}

function isSessionExpired(session) {
  return Boolean(session?.expiresAt && Date.now() > session.expiresAt);
}

function renewSession(session) {
  if (!session?.emailKey) {
    return;
  }
  persistSession(buildSession(session.emailKey, session.remember));
}

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const array = new Uint32Array(14);
  crypto.getRandomValues(array);
  const raw = [...array].map((value) => chars[value % chars.length]).join("");
  return `F${raw}9!a`;
}

async function hashPassword(password, salt = crypto.randomUUID()) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  const hash = [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return { salt, hash };
}

async function verifyPassword(password, user) {
  if (!user?.passwordHash || !user?.salt) {
    return false;
  }
  const hashed = await hashPassword(password, user.salt);
  return hashed.hash === user.passwordHash;
}

function storeRequest(store, requestFactory) {
  return new Promise((resolve, reject) => {
    const request = requestFactory(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getUser(email) {
  const key = emailKey(email);
  return withStore(USER_STORE, "readonly", (store) => storeRequest(store, (s) => s.get(key)));
}

async function putUser(user) {
  await withStore(USER_STORE, "readwrite", (store) => store.put(user));
}

async function loadUsers() {
  const users = await withStore(USER_STORE, "readonly", (store) => storeRequest(store, (s) => s.getAll()));
  state.users = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (isAdmin()) {
    renderAdminPage();
  }
}

async function ensureAdminUser() {
  const existing = await getUser(ADMIN_EMAIL);
  if (existing) {
    return existing;
  }
  const now = new Date().toISOString();
  const bootstrapPassword = randomPassword();
  const password = await hashPassword(bootstrapPassword);
  const admin = {
    email: ADMIN_EMAIL,
    emailKey: ADMIN_EMAIL_KEY,
    role: "admin",
    status: "active",
    passwordHash: password.hash,
    salt: password.salt,
    createdAt: now,
    registeredAt: now,
    approvedAt: now,
    lastLoginAt: "",
    loginCount: 0,
    visitCount: 0,
    passwordChangedAt: "",
    pendingReset: false,
    resetRequestedAt: "",
    initialPasswordGeneratedAt: now,
  };
  await putUser(admin);
  localStorage.setItem(ADMIN_BOOTSTRAP_PASSWORD_KEY, bootstrapPassword);
  localStorage.removeItem(LEGACY_ADMIN_BOOTSTRAP_PASSWORD_KEY);
  return admin;
}

function selectedTheme() {
  const themeId = state.currentUser?.theme || THEMES[0].id;
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}

function readDeepSeekSettings() {
  return {
    ...DEFAULT_DEEPSEEK_SETTINGS,
    ...(state.currentUser?.deepseekSettings || {}),
  };
}

async function saveDeepSeekSettings(settings) {
  if (!state.currentUser) {
    return;
  }
  const updated = {
    ...state.currentUser,
    deepseekSettings: {
      ...DEFAULT_DEEPSEEK_SETTINGS,
      ...settings,
    },
    deepseekSettingsUpdatedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
}

function readFontSettings() {
  return { ...DEFAULT_FONT_SETTINGS, ...(state.currentUser?.fontSettings || {}) };
}

function saveFontSettings(settings) {
  const next = {
    ...DEFAULT_FONT_SETTINGS,
    ...settings,
  };
  if (state.currentUser) {
    const updated = { ...state.currentUser, fontSettings: next, fontSettingsUpdatedAt: new Date().toISOString() };
    state.currentUser = updated;
    putUser(updated).catch(() => {});
  }
}

function applyFontSettings(settings = readFontSettings()) {
  const merged = { ...DEFAULT_FONT_SETTINGS, ...settings };
  state.fontSettings = merged;
  const root = document.documentElement;
  root.style.setProperty("--body-font-size", merged.bodySize);
  root.style.setProperty("--button-font-size", merged.buttonSize);
  root.style.setProperty("--title-font-size", merged.titleSize);
}

function readConfigList(key, defaults) {
  const userItems = key === MATERIAL_SOURCES_KEY
    ? state.currentUser?.materialSources
    : state.currentUser?.materialTypes;
  const custom = Array.isArray(userItems) ? userItems : [];
  const mergedDefaults = defaults.map((def) => {
    const override = custom.find((item) => item.id === def.id);
    return override ? { ...def, ...override, isPreset: def.isPreset } : def;
  });
  const extraCustom = custom.filter((item) => !defaults.some((def) => def.id === item.id));
  return [...mergedDefaults, ...extraCustom];
}

async function saveConfigList(key, defaults, items) {
  const custom = items
    .filter((item) => {
      const def = defaults.find((entry) => entry.id === item.id);
      if (!def) {
        return !item.isPreset;
      }
      return item.name !== def.name;
    })
    .map((item) => {
      const def = defaults.find((entry) => entry.id === item.id);
      return def ? { ...item, isPreset: def.isPreset } : { ...item, isPreset: false };
    });
  if (!state.currentUser) {
    return;
  }
  const field = key === MATERIAL_SOURCES_KEY ? "materialSources" : "materialTypes";
  const updated = {
    ...state.currentUser,
    [field]: custom,
    materialTaxonomyUpdatedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
}

function loadMaterialTaxonomy() {
  state.materialSources = readConfigList(MATERIAL_SOURCES_KEY, DEFAULT_MATERIAL_SOURCES);
  state.materialTypes = readConfigList(MATERIAL_TYPES_KEY, DEFAULT_MATERIAL_TYPES);
  renderMaterialControls();
}

function skillTypeId(skill) {
  return skill?.targetMaterialTypeId || "type-executive-view";
}

function parseSkillVersionParts(version = "") {
  const matched = String(version || "").match(/^v?(\d+)(?:\.(\d+))?/i);
  return {
    major: matched ? Number(matched[1] || 0) : 0,
    minor: matched ? Number(matched[2] || 0) : 0,
  };
}

function compareSkillVersions(a, b) {
  const left = parseSkillVersionParts(a?.version);
  const right = parseSkillVersionParts(b?.version);
  if (left.major !== right.major) {
    return right.major - left.major;
  }
  if (left.minor !== right.minor) {
    return right.minor - left.minor;
  }
  return Number(b?.versionNumber || 0) - Number(a?.versionNumber || 0);
}

function normalizeSkillPromptForCompare(prompt = "") {
  return String(prompt || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function sameSkillPrompt(left = "", right = "") {
  return normalizeSkillPromptForCompare(left) === normalizeSkillPromptForCompare(right);
}

function dedupeTopicSkills(skills) {
  const map = new Map();
  skills.filter(Boolean).forEach((skill) => {
    const key = `${skillTypeId(skill)}::${skill.version || ""}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, skill);
      return;
    }
    if (!existing.isPreset && skill.isPreset) {
      return;
    }
    if (existing.isPreset && !skill.isPreset) {
      map.set(key, skill);
      return;
    }
    const existingTime = new Date(existing.createdAt || 0).getTime();
    const skillTime = new Date(skill.createdAt || 0).getTime();
    if (skillTime > existingTime) {
      map.set(key, skill);
    }
  });
  return [...map.values()].sort(compareSkillVersions);
}

function loadTopicSkills() {
  const custom = Array.isArray(state.currentUser?.topicSkills) ? state.currentUser.topicSkills : [];
  const normalizedCustom = custom.map((item) => {
    const type = materialTypeById(item.targetMaterialTypeId || "type-executive-view");
    const typeName = type?.name || item.targetMaterialTypeName || "高层视角";
    return {
      targetMaterialTypeId: item.targetMaterialTypeId || "type-executive-view",
      ...item,
      name: skillNameForMaterialType(typeName, item.targetMaterialTypeId || "type-executive-view"),
      targetMaterialTypeName: typeName,
      skillFileName: item.skillFileName || skillFileNameForMaterialType(typeName, item.targetMaterialTypeId || "type-executive-view"),
      changeLog: Array.isArray(item.changeLog) ? item.changeLog : [],
    };
  });
  const defaultSkills = [
    topicSkillTemplateForMaterialType("type-executive-view"),
    topicSkillTemplateForMaterialType("type-meeting-notes"),
    topicSkillTemplateForMaterialType("type-training-speech"),
  ];
  state.topicSkills = dedupeTopicSkills([
    ...defaultSkills,
    ...normalizedCustom.filter((item) => item.version !== DEFAULT_TOPIC_SKILL.version || skillTypeId(item) !== "type-executive-view"),
  ]);
}

function dedupeArticleSkills(skills) {
  const map = new Map();
  skills.filter(Boolean).forEach((skill) => {
    const key = skill.version || "";
    const existing = map.get(key);
    if (!existing) {
      map.set(key, skill);
      return;
    }
    if (!existing.isPreset && skill.isPreset) {
      return;
    }
    if (existing.isPreset && !skill.isPreset) {
      map.set(key, skill);
      return;
    }
    const existingTime = new Date(existing.createdAt || 0).getTime();
    const skillTime = new Date(skill.createdAt || 0).getTime();
    if (skillTime > existingTime) {
      map.set(key, skill);
    }
  });
  return [...map.values()].sort(compareSkillVersions);
}

function loadArticleSkills() {
  const custom = Array.isArray(state.currentUser?.articleSkills) ? state.currentUser.articleSkills : [];
  state.articleSkills = dedupeArticleSkills([
    DEFAULT_ARTICLE_SKILL,
    ...custom
      .filter((item) => item.version !== DEFAULT_ARTICLE_SKILL.version)
      .map((item) => ({
        ...item,
        name: item.name || DEFAULT_ARTICLE_SKILL.name,
        skillFileName: item.skillFileName || DEFAULT_ARTICLE_SKILL.skillFileName,
        changeLog: Array.isArray(item.changeLog) ? item.changeLog : [],
      })),
  ]);
}

function currentTopicSkill(materialTypeId = "type-executive-view") {
  const scoped = state.topicSkills.filter((skill) => skillTypeId(skill) === materialTypeId).sort(compareSkillVersions);
  return scoped[0] || topicSkillTemplateForMaterialType(materialTypeId);
}

function currentArticleSkill() {
  return (state.articleSkills || []).slice().sort(compareSkillVersions)[0] || DEFAULT_ARTICLE_SKILL;
}

function articleSkillByVersion(version = "") {
  return state.articleSkills.find((skill) => skill.version === version) || currentArticleSkill();
}

function skillByVersion(version, materialTypeId = "type-executive-view") {
  return state.topicSkills.find((skill) => skill.version === version && skillTypeId(skill) === materialTypeId)
    || state.topicSkills.find((skill) => skill.version === version)
    || currentTopicSkill(materialTypeId);
}

function skillVersionNumber(version) {
  const matched = String(version || "").match(/v\d+\.(\d+)/i);
  if (matched) {
    return Number(matched[1]) + 1;
  }
  return 0;
}

function skillMetaForAnalysis(version, analysis) {
  const targetTypeId = analysis?.targetMaterialTypeId || "type-executive-view";
  const targetTypeName = materialTypeById(targetTypeId)?.name || analysis?.targetMaterialTypeName || "高层视角";
  const ownedSkill = state.topicSkills.find((skill) => skill.version === version && skillTypeId(skill) === targetTypeId)
    || state.topicSkills.find((skill) => skill.version === version);
  if (ownedSkill) {
    return ownedSkill;
  }
  return {
    id: analysis?.skillId || `topic-skill-${version}`,
    name: skillNameForMaterialType(targetTypeName, targetTypeId),
    version,
    versionNumber: skillVersionNumber(version),
    summary: analysis?.skillSummary || "历史 SKILL 版本",
    prompt: "",
    targetMaterialTypeId: analysis?.targetMaterialTypeId || "type-executive-view",
    targetMaterialTypeName: targetTypeName,
    skillFileName: analysis?.skillFileName || skillFileNameForMaterialType(targetTypeName, targetTypeId),
    createdAt: analysis?.skillAppliedAt || "",
    isPreset: false,
  };
}

function materialTypeKind(materialTypeId = "", typeName = "") {
  const id = String(materialTypeId || "").trim();
  const name = String(typeName || "").trim();
  if (id === "type-meeting-notes" || name === "会议纪要") {
    return "meeting";
  }
  if (id === "type-training-speech" || name === "培训讲话") {
    return "training";
  }
  return "topic";
}

function skillNameForMaterialType(typeName = "高层视角", materialTypeId = "") {
  const name = String(typeName || "资料类型").trim();
  const kind = materialTypeKind(materialTypeId, name);
  if (kind === "meeting" || kind === "training") {
    return `${name}分析 SKILL`;
  }
  return `${name}话题拆解 SKILL`;
}

function skillNameForMaterialTypeName(typeName = "高层视角") {
  return skillNameForMaterialType(typeName);
}

function skillFileNameForMaterialType(typeName = "高层视角", materialTypeId = "") {
  return `${skillNameForMaterialType(typeName, materialTypeId)}.md`;
}

function skillFileNameForMaterialTypeName(typeName = "高层视角") {
  return skillFileNameForMaterialType(typeName);
}

function defaultTopicSkillPromptForMaterialType(typeName = "高层视角", materialTypeId = "") {
  const safeTypeName = String(typeName || "资料类型").trim();
  const kind = materialTypeKind(materialTypeId, safeTypeName);
  if (kind === "meeting") {
    return DEFAULT_MEETING_SKILL_PROMPT;
  }
  if (kind === "training") {
    return DEFAULT_TRAINING_SKILL_PROMPT;
  }
  return DEFAULT_TOPIC_SKILL_PROMPT
    .replace(/高层视角话题拆解 SKILL\.md/g, skillFileNameForMaterialType(safeTypeName, materialTypeId))
    .replace(/适用材料类型：高层视角/g, `适用材料类型：${safeTypeName}`)
    .replace(/高层视角/g, safeTypeName);
}

function topicSkillTemplateForMaterialType(materialTypeId = "type-executive-view") {
  const type = materialTypeById(materialTypeId) || DEFAULT_MATERIAL_TYPES[0];
  const isExecutive = materialTypeId === "type-executive-view";
  const typeName = type.name || "高层视角";
  const kind = materialTypeKind(materialTypeId, typeName);
  return {
    ...DEFAULT_TOPIC_SKILL,
    id: isExecutive ? DEFAULT_TOPIC_SKILL.id : `topic-skill-default-${materialTypeId}`,
    version: kind === "training" ? "v1.5" : DEFAULT_TOPIC_SKILL.version,
    versionNumber: kind === "training" ? 6 : DEFAULT_TOPIC_SKILL.versionNumber,
    name: skillNameForMaterialType(typeName, materialTypeId),
    summary: isExecutive
      ? DEFAULT_TOPIC_SKILL.summary
      : kind === "meeting"
        ? `面向${typeName}材料的标准${skillFileNameForMaterialType(typeName, materialTypeId)}，输出会议纪要分析并按需提炼可学习话题。`
        : kind === "training"
          ? `面向技术培训和业务培训材料的标准${skillFileNameForMaterialType(typeName, materialTypeId)}，输出培训分析并按需提炼可学习话题。`
        : `面向${typeName}材料的初始${skillFileNameForMaterialType(typeName, materialTypeId)}，可在此基础上发布专属版本。`,
    prompt: isExecutive
      ? DEFAULT_TOPIC_SKILL_PROMPT
      : defaultTopicSkillPromptForMaterialType(typeName, materialTypeId),
    targetMaterialTypeId: materialTypeId,
    targetMaterialTypeName: typeName,
    skillFileName: skillFileNameForMaterialType(typeName, materialTypeId),
    changeLog: isExecutive
      ? DEFAULT_TOPIC_SKILL.changeLog
      : kind === "meeting"
        ? ["初始版本：建立会议基础信息、决策、行动项、议题讨论、协作态势、风险依赖和待定问题的分析标准。"]
        : kind === "training"
          ? ["v1.5：过滤课程预告、转场衔接和证据不足的弱话题，避免非知识点内容导致 SKILL 刷新失败。"]
        : [`初始版本：建立${typeName}材料的话题拆解 SKILL.md 基础模版。`],
    isPreset: true,
  };
}

function buildSkillDiffLog(previousSkill, nextSkill) {
  const logs = [];
  const previousSummary = String(previousSkill?.summary || "").trim();
  const nextSummary = String(nextSkill?.summary || "").trim();
  if (previousSummary !== nextSummary) {
    logs.push(`版本说明调整：由“${previousSummary || "空"}”改为“${nextSummary || "空"}”。`);
  }
  const previousLines = String(previousSkill?.prompt || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const nextLines = String(nextSkill?.prompt || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const previousSet = new Set(previousLines);
  const nextSet = new Set(nextLines);
  const added = nextLines.filter((line) => !previousSet.has(line));
  const removed = previousLines.filter((line) => !nextSet.has(line));
  if (added.length) {
    logs.push(`新增 ${added.length} 行规则：${added.slice(0, 3).join("；")}${added.length > 3 ? "；..." : ""}`);
  }
  if (removed.length) {
    logs.push(`删除 ${removed.length} 行规则：${removed.slice(0, 3).join("；")}${removed.length > 3 ? "；..." : ""}`);
  }
  if (!logs.length) {
    logs.push("与上一版内容一致，仅生成新的版本记录。");
  }
  return logs;
}

function skillDisplayName(skill, fallback = "SKILL.md") {
  if (!skill) {
    return fallback;
  }
  return `${skill.skillFileName || skill.name || fallback} ${skill.version || ""}`.trim();
}

function previousSkillForVersion(skill, versions) {
  if (!skill) {
    return null;
  }
  const sorted = [...versions].sort(compareSkillVersions);
  const currentIndex = sorted.findIndex((item) => item.version === skill.version);
  return currentIndex >= 0 ? sorted[currentIndex + 1] || null : null;
}

function skillChangeLogForVersion(skill, versions) {
  const previousSkill = previousSkillForVersion(skill, versions);
  if (!previousSkill) {
    return Array.isArray(skill?.changeLog) && skill.changeLog.length
      ? skill.changeLog
      : ["初始版本：暂无上一版本可比较。"];
  }
  return buildSkillDiffLog(previousSkill, skill);
}

function buildSkillLineDiff(previousText, nextText) {
  const previousLines = String(previousText || "").split(/\r?\n/);
  const nextLines = String(nextText || "").split(/\r?\n/);
  const nextCounts = new Map();
  nextLines.forEach((line) => {
    nextCounts.set(line, (nextCounts.get(line) || 0) + 1);
  });
  const previousCounts = new Map();
  previousLines.forEach((line) => {
    previousCounts.set(line, (previousCounts.get(line) || 0) + 1);
  });
  const previousSeen = new Map();
  const nextSeen = new Map();
  const left = previousLines.map((line, index) => {
    const seen = (previousSeen.get(line) || 0) + 1;
    previousSeen.set(line, seen);
    const existsInNext = seen <= (nextCounts.get(line) || 0);
    return {
      number: index + 1,
      text: line,
      status: existsInNext ? "same" : "removed",
      syncKey: existsInNext && line.trim() ? `${line}__${seen}` : "",
    };
  });
  const right = nextLines.map((line, index) => {
    const seen = (nextSeen.get(line) || 0) + 1;
    nextSeen.set(line, seen);
    const existsInPrevious = seen <= (previousCounts.get(line) || 0);
    return {
      number: index + 1,
      text: line,
      status: existsInPrevious ? "same" : "added",
      syncKey: existsInPrevious && line.trim() ? `${line}__${seen}` : "",
    };
  });
  return { left, right };
}

function skillDiffRowsHtml(rows) {
  return rows.map((row) => `
    <div class="skill-diff-line is-${escapeHtml(row.status)}"${row.syncKey ? ` data-sync-key="${escapeHtml(row.syncKey)}"` : ""}>
      <span class="skill-diff-line-no">${escapeHtml(String(row.number))}</span>
      <code>${escapeHtml(row.text || " ")}</code>
    </div>
  `).join("");
}

function bindSkillDiffScrollSync(overlay) {
  const panes = [...overlay.querySelectorAll(".skill-diff-code")];
  if (panes.length !== 2) {
    return;
  }
  let syncing = false;
  const findAnchorLine = (pane) => {
    const paneRect = pane.getBoundingClientRect();
    const lines = [...pane.querySelectorAll(".skill-diff-line[data-sync-key]")];
    return lines.reduce((best, line) => {
      const rect = line.getBoundingClientRect();
      if (rect.bottom < paneRect.top || rect.top > paneRect.bottom) {
        return best;
      }
      const distance = Math.abs(rect.top - paneRect.top);
      return !best || distance < best.distance ? { line, rect, distance } : best;
    }, null);
  };
  const alignPane = (source, target) => {
    const anchor = findAnchorLine(source);
    if (!anchor?.line?.dataset.syncKey) {
      return;
    }
    const targetLine = [...target.querySelectorAll(".skill-diff-line[data-sync-key]")]
      .find((line) => line.dataset.syncKey === anchor.line.dataset.syncKey);
    if (!targetLine) {
      return;
    }
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetLineRect = targetLine.getBoundingClientRect();
    const sourceOffset = anchor.rect.top - sourceRect.top;
    const targetOffset = targetLineRect.top - targetRect.top;
    target.scrollTop += targetOffset - sourceOffset;
    target.scrollLeft = source.scrollLeft;
  };
  panes.forEach((pane) => {
    pane.addEventListener("scroll", () => {
      if (syncing) {
        return;
      }
      const target = panes.find((item) => item !== pane);
      if (!target) {
        return;
      }
      syncing = true;
      requestAnimationFrame(() => {
        alignPane(pane, target);
        syncing = false;
      });
    }, { passive: true });
  });
}

function showSkillDiffCompareModal({ title, leftSkill, rightSkill, leftLabel = "历史版本", rightLabel = "对比版本" }) {
  if (!leftSkill || !rightSkill) {
    return;
  }
  const diff = buildSkillLineDiff(leftSkill.prompt || "", rightSkill.prompt || "");
  const diffLog = buildSkillDiffLog(leftSkill, rightSkill);
  const overlay = document.createElement("div");
  overlay.className = "skill-diff-overlay";
  overlay.innerHTML = `
    <section class="skill-diff-dialog" role="dialog" aria-modal="true" aria-labelledby="skillDiffTitle">
      <header class="skill-diff-header">
        <div>
          <p class="section-kicker">Skill Diff</p>
          <h3 id="skillDiffTitle">${escapeHtml(title || "SKILL 差异对比")}</h3>
        </div>
        <button class="mini-button" type="button" data-skill-diff-close>关闭</button>
      </header>
      <div class="skill-diff-summary">
        <strong>差异摘要</strong>
        <ul>${diffLog.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="skill-diff-grid">
        <article>
          <h4>${escapeHtml(leftLabel)}：${escapeHtml(skillDisplayName(leftSkill, "当前 SKILL"))}</h4>
          <div class="skill-diff-code">${skillDiffRowsHtml(diff.left)}</div>
        </article>
        <article>
          <h4>${escapeHtml(rightLabel)}：${escapeHtml(skillDisplayName(rightSkill, "最新 SKILL"))}</h4>
          <div class="skill-diff-code">${skillDiffRowsHtml(diff.right)}</div>
        </article>
      </div>
    </section>
  `;
  const close = () => overlay.remove();
  overlay.querySelector("[data-skill-diff-close]")?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });
  document.body.appendChild(overlay);
  bindSkillDiffScrollSync(overlay);
  overlay.querySelector("[data-skill-diff-close]")?.focus();
}

function showSkillDiffModal(docId) {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc) {
    return;
  }
  const latest = currentTopicSkill(materialTypeIdForDoc(doc) || "type-executive-view");
  const currentVersion = doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const currentSkill = skillByVersion(currentVersion, materialTypeIdForDoc(doc) || "type-executive-view");
  showSkillDiffCompareModal({
    title: `${doc.title || doc.fileName || "材料"} · SKILL 差异对比`,
    leftSkill: currentSkill,
    rightSkill: latest,
    leftLabel: "当前版本",
    rightLabel: "最新版本",
  });
}

async function saveTopicSkills(skills) {
  if (!state.currentUser) {
    return;
  }
  const custom = dedupeTopicSkills(skills).filter((skill) => !skill.isPreset);
  const updated = {
    ...state.currentUser,
    topicSkills: custom,
    topicSkillsUpdatedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
  loadTopicSkills();
}

async function saveArticleSkills(skills) {
  if (!state.currentUser) {
    return;
  }
  const custom = dedupeArticleSkills(skills).filter((skill) => !skill.isPreset);
  const updated = {
    ...state.currentUser,
    articleSkills: custom,
    articleSkillsUpdatedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
  loadArticleSkills();
}

async function createTopicSkillVersion(summary, prompt, changeLog = null, targetTypeIdOverride = "") {
  const summaryValue = String(summary || "").trim();
  const promptValue = String(prompt || "").trim();
  if (!summaryValue || !promptValue) {
    setSkillNotice("请填写版本说明和 SKILL 提示词。", "error");
    return false;
  }
  const targetTypeId = targetTypeIdOverride || state.activeSkillMaterialTypeId || "type-executive-view";
  state.activeSkillMaterialTypeId = targetTypeId;
  const targetType = materialTypeById(targetTypeId) || DEFAULT_MATERIAL_TYPES[0];
  const scopedSkills = state.topicSkills.filter((skill) => skillTypeId(skill) === targetTypeId);
  const previousSkill = currentTopicSkill(targetTypeId);
  if (sameSkillPrompt(promptValue, previousSkill?.prompt || "")) {
    setSkillNotice("SKILL.md 内容与当前最新版本一致，未创建新版本。", "info");
    renderTopicSkillPage();
    return false;
  }
  const maxMinor = Math.max(...scopedSkills.map((skill) => parseSkillVersionParts(skill.version).minor), 0);
  const nextMinor = maxMinor + 1;
  const skill = {
    id: `topic-skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: skillNameForMaterialType(targetType.name || "高层视角", targetTypeId),
    version: `v1.${nextMinor}`,
    versionNumber: nextMinor + 1,
    summary: summaryValue,
    prompt: promptValue,
    targetMaterialTypeId: targetTypeId,
    targetMaterialTypeName: targetType.name || "高层视角",
    skillFileName: skillFileNameForMaterialType(targetType.name || "高层视角", targetTypeId),
    changeLog: Array.isArray(changeLog) && changeLog.length ? changeLog : buildSkillDiffLog(previousSkill, { summary: summaryValue, prompt: promptValue }),
    createdAt: new Date().toISOString(),
    isPreset: false,
  };
  await saveTopicSkills([...state.topicSkills, skill]);
  setSkillNotice(`已发布${skill.targetMaterialTypeName}话题 SKILL ${skill.version}。材料列表会提示可刷新到新版本。`, "success");
  renderTopicSkillPage();
  renderMaterialOverviewPage();
  return true;
}

async function createArticleSkillVersion(summary, prompt, changeLog = null) {
  const summaryValue = String(summary || "").trim();
  const promptValue = String(prompt || "").trim();
  if (!summaryValue || !promptValue) {
    setArticleSkillNotice("请填写版本说明和文章 SKILL 提示词。", "error");
    return false;
  }
  const previousSkill = currentArticleSkill();
  if (sameSkillPrompt(promptValue, previousSkill?.prompt || "")) {
    setArticleSkillNotice("文章 SKILL 内容与当前最新版本一致，未创建新版本。", "info");
    renderArticleSkillPage();
    return false;
  }
  const maxMinor = Math.max(...state.articleSkills.map((skill) => parseSkillVersionParts(skill.version).minor), 0);
  const nextMinor = maxMinor + 1;
  const skill = {
    id: `article-skill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: DEFAULT_ARTICLE_SKILL.name,
    version: `v1.${nextMinor}`,
    versionNumber: nextMinor + 1,
    summary: summaryValue,
    prompt: promptValue,
    skillFileName: DEFAULT_ARTICLE_SKILL.skillFileName,
    changeLog: Array.isArray(changeLog) && changeLog.length ? changeLog : buildSkillDiffLog(previousSkill, { summary: summaryValue, prompt: promptValue }),
    createdAt: new Date().toISOString(),
    isPreset: false,
  };
  await saveArticleSkills([...state.articleSkills, skill]);
  setArticleSkillNotice(`已发布文章 SKILL ${skill.version}。新的推荐、生成和刷新都会使用最新版本。`, "success");
  renderArticleSkillPage();
  renderGeneratedArticlePage();
  return true;
}

function setSkillNotice(message, tone = "info") {
  state.skillNotice = { message, tone };
  const node = els.topicSkillPage?.querySelector("#topicSkillNotice");
  if (node) {
    node.textContent = message;
    node.dataset.tone = tone;
  }
}

function setArticleSkillNotice(message, tone = "info") {
  state.articleSkillNotice = { message, tone };
  const node = els.articleSkillPage?.querySelector("#articleSkillNotice");
  if (node) {
    node.textContent = message;
    node.dataset.tone = tone;
  }
}

function renderMaterialControls() {
  if (els.materialSourceSelect) {
    const value = els.materialSourceSelect.value;
    els.materialSourceSelect.innerHTML = state.materialSources
      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
      .join("");
    els.materialSourceSelect.value = value || state.materialSources[0]?.id || "";
  }
  if (els.materialTypeSelect) {
    const value = els.materialTypeSelect.value;
    els.materialTypeSelect.innerHTML = state.materialTypes
      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
      .join("");
    els.materialTypeSelect.value = value || state.materialTypes[0]?.id || "";
  }
  renderTopicFilters();
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
}

function normalizeKeyText(value) {
  return String(value || "").trim().toLowerCase();
}

function materialSourceById(id) {
  return state.materialSources.find((item) => item.id === id) || null;
}

function materialTypeById(id) {
  return state.materialTypes.find((item) => item.id === id) || null;
}

function materialSourceByKey(id, name = "") {
  return materialSourceById(id)
    || state.materialSources.find((item) => normalizeKeyText(item.name) === normalizeKeyText(name))
    || null;
}

function materialTypeByKey(id, name = "") {
  return materialTypeById(id)
    || state.materialTypes.find((item) => normalizeKeyText(item.name) === normalizeKeyText(name))
    || null;
}

function materialSourceForDoc(doc) {
  return materialSourceByKey(doc?.materialSourceId, doc?.materialSourceName || doc?.categoryName)
    || (!doc?.materialSourceId && !doc?.materialSourceName ? state.materialSources[0] || null : null);
}

function materialTypeForDoc(doc) {
  return materialTypeByKey(
    doc?.materialTypeId || doc?.analysis?.targetMaterialTypeId,
    doc?.materialTypeName || doc?.materialTypeTemplate || doc?.analysis?.targetMaterialTypeName,
  ) || (!doc?.materialTypeId && !doc?.materialTypeName ? state.materialTypes[0] || null : null);
}

function materialSourceIdForDoc(doc) {
  return materialSourceForDoc(doc)?.id || doc?.materialSourceId || "";
}

function materialTypeIdForDoc(doc) {
  return materialTypeForDoc(doc)?.id || doc?.materialTypeId || "";
}

function materialSourceNameForDoc(doc) {
  return materialSourceForDoc(doc)?.name || doc?.materialSourceName || "未设置来源";
}

function materialTypeNameForDoc(doc) {
  return materialTypeForDoc(doc)?.name || doc?.materialTypeName || "未设置类型";
}

function normalizeDocumentMaterialKeys(doc) {
  const source = materialSourceForDoc(doc);
  const type = materialTypeForDoc(doc);
  const next = {
    ...doc,
    materialSourceId: source?.id || doc.materialSourceId || "",
    materialSourceName: source?.name || doc.materialSourceName || "",
    materialTypeId: type?.id || doc.materialTypeId || "",
    materialTypeName: type?.name || doc.materialTypeName || "",
    materialTypeTemplate: type?.name || doc.materialTypeTemplate || "",
  };
  const changed = next.materialSourceId !== doc.materialSourceId
    || next.materialSourceName !== doc.materialSourceName
    || next.materialTypeId !== doc.materialTypeId
    || next.materialTypeName !== doc.materialTypeName
    || next.materialTypeTemplate !== doc.materialTypeTemplate;
  return { doc: changed ? { ...next, updatedAt: doc.updatedAt || new Date().toISOString() } : doc, changed };
}

async function normalizeCurrentUserMaterialReferences() {
  if (!state.currentUser) {
    return;
  }
  const docs = state.allDocuments.filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === state.currentUser.emailKey);
  const normalized = docs
    .map(normalizeDocumentMaterialKeys)
    .filter((item) => item.changed)
    .map((item) => item.doc);
  if (normalized.length) {
    await withStore(DOC_STORE, "readwrite", (store) => {
      normalized.forEach((doc) => store.put(doc));
    });
    state.allDocuments = state.allDocuments.map((doc) => normalized.find((item) => item.id === doc.id) || doc);
    state.documents = state.documents.map((doc) => normalized.find((item) => item.id === doc.id) || doc);
  }
  if (state.uploadItems.length) {
    let pendingChanged = false;
    state.uploadItems = state.uploadItems.map((item) => {
      const source = materialSourceByKey(item.materialSourceId, item.materialSourceName);
      const type = materialTypeByKey(item.materialTypeId, item.materialTypeName);
      const next = {
        ...item,
        materialSourceId: source?.id || item.materialSourceId || "",
        materialSourceName: source?.name || item.materialSourceName || "",
        materialTypeId: type?.id || item.materialTypeId || "",
        materialTypeName: type?.name || item.materialTypeName || "",
      };
      pendingChanged = pendingChanged || JSON.stringify(next) !== JSON.stringify(item);
      return next;
    });
    if (pendingChanged) {
      await persistPendingUploads();
    }
  }
}

function validateMaterialConfigName(value, label) {
  const name = String(value || "").trim();
  if (!name) {
    setMaterialConfigNotice(`${label}不能为空。`, "error");
    return "";
  }
  if (name.length > 20) {
    setMaterialConfigNotice(`${label}不能超过20个字符。`, "error");
    return "";
  }
  return name;
}

async function createMaterialSource(name) {
  const value = validateMaterialConfigName(name, "资料来源名称");
  if (!value) {
    return;
  }
  const item = {
    id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: value,
    isPreset: false,
  };
  const custom = state.materialSources.filter((source) => !source.isPreset);
  await saveConfigList(MATERIAL_SOURCES_KEY, DEFAULT_MATERIAL_SOURCES, [...custom, item]);
  loadMaterialTaxonomy();
  setMaterialConfigNotice(`已添加资料来源：${value}`, "success");
}

async function createMaterialType(name) {
  const value = validateMaterialConfigName(name, "资料类型名称");
  if (!value) {
    return;
  }
  const item = {
    id: `type-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: value,
    isPreset: false,
  };
  const custom = state.materialTypes.filter((type) => !type.isPreset);
  await saveConfigList(MATERIAL_TYPES_KEY, DEFAULT_MATERIAL_TYPES, [...custom, item]);
  loadMaterialTaxonomy();
  setMaterialConfigNotice(`已添加资料类型：${value}`, "success");
}

async function updateMaterialSourceConfig(id, name) {
  const value = validateMaterialConfigName(name, "资料来源名称");
  if (!id || !value) {
    return;
  }
  const current = state.materialSources;
  const item = current.find((entry) => entry.id === id);
  if (!item) {
    setMaterialConfigNotice("请选择要修改的资料来源。", "error");
    return;
  }
  const nextItems = current.map((entry) => (entry.id === id ? { ...entry, name: value } : entry));
  await saveConfigList(MATERIAL_SOURCES_KEY, DEFAULT_MATERIAL_SOURCES, nextItems);
  loadMaterialTaxonomy();
  await updateDocumentsForMaterialConfig("source", id, value, item.name);
  setMaterialConfigNotice(`已更新资料来源：${value}`, "success");
}

async function updateMaterialTypeConfig(id, name) {
  const value = validateMaterialConfigName(name, "资料类型名称");
  if (!id || !value) {
    return;
  }
  const current = state.materialTypes;
  const item = current.find((entry) => entry.id === id);
  if (!item) {
    setMaterialConfigNotice("请选择要修改的资料类型。", "error");
    return;
  }
  const nextItems = current.map((entry) => (entry.id === id ? { ...entry, name: value } : entry));
  await saveConfigList(MATERIAL_TYPES_KEY, DEFAULT_MATERIAL_TYPES, nextItems);
  loadMaterialTaxonomy();
  await updateDocumentsForMaterialConfig("type", id, value, item.name);
  await syncTopicSkillMaterialTypeName(id, value);
  loadTopicSkills();
  renderTopicSkillPage();
  setMaterialConfigNotice(`已更新资料类型：${value}`, "success");
}

async function updateDocumentsForMaterialConfig(kind, id, name, previousName = "") {
  const docs = state.allDocuments.filter((doc) => {
    if ((doc.ownerEmailKey || "").toLowerCase() !== state.currentUser?.emailKey) {
      return false;
    }
    return kind === "source"
      ? doc.materialSourceId === id || normalizeKeyText(doc.materialSourceName) === normalizeKeyText(previousName)
      : doc.materialTypeId === id || normalizeKeyText(doc.materialTypeName) === normalizeKeyText(previousName) || normalizeKeyText(doc.materialTypeTemplate) === normalizeKeyText(previousName);
  });
  if (docs.length) {
    await withStore(DOC_STORE, "readwrite", (store) => {
      docs.forEach((doc) => {
        const updated = kind === "source"
          ? { ...doc, materialSourceId: id, materialSourceName: name, updatedAt: new Date().toISOString() }
          : { ...doc, materialTypeId: id, materialTypeName: name, materialTypeTemplate: name, updatedAt: new Date().toISOString() };
        store.put(updated);
      });
    });
  }
  if (state.uploadItems.length) {
    let changed = false;
    state.uploadItems = state.uploadItems.map((item) => {
      const matched = kind === "source"
        ? item.materialSourceId === id || normalizeKeyText(item.materialSourceName) === normalizeKeyText(previousName)
        : item.materialTypeId === id || normalizeKeyText(item.materialTypeName) === normalizeKeyText(previousName);
      if (!matched) {
        return item;
      }
      changed = true;
      return kind === "source"
        ? { ...item, materialSourceId: id, materialSourceName: name }
        : { ...item, materialTypeId: id, materialTypeName: name };
    });
    if (changed) {
      await persistPendingUploads();
    }
  }
  await loadDocuments();
}

async function syncTopicSkillMaterialTypeName(typeId, typeName) {
  if (!state.currentUser) {
    return;
  }
  const custom = Array.isArray(state.currentUser.topicSkills) ? state.currentUser.topicSkills : [];
  const nextSkills = custom.map((skill) => (
    (skill.targetMaterialTypeId || "type-executive-view") === typeId
      ? {
          ...skill,
          name: skillNameForMaterialType(typeName, typeId),
          targetMaterialTypeName: typeName,
          skillFileName: skillFileNameForMaterialType(typeName, typeId),
        }
      : skill
  ));
  if (JSON.stringify(custom) === JSON.stringify(nextSkills)) {
    return;
  }
  const updated = {
    ...state.currentUser,
    topicSkills: nextSkills,
    topicSkillsUpdatedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
}

async function deleteMaterialConfig(kind, id) {
  if (!id) {
    return;
  }
  const defaults = kind === "source" ? DEFAULT_MATERIAL_SOURCES : DEFAULT_MATERIAL_TYPES;
  const current = kind === "source" ? state.materialSources : state.materialTypes;
  const item = current.find((entry) => entry.id === id);
  if (!item || item.isPreset) {
    return;
  }
  const custom = current.filter((entry) => entry.id !== id);
  await saveConfigList(kind === "source" ? MATERIAL_SOURCES_KEY : MATERIAL_TYPES_KEY, defaults, custom);
  loadMaterialTaxonomy();
  setMaterialConfigNotice(`已删除${kind === "source" ? "资料来源" : "资料类型"}：${item.name}`, "success");
}

function setMaterialConfigNotice(message, tone = "info") {
  state.materialConfigNotice = { message, tone };
  const messageNode = els.materialManagePage?.querySelector("#materialConfigMessage");
  if (messageNode) {
    messageNode.textContent = message;
    messageNode.dataset.tone = tone;
  }
}

function mergeTopicAnalyses(itemResults) {
  const topics = [];
  const activeCategories = [];
  const quotes = [];
  const suggestedTags = [];
  const sourceMap = new Map();

  itemResults.forEach(({ item, analysis }) => {
    sourceMap.set(item.title, analysis);
    (analysis.topics || []).forEach((topic, index) => {
      topics.push({
        ...topic,
        globalIndex: topics.length + 1,
        sourceSummary: topic.sourceSummary || `${item.title} · ${topic.title}`,
        sourceDocId: item.fileName,
        sourceDocTitle: item.title,
        sourceDocName: item.fileName,
        sourceMaterialType: materialTypeByKey(item.materialTypeId, item.materialTypeName)?.name || "高层视角",
        sourceMaterialTypeId: materialTypeByKey(item.materialTypeId, item.materialTypeName)?.id || item.materialTypeId || "",
        sourceMaterialSourceId: materialSourceByKey(item.materialSourceId, item.materialSourceName)?.id || item.materialSourceId || "",
        sourceMaterialSourceName: materialSourceByKey(item.materialSourceId, item.materialSourceName)?.name || "CEO Marks",
        updatedAt: new Date().toISOString(),
        sourceAnalysisIndex: index,
      });
    });
    (analysis.activeCategories || []).forEach((group) => {
      const existing = activeCategories.find((itemGroup) => itemGroup.category.id === group.category.id);
      if (existing) {
        existing.items.push(...group.items);
      } else {
        activeCategories.push({
          category: group.category,
          items: [...group.items],
        });
      }
    });
    quotes.push(...(analysis.quotes || []));
    suggestedTags.push(...(analysis.suggestedTags || []));
  });

  return {
    analysis: {
      text: itemResults.map((entry) => `【${entry.item.title}】\n${entry.item.rawText}`).join("\n\n"),
      sentences: itemResults.flatMap((entry) => entry.analysis.sentences || []),
      grouped: itemResults[0]?.analysis.grouped || {},
      overview: {
        oneLine: itemResults.map((entry) => entry.analysis.overview.oneLine).join("；"),
        logicLine: itemResults.map((entry) => entry.analysis.overview.logicLine).join("；"),
        wordCount: itemResults.reduce((sum, entry) => sum + Number(entry.analysis.overview.wordCount || 0), 0),
      },
      topics,
      quotes: [...new Set(quotes)].slice(0, 10),
      activeCategories,
      suggestedTags: [...new Set(suggestedTags)].slice(0, 8),
      deepeningModes: itemResults[0]?.analysis.deepeningModes || deepeningModes,
      analysisSource: "deepseek",
    },
  };
}

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  }
  if (size >= 1024) {
    return `${Math.round(size / 1024)}KB`;
  }
  return `${size || 0}B`;
}

function materialFingerprint(fileName, size, rawText = "") {
  const text = normalizeText(rawText || "");
  return [
    String(fileName || "").trim().toLowerCase(),
    Number(size || 0),
    text.length,
    text.slice(0, 80),
    text.slice(-80),
  ].join("|");
}

function topicCodeFromNumber(number) {
  const index = Math.max(1, Number(number || 1));
  const prefixIndex = Math.floor((index - 1) / 9999);
  const startPrefixIndex = (19 * 26) + 2; // TC
  const currentPrefixIndex = (startPrefixIndex + prefixIndex) % (26 * 26);
  const first = String.fromCharCode(65 + Math.floor(currentPrefixIndex / 26));
  const second = String.fromCharCode(65 + (currentPrefixIndex % 26));
  const serial = ((index - 1) % 9999) + 1;
  return `${first}${second}${String(serial).padStart(4, "0")}`;
}

function materialCodeFromNumber(number) {
  const index = Math.max(1, Number(number || 1));
  const prefixIndex = Math.floor((index - 1) / 9999);
  const startPrefixIndex = (12 * 26); // MA
  const currentPrefixIndex = (startPrefixIndex + prefixIndex) % (26 * 26);
  const first = String.fromCharCode(65 + Math.floor(currentPrefixIndex / 26));
  const second = String.fromCharCode(65 + (currentPrefixIndex % 26));
  const serial = ((index - 1) % 9999) + 1;
  return `${first}${second}${String(serial).padStart(4, "0")}`;
}

function allMaterialCodes(excludedDocId = "") {
  return state.allDocuments
    .filter((doc) => doc.id !== excludedDocId)
    .map((doc) => doc.materialCode)
    .filter(Boolean);
}

function nextMaterialCode(existingCodes) {
  let next = 1;
  const used = new Set(existingCodes);
  while (used.has(materialCodeFromNumber(next))) {
    next += 1;
  }
  return materialCodeFromNumber(next);
}

function normalizeMaterialCodeRank(doc) {
  const created = new Date(doc?.createdAt || doc?.updatedAt || 0).getTime();
  const updated = new Date(doc?.updatedAt || doc?.createdAt || 0).getTime();
  return [Number.isFinite(created) ? created : 0, Number.isFinite(updated) ? updated : 0, String(doc?.id || "")];
}

function ensureUniqueMaterialCodes(docs = []) {
  const sorted = [...docs].sort((a, b) => {
    const [ac, au, aid] = normalizeMaterialCodeRank(a);
    const [bc, bu, bid] = normalizeMaterialCodeRank(b);
    return ac - bc || au - bu || aid.localeCompare(bid);
  });
  const used = new Set();
  let next = 1;
  const updates = [];
  for (const doc of sorted) {
    const current = String(doc?.materialCode || "").trim();
    let assigned = current;
    const duplicate = !assigned || used.has(assigned);
    if (duplicate) {
      while (used.has(materialCodeFromNumber(next))) {
        next += 1;
      }
      assigned = materialCodeFromNumber(next);
      next += 1;
      updates.push({ ...doc, materialCode: assigned, updatedAt: doc.updatedAt || new Date().toISOString() });
    } else {
      used.add(assigned);
      const match = assigned.match(/^([A-Z]{2})(\d{4})$/);
      if (match) {
        next = Math.max(next, Number(match[2]) + 1);
      }
    }
    used.add(assigned);
  }
  return updates;
}

function materialDisplayCode(doc) {
  if (doc?.materialCode) {
    return doc.materialCode;
  }
  return "未编号";
}

function nextTopicCode(existingCodes) {
  let next = 1;
  const used = new Set(existingCodes);
  while (used.has(topicCodeFromNumber(next))) {
    next += 1;
  }
  return topicCodeFromNumber(next);
}

function allTopicCodes(excludedDocId = "") {
  return state.allDocuments
    .filter((doc) => doc.id !== excludedDocId)
    .flatMap((doc) => doc.analysis?.topics || [])
    .map((topic) => topic.topicCode)
    .filter(Boolean);
}

function assignTopicCodesToAnalysis(analysis, excludedDocId = "", extraExistingCodes = []) {
  const usedCodes = new Set([...allTopicCodes(excludedDocId), ...extraExistingCodes.filter(Boolean)]);
  const topics = (analysis?.topics || []).map((topic) => {
    if (topic.topicCode && !usedCodes.has(topic.topicCode)) {
      usedCodes.add(topic.topicCode);
      return topic;
    }
    const code = nextTopicCode(usedCodes);
    usedCodes.add(code);
    return { ...topic, topicCode: code };
  });
  return { ...analysis, topics };
}

function preserveTopicFavorites(previousDoc, analysis) {
  if (!previousDoc?.analysis?.topics?.length || !analysis?.topics?.length) {
    return analysis;
  }
  const previousTopics = Object.values(docSkillAnalyses(previousDoc))
    .flatMap((item) => item?.topics || [])
    .filter((topic) => topic?.favorite);
  if (!previousTopics.length) {
    return analysis;
  }
  const favoriteCodes = new Set(previousTopics.map((topic) => topic.topicCode).filter(Boolean));
  const favoriteTitles = new Set(previousTopics.map((topic) => String(topic.title || "").trim()).filter(Boolean));
  return {
    ...analysis,
    topics: (analysis.topics || []).map((topic) => ({
      ...topic,
      favorite: Boolean(topic.favorite || favoriteCodes.has(topic.topicCode) || favoriteTitles.has(String(topic.title || "").trim())),
    })),
  };
}

function findDuplicateDocument(item) {
  if (!state.currentUser || !item) {
    return null;
  }
  const ownerDocs = state.allDocuments.filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === state.currentUser.emailKey);
  const fingerprint = item.fileFingerprint || materialFingerprint(item.fileName, item.fileSize, item.rawText);
  return ownerDocs.find((doc) => doc.fileFingerprint && doc.fileFingerprint === fingerprint)
    || ownerDocs.find((doc) => normalizeText(doc.rawText || "") && normalizeText(doc.rawText || "") === normalizeText(item.rawText || ""))
    || ownerDocs.find((doc) => String(doc.fileName || doc.title || "").trim().toLowerCase() === String(item.fileName || item.title || "").trim().toLowerCase())
    || null;
}

function pendingUploadKey(item) {
  return String(item?.id || item?.fileFingerprint || materialFingerprint(item?.fileName, item?.fileSize, item?.rawText));
}

function pendingUploadMatchesDoc(item, doc) {
  if (!item || !doc) {
    return false;
  }
  const itemFingerprint = item.fileFingerprint || materialFingerprint(item.fileName, item.fileSize, item.rawText);
  const sameFingerprint = Boolean(itemFingerprint && doc.fileFingerprint && itemFingerprint === doc.fileFingerprint);
  const sameText = Boolean(normalizeText(item.rawText || "") && normalizeText(doc.rawText || "") === normalizeText(item.rawText || ""));
  const sameName = String(doc.fileName || doc.title || "").trim().toLowerCase() === String(item.fileName || item.title || "").trim().toLowerCase();
  return sameFingerprint || sameText || sameName;
}

function removeCompletedPendingUploads(items = []) {
  const ownerDocs = state.allDocuments
    .filter((doc) => !doc.deletedAt)
    .filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === state.currentUser?.emailKey)
    .filter((doc) => doc.analysis || doc.meetingAnalysis || doc.currentSkillVersion);
  return items.filter((item) => {
    if (item.existingDocId || item.overwrite) {
      return true;
    }
    return !ownerDocs.some((doc) => pendingUploadMatchesDoc(item, doc));
  });
}

function selectedUploadItems() {
  return state.uploadItems.filter((item) => item.selected !== false);
}

function selectedUploadItemsReady() {
  const selectedItems = selectedUploadItems();
  return Boolean(selectedItems.length && selectedItems.every(uploadItemReady));
}

function renderAnalysisLog() {
  if (!els.analysisLog) {
    return;
  }
  if (!state.analysisLogs.length) {
    els.analysisLog.innerHTML = "";
    return;
  }
  els.analysisLog.innerHTML = state.analysisLogs
    .slice(-8)
    .map((entry) => `<p><span>${escapeHtml(entry.time)}</span>${escapeHtml(entry.message)}</p>`)
    .join("");
}

function appendAnalysisLog(message) {
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  state.analysisLogs.push({ time, message });
  renderAnalysisLog();
}

function resetAnalysisLog() {
  state.analysisLogs = [];
  renderAnalysisLog();
}

function setAnalysisProgress(step, percent, message) {
  const safePercent = Math.max(0, Math.min(100, percent));
  if (els.analysisProgressBar) {
    els.analysisProgressBar.style.width = `${safePercent}%`;
  }
  if (els.analysisProgressPercent) {
    els.analysisProgressPercent.textContent = `${safePercent}%`;
  }
  if (els.parseHint) {
    els.parseHint.textContent = message || "";
  }
  if (message) {
    appendAnalysisLog(`${step}：${message}`);
  }
}

function setUploadLog(step, message) {
  if (els.analysisProgressBar) {
    els.analysisProgressBar.style.width = "0%";
  }
  if (els.analysisProgressPercent) {
    els.analysisProgressPercent.textContent = "0%";
  }
  if (els.parseHint) {
    els.parseHint.textContent = message || "";
  }
  if (message) {
    appendAnalysisLog(`${step}：${message}`);
  }
}

function setAnalysisIdle(message = "材料已保存，尚未执行分析。") {
  if (els.analysisProgressBar) {
    els.analysisProgressBar.style.width = "0%";
  }
  if (els.analysisProgressPercent) {
    els.analysisProgressPercent.textContent = "0%";
  }
  if (els.parseHint) {
    els.parseHint.textContent = message;
  }
  resetAnalysisLog();
}

function setUploadLocked(locked) {
  state.uploadLocked = locked;
  if (els.fileInput) {
    els.fileInput.disabled = locked;
  }
  if (els.urlInput) {
    els.urlInput.disabled = locked;
  }
  if (els.dropZone) {
    els.dropZone.classList.toggle("is-disabled", locked);
  }
}

function uploadItemReady(item) {
  return Boolean(item?.materialSourceId && item?.materialTypeId);
}

function uploadItemSkill(item) {
  const type = materialTypeByKey(item?.materialTypeId, item?.materialTypeName);
  return type ? currentTopicSkill(type.id) : null;
}

function uploadItemSkillDisplay(item) {
  const skill = uploadItemSkill(item);
  return skill ? skillDisplayName(skill, "话题拆解 SKILL.md") : "选择材料场景后确定 SKILL";
}

function uploadItemsReady() {
  return Boolean(state.draftUploadItems.length && state.draftUploadItems.every(uploadItemReady));
}

function uploadSelectionSummary() {
  const selectedCount = selectedUploadItems().length;
  if (!state.uploadItems.length) {
    return "";
  }
  return `已选中 ${selectedCount} 份材料，共 ${state.uploadItems.length} 份。`;
}

function draftUploadSummary() {
  if (!state.draftUploadItems.length) {
    return "";
  }
  return `本次上传 ${state.draftUploadItems.length} 份材料。请完善资料来源和材料场景后保存。`;
}

function renderUploadMaterialList() {
  if (!els.uploadMaterialList) {
    return;
  }
  if (!state.draftUploadItems.length) {
    els.uploadMaterialList.innerHTML = `<p class="empty-state compact">上传材料后，这里会出现本次待保存的材料清单。保存后才会进入下方“已保存待分析材料”。</p>`;
    updateUploadButtons();
    renderPendingUploadMaterialList();
    return;
  }
  const sourceOptions = [`<option value="">选择资料来源</option>`]
    .concat(state.materialSources.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  const typeOptions = [`<option value="">选择材料场景</option>`]
    .concat(state.materialTypes.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  els.uploadMaterialList.innerHTML = `
    <div class="upload-selection-summary">${escapeHtml(draftUploadSummary())}</div>
    ${state.draftUploadItems.map((item, index) => {
      const duplicateDoc = findDuplicateDocument(item);
      if (duplicateDoc && !item.existingDocId) {
        item.existingDocId = duplicateDoc.id;
        item.existingDocTitle = duplicateDoc.title;
      }
      const duplicateText = item.existingDocId ? `已上传过：${item.existingDocTitle || item.fileName}` : "";
      return `
      <article class="upload-material-item${item.existingDocId ? " is-duplicate" : ""}">
        <span class="upload-check">待保存</span>
        <div class="upload-material-main">
          <strong>${escapeHtml(item.title || item.fileName)}</strong>
          <small>${escapeHtml(item.fileName)} · ${escapeHtml(formatFileSize(item.fileSize || 0))} · ${escapeHtml(String(item.wordCount || 0))} 字</small>
          ${duplicateText ? `<label class="duplicate-warning"><input type="checkbox" data-upload-overwrite="${index}" ${item.overwrite ? "checked" : ""} ${state.isAnalyzing ? "disabled" : ""} />${escapeHtml(duplicateText)}，覆盖并重新生成话题</label>` : ""}
        </div>
        <select class="text-input" data-upload-source="${index}" ${state.isAnalyzing ? "disabled" : ""}>${sourceOptions}</select>
        <select class="text-input" data-upload-type="${index}" ${state.isAnalyzing ? "disabled" : ""}>${typeOptions}</select>
        <span class="upload-item-state" data-ready="${uploadItemReady(item) ? "true" : "false"}">${uploadItemReady(item) ? "待保存" : "待完善"}</span>
        <button class="upload-delete-btn" data-upload-delete="${index}" type="button" ${state.isAnalyzing ? "disabled" : ""}>删除</button>
      </article>`;
    }).join("")}
  `;
  els.uploadMaterialList.querySelectorAll("[data-upload-overwrite]").forEach((checkbox) => {
    const item = state.draftUploadItems[Number(checkbox.dataset.uploadOverwrite)];
    checkbox.addEventListener("change", async () => {
      item.overwrite = checkbox.checked;
      state.uploadAnalysisCompleted = false;
      renderUploadMaterialList();
    });
  });
  els.uploadMaterialList.querySelectorAll("[data-upload-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.uploadDelete);
      state.draftUploadItems.splice(index, 1);
      state.uploadBatchSaved = false;
      state.uploadAnalysisCompleted = false;
      state.rawText = state.draftUploadItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
      if (els.sourceText) {
        els.sourceText.value = state.rawText;
      }
      renderUploadMaterialList();
      setAnalysisIdle(state.draftUploadItems.length ? "本次上传清单已更新，请保存后再执行分析。" : "等待上传材料。");
    });
  });
  els.uploadMaterialList.querySelectorAll("[data-upload-source]").forEach((select) => {
    const item = state.draftUploadItems[Number(select.dataset.uploadSource)];
    select.value = item?.materialSourceId || "";
    select.addEventListener("change", async () => {
      const source = materialSourceById(select.value);
      item.materialSourceId = source?.id || "";
      item.materialSourceName = source?.name || "";
      state.uploadBatchSaved = false;
      state.uploadAnalysisCompleted = false;
      renderUploadMaterialList();
    });
  });
  els.uploadMaterialList.querySelectorAll("[data-upload-type]").forEach((select) => {
    const item = state.draftUploadItems[Number(select.dataset.uploadType)];
    select.value = item?.materialTypeId || "";
    select.addEventListener("change", async () => {
      const type = materialTypeById(select.value);
      item.materialTypeId = type?.id || "";
      item.materialTypeName = type?.name || "";
      state.uploadBatchSaved = false;
      state.uploadAnalysisCompleted = false;
      renderUploadMaterialList();
    });
  });
  updateUploadButtons();
  renderPendingUploadMaterialList();
}

function renderPendingUploadMaterialList() {
  if (!els.pendingUploadMaterialList) {
    return;
  }
  if (!state.uploadItems.length) {
    els.pendingUploadMaterialList.innerHTML = `<p class="empty-state compact">暂无已保存待分析材料。保存上方材料后，会在这里勾选并执行分析。</p>`;
    updateUploadButtons();
    return;
  }
  els.pendingUploadMaterialList.innerHTML = `
    <div class="upload-selection-summary">已保存待分析材料：${escapeHtml(uploadSelectionSummary())}</div>
    ${state.uploadItems.map((item, index) => {
      const duplicateText = item.existingDocId ? `已上传过：${item.existingDocTitle || item.fileName}` : "";
      const skillText = uploadItemSkillDisplay(item);
      return `
        <article class="upload-material-item pending-upload-item${item.existingDocId ? " is-duplicate" : ""}">
          <label class="upload-check">
            <input type="checkbox" data-pending-selected="${index}" ${item.selected === false ? "" : "checked"} ${state.isAnalyzing ? "disabled" : ""} />
            <span>分析</span>
          </label>
          <div class="upload-material-main">
            <strong>${escapeHtml(item.title || item.fileName)}</strong>
            <small>${escapeHtml(item.fileName)} · ${escapeHtml(formatFileSize(item.fileSize || 0))} · ${escapeHtml(String(item.wordCount || 0))} 字</small>
            <small class="upload-skill-line">执行 SKILL：${escapeHtml(skillText)}</small>
            ${duplicateText ? `<label class="duplicate-warning"><input type="checkbox" data-pending-overwrite="${index}" ${item.overwrite ? "checked" : ""} ${state.isAnalyzing ? "disabled" : ""} />${escapeHtml(duplicateText)}，覆盖并重新生成话题</label>` : ""}
          </div>
          <span class="pending-meta">${escapeHtml(materialSourceByKey(item.materialSourceId, item.materialSourceName)?.name || "未设置来源")}</span>
          <span class="pending-meta">${escapeHtml(materialTypeByKey(item.materialTypeId, item.materialTypeName)?.name || "未设置类型")}</span>
          <span class="upload-item-state" data-ready="${uploadItemReady(item) ? "true" : "false"}">待分析</span>
          <button class="upload-delete-btn" data-pending-delete="${index}" type="button" ${state.isAnalyzing ? "disabled" : ""}>删除</button>
        </article>
      `;
    }).join("")}
  `;
  els.pendingUploadMaterialList.querySelectorAll("[data-pending-selected]").forEach((checkbox) => {
    const item = state.uploadItems[Number(checkbox.dataset.pendingSelected)];
    checkbox.addEventListener("change", async () => {
      item.selected = checkbox.checked;
      state.uploadAnalysisCompleted = false;
      renderPendingUploadMaterialList();
      await persistPendingUploads();
    });
  });
  els.pendingUploadMaterialList.querySelectorAll("[data-pending-overwrite]").forEach((checkbox) => {
    const item = state.uploadItems[Number(checkbox.dataset.pendingOverwrite)];
    checkbox.addEventListener("change", async () => {
      item.overwrite = checkbox.checked;
      state.uploadAnalysisCompleted = false;
      renderPendingUploadMaterialList();
      await persistPendingUploads();
    });
  });
  els.pendingUploadMaterialList.querySelectorAll("[data-pending-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.pendingDelete);
      state.uploadItems.splice(index, 1);
      state.uploadBatchSaved = Boolean(state.uploadItems.length);
      state.uploadAnalysisCompleted = false;
      state.rawText = state.draftUploadItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
      renderPendingUploadMaterialList();
      await persistPendingUploads();
      setAnalysisIdle(state.uploadItems.length ? "已保存待分析材料已更新，请勾选后执行分析。" : "暂无已保存待分析材料。");
    });
  });
  updateUploadButtons();
}

function updateUploadButtons() {
  if (els.saveUploadBtn) {
    els.saveUploadBtn.disabled = state.isAnalyzing || !uploadItemsReady() || state.uploadAnalysisCompleted;
  }
  if (els.analyzeBtn) {
    els.analyzeBtn.disabled = state.isAnalyzing || Boolean(state.draftUploadItems.length) || !selectedUploadItemsReady() || state.uploadAnalysisCompleted;
  }
  if (els.clearBtn) {
    els.clearBtn.disabled = state.isAnalyzing || !state.draftUploadItems.length;
  }
}

function confirmAction({ title = "请确认操作", message = "确定继续吗？", confirmText = "确认", cancelText = "取消", tone = "default" } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle">
        <h3 id="confirmDialogTitle"></h3>
        <p></p>
        <div class="confirm-actions">
          <button class="confirm-cancel" type="button"></button>
          <button class="primary confirm-submit" type="button" data-tone="${escapeHtml(tone)}"></button>
        </div>
      </section>
    `;
    const titleNode = overlay.querySelector("h3");
    const messageNode = overlay.querySelector("p");
    const cancelButton = overlay.querySelector(".confirm-cancel");
    const confirmButton = overlay.querySelector(".confirm-submit");
    titleNode.textContent = title;
    messageNode.textContent = message;
    cancelButton.textContent = cancelText;
    confirmButton.textContent = confirmText;
    const close = (result) => {
      overlay.remove();
      resolve(result);
    };
    cancelButton.addEventListener("click", () => close(false));
    confirmButton.addEventListener("click", () => close(true));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close(false);
      }
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close(false);
      }
    });
    document.body.appendChild(overlay);
    confirmButton.focus();
  });
}

function confirmAnalysisLeave() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="analysisLeaveTitle">
        <h3 id="analysisLeaveTitle">确定要离开执行分析吗？</h3>
        <p>当前大模型还在处理材料。你可以停止本次分析，也可以先跳转页面，分析会在后台继续执行。</p>
        <div class="confirm-actions">
          <button class="confirm-submit" type="button" data-action="stop" data-tone="danger">停止执行分析</button>
          <button class="primary confirm-submit" type="button" data-action="background">仅跳转，后台继续执行分析</button>
        </div>
      </section>
    `;
    overlay.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        overlay.remove();
        resolve(action);
      });
    });
    document.body.appendChild(overlay);
    overlay.querySelector('[data-action="background"]')?.focus();
  });
}

function confirmSkillBatchLeave() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="skillBatchLeaveTitle">
        <h3 id="skillBatchLeaveTitle">确定要离开批量刷新吗？</h3>
        <p>当前正在按最新 SKILL 刷新材料。你可以放弃执行，也可以关闭弹窗，后台继续执行。</p>
        <div class="confirm-actions">
          <button class="confirm-submit" type="button" data-action="stop" data-tone="danger">放弃执行</button>
          <button class="primary confirm-submit" type="button" data-action="background">仅跳转后台执行</button>
        </div>
      </section>
    `;
    overlay.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        overlay.remove();
        resolve(action);
      });
    });
    document.body.appendChild(overlay);
    overlay.querySelector('[data-action="background"]')?.focus();
  });
}

function confirmArticleGenerationLeave() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="articleGenerationLeaveTitle">
        <h3 id="articleGenerationLeaveTitle">确定要离开文章生成吗？</h3>
        <p>当前大模型还在生成文章。你可以停止本次生成，也可以先跳转页面，生成会在后台继续执行。</p>
        <div class="confirm-actions">
          <button class="confirm-submit" type="button" data-action="stop" data-tone="danger">停止生成文章</button>
          <button class="primary confirm-submit" type="button" data-action="background">仅跳转，后台继续生成</button>
        </div>
      </section>
    `;
    overlay.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        overlay.remove();
        resolve(action);
      });
    });
    document.body.appendChild(overlay);
    overlay.querySelector('[data-action="background"]')?.focus();
  });
}

async function guardAnalysisNavigation(callback) {
  if (state.articleGeneration.active && !state.articleGeneration.background) {
    const action = await confirmArticleGenerationLeave();
    if (action === "stop") {
      state.articleGeneration.abortController?.abort();
      state.articleGeneration.active = false;
      state.articleGeneration.background = false;
      setArticleGenerationProgress(0, "已停止本次文章生成。");
      appendArticleGenerationLog("用户停止了本次文章生成。");
      callback();
      return;
    }
    if (action === "background") {
      state.articleGeneration.background = true;
      appendArticleGenerationLog("已切换为后台继续生成，可以先浏览其他页面。");
      callback();
      return;
    }
    return;
  }
  if (!state.isAnalyzing || state.allowAnalysisBackground) {
    callback();
    return;
  }
  const action = state.skillBatchRefresh.active ? await confirmSkillBatchLeave() : await confirmAnalysisLeave();
  if (action === "stop") {
    state.analysisAbortController?.abort();
    if (state.skillBatchRefresh.active) {
      state.skillBatchRefresh.active = false;
      appendSkillBatchLog("用户放弃了本次批量刷新。");
    }
    state.isAnalyzing = false;
    state.allowAnalysisBackground = false;
    sessionStorage.removeItem(ANALYSIS_RUNNING_KEY);
    setUploadLocked(false);
    setAnalysisProgress("已停止", 0, "已停止本次执行分析。");
    updateUploadButtons();
    callback();
  }
  if (action === "background") {
    state.allowAnalysisBackground = true;
    if (state.skillBatchRefresh.active) {
      state.skillBatchRefresh.background = true;
      appendSkillBatchLog("已切换为后台执行，可先浏览其他页面。");
    }
    appendAnalysisLog("已切换为后台继续执行，可以先浏览其他页面。");
    callback();
  }
}

function readDeepSeekSettingsFromConfig() {
  if (!els.configPage) {
    return readDeepSeekSettings();
  }
  return {
    provider: els.configPage.querySelector("#deepseekProvider")?.value || "deepseek",
    apiKey: els.configPage.querySelector("#deepseekApiKey")?.value?.trim() || "",
    baseUrl: els.configPage.querySelector("#deepseekBaseUrl")?.value?.trim() || "",
    model: els.configPage.querySelector("#deepseekModel")?.value?.trim() || "",
    thinking: els.configPage.querySelector("#deepseekThinking")?.value || "enabled",
    reasoningEffort: els.configPage.querySelector("#deepseekReasoningEffort")?.value || "high",
  };
}

function deepSeekSettingsSignature(settings) {
  const data = {
    provider: settings.provider || "",
    apiKey: settings.apiKey || "",
    baseUrl: settings.baseUrl || "",
    model: settings.model || "",
    thinking: settings.thinking || "",
    reasoningEffort: settings.reasoningEffort || "",
  };
  return JSON.stringify(data);
}

function deepSeekConfigComplete(settings = readDeepSeekSettingsFromConfig()) {
  return Boolean(settings.provider && settings.apiKey && settings.baseUrl && settings.model);
}

function syncDeepSeekConfigButtons(messageText = "") {
  if (!els.configPage) {
    return;
  }
  const settings = readDeepSeekSettingsFromConfig();
  const complete = deepSeekConfigComplete(settings);
  const signature = deepSeekSettingsSignature(settings);
  const tested = complete && state.deepseekTestSignature === signature;
  const testButton = els.configPage.querySelector("#testDeepseekBtn");
  const saveButton = els.configPage.querySelector("#saveDeepseekSettingsBtn");
  const message = els.configPage.querySelector("#deepseekMessage");
  if (testButton) {
    testButton.disabled = !complete;
  }
  if (saveButton) {
    saveButton.disabled = !tested;
  }
  if (message && messageText) {
    message.textContent = messageText;
    message.dataset.tone = complete ? "info" : "error";
  }
}

function applyTheme(themeId) {
  const theme = THEMES.find((item) => item.id === themeId) || THEMES[0];
  const root = document.documentElement;
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--teal", theme.primary);
  root.style.setProperty("--coral", theme.accent);
  root.style.setProperty("--soft", theme.soft);
  root.style.setProperty("--page-bg", theme.bg);
  root.style.setProperty("--page-paper", "#ffffff");
  root.style.setProperty("--sidebar-bg", "color-mix(in srgb, var(--page-bg) 44%, #fff)");
  root.style.setProperty("--sidebar-head", theme.soft);
}

function renderThemeGrid() {
  const current = selectedTheme().id;
  const html = THEMES.map(
    (theme) => `
      <button class="theme-option${theme.id === current ? " is-active" : ""}" type="button" data-theme-id="${theme.id}">
        <span class="theme-swatch" style="background:linear-gradient(135deg, ${theme.primary} 0 58%, ${theme.accent} 58% 100%);border-color:${theme.soft}"></span>
        <strong>${escapeHtml(theme.name)}</strong>
        <small>${escapeHtml(theme.scope)}</small>
      </button>
    `,
  ).join("");
  if (els.themeGrid) {
    els.themeGrid.innerHTML = html;
    els.themeGrid.querySelectorAll("[data-theme-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        const themeId = button.dataset.themeId;
        const updated = { ...state.currentUser, theme: themeId };
        await putUser(updated);
        state.currentUser = updated;
        applyTheme(themeId);
        renderConfigPage();
        renderThemeGrid();
      });
    });
  }
  if (els.configPage) {
    const themeGrid = els.configPage.querySelector("#configThemeGrid");
    if (themeGrid) {
      themeGrid.innerHTML = html;
      themeGrid.querySelectorAll("[data-theme-id]").forEach((button) => {
        button.addEventListener("click", async () => {
          const themeId = button.dataset.themeId;
          const updated = { ...state.currentUser, theme: themeId };
          await putUser(updated);
          state.currentUser = updated;
          applyTheme(themeId);
          renderConfigPage();
          renderThemeGrid();
        });
      });
    }
  }
}

async function logEvent(type, detail = {}) {
  if (!state.currentUser && !detail.emailKey) {
    return;
  }
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    email: detail.email || state.currentUser?.email || "",
    emailKey: detail.emailKey || state.currentUser?.emailKey || "",
    detail,
    createdAt: new Date().toISOString(),
  };
  await withStore(EVENT_STORE, "readwrite", (store) => store.put(event));
}

function showAuthMessage(message, tone = "info") {
  els.authMessage.textContent = message;
  els.authMessage.dataset.tone = tone;
}

function setAuthTab(name) {
  els.authTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.authTab === name));
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("is-active", form.id === `${name}Form`);
  });
  showAuthMessage("");
}

async function registerUser(email) {
  const normalized = normalizeEmail(email);
  if (!isFanruanEmail(normalized)) {
    showAuthMessage("邮箱后缀必须是 @fanruan.com。", "error");
    return;
  }
  const key = emailKey(normalized);
  const existing = await getUser(normalized);
  if (existing) {
    showAuthMessage("该邮箱已经登记过，请联系 Simon.Lv@fanruan.com。", "error");
    return;
  }
  const now = new Date().toISOString();
  const user = {
    email: normalized,
    emailKey: key,
    role: "user",
    status: "pending",
    passwordHash: "",
    salt: "",
    createdAt: now,
    registeredAt: now,
    approvedAt: "",
    lastLoginAt: "",
    loginCount: 0,
    visitCount: 0,
    passwordChangedAt: "",
    pendingReset: false,
    resetRequestedAt: "",
    initialPasswordGeneratedAt: "",
  };
  await putUser(user);
  await logEvent("register", { email: user.email, emailKey: user.emailKey });
  await loadUsers();
  els.registerEmail.value = "";
  showAuthMessage("您已经注册成功，请联系 Simon.Lv@fanruan.com 分配初始密码。", "success");
}

async function login(email, password) {
  const user = await getUser(email);
  if (!user) {
    showAuthMessage("账号不存在，请先申请试用。", "error");
    return;
  }
  if (user.status !== "active") {
    showAuthMessage("账号尚未开通，请联系 Simon.Lv@fanruan.com 分配初始密码。", "error");
    return;
  }
  const ok = await verifyPassword(password, user);
  if (!ok) {
    showAuthMessage("邮箱或密码不正确。", "error");
    return;
  }
  const now = new Date().toISOString();
  const updated = {
    ...user,
    lastLoginAt: now,
    loginCount: (user.loginCount || 0) + 1,
    visitCount: (user.visitCount || 0) + 1,
  };
  await putUser(updated);
  state.currentUser = updated;
  state.deepseekTestSignature = "";
  saveSession(updated.emailKey, selectedRememberDuration());
  await logEvent("login");
  await enterApp();
}

async function restoreSession() {
  await ensureAdminUser();
  const session = readSession();
  if (!session?.emailKey) {
    renderAuthGate();
    const bootstrapPassword = localStorage.getItem(ADMIN_BOOTSTRAP_PASSWORD_KEY) || localStorage.getItem(LEGACY_ADMIN_BOOTSTRAP_PASSWORD_KEY);
    if (bootstrapPassword) {
      showAuthMessage(`首次初始化管理员账号：${ADMIN_EMAIL}，本次初始密码：${bootstrapPassword}。登录后请立即修改密码。`, "success");
    }
    return;
  }
  if (isSessionExpired(session)) {
    clearSession();
    renderAuthGate();
    showAuthMessage("登录状态已过期，请重新登录。", "info");
    return;
  }
  const user = await getUser(session.emailKey);
  if (!user || user.status !== "active") {
    clearSession();
    renderAuthGate();
    return;
  }
  const updated = { ...user, visitCount: (user.visitCount || 0) + 1 };
  await putUser(updated);
  state.currentUser = updated;
  state.deepseekTestSignature = "";
  renewSession(session);
  await logEvent("visit");
  await enterApp();
}

async function rescueAdminPassword() {
  const ok = await confirmAction({
    title: "管理员密码救援",
    message: "确认重新生成当前浏览器中的超级管理员密码吗？旧密码将失效。",
    confirmText: "确认重置",
    tone: "danger",
  });
  if (!ok) {
    return;
  }
  const password = randomPassword();
  const hashed = await hashPassword(password);
  const now = new Date().toISOString();
  const admin = await getUser(ADMIN_EMAIL);
  const updated = admin
    ? {
        ...admin,
        status: "active",
        passwordHash: hashed.hash,
        salt: hashed.salt,
        passwordChangedAt: now,
        initialPasswordGeneratedAt: now,
      }
    : {
        email: ADMIN_EMAIL,
        emailKey: ADMIN_EMAIL_KEY,
        role: "admin",
        status: "active",
        passwordHash: hashed.hash,
        salt: hashed.salt,
        createdAt: now,
        registeredAt: now,
        approvedAt: now,
        lastLoginAt: "",
        loginCount: 0,
        visitCount: 0,
        passwordChangedAt: "",
        pendingReset: false,
        resetRequestedAt: "",
        initialPasswordGeneratedAt: now,
      };
  await putUser(updated);
  localStorage.setItem(ADMIN_BOOTSTRAP_PASSWORD_KEY, password);
  localStorage.removeItem(LEGACY_ADMIN_BOOTSTRAP_PASSWORD_KEY);
  showAuthMessage(`管理员新密码已生成：${password}。请先登录再修改密码。`, "success");
}

function renderAuthGate() {
  els.authScreen.classList.remove("is-hidden");
  document.querySelector(".app-shell").classList.add("is-locked");
}

async function enterApp() {
  els.authScreen.classList.add("is-hidden");
  document.querySelector(".app-shell").classList.remove("is-locked");
  els.userBadge.textContent = state.currentUser.email;
  document.querySelectorAll(".admin-only").forEach((node) => {
    node.hidden = !isAdmin();
  });
  state.activeOwner = state.currentUser.emailKey;
  state.topicOwnerFilter = isAdmin() ? state.currentUser.email : "";
  state.materialListOwnerFilter = isAdmin() ? state.currentUser.email : "";
  applyTheme(state.currentUser.theme || THEMES[0].id);
  applyFontSettings();
  loadMaterialTaxonomy();
  loadTopicSkills();
  loadArticleSkills();
  renderThemeGrid();
  renderConfigPage();
  renderMaterialManagePage();
  renderTopicSkillPage();
  renderArticleSkillPage();
  renderVersionPage();
  await loadUsers();
  renderOwnerFilter();
  await loadDocCategories();
  await loadDocuments();
  await loadGeneratedArticles();
  await loadPendingUploads();
  renderAdminPage();
  renderRecyclePage();
  switchModule("learning");
  switchStudyView("materialOverview");
  const defaultMaterialTab = document.querySelector('.module-tab[data-study-view="materialOverview"]');
  defaultMaterialTab?.classList.add("is-active");
  renderMaterialOverviewPage();
  if (sessionStorage.getItem(ANALYSIS_COMPLETED_REDIRECT_KEY) || sessionStorage.getItem(ANALYSIS_RUNNING_KEY)) {
    sessionStorage.removeItem(ANALYSIS_COMPLETED_REDIRECT_KEY);
    sessionStorage.removeItem(ANALYSIS_RUNNING_KEY);
    switchModule("learning");
    switchStudyView("topicsHome");
    renderTopicHome();
  }
}

async function requestPasswordReset(email) {
  const user = await getUser(email);
  if (!user || !isFanruanEmail(email)) {
    showAuthMessage("如果该邮箱已登记，找回申请会进入管理员后台。", "success");
    return;
  }
  const updated = {
    ...user,
    pendingReset: true,
    resetRequestedAt: new Date().toISOString(),
  };
  await putUser(updated);
  await logEvent("reset_request", { email: user.email, emailKey: user.emailKey });
  await loadUsers();
  showAuthMessage("找回申请已提交，请联系 Simon.Lv@fanruan.com 获取重置密码。", "success");
}

async function activateUser(emailKeyValue, reason = "initial") {
  if (!isAdmin()) {
    return;
  }
  const user = await getUser(emailKeyValue);
  if (!user) {
    return;
  }
  const password = randomPassword();
  const validation = validatePassword(password);
  if (!validation.ok) {
    throw new Error(validation.message);
  }
  const hashed = await hashPassword(password);
  const now = new Date().toISOString();
  const updated = {
    ...user,
    status: "active",
    passwordHash: hashed.hash,
    salt: hashed.salt,
    approvedAt: user.approvedAt || now,
    pendingReset: false,
    resetRequestedAt: reason === "reset" ? user.resetRequestedAt : "",
    initialPasswordGeneratedAt: now,
  };
  await putUser(updated);
  await logEvent(reason === "reset" ? "reset_password_generated" : "initial_password_generated", {
    email: user.email,
    emailKey: user.emailKey,
  });
  await loadUsers();
  renderAdminPage(password, user.email);
}

async function changeOwnPassword() {
  const root = els.configPage || document;
  const message = root.querySelector("#accountMessage");
  const oldPassword = root.querySelector("#oldPassword")?.value || "";
  const newPassword = root.querySelector("#newPassword")?.value || "";
  const confirmPassword = root.querySelector("#confirmPassword")?.value || "";
  if (message) {
    message.textContent = "";
  }
  if (newPassword !== confirmPassword) {
    if (message) {
      message.textContent = "两次输入的新密码不一致。";
    }
    return;
  }
  const validation = validatePassword(newPassword);
  if (!validation.ok) {
    if (message) {
      message.textContent = validation.message;
    }
    return;
  }
  const latest = await getUser(state.currentUser.emailKey);
  const ok = await verifyPassword(oldPassword, latest);
  if (!ok) {
    if (message) {
      message.textContent = "当前密码不正确。";
    }
    return;
  }
  const hashed = await hashPassword(newPassword);
  const updated = {
    ...latest,
    passwordHash: hashed.hash,
    salt: hashed.salt,
    passwordChangedAt: new Date().toISOString(),
  };
  await putUser(updated);
  state.currentUser = updated;
  await logEvent("change_password");
  const oldInput = root.querySelector("#oldPassword");
  const newInput = root.querySelector("#newPassword");
  const confirmInput = root.querySelector("#confirmPassword");
  if (oldInput) oldInput.value = "";
  if (newInput) newInput.value = "";
  if (confirmInput) confirmInput.value = "";
  if (message) {
    message.textContent = "密码已修改。";
  }
}

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function formatOriginalParagraphs(text) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
    .filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs;
  }
  return splitSentences(normalized)
    .reduce((groups, sentence, index) => {
      const groupIndex = Math.floor(index / 3);
      groups[groupIndex] = groups[groupIndex] ? `${groups[groupIndex]}${sentence}` : sentence;
      return groups;
    }, [])
    .filter(Boolean);
}

function renderOriginalText(text = state.rawText) {
  if (!els.originalTextBody) {
    return;
  }
  const paragraphs = formatOriginalParagraphs(text);
  if (!paragraphs.length) {
    els.originalTextBody.innerHTML = `<p class="empty-state compact">上传或打开一篇文档后，这里会显示整理好的原文段落。</p>`;
    return;
  }
  els.originalTextBody.innerHTML = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function splitSentences(text) {
  const source = normalizeText(text).replace(/\n+/g, "。");
  const matches = source.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [];
  return matches
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 12 && sentence.length <= 180);
}

function countKeywordHits(text, keywords) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);
}

function classifySentence(sentence) {
  const ranked = categoryDefs
    .map((category) => ({
      category,
      score: countKeywordHits(sentence, category.keywords),
    }))
    .sort((a, b) => b.score - a.score);

  if (ranked[0].score > 0) {
    return ranked[0];
  }

  return {
    category: categoryDefs.find((category) => category.id === "leadership"),
    score: 0.5,
  };
}

function sentenceWeight(sentence) {
  const signalWords = ["必须", "核心", "关键", "本质", "真正", "不是", "而是", "只有", "越", "首先", "最后", "最重要"];
  const signalScore = countKeywordHits(sentence, signalWords) * 2;
  const lengthScore = Math.min(sentence.length / 42, 3);
  return signalScore + lengthScore;
}

function pickTopSentences(sentences, limit) {
  return [...sentences]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((item) => item.text);
}

function buildOverview(grouped, sentences, text) {
  const topCategories = Object.values(grouped)
    .filter((group) => group.items.length)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 4)
    .map((group) => group.category.name);

  const core = pickTopSentences(
    sentences.map((text) => ({ text, weight: sentenceWeight(text) })),
    1,
  )[0];

  const oneLine = core
    ? `这篇讲话的核心，是围绕“${topCategories.join("、") || "经营管理"}”建立一套从判断到行动、从实践到反馈的组织学习机制。`
    : "请上传或粘贴材料原文，系统会生成核心思想。";

  const logicLine = topCategories.length
    ? `识别出的主线是：先定义核心命题，再把观点分入${topCategories.join("、")}等维度，最后反向拆成可学习的问题文章。`
    : "系统会自动识别战略、数字化、AI、组织、流程、数据、激励、文化、领导力等维度。";

  return {
    oneLine,
    logicLine,
    wordCount: text.replace(/\s/g, "").length,
  };
}

function buildTopics(grouped) {
  const topics = Object.values(grouped)
    .filter((group) => group.items.length)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 9)
    .map((group, index) => {
      const evidence = pickTopSentences(group.items, 4);
      const question = refineQuestion(group.category, evidence);
      const difficulty = Math.min(5, Math.max(1, Math.ceil(group.items.length / 2)));

      return {
        index: index + 1,
        title: question.replace(/[？?]$/, ""),
        sourceSummary: buildTopicSourceSummary(evidence, group.category),
        category: group.category,
        categoryName: group.category.name,
        problemTypes: [group.category.name],
        difficulty,
        evidence,
        problemEssence: group.category.essence,
        surfacePhenomenon: buildSurfacePhenomenon(evidence, group.category),
        deepNature: buildDeepNature(group.category, evidence),
        ceoSolution: buildCeoSolution(evidence, group.category),
        theoryAnchors: buildTheoryAnchors(group.category, evidence),
        caseComparison: buildCaseComparison(group.category),
        moreSolutions: buildMoreSolutions(group.category),
        transferableInsights: buildTransferableInsights(group.category, evidence),
      };
    });

  return topics;
}

function buildTopicSourceSummary(evidence, category) {
  if (!evidence.length) {
    return `来自原文中关于${category.name}的相关表述。`;
  }
  const lead = evidence[0].replace(/[。；;]$/, "");
  return `来自原文：${lead.length > 42 ? `${lead.slice(0, 42)}...` : lead}`;
}

function buildSurfacePhenomenon(evidence, category) {
  if (!evidence.length) {
    return `原文中关于${category.name}的直接表述不够集中，但整体可以看出作者在强调这一领域的管理矛盾。`;
  }
  const summary = evidence.slice(0, 2).map((sentence) => sentence.replace(/[。；;]$/, "")).join("；");
  return `表面上，CEO 在讨论${category.name}问题时，直接给出的动作和判断是：${summary}。`;
}

function buildDeepNature(category, evidence) {
  const joined = evidence.join(" ");
  const hasData = /数据|指标|报表|看板|事实/.test(joined);
  const hasPractice = /一线|现场|客户|实践|复盘|共创/.test(joined);
  const hasBelief = /相信|信任|认知|习惯|经验/.test(joined);

  const psychology = {
    title: "心理学维度",
    explanation: hasBelief
      ? "核心不是不理解方法，而是认知和信任没有建立起来。人对抽象原则的接受，往往要通过具体体验来完成。"
      : "核心不是表面动作本身，而是人的感受、习惯和判断方式没有被改变，抽象方法很难直接被接受。",
    case: "可以通过让关键角色亲自体验一次问题被解决的过程，来把抽象认知变成具体信任。",
  };

  const management = {
    title: "管理学维度",
    explanation: hasData || hasPractice
      ? "核心是信息、权力和流程之间的协同关系。只有让信息进入真实流动，组织才会逼近事实。"
      : "核心是组织内部的机制是否真的让问题被看见、被讨论、被修正，而不是只停留在汇报层。",
    case: "可以通过建立固定看板、共创机制或例会节奏，让信息从一线回到决策层，再从决策层回到一线。",
  };

  const mao = {
    title: "毛泽东认识论维度",
    explanation: "核心是认识从实践中来，也必须回到实践中去检验。没有调查，就很难形成真正的发言权。",
    case: "可以把一次真实业务问题当成调查场景，让组织在实践、认识、再实践、再认识中完成升级。",
  };

  return [psychology, management, mao];
}

function buildCeoSolution(evidence, category) {
  const joined = evidence.join(" ");
  const coreJudgment = evidence.length
    ? `核心判断是：围绕${category.name}，不能只停留在抽象倡导，必须把方法落到真实场景里。`
    : `核心判断是：${category.name}问题不能靠口号解决，而要靠真实管理动作推动。`;
  const verificationMethods = [
    "让关键角色亲自看到一次数据、流程或组织动作改善后的结果。",
    "用一周到几周的持续观察，验证方法是否真的提升了判断质量。",
    "把经验最强的人和一线最真实的场景放在一起，检验是否能形成共识。",
  ];
  const keyActions = [
    /数据|指标|报表|看板/.test(joined) ? "建立老板或负责人固定查看的核心指标视图。" : "把判断拆成可讨论的核心问题，而不是停留在抽象口号。",
    /一线|现场|客户|共创/.test(joined) ? "让一线参与方案共创，减少总部单向设计。" : "把问题转成可执行动作，并让执行者参与设计。",
    "持续复盘，让方法在真实业务中越用越准。",
  ];
  return { coreJudgment, verificationMethods, keyActions };
}

function buildTheoryAnchors(category, evidence) {
  const joined = evidence.join(" ");
  const linkedTheoryModel = [
    "毛泽东《实践论》：认识来源于实践，也要回到实践中检验。",
    "毛泽东《反对本本主义》：没有调查就没有发言权。",
    "具身认知理论：抽象概念需要通过具体体验建立理解。",
    /数据|指标|报表|看板/.test(joined) ? "确认偏误：人会更容易相信熟悉的经验，忽视与经验冲突的数据。" : "组织学习理论：知识要通过反复反馈沉淀为能力。",
  ];
  const logicDissection = [
    `这类${category.name}问题的关键，不是先争论对错，而是先定义真实矛盾。`,
    "真正有效的解法，通常是把抽象原则翻译成可观察、可执行、可复盘的动作。",
    "当方法在真实场景中反复成立，认知才会从感性经验跃迁为稳定判断。",
  ];
  return { linkedTheoryModel, logicDissection };
}

function buildCaseComparison(category) {
  const cases = {
    strategy: {
      counterexample: "某企业同时追逐过多赛道，结果资源被摊薄，战略变成了什么都想要。",
      positiveExample: "另一家公司只选少数高价值赛道，围绕关键客户和能力持续投入，形成了稳定增长。",
      historicalAnalogy: "就像行军作战时不能四面出击，先明确主攻方向，资源才能集中形成优势。",
    },
    digital: {
      counterexample: "有的组织把数字化做成工具采购，系统很多，但业务动作没有真正改变。",
      positiveExample: "也有团队先梳理业务流程，再把关键环节在线化，最后让数据真正服务经营复盘。",
      historicalAnalogy: "像修路一样，不是先买一堆车，而是先把路线和节点打通。",
    },
    ai: {
      counterexample: "把 AI 当成替代所有人的黑箱工具，最后只剩下演示，没有组织能力变化。",
      positiveExample: "把 AI 放进研究、训练、复盘和知识沉淀后，团队学习速度明显提高。",
      historicalAnalogy: "像把算盘换成更快的计算器，真正变化的不是工具本身，而是工作方式。",
    },
    organization: {
      counterexample: "总部把规则设计完再往下推，一线觉得不适用，最后执行变形。",
      positiveExample: "一线参与共创后，规则更贴近现场，执行和责任感都更强。",
      historicalAnalogy: "像打井，只有真正挖到地下水层，组织才会持续出水。",
    },
    process: {
      counterexample: "流程只存在于文档里，遇到异常就靠负责人临场发挥。",
      positiveExample: "把关键节点、检查点和异常处理写成 SOP 后，组织开始稳定复制成功。",
      historicalAnalogy: "像铺轨，只有轨道标准化，列车才能持续稳定前进。",
    },
    data: {
      counterexample: "只看汇总报表，不看结构和场景，结果把增长误读成健康。",
      positiveExample: "拆开新客、复购、利润、回款之后，真实问题才会浮出来。",
      historicalAnalogy: "像体检，不能只看体温，必须结合多项指标一起判断。",
    },
    incentive: {
      counterexample: "只考核结果，员工就容易保守，不愿暴露问题。",
      positiveExample: "把主动发现问题和沉淀方法也纳入奖励后，组织会更愿意进化。",
      historicalAnalogy: "像种庄稼，不能只收割，还要给土地持续施肥。",
    },
    culture: {
      counterexample: "把价值观挂在墙上，但关键时刻的取舍完全相反。",
      positiveExample: "在资源分配和关键决策中体现长期价值观，文化才会真正落地。",
      historicalAnalogy: "像磨刀，文化不是说出来的，而是在反复磨炼中形成的。",
    },
    leadership: {
      counterexample: "领导者只给结论，不拆矛盾，团队只会更焦虑。",
      positiveExample: "把复杂问题拆成判断、动作和反馈，团队就更容易跟上节奏。",
      historicalAnalogy: "像指挥一场演练，先明确目标和队形，大家才知道往哪里走。",
    },
  };
  return cases[category.id] || cases.leadership;
}

function buildMoreSolutions(category) {
  const solutions = {
    strategy: [
      {
        title: "标杆参访法",
        steps: ["找一家具备参考意义的企业。", "让老板亲眼看见别人如何做取舍。", "把参访收获转成自己的决策标准。"],
        applicability: "适合老板对外部学习保持开放时使用。",
      },
      {
        title: "痛点突破法",
        steps: ["选一个老板最痛的经营问题。", "用数据或机制快速给出答案。", "让他直接感受到新方法的价值。"],
        applicability: "适合组织有明确痛点、急需突破时使用。",
      },
      {
        title: "驾驶舱法",
        steps: ["提炼 5 到 8 个核心指标。", "每周固定同步一次。", "把看数据变成决策习惯。"],
        applicability: "适合需要建立长期数据习惯的团队使用。",
      },
    ],
    digital: [
      {
        title: "流程先行法",
        steps: ["先画流程，再定系统。", "把关键节点在线化。", "让数据自动沉淀到业务中。"],
        applicability: "适合数字化基础薄弱但流程复杂的组织。",
      },
      {
        title: "试点复制法",
        steps: ["先选一个高价值场景。", "把成功经验沉淀成模板。", "再复制到更多部门。"],
        applicability: "适合资源有限、需要快速见效的团队。",
      },
      {
        title: "指标绑定法",
        steps: ["把每个流程节点绑定指标。", "让系统服务经营复盘。", "持续迭代表单和看板。"],
        applicability: "适合重视经营透明度的组织。",
      },
    ],
    ai: [
      {
        title: "场景嵌入法",
        steps: ["挑选高频知识场景。", "让 AI 先做整理和初稿。", "由业务负责人完成判断。"],
        applicability: "适合知识密集型组织。",
      },
      {
        title: "训练闭环法",
        steps: ["把优秀案例转成题库。", "用 AI 生成练习材料。", "通过训练反馈持续优化。"],
        applicability: "适合销售、客服、培训等场景。",
      },
      {
        title: "人机协同法",
        steps: ["明确 AI 能做什么。", "明确人必须判断什么。", "建立生成与审核的分工。"],
        applicability: "适合对结果质量要求高的场景。",
      },
    ],
    organization: [
      {
        title: "一线共创法",
        steps: ["先收集一线问题。", "再让一线参与方案设计。", "最后小范围试点验证。"],
        applicability: "适合执行阻力大、总部与一线脱节时使用。",
      },
      {
        title: "规则抽象法",
        steps: ["总部只抽象规则。", "把资源协调和例外处理留给组织中枢。", "让一线承担执行与反馈。"],
        applicability: "适合层级较多、协同复杂的组织。",
      },
      {
        title: "复盘推广法",
        steps: ["试点后做复盘。", "把有效做法沉淀成标准。", "再推广到更大范围。"],
        applicability: "适合需要持续复制经验的组织。",
      },
    ],
    process: [
      {
        title: "五要素拆解法",
        steps: ["拆成输入、动作、责任人、输出、检查点。", "逐项补齐。", "再验证是否可执行。"],
        applicability: "适合需要标准化的场景。",
      },
      {
        title: "异常倒逼法",
        steps: ["收集异常案例。", "反推流程漏洞。", "用异常驱动更新 SOP。"],
        applicability: "适合经常出现临场救火的团队。",
      },
      {
        title: "节奏固化法",
        steps: ["把关键复盘固定在周会或月会。", "让流程与节奏绑定。", "形成稳定闭环。"],
        applicability: "适合项目多、变化快的组织。",
      },
    ],
    data: [
      {
        title: "场景复盘法",
        steps: ["把数据和具体业务场景绑定。", "拆出原因、动作和反馈。", "避免只看数字不看问题。"],
        applicability: "适合经营管理层使用。",
      },
      {
        title: "领先指标法",
        steps: ["区分领先指标和滞后指标。", "提前识别趋势变化。", "减少事后才发现问题。"],
        applicability: "适合增长和经营压力大的团队。",
      },
      {
        title: "老板看板法",
        steps: ["只保留少量核心指标。", "固定时间查看。", "持续校准口径和数据质量。"],
        applicability: "适合需要建立高层数据习惯的组织。",
      },
    ],
    incentive: [
      {
        title: "行为奖励法",
        steps: ["把发现问题也纳入奖励。", "把共创和沉淀方法也纳入激励。", "让组织更愿意分享经验。"],
        applicability: "适合希望鼓励学习型文化的组织。",
      },
      {
        title: "双层激励法",
        steps: ["个人激励与团队激励并行。", "避免只追个人最优。", "把局部行为导向整体目标。"],
        applicability: "适合团队协作强的业务。",
      },
      {
        title: "关键行为法",
        steps: ["识别最关键的管理行为。", "让奖励直接指向这些行为。", "持续校正激励方向。"],
        applicability: "适合需要改变员工行为模式的团队。",
      },
    ],
    culture: [
      {
        title: "场景翻译法",
        steps: ["把价值观翻译成场景行为。", "在关键决策中验证。", "通过真实案例传播。"],
        applicability: "适合文化口号较多但落地不足的组织。",
      },
      {
        title: "取舍证明法",
        steps: ["用资源分配证明价值观。", "让员工看到文化如何影响选择。", "用行为而不是口号定义文化。"],
        applicability: "适合处于变革期的组织。",
      },
      {
        title: "长期复利法",
        steps: ["坚持重复关键价值标准。", "让组织在长期中形成一致性。", "把文化变成稳定力量。"],
        applicability: "适合希望构建长期竞争力的企业。",
      },
    ],
    leadership: [
      {
        title: "问题拆解法",
        steps: ["先定义问题。", "再找主要矛盾。", "最后让团队知道先做什么。"],
        applicability: "适合复杂决策和变革推进。",
      },
      {
        title: "节奏复盘法",
        steps: ["建立周度或月度复盘。", "持续修正判断。", "让组织跟随节奏前进。"],
        applicability: "适合变化快、信息多的组织。",
      },
      {
        title: "行动牵引法",
        steps: ["用可执行动作替代空泛口号。", "让团队先动起来。", "在行动中修正认知。"],
        applicability: "适合团队焦虑、认知不统一时使用。",
      },
    ],
  };
  return solutions[category.id] || solutions.leadership;
}

function buildTransferableInsights(category, evidence) {
  const joined = evidence.join(" ");
  const team = /一线|共创|现场/.test(joined)
    ? "对团队的启示：不要只等总部给答案，要把一线经验变成组织共识。"
    : "对团队的启示：不要被抽象道理卡住，要把方法落到真实问题上。";
  const reader = /数据|指标|报表/.test(joined)
    ? "对读者的行动建议：下次想推动某个数据时，不要只发报表，而要先想它能解决什么真实痛点。"
    : "对读者的行动建议：下次遇到类似问题，先问自己这件事的核心矛盾是什么，再决定怎么做。";
  return { team, reader };
}

function refineQuestion(category, evidence) {
  const joined = evidence.join("；");
  if (category.id === "ai" && /销售|客户|知识|研究|复盘|训练/.test(joined)) {
    return "AI 如何从工具升级为组织学习速度的放大器？";
  }
  if (category.id === "digital" && /数据|流程|在线|系统/.test(joined)) {
    return "数字化如何把业务经验沉淀为可复用的组织能力？";
  }
  if (category.id === "strategy" && /取舍|选择|减法|机会|资源/.test(joined)) {
    return "战略为什么首先是取舍，而不是把所有机会都抓住？";
  }
  if (category.id === "organization" && /一线|共创|现场|总部/.test(joined)) {
    return "为什么一线共创比总部单向设计更能推动执行？";
  }
  if (category.id === "incentive" && /奖励|考核|分配/.test(joined)) {
    return "为什么奖励机制比单纯考核更能牵引组织行为？";
  }
  return category.question;
}

function buildActualSolution(evidence, category) {
  if (!evidence.length) {
    return `讲话中没有足够原文支撑，需要继续补充与${category.name}有关的材料。`;
  }
  const restored = evidence.slice(0, 3).map((sentence) => `“${sentence.replace(/[。；;]$/, "")}”`).join("；");
  return `讲话中的实际做法可以还原为：围绕${category.name}问题，把关键判断落到具体动作上。可直接依据的原文包括：${restored}。`;
}

function buildLogic(category, evidence) {
  const hasPractice = /一线|现场|客户|数据|复盘|实践/.test(evidence.join(""));
  const practiceLine = hasPractice
    ? "它强调从真实业务现场取得认识，再回到现场检验，符合“实践-认识-再实践”的闭环。"
    : "它先抓主要矛盾，再把分散观点收束为组织可以执行的判断。";
  return `${category.logic}${practiceLine}`;
}

function buildCaseStory(category) {
  const stories = {
    strategy: "一家多业务公司曾同时追逐多个热门赛道，销售、研发、交付都被拉扯。后来管理层把行业吸引力、客户付费意愿、内部能力三项放到同一张表里，砍掉低协同项目，把资源集中到两个核心场景。半年后，团队不再争论“要不要做”，而是围绕“怎样做到第一”形成合力。",
    digital: "某区域团队原本依赖个人经验跟进客户，人员流动后线索大量断层。后来他们把客户分层、跟进记录、复盘结论全部在线化，新人可以直接看到前人的判断和动作，管理者也能发现流程中最容易掉点的位置。",
    ai: "一个知识密集型团队把 AI 放进研究、培训和复盘环节：先让 AI 整理行业资料，再由业务负责人判断重点，最后把优秀销售对话转成训练题库。AI 没有替代管理者，却把团队学习速度从“靠师傅带”提升为“靠系统持续训练”。",
    organization: "总部曾制定一套看似完整的流程，但一线认为太慢、太重，执行时大量变形。后来改成让一线先提出高频问题，总部只做规则抽象和资源协调，流程上线后阻力明显下降，因为执行者也是设计者。",
    process: "一个项目团队过去每次成功都靠负责人临场推进，换人后质量波动很大。后来他们把关键节点、检查清单、异常处理和复盘机制写入 SOP，项目不再依赖单个英雄，而是依赖稳定流程。",
    data: "管理层看到销售额增长后曾误判业务健康，后来拆开新客、复购、毛利、回款周期才发现增长来自低毛利订单。数据被重新解释后，公司调整了客户选择标准，增长质量才真正改善。",
    incentive: "一家公司只考核结果，员工倾向于保守完成指标，不愿暴露问题。后来增加“主动发现问题并沉淀方法”的奖励，团队开始把经验写成模板，组织能力反而比单纯追指标提升更快。",
    culture: "一家企业把“客户第一”写在墙上很多年，但真正改变来自一次资源取舍：公司放弃短期收入更高但损害客户体验的项目，把资源投向长期口碑。那一刻，文化从口号变成了可观察的行为。",
    leadership: "一次业务转型中，团队对方向有很多焦虑。负责人没有先喊口号，而是把问题拆成客户价值、能力缺口、组织动作和反馈指标四部分，每周复盘一次。复杂问题被讲清楚后，团队才真正开始行动。",
  };
  return stories[category.id] || stories.leadership;
}

function buildBetterOptions(category) {
  const shared = {
    strategy: ["建立“机会评分表”：用客户价值、利润质量、能力匹配、战略协同四项做取舍。", "设置季度战略复盘：只允许新增少量关键战役，避免资源再次被摊薄。"],
    digital: ["先画业务流程图，再决定系统功能，避免数字化变成工具堆砌。", "把每个流程节点绑定数据指标，让系统天然服务于经营复盘。"],
    ai: ["选择 3 个高频场景做 AI 试点，例如行业研究、客户问答、复盘纪要。", "建立人机协同标准：AI 负责生成初稿和对比，业务负责人负责判断和定稿。"],
    organization: ["把一线共创做成固定机制：问题征集、方案共创、小范围试点、复盘推广。", "明确总部角色：少做命令发布，多做规则抽象、资源协调和跨团队复制。"],
    process: ["把流程拆成输入、动作、责任人、输出、检查点五要素。", "用异常案例倒逼流程更新，让 SOP 从静态文档变成活机制。"],
    data: ["建立“数据-场景-行动”三栏复盘，防止只看指标不看原因。", "区分领先指标和滞后指标，提前发现经营变化。"],
    incentive: ["把奖励从结果扩展到关键行为，例如发现问题、共创方案、沉淀标准。", "设计团队激励与个人激励的组合，避免局部最优损害整体目标。"],
    culture: ["把价值观翻译成关键场景中的行为标准。", "用真实取舍案例讲文化，让员工看到文化如何影响资源分配。"],
    leadership: ["用“问题-矛盾-动作-反馈”四段式沟通复杂决策。", "建立领导者复盘日志，持续校准自己的判断与组织反馈。"],
  };
  return shared[category.id] || shared.leadership;
}

function extractQuotes(sentences) {
  return sentences
    .map((text) => ({ text, weight: sentenceWeight(text) + (/[“”]/.test(text) ? 1 : 0) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 10)
    .map((item) => item.text);
}

function suggestTagsFromAnalysis(analysis) {
  const categoryTags = analysis.activeCategories
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 5)
    .map((group) => group.category.name);
  const quoteTags = analysis.quotes
    .join(" ")
    .match(/AI|数字化|战略|组织|文化|流程|数据|激励|领导力|一线|客户|复盘/g) || [];
  return [...new Set([...categoryTags, ...quoteTags])].slice(0, 8);
}

function analyzeText(rawText) {
  const text = normalizeText(rawText);
  const sentences = splitSentences(text);
  const grouped = Object.fromEntries(
    categoryDefs.map((category) => [category.id, { category, items: [] }]),
  );

  sentences.forEach((sentence) => {
    const { category, score } = classifySentence(sentence);
    grouped[category.id].items.push({
      text: sentence,
      weight: sentenceWeight(sentence) + score,
    });
  });

  const overview = buildOverview(grouped, sentences, text);
  const topics = buildTopics(grouped);
  const quotes = extractQuotes(sentences);
  const activeCategories = Object.values(grouped).filter((group) => group.items.length);
  const suggestedTags = suggestTagsFromAnalysis({ activeCategories, quotes });

  return {
    text,
    sentences,
    grouped,
    overview,
    topics,
    quotes,
    activeCategories,
    suggestedTags,
    deepeningModes,
  };
}

function renderDeepening(modes = deepeningModes) {
  if (!els.deepeningBoard) {
    return;
  }
  els.deepeningBoard.innerHTML = "";
  modes.forEach((mode) => {
    const card = document.createElement("article");
    card.className = "deepening-card";
    const questions = mode.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("");
    card.innerHTML = `
      <h3>${escapeHtml(mode.title)}</h3>
      <p>${escapeHtml(mode.goal)}</p>
      <ul>${questions}</ul>
    `;
    els.deepeningBoard.appendChild(card);
  });
}

function buildDeepSeekPrompt(text, skill = currentTopicSkill()) {
  const categories = categoryDefs.map((item) => item.name).join("、");
  const targetTypeName = skill?.targetMaterialTypeName || "高层视角";
  const targetTypeId = skill?.targetMaterialTypeId || "type-executive-view";
  const targetTypeKind = materialTypeKind(targetTypeId, targetTypeName);
  const skillInstruction = skill?.prompt
    ? `\n\n当前话题 SKILL 版本：${skill.version}｜${skill.summary}\n请优先遵循以下 SKILL 组织规则：\n${skill.prompt}`
    : "";
  if (targetTypeKind === "meeting") {
    return [
      {
        role: "system",
        content:
          "你是一个会议纪要分析助手。请严格根据输入原文进行结构化拆解，输出适合前端渲染的JSON，不要输出多余解释。请区分会议纪要分析内容与可提炼话题；如果没有自然的话题，不要强行生成。",
      },
      {
        role: "user",
        content: `
请基于下面的会议纪要原文，输出JSON对象，字段结构如下：
{
  "overview": {"oneLine": "", "logicLine": "", "wordCount": 0},
  "meetingAnalysis": {
    "meetingInfo": {
      "topic": "",
      "goal": "",
      "time": "",
      "duration": "",
      "participants": [],
      "absentees": [],
      "host": "",
      "recorder": ""
    },
    "decisions": [{"index": 1, "issue": "", "decision": "", "reason": ""}],
    "actionItems": [{"index": 1, "action": "", "owner": "", "deadline": "", "source": ""}],
    "discussionSummary": [{"issue": "", "background": "", "keyViews": [], "divergences": "", "conclusion": ""}],
    "collaboration": {"mood": "", "attitudeDistribution": [], "conflictPoints": [], "falseConsensus": []},
    "risksAndDependencies": {"explicitRisks": [], "implicitRisks": [], "dependencies": [], "missingInfo": []},
    "pendingQuestions": [{"question": "", "status": "", "followUp": ""}],
    "topicExtractionNote": ""
  },
  "categories": [{"name": "", "colorHint": "", "sentences": []}],
  "topics": [{
    "index": 1,
    "title": "",
    "sourceSummary": "",
    "categoryName": "",
    "problemTypes": ["战略", "数据", "领导力"],
    "difficulty": 1,
    "evidence": [],
    "problemEssence": "",
    "surfacePhenomenon": "",
    "deepNature": [
      {"title": "心理学维度", "explanation": "", "case": ""},
      {"title": "管理学维度", "explanation": "", "case": ""},
      {"title": "毛泽东认识论维度", "explanation": "", "case": ""}
    ],
    "ceoSolution": {
      "coreJudgment": "",
      "verificationMethods": ["", "", ""],
      "keyActions": ["", "", ""]
    },
    "theoryAnchors": {
      "linkedTheoryModel": ["", "", ""],
      "logicDissection": ["", "", ""]
    },
    "caseComparison": {
      "counterexample": "",
      "positiveExample": "",
      "historicalAnalogy": ""
    },
    "moreSolutions": [
      {"title": "", "steps": ["", "", ""], "applicability": ""},
      {"title": "", "steps": ["", "", ""], "applicability": ""},
      {"title": "", "steps": ["", "", ""], "applicability": ""}
    ],
    "transferableInsights": {
      "team": "",
      "reader": ""
    }
  }],
  "quotes": [],
  "suggestedTags": ["", ""],
  "deepeningModes": [{"title": "", "goal": "", "questions": ["", "", ""]}]
}

要求：
1. 只输出JSON。
2. overview.oneLine 和 overview.logicLine 必须是基于会议原文的具体提炼，禁止使用通用模板句。
3. meetingAnalysis 必须输出会议纪要专属分析内容，不能用高层讲话结构替代。
4. topics 只有在原文存在清晰可提炼的话题时才输出；没有就返回空数组。
5. topics 中每个话题至少提供 2 条原文证据。
6. language 必须中文，内容必须贴合原文，不要编造。
${skillInstruction}
  19. 这个会议纪要原文如下：
${text}
      `.trim(),
      },
    ];
  }
  if (targetTypeKind === "training") {
    return [
      {
        role: "system",
        content:
          "你是一个培训材料分析助手。请严格根据输入原文进行结构化拆解，输出适合前端渲染的JSON，不要输出多余解释。请区分培训分析内容与可提炼话题；如果没有自然的话题，不要强行生成。",
      },
      {
        role: "user",
        content: `
请基于下面的培训讲话原文，输出JSON对象，字段结构如下：
{
  "overview": {"oneLine": "", "logicLine": "", "wordCount": 0},
  "trainingAnalysis": {
    "trainingInfo": {
      "topic": "",
      "trainingType": "",
      "targetAudience": "",
      "trainer": "",
      "duration": "",
      "prerequisites": ""
    },
    "knowledgeItems": [{
      "name": "",
      "type": "概念/知识点/方法/工具/流程",
      "coreViewpoint": "",
      "originalExplanation": "",
      "detailedExplanation": "",
      "whyImportant": "",
      "evidence": [],
      "scenarios": [{
        "name": "",
        "context": "",
        "teacherExplanation": "",
        "detailedExpansion": "",
        "applicability": "",
        "evidence": ""
      }],
      "attentionPoints": [{
        "issue": "",
        "whyItMatters": "",
        "detailedAnalysis": "",
        "correction": "",
        "evidence": ""
      }],
      "extensions": [{
        "title": "",
        "industryCase": "",
        "detailedExpansion": "",
        "relatedKnowledge": "",
        "transferScenario": "",
        "learningSuggestion": ""
      }],
      "practice": {
        "task": "",
        "steps": [],
        "checkpoints": []
      }
    }],
    "overallLogic": {
      "oneLine": "",
      "learningPath": [],
      "knowledgeRelations": [],
      "capabilityLoop": ""
    },
    "topicExtractionNote": ""
  },
  "categories": [{"name": "", "colorHint": "", "sentences": []}],
  "topics": [{
    "index": 1,
    "title": "",
    "sourceSummary": "",
    "categoryName": "",
    "problemTypes": ["技术", "业务", "方法论"],
    "difficulty": 1,
    "evidence": [],
    "trainingTopic": {
      "knowledgeName": "",
      "knowledgeType": "概念/知识点/方法/工具/流程",
      "learningQuestion": "",
      "coreViewpoint": "",
      "teacherExplanation": "",
      "detailedExplanation": "",
      "scenarios": [{
        "name": "",
        "context": "",
        "teacherExplanation": "",
        "detailedExpansion": "",
        "applicability": "",
        "evidence": ""
      }],
      "attentionPoints": [{
        "issue": "",
        "whyItMatters": "",
        "detailedAnalysis": "",
        "correction": "",
        "evidence": ""
      }],
      "extensions": [{
        "title": "",
        "industryCase": "",
        "detailedExpansion": "",
        "relatedKnowledge": "",
        "transferScenario": "",
        "learningSuggestion": ""
      }],
      "practice": {
        "task": "",
        "steps": [],
        "checkpoints": []
      },
      "logicSummary": "",
      "learnerTakeaway": ""
    }
  }],
  "quotes": [],
  "suggestedTags": ["", ""],
  "deepeningModes": [{"title": "", "goal": "", "questions": ["", "", ""]}]
}

要求：
1. 只输出JSON。
2. overview.oneLine 和 overview.logicLine 必须是基于培训原文的具体提炼，必须出现原文中的课程对象、业务/技术场景或关键方法。
3. trainingAnalysis 必须输出培训讲话专属分析内容，不能用高层讲话或会议纪要结构替代。
4. trainingInfo.trainingType 必须判断为“技术培训 / 业务培训 / 产品培训 / 方法论培训 / 混合培训”等之一。
5. knowledgeItems 必须按照原文中出现的知识点、概念、方法、工具、流程、步骤、误区、案例、判断标准来拆解，不要按泛泛课程模块流水账总结。
6. knowledgeItems 要细，不要粗：一个知识点、一个方法步骤、一个工具用法、一个注意事项都可以单独成项。
7. 每个 knowledgeItem 必须包含老师讲到的一个或多个具体场景；如果原文只讲了一个场景，就输出一个，不要硬凑多个。
8. 每个 knowledgeItem 必须包含注意问题：误区、风险、边界、易错点或应用前提；原文没直接说但可合理补充的，必须标注 [推断]。
9. extensions 是大模型基于知识点和场景做的知识体系延伸，必须标注 [扩展]，可以包含行业案例、关联知识点、迁移场景和学习建议。
10. overallLogic 必须总结整个培训的知识点整体逻辑，说明这些知识点如何构成学习路径和能力闭环。
11. topics 原则上必须输出。除非原文极短或没有教学内容，不要返回空数组。
12. 对约 1 小时培训内容，topics 通常至少 10 个左右，建议 10-15 个；短材料至少 5-8 个；信息密度高可以更多。
13. 如果 topics 少于 8 个，必须在 topicExtractionNote 中说明无法继续细拆的具体原因。
14. 培训 topics 不能使用 CEO 高层讲话文章结构，不要输出 CEO 解法、毛选视角、战略/组织管理式文章。
15. 每个 topic 必须围绕一个细知识点/概念/方法/工具/步骤/误区/场景来组织，并输出 trainingTopic。
16. trainingTopic 必须包含：知识点名称、学习问题、老师怎么讲、讲解场景、注意问题、知识扩展、练习任务、整体逻辑和学习者收获。
17. trainingTopic 必须同时包含 coreViewpoint 和 detailedExplanation：coreViewpoint 用 1-2 句给出核心观点，detailedExplanation 用 120-220 字展开讲清楚含义、机制、应用方式、边界和与原文场景的关系。
18. scenarios 中的 detailedExpansion 要解释这个场景为什么能说明该知识点，通常 80-160 字；不要只写短语。
19. attentionPoints 中的 detailedAnalysis 要解释风险成因、触发条件、后果和纠偏逻辑，通常 80-160 字。
20. extensions 中的 detailedExpansion 必须用 [扩展] 标注，结合行业案例、类比或迁移场景展开，通常 100-200 字。
21. topics 中每个话题至少提供 2 条原文证据，证据必须能直接支撑这个细话题。
22. 不要把多个不同知识点合并成一个大话题；宁可拆细，也不要粗略概括。
23. language 必须中文，内容必须贴合原文；原文依据不能编造，扩展内容必须标注 [扩展]。
${skillInstruction}
  24. 这个培训讲话原文如下：
${text}
      `.trim(),
      },
    ];
  }
  return [
    {
      role: "system",
      content:
        "你是一个企业高层视角材料分析助手。请严格根据输入原文进行结构化拆解，输出适合前端渲染的JSON，不要输出多余解释。你必须按照用户指定的文章框架生成内容。",
    },
    {
      role: "user",
      content: `
请基于下面的高层视角材料原文，输出JSON对象，字段结构如下：
{
  "overview": {"oneLine": "", "logicLine": "", "wordCount": 0},
  "categories": [{"name": "", "colorHint": "", "sentences": []}],
  "caseScenes": [{"caseNo": 1, "caseTitle": "", "coreConflict": "", "managementAction": "", "topicTitle": ""}],
  "topics": [{
    "index": 1,
    "title": "",
    "sourceSummary": "",
    "categoryName": "",
    "problemTypes": ["战略", "数据", "领导力"],
    "difficulty": 1,
    "evidence": [],
    "problemEssence": "",
    "surfacePhenomenon": "",
    "deepNature": [
      {"title": "心理学维度", "explanation": "", "case": ""},
      {"title": "管理学维度", "explanation": "", "case": ""},
      {"title": "毛泽东认识论维度", "explanation": "", "case": ""}
    ],
    "ceoSolution": {
      "coreJudgment": "",
      "verificationMethods": ["", "", ""],
      "keyActions": ["", "", ""]
    },
    "theoryAnchors": {
      "linkedTheoryModel": ["", "", ""],
      "logicDissection": ["", "", ""]
    },
    "caseComparison": {
      "counterexample": "",
      "positiveExample": "",
      "historicalAnalogy": ""
    },
    "moreSolutions": [
      {"title": "", "steps": ["", "", ""], "applicability": ""},
      {"title": "", "steps": ["", "", ""], "applicability": ""},
      {"title": "", "steps": ["", "", ""], "applicability": ""}
    ],
    "transferableInsights": {
      "team": "",
      "reader": ""
    }
  }],
  "quotes": [],
  "suggestedTags": ["", ""],
  "deepeningModes": [{"title": "", "goal": "", "questions": ["", "", ""]}]
}

要求：
1. 只输出JSON。
2. 话题要围绕企业战略、数字化、AI、组织管理、流程、数据、激励、文化、领导力等。
3. overview.oneLine 和 overview.logicLine 必须是读完这篇文章后的具体提炼，必须出现原文中的关键对象、场景或管理动作。禁止使用“围绕某些分类建立一套机制”“先定义核心命题，再分入维度”这类通用模板句。
4. 左侧 topics 必须全部来源于原文，不允许生成原文没有出现或没有依据的泛泛题目。每个 topic 的 evidence 至少给 2 条原文句子；sourceSummary 用一句话说明这个话题来自原文哪段表达。
5. titles 要像问题，适合做学习文章标题，但必须能被 evidence 直接支撑。标题中尽量保留原文中的具体名词、业务对象或管理场景。
6. 右侧文章内容必须围绕当前 topic 的 title、sourceSummary、evidence 展开，不要脱离话题发散成通用管理文章。
7. 每个 topic 必须按以下文章框架写清楚：难度等级、问题类型、问题实质、表面现象、深层本质、CEO的解法与关键动作、底层逻辑（理论锚点）、案例对照（跨时空验证）、更多解法与选择（拓展思维）、可迁移的启示。
8. problemTypes 可以是多个类型，例如 ["战略", "数据", "领导力"]，但 categoryName 只填最主要的一个类型。
9. 深层本质必须拆成三个维度，建议固定为：心理学维度、管理学维度、毛泽东认识论维度；每个维度都要有 explanation 和 case。
10. CEO的解法与关键动作要包含核心判断、验证方法、关键行动。
11. 底层逻辑要包含关联理论/模型，以及逻辑拆解。
12. 案例对照要包含反例、正例、历史类比。
13. 更多解法与选择至少给出 3 种，每种都要有步骤和适用场景。
14. 可迁移的启示要包含对团队的启示和对读者的行动建议。
15. quotes 选最值得反复学习的原文句子，最多10条。
16. categories 至少输出3个，最多8个。
17. suggestedTags 输出最核心的标签。
18. 如果原文是案例复盘、案例实录、组织变革全景复盘，必须先输出 caseScenes，逐一列出识别到的独立案例场景。caseScenes 的数量应与原文“案例 X”数量一致。
19. 对案例场景型材料，topics 必须按 caseScenes 逐个生成：一个独立案例场景至少生成一个 topic。比如原文写明“十五大案例”或出现“案例 1”到“案例 15”，topics 通常必须输出 15 个左右，不能只输出 4-8 个宏观主题。
20. 对案例场景型材料，topic.sourceSummary 必须写成“来自案例X：……”；topic.title 必须保留该案例里的具体组织场景、业务对象或管理动作。
21. 如果多个案例都属于“组织隔离/组织融合/行业化”等同一主题，也不能合并。可以共用标签，但要分别形成不同话题。
22. 只有当某个案例完全没有可学习的管理问题时，才允许不生成对应 topic；但必须在 caseScenes 的 topicTitle 中写“未形成话题：原因”。
23. 语言必须中文，内容必须贴合原文，不要编造不存在的事实。${skillInstruction}
  24. 这个讲话的原文如下：
${text}
      `.trim(),
    },
  ];
}

function parseJsonFromText(content) {
  const text = String(content || "").trim();
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) {
    throw new Error("大模型返回内容不是有效 JSON。");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function normalizeDeepSeekAnalysis(raw, sourceText) {
  sanitizeDeepSeekTopics(raw);
  validateDeepSeekAnalysis(raw, sourceText);
  const fallback = analyzeText(sourceText);
  const categories = Array.isArray(raw?.categories) ? raw.categories : [];
  const categoryMap = new Map(categoryDefs.map((item) => [item.name, item]));
  const activeCategories = categories
    .map((item) => {
      const matched = categoryMap.get(item.name) || categoryDefs.find((def) => def.name === item.name) || categoryDefs[0];
      const sentences = Array.isArray(item.sentences) ? item.sentences : [];
      return {
        category: matched,
        items: sentences.map((sentence) => ({ text: sentence, weight: sentenceWeight(sentence) })),
      };
    })
    .filter((item) => item.items.length);

  const topics = Array.isArray(raw?.topics) && raw.topics.length
    ? raw.topics.map((topic, index) => {
        const category = categoryMap.get(topic.categoryName) || categoryDefs.find((item) => item.name === topic.categoryName) || fallback.topics[index]?.category || categoryDefs[0];
        const deepNature = Array.isArray(topic.deepNature) && topic.deepNature.length
          ? topic.deepNature.slice(0, 3).map((item, deepIndex) => ({
              title: item.title || ["心理学维度", "管理学维度", "毛泽东认识论维度"][deepIndex] || `维度${deepIndex + 1}`,
              explanation: item.explanation || "",
              case: item.case || "",
            }))
          : buildDeepNature(category, topic.evidence || []);
        const ceoSolution = topic.ceoSolution || {};
        const theoryAnchors = topic.theoryAnchors || {};
        const caseComparison = topic.caseComparison || {};
        const moreSolutions = Array.isArray(topic.moreSolutions) && topic.moreSolutions.length
          ? topic.moreSolutions.slice(0, 3).map((item) => ({
              title: item.title || "",
              steps: Array.isArray(item.steps) ? item.steps.slice(0, 3) : [],
              applicability: item.applicability || "",
            }))
          : buildMoreSolutions(category);
        const transferableInsights = topic.transferableInsights || {};
        const problemTypes = normalizeProblemTypes(topic.problemTypes, topic.categoryName, category.name);
        return {
          index: topic.index || index + 1,
          title: topic.title || fallback.topics[index]?.title || "未命名问题",
          sourceSummary: topic.sourceSummary || buildTopicSourceSummary(Array.isArray(topic.evidence) ? topic.evidence : [], category),
          category,
          categoryName: category.name,
          problemTypes,
          difficulty: Math.min(5, Math.max(1, Number(topic.difficulty || 3))),
          evidence: Array.isArray(topic.evidence) ? topic.evidence.slice(0, 4) : [],
          problemEssence: topic.problemEssence || topic.essence || category.essence,
          surfacePhenomenon: topic.surfacePhenomenon || buildSurfacePhenomenon(Array.isArray(topic.evidence) ? topic.evidence : [], category),
          deepNature,
          ceoSolution: {
            coreJudgment: ceoSolution.coreJudgment || topic.actualSolution || buildCeoSolution(Array.isArray(topic.evidence) ? topic.evidence : [], category).coreJudgment,
            verificationMethods: Array.isArray(ceoSolution.verificationMethods) && ceoSolution.verificationMethods.length
              ? ceoSolution.verificationMethods.slice(0, 3)
              : buildCeoSolution(Array.isArray(topic.evidence) ? topic.evidence : [], category).verificationMethods,
            keyActions: Array.isArray(ceoSolution.keyActions) && ceoSolution.keyActions.length
              ? ceoSolution.keyActions.slice(0, 3)
              : buildCeoSolution(Array.isArray(topic.evidence) ? topic.evidence : [], category).keyActions,
          },
          theoryAnchors: {
            linkedTheoryModel: Array.isArray(theoryAnchors.linkedTheoryModel) && theoryAnchors.linkedTheoryModel.length
              ? theoryAnchors.linkedTheoryModel.slice(0, 4)
              : buildTheoryAnchors(category, Array.isArray(topic.evidence) ? topic.evidence : []).linkedTheoryModel,
            logicDissection: Array.isArray(theoryAnchors.logicDissection) && theoryAnchors.logicDissection.length
              ? theoryAnchors.logicDissection.slice(0, 3)
              : buildTheoryAnchors(category, Array.isArray(topic.evidence) ? topic.evidence : []).logicDissection,
          },
          caseComparison: {
            counterexample: caseComparison.counterexample || topic.caseStory || buildCaseComparison(category).counterexample,
            positiveExample: caseComparison.positiveExample || buildCaseComparison(category).positiveExample,
            historicalAnalogy: caseComparison.historicalAnalogy || buildCaseComparison(category).historicalAnalogy,
          },
          moreSolutions,
          transferableInsights: {
            team: transferableInsights.team || buildTransferableInsights(category, Array.isArray(topic.evidence) ? topic.evidence : []).team,
            reader: transferableInsights.reader || buildTransferableInsights(category, Array.isArray(topic.evidence) ? topic.evidence : []).reader,
          },
          trainingTopic: normalizeTrainingTopic(topic.trainingTopic || (topic.knowledgeName || topic.learningQuestion ? topic : null)),
        };
      })
    : [];

  const overview = {
    oneLine: raw.overview.oneLine,
    logicLine: raw.overview.logicLine,
    wordCount: raw?.overview?.wordCount || fallback.overview.wordCount,
  };
  const meetingAnalysis = normalizeMeetingAnalysis(raw?.meetingAnalysis);
  const trainingAnalysis = normalizeTrainingAnalysis(raw?.trainingAnalysis);

  const quotes = Array.isArray(raw?.quotes) && raw.quotes.length ? raw.quotes.slice(0, 10) : fallback.quotes;
  const suggestedTags = Array.isArray(raw?.suggestedTags) && raw.suggestedTags.length ? raw.suggestedTags.slice(0, 8) : fallback.suggestedTags;
  const modelDeepeningModes = Array.isArray(raw?.deepeningModes) && raw.deepeningModes.length
    ? raw.deepeningModes.map((mode) => ({
        title: mode.title || "演化式深化",
        goal: mode.goal || "",
        questions: Array.isArray(mode.questions) ? mode.questions.slice(0, 3) : [],
      }))
    : fallback.deepeningModes;

  const grouped = Object.fromEntries(
    categoryDefs.map((category) => [category.id, { category, items: [] }]),
  );
  activeCategories.forEach((group) => {
    const key = group.category.id;
    if (grouped[key]) {
      grouped[key] = group;
    }
  });

  const sentences = fallback.sentences;
  return {
    text: sourceText,
    sentences,
    grouped,
    overview,
    topics,
    meetingAnalysis,
    trainingAnalysis,
    quotes,
    activeCategories,
    suggestedTags,
    deepeningModes: modelDeepeningModes,
    analysisSource: "deepseek",
  };
}

function topicEvidenceList(topic = {}) {
  const nested = [
    ...(Array.isArray(topic?.trainingTopic?.scenarios) ? topic.trainingTopic.scenarios.map((item) => item?.evidence) : []),
    ...(Array.isArray(topic?.trainingTopic?.attentionPoints) ? topic.trainingTopic.attentionPoints.map((item) => item?.evidence) : []),
  ];
  return [
    ...(Array.isArray(topic?.evidence) ? topic.evidence : []),
    ...nested,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function sanitizeDeepSeekTopics(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.topics)) {
    return;
  }
  const hasMeetingAnalysis = Boolean(raw.meetingAnalysis && typeof raw.meetingAnalysis === "object");
  const hasTrainingAnalysis = Boolean(raw.trainingAnalysis && typeof raw.trainingAnalysis === "object");
  if (!hasMeetingAnalysis && !hasTrainingAnalysis) {
    return;
  }
  const dropped = [];
  raw.topics = raw.topics.filter((topic) => {
    const evidence = topicEvidenceList(topic);
    if (evidence.length >= 2) {
      topic.evidence = evidence.slice(0, 4);
      return true;
    }
    dropped.push(topic?.title || topic?.trainingTopic?.learningQuestion || topic?.trainingTopic?.knowledgeName || "未命名话题");
    return false;
  });
  if (!dropped.length) {
    return;
  }
  const note = `已过滤 ${dropped.length} 个缺少足够原文依据的话题：${dropped.slice(0, 5).join("、")}。`;
  if (hasTrainingAnalysis) {
    raw.trainingAnalysis.topicExtractionNote = [raw.trainingAnalysis.topicExtractionNote, note].filter(Boolean).join(" ");
  }
  if (hasMeetingAnalysis) {
    raw.meetingAnalysis.topicExtractionNote = [raw.meetingAnalysis.topicExtractionNote, note].filter(Boolean).join(" ");
  }
}

function validateDeepSeekAnalysis(raw, sourceText = "") {
  const oneLine = String(raw?.overview?.oneLine || "").trim();
  const logicLine = String(raw?.overview?.logicLine || "").trim();
  if (!oneLine || !logicLine) {
    throw new Error("DeepSeek 返回缺少具体的一句话概括或逻辑主线。");
  }
  const looksLikeLocalTemplate =
    /这篇讲话的核心，是围绕“.*”建立一套从判断到行动/.test(oneLine) ||
    /先定义核心命题，再把观点分入.*维度/.test(logicLine);
  if (looksLikeLocalTemplate) {
    throw new Error("DeepSeek 返回内容过于模板化，未形成基于原文的具体提炼。");
  }
  const hasMeetingAnalysis = Boolean(raw?.meetingAnalysis && typeof raw.meetingAnalysis === "object");
  const hasTrainingAnalysis = Boolean(raw?.trainingAnalysis && typeof raw.trainingAnalysis === "object");
  if (!hasMeetingAnalysis && !hasTrainingAnalysis && (!Array.isArray(raw?.topics) || raw.topics.length < 1)) {
    throw new Error("DeepSeek 没有返回可学习的话题。");
  }
  const executiveCaseCount = (!hasMeetingAnalysis && !hasTrainingAnalysis) ? countExecutiveCaseScenes(sourceText) : 0;
  const returnedTopicCount = Array.isArray(raw?.topics) ? raw.topics.length : 0;
  if (executiveCaseCount >= 8 && returnedTopicCount < executiveCaseCount) {
    throw new Error(`DeepSeek 识别到这类材料应按案例场景逐一拆解：原文包含 ${executiveCaseCount} 个“案例 X”场景，但只返回 ${returnedTopicCount} 个话题。请使用最新高层视角 SKILL 重新执行，避免把多个案例合并成少量宏观主题。`);
  }
  const hasSoftAnalysis = hasMeetingAnalysis || hasTrainingAnalysis;
  const weakTopic = hasSoftAnalysis ? null : (raw.topics || []).find((topic) => !Array.isArray(topic?.evidence) || topic.evidence.length < 2);
  if (weakTopic) {
    throw new Error(`DeepSeek 返回的话题缺少足够原文依据：${weakTopic.title || "未命名话题"}`);
  }
}

function normalizeMeetingAnalysis(input = null) {
  if (!input || typeof input !== "object") {
    return null;
  }
  const info = input.meetingInfo || {};
  return {
    meetingInfo: {
      topic: info.topic || info.theme || "未提及",
      goal: info.goal || "未提及",
      time: info.time || "未知",
      duration: info.duration || "未知",
      participants: Array.isArray(info.participants) ? info.participants.filter(Boolean) : [],
      absentees: Array.isArray(info.absentees) ? info.absentees.filter(Boolean) : [],
      host: info.host || "未提及",
      recorder: info.recorder || "未提及",
    },
    decisions: Array.isArray(input.decisions) ? input.decisions : [],
    actionItems: Array.isArray(input.actionItems) ? input.actionItems : [],
    discussionSummary: Array.isArray(input.discussionSummary) ? input.discussionSummary : [],
    collaboration: input.collaboration && typeof input.collaboration === "object" ? input.collaboration : {},
    risksAndDependencies: input.risksAndDependencies && typeof input.risksAndDependencies === "object" ? input.risksAndDependencies : {},
    pendingQuestions: Array.isArray(input.pendingQuestions) ? input.pendingQuestions : [],
    topicExtractionNote: input.topicExtractionNote || "",
  };
}

function normalizeTrainingAnalysis(input = null) {
  if (!input || typeof input !== "object") {
    return null;
  }
  const info = input.trainingInfo || {};
  const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
  const normalizeTextList = (value) => normalizeList(value).map((item) => String(item || "").trim()).filter(Boolean);
  const oldKnowledgeItems = [
    ...(Array.isArray(input.keyConcepts) ? input.keyConcepts.map((item) => ({
      name: item.name || "关键概念",
      type: "概念",
      coreViewpoint: item.explanation || item.name || "关键概念",
      originalExplanation: item.explanation || "未提及",
      detailedExplanation: item.explanation || "未提及",
      whyImportant: "来自旧版培训分析的关键概念。",
      evidence: [item.example].filter(Boolean),
      scenarios: item.example ? [{ name: "原文例子", context: item.example, teacherExplanation: item.explanation || "未提及", applicability: "未提及", evidence: item.example }] : [],
      attentionPoints: [],
      extensions: [],
      practice: {},
    })) : []),
    ...(Array.isArray(input.methodsAndSteps) ? input.methodsAndSteps.map((item) => ({
      name: item.method || "方法步骤",
      type: "方法",
      coreViewpoint: item.method || "方法步骤",
      originalExplanation: item.scenario || "未提及",
      detailedExplanation: item.scenario || "未提及",
      whyImportant: "来自旧版培训分析的方法步骤。",
      evidence: [],
      scenarios: item.scenario ? [{ name: "适用场景", context: item.scenario, teacherExplanation: item.method || "未提及", applicability: item.scenario, evidence: "" }] : [],
      attentionPoints: item.notes ? [{ issue: item.notes, whyItMatters: "使用该方法时需要关注。", correction: "结合原文场景谨慎应用。", evidence: item.notes }] : [],
      extensions: [],
      practice: { task: item.method || "", steps: item.steps || [], checkpoints: [] },
    })) : []),
  ];
  const knowledgeItems = Array.isArray(input.knowledgeItems) && input.knowledgeItems.length
    ? input.knowledgeItems.map((item) => ({
        name: item.name || item.title || "未命名知识点",
        type: item.type || "知识点",
        coreViewpoint: item.coreViewpoint || item.summary || item.originalExplanation || item.explanation || "未提及",
        originalExplanation: item.originalExplanation || item.explanation || "未提及",
        detailedExplanation: item.detailedExplanation || item.detail || item.expandedExplanation || item.originalExplanation || item.explanation || "未提及",
        whyImportant: item.whyImportant || "未提及",
        evidence: normalizeTextList(item.evidence),
        scenarios: normalizeList(item.scenarios).map((scenario) => ({
          name: scenario.name || scenario.title || "讲解场景",
          context: scenario.context || "未提及",
          teacherExplanation: scenario.teacherExplanation || scenario.explanation || "未提及",
          detailedExpansion: scenario.detailedExpansion || scenario.detail || scenario.expandedExplanation || scenario.teacherExplanation || scenario.explanation || "未提及",
          applicability: scenario.applicability || "未提及",
          evidence: scenario.evidence || "",
        })),
        attentionPoints: normalizeList(item.attentionPoints).map((point) => ({
          issue: point.issue || point.risk || point.misunderstanding || "未提及",
          whyItMatters: point.whyItMatters || point.reason || "未提及",
          detailedAnalysis: point.detailedAnalysis || point.analysis || point.whyItMatters || point.reason || "未提及",
          correction: point.correction || point.solution || "未提及",
          evidence: point.evidence || "",
        })),
        extensions: normalizeList(item.extensions).map((extension) => ({
          title: extension.title || "知识延伸",
          industryCase: extension.industryCase || extension.case || "未提及",
          detailedExpansion: extension.detailedExpansion || extension.detail || extension.expandedExplanation || extension.industryCase || extension.case || "未提及",
          relatedKnowledge: extension.relatedKnowledge || "未提及",
          transferScenario: extension.transferScenario || "未提及",
          learningSuggestion: extension.learningSuggestion || "未提及",
        })),
        practice: item.practice && typeof item.practice === "object"
          ? {
              task: item.practice.task || "未提及",
              steps: normalizeTextList(item.practice.steps),
              checkpoints: normalizeTextList(item.practice.checkpoints),
            }
          : {},
      }))
    : oldKnowledgeItems;
  const logic = input.overallLogic || {};
  return {
    trainingInfo: {
      topic: info.topic || info.title || "未提及",
      trainingType: info.trainingType || "未提及",
      targetAudience: info.targetAudience || "未提及",
      trainer: info.trainer || info.source || "未提及",
      duration: info.duration || "未知",
      prerequisites: info.prerequisites || "未提及",
    },
    knowledgeItems,
    overallLogic: {
      oneLine: logic.oneLine || input.logicSummary || "",
      learningPath: normalizeTextList(logic.learningPath),
      knowledgeRelations: normalizeTextList(logic.knowledgeRelations),
      capabilityLoop: logic.capabilityLoop || "",
    },
    learningObjectives: Array.isArray(input.learningObjectives) ? input.learningObjectives : [],
    knowledgeMap: Array.isArray(input.knowledgeMap) ? input.knowledgeMap : [],
    keyConcepts: Array.isArray(input.keyConcepts) ? input.keyConcepts : [],
    methodsAndSteps: Array.isArray(input.methodsAndSteps) ? input.methodsAndSteps : [],
    practiceTasks: Array.isArray(input.practiceTasks) ? input.practiceTasks : [],
    commonMisunderstandings: Array.isArray(input.commonMisunderstandings) ? input.commonMisunderstandings : [],
    applicationScenarios: Array.isArray(input.applicationScenarios) ? input.applicationScenarios : [],
    followUpPlan: Array.isArray(input.followUpPlan) ? input.followUpPlan : [],
    topicExtractionNote: input.topicExtractionNote || "",
  };
}

function normalizeTrainingTopic(input = null) {
  if (!input || typeof input !== "object") {
    return null;
  }
  const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
  const normalizeTextList = (value) => normalizeList(value).map((item) => String(item || "").trim()).filter(Boolean);
  const practice = input.practice && typeof input.practice === "object" ? input.practice : {};
  return {
    knowledgeName: input.knowledgeName || input.name || "",
    knowledgeType: input.knowledgeType || input.type || "知识点",
    learningQuestion: input.learningQuestion || input.title || "",
    coreViewpoint: input.coreViewpoint || input.summary || input.teacherExplanation || input.originalExplanation || input.explanation || "",
    teacherExplanation: input.teacherExplanation || input.originalExplanation || input.explanation || "",
    detailedExplanation: input.detailedExplanation || input.detail || input.expandedExplanation || input.teacherExplanation || input.originalExplanation || input.explanation || "",
    scenarios: normalizeList(input.scenarios).map((scenario) => ({
      name: scenario.name || scenario.title || "讲解场景",
      context: scenario.context || "未提及",
      teacherExplanation: scenario.teacherExplanation || scenario.explanation || "未提及",
      detailedExpansion: scenario.detailedExpansion || scenario.detail || scenario.expandedExplanation || scenario.teacherExplanation || scenario.explanation || "未提及",
      applicability: scenario.applicability || "未提及",
      evidence: scenario.evidence || "",
    })),
    attentionPoints: normalizeList(input.attentionPoints).map((point) => ({
      issue: point.issue || point.risk || point.misunderstanding || "注意问题",
      whyItMatters: point.whyItMatters || point.reason || "未提及",
      detailedAnalysis: point.detailedAnalysis || point.analysis || point.whyItMatters || point.reason || "未提及",
      correction: point.correction || point.solution || "未提及",
      evidence: point.evidence || "",
    })),
    extensions: normalizeList(input.extensions).map((extension) => ({
      title: extension.title || "知识延伸",
      industryCase: extension.industryCase || extension.case || "未提及",
      detailedExpansion: extension.detailedExpansion || extension.detail || extension.expandedExplanation || extension.industryCase || extension.case || "未提及",
      relatedKnowledge: extension.relatedKnowledge || "未提及",
      transferScenario: extension.transferScenario || "未提及",
      learningSuggestion: extension.learningSuggestion || "未提及",
    })),
    practice: {
      task: practice.task || "",
      steps: normalizeTextList(practice.steps),
      checkpoints: normalizeTextList(practice.checkpoints),
    },
    logicSummary: input.logicSummary || "",
    learnerTakeaway: input.learnerTakeaway || input.takeaway || "",
  };
}

function countExecutiveCaseScenes(text = "") {
  const source = String(text || "");
  const matches = source.match(/(^|\n)\s*案例\s*[一二三四五六七八九十百千万\d]+\s*[：:]/g) || [];
  return matches.length;
}

function defaultAnalysisMaxTokens(text = "", skill = currentTopicSkill()) {
  const typeName = skill?.targetMaterialTypeName || "高层视角";
  const typeId = skill?.targetMaterialTypeId || "type-executive-view";
  const kind = materialTypeKind(typeId, typeName);
  if (kind === "training") {
    return 64000;
  }
  if (kind === "meeting") {
    return 36000;
  }
  const caseCount = countExecutiveCaseScenes(text);
  if (caseCount >= 8) {
    return Math.min(64000, Math.max(32000, caseCount * 2400));
  }
  return 28000;
}

async function analyzeWithDeepSeek(text, options = {}) {
  const settings = readDeepSeekSettings();
  const skill = options.skill || currentTopicSkill();
  const payload = await callDeepSeek(settings, buildDeepSeekPrompt(text, skill), {
    ...options,
    skill,
    maxTokens: options.maxTokens || defaultAnalysisMaxTokens(text, skill),
  });
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek 没有返回分析结果。");
  }
  const parsed = parseJsonFromText(content);
  return normalizeDeepSeekAnalysis(parsed, text);
}

async function testDeepSeekConnection(settings) {
  const payload = await callDeepSeek(settings, [
    {
      role: "system",
      content: "你是一个API连通性测试助手。只输出JSON，不要输出额外解释。",
    },
    {
      role: "user",
      content: "请只输出一个JSON对象：{\"ok\":true,\"message\":\"DeepSeek连接成功\"}",
    },
  ], { temperature: 0, maxTokens: 120, useThinking: false });
  const content = payload?.choices?.[0]?.message?.content;
  const parsed = parseJsonFromText(content);
  if (!parsed?.ok) {
    throw new Error("DeepSeek 已返回，但测试 JSON 中 ok 不为 true。");
  }
  return parsed;
}

function topicWritingContext(row) {
  const topic = row?.topic || {};
  return [
    `话题标题：${topic.title || row?.title || ""}`,
    `话题来源：${topic.sourceSummary || ""}`,
    `问题实质：${topic.problemEssence || topic.essence || ""}`,
    `表面现象：${topic.surfacePhenomenon || ""}`,
    `原文证据：${(topic.evidence || []).join("；")}`,
    `CEO解法：${compactText(topic.ceoSolution || "")}`,
    `底层逻辑：${compactText(topic.theoryAnchors || "")}`,
    `可迁移启示：${compactText(topic.transferableInsights || "")}`,
  ].join("\n");
}

function normalizeIdeaViewpoints(idea = {}) {
  const candidates = [
    ...(Array.isArray(idea.viewpoints) ? idea.viewpoints : []),
    ...(Array.isArray(idea.mainViewpoints) ? idea.mainViewpoints : []),
    ...(Array.isArray(idea.corePoints) ? idea.corePoints : []),
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  const fallback = [
    idea.coreViewpoint,
    ...(Array.isArray(idea.framework) ? idea.framework : []),
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return [...new Set([...candidates, ...fallback])].slice(0, 5);
}

function selectedViewpointsForIdea(ideaState = {}, ideaIndex = 0, idea = {}) {
  const viewpoints = normalizeIdeaViewpoints(idea);
  return selectedViewpointIndexesForIdea(ideaState, ideaIndex, idea)
    .filter((index) => Number.isInteger(index) && viewpoints[index])
    .map((index) => viewpoints[index]);
}

function selectedViewpointIndexesForIdea(ideaState = {}, ideaIndex = 0, idea = {}) {
  const viewpoints = normalizeIdeaViewpoints(idea);
  const stored = ideaState.selectedViewpoints?.[String(ideaIndex)];
  if (Array.isArray(stored)) {
    return stored.map((item) => Number(item));
  }
  const selectedIndexes = Array.isArray(ideaState.selectedIndexes) ? ideaState.selectedIndexes.map((item) => Number(item)) : [];
  return selectedIndexes.includes(Number(ideaIndex)) ? viewpoints.map((_, index) => index) : [];
}

function buildArticleIdeaPrompt(row, articleSkill = currentArticleSkill()) {
  return [
    {
      role: "system",
      content: "你是一个企业管理文章选题策划助手。只输出JSON，不要输出额外解释。",
    },
    {
      role: "user",
      content: `
请基于下面这个高层视角话题，推荐10个可以继续写成文章的延伸选题。
每个选题都必须来自该话题的核心观点、管理矛盾、解法、理论锚点或可迁移启示，不要泛泛而谈。
请同时考虑当前文章 SKILL 的写作结构，让每个选题都能写成一篇约1500字的深度文章。

输出JSON格式：
{
  "ideas": [
    {
      "title": "",
      "coreViewpoint": "",
      "viewpoints": ["", "", "", "", ""],
      "framework": ["", "", "", ""]
    }
  ]
}

要求：
1. 只输出JSON。
2. 必须输出10个ideas。
3. title 要像一篇文章标题，具体、有问题感。
4. coreViewpoint 用1-2句话说明这篇文章要表达的核心观点。
5. viewpoints 必须给出5个主要观点，每个观点都是文章生成时可单独选择的写作论点，要求具体、互相区分、能展开。
6. framework 给出4-6个文章小节标题或写作框架。
7. 语言中文，贴合原话题，不要编造原文事实。

当前文章 SKILL：
${articleSkill.skillFileName || articleSkill.name} ${articleSkill.version}
${articleSkill.prompt || ""}

话题上下文：
${topicWritingContext(row)}
      `.trim(),
    },
  ];
}

function buildGeneratedArticlePrompt(row, idea, articleSkill = currentArticleSkill(), selectedViewpoints = []) {
  return [
    {
      role: "system",
      content: "你是一个企业管理深度文章写作助手。只输出JSON，不要输出额外解释。",
    },
    {
      role: "user",
      content: `
请基于高层视角话题、选定的延伸选题和当前文章 SKILL，写一篇完整中文文章。

输出JSON格式：
{
  "article": {
    "title": "",
    "coreViewpoint": "",
    "content": "",
    "actionTip": "",
    "learningTip": ""
  }
}

要求：
1. 只输出JSON。
2. content 输出正式文章正文的HTML片段，只允许使用 <p>、<strong>、<h2>、<h3>、<h4>、<ul>、<ol>、<li>、<blockquote>、<br>。
3. content 不要使用 Markdown，不要出现 #、##、###、- ** 这类 Markdown 标记。
4. content 不要重复输出文章标题，标题只放在 article.title。
5. 重要金句、关键判断、核心观点可以使用 <strong> 加粗。
6. 文章要有核心观点，也要有详细展开，不能只写提纲。
7. 必须基于原话题观点展开，可以适度做管理学、组织行为、战略执行、案例类比的延伸。
8. 如果是模型扩展内容，要自然表达为“可以进一步理解为”“在类似组织中”，不要伪装成原文事实。
9. 文章长度控制在1500字左右，允许1300-1800字浮动。
10. 必须严格遵循当前文章 SKILL 的结构顺序和写作要求，但不要在正文里机械展示“文章框架”四个字。
11. 如果当前文章 SKILL 中仍出现 Markdown 写法要求，以本次“正式文章正文HTML片段、不要 Markdown”的要求为最高优先级。
12. 正文中的标题必须使用层级 HTML：一级标题用 <h2>一、……</h2>，二级标题用 <h3>（一）……</h3>，三级标题用 <h4>1. ……</h4>；标题内容要业务化、具体化、默认左对齐；不要直接使用“先讲结论和观点”“展示现象”“分析现象的深层次原因”“解决方式是什么”“从毛泽东思想、毛选角度总结”“总结收尾”这些模板词。
13. “马上可以执行的小行动”“学习的感觉在于”这类行动建议和学习提示不要写进正文 content，请分别放到 article.actionTip 和 article.learningTip。

当前文章 SKILL：
${articleSkill.skillFileName || articleSkill.name} ${articleSkill.version}
${articleSkill.prompt || ""}

选题：
标题：${idea.title || ""}
核心观点：${idea.coreViewpoint || ""}
已选主要观点：${compactText(selectedViewpoints.length ? selectedViewpoints : normalizeIdeaViewpoints(idea))}
框架：${compactText(idea.framework || [])}

话题上下文：
${topicWritingContext(row)}
      `.trim(),
    },
  ];
}

async function requestTopicArticleIdeas(row, { refresh = false, rerender = null } = {}) {
  if (!row) {
    throw new Error("请先选择一个话题。");
  }
  const key = row.id;
  const repaint = typeof rerender === "function" ? rerender : () => renderTopicHomeArticle(row);
  if (!refresh && state.topicArticleIdeas[key]?.ideas?.length) {
    return state.topicArticleIdeas[key].ideas;
  }
  const articleSkill = currentArticleSkill();
  state.topicArticleIdeas[key] = { ...(state.topicArticleIdeas[key] || {}), loading: true, message: `正在调用大模型生成推荐选题，使用 ${skillDisplayName(articleSkill, "文章 SKILL.md")}...` };
  repaint();
  const settings = readDeepSeekSettings();
  const payload = await callDeepSeek(settings, buildArticleIdeaPrompt(row, articleSkill), { maxTokens: 5000, temperature: 0.55 });
  const parsed = parseJsonFromText(payload?.choices?.[0]?.message?.content || "");
  const ideas = Array.isArray(parsed?.ideas) ? parsed.ideas.slice(0, 10).map((idea, index) => ({
    id: `idea-${Date.now()}-${index}`,
    title: idea.title || `延伸文章${index + 1}`,
    coreViewpoint: idea.coreViewpoint || "",
    viewpoints: normalizeIdeaViewpoints(idea),
    framework: Array.isArray(idea.framework) ? idea.framework.filter(Boolean).slice(0, 6) : [],
  })) : [];
  if (!ideas.length) {
    throw new Error("大模型没有返回可用的文章选题。");
  }
  state.topicArticleIdeas[key] = { ideas, selectedIndexes: [], selectedViewpoints: {}, loading: false, message: `已生成10个推荐选题，写作 SKILL：${skillDisplayName(articleSkill, "文章 SKILL.md")}。请先选择文章，再选择文章下的主要观点。` };
  repaint();
  return ideas;
}

async function generateArticleFromIdea(row, ideaIndex, rerender = null, options = {}) {
  const ideaState = state.topicArticleIdeas[row.id] || {};
  const idea = ideaState.ideas?.[Number(ideaIndex)];
  if (!idea) {
    throw new Error("请先选择一个推荐选题。");
  }
  const repaint = typeof rerender === "function" ? rerender : () => renderTopicHomeArticle(row);
  const articleSkill = currentArticleSkill();
  const selectedViewpoints = selectedViewpointsForIdea(ideaState, Number(ideaIndex), idea);
  if (!selectedViewpoints.length) {
    throw new Error("请至少选择这个选题下的一个主要观点。");
  }
  const itemIndex = Number(options.itemIndex || 0);
  const total = Math.max(1, Number(options.total || 1));
  const basePercent = 8 + Math.round((itemIndex / total) * 76);
  const nextPercent = 8 + Math.round(((itemIndex + 1) / total) * 76);
  state.topicArticleIdeas[row.id] = { ...ideaState, generating: true, message: `正在生成完整文章，使用 ${skillDisplayName(articleSkill, "文章 SKILL.md")}...` };
  setArticleGenerationProgress(basePercent, `正在生成第 ${itemIndex + 1}/${total} 篇：${idea.title}`);
  appendArticleGenerationLog(`开始生成：${idea.title}`);
  repaint();
  const settings = readDeepSeekSettings();
  const payload = await callDeepSeek(settings, buildGeneratedArticlePrompt(row, idea, articleSkill, selectedViewpoints), { maxTokens: 14000, temperature: 0.45, signal: options.signal });
  setArticleGenerationProgress(Math.min(nextPercent - 4, 88), `第 ${itemIndex + 1}/${total} 篇已返回，正在解析。`);
  appendArticleGenerationLog(`大模型已返回：${idea.title}`);
  repaint();
  const parsed = parseJsonFromText(payload?.choices?.[0]?.message?.content || "");
  const article = parsed?.article || {};
  const now = new Date().toISOString();
  const saved = {
    id: `article-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ownerEmail: state.currentUser.email,
    ownerEmailKey: state.currentUser.emailKey,
    topicRef: row.id,
    docId: row.docId,
    docTitle: row.docTitle,
    topicIndex: row.topicIndex,
    topicTitle: row.title,
    source: row.source,
    type: row.type,
    ideaTitle: idea.title,
    ideaViewpoints: normalizeIdeaViewpoints(idea),
    selectedViewpoints,
    title: article.title || idea.title,
    coreViewpoint: article.coreViewpoint || idea.coreViewpoint,
    framework: Array.isArray(article.framework) && article.framework.length ? article.framework : idea.framework,
    content: normalizeGeneratedArticleContent(article.content || ""),
    actionTip: article.actionTip || "",
    learningTip: article.learningTip || "",
    topicContext: topicWritingContext(row),
    articleSkillId: articleSkill.id,
    articleSkillName: articleSkill.name,
    articleSkillVersion: articleSkill.version,
    articleSkillSummary: articleSkill.summary,
    articleSkillFileName: articleSkill.skillFileName,
    articleSkillAppliedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await saveGeneratedArticle(saved);
  setArticleGenerationProgress(nextPercent, `已保存第 ${itemIndex + 1}/${total} 篇：${saved.title}`);
  appendArticleGenerationLog(`已保存：${saved.title}`);
  state.topicArticleIdeas[row.id] = { ...state.topicArticleIdeas[row.id], generating: false, message: `文章已生成并保存到“生成文章”。使用 ${skillDisplayName(articleSkill, "文章 SKILL.md")}。` };
  repaint();
  return saved;
}

async function generateArticlesFromSelectedIdeas(row, rerender = null) {
  const ideaState = state.topicArticleIdeas[row.id] || {};
  const selectedIndexes = Array.isArray(ideaState.selectedIndexes)
    ? ideaState.selectedIndexes
    : [];
  const uniqueIndexes = [...new Set(selectedIndexes.map((item) => Number(item)).filter((item) => Number.isInteger(item)))];
  if (!uniqueIndexes.length) {
    throw new Error("请至少选择一个推荐选题。");
  }
  const invalidIndex = uniqueIndexes.find((index) => !selectedViewpointsForIdea(ideaState, index, ideaState.ideas?.[index]).length);
  if (Number.isInteger(invalidIndex)) {
    throw new Error(`请至少选择“${ideaState.ideas?.[invalidIndex]?.title || `选题${invalidIndex + 1}`}”下的一个主要观点。`);
  }
  resetArticleGeneration("generate", `生成 ${uniqueIndexes.length} 篇文章`);
  state.articleGeneration.active = true;
  state.articleGeneration.topicRowId = row.id;
  state.articleGeneration.abortController = new AbortController();
  setArticleGenerationProgress(5, `准备生成 ${uniqueIndexes.length} 篇文章。`);
  appendArticleGenerationLog(`准备生成 ${uniqueIndexes.length} 篇文章。`);
  const created = [];
  try {
    for (let i = 0; i < uniqueIndexes.length; i += 1) {
      const index = uniqueIndexes[i];
      if (state.articleGeneration.abortController.signal.aborted) {
        throw new Error("本次文章生成已停止。");
      }
      state.topicArticleIdeas[row.id] = {
        ...(state.topicArticleIdeas[row.id] || {}),
        generating: true,
        message: `正在生成第 ${i + 1}/${uniqueIndexes.length} 篇文章...`,
      };
      if (typeof rerender === "function") {
        rerender();
      }
      created.push(await generateArticleFromIdea(row, index, rerender, {
        itemIndex: i,
        total: uniqueIndexes.length,
        signal: state.articleGeneration.abortController.signal,
      }));
    }
    state.articleGeneration.active = false;
    state.articleGeneration.completed = true;
    setArticleGenerationProgress(100, `已生成 ${created.length} 篇文章，并保存到“生成文章”。`);
    appendArticleGenerationLog(`全部完成，共生成 ${created.length} 篇文章。`);
    state.topicArticleIdeas[row.id] = {
      ...(state.topicArticleIdeas[row.id] || {}),
      generating: false,
      message: `已生成 ${created.length} 篇文章，并保存到“生成文章”。`,
    };
    if (typeof rerender === "function") {
      rerender();
    }
    return created;
  } catch (error) {
    state.articleGeneration.active = false;
    setArticleGenerationProgress(0, error.message || "文章生成失败。");
    appendArticleGenerationLog(`生成失败：${error.message}`);
    state.topicArticleIdeas[row.id] = {
      ...(state.topicArticleIdeas[row.id] || {}),
      generating: false,
      message: `生成失败：${error.message}`,
    };
    if (typeof rerender === "function") {
      rerender();
    }
    throw error;
  } finally {
    state.articleGeneration.abortController = null;
    state.articleGeneration.background = false;
  }
}

async function callDeepSeek(settings, messages, options = {}) {
  if (!settings.apiKey) {
    throw new Error("请先在系统配置 > 大模型配置中填写 API Key。");
  }
  const requestBody = {
    model: settings.model || DEFAULT_DEEPSEEK_SETTINGS.model,
    messages,
    temperature: options.temperature ?? 0.2,
    stream: false,
    response_format: { type: "json_object" },
  };
  if (options.useThinking !== false) {
    requestBody.thinking = { type: settings.thinking === "disabled" ? "disabled" : "enabled" };
    requestBody.reasoning_effort = settings.reasoningEffort || "high";
  }
  if (options.maxTokens) {
    requestBody.max_tokens = options.maxTokens;
  }
  let response;
  try {
    response = await fetch(`${settings.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      signal: options.signal,
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("本次分析已停止。");
    }
    throw new Error(formatDeepSeekNetworkError(error));
  }
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(formatDeepSeekHttpError(response.status, errText));
  }
  const payload = await response.json();
  const finishReason = payload?.choices?.[0]?.finish_reason;
  if (finishReason && finishReason !== "stop") {
    throw new Error(formatDeepSeekFinishReason(finishReason, requestBody, payload));
  }
  return payload;
}

function formatDeepSeekFinishReason(finishReason, requestBody, payload) {
  if (finishReason === "length") {
    const maxTokens = requestBody.max_tokens || "默认";
    const completionTokens = payload?.usage?.completion_tokens || payload?.usage?.output_tokens || "";
    const usageText = completionTokens ? `，本次已生成约 ${completionTokens} tokens` : "";
    return `DeepSeek 返回内容被 max_tokens 截断：当前上限 ${maxTokens}${usageText}。建议关闭思考模式或把推理强度调为中/低后重试；如果仍失败，请拆分长文，或在代码中继续提高分析输出上限。`;
  }
  return `DeepSeek 返回未完整结束：${finishReason}`;
}

function formatDeepSeekNetworkError(error) {
  const message = String(error?.message || error || "");
  if (/Failed to fetch|NetworkError|Load failed|fetch/i.test(message)) {
    return "DeepSeek 网络连接失败。常见原因：浏览器跨域限制（CORS）、Base URL 不可达、公司网络/代理拦截。请先用“测试连接”确认；如果仍失败，需要改用本地后端代理调用。";
  }
  return `DeepSeek 网络连接失败：${message}`;
}

function formatDeepSeekHttpError(status, errText) {
  const shortText = String(errText || "").slice(0, 240);
  if (status === 401 || status === 403) {
    return `DeepSeek 鉴权失败：请检查 API Key 是否正确、是否有权限。${shortText}`;
  }
  if (status === 404) {
    return `DeepSeek 模型或接口不存在：请检查 Base URL 和模型名称。${shortText}`;
  }
  if (status === 429) {
    return `DeepSeek 调用频率或额度受限：请稍后再试，或检查账户额度。${shortText}`;
  }
  if (status >= 500) {
    return `DeepSeek 服务端异常：${status} ${shortText}`;
  }
  return `DeepSeek 调用失败：${status} ${shortText}`;
}

function renderAnalysis() {
  const analysis = state.analysis;
  if (!analysis) {
    return;
  }
  const currentDoc = state.documents.find((doc) => doc.id === state.currentDocId) || state.allDocuments.find((doc) => doc.id === state.currentDocId) || null;
  const currentMaterialTypeKind = materialTypeKind(materialTypeIdForDoc(currentDoc), materialTypeNameForDoc(currentDoc));
  const isMeetingNotes = Boolean(
    currentMaterialTypeKind === "meeting"
    || analysis.meetingAnalysis,
  );
  const isTrainingSpeech = Boolean(
    currentMaterialTypeKind === "training"
    || analysis.trainingAnalysis,
  );

  els.docTitle.textContent = normalizeDocTitle(els.docNameInput.value || state.fileName || "粘贴文本分析");
  els.oneLine.textContent = analysis.overview.oneLine;
  els.logicLine.textContent = analysis.overview.logicLine;
  if (els.analysisSourceBadge) {
    els.analysisSourceBadge.textContent = analysis.analysisSource === "deepseek" ? "DeepSeek" : "本地";
    els.analysisSourceBadge.dataset.source = analysis.analysisSource || "local";
  }
  els.metricTopics.textContent = analysis.topics.length;
  els.metricCategories.textContent = analysis.activeCategories.length;
  els.metricQuotes.textContent = analysis.quotes.length;
  els.metricWords.textContent = analysis.overview.wordCount;

  renderCategories(analysis);
  renderTopics(analysis);
  renderOriginalText(analysis.text);
  renderMaterialTypeAnalysis(analysis, isMeetingNotes, isTrainingSpeech);
  if (!els.tagInput.value.trim() && analysis.suggestedTags?.length) {
    els.tagInput.value = analysis.suggestedTags.join(", ");
  }
  els.parseHint.textContent = isMeetingNotes
    ? `已完成会议纪要分析：${analysis.sentences.length} 个有效句子，${analysis.topics.length} 个可提炼话题。`
    : isTrainingSpeech
      ? `已完成培训讲话分析：${analysis.sentences.length} 个有效句子，${analysis.topics.length} 个可提炼话题。`
    : `已完成拆解：${analysis.sentences.length} 个有效句子，${analysis.topics.length} 个学习话题。`;
  renderTopicHome();
}

function renderMaterialTypeAnalysis(analysis, isMeetingNotes = false, isTrainingSpeech = false) {
  if (!els.meetingAnalysisPanel) {
    return;
  }
  if (isMeetingNotes || analysis?.meetingAnalysis) {
    els.meetingAnalysisPanel.hidden = false;
    els.meetingAnalysisPanel.innerHTML = buildMeetingAnalysisHtml(analysis.meetingAnalysis);
    return;
  }
  if (isTrainingSpeech || analysis?.trainingAnalysis) {
    els.meetingAnalysisPanel.hidden = false;
    els.meetingAnalysisPanel.innerHTML = buildTrainingAnalysisHtml(analysis.trainingAnalysis);
    return;
  }
  els.meetingAnalysisPanel.hidden = true;
  els.meetingAnalysisPanel.innerHTML = "";
}

function renderMeetingAnalysis(meetingAnalysis, isMeetingNotes = false) {
  if (!els.meetingAnalysisPanel) {
    return;
  }
  if (!isMeetingNotes && !meetingAnalysis) {
    els.meetingAnalysisPanel.hidden = true;
    els.meetingAnalysisPanel.innerHTML = "";
    return;
  }
  els.meetingAnalysisPanel.hidden = false;
  els.meetingAnalysisPanel.innerHTML = buildMeetingAnalysisHtml(meetingAnalysis);
}

function buildTopicRows() {
  const rows = [];
  const sourceDocs = isAdmin()
    ? state.allDocuments.filter((doc) => !doc.deletedAt)
    : state.documents;
  sourceDocs.forEach((doc) => {
    const topics = doc.analysis?.topics || [];
    topics.forEach((topic, index) => {
      const tags = [
        ...(Array.isArray(topic.problemTypes) ? topic.problemTypes : []),
        ...(doc.tags || []),
      ].filter(Boolean);
      const favorite = Boolean(topic.favorite);
      rows.push({
        id: `${doc.id}::${index}`,
        docId: doc.id,
        docTitle: doc.title,
        doc,
        topic,
        topicIndex: index,
        displayIndex: topic.topicCode || topicCodeFromNumber(rows.length + 1),
        title: topic.title || `话题${index + 1}`,
        tags: [...new Set(tags)].slice(0, 5),
        type: materialTypeNameForDoc(doc),
        source: materialSourceNameForDoc(doc),
        skillDisplay: materialSkillDisplay(doc),
        favorite,
        ownerEmail: doc.ownerEmail || "",
        ownerEmailKey: doc.ownerEmailKey || "",
        updatedAt: doc.lastStudiedAt || doc.updatedAt || doc.createdAt,
      });
    });
  });
  return rows.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function renderTopicFilters() {
  if (!els.topicSourceFilter || !els.topicTypeFilter) {
    return;
  }
  const activeDocs = (isAdmin() ? state.allDocuments : state.documents).filter((doc) => !doc.deletedAt);
  const sourceItems = [...state.materialSources];
  activeDocs.forEach((doc) => {
    const source = materialSourceForDoc(doc);
    if (source && !sourceItems.some((item) => item.id === source.id)) {
      sourceItems.push(source);
    }
  });
  const typeItems = [...state.materialTypes];
  activeDocs.forEach((doc) => {
    const type = materialTypeForDoc(doc);
    if (type && !typeItems.some((item) => item.id === type.id)) {
      typeItems.push(type);
    }
  });
  const sourceOptions = [`<option value="">全部资料来源</option>`]
    .concat(sourceItems.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  const typeOptions = [`<option value="">全部资料类型</option>`]
    .concat(typeItems.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`))
    .join("");
  els.topicSourceFilter.innerHTML = sourceOptions;
  els.topicTypeFilter.innerHTML = typeOptions;
  els.topicSourceFilter.value = state.topicSourceFilter;
  els.topicTypeFilter.value = state.topicTypeFilter;
  if (els.topicOwnerFilter && els.topicOwnerOptions) {
    const showOwnerFilter = isAdmin();
    els.topicOwnerFilter.hidden = !showOwnerFilter;
    els.topicOwnerFilter.value = state.topicOwnerFilter || "";
    els.topicOwnerOptions.innerHTML = state.users
      .map((user) => `<option value="${escapeHtml(user.email)}"></option>`)
      .join("");
  }
}

function materialDocsForInsight() {
  const activeDocs = (isAdmin() ? state.allDocuments : state.documents)
    .filter((doc) => !doc.deletedAt && doc.analysis);
  const keyword = state.materialListSearch.trim().toLowerCase();
  const ownerKeyword = state.materialListOwnerFilter.trim().toLowerCase();
  return activeDocs
    .filter((doc) => {
      const sourceMatch = !state.materialListSourceFilter || materialSourceIdForDoc(doc) === state.materialListSourceFilter;
      const typeMatch = !state.materialListTypeFilter || materialTypeIdForDoc(doc) === state.materialListTypeFilter;
      const ownerMatch = !isAdmin() || !ownerKeyword || `${doc.ownerEmail} ${doc.ownerEmailKey}`.toLowerCase().includes(ownerKeyword);
      const favoriteMatch = !state.materialFavoriteOnly || Boolean(doc.favorite);
      const searchable = materialSearchText(doc).toLowerCase();
      return sourceMatch && typeMatch && ownerMatch && favoriteMatch && (!keyword || searchable.includes(keyword));
    })
    .sort((a, b) => new Date(b.lastStudiedAt || b.updatedAt || b.createdAt) - new Date(a.lastStudiedAt || a.updatedAt || a.createdAt));
}

function materialSearchText(doc) {
  return [
    materialDisplayCode(doc),
    doc.title,
    doc.fileName,
    (doc.tags || []).join(" "),
    materialSourceNameForDoc(doc),
    materialTypeNameForDoc(doc),
    doc.rawText,
  ].filter(Boolean).join(" ");
}

function topicSearchText(row) {
  const topic = row.topic || {};
  const trainingTopic = topic.trainingTopic || {};
  return [
    row.displayIndex,
    row.title,
    row.tags.join(" "),
    topic.problemEssence,
    topic.essence,
    topic.surfacePhenomenon,
    topic.sourceSummary,
    trainingTopic.knowledgeName,
    trainingTopic.knowledgeType,
    trainingTopic.learningQuestion,
    trainingTopic.teacherExplanation,
    trainingTopic.logicSummary,
    trainingTopic.learnerTakeaway,
    JSON.stringify(trainingTopic.scenarios || []),
    JSON.stringify(trainingTopic.attentionPoints || []),
    JSON.stringify(trainingTopic.extensions || []),
    JSON.stringify(trainingTopic.practice || {}),
    ...(Array.isArray(topic.evidence) ? topic.evidence : []),
    ...(Array.isArray(topic.problemTypes) ? topic.problemTypes : []),
  ].filter(Boolean).join(" ");
}

function highlightSearchTerm(value, keyword) {
  const text = String(value || "");
  const term = String(keyword || "").trim();
  if (!term) {
    return escapeHtml(text);
  }
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escapeHtml(text).replace(new RegExp(escapedTerm, "gi"), (match) => `<mark class="search-highlight">${match}</mark>`);
}

function materialSearchSnippet(doc, keyword) {
  const term = String(keyword || "").trim();
  if (!term || !doc?.rawText) {
    return "";
  }
  const raw = normalizeText(doc.rawText || "");
  const index = raw.toLowerCase().indexOf(term.toLowerCase());
  if (index < 0) {
    return "";
  }
  const start = Math.max(0, index - 26);
  const end = Math.min(raw.length, index + term.length + 42);
  return `${start > 0 ? "..." : ""}${raw.slice(start, end)}${end < raw.length ? "..." : ""}`;
}

function docSkillAnalyses(doc) {
  const analyses = { ...(doc?.skillAnalyses || {}) };
  if (doc?.analysis) {
    analyses[doc.currentSkillVersion || doc.analysis.skillVersion || DEFAULT_TOPIC_SKILL.version] = doc.analysis;
  }
  return analyses;
}

function docSkillVersions(doc) {
  const analyses = docSkillAnalyses(doc);
  return Object.keys(analyses)
    .map((version) => ({
      version,
      analysis: analyses[version],
      skill: skillMetaForAnalysis(version, analyses[version]),
      appliedAt: analyses[version]?.skillAppliedAt || doc.currentSkillAppliedAt || doc.updatedAt,
    }))
    .sort((a, b) => compareSkillVersions(a.skill || { version: a.version }, b.skill || { version: b.version }));
}

function docAnalysisForSkill(doc, version) {
  const analyses = docSkillAnalyses(doc);
  return analyses[version] || doc.analysis;
}

function hasNewTopicSkill(doc) {
  const latest = currentTopicSkill(materialTypeIdForDoc(doc) || "type-executive-view");
  const ownsDoc = (doc?.ownerEmailKey || "").toLowerCase() === state.currentUser?.emailKey;
  return Boolean(ownsDoc && doc?.analysis && latest.version !== (doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version));
}

function setSkillRefreshProgress(docId, percent, message) {
  state.skillRefreshState = { docId, percent, message };
  renderMaterialOverviewPage();
}

function skillRefreshCandidateDocs(materialTypeId, skill = currentTopicSkill(materialTypeId || "type-executive-view")) {
  return state.allDocuments
    .filter((doc) => !doc.deletedAt)
    .filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === state.currentUser?.emailKey)
    .filter((doc) => materialTypeIdForDoc(doc) === (materialTypeId || "type-executive-view"))
    .filter((doc) => doc.analysis)
    .filter((doc) => (doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version) !== skill.version)
    .sort((a, b) => new Date(b.lastStudiedAt || b.updatedAt || b.createdAt) - new Date(a.lastStudiedAt || a.updatedAt || a.createdAt));
}

function resetSkillBatchRefresh(skill, docs) {
  state.skillBatchRefresh = {
    active: false,
    background: false,
    completed: false,
    modalOpen: false,
    skillTypeId: skill.targetMaterialTypeId || "type-executive-view",
    skillVersion: skill.version,
    selectedIds: docs.map((doc) => doc.id),
    progressByDoc: Object.fromEntries(docs.map((doc) => [doc.id, { percent: 0, message: "等待执行", status: "pending" }])),
    logs: [],
  };
}

function appendSkillBatchLog(message) {
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  state.skillBatchRefresh.logs = [...(state.skillBatchRefresh.logs || []), { time, message }].slice(-80);
  renderSkillBatchRefreshModal();
  renderTopicSkillPage();
}

function setSkillBatchDocProgress(docId, percent, message, status = "running") {
  state.skillBatchRefresh.progressByDoc = {
    ...(state.skillBatchRefresh.progressByDoc || {}),
    [docId]: { percent: Math.max(0, Math.min(100, Number(percent || 0))), message, status },
  };
  renderSkillBatchRefreshModal();
  renderTopicSkillPage();
}

async function refreshDocumentWithSkill(doc, skill, onProgress = () => {}) {
  const now = new Date().toISOString();
  onProgress(25, "正在连接大模型");
  const analysis = await analyzeWithDeepSeek(doc.rawText || "", {
    signal: state.analysisAbortController.signal,
    skill,
  });
  onProgress(82, "模型已返回，正在保存新版话题");
  const historicalTopicCodes = Object.values(docSkillAnalyses(doc))
    .flatMap((item) => item?.topics || [])
    .map((topic) => topic.topicCode)
    .filter(Boolean);
  const codedAnalysis = preserveTopicFavorites(doc, withSkillMetadata(assignTopicCodesToAnalysis(analysis, doc.id, historicalTopicCodes), skill));
  const updated = {
    ...doc,
    analysis: codedAnalysis,
    skillAnalyses: {
      ...docSkillAnalyses(doc),
      [skill.version]: codedAnalysis,
    },
    currentSkillVersion: skill.version,
    currentSkillName: skill.name,
    currentSkillAppliedAt: now,
    tags: codedAnalysis.suggestedTags || doc.tags || [],
    updatedAt: now,
    lastStudiedAt: now,
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await logEvent("refresh_topic_skill", { docId: doc.id, title: doc.title, skillVersion: skill.version });
  return updated;
}

function skillBatchRefreshDocs() {
  const batch = state.skillBatchRefresh;
  const ids = new Set(batch.selectedIds || []);
  return state.allDocuments.filter((doc) => ids.has(doc.id));
}

function docTopicCount(doc) {
  return Number(doc?.analysis?.topics?.length || 0);
}

function totalTopicCount(docs) {
  return docs.reduce((sum, doc) => sum + docTopicCount(doc), 0);
}

function renderSkillBatchRefreshModal() {
  const overlay = document.querySelector("[data-skill-batch-overlay]");
  if (!overlay) {
    return;
  }
  const batch = state.skillBatchRefresh;
  const skill = skillByVersion(batch.skillVersion, batch.skillTypeId) || currentTopicSkill(batch.skillTypeId || "type-executive-view");
  const candidates = skillRefreshCandidateDocs(batch.skillTypeId, skill);
  const selectedIds = new Set(batch.selectedIds || []);
  const selectedDocs = state.allDocuments.filter((doc) => selectedIds.has(doc.id));
  const displayDocs = (batch.active || batch.completed || selectedIds.size) ? selectedDocs : candidates;
  const total = selectedIds.size;
  const selectedTopicTotal = totalTopicCount(selectedDocs);
  const candidateTopicTotal = totalTopicCount(candidates);
  const finished = Object.values(batch.progressByDoc || {}).filter((item) => item.status === "done").length;
  const running = Boolean(batch.active);
  overlay.querySelector(".skill-batch-dialog").innerHTML = `
    <header class="skill-diff-header">
      <div>
        <p class="section-kicker">Skill Batch</p>
        <h3>批量刷新材料 · ${escapeHtml(skillDisplayName(skill, "话题拆解 SKILL.md"))}</h3>
      </div>
      <button class="mini-button" type="button" data-skill-batch-close>关闭</button>
    </header>
    <div class="skill-batch-summary">
      <strong>${running ? `执行中：${finished}/${total}` : batch.completed ? `已完成：${finished}/${total}` : `待执行：已选 ${total} 份`}</strong>
      <span>候选 ${escapeHtml(String(candidates.length))} 份材料 / ${escapeHtml(String(candidateTopicTotal))} 个话题；已选 ${escapeHtml(String(total))} 份 / ${escapeHtml(String(selectedTopicTotal))} 个话题。</span>
    </div>
    <div class="skill-batch-body">
      <section class="skill-batch-docs">
        ${displayDocs.length ? displayDocs.map((doc) => {
          const progress = batch.progressByDoc?.[doc.id] || { percent: 0, message: "等待执行", status: "pending" };
          const checked = selectedIds.has(doc.id);
          return `
            <article class="skill-batch-doc${checked ? " is-selected" : ""}">
              <label>
                <input type="checkbox" data-skill-batch-doc="${escapeHtml(doc.id)}" ${checked ? "checked" : ""} ${running ? "disabled" : ""} />
                <span>
                  <strong>${escapeHtml(doc.title || doc.fileName)}</strong>
                  <small>${escapeHtml(materialDisplayCode(doc))} · ${escapeHtml(String(docTopicCount(doc)))} 个话题 · 当前：${escapeHtml(materialSkillDisplay(doc))}</small>
                </span>
              </label>
              <div class="material-refresh-progress">
                <div><span style="width:${progress.percent}%"></span></div>
                <small>${escapeHtml(progress.message || "等待执行")} · ${escapeHtml(String(progress.percent || 0))}%</small>
              </div>
            </article>
          `;
        }).join("") : `<p class="empty-state compact">没有需要刷新到最新 SKILL 的材料。</p>`}
      </section>
      <section class="skill-batch-log">
        <h4>执行日志</h4>
        ${(batch.logs || []).length ? batch.logs.map((entry) => `<p><span>${escapeHtml(entry.time)}</span>${escapeHtml(entry.message)}</p>`).join("") : `<p class="empty-state compact">尚未开始执行。</p>`}
      </section>
    </div>
    <footer class="skill-batch-actions">
      <button class="mini-button" type="button" data-skill-batch-select-all ${running || !candidates.length ? "disabled" : ""}>全选</button>
      <button class="mini-button" type="button" data-skill-batch-clear ${running ? "disabled" : ""}>清空</button>
      <button class="primary" type="button" data-skill-batch-run ${running || !selectedDocs.length ? "disabled" : ""}>执行刷新</button>
    </footer>
  `;
  bindSkillBatchRefreshModal(overlay);
}

function bindSkillBatchRefreshModal(overlay) {
  const batch = state.skillBatchRefresh;
  const skill = skillByVersion(batch.skillVersion, batch.skillTypeId) || currentTopicSkill(batch.skillTypeId || "type-executive-view");
  const candidates = skillRefreshCandidateDocs(batch.skillTypeId, skill);
  overlay.querySelector("[data-skill-batch-close]")?.addEventListener("click", () => closeSkillBatchRefreshModal());
  overlay.querySelector("[data-skill-batch-select-all]")?.addEventListener("click", () => {
    state.skillBatchRefresh.selectedIds = candidates.map((doc) => doc.id);
    state.skillBatchRefresh.progressByDoc = Object.fromEntries(candidates.map((doc) => [
      doc.id,
      state.skillBatchRefresh.progressByDoc?.[doc.id] || { percent: 0, message: "等待执行", status: "pending" },
    ]));
    renderSkillBatchRefreshModal();
    renderTopicSkillPage();
  });
  overlay.querySelector("[data-skill-batch-clear]")?.addEventListener("click", () => {
    state.skillBatchRefresh.selectedIds = [];
    renderSkillBatchRefreshModal();
    renderTopicSkillPage();
  });
  overlay.querySelectorAll("[data-skill-batch-doc]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const ids = new Set(state.skillBatchRefresh.selectedIds || []);
      if (checkbox.checked) {
        ids.add(checkbox.dataset.skillBatchDoc);
      } else {
        ids.delete(checkbox.dataset.skillBatchDoc);
      }
      state.skillBatchRefresh.selectedIds = [...ids];
      renderSkillBatchRefreshModal();
      renderTopicSkillPage();
    });
  });
  overlay.querySelector("[data-skill-batch-run]")?.addEventListener("click", () => runSkillBatchRefresh());
}

async function closeSkillBatchRefreshModal() {
  const overlay = document.querySelector("[data-skill-batch-overlay]");
  if (!overlay) {
    return;
  }
  if (state.skillBatchRefresh.active) {
    const action = await confirmSkillBatchLeave();
    if (action === "stop") {
      state.analysisAbortController?.abort();
      state.skillBatchRefresh.active = false;
      state.isAnalyzing = false;
      state.allowAnalysisBackground = false;
      appendSkillBatchLog("用户停止了本次批量刷新。");
    } else if (action !== "background") {
      return;
    } else {
      state.skillBatchRefresh.background = true;
      state.allowAnalysisBackground = true;
      appendSkillBatchLog("已切换为后台执行，可先浏览其他页面。");
    }
  }
  state.skillBatchRefresh.modalOpen = false;
  overlay.remove();
  renderTopicSkillPage();
}

function openSkillBatchRefreshModal(materialTypeId = state.activeSkillMaterialTypeId) {
  const skill = currentTopicSkill(materialTypeId || "type-executive-view");
  const existing = state.skillBatchRefresh;
  const candidates = skillRefreshCandidateDocs(materialTypeId, skill);
  if ((!existing.active && !existing.completed) || existing.skillVersion !== skill.version || existing.skillTypeId !== (skill.targetMaterialTypeId || materialTypeId)) {
    resetSkillBatchRefresh(skill, candidates);
  }
  if (document.querySelector("[data-skill-batch-overlay]")) {
    renderSkillBatchRefreshModal();
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "skill-diff-overlay skill-batch-overlay";
  overlay.dataset.skillBatchOverlay = "true";
  overlay.innerHTML = `<section class="skill-diff-dialog skill-batch-dialog" role="dialog" aria-modal="true"></section>`;
  document.body.appendChild(overlay);
  state.skillBatchRefresh.modalOpen = true;
  renderSkillBatchRefreshModal();
}

async function runSkillBatchRefresh() {
  const batch = state.skillBatchRefresh;
  const skill = skillByVersion(batch.skillVersion, batch.skillTypeId) || currentTopicSkill(batch.skillTypeId || "type-executive-view");
  const selected = skillBatchRefreshDocs().filter((doc) => (doc.currentSkillVersion || doc.analysis?.skillVersion) !== skill.version);
  if (!selected.length || state.isAnalyzing) {
    return;
  }
  const ok = await confirmAction({
    title: "批量刷新 SKILL",
    message: `确认使用 ${skillDisplayName(skill, "话题拆解 SKILL.md")} 批量刷新 ${selected.length} 份材料吗？这会重新调用大模型生成这些材料的话题内容。`,
    confirmText: "确认执行",
  });
  if (!ok) {
    return;
  }
  state.skillBatchRefresh.active = true;
  state.skillBatchRefresh.completed = false;
  state.skillBatchRefresh.background = false;
  state.isAnalyzing = true;
  state.allowAnalysisBackground = false;
  state.analysisAbortController = new AbortController();
  appendSkillBatchLog(`开始批量刷新 ${selected.length} 份材料，目标版本：${skillDisplayName(skill, "话题拆解 SKILL.md")}`);
  try {
    for (let index = 0; index < selected.length; index += 1) {
      const doc = selected[index];
      if (state.analysisAbortController.signal.aborted) {
        throw new Error("本次批量刷新已停止。");
      }
      appendSkillBatchLog(`开始处理 ${index + 1}/${selected.length}：${doc.title || doc.fileName}`);
      setSkillBatchDocProgress(doc.id, 10, "准备发送材料", "running");
      setAnalysisProgress("SKILL 批量刷新", Math.min(90, 10 + Math.round((index / selected.length) * 70)), `正在用 ${skillDisplayName(skill, "话题拆解 SKILL.md")} 刷新：${doc.title || doc.fileName}`);
      const updated = await refreshDocumentWithSkill(doc, skill, (percent, message) => {
        setSkillBatchDocProgress(doc.id, percent, message, "running");
      });
      state.allDocuments = state.allDocuments.map((item) => (item.id === updated.id ? updated : item));
      state.documents = state.documents.map((item) => (item.id === updated.id ? updated : item));
      setSkillBatchDocProgress(doc.id, 100, "刷新完成", "done");
      appendSkillBatchLog(`完成 ${index + 1}/${selected.length}：${doc.title || doc.fileName}`);
    }
    await loadDocuments();
    state.skillBatchRefresh.active = false;
    state.skillBatchRefresh.completed = true;
    state.isAnalyzing = false;
    state.allowAnalysisBackground = false;
    state.analysisAbortController = null;
    setAnalysisProgress("完成", 100, `已使用 ${skillDisplayName(skill, "话题拆解 SKILL.md")} 批量刷新完成。`);
    appendSkillBatchLog("批量刷新已全部完成。");
  } catch (error) {
    const stopped = /已停止|aborted|abort/i.test(String(error.message || ""));
    state.skillBatchRefresh.active = false;
    state.isAnalyzing = false;
    state.allowAnalysisBackground = false;
    state.analysisAbortController = null;
    setAnalysisProgress(stopped ? "已停止" : "失败", 0, stopped ? "已停止本次批量刷新。" : `批量刷新失败：${error.message}`);
    appendSkillBatchLog(stopped ? "批量刷新已停止。" : `批量刷新失败：${error.message}`);
  } finally {
    updateUploadButtons();
    renderSkillBatchRefreshModal();
    renderTopicSkillPage();
  }
}

async function refreshMaterialWithLatestSkill(docId) {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc || doc.deletedAt || (doc.ownerEmailKey || "").toLowerCase() !== state.currentUser?.emailKey) {
    return;
  }
  if (state.isAnalyzing) {
    setSkillNotice("当前已有分析任务正在执行，请稍后再刷新 SKILL。", "error");
    renderMaterialOverviewPage();
    return;
  }
  const skill = currentTopicSkill(materialTypeIdForDoc(doc) || "type-executive-view");
  if ((doc.currentSkillVersion || doc.analysis?.skillVersion) === skill.version) {
    setSkillNotice(`这份材料已经使用 ${skill.version}。`, "info");
    renderMaterialOverviewPage();
    return;
  }
  const ok = await confirmAction({
    title: "刷新话题 SKILL",
    message: `确认用 ${skill.version} 重新分析“${doc.title || doc.fileName}”吗？这份材料下的话题会按新 SKILL 重新组织。`,
    confirmText: "确认刷新",
  });
  if (!ok) {
    return;
  }
  const now = new Date().toISOString();
  state.isAnalyzing = true;
  state.analysisAbortController = new AbortController();
  setSkillNotice(`正在使用话题 SKILL ${skill.version} 重新分析：${doc.title || doc.fileName}`, "info");
  setAnalysisProgress("SKILL 刷新", 10, `正在准备 ${skill.version} 的话题分析。`);
  setSkillRefreshProgress(doc.id, 10, `准备使用 ${skill.version} 重新分析`);
  try {
    setAnalysisProgress("连接模型", 25, "正在连接大模型并发送材料原文。");
    setSkillRefreshProgress(doc.id, 25, "正在连接大模型");
    setAnalysisProgress("模型分析", 55, "大模型正在按新版 SKILL 重新拆解话题。");
    setSkillNotice(`55% · 正在按话题 SKILL ${skill.version} 重新拆解材料，长文可能需要等待。`, "info");
    setSkillRefreshProgress(doc.id, 55, "正在重新拆解全部话题");
    const analysis = await analyzeWithDeepSeek(doc.rawText || "", {
      signal: state.analysisAbortController.signal,
      skill,
    });
    setAnalysisProgress("解析结果", 82, "模型已返回，正在保存新版 SKILL 的话题内容。");
    setSkillNotice("82% · 模型已返回，正在保存新版 SKILL 的话题内容。", "info");
    setSkillRefreshProgress(doc.id, 82, "正在保存新版话题内容");
    const historicalTopicCodes = Object.values(docSkillAnalyses(doc))
      .flatMap((item) => item?.topics || [])
      .map((topic) => topic.topicCode)
      .filter(Boolean);
    const codedAnalysis = preserveTopicFavorites(doc, withSkillMetadata(assignTopicCodesToAnalysis(analysis, doc.id, historicalTopicCodes), skill));
    const updated = {
      ...doc,
      analysis: codedAnalysis,
      skillAnalyses: {
        ...docSkillAnalyses(doc),
        [skill.version]: codedAnalysis,
      },
      currentSkillVersion: skill.version,
      currentSkillName: skill.name,
      currentSkillAppliedAt: now,
      tags: codedAnalysis.suggestedTags || doc.tags || [],
      updatedAt: now,
      lastStudiedAt: now,
    };
    await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
    await logEvent("refresh_topic_skill", { docId: doc.id, title: doc.title, skillVersion: skill.version });
    await loadDocuments();
    state.activeMaterialDocId = doc.id;
    state.activeMaterialTopicIndex = 0;
    state.activeMaterialSkillVersion = skill.version;
    setSkillRefreshProgress(doc.id, 100, "刷新完成");
    setAnalysisProgress("完成", 100, `已使用话题 SKILL ${skill.version} 完成刷新。`);
    setSkillNotice(`已使用话题 SKILL ${skill.version} 重新分析完成。`, "success");
  } catch (error) {
    const stopped = /已停止|aborted|abort/i.test(String(error.message || ""));
    setAnalysisProgress(stopped ? "已停止" : "失败", stopped ? 0 : 0, stopped ? "已停止本次 SKILL 刷新。" : `SKILL 刷新失败：${error.message}`);
    setSkillNotice(stopped ? "已停止本次 SKILL 刷新。" : `SKILL 刷新失败：${error.message}`, "error");
  } finally {
    state.isAnalyzing = false;
    state.analysisAbortController = null;
    state.skillRefreshState = { docId: "", percent: 0, message: "" };
    renderMaterialOverviewPage();
    updateUploadButtons();
  }
}

function materialTopicRow(doc, topic, index) {
  const tags = [
    ...(Array.isArray(topic.problemTypes) ? topic.problemTypes : []),
    ...(doc.tags || []),
  ].filter(Boolean);
  const favorite = Boolean(topic.favorite);
  return {
    id: `${doc.id}::${index}`,
    docId: doc.id,
    docTitle: doc.title,
    doc,
    topic,
    topicIndex: index,
    displayIndex: topic.topicCode || topicCodeFromNumber(index + 1),
    title: topic.title || `话题${index + 1}`,
    tags: [...new Set(tags)].slice(0, 5),
    type: materialTypeNameForDoc(doc),
    source: materialSourceNameForDoc(doc),
    ownerEmail: doc.ownerEmail || "",
    ownerEmailKey: doc.ownerEmailKey || "",
    favorite,
    updatedAt: doc.lastStudiedAt || doc.updatedAt || doc.createdAt,
  };
}

function materialSkillDisplay(doc) {
  const typeName = doc?.analysis?.targetMaterialTypeName || materialTypeNameForDoc(doc) || "高层视角";
  const typeId = doc?.analysis?.targetMaterialTypeId || materialTypeIdForDoc(doc) || "type-executive-view";
  const skillName = skillNameForMaterialType(typeName, typeId);
  const version = doc?.currentSkillVersion || doc?.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  return `${skillName} ${version}`;
}

function topicSkillForDoc(doc, version = "") {
  if (!doc) {
    return DEFAULT_TOPIC_SKILL;
  }
  const typeId = materialTypeIdForDoc(doc) || doc.analysis?.targetMaterialTypeId || "type-executive-view";
  const skillVersion = version || doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  return skillByVersion(skillVersion, typeId) || currentTopicSkill(typeId);
}

function topicSkillPillHtml(doc, version = "", label = "最后 SKILL") {
  const skill = topicSkillForDoc(doc, version);
  const typeId = materialTypeIdForDoc(doc) || doc?.analysis?.targetMaterialTypeId || "type-executive-view";
  return `<button class="pill skill-pill-button topic-skill-pill" type="button" data-open-topic-skill="${escapeHtml(skill.version || version || "")}" data-topic-skill-type="${escapeHtml(typeId)}">${escapeHtml(label)}：${escapeHtml(skill.skillFileName || skill.name || "话题拆解 SKILL.md")} ${escapeHtml(skill.version || "未记录")}</button>`;
}

function bindTopicSkillPills(root) {
  root?.querySelectorAll("[data-open-topic-skill]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const typeId = button.dataset.topicSkillType || "type-executive-view";
      const skill = skillByVersion(button.dataset.openTopicSkill || "", typeId) || currentTopicSkill(typeId);
      showSkillContentModal(skill, `${skill.skillFileName || skill.name || "话题拆解 SKILL.md"} ${skill.version || ""}`.trim(), {
        editable: true,
        kind: "topic",
        targetMaterialTypeId: typeId,
      });
    });
  });
}

function skillShortDisplay(skill) {
  if (!skill) {
    return "最新版本";
  }
  const typeName = String(skill.targetMaterialTypeName || skill.name || "话题 SKILL")
    .replace(/话题拆解\s*SKILL$/i, "")
    .trim();
  return `${typeName || "话题"} ${skill.version || ""}`.trim();
}

function favoriteIcon(active) {
  return active ? "♥" : "♡";
}

async function updateDocumentFavorite(docId, favorite) {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc || doc.deletedAt || (!isAdmin() && (doc.ownerEmailKey || "") !== state.currentUser?.emailKey)) {
    return;
  }
  const updated = { ...doc, favorite: Boolean(favorite), favoriteAt: favorite ? new Date().toISOString() : "", updatedAt: new Date().toISOString() };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await loadDocuments();
}

async function updateTopicFavorite(docId, topicIndex, favorite, version = "") {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc || doc.deletedAt || (!isAdmin() && (doc.ownerEmailKey || "") !== state.currentUser?.emailKey)) {
    return;
  }
  const skillVersion = version || doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const analyses = docSkillAnalyses(doc);
  const targetAnalysis = analyses[skillVersion] || doc.analysis;
  if (!targetAnalysis?.topics?.[topicIndex]) {
    return;
  }
  const updatedAnalysis = {
    ...targetAnalysis,
    topics: targetAnalysis.topics.map((topic, index) => (
      index === Number(topicIndex) ? { ...topic, favorite: Boolean(favorite), favoriteAt: favorite ? new Date().toISOString() : "" } : topic
    )),
  };
  const updatedSkillAnalyses = { ...analyses, [skillVersion]: updatedAnalysis };
  const currentVersion = doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const updated = {
    ...doc,
    analysis: skillVersion === currentVersion ? updatedAnalysis : doc.analysis,
    skillAnalyses: updatedSkillAnalyses,
    updatedAt: new Date().toISOString(),
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await loadDocuments();
}

function renderMaterialOverviewPage() {
  if (!els.materialOverviewPage) {
    return;
  }
  const docs = materialDocsForInsight();
  const activeDocs = (isAdmin() ? state.allDocuments : state.documents).filter((doc) => !doc.deletedAt && doc.analysis);
  const sourceItems = [...state.materialSources];
  const typeItems = [...state.materialTypes];
  activeDocs.forEach((doc) => {
    const source = materialSourceForDoc(doc);
    if (source && !sourceItems.some((item) => item.id === source.id)) {
      sourceItems.push(source);
    }
    const type = materialTypeForDoc(doc);
    if (type && !typeItems.some((item) => item.id === type.id)) {
      typeItems.push(type);
    }
  });

  if (!docs.some((doc) => doc.id === state.activeMaterialDocId)) {
    state.activeMaterialDocId = docs[0]?.id || "";
    state.activeMaterialTopicIndex = 0;
  }
  const activeDoc = docs.find((doc) => doc.id === state.activeMaterialDocId);
  const skillVersions = activeDoc ? docSkillVersions(activeDoc) : [];
  const preferredSkillVersion = activeDoc?.currentSkillVersion || activeDoc?.analysis?.skillVersion || skillVersions[0]?.version || "";
  if (activeDoc && !skillVersions.some((item) => item.version === state.activeMaterialSkillVersion)) {
    state.activeMaterialSkillVersion = preferredSkillVersion;
  }
  const activeSkillVersion = state.activeMaterialSkillVersion || preferredSkillVersion;
  const activeAnalysis = activeDoc ? docAnalysisForSkill(activeDoc, activeSkillVersion) : null;
  const activeSkillMeta = skillVersions.find((item) => item.version === activeSkillVersion);
  const topics = activeAnalysis?.topics || [];
  if (state.activeMaterialTopicIndex >= topics.length) {
    state.activeMaterialTopicIndex = 0;
  }
  const activeMaterialTypeKind = activeDoc ? materialTypeKind(materialTypeIdForDoc(activeDoc), materialTypeNameForDoc(activeDoc)) : "";
  const isMeetingNotes = activeDoc ? activeMaterialTypeKind === "meeting" || Boolean(activeAnalysis?.meetingAnalysis) : false;
  const isTrainingSpeech = activeDoc ? activeMaterialTypeKind === "training" || Boolean(activeAnalysis?.trainingAnalysis) : false;
  const activeMaterialPane = isMeetingNotes
    ? (["meeting", "source", "topics", "mindmap"].includes(state.activeMaterialPane) ? state.activeMaterialPane : "meeting")
    : isTrainingSpeech
      ? (["training", "source", "topics", "mindmap"].includes(state.activeMaterialPane) ? state.activeMaterialPane : "training")
      : (["source", "topics", "mindmap"].includes(state.activeMaterialPane) ? state.activeMaterialPane : "source");
  const activeTopic = activeDoc ? topics[state.activeMaterialTopicIndex] : null;
  const activeDocForTopic = activeDoc && activeAnalysis ? { ...activeDoc, analysis: activeAnalysis } : activeDoc;
  const row = activeDocForTopic && activeTopic ? materialTopicRow(activeDocForTopic, activeTopic, state.activeMaterialTopicIndex) : null;
  const adminOwnerFilter = isAdmin()
    ? `<input class="text-input" id="materialListOwnerFilter" list="materialListOwnerOptions" type="search" placeholder="筛选用户邮箱" value="${escapeHtml(state.materialListOwnerFilter)}" />
       <datalist id="materialListOwnerOptions">${state.users.map((user) => `<option value="${escapeHtml(user.email)}"></option>`).join("")}</datalist>`
    : "";
  els.materialOverviewPage.innerHTML = `
    ${state.skillNotice.message ? `<p class="category-notice material-skill-notice" data-tone="${escapeHtml(state.skillNotice.tone || "info")}">${escapeHtml(state.skillNotice.message)}</p>` : ""}
    <div class="material-list-filters">
      <button class="favorite-filter-btn" type="button" data-material-favorite-filter data-active="${state.materialFavoriteOnly ? "true" : "false"}" aria-pressed="${state.materialFavoriteOnly ? "true" : "false"}" title="只看收藏">
        <span class="favorite-filter-icon" aria-hidden="true">${state.materialFavoriteOnly ? "♥" : "♡"}</span>
        <span class="favorite-filter-text">${state.materialFavoriteOnly ? "已收藏" : "收藏"}</span>
      </button>
      <input class="text-input" id="materialListSearch" type="search" placeholder="搜索材料标题 / 标签 / 来源 / 原文" value="${escapeHtml(state.materialListSearch)}" />
      <select class="text-input" id="materialListSourceFilter">
        <option value="">全部资料来源</option>
        ${sourceItems.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === state.materialListSourceFilter ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
      </select>
      <select class="text-input" id="materialListTypeFilter">
        <option value="">全部资料类型</option>
        ${typeItems.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === state.materialListTypeFilter ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
      </select>
      ${adminOwnerFilter}
    </div>
    <div class="material-overview-layout">
      <aside class="material-card-list" aria-label="材料列表">
        ${docs.length ? docs.map((doc) => {
          const refreshState = state.skillRefreshState.docId === doc.id ? state.skillRefreshState : null;
          const hasNewSkill = hasNewTopicSkill(doc);
          const latestSkill = hasNewSkill ? currentTopicSkill(materialTypeIdForDoc(doc) || "type-executive-view") : null;
          const materialKeyword = state.materialListSearch.trim();
          const searchSnippet = materialSearchSnippet(doc, materialKeyword);
          return `
            <article class="material-card${doc.id === state.activeMaterialDocId ? " is-active" : ""}">
              <div class="material-card-head">
                <button class="material-card-main" type="button" data-material-card="${escapeHtml(doc.id)}">
                  <span class="material-card-title-row"><span class="material-card-code">${escapeHtml(materialDisplayCode(doc))}</span><strong>${highlightSearchTerm(doc.title || doc.fileName, materialKeyword)}</strong></span>
                  <span>分类：${highlightSearchTerm(materialSourceNameForDoc(doc), materialKeyword)} / ${highlightSearchTerm(materialTypeNameForDoc(doc), materialKeyword)}</span>
                  <em>标签：${highlightSearchTerm((doc.tags || []).length ? (doc.tags || []).slice(0, 4).join(" / ") : "未打标签", materialKeyword)}</em>
                  ${searchSnippet ? `<small class="material-search-snippet">${highlightSearchTerm(searchSnippet, materialKeyword)}</small>` : ""}
                  <small>${escapeHtml(formatDate(doc.lastStudiedAt || doc.updatedAt || doc.createdAt))} · ${escapeHtml(String(doc.analysis?.topics?.length || 0))} 个话题 · ${escapeHtml(materialSkillDisplay(doc))}</small>
                  ${isAdmin() && doc.ownerEmail ? `<em>${escapeHtml(doc.ownerEmail)}</em>` : ""}
                </button>
                <button class="favorite-toggle material-favorite-toggle${doc.favorite ? " is-active" : ""}" type="button" data-material-favorite="${escapeHtml(doc.id)}" aria-label="${doc.favorite ? "取消收藏材料" : "收藏材料"}" title="${doc.favorite ? "取消收藏材料" : "收藏材料"}"><span aria-hidden="true">${favoriteIcon(doc.favorite)}</span></button>
              </div>
              ${hasNewSkill ? `
                <div class="material-skill-actions">
                  <button class="material-skill-refresh" type="button" data-skill-refresh="${escapeHtml(doc.id)}" ${state.isAnalyzing ? "disabled" : ""}>SKILL 刷新</button>
                  <button class="material-skill-diff-link" type="button" data-skill-diff="${escapeHtml(doc.id)}">查看新版差异</button>
                  <span class="material-skill-new-version">最新：${escapeHtml(skillShortDisplay(latestSkill))}</span>
                </div>
              ` : ""}
              ${refreshState ? `
                <div class="material-refresh-progress">
                  <div><span style="width:${Math.max(0, Math.min(100, Number(refreshState.percent || 0)))}%"></span></div>
                  <small>${escapeHtml(refreshState.message || "正在刷新")} · ${escapeHtml(String(refreshState.percent || 0))}%</small>
                </div>
              ` : ""}
            </article>
          `;
        }).join("") : `<p class="empty-state compact">还没有匹配的已分析材料。</p>`}
      </aside>
      <section class="material-topic-panel">
        ${activeDoc ? `
          <div class="material-topic-header">
            <div>
              <p class="section-kicker">Material Topics</p>
              <h3><span>${escapeHtml(materialDisplayCode(activeDoc))}</span>${escapeHtml(activeDoc.title || activeDoc.fileName)}</h3>
            </div>
            <button class="mini-button" type="button" data-open-source-topics="${escapeHtml(activeDoc.id)}">只看这份材料的话题列表</button>
          </div>
          <div class="topic-meta source-meta">
            <span class="pill">材料编号：${escapeHtml(materialDisplayCode(activeDoc))}</span>
            <span class="pill">资料来源：${escapeHtml(materialSourceNameForDoc(activeDoc))}</span>
            <span class="pill">材料类型：${escapeHtml(materialTypeNameForDoc(activeDoc))}</span>
            <span class="pill">最后更新：${escapeHtml(formatDate(activeDoc.lastStudiedAt || activeDoc.updatedAt || activeDoc.createdAt))}</span>
            <span class="pill">${activeDoc.favorite ? "已收藏材料" : "未收藏材料"}</span>
            ${isAdmin() && activeDoc.ownerEmail ? `<span class="pill">用户：${escapeHtml(activeDoc.ownerEmail)}</span>` : ""}
            ${topicSkillPillHtml(activeDoc, activeSkillVersion)}
          </div>
          <div class="material-skill-switch">
            <span>查看 SKILL 版本</span>
            <select class="text-input" id="materialSkillVersionSelect">
              ${skillVersions.map((item) => `<option value="${escapeHtml(item.version)}" ${item.version === activeSkillVersion ? "selected" : ""}>${escapeHtml(item.version)} · ${escapeHtml(item.skill?.skillFileName || item.skill?.name || "话题拆解 SKILL.md")}</option>`).join("")}
            </select>
            <small>${activeSkillMeta ? `应用时间：${escapeHtml(formatDate(activeSkillMeta.appliedAt))}` : ""}</small>
          </div>
          <div class="topic-detail-tabs-row material-detail-tabs-row">
            <div class="topic-detail-tabs" role="tablist" aria-label="材料学习内容">
              ${isMeetingNotes ? `<button class="topic-detail-tab${activeMaterialPane === "meeting" ? " is-active" : ""}" type="button" data-material-pane="meeting">会议纪要分析</button>` : ""}
              ${isTrainingSpeech ? `<button class="topic-detail-tab${activeMaterialPane === "training" ? " is-active" : ""}" type="button" data-material-pane="training">培训分析</button>` : ""}
              <button class="topic-detail-tab${activeMaterialPane === "source" ? " is-active" : ""}" type="button" data-material-pane="source">资料原文</button>
              <button class="topic-detail-tab${activeMaterialPane === "topics" ? " is-active" : ""}" type="button" data-material-pane="topics">话题内容</button>
              <button class="topic-detail-tab${activeMaterialPane === "mindmap" ? " is-active" : ""}" type="button" data-material-pane="mindmap">文章脑图</button>
            </div>
          </div>
          ${activeMaterialPane === "meeting" ? buildMeetingAnalysisHtml(activeAnalysis?.meetingAnalysis) : activeMaterialPane === "training" ? buildTrainingAnalysisHtml(activeAnalysis?.trainingAnalysis, activeDoc, activeSkillVersion) : activeMaterialPane === "source" ? buildMaterialOriginalHtml(activeDoc) : activeMaterialPane === "mindmap" ? `
            <article class="topic-article material-topic-article">
              ${activeAnalysis ? buildMaterialMindMapHtml(activeDoc, activeAnalysis) : `<p class="empty-state compact">这份材料没有可展示的文章脑图。</p>`}
            </article>
          ` : `
            <div class="material-topic-nav">
              ${topics.map((topic, index) => `
                <button class="${index === state.activeMaterialTopicIndex ? "is-active" : ""}" type="button" data-material-topic="${index}">
                  <strong>${escapeHtml(topic.title || `话题${index + 1}`)}</strong>
                  ${topic.favorite ? `<span class="topic-favorite-mark" aria-hidden="true">♥</span>` : ""}
                </button>
              `).join("")}
            </div>
            <article class="topic-article material-topic-article">
              ${row ? buildTopicArticleHtml(activeTopic, row) : `<p class="empty-state compact">${isMeetingNotes ? "这份会议纪要没有强行提炼话题，可先查看会议纪要分析。" : isTrainingSpeech ? "这份培训讲话没有强行提炼话题，可先查看培训分析。" : "这份材料没有可展示的话题。"}</p>`}
            </article>
          `}
        ` : `<p class="empty-state">还没有已分析材料。点击顶部“材料上传分析”先上传并执行分析。</p>`}
      </section>
    </div>
  `;

  const materialSearchInput = els.materialOverviewPage.querySelector("#materialListSearch");
  materialSearchInput?.addEventListener("compositionstart", () => {
    state.materialSearchComposing = true;
  });
  materialSearchInput?.addEventListener("compositionend", (event) => {
    state.materialSearchComposing = false;
    state.materialListSearch = event.target.value;
    if (state.activeMaterialPane === "source") {
      state.activeOriginalKeyword = event.target.value.trim();
    }
    renderMaterialOverviewPage();
  });
  materialSearchInput?.addEventListener("input", (event) => {
    const input = event.currentTarget;
    state.materialListSearch = event.target.value;
    if (state.activeMaterialPane === "source") {
      state.activeOriginalKeyword = event.target.value.trim();
    }
    if (event.isComposing || state.materialSearchComposing) {
      return;
    }
    const shouldRestoreFocus = document.activeElement === input;
    const selectionStart = typeof input.selectionStart === "number" ? input.selectionStart : null;
    const selectionEnd = typeof input.selectionEnd === "number" ? input.selectionEnd : null;
    renderMaterialOverviewPage();
    if (shouldRestoreFocus) {
      const nextInput = els.materialOverviewPage.querySelector("#materialListSearch");
      if (nextInput) {
        nextInput.focus({ preventScroll: true });
        if (selectionStart !== null && selectionEnd !== null && nextInput.setSelectionRange) {
          try {
            nextInput.setSelectionRange(selectionStart, selectionEnd);
          } catch {
            nextInput.focus({ preventScroll: true });
          }
        }
      }
    }
  });
  els.materialOverviewPage.querySelector("#materialListSourceFilter")?.addEventListener("change", (event) => {
    state.materialListSourceFilter = event.target.value;
    renderMaterialOverviewPage();
  });
  els.materialOverviewPage.querySelector("#materialListTypeFilter")?.addEventListener("change", (event) => {
    state.materialListTypeFilter = event.target.value;
    renderMaterialOverviewPage();
  });
  els.materialOverviewPage.querySelector("#materialListOwnerFilter")?.addEventListener("input", (event) => {
    state.materialListOwnerFilter = event.target.value;
    renderMaterialOverviewPage();
  });
  els.materialOverviewPage.querySelector("[data-material-favorite-filter]")?.addEventListener("click", () => {
    state.materialFavoriteOnly = !state.materialFavoriteOnly;
    renderMaterialOverviewPage();
  });
  els.materialOverviewPage.querySelectorAll("[data-material-favorite]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const doc = state.allDocuments.find((item) => item.id === button.dataset.materialFavorite);
      await updateDocumentFavorite(button.dataset.materialFavorite, !doc?.favorite);
    });
  });
  els.materialOverviewPage.querySelectorAll("[data-material-card]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMaterialDocId = button.dataset.materialCard;
      state.activeMaterialTopicIndex = 0;
      state.activeMaterialSkillVersion = "";
      state.mindMapSelectedNodeId = "";
      state.mindMapCollapsedNodeIds = [];
      const selectedDoc = docs.find((doc) => doc.id === button.dataset.materialCard);
      const selectedTypeKind = selectedDoc ? materialTypeKind(materialTypeIdForDoc(selectedDoc), materialTypeNameForDoc(selectedDoc)) : "";
      state.activeMaterialPane = selectedDoc && (selectedTypeKind === "meeting" || selectedDoc.analysis?.meetingAnalysis)
        ? "meeting"
        : selectedDoc && (selectedTypeKind === "training" || selectedDoc.analysis?.trainingAnalysis)
          ? "training"
          : "source";
      state.activeOriginalKeyword = state.materialListSearch.trim();
      renderMaterialOverviewPage();
    });
  });
  els.materialOverviewPage.querySelectorAll("[data-skill-refresh]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      refreshMaterialWithLatestSkill(button.dataset.skillRefresh);
    });
  });
  els.materialOverviewPage.querySelectorAll("[data-skill-diff]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      showSkillDiffModal(button.dataset.skillDiff);
    });
  });
  bindTopicSkillPills(els.materialOverviewPage);
  els.materialOverviewPage.querySelector("#materialSkillVersionSelect")?.addEventListener("change", (event) => {
    state.activeMaterialSkillVersion = event.target.value;
    state.activeMaterialTopicIndex = 0;
    state.mindMapSelectedNodeId = "";
    state.mindMapCollapsedNodeIds = [];
    const selectedDoc = docs.find((doc) => doc.id === state.activeMaterialDocId);
    const selectedAnalysis = selectedDoc ? docAnalysisForSkill(selectedDoc, state.activeMaterialSkillVersion) : null;
    const selectedTypeKind = selectedDoc ? materialTypeKind(materialTypeIdForDoc(selectedDoc), materialTypeNameForDoc(selectedDoc)) : "";
    state.activeMaterialPane = selectedDoc && (selectedTypeKind === "meeting" || selectedAnalysis?.meetingAnalysis)
      ? "meeting"
      : selectedDoc && (selectedTypeKind === "training" || selectedAnalysis?.trainingAnalysis)
        ? "training"
        : "topics";
    renderMaterialOverviewPage();
  });
  els.materialOverviewPage.querySelectorAll("[data-material-pane]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMaterialPane = button.dataset.materialPane;
      if (button.dataset.materialPane === "source" && !state.activeOriginalKeyword) {
        state.activeOriginalKeyword = state.materialListSearch.trim();
      }
      if (button.dataset.materialPane === "mindmap") {
        state.mindMapSelectedNodeId = "";
        state.mindMapCollapsedNodeIds = [];
      }
      renderMaterialOverviewPage();
    });
  });
  els.materialOverviewPage.querySelectorAll("[data-material-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMaterialTopicIndex = Number(button.dataset.materialTopic || 0);
      state.activeMaterialPane = "topics";
      state.mindMapSelectedNodeId = "";
      state.mindMapCollapsedNodeIds = [];
      renderMaterialOverviewPage();
    });
  });
  const materialMindRoot = activeMaterialPane === "mindmap" && activeDoc && activeAnalysis
    ? buildMaterialMindMapData(activeDoc, activeAnalysis)
    : null;
  bindMindMapInteractions(
    els.materialOverviewPage,
    () => renderMaterialOverviewPage(),
    null,
    null,
    materialMindRoot,
  );
  if (activeMaterialPane === "topics" && row) {
    bindTopicWritingControls(els.materialOverviewPage, row, () => renderMaterialOverviewPage());
  }
  els.materialOverviewPage.querySelectorAll("[data-rich-command]").forEach((button) => {
    button.addEventListener("click", () => {
      const editor = els.materialOverviewPage.querySelector("[data-training-note-editor]");
      if (!editor) {
        return;
      }
      editor.focus();
      document.execCommand(button.dataset.richCommand, false, null);
    });
  });
  els.materialOverviewPage.querySelectorAll("[data-save-training-note]").forEach((button) => {
    button.addEventListener("click", async () => {
      const editor = [...els.materialOverviewPage.querySelectorAll("[data-training-note-editor]")]
        .find((node) => node.dataset.trainingNoteEditor === button.dataset.saveTrainingNote);
      const ok = await confirmAction({
        title: "保存学习笔记",
        message: "确认保存当前培训学习笔记吗？保存后会覆盖这个 SKILL 版本下的旧笔记。",
        confirmText: "确认保存",
      });
      if (!ok || !editor) {
        return;
      }
      await updateTrainingNote(button.dataset.saveTrainingNote, button.dataset.skillVersion, editor.innerHTML);
      setSkillNotice("学习笔记已保存。", "success");
      renderMaterialOverviewPage();
    });
  });
  els.materialOverviewPage.querySelector("[data-open-source-topics]")?.addEventListener("click", (event) => {
    guardAnalysisNavigation(() => openSourceTopics(event.currentTarget.dataset.openSourceTopics));
  });
  els.materialOverviewPage.querySelectorAll("[data-topic-favorite-doc]").forEach((button) => {
    button.addEventListener("click", async () => {
      const doc = state.allDocuments.find((item) => item.id === button.dataset.topicFavoriteDoc);
      const version = button.dataset.topicFavoriteVersion || activeSkillVersion;
      const analysis = doc ? docAnalysisForSkill(doc, version) : null;
      const topic = analysis?.topics?.[Number(button.dataset.topicFavoriteIndex)];
      await updateTopicFavorite(button.dataset.topicFavoriteDoc, Number(button.dataset.topicFavoriteIndex), !topic?.favorite, version);
    });
  });
}

function renderTopicHome() {
  if (!els.topicHomeList || !els.topicHomeArticle) {
    return;
  }
  if (els.topicFavoriteFilter) {
    els.topicFavoriteFilter.dataset.active = String(state.topicFavoriteOnly);
    els.topicFavoriteFilter.setAttribute("aria-pressed", String(state.topicFavoriteOnly));
    const icon = els.topicFavoriteFilter.querySelector(".favorite-filter-icon");
    const text = els.topicFavoriteFilter.querySelector(".favorite-filter-text");
    if (icon) icon.textContent = state.topicFavoriteOnly ? "♥" : "♡";
    if (text) text.textContent = state.topicFavoriteOnly ? "已收藏" : "收藏";
  }
  const keyword = state.topicSearch.trim().toLowerCase();
  const rows = buildTopicRows().filter((row) => {
    const sourceMatch = !state.topicSourceFilter || materialSourceIdForDoc(row.doc) === state.topicSourceFilter;
    const typeMatch = !state.topicTypeFilter || materialTypeIdForDoc(row.doc) === state.topicTypeFilter;
    const docMatch = !state.topicDocFilter || row.docId === state.topicDocFilter;
    const ownerKeyword = String(state.topicOwnerFilter || "").trim().toLowerCase();
    const ownerMatch = !isAdmin() || !ownerKeyword || `${row.ownerEmail} ${row.ownerEmailKey}`.toLowerCase().includes(ownerKeyword);
    const favoriteMatch = !state.topicFavoriteOnly || row.favorite;
    const text = topicSearchText(row).toLowerCase();
    return sourceMatch && typeMatch && docMatch && ownerMatch && favoriteMatch && (!keyword || text.includes(keyword));
  });
  const pageSize = Number(state.topicPageSize || 20);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  state.topicPage = Math.min(Math.max(1, Number(state.topicPage || 1)), totalPages);
  const startIndex = (state.topicPage - 1) * pageSize;
  const visibleRows = rows.slice(startIndex, startIndex + pageSize);
  els.topicHomeList.classList.toggle("is-scrollable", visibleRows.length > 20);
  const selectedRow = visibleRows.find((row) => row.id === state.activeTopicRef) || visibleRows[0];
  state.activeTopicRef = selectedRow?.id || null;
  const pager = `
    <div class="topic-list-pager">
      <span>共 ${escapeHtml(String(rows.length))} 个话题</span>
      <label>每页
        <select class="text-input" data-topic-page-size>
          ${[10, 20, 30, 50].map((size) => `<option value="${size}" ${size === pageSize ? "selected" : ""}>${size}</option>`).join("")}
        </select>
      </label>
      <button class="mini-button" type="button" data-topic-page="prev" ${state.topicPage <= 1 ? "disabled" : ""}>上一页</button>
      <strong>${escapeHtml(String(state.topicPage))} / ${escapeHtml(String(totalPages))}</strong>
      <button class="mini-button" type="button" data-topic-page="next" ${state.topicPage >= totalPages ? "disabled" : ""}>下一页</button>
    </div>
  `;
  els.topicHomeList.innerHTML = rows.length
    ? `${pager}${visibleRows.map((row) => `
      <article class="topic-home-card${row.id === state.activeTopicRef ? " is-active" : ""}" data-topic-card="${escapeHtml(row.id)}" tabindex="0">
        <button class="favorite-toggle topic-card-favorite${row.favorite ? " is-active" : ""}" type="button" data-topic-card-favorite="${escapeHtml(row.id)}" aria-label="${row.favorite ? "取消收藏话题" : "收藏话题"}" title="${row.favorite ? "取消收藏话题" : "收藏话题"}"><span aria-hidden="true">${favoriteIcon(row.favorite)}</span></button>
        <div class="topic-home-card-main">
          <span class="topic-home-title-row">
            <span class="topic-home-index">${escapeHtml(row.displayIndex)}</span>
            <strong>
              <span>${highlightSearchTerm(row.title, state.topicSearch)}</span><time class="topic-home-time-inline">${escapeHtml(formatDate(row.updatedAt))}</time>
            </strong>
          </span>
        </div>
        <div class="topic-home-tags">
          ${row.tags.length ? row.tags.map((tag) => `<span class="topic-tag">${highlightSearchTerm(tag, state.topicSearch)}</span>`).join("") : `<span class="muted-text">未打标签</span>`}
          ${isAdmin() && row.ownerEmail ? `<span class="topic-tag owner-tag">${highlightSearchTerm(row.ownerEmail, state.topicSearch)}</span>` : ""}
        </div>
        <div class="topic-home-skill" title="分析 SKILL：${escapeHtml(row.skillDisplay)}">
          <span class="topic-card-skill-pill">分析 SKILL：${highlightSearchTerm(row.skillDisplay, state.topicSearch)}</span>
        </div>
        <button class="topic-home-source" type="button" data-topic-source="${escapeHtml(row.id)}" title="话题来源：${escapeHtml(row.source)} · ${escapeHtml(row.docTitle)}">
          <span>话题来源：</span>${highlightSearchTerm(`${row.source} · ${row.docTitle}`, state.topicSearch)}
        </button>
      </article>
    `).join("")}`
    : `<p class="empty-state compact">还没有匹配的话题。</p>`;

  els.topicHomeList.querySelector("[data-topic-page-size]")?.addEventListener("change", (event) => {
    state.topicPageSize = Number(event.target.value || 20);
    state.topicPage = 1;
    renderTopicHome();
  });
  els.topicHomeList.querySelectorAll("[data-topic-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.topicPage += button.dataset.topicPage === "next" ? 1 : -1;
      renderTopicHome();
    });
  });

  els.topicHomeList.querySelectorAll("[data-topic-card]").forEach((card) => {
    card.addEventListener("click", () => selectTopicHomeRow(card.dataset.topicCard, "analysis"));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTopicHomeRow(card.dataset.topicCard, "analysis");
      }
    });
  });
  els.topicHomeList.querySelectorAll("[data-topic-source]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTopicHomeRow(button.dataset.topicSource, "source");
    });
  });
  els.topicHomeList.querySelectorAll("[data-topic-card-favorite]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const row = rows.find((item) => item.id === button.dataset.topicCardFavorite);
      if (row) {
        await updateTopicFavorite(row.docId, row.topicIndex, !row.favorite, row.doc?.analysis?.skillVersion || row.doc?.currentSkillVersion || "");
      }
    });
  });
  renderTopicHomeArticle(selectedRow);
}

function selectTopicHomeRow(rowId, pane = "analysis") {
  state.activeTopicRef = rowId;
  state.activeTopicPane = pane;
  state.mindMapSelectedNodeId = "";
  state.mindMapCollapsedNodeIds = [];
  renderTopicHome();
}

function renderTopicHomeArticle(row) {
  if (!els.topicHomeArticle) {
    return;
  }
  if (!row) {
    els.topicHomeArticle.innerHTML = `<p class="empty-state">还没有可学习的话题。点击顶部“材料上传分析”先上传材料。</p>`;
    return;
  }
  const activePane = ["analysis", "source", "mindmap"].includes(state.activeTopicPane) ? state.activeTopicPane : "analysis";
  els.topicHomeArticle.innerHTML = `
    <div class="topic-detail-tabs-row">
      <div class="topic-detail-tabs" role="tablist" aria-label="话题学习内容">
        <button class="topic-detail-tab${activePane === "source" ? " is-active" : ""}" type="button" data-topic-pane="source">资料原文</button>
        <button class="topic-detail-tab${activePane === "analysis" ? " is-active" : ""}" type="button" data-topic-pane="analysis">话题解析</button>
        <button class="topic-detail-tab${activePane === "mindmap" ? " is-active" : ""}" type="button" data-topic-pane="mindmap">知识脑图</button>
      </div>
    </div>
    <div class="topic-detail-pane">
      ${activePane === "source" ? buildTopicSourceHtml(row, { includeTopicPanel: false }) : activePane === "mindmap" ? buildMindMapHtml(row.topic, row) : buildTopicArticleHtml(row.topic, row)}
    </div>
  `;
  els.topicHomeArticle.querySelectorAll("[data-topic-pane]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTopicPane = button.dataset.topicPane;
      state.activeOriginalKeyword = "";
      state.mindMapSelectedNodeId = "";
      renderTopicHomeArticle(row);
    });
  });
  bindMindMapInteractions(els.topicHomeArticle, () => renderTopicHomeArticle(row), row.topic, row);
  bindTopicWritingControls(els.topicHomeArticle, row, () => renderTopicHomeArticle(row));
  bindTopicSkillPills(els.topicHomeArticle);
  els.topicHomeArticle.querySelectorAll("[data-original-keyword]").forEach((button) => {
    button.addEventListener("click", () => {
      const keyword = button.dataset.originalKeyword;
      state.activeOriginalKeyword = state.activeOriginalKeyword === keyword ? "" : keyword;
      renderTopicHomeArticle(row);
    });
  });
  els.topicHomeArticle.querySelectorAll("[data-topic-favorite-doc]").forEach((button) => {
    button.addEventListener("click", async () => {
      const doc = state.allDocuments.find((item) => item.id === button.dataset.topicFavoriteDoc);
      const version = button.dataset.topicFavoriteVersion || doc?.currentSkillVersion || doc?.analysis?.skillVersion || "";
      const analysis = doc ? docAnalysisForSkill(doc, version) : null;
      const topic = analysis?.topics?.[Number(button.dataset.topicFavoriteIndex)];
      await updateTopicFavorite(button.dataset.topicFavoriteDoc, Number(button.dataset.topicFavoriteIndex), !topic?.favorite, version);
    });
  });
}

function bindTopicWritingControls(rootEl, row, rerender) {
  if (!rootEl || !row) {
    return;
  }
  rootEl.querySelectorAll("[data-writing-idea-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const current = state.topicArticleIdeas[row.id] || {};
      const ideaIndex = Number(input.value);
      const selectedViewpoints = { ...(current.selectedViewpoints || {}) };
      if (input.checked) {
        const idea = current.ideas?.[ideaIndex];
        if (!Array.isArray(selectedViewpoints[String(ideaIndex)]) || !selectedViewpoints[String(ideaIndex)].length) {
          selectedViewpoints[String(ideaIndex)] = normalizeIdeaViewpoints(idea).map((_, pointIndex) => pointIndex);
        }
      } else {
        selectedViewpoints[String(ideaIndex)] = [];
      }
      const selectedIndexes = [...rootEl.querySelectorAll("[data-writing-idea-select]:checked")]
        .map((node) => Number(node.value))
        .filter((item) => Number.isInteger(item));
      state.topicArticleIdeas[row.id] = { ...current, selectedIndexes, selectedIndex: selectedIndexes[0] ?? -1, selectedViewpoints };
      rerender();
    });
  });
  rootEl.querySelectorAll("[data-writing-viewpoint-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const current = state.topicArticleIdeas[row.id] || {};
      const ideaIndex = Number(input.dataset.writingViewpointIdea);
      const selectedPointIndexes = [...rootEl.querySelectorAll("[data-writing-viewpoint-select]")]
        .filter((node) => Number(node.dataset.writingViewpointIdea) === ideaIndex && node.checked)
        .map((node) => Number(node.value))
        .filter((item) => Number.isInteger(item));
      const selectedViewpoints = {
        ...(current.selectedViewpoints || {}),
        [String(ideaIndex)]: selectedPointIndexes,
      };
      const selectedIndexes = new Set(Array.isArray(current.selectedIndexes) ? current.selectedIndexes.map((item) => Number(item)) : []);
      if (selectedPointIndexes.length) {
        selectedIndexes.add(ideaIndex);
      } else {
        selectedIndexes.delete(ideaIndex);
      }
      state.topicArticleIdeas[row.id] = {
        ...current,
        selectedIndexes: [...selectedIndexes].filter((item) => Number.isInteger(item)),
        selectedIndex: [...selectedIndexes][0] ?? -1,
        selectedViewpoints,
      };
      rerender();
    });
  });
  rootEl.querySelector("[data-refresh-writing-ideas]")?.addEventListener("click", async () => {
    try {
      const ok = await confirmAction({
        title: "刷新推荐选题",
        message: "确认调用大模型重新推荐10个延伸文章选题吗？新的推荐会覆盖当前推荐列表。",
        confirmText: "确认刷新",
      });
      if (!ok) {
        return;
      }
      await requestTopicArticleIdeas(row, { refresh: true, rerender });
    } catch (error) {
      state.topicArticleIdeas[row.id] = { ...(state.topicArticleIdeas[row.id] || {}), loading: false, message: `推荐失败：${error.message}` };
      rerender();
    }
  });
  rootEl.querySelector("[data-generate-writing-article]")?.addEventListener("click", async () => {
    try {
      const ideaState = state.topicArticleIdeas[row.id] || {};
      const selectedIndexes = Array.isArray(ideaState.selectedIndexes)
        ? ideaState.selectedIndexes
        : [];
      const selectedIdeas = selectedIndexes.map((index) => ideaState.ideas?.[Number(index)]).filter(Boolean);
      const ideaLines = selectedIndexes
        .map((index, order) => {
          const idea = ideaState.ideas?.[Number(index)];
          if (!idea) {
            return "";
          }
          const points = selectedViewpointsForIdea(ideaState, Number(index), idea);
          return `${order + 1}. ${idea.title}\n   观点：${points.join("；") || "未选择观点"}`;
        })
        .filter(Boolean)
        .join("\n");
      const ok = await confirmAction({
        title: "生成延伸文章",
        message: `确认基于已选择的 ${selectedIdeas.length} 个选题及其主要观点调用大模型生成完整文章吗？\n\n${ideaLines || "未选择选题"}`,
        confirmText: "确认生成",
      });
      if (!ok) {
        return;
      }
      const articles = await generateArticlesFromSelectedIdeas(row, rerender);
      state.activeGeneratedArticleId = articles[0]?.id || "";
      switchStudyView("generatedArticles");
      renderGeneratedArticlePage();
    } catch (error) {
      state.topicArticleIdeas[row.id] = { ...(state.topicArticleIdeas[row.id] || {}), generating: false, message: `生成失败：${error.message}` };
      rerender();
    }
  });
}

function buildTopicSourceHtml(row, options = {}) {
  const paragraphs = formatOriginalParagraphs(row.doc.rawText || "");
  const keywords = extractTopOriginalKeywords(row);
  const activeKeyword = state.activeOriginalKeyword;
  const keywordHtml = keywords.length
    ? `<div class="original-keywords">${keywords.map((keyword) => `
        <button class="original-keyword${activeKeyword === keyword ? " is-active" : ""}" type="button" data-original-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>
      `).join("")}</div>`
    : "";
  const body = paragraphs.length
    ? paragraphs.map((paragraph) => renderOriginalParagraph(paragraph, activeKeyword)).join("")
    : `<p class="empty-state compact">这篇资料暂时没有可展示的原文。</p>`;
  return `
    <section class="topic-original">
      <h2>${escapeHtml(row.docTitle || row.doc.title || "资料原文")}</h2>
      ${keywordHtml}
      <div class="topic-meta source-meta">
        <span class="pill">资料来源：${escapeHtml(row.source)}</span>
        <span class="pill">资料类型：${escapeHtml(row.type)}</span>
        <span class="pill">最后更新：${escapeHtml(formatDate(row.updatedAt))}</span>
        ${row.doc ? topicSkillPillHtml(row.doc, row.doc.currentSkillVersion || row.doc.analysis?.skillVersion || "", "话题 SKILL") : ""}
      </div>
      <div class="topic-original-body">${body}</div>
      ${options.includeTopicPanel ? `<div class="topic-original-topic-panel">${buildTopicArticleHtml(row.topic, row)}</div>` : ""}
    </section>
  `;
}

function buildMaterialOriginalHtml(doc) {
  const paragraphs = formatOriginalParagraphs(doc.rawText || "");
  const keywords = extractTopMaterialKeywords(doc);
  const activeKeyword = state.activeOriginalKeyword || state.materialListSearch.trim();
  const keywordHtml = keywords.length
    ? `<div class="original-keywords">${keywords.map((keyword) => `
        <button class="original-keyword${activeKeyword === keyword ? " is-active" : ""}" type="button" data-original-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>
      `).join("")}</div>`
    : "";
  const body = paragraphs.length
    ? paragraphs.map((paragraph) => renderOriginalParagraph(paragraph, activeKeyword)).join("")
    : `<p class="empty-state compact">这篇材料暂时没有可展示的原文。</p>`;
  return `
    <section class="topic-original material-original-panel">
      <h2>${escapeHtml(doc.title || doc.fileName || "材料原文")}</h2>
      ${keywordHtml}
      <div class="topic-meta source-meta">
        <span class="pill">材料编号：${escapeHtml(materialDisplayCode(doc))}</span>
        <span class="pill">资料来源：${escapeHtml(materialSourceNameForDoc(doc))}</span>
        <span class="pill">材料类型：${escapeHtml(materialTypeNameForDoc(doc))}</span>
        <span class="pill">最后更新：${escapeHtml(formatDate(doc.lastStudiedAt || doc.updatedAt || doc.createdAt))}</span>
        ${topicSkillPillHtml(doc, doc.currentSkillVersion || doc.analysis?.skillVersion || "", "最后 SKILL")}
      </div>
      <div class="topic-original-body">${body}</div>
    </section>
  `;
}

function compactText(value, fallback = "未提及") {
  if (Array.isArray(value)) {
    return value.map((item) => compactText(item, "")).filter(Boolean).join("；") || fallback;
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}：${compactText(item, "")}`)
      .filter(Boolean)
      .join("；") || fallback;
  }
  return String(value || "").trim() || fallback;
}

function createMindNode(id, title, content, children = [], meta = {}) {
  return {
    ...meta,
    id,
    title: String(title || "未命名节点"),
    content: compactText(content),
    children: children.filter(Boolean),
  };
}

function mindMapNodeLabel(node) {
  const title = String(node?.title || "未命名节点").trim();
  if (!node || node.id === "root") {
    return title;
  }
  const content = String(node.content || "")
    .replace(/\s+/g, " ")
    .replace(/^未提及$/, "")
    .trim();
  if (!content) {
    return title;
  }
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleaned = content
    .replace(new RegExp(`^${escapedTitle}[：:；;，,。\\s-]*`), "")
    .replace(/^(说明|内容|摘要|详情|背景|步骤|核心观点|详细展开)[：:]\s*/, "")
    .trim();
  const segment = cleaned
    .split(/[。！？!?；;\n]/)
    .map((item) => item.trim())
    .find((item) => item && item !== "未提及");
  return segment ? `${title}：${compactText(segment).slice(0, 46)}` : title;
}

function buildTrainingMindMap(topic) {
  const trainingTopic = normalizeTrainingTopic(topic.trainingTopic || topic) || {};
  return createMindNode("root", topic.title || trainingTopic.learningQuestion || trainingTopic.knowledgeName || "培训话题", trainingTopic.coreViewpoint || trainingTopic.detailedExplanation || topic.sourceSummary, [
    createMindNode("knowledge", "知识点/概念", [
      `知识点名称：${trainingTopic.knowledgeName || topic.title || "未提及"}`,
      `知识点类型：${trainingTopic.knowledgeType || "知识点"}`,
      `学习问题：${trainingTopic.learningQuestion || topic.title || "未提及"}`,
      `核心观点：${trainingTopic.coreViewpoint || "未提及"}`,
      `老师怎么讲：${trainingTopic.teacherExplanation || "未提及"}`,
      `详细展开：${trainingTopic.detailedExplanation || trainingTopic.teacherExplanation || "未提及"}`,
    ]),
    createMindNode("scenarios", "讲解场景", "老师在培训中使用的具体场景。", (trainingTopic.scenarios || []).map((scenario, index) => createMindNode(`scenario-${index}`, scenario.name || `讲解场景${index + 1}`, [
      `场景语境：${scenario.context || "未提及"}`,
      `老师怎么讲：${scenario.teacherExplanation || "未提及"}`,
      `场景展开：${scenario.detailedExpansion || scenario.teacherExplanation || "未提及"}`,
      `适用条件：${scenario.applicability || "未提及"}`,
      `原文依据：${scenario.evidence || "未提及"}`,
    ]))),
    createMindNode("attention", "注意问题", "学习和应用时需要避开的误区、风险和边界。", (trainingTopic.attentionPoints || []).map((point, index) => createMindNode(`attention-${index}`, point.issue || `注意问题${index + 1}`, [
      `为什么要注意：${point.whyItMatters || "未提及"}`,
      `详细分析：${point.detailedAnalysis || point.whyItMatters || "未提及"}`,
      `纠偏方式：${point.correction || "未提及"}`,
      `原文依据：${point.evidence || "未提及"}`,
    ]))),
    createMindNode("extensions", "知识体系延伸", "基于原文知识点继续向行业案例、关联知识和迁移场景展开。", (trainingTopic.extensions || []).map((extension, index) => createMindNode(`extension-${index}`, extension.title || `知识延伸${index + 1}`, [
      `行业案例：${extension.industryCase || "未提及"}`,
      `扩展说明：${extension.detailedExpansion || extension.industryCase || "未提及"}`,
      `关联知识：${extension.relatedKnowledge || "未提及"}`,
      `迁移场景：${extension.transferScenario || "未提及"}`,
      `学习建议：${extension.learningSuggestion || "未提及"}`,
    ]))),
    createMindNode("practice", "练习任务", [
      `任务：${trainingTopic.practice?.task || "未提及"}`,
      `操作步骤：${compactText(trainingTopic.practice?.steps)}`,
      `检验标准：${compactText(trainingTopic.practice?.checkpoints)}`,
    ]),
    createMindNode("logic", "整体逻辑与收获", [
      `整体逻辑：${trainingTopic.logicSummary || "未提及"}`,
      `学习者收获：${trainingTopic.learnerTakeaway || "未提及"}`,
    ]),
  ]);
}

function buildStandardMindMap(topic) {
  const fallbackCategory = topic.category || categoryDefs.find((item) => item.name === topic.categoryName) || categoryDefs[0];
  const evidence = Array.isArray(topic.evidence) ? topic.evidence : [];
  const deepNature = Array.isArray(topic.deepNature) && topic.deepNature.length ? topic.deepNature : buildDeepNature(fallbackCategory, evidence);
  const ceoSolution = topic.ceoSolution && Object.keys(topic.ceoSolution).length ? topic.ceoSolution : buildCeoSolution(evidence, fallbackCategory);
  const theoryAnchors = topic.theoryAnchors && Object.keys(topic.theoryAnchors).length ? topic.theoryAnchors : buildTheoryAnchors(fallbackCategory, evidence);
  const caseComparison = topic.caseComparison && Object.keys(topic.caseComparison).length ? topic.caseComparison : buildCaseComparison(fallbackCategory);
  const moreSolutions = Array.isArray(topic.moreSolutions) && topic.moreSolutions.length ? topic.moreSolutions : buildMoreSolutions(fallbackCategory);
  const transferableInsights = topic.transferableInsights && Object.keys(topic.transferableInsights).length ? topic.transferableInsights : buildTransferableInsights(fallbackCategory, evidence);
  return createMindNode("root", topic.title || "话题文章", topic.problemEssence || topic.essence || topic.sourceSummary, [
    createMindNode("source", "话题来源", [topic.sourceSummary || buildTopicSourceSummary(evidence, fallbackCategory), ...evidence]),
    createMindNode("essence", "问题实质", topic.problemEssence || topic.essence || fallbackCategory.essence),
    createMindNode("surface", "表面现象", topic.surfacePhenomenon || buildSurfacePhenomenon(evidence, fallbackCategory)),
    createMindNode("deep", "深层本质", "从不同维度解释问题为什么成立。", deepNature.map((item, index) => createMindNode(`deep-${index}`, item.title || `维度${index + 1}`, [item.explanation, item.case]))),
    createMindNode("solution", "CEO 解法与关键动作", "把判断落到动作、验证和持续改进。", [
      createMindNode("solution-core", "核心判断", ceoSolution.coreJudgment),
      createMindNode("solution-verify", "验证方法", ceoSolution.verificationMethods),
      createMindNode("solution-action", "关键行动", ceoSolution.keyActions),
    ]),
    createMindNode("theory", "底层逻辑", "关联理论模型和逻辑拆解。", [
      createMindNode("theory-model", "关联理论/模型", theoryAnchors.linkedTheoryModel),
      createMindNode("theory-logic", "逻辑拆解", theoryAnchors.logicDissection),
    ]),
    createMindNode("case", "案例对照", [
      `反例：${caseComparison.counterexample || "未提及"}`,
      `正例：${caseComparison.positiveExample || "未提及"}`,
      `历史类比：${caseComparison.historicalAnalogy || "未提及"}`,
    ]),
    createMindNode("more", "更多解法与选择", "可以替换或补充的实践路径。", moreSolutions.map((solution, index) => createMindNode(`more-${index}`, solution.title || `解法${index + 1}`, [
      `步骤：${compactText(solution.steps)}`,
      `适用场景：${solution.applicability || "未提及"}`,
    ]))),
    createMindNode("insight", "可迁移启示", [
      `对团队的启示：${transferableInsights.team || "未提及"}`,
      `对读者的行动建议：${transferableInsights.reader || "未提及"}`,
    ]),
  ]);
}

function buildMindMapData(topic, row = null) {
  const rowTypeKind = row?.doc ? materialTypeKind(materialTypeIdForDoc(row.doc), materialTypeNameForDoc(row.doc)) : "";
  return rowTypeKind === "training" || topic?.trainingTopic
    ? buildTrainingMindMap(topic)
    : buildStandardMindMap(topic);
}

function extractExecutiveCaseScenes(text = "") {
  const source = String(text || "");
  const regex = /(^|\n)\s*案例\s*([一二三四五六七八九十百千万\d]+)\s*[：:]\s*([^\n]+)/g;
  const scenes = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    const rawNo = String(match[2] || "").trim();
    scenes.push({
      caseNo: rawNo,
      caseTitle: String(match[3] || "").trim(),
    });
  }
  return scenes;
}

function topicIndexForCaseScene(topics = [], caseNo = "") {
  const escaped = String(caseNo || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escaped) {
    return -1;
  }
  const regex = new RegExp(`案例\\s*${escaped}(?!\\d)`, "i");
  return topics.findIndex((topic) => {
    const text = [
      topic.title,
      topic.sourceSummary,
      topic.surfacePhenomenon,
      ...(Array.isArray(topic.evidence) ? topic.evidence : []),
    ].filter(Boolean).join(" ");
    return regex.test(text);
  });
}

function buildMaterialMindMapData(doc, analysis) {
  const topics = Array.isArray(analysis?.topics) ? analysis.topics : [];
  const categories = Array.isArray(analysis?.activeCategories) ? analysis.activeCategories : [];
  const caseScenes = extractExecutiveCaseScenes(doc?.rawText || analysis?.text || "");
  const topicNodes = topics.map((topic, index) => createMindNode(
    `topic-${index}`,
    topic.title || `话题${index + 1}`,
    [
      `话题来源：${topic.sourceSummary || "未提及"}`,
      `核心问题：${topic.problemEssence || topic.essence || topic.trainingTopic?.coreViewpoint || "未提及"}`,
      `话题标签：${normalizeProblemTypes(topic.problemTypes, topic.categoryName, topic.category?.name).join(" / ")}`,
    ],
    [],
    { topicIndex: index },
  ));
  const caseNodes = caseScenes.map((scene, index) => {
    const topicIndex = topicIndexForCaseScene(topics, scene.caseNo);
    const topic = topicIndex >= 0 ? topics[topicIndex] : null;
    return createMindNode(
      `case-${index}`,
      `案例${scene.caseNo}：${scene.caseTitle}`,
      [
        `案例场景：${scene.caseTitle}`,
        topic ? `关联话题：${topic.title}` : "关联话题：暂未匹配到对应话题，可先刷新到最新 SKILL 重新拆解。",
        topic ? `核心问题：${topic.problemEssence || topic.essence || "未提及"}` : "",
      ],
      [],
      topic ? { topicIndex } : {},
    );
  });
  const categoryNodes = categories.slice(0, 8).map((group, index) => createMindNode(
    `category-${index}`,
    group.category?.name || `主题${index + 1}`,
    `该主题下识别到 ${group.items?.length || 0} 条关键表达。`,
    (group.items || []).slice(0, 4).map((item, itemIndex) => createMindNode(
      `category-${index}-${itemIndex}`,
      `关键表达${itemIndex + 1}`,
      item.text || item,
    )),
  ));
  const quoteNodes = (analysis?.quotes || []).slice(0, 6).map((quote, index) => createMindNode(
    `quote-${index}`,
    `金句${index + 1}`,
    quote,
  ));
  return createMindNode(doc?.id || "material-root", doc?.title || doc?.fileName || "整篇材料", [
    `一句话概括：${analysis?.overview?.oneLine || "未提及"}`,
    `逻辑主线：${analysis?.overview?.logicLine || "未提及"}`,
    `材料规模：${analysis?.overview?.wordCount || 0} 字，${topics.length} 个话题${caseScenes.length ? `，${caseScenes.length} 个案例场景` : ""}`,
  ], [
    createMindNode("material-overview", "全文主线", [
      `一句话概括：${analysis?.overview?.oneLine || "未提及"}`,
      `逻辑主线：${analysis?.overview?.logicLine || "未提及"}`,
    ]),
    caseNodes.length ? createMindNode("material-cases", "案例场景", `全文识别到 ${caseNodes.length} 个独立案例场景。`, caseNodes) : null,
    createMindNode("material-topics", "话题地图", `全文拆解出 ${topics.length} 个可学习话题，点击具体话题可穿透查看。`, topicNodes),
    categoryNodes.length ? createMindNode("material-categories", "主题分类", "按原文观点和话题类型归纳全文主题。", categoryNodes) : null,
    quoteNodes.length ? createMindNode("material-quotes", "金句标签", "原文中值得反复学习的关键表达。", quoteNodes) : null,
  ]);
}

function flattenMindMapNodes(root) {
  const nodes = [];
  const visit = (node, parent = null) => {
    nodes.push({
      ...node,
      parentId: parent?.id || "",
      parentTitle: parent?.title || "",
    });
    (node.children || []).forEach((child) => visit(child, node));
  };
  visit(root);
  return nodes;
}

function layoutMindMap(root) {
  const collapsed = new Set(state.mindMapCollapsedNodeIds || []);
  const nodes = [];
  const edges = [];
  const nodeWidth = 214;
  const nodeHeight = 58;
  const depthGap = 258;
  const rowGap = 78;
  let leafIndex = 0;
  let maxDepth = 0;
  const place = (node, depth, parent = null) => {
    maxDepth = Math.max(maxDepth, depth);
    const children = collapsed.has(node.id) ? [] : (node.children || []);
    const positionedChildren = children.map((child) => place(child, depth + 1, node));
    const y = positionedChildren.length
      ? positionedChildren.reduce((sum, child) => sum + child.y, 0) / positionedChildren.length
      : 48 + (leafIndex++ * rowGap);
    const positioned = {
      ...node,
      x: 28 + (depth * depthGap),
      y,
      width: nodeWidth,
      height: nodeHeight,
      depth,
      parentId: parent?.id || "",
      parentTitle: parent?.title || "",
      hasChildren: Boolean((node.children || []).length),
      collapsed: collapsed.has(node.id),
    };
    nodes.push(positioned);
    if (parent) {
      edges.push({ from: parent.id, to: node.id });
    }
    return positioned;
  };
  place(root, 0);
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));
  return {
    nodes,
    edges: edges.map((edge) => ({ from: nodeById[edge.from], to: nodeById[edge.to] })).filter((edge) => edge.from && edge.to),
    width: Math.max(860, 80 + ((maxDepth + 1) * depthGap) + nodeWidth),
    height: Math.max(320, 96 + Math.max(1, leafIndex) * rowGap),
  };
}

function svgTextLines(text, maxChars = 10, maxLines = 2) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  const lines = [];
  for (let index = 0; index < source.length && lines.length < maxLines; index += maxChars) {
    lines.push(source.slice(index, index + maxChars));
  }
  if (source.length > maxChars * maxLines && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, Math.max(1, maxChars - 1))}...`;
  }
  return lines.length ? lines : ["未命名"];
}

function buildMindMapSvg(layout, selectedId) {
  const nodeHtml = layout.nodes.map((node) => {
    const selected = node.id === selectedId;
    const fill = node.depth === 0 ? "#2f8f8a" : selected ? "#fff7e8" : "#ffffff";
    const stroke = selected ? "#d58a24" : node.depth === 0 ? "#2f8f8a" : "#cbd7df";
    const textColor = node.depth === 0 ? "#ffffff" : "#223142";
    const lines = svgTextLines(mindMapNodeLabel(node), 13, 3).map((line, index) => `<tspan x="${node.x + 12}" y="${node.y + 17 + index * 14}">${escapeHtml(line)}</tspan>`).join("");
    return `
      <g class="mind-map-node${selected ? " is-selected" : ""}" data-mind-node="${escapeHtml(node.id)}" data-mind-depth="${escapeHtml(String(node.depth))}" role="button" tabindex="0">
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="${selected ? 2 : 1.2}"></rect>
        <text fill="${textColor}" font-size="11" font-weight="700">${lines}</text>
        ${node.hasChildren ? `
          <g class="mind-map-collapse" data-mind-collapse="${escapeHtml(node.id)}">
            <circle cx="${node.x + node.width - 14}" cy="${node.y + 14}" r="8" fill="${node.collapsed ? "#f2f6f8" : "#e8f4f3"}" stroke="${stroke}"></circle>
            <text x="${node.x + node.width - 14}" y="${node.y + 18}" text-anchor="middle" fill="#233142" font-size="13" font-weight="800">${node.collapsed ? "+" : "-"}</text>
          </g>
        ` : ""}
      </g>
    `;
  }).join("");
  const edgeHtml = layout.edges.map((edge) => {
    const startX = edge.from.x + edge.from.width;
    const startY = edge.from.y + edge.from.height / 2;
    const endX = edge.to.x;
    const endY = edge.to.y + edge.to.height / 2;
    const midX = (startX + endX) / 2;
    return `<path d="M${startX} ${startY} C${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}" fill="none" stroke="#9fb4bf" stroke-width="1.6"></path>`;
  }).join("");
  return `<svg class="knowledge-map-svg" viewBox="0 0 ${layout.width} ${layout.height}" width="${layout.width}" height="${layout.height}" role="img" aria-label="知识脑图">${edgeHtml}${nodeHtml}</svg>`;
}

function buildMindMapDetailHtml(root, selectedId) {
  const allNodes = flattenMindMapNodes(root);
  const selected = allNodes.find((node) => node.id === selectedId) || allNodes[0] || root;
  const parent = selected.parentId ? allNodes.find((node) => node.id === selected.parentId) : null;
  const hasLinkedTopic = selected.topicIndex !== undefined && selected.topicIndex !== null;
  return `
    <div class="knowledge-map-parent-row">
      ${parent ? `<button class="knowledge-map-parent-link" type="button" data-mind-node="${escapeHtml(parent.id)}" title="查看上一级：${escapeHtml(parent.title)}">${escapeHtml(parent.title)}</button>` : `<span class="section-kicker">知识脑图</span>`}
    </div>
    <h4>${escapeHtml(selected.title)}</h4>
    <p>${escapeHtml(selected.content || "暂无节点内容。")}</p>
    ${hasLinkedTopic ? `
      <div class="knowledge-map-node-actions">
        <button class="mini-button" type="button" data-mind-topic-analysis="${escapeHtml(String(selected.topicIndex))}">查看话题解析</button>
      </div>
    ` : ""}
    ${(selected.children || []).length ? `<div class="knowledge-map-child-list"><strong>子节点</strong>${selected.children.map((child) => `<button type="button" data-mind-node="${escapeHtml(child.id)}">${escapeHtml(mindMapNodeLabel(child))}</button>`).join("")}</div>` : ""}
  `;
}

function buildMindMapShellHtml(root, label = "Knowledge Map") {
  const allNodes = flattenMindMapNodes(root);
  const selectedId = allNodes.some((node) => node.id === state.mindMapSelectedNodeId) ? state.mindMapSelectedNodeId : root.id;
  const layout = layoutMindMap(root);
  const zoom = Math.max(0.6, Math.min(1.8, Number(state.mindMapZoom || 1)));
  return `
    <section class="knowledge-map${state.mindMapFullscreen ? " is-fullscreen" : ""}" data-mind-map>
      <div class="knowledge-map-toolbar">
        <div>
          <p class="section-kicker">${escapeHtml(label)}</p>
          <h3>${escapeHtml(root.title)}</h3>
        </div>
        <div class="knowledge-map-actions">
          <span class="knowledge-map-action-group">
            <button class="mini-button" type="button" data-mind-zoom="out">缩小</button>
            <span>${escapeHtml(String(Math.round(zoom * 100)))}%</span>
            <button class="mini-button" type="button" data-mind-zoom="in">放大</button>
          </span>
          <span class="knowledge-map-action-group knowledge-map-view-actions">
            <button class="mini-button mind-map-utility-button" type="button" data-mind-reset>重置</button>
            <button class="mini-button mind-map-utility-button" type="button" data-mind-fullscreen>${state.mindMapFullscreen ? "退出全页面" : "全页面"}</button>
          </span>
          <span class="knowledge-map-action-group knowledge-map-export-actions">
            <button class="mini-button" type="button" data-mind-export="png">导出图片</button>
            <button class="mini-button" type="button" data-mind-export="pdf">导出 PDF</button>
          </span>
        </div>
      </div>
      <div class="knowledge-map-layout">
        <div class="knowledge-map-canvas" data-mind-canvas style="--mind-map-zoom:${zoom};">
          ${buildMindMapSvg(layout, selectedId)}
        </div>
        <aside class="knowledge-map-detail" data-mind-detail>
          ${buildMindMapDetailHtml(root, selectedId)}
        </aside>
      </div>
    </section>
  `;
}

function buildMindMapHtml(topic, row = null) {
  return buildMindMapShellHtml(buildMindMapData(topic, row), "Topic Knowledge Map");
}

function buildMaterialMindMapHtml(doc, analysis) {
  return buildMindMapShellHtml(buildMaterialMindMapData(doc, analysis), "Article Knowledge Map");
}

function bindMindMapInteractions(rootEl, rerender, topic = null, row = null, rootOverride = null) {
  const mindRoot = rootOverride || (topic ? buildMindMapData(topic, row) : null);
  const bindTopicActionButtons = () => {
    rootEl.querySelectorAll("[data-mind-topic-analysis]").forEach((button) => {
      if (button.dataset.mindTopicBound === "true") {
        return;
      }
      button.dataset.mindTopicBound = "true";
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const topicIndex = Number(button.dataset.mindTopicAnalysis ?? 0);
        state.activeMaterialTopicIndex = topicIndex;
        state.activeMaterialPane = "topics";
        state.mindMapSelectedNodeId = "";
        state.mindMapCollapsedNodeIds = [];
        rerender();
      });
    });
  };
  const selectNode = (nodeId) => {
    state.mindMapSelectedNodeId = nodeId;
    if (!mindRoot) {
      rerender();
      return;
    }
    const allNodes = flattenMindMapNodes(mindRoot);
    if (!allNodes.some((item) => item.id === nodeId)) {
      rerender();
      return;
    }
    updateMindMapSelection(rootEl, mindRoot, nodeId);
    bindNodeButtons();
    bindTopicActionButtons();
  };
  const bindNodeButtons = () => {
    rootEl.querySelectorAll("[data-mind-node]").forEach((node) => {
      if (node.dataset.mindNodeBound === "true") {
        return;
      }
      node.dataset.mindNodeBound = "true";
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        selectNode(node.dataset.mindNode);
      });
    });
  };
  bindNodeButtons();
  bindTopicActionButtons();
  rootEl.querySelectorAll("[data-mind-collapse]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      const collapsed = new Set(state.mindMapCollapsedNodeIds || []);
      if (collapsed.has(node.dataset.mindCollapse)) {
        collapsed.delete(node.dataset.mindCollapse);
      } else {
        collapsed.add(node.dataset.mindCollapse);
      }
      state.mindMapCollapsedNodeIds = [...collapsed];
      state.mindMapSelectedNodeId = node.dataset.mindCollapse;
      rerender();
    });
  });
  rootEl.querySelectorAll("[data-mind-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = Number(state.mindMapZoom || 1) + (button.dataset.mindZoom === "in" ? 0.15 : -0.15);
      state.mindMapZoom = Math.max(0.6, Math.min(1.8, Number(next.toFixed(2))));
      rerender();
    });
  });
  rootEl.querySelector("[data-mind-reset]")?.addEventListener("click", () => {
    state.mindMapZoom = 1;
    state.mindMapCollapsedNodeIds = [];
    state.mindMapSelectedNodeId = "";
    rerender();
  });
  rootEl.querySelector("[data-mind-fullscreen]")?.addEventListener("click", () => {
    state.mindMapFullscreen = !state.mindMapFullscreen;
    rerender();
  });
  rootEl.querySelectorAll("[data-mind-export]").forEach((button) => {
    button.addEventListener("click", () => exportMindMap(rootEl.querySelector("[data-mind-map]"), button.dataset.mindExport));
  });
}

function updateMindMapSelection(rootEl, root, selectedId) {
  rootEl.querySelectorAll(".mind-map-node[data-mind-node]").forEach((node) => {
    const isSelected = node.dataset.mindNode === selectedId;
    const isRoot = node.dataset.mindDepth === "0";
    node.classList.toggle("is-selected", isSelected);
    const rect = node.querySelector("rect");
    if (rect) {
      rect.setAttribute("fill", isRoot ? "#2f8f8a" : isSelected ? "#fff7e8" : "#ffffff");
      rect.setAttribute("stroke", isSelected ? "#d58a24" : isRoot ? "#2f8f8a" : "#cbd7df");
      rect.setAttribute("stroke-width", isSelected ? "2" : "1.2");
    }
  });
  const detail = rootEl.querySelector("[data-mind-detail]");
  if (detail) {
    detail.innerHTML = buildMindMapDetailHtml(root, selectedId);
  }
}

async function saveBlobFile(blob, filename, mimeType) {
  const extension = filename.includes(".") ? `.${filename.split(".").pop()}` : "";
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: filename, accept: { [mimeType]: [extension] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function dataUrlToBytes(dataUrl) {
  const base64 = String(dataUrl).split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function createMindMapPdfBlob(canvas) {
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const imageBytes = dataUrlToBytes(jpegDataUrl);
  const pageWidth = Math.min(14400, Math.max(842, Math.round(canvas.width * 0.72)));
  const pageHeight = Math.min(14400, Math.max(595, Math.round(canvas.height * 0.72)));
  const margin = 24;
  const scale = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height);
  const drawWidth = Math.round(canvas.width * scale);
  const drawHeight = Math.round(canvas.height * scale);
  const drawX = Math.round((pageWidth - drawWidth) / 2);
  const drawY = Math.round((pageHeight - drawHeight) / 2);
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let offset = 0;
  const appendString = (value) => {
    const bytes = encoder.encode(value);
    parts.push(bytes);
    offset += bytes.length;
  };
  const appendBytes = (bytes) => {
    parts.push(bytes);
    offset += bytes.length;
  };
  const beginObject = (id) => {
    offsets[id] = offset;
    appendString(`${id} 0 obj\n`);
  };
  appendString("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  beginObject(1);
  appendString("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  beginObject(2);
  appendString("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
  beginObject(3);
  appendString(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  beginObject(4);
  appendString(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
  appendBytes(imageBytes);
  appendString("\nendstream\nendobj\n");
  const content = `q\n${drawWidth} 0 0 ${drawHeight} ${drawX} ${drawY} cm\n/Im0 Do\nQ\n`;
  beginObject(5);
  appendString(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`);
  const xrefOffset = offset;
  appendString("xref\n0 6\n0000000000 65535 f \n");
  for (let id = 1; id <= 5; id += 1) {
    appendString(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  appendString(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(parts, { type: "application/pdf" });
}

function exportMindMap(mapEl, format = "png") {
  const svg = mapEl?.querySelector(".knowledge-map-svg");
  if (!svg) {
    return;
  }
  const clone = svg.cloneNode(true);
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", clone.getAttribute("width") || "1200");
  background.setAttribute("height", clone.getAttribute("height") || "800");
  background.setAttribute("fill", "#ffffff");
  clone.insertBefore(background, clone.firstChild);
  const svgText = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || Number(clone.getAttribute("width")) || 1200;
    canvas.height = image.naturalHeight || Number(clone.getAttribute("height")) || 800;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    if (format === "pdf") {
      await saveBlobFile(createMindMapPdfBlob(canvas), "knowledge-map.pdf", "application/pdf");
      return;
    }
    canvas.toBlob(async (pngBlob) => {
      if (pngBlob) {
        await saveBlobFile(pngBlob, "knowledge-map.png", "image/png");
      }
    }, "image/png");
  };
  image.src = url;
}

function buildMeetingAnalysisHtml(meetingAnalysis) {
  if (!meetingAnalysis) {
    return `<p class="empty-state compact">这份材料没有提炼出会议纪要分析内容。</p>`;
  }
  const info = meetingAnalysis.meetingInfo || {};
  const cellText = (value) => {
    if (Array.isArray(value)) {
      return value.map(cellText).filter(Boolean).join("；");
    }
    if (value && typeof value === "object") {
      return Object.entries(value)
        .map(([key, item]) => `${key}：${cellText(item)}`)
        .filter(Boolean)
        .join("；");
    }
    return String(value || "").trim();
  };
  const joinList = (items) => (Array.isArray(items) && items.length ? items.map(cellText).filter(Boolean).join("；") : "");
  const tableRows = (rows, cols) => rows.length
    ? `<table class="meeting-mini-table"><thead><tr>${cols.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cellText(cell) || "未提及")}</td>`).join("")}</tr>`).join("")}</tbody></table>`
    : `<p class="muted-text">未提及</p>`;
  return `
    <section class="meeting-analysis">
      <article class="article-section meeting-section meeting-section-info">
        <h3>会议基础信息</h3>
        <div class="meeting-info-grid">
          <p><strong>会议主题：</strong>${escapeHtml(info.topic || "未提及")}</p>
          <p><strong>会议目标：</strong>${escapeHtml(info.goal || "未提及")}</p>
          <p><strong>会议时间：</strong>${escapeHtml(info.time || "未知")}</p>
          <p><strong>会议时长：</strong>${escapeHtml(info.duration || "未知")}</p>
          <p><strong>参会人：</strong>${escapeHtml(joinList(info.participants) || "未提及")}</p>
          <p><strong>缺席人：</strong>${escapeHtml(joinList(info.absentees) || "未提及")}</p>
          <p><strong>主持人：</strong>${escapeHtml(info.host || "未提及")}</p>
          <p><strong>记录人：</strong>${escapeHtml(info.recorder || "未提及")}</p>
        </div>
      </article>
      <article class="article-section meeting-section meeting-section-decisions">
        <h3>决策清单</h3>
        ${tableRows((meetingAnalysis.decisions || []).map((item, index) => [String(item.index || index + 1), item.issue, item.decision, item.reason]), ["序号", "议题", "决定内容", "依据/理由"])}
      </article>
      <article class="article-section meeting-section meeting-section-actions">
        <h3>行动项清单</h3>
        ${tableRows((meetingAnalysis.actionItems || []).map((item, index) => [String(item.index || index + 1), item.action, item.owner, item.deadline, item.source]), ["序号", "行动内容", "负责人", "截止日期", "来源"])}
      </article>
      <article class="article-section meeting-section meeting-section-discussion">
        <h3>议题讨论摘要</h3>
        ${(meetingAnalysis.discussionSummary || []).length ? meetingAnalysis.discussionSummary.map((item) => `
          <div class="meeting-sub-block">
            <h4>${escapeHtml(item.issue || "议题")}</h4>
            <p><strong>背景：</strong>${escapeHtml(item.background || "未提及")}</p>
            <p><strong>关键观点：</strong>${escapeHtml(joinList(item.keyViews) || "未提及")}</p>
            <p><strong>分歧点：</strong>${escapeHtml(item.divergences || "未提及")}</p>
            <p><strong>结论/走向：</strong>${escapeHtml(item.conclusion || "未提及")}</p>
          </div>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </article>
      <article class="article-section meeting-section meeting-section-collaboration">
        <h3>情感与协作态势</h3>
        <p><strong>整体氛围：</strong>${escapeHtml(meetingAnalysis.collaboration?.mood || "未提及")}</p>
        <p><strong>态度分布：</strong>${escapeHtml(joinList(meetingAnalysis.collaboration?.attitudeDistribution) || "未提及")}</p>
        <p><strong>关键冲突点：</strong>${escapeHtml(joinList(meetingAnalysis.collaboration?.conflictPoints) || "未提及")}</p>
        <p><strong>虚假同意：</strong>${escapeHtml(joinList(meetingAnalysis.collaboration?.falseConsensus) || "未提及")}</p>
      </article>
      <article class="article-section meeting-section meeting-section-risks">
        <h3>风险与依赖</h3>
        <p><strong>明确风险：</strong>${escapeHtml(joinList(meetingAnalysis.risksAndDependencies?.explicitRisks) || "未提及")}</p>
        <p><strong>隐含风险：</strong>${escapeHtml(joinList(meetingAnalysis.risksAndDependencies?.implicitRisks) || "未提及")}</p>
        <p><strong>外部/跨部门依赖：</strong>${escapeHtml(joinList(meetingAnalysis.risksAndDependencies?.dependencies) || "未提及")}</p>
        <p><strong>信息缺失：</strong>${escapeHtml(joinList(meetingAnalysis.risksAndDependencies?.missingInfo) || "未提及")}</p>
      </article>
      <article class="article-section meeting-section meeting-section-pending">
        <h3>待定问题</h3>
        ${(meetingAnalysis.pendingQuestions || []).length ? meetingAnalysis.pendingQuestions.map((item) => `
          <div class="meeting-sub-block">
            <p><strong>问题：</strong>${escapeHtml(item.question || "未提及")}</p>
            <p><strong>当前状态：</strong>${escapeHtml(item.status || "未提及")}</p>
            <p><strong>跟进建议：</strong>${escapeHtml(item.followUp || "未提及")}</p>
          </div>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </article>
      ${meetingAnalysis.topicExtractionNote ? `
        <article class="article-section meeting-section meeting-section-note">
          <h3>可提炼话题说明</h3>
          <p>${escapeHtml(meetingAnalysis.topicExtractionNote)}</p>
        </article>
      ` : ""}
    </section>
  `;
}

function buildTrainingAnalysisHtml(trainingAnalysis, doc = null, skillVersion = "") {
  if (!trainingAnalysis) {
    return `<p class="empty-state compact">这份材料没有提炼出培训分析内容。</p>`;
  }
  const info = trainingAnalysis.trainingInfo || {};
  const cellText = (value) => {
    if (Array.isArray(value)) {
      return value.map(cellText).filter(Boolean).join("；");
    }
    if (value && typeof value === "object") {
      return Object.entries(value)
        .map(([key, item]) => `${key}：${cellText(item)}`)
        .filter(Boolean)
        .join("；");
    }
    return String(value || "").trim();
  };
  const listText = (items) => (Array.isArray(items) && items.length ? items.map(cellText).filter(Boolean).join("；") : "");
  const listHtml = (items) => Array.isArray(items) && items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(cellText(item) || "未提及")}</li>`).join("")}</ul>`
    : `<p class="muted-text">未提及</p>`;
  const knowledgeItems = Array.isArray(trainingAnalysis.knowledgeItems) ? trainingAnalysis.knowledgeItems : [];
  const logic = trainingAnalysis.overallLogic || {};
  return `
    <section class="meeting-analysis training-analysis">
      <article class="article-section meeting-section training-section-info">
        <h3>培训基础信息</h3>
        <div class="meeting-info-grid">
          <p><strong>培训主题：</strong>${escapeHtml(info.topic || "未提及")}</p>
          <p><strong>培训类型：</strong>${escapeHtml(info.trainingType || "未提及")}</p>
          <p><strong>目标学员：</strong>${escapeHtml(info.targetAudience || "未提及")}</p>
          <p><strong>讲师/来源：</strong>${escapeHtml(info.trainer || "未提及")}</p>
          <p><strong>培训时长：</strong>${escapeHtml(info.duration || "未知")}</p>
          <p><strong>前置基础：</strong>${escapeHtml(info.prerequisites || "未提及")}</p>
        </div>
      </article>
      <article class="article-section meeting-section training-section-concepts">
        <h3>知识点与概念拆解</h3>
        ${knowledgeItems.length ? knowledgeItems.map((item, index) => `
          <section class="training-knowledge-card">
            <div class="training-knowledge-head">
              <span>${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <div>
                <strong>${escapeHtml(item.name || "未命名知识点")}</strong>
                <small>${escapeHtml(item.type || "知识点")}</small>
              </div>
            </div>
            <div class="training-knowledge-summary">
              <p><strong>核心观点：</strong>${escapeHtml(item.coreViewpoint || "未提及")}</p>
              <p><strong>老师原文解释：</strong>${escapeHtml(item.originalExplanation || "未提及")}</p>
              <p><strong>详细展开：</strong>${escapeHtml(item.detailedExplanation || item.originalExplanation || "未提及")}</p>
              <p><strong>为什么重要：</strong>${escapeHtml(item.whyImportant || "未提及")}</p>
              <p><strong>原文依据：</strong>${escapeHtml(listText(item.evidence) || "未提及")}</p>
            </div>
            <div class="training-knowledge-grid">
              <div class="training-mini-block training-mini-scenarios">
                <h4>讲解场景</h4>
                ${(item.scenarios || []).length ? item.scenarios.map((scenario) => `
                  <div class="training-mini-item">
                    <strong>${escapeHtml(scenario.name || "讲解场景")}</strong>
                    <p><b>场景语境：</b>${escapeHtml(scenario.context || "未提及")}</p>
                    <p><b>老师怎么讲：</b>${escapeHtml(scenario.teacherExplanation || "未提及")}</p>
                    <p><b>场景展开：</b>${escapeHtml(scenario.detailedExpansion || scenario.teacherExplanation || "未提及")}</p>
                    <p><b>适用条件：</b>${escapeHtml(scenario.applicability || "未提及")}</p>
                    <p><b>原文依据：</b>${escapeHtml(scenario.evidence || "未提及")}</p>
                  </div>
                `).join("") : `<p class="muted-text">未提及</p>`}
              </div>
              <div class="training-mini-block training-mini-attention">
                <h4>注意问题</h4>
                ${(item.attentionPoints || []).length ? item.attentionPoints.map((point) => `
                  <div class="training-mini-item">
                    <strong>${escapeHtml(point.issue || "注意问题")}</strong>
                    <p><b>为什么要注意：</b>${escapeHtml(point.whyItMatters || "未提及")}</p>
                    <p><b>详细分析：</b>${escapeHtml(point.detailedAnalysis || point.whyItMatters || "未提及")}</p>
                    <p><b>纠偏方式：</b>${escapeHtml(point.correction || "未提及")}</p>
                    <p><b>原文依据：</b>${escapeHtml(point.evidence || "未提及")}</p>
                  </div>
                `).join("") : `<p class="muted-text">未提及</p>`}
              </div>
              <div class="training-mini-block training-mini-extension">
                <h4>知识体系延伸</h4>
                ${(item.extensions || []).length ? item.extensions.map((extension) => `
                  <div class="training-mini-item">
                    <strong>${escapeHtml(extension.title || "知识延伸")}</strong>
                    <p><b>行业案例：</b>${escapeHtml(extension.industryCase || "未提及")}</p>
                    <p><b>扩展说明：</b>${escapeHtml(extension.detailedExpansion || extension.industryCase || "未提及")}</p>
                    <p><b>关联知识：</b>${escapeHtml(extension.relatedKnowledge || "未提及")}</p>
                    <p><b>迁移场景：</b>${escapeHtml(extension.transferScenario || "未提及")}</p>
                    <p><b>学习建议：</b>${escapeHtml(extension.learningSuggestion || "未提及")}</p>
                  </div>
                `).join("") : `<p class="muted-text">未提及</p>`}
              </div>
              <div class="training-mini-block training-mini-practice">
                <h4>练习任务</h4>
                <p><strong>任务：</strong>${escapeHtml(item.practice?.task || "未提及")}</p>
                <p><strong>步骤：</strong>${escapeHtml(listText(item.practice?.steps) || "未提及")}</p>
                <p><strong>检验点：</strong>${escapeHtml(listText(item.practice?.checkpoints) || "未提及")}</p>
              </div>
            </div>
          </section>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </article>
      <article class="article-section meeting-section training-section-logic">
        <h3>整体知识逻辑</h3>
        <p><strong>一句话：</strong>${escapeHtml(logic.oneLine || "未提及")}</p>
        <div class="training-logic-grid">
          <div>
            <h4>学习路径</h4>
            ${listHtml(logic.learningPath)}
          </div>
          <div>
            <h4>知识点关系</h4>
            ${listHtml(logic.knowledgeRelations)}
          </div>
        </div>
        <p><strong>能力闭环：</strong>${escapeHtml(logic.capabilityLoop || "未提及")}</p>
      </article>
      ${trainingAnalysis.topicExtractionNote ? `
        <article class="article-section meeting-section training-section-note">
          <h3>可提炼话题说明</h3>
          <p>${escapeHtml(trainingAnalysis.topicExtractionNote)}</p>
        </article>
      ` : ""}
      ${buildTrainingNoteEditor(doc, skillVersion)}
    </section>
  `;
}

function trainingNoteForDoc(doc, skillVersion = "") {
  const version = skillVersion || doc?.currentSkillVersion || doc?.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const notes = doc?.trainingNotes && typeof doc.trainingNotes === "object" ? doc.trainingNotes : {};
  return notes[version] || notes.default || "";
}

function canEditTrainingNote(doc) {
  return Boolean(doc && (doc.ownerEmailKey || "").toLowerCase() === state.currentUser?.emailKey);
}

function buildTrainingNoteEditor(doc = null, skillVersion = "") {
  if (!doc) {
    return "";
  }
  const version = skillVersion || doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const noteHtml = sanitizeRichText(trainingNoteForDoc(doc, version));
  const editable = canEditTrainingNote(doc);
  return `
    <article class="article-section meeting-section training-section-user-note">
      <div class="training-note-head">
        <div>
          <h3>我的学习笔记</h3>
          <p>这里可以补充自己的理解、案例、行动项和复盘记录。</p>
        </div>
        ${editable ? `<button class="mini-button" type="button" data-save-training-note="${escapeHtml(doc.id)}" data-skill-version="${escapeHtml(version)}">保存笔记</button>` : `<span class="pill">仅可查看</span>`}
      </div>
      ${editable ? `
        <div class="rich-toolbar" aria-label="笔记格式工具">
          <button type="button" data-rich-command="bold">B</button>
          <button type="button" data-rich-command="italic">I</button>
          <button type="button" data-rich-command="underline">U</button>
          <button type="button" data-rich-command="insertUnorderedList">列表</button>
          <button type="button" data-rich-command="insertOrderedList">编号</button>
        </div>
      ` : ""}
      <div class="training-note-editor" ${editable ? "contenteditable=\"true\"" : ""} data-training-note-editor="${escapeHtml(doc.id)}" data-placeholder="写下你对这次培训的理解、可迁移场景、待验证问题和后续行动...">${noteHtml}</div>
    </article>
  `;
}

function sanitizeRichText(html = "") {
  const raw = String(html || "").trim();
  if (!raw || typeof document === "undefined") {
    return "";
  }
  const allowedTags = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "A", "BLOCKQUOTE", "H2", "H3", "H4"]);
  const template = document.createElement("template");
  template.innerHTML = raw;
  const cleanNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return document.createDocumentFragment();
    }
    const tag = node.tagName;
    if (!allowedTags.has(tag)) {
      const fragment = document.createDocumentFragment();
      [...node.childNodes].forEach((child) => fragment.appendChild(cleanNode(child)));
      return fragment;
    }
    const element = document.createElement(tag.toLowerCase());
    if (tag === "A") {
      const href = node.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        element.setAttribute("href", href);
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noreferrer");
      }
    }
    [...node.childNodes].forEach((child) => element.appendChild(cleanNode(child)));
    return element;
  };
  const cleaned = document.createDocumentFragment();
  [...template.content.childNodes].forEach((node) => cleaned.appendChild(cleanNode(node)));
  const output = document.createElement("div");
  output.appendChild(cleaned);
  return output.innerHTML;
}

function markdownInlineToHtml(text = "") {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>");
}

function normalizeGeneratedArticleContent(content = "") {
  const raw = String(content || "").trim();
  if (!raw) {
    return "";
  }
  const templateHeadings = new Set(["先讲结论和观点", "展示现象", "分析现象的深层次原因", "解决方式是什么", "从毛泽东思想、毛选角度总结", "总结收尾"]);
  if (/<[a-z][\s\S]*>/i.test(raw)) {
    const normalizedHtml = raw
      .replace(/<h1\b[^>]*>/gi, "<h2>")
      .replace(/<\/h1>/gi, "</h2>")
      .replace(/<h[56]\b[^>]*>/gi, "<h4>")
      .replace(/<\/h[56]>/gi, "</h4>")
      .replace(/<div\b[^>]*>/gi, "<p>")
      .replace(/<\/div>/gi, "</p>");
    return stripGeneratedArticleTemplateHeadings(sanitizeRichText(normalizedHtml), templateHeadings);
  }
  const blocks = raw
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const html = blocks.map((block) => {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      return "";
    }
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map((line) => `<li>${markdownInlineToHtml(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    }
    const first = lines[0].replace(/^#{1,6}\s*/, "").trim();
    if (/^#{1,6}\s+/.test(lines[0])) {
      const level = Math.min(4, Math.max(2, (lines[0].match(/^#{1,6}/)?.[0].length || 2) + 1));
      return `<h${level}>${markdownInlineToHtml(first)}</h${level}>`;
    }
    if (lines.length === 1 && first.length <= 32 && /[：:？?]?$/.test(first)) {
      return `<h3>${markdownInlineToHtml(first)}</h3>`;
    }
    return `<p>${markdownInlineToHtml(lines.map((line) => line.replace(/^[-*]\s+/, "")).join(" "))}</p>`;
  }).join("");
  return stripGeneratedArticleTemplateHeadings(sanitizeRichText(html), templateHeadings);
}

function stripGeneratedArticleTemplateHeadings(html = "", templateHeadings = new Set()) {
  if (!html || typeof document === "undefined") {
    return html || "";
  }
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  wrapper.querySelectorAll("h2,h3,h4,strong").forEach((node) => {
    const text = String(node.textContent || "")
      .replace(/[：:]/g, "")
      .replace(/^[一二三四五六七八九十]+[、.．]\s*/, "")
      .replace(/^\d+[、.．]\s*/, "")
      .trim();
    if ([...templateHeadings].some((heading) => text === heading || text.startsWith(heading))) {
      node.remove();
    }
  });
  return wrapper.innerHTML;
}

function extractGeneratedArticleTips(html = "") {
  if (!html || typeof document === "undefined") {
    return { contentHtml: html || "", tips: [] };
  }
  const wrapper = document.createElement("div");
  wrapper.innerHTML = normalizeGeneratedArticleContent(html);
  const tips = [];
  wrapper.querySelectorAll("p,blockquote,li").forEach((node) => {
    const text = String(node.textContent || "").trim();
    if (/马上可以执行的小行动|可以马上执行|行动建议|下一步行动/.test(text)) {
      tips.push({ type: "action", title: "马上可以执行的小行动", text });
      node.remove();
      return;
    }
    if (/学习的感觉在于|学习提示|学习收获|复盘问题/.test(text)) {
      tips.push({ type: "learning", title: "学习提示", text });
      node.remove();
    }
  });
  return { contentHtml: wrapper.innerHTML, tips };
}

function generatedArticleTipsForDisplay(article, extractedTips = []) {
  const tips = Array.isArray(extractedTips) ? [...extractedTips] : [];
  const hasType = (type) => tips.some((tip) => tip.type === type);
  if (article?.actionTip && !hasType("action")) {
    tips.push({ type: "action", title: "马上可以执行的小行动", text: article.actionTip });
  }
  if (article?.learningTip && !hasType("learning")) {
    tips.push({ type: "learning", title: "学习提示", text: article.learningTip });
  }
  return tips.filter((tip) => String(tip.text || "").trim());
}

function renderGeneratedArticleTips(tips = []) {
  if (!tips.length) {
    return "";
  }
  return `
    <div class="generated-tip-grid">
      ${tips.map((tip) => `
        <article class="generated-tip-card is-${escapeHtml(tip.type)}">
          <strong>${escapeHtml(tip.title)}</strong>
          <p>${escapeHtml(tip.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

async function updateTrainingNote(docId, skillVersion, html) {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc || doc.deletedAt || !canEditTrainingNote(doc)) {
    return;
  }
  const version = skillVersion || doc.currentSkillVersion || doc.analysis?.skillVersion || DEFAULT_TOPIC_SKILL.version;
  const updated = {
    ...doc,
    trainingNotes: {
      ...(doc.trainingNotes || {}),
      [version]: sanitizeRichText(html),
    },
    updatedAt: new Date().toISOString(),
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  await loadDocuments();
}

function renderOriginalParagraph(paragraph, keyword = "") {
  const className = isOriginalHeading(paragraph) ? ` class="original-heading"` : "";
  const html = keyword ? highlightKeyword(paragraph, keyword) : escapeHtml(paragraph);
  return `<p${className}>${html}</p>`;
}

function isOriginalHeading(paragraph) {
  const text = String(paragraph || "").trim();
  if (!text || text.length > 80) {
    return false;
  }
  return /^((第[一二三四五六七八九十百]+[章节篇部分])|([一二三四五六七八九十]+[、.．])|（[一二三四五六七八九十]+）|\\([一二三四五六七八九十]+\\)|([0-9]{1,2}[、.．])|（[0-9]{1,2}）|\\([0-9]{1,2}\\))/.test(text);
}

function highlightKeyword(text, keyword) {
  if (!keyword) {
    return escapeHtml(text);
  }
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedKeyword, "gi");
  return escapeHtml(text).replace(regex, (match) => `<mark class="original-highlight">${match}</mark>`);
}

function extractTopOriginalKeywords(row) {
  const text = row.doc.rawText || "";
  const candidates = new Set([
    ...categoryDefs.flatMap((category) => category.keywords),
    ...(row.doc.tags || []),
    ...(Array.isArray(row.topic.problemTypes) ? row.topic.problemTypes : []),
    row.source,
    row.type,
  ].filter((item) => String(item || "").trim().length >= 2));
  return [...candidates]
    .map((keyword) => {
      const escapedKeyword = String(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const count = (text.match(new RegExp(escapedKeyword, "g")) || []).length;
      return { keyword: String(keyword), count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.keyword.length - b.keyword.length)
    .slice(0, 5)
    .map((item) => item.keyword);
}

function extractTopMaterialKeywords(doc) {
  const text = doc.rawText || "";
  const candidates = new Set([
    materialDisplayCode(doc),
    materialSourceNameForDoc(doc),
    materialTypeNameForDoc(doc),
    doc.title,
    ...(doc.tags || []),
  ].filter((item) => String(item || "").trim().length >= 2));
  return [...candidates]
    .map((keyword) => {
      const escapedKeyword = String(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const count = (text.match(new RegExp(escapedKeyword, "g")) || []).length;
      return { keyword: String(keyword), count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.keyword.length - b.keyword.length)
    .slice(0, 5)
    .map((item) => item.keyword);
}

function openNewMaterialFlow() {
  state.topicDocFilter = "";
  state.topicSearch = "";
  state.topicSourceFilter = "";
  state.topicTypeFilter = "";
  state.topicPage = 1;
  if (els.topicSearchInput) {
    els.topicSearchInput.value = "";
  }
  if (els.topicSourceFilter) {
    els.topicSourceFilter.value = "";
  }
  if (els.topicTypeFilter) {
    els.topicTypeFilter.value = "";
  }
  switchModule("learning");
  switchStudyView("upload");
}

function openTopicFromRow(rowId) {
  const row = buildTopicRows().find((item) => item.id === rowId);
  if (!row) {
    return;
  }
  state.activeTopicRef = rowId;
  state.currentDocId = row.docId;
  state.fileName = row.doc.fileName || row.doc.title;
  state.rawText = row.doc.rawText || "";
  state.analysis = row.doc.analysis || analyzeText(state.rawText);
  state.activeTopic = row.topicIndex;
  els.docNameInput.value = row.doc.title || "";
  els.sourceText.value = state.rawText;
  setUploadLocked(true);
  renderAnalysis();
  switchModule("learning");
  switchStudyView("analysis");
}

function openSourceTopics(docId) {
  const doc = state.documents.find((item) => item.id === docId);
  if (!doc) {
    return;
  }
  state.topicDocFilter = doc.id;
  state.topicPage = 1;
  state.activeTopicRef = null;
  if (els.topicSearchInput) {
    els.topicSearchInput.value = "";
  }
  state.topicSearch = "";
  switchModule("learning");
  switchStudyView("topicsHome");
  renderTopicHome();
}

function renderCategories(analysis) {
  els.categoryBoard.innerHTML = "";
  const groups = analysis.activeCategories
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 8);

  if (!groups.length) {
    els.categoryBoard.innerHTML = `<p class="category-summary-empty">暂未识别到分类。</p>`;
    return;
  }

  groups.forEach((group) => {
    const item = document.createElement("span");
    item.className = "category-summary-chip";
    item.innerHTML = `
      <i style="background:${escapeHtml(group.category.color)}"></i>
      <strong>${escapeHtml(group.category.name)}</strong>
      <small>${group.items.length} 条</small>
    `;
    els.categoryBoard.appendChild(item);
  });
}

function renderTopics(analysis) {
  els.topicList.innerHTML = "";
  const template = document.querySelector("#topicButtonTemplate");

  analysis.topics.forEach((topic, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.classList.toggle("is-active", index === state.activeTopic);
    node.querySelector("span").textContent = topic.index;
    node.querySelector("span").style.background = topic.category.color;
    node.querySelector("strong").textContent = topic.title;
    node.querySelector("small").innerHTML = `
      <em>${escapeHtml(topic.category.name)} · ${"★".repeat(topic.difficulty)}${"☆".repeat(5 - topic.difficulty)}</em>
      <b>${escapeHtml(topic.sourceSummary || buildTopicSourceSummary(topic.evidence || [], topic.category))}</b>
    `;
    node.addEventListener("click", () => {
      state.activeTopic = index;
      renderTopics(analysis);
    });
    els.topicList.appendChild(node);
  });

  renderTopicArticle(analysis.topics[state.activeTopic]);
}

function renderTopicArticle(topic) {
  if (!topic) {
    els.topicArticle.innerHTML = `<p class="empty-state">没有识别到足够的话题，请补充更完整的讲话原文。</p>`;
    return;
  }
  els.topicArticle.innerHTML = buildTopicArticleHtml(topic);
  bindTopicSkillPills(els.topicArticle);
}

function buildTopicArticleHtml(topic, row = null) {
  const rowTypeKind = row?.doc ? materialTypeKind(materialTypeIdForDoc(row.doc), materialTypeNameForDoc(row.doc)) : "";
  if (rowTypeKind === "training" || topic?.trainingTopic) {
    return buildTrainingTopicArticleHtml(topic, row);
  }
  const fallbackCategory = topic.category || categoryDefs.find((item) => item.name === topic.categoryName) || categoryDefs[0];
  const fallbackEvidence = Array.isArray(topic.evidence) ? topic.evidence : [];
  const problemTypes = normalizeProblemTypes(topic.problemTypes, topic.categoryName, fallbackCategory.name);
  const deepNature = Array.isArray(topic.deepNature) && topic.deepNature.length ? topic.deepNature : buildDeepNature(fallbackCategory, fallbackEvidence);
  const ceoSolution = topic.ceoSolution && Object.keys(topic.ceoSolution).length
    ? topic.ceoSolution
    : buildCeoSolution(fallbackEvidence, fallbackCategory);
  const theoryAnchors = topic.theoryAnchors && Object.keys(topic.theoryAnchors).length
    ? topic.theoryAnchors
    : buildTheoryAnchors(fallbackCategory, fallbackEvidence);
  const caseComparison = topic.caseComparison && Object.keys(topic.caseComparison).length
    ? topic.caseComparison
    : buildCaseComparison(fallbackCategory);
  const moreSolutions = Array.isArray(topic.moreSolutions) && topic.moreSolutions.length
    ? topic.moreSolutions
    : buildMoreSolutions(fallbackCategory);
  const transferableInsights = topic.transferableInsights && Object.keys(topic.transferableInsights).length
    ? topic.transferableInsights
    : buildTransferableInsights(fallbackCategory, fallbackEvidence);

  const sourceMeta = row
    ? `
      <div class="topic-meta source-meta">
        <span class="pill">话题编号：${escapeHtml(row.displayIndex)}</span>
        <span class="pill">话题来源：${escapeHtml(row.source)} · ${escapeHtml(row.docTitle)}</span>
        <span class="pill">最后更新：${escapeHtml(formatDate(row.updatedAt))}</span>
        ${row.doc ? topicSkillPillHtml(row.doc, row.doc.currentSkillVersion || row.doc.analysis?.skillVersion || "", "话题 SKILL") : ""}
      </div>
    `
    : "";

  return `
    <div class="topic-article-title-row">
      <h2>${escapeHtml(topic.title)}</h2>
      ${row ? `<button class="favorite-toggle topic-favorite-toggle${topic.favorite ? " is-active" : ""}" type="button" data-topic-favorite-doc="${escapeHtml(row.docId)}" data-topic-favorite-index="${escapeHtml(String(row.topicIndex))}" data-topic-favorite-version="${escapeHtml(row.doc?.analysis?.skillVersion || row.doc?.currentSkillVersion || "")}" aria-label="${topic.favorite ? "取消收藏话题" : "收藏话题"}" title="${topic.favorite ? "取消收藏话题" : "收藏话题"}"><span aria-hidden="true">${favoriteIcon(topic.favorite)}</span></button>` : ""}
    </div>
    ${sourceMeta}
    <div class="topic-meta">
      <span class="pill">难度：${"★".repeat(topic.difficulty)}${"☆".repeat(5 - topic.difficulty)}</span>
      <span class="pill">问题类型：${escapeHtml(problemTypes.join(" / "))}</span>
      <span class="pill">文章模板：深度拆解</span>
    </div>
    ${articleSourceSection(topic.sourceSummary || buildTopicSourceSummary(fallbackEvidence, fallbackCategory), fallbackEvidence)}
    ${articleSection("问题实质", topic.problemEssence || topic.essence)}
    ${articleSection("表面现象", topic.surfacePhenomenon || buildSurfacePhenomenon(fallbackEvidence, fallbackCategory))}
    ${articleDeepNatureSection(deepNature)}
    ${articleCeoSolutionSection(ceoSolution)}
    ${articleTheorySection(theoryAnchors)}
    ${articleCaseSection(caseComparison)}
    ${articleMoreSolutionsSection(moreSolutions)}
    ${articleInsightSection(transferableInsights)}
    ${buildTopicWritingPanel(row)}
  `;
}

function buildTrainingTopicArticleHtml(topic, row = null) {
  const trainingTopic = normalizeTrainingTopic(topic.trainingTopic || topic) || {};
  const fallbackEvidence = Array.isArray(topic.evidence) ? topic.evidence : [];
  const problemTypes = normalizeProblemTypes(topic.problemTypes, topic.categoryName, trainingTopic.knowledgeType || "培训");
  const sourceMeta = row
    ? `
      <div class="topic-meta source-meta">
        <span class="pill">话题编号：${escapeHtml(row.displayIndex)}</span>
        <span class="pill">话题来源：${escapeHtml(row.source)} · ${escapeHtml(row.docTitle)}</span>
        <span class="pill">最后更新：${escapeHtml(formatDate(row.updatedAt))}</span>
        ${row.doc ? topicSkillPillHtml(row.doc, row.doc.currentSkillVersion || row.doc.analysis?.skillVersion || "", "话题 SKILL") : ""}
      </div>
    `
    : "";
  const listHtml = (items) => Array.isArray(items) && items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p class="muted-text">未提及</p>`;
  return `
    <article class="training-topic-article">
      <div class="topic-article-title-row">
        <h2>${escapeHtml(topic.title || trainingTopic.learningQuestion || trainingTopic.knowledgeName || "培训话题")}</h2>
        ${row ? `<button class="favorite-toggle topic-favorite-toggle${topic.favorite ? " is-active" : ""}" type="button" data-topic-favorite-doc="${escapeHtml(row.docId)}" data-topic-favorite-index="${escapeHtml(String(row.topicIndex))}" data-topic-favorite-version="${escapeHtml(row.doc?.analysis?.skillVersion || row.doc?.currentSkillVersion || "")}" aria-label="${topic.favorite ? "取消收藏话题" : "收藏话题"}" title="${topic.favorite ? "取消收藏话题" : "收藏话题"}"><span aria-hidden="true">${favoriteIcon(topic.favorite)}</span></button>` : ""}
      </div>
      ${sourceMeta}
      <div class="topic-meta">
        <span class="pill">难度：${"★".repeat(topic.difficulty || 1)}${"☆".repeat(5 - (topic.difficulty || 1))}</span>
        <span class="pill">话题类型：${escapeHtml(problemTypes.join(" / "))}</span>
        <span class="pill">页面模板：培训学习</span>
      </div>
      ${articleSourceSection(topic.sourceSummary || buildTopicSourceSummary(fallbackEvidence, topic.category || categoryDefs[0]), fallbackEvidence)}
      <section class="article-section training-topic-section training-topic-overview">
        <h3>知识点/概念</h3>
        <div class="training-topic-kv">
          <p><strong>知识点名称：</strong>${escapeHtml(trainingTopic.knowledgeName || topic.title || "未提及")}</p>
          <p><strong>知识点类型：</strong>${escapeHtml(trainingTopic.knowledgeType || "知识点")}</p>
          <p><strong>学习问题：</strong>${escapeHtml(trainingTopic.learningQuestion || topic.title || "未提及")}</p>
          <p><strong>核心观点：</strong>${escapeHtml(trainingTopic.coreViewpoint || "未提及")}</p>
          <p><strong>老师怎么讲：</strong>${escapeHtml(trainingTopic.teacherExplanation || "未提及")}</p>
          <p><strong>详细展开：</strong>${escapeHtml(trainingTopic.detailedExplanation || trainingTopic.teacherExplanation || "未提及")}</p>
        </div>
      </section>
      <section class="article-section training-topic-section training-topic-scenarios">
        <h3>讲解场景</h3>
        ${(trainingTopic.scenarios || []).length ? trainingTopic.scenarios.map((scenario) => `
          <div class="training-topic-card">
            <h4>${escapeHtml(scenario.name || "讲解场景")}</h4>
            <p><strong>场景语境：</strong>${escapeHtml(scenario.context || "未提及")}</p>
            <p><strong>老师怎么讲：</strong>${escapeHtml(scenario.teacherExplanation || "未提及")}</p>
            <p><strong>场景展开：</strong>${escapeHtml(scenario.detailedExpansion || scenario.teacherExplanation || "未提及")}</p>
            <p><strong>适用条件：</strong>${escapeHtml(scenario.applicability || "未提及")}</p>
            <p><strong>原文依据：</strong>${escapeHtml(scenario.evidence || "未提及")}</p>
          </div>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </section>
      <section class="article-section training-topic-section training-topic-attention">
        <h3>注意问题</h3>
        ${(trainingTopic.attentionPoints || []).length ? trainingTopic.attentionPoints.map((point) => `
          <div class="training-topic-card">
            <h4>${escapeHtml(point.issue || "注意问题")}</h4>
            <p><strong>为什么要注意：</strong>${escapeHtml(point.whyItMatters || "未提及")}</p>
            <p><strong>详细分析：</strong>${escapeHtml(point.detailedAnalysis || point.whyItMatters || "未提及")}</p>
            <p><strong>纠偏方式：</strong>${escapeHtml(point.correction || "未提及")}</p>
            <p><strong>原文依据：</strong>${escapeHtml(point.evidence || "未提及")}</p>
          </div>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </section>
      <section class="article-section training-topic-section training-topic-extension">
        <h3>知识体系延伸</h3>
        ${(trainingTopic.extensions || []).length ? trainingTopic.extensions.map((extension) => `
          <div class="training-topic-card">
            <h4>${escapeHtml(extension.title || "知识延伸")}</h4>
            <p><strong>行业案例：</strong>${escapeHtml(extension.industryCase || "未提及")}</p>
            <p><strong>扩展说明：</strong>${escapeHtml(extension.detailedExpansion || extension.industryCase || "未提及")}</p>
            <p><strong>关联知识：</strong>${escapeHtml(extension.relatedKnowledge || "未提及")}</p>
            <p><strong>迁移场景：</strong>${escapeHtml(extension.transferScenario || "未提及")}</p>
            <p><strong>学习建议：</strong>${escapeHtml(extension.learningSuggestion || "未提及")}</p>
          </div>
        `).join("") : `<p class="muted-text">未提及</p>`}
      </section>
      <section class="article-section training-topic-section training-topic-practice">
        <h3>练习任务</h3>
        <p><strong>任务：</strong>${escapeHtml(trainingTopic.practice?.task || "未提及")}</p>
        <div class="training-logic-grid">
          <div>
            <h4>操作步骤</h4>
            ${listHtml(trainingTopic.practice?.steps)}
          </div>
          <div>
            <h4>检验标准</h4>
            ${listHtml(trainingTopic.practice?.checkpoints)}
          </div>
        </div>
      </section>
      <section class="article-section training-topic-section training-topic-logic">
        <h3>整体逻辑与学习收获</h3>
        <p><strong>整体逻辑：</strong>${escapeHtml(trainingTopic.logicSummary || "未提及")}</p>
        <p><strong>学习者收获：</strong>${escapeHtml(trainingTopic.learnerTakeaway || "未提及")}</p>
      </section>
    </article>
  `;
}

function articleSourceSection(sourceSummary, evidence = []) {
  const items = evidence.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="article-section source-section">
      <h3>话题来源</h3>
      <p>${escapeHtml(sourceSummary || "该话题由原文观点抽取生成。")}</p>
      ${items ? `<ul>${items}</ul>` : ""}
    </section>
  `;
}

function normalizeProblemTypes(problemTypes, categoryName, fallbackName) {
  if (Array.isArray(problemTypes) && problemTypes.length) {
    return [...new Set(problemTypes.map((item) => String(item || "").trim()).filter(Boolean))].slice(0, 4);
  }
  const names = String(categoryName || fallbackName || "未分类")
    .split(/[、/,，|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(names.length ? names : [fallbackName || "未分类"])].slice(0, 4);
}

function articleSection(title, body) {
  return `
    <section class="article-section">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body || "")}</p>
    </section>
  `;
}

function articleSectionHtml(title, html) {
  return `
    <section class="article-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="article-html">${html}</div>
    </section>
  `;
}

function articleTextListSection(title, items) {
  const listItems = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="article-section">
      <h3>${escapeHtml(title)}</h3>
      <ul>${listItems}</ul>
    </section>
  `;
}

function articleDeepNatureSection(items = []) {
  const cards = items
    .map(
      (item) => `
        <article class="framework-card">
          <h4>${escapeHtml(item.title || "维度")}</h4>
          <p>${escapeHtml(item.explanation || "")}</p>
          <div class="framework-case">
            <strong>案例</strong>
            <p>${escapeHtml(item.case || "")}</p>
          </div>
        </article>
      `,
    )
    .join("");
  return `
    <section class="article-section">
      <h3>深层本质</h3>
      <div class="framework-grid">${cards}</div>
    </section>
  `;
}

function articleCeoSolutionSection(solution = {}) {
  return `
    <section class="article-section">
      <h3>CEO的解法与关键动作</h3>
      ${articleSubSection("核心判断", solution.coreJudgment)}
      ${articleTextListSubSection("验证方法", solution.verificationMethods)}
      ${articleTextListSubSection("关键行动", solution.keyActions)}
    </section>
  `;
}

function articleTheorySection(theory = {}) {
  return `
    <section class="article-section">
      <h3>底层逻辑（理论锚点）</h3>
      ${articleTextListSubSection("关联理论 / 模型", theory.linkedTheoryModel)}
      ${articleTextListSubSection("逻辑拆解", theory.logicDissection)}
    </section>
  `;
}

function articleCaseSection(comparison = {}) {
  return `
    <section class="article-section">
      <h3>案例对照（跨时空验证）</h3>
      ${articleSubSection("反例", comparison.counterexample)}
      ${articleSubSection("正例", comparison.positiveExample)}
      ${articleSubSection("历史类比", comparison.historicalAnalogy)}
    </section>
  `;
}

function articleMoreSolutionsSection(solutions = []) {
  const cards = solutions
    .map(
      (item, index) => `
        <article class="solution-card">
          <h4>${escapeHtml(item.title || `解法${index + 1}`)}</h4>
          <p class="solution-applicability">${escapeHtml(item.applicability || "")}</p>
          <ol>${(item.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </article>
      `,
    )
    .join("");
  return `
    <section class="article-section">
      <h3>更多解法与选择（拓展思维）</h3>
      <div class="framework-grid">${cards}</div>
    </section>
  `;
}

function articleInsightSection(insights = {}) {
  return `
    <section class="article-section">
      <h3>可迁移的启示</h3>
      ${articleSubSection("对团队的启示", insights.team)}
      ${articleSubSection("对读者的行动建议", insights.reader)}
    </section>
  `;
}

function buildTopicWritingPanel(row) {
  if (!row?.doc || materialTypeKind(materialTypeIdForDoc(row.doc), materialTypeNameForDoc(row.doc)) !== "topic") {
    return "";
  }
  const ideaState = state.topicArticleIdeas[row.id] || {};
  const ideas = Array.isArray(ideaState.ideas) ? ideaState.ideas : [];
  const selectedIndexes = Array.isArray(ideaState.selectedIndexes)
    ? ideaState.selectedIndexes.map((item) => Number(item))
    : [];
  const articleSkill = currentArticleSkill();
  const selectedCount = ideas.length ? selectedIndexes.filter((index) => ideas[index]).length : 0;
  const selectedReadyCount = ideas.length
    ? selectedIndexes.filter((index) => ideas[index] && selectedViewpointsForIdea(ideaState, index, ideas[index]).length).length
    : 0;
  const ideaCards = ideas.length
    ? ideas.map((idea, index) => `
        <article class="writing-idea-card${selectedIndexes.includes(index) ? " is-selected" : ""}">
          <label class="writing-idea-main">
            <input type="checkbox" value="${index}" data-writing-idea-select="${index}" ${selectedIndexes.includes(index) ? "checked" : ""} />
            <span>
              <strong>${escapeHtml(idea.title)}</strong>
              <em>${escapeHtml(idea.coreViewpoint || "暂无核心观点")}</em>
              <small>${escapeHtml((idea.framework || []).join(" / ") || "暂无框架")}</small>
            </span>
          </label>
          <div class="writing-viewpoints">
            <strong>主要观点（可多选）</strong>
            ${normalizeIdeaViewpoints(idea).map((point, pointIndex) => {
              const ideaSelected = selectedIndexes.includes(index);
              const pointSelected = selectedViewpointIndexesForIdea(ideaState, index, idea).includes(pointIndex);
              return `
                <label class="writing-viewpoint-chip${pointSelected ? " is-selected" : ""}${ideaSelected ? "" : " is-disabled"}">
                  <input type="checkbox" value="${pointIndex}" data-writing-viewpoint-select="${pointIndex}" data-writing-viewpoint-idea="${index}" ${pointSelected ? "checked" : ""} ${ideaSelected ? "" : "disabled"} />
                  <span>${escapeHtml(point)}</span>
                </label>
              `;
            }).join("") || `<p class="empty-state compact">暂无可选观点。</p>`}
          </div>
        </article>
      `).join("")
    : `<p class="empty-state compact">还没有推荐选题。点击“推荐10个选题”后，系统会基于当前话题调用大模型生成。</p>`;
  return `
    <section class="article-section topic-writing-panel" data-topic-writing="${escapeHtml(row.id)}">
      <div class="writing-panel-head">
        <div>
          <h3>延伸文章写作</h3>
          <p>基于这个话题的核心观点，推荐可继续学习和写作的文章选题。当前文章 SKILL：${escapeHtml(skillDisplayName(articleSkill, "文章 SKILL.md"))}</p>
        </div>
        <div class="writing-panel-actions">
          <button class="mini-button" type="button" data-refresh-writing-ideas="${escapeHtml(row.id)}" ${ideaState.loading || ideaState.generating ? "disabled" : ""}>${ideas.length ? "刷新推荐" : "推荐10个选题"}</button>
          <button class="primary mini-button" type="button" data-generate-writing-article="${escapeHtml(row.id)}" ${!ideas.length || !selectedReadyCount || selectedReadyCount !== selectedCount || ideaState.loading || ideaState.generating ? "disabled" : ""}>生成文章${selectedReadyCount ? `（${selectedReadyCount}）` : ""}</button>
        </div>
      </div>
      ${ideaState.message ? `<p class="writing-status">${escapeHtml(ideaState.message)}</p>` : ""}
      ${state.articleGeneration.topicRowId === row.id ? renderArticleGenerationProgressHtml("topic") : ""}
      <div class="writing-idea-grid">${ideaCards}</div>
    </section>
  `;
}

function articleSubSection(title, body) {
  return `
    <div class="article-subsection">
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body || "")}</p>
    </div>
  `;
}

function articleTextListSubSection(title, items) {
  const list = Array.isArray(items) ? items : [];
  return `
    <div class="article-subsection">
      <h4>${escapeHtml(title)}</h4>
      <ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderGeneratedArticlePage() {
  if (!els.generatedArticlePage) {
    return;
  }
  const keyword = String(state.generatedArticleSearch || "").trim().toLowerCase();
  const articles = state.generatedArticles.filter((article) => {
    const text = [
      article.title,
      article.coreViewpoint,
      article.topicTitle,
      article.docTitle,
      article.source,
      article.content,
      ...(article.framework || []),
    ].filter(Boolean).join(" ").toLowerCase();
    return !keyword || text.includes(keyword);
  });
  const active = articles.find((item) => item.id === state.activeGeneratedArticleId) || articles[0] || null;
  state.activeGeneratedArticleId = active?.id || "";
  const latestArticleSkill = currentArticleSkill();
  const activeNeedsRefresh = active && (!active.articleSkillVersion || active.articleSkillVersion !== latestArticleSkill.version);
  const articleTaskActive = Boolean(state.articleGeneration.active);
  const activeSkill = active ? articleSkillByVersion(active.articleSkillVersion || "") : null;
  if (!active || (state.generatedArticleEditingId && state.generatedArticleEditingId !== active.id)) {
    state.generatedArticleEditingId = "";
  }
  const isEditingArticle = Boolean(active && state.generatedArticleEditingId === active.id && !articleTaskActive);
  const extractedArticle = active ? extractGeneratedArticleTips(active.content || "") : { contentHtml: "", tips: [] };
  const displayArticleTips = active ? generatedArticleTipsForDisplay(active, extractedArticle.tips) : [];
  els.generatedArticlePage.innerHTML = `
    <div class="generated-article-shell">
      <aside class="generated-article-list">
        <div class="generated-article-list-head">
          <div>
            <p class="section-kicker">Generated Articles</p>
            <h3>生成文章</h3>
          </div>
          <input class="text-input" id="generatedArticleSearch" type="search" placeholder="搜索文章 / 话题 / 材料" value="${escapeHtml(state.generatedArticleSearch)}" />
        </div>
        <div class="generated-article-cards">
          ${state.articleGeneration.mode === "refresh" || state.articleGeneration.mode === "generate" ? renderArticleGenerationProgressHtml("generated-list") : ""}
          ${articles.length ? articles.map((article) => `
            <button class="generated-article-card${article.id === state.activeGeneratedArticleId ? " is-active" : ""}" type="button" data-generated-article="${escapeHtml(article.id)}">
              <strong>${escapeHtml(article.title || "未命名文章")}</strong>
              <span>${escapeHtml(article.topicTitle || "未关联话题")}</span>
              <small>${escapeHtml(article.articleSkillVersion || "未记录SKILL")} · ${escapeHtml(formatDate(article.updatedAt || article.createdAt))}${isAdmin() && article.ownerEmail ? ` · ${escapeHtml(article.ownerEmail)}` : ""}</small>
            </button>
          `).join("") : `<p class="empty-state compact">还没有生成文章。请先在高层视角话题底部生成。</p>`}
        </div>
      </aside>
      <section class="generated-article-editor ${isEditingArticle ? "is-editing" : "is-reading"}">
        ${active ? `
          <div class="generated-editor-head">
            <div>
              <p class="section-kicker">Article Editor</p>
              <h3 class="generated-title-editor" id="generatedArticleTitle" contenteditable="${isEditingArticle ? "true" : "false"}">${escapeHtml(active.title || "未命名文章")}</h3>
            </div>
            <div class="generated-editor-actions">
              ${isEditingArticle ? `
                <button class="mini-button" type="button" data-cancel-generated-article-edit="${escapeHtml(active.id)}">取消编辑</button>
                <button class="primary mini-button" type="button" data-save-generated-article="${escapeHtml(active.id)}">保存内容</button>
              ` : `
                ${activeNeedsRefresh ? `<button class="mini-button" type="button" data-refresh-generated-article="${escapeHtml(active.id)}" ${articleTaskActive ? "disabled" : ""}>按最新 SKILL 刷新</button>` : ""}
                <button class="mini-button" type="button" data-edit-generated-article="${escapeHtml(active.id)}" ${articleTaskActive ? "disabled" : ""}>编辑</button>
                <button class="mini-button" type="button" data-delete-generated-article="${escapeHtml(active.id)}" ${articleTaskActive ? "disabled" : ""}>删除</button>
              `}
            </div>
          </div>
          <div class="generated-meta-row">
            <div class="topic-meta source-meta generated-source-tags">
              <span class="pill">来源材料：${escapeHtml(active.docTitle || "未提及")}</span>
              <span class="pill">来源话题：${escapeHtml(active.topicTitle || "未提及")}</span>
              <span class="pill">生成时间：${escapeHtml(formatDate(active.createdAt))}</span>
            </div>
            <button class="pill skill-pill-button generated-skill-pill" type="button" data-open-generated-skill="${escapeHtml(active.articleSkillVersion || "")}">文章 SKILL：${escapeHtml(active.articleSkillFileName || active.articleSkillName || "文章 SKILL.md")} ${escapeHtml(active.articleSkillVersion || "未记录")}</button>
          </div>
          ${state.articleGeneration.articleId === active.id ? renderArticleGenerationProgressHtml("generated-editor") : ""}
          ${Array.isArray(active.selectedViewpoints) && active.selectedViewpoints.length ? `
            <div class="generated-viewpoint-basis">
              <strong>生成依据观点</strong>
              <div>${active.selectedViewpoints.map((point) => `<span>${escapeHtml(point)}</span>`).join("")}</div>
            </div>
          ` : ""}
          ${activeNeedsRefresh ? `<p class="category-notice" data-tone="info">当前最新文章 SKILL 是 ${escapeHtml(skillDisplayName(latestArticleSkill, "文章 SKILL.md"))}，这篇文章可刷新到最新写作规则。</p>` : ""}
          <section class="generated-field">
            <span class="generated-field-label">文章核心观点</span>
            <div class="generated-core-editor" id="generatedArticleCore" contenteditable="${isEditingArticle ? "true" : "false"}">${escapeHtml(active.coreViewpoint || "暂无核心观点")}</div>
          </section>
          <section class="generated-field">
            <div class="generated-content-editor" id="generatedArticleContent" contenteditable="${isEditingArticle ? "true" : "false"}">${extractedArticle.contentHtml}</div>
          </section>
          ${renderGeneratedArticleTips(displayArticleTips)}
        ` : `<p class="empty-state">选择左侧文章后进行编辑。</p>`}
      </section>
    </div>
  `;
  els.generatedArticlePage.querySelector("#generatedArticleSearch")?.addEventListener("input", (event) => {
    state.generatedArticleSearch = event.target.value;
    renderGeneratedArticlePage();
  });
  els.generatedArticlePage.querySelectorAll("[data-generated-article]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeGeneratedArticleId = button.dataset.generatedArticle;
      renderGeneratedArticlePage();
    });
  });
  els.generatedArticlePage.querySelector("[data-open-generated-skill]")?.addEventListener("click", () => {
    const skill = activeSkill || currentArticleSkill();
    showSkillContentModal(skill, `${skill.skillFileName || skill.name || "文章 SKILL.md"} ${skill.version || ""}`.trim(), { editable: true });
  });
  els.generatedArticlePage.querySelector("[data-edit-generated-article]")?.addEventListener("click", (event) => {
    state.generatedArticleEditingId = event.currentTarget.dataset.editGeneratedArticle || "";
    renderGeneratedArticlePage();
  });
  els.generatedArticlePage.querySelector("[data-cancel-generated-article-edit]")?.addEventListener("click", () => {
    state.generatedArticleEditingId = "";
    renderGeneratedArticlePage();
  });
  els.generatedArticlePage.querySelector("[data-save-generated-article]")?.addEventListener("click", async (event) => {
    const article = state.generatedArticles.find((item) => item.id === event.currentTarget.dataset.saveGeneratedArticle);
    if (!article) {
      return;
    }
    const ok = await confirmAction({
      title: "保存生成文章",
      message: "确认保存对这篇生成文章的修改吗？",
      confirmText: "确认保存",
    });
    if (!ok) {
      return;
    }
    const existingTips = generatedArticleTipsForDisplay(article, extractGeneratedArticleTips(article.content || "").tips);
    const updated = {
      ...article,
      title: els.generatedArticlePage.querySelector("#generatedArticleTitle")?.innerText.trim() || article.title,
      coreViewpoint: els.generatedArticlePage.querySelector("#generatedArticleCore")?.innerText.trim() || "",
      content: normalizeGeneratedArticleContent(els.generatedArticlePage.querySelector("#generatedArticleContent")?.innerHTML || ""),
      actionTip: article.actionTip || existingTips.find((tip) => tip.type === "action")?.text || "",
      learningTip: article.learningTip || existingTips.find((tip) => tip.type === "learning")?.text || "",
      updatedAt: new Date().toISOString(),
    };
    state.generatedArticleEditingId = "";
    await saveGeneratedArticle(updated);
  });
  els.generatedArticlePage.querySelector("[data-refresh-generated-article]")?.addEventListener("click", async (event) => {
    const article = state.generatedArticles.find((item) => item.id === event.currentTarget.dataset.refreshGeneratedArticle);
    const ok = await confirmAction({
      title: "刷新生成文章",
      message: `确认使用最新文章 SKILL 重新生成“${article?.title || "这篇文章"}”吗？当前正文会被新生成内容覆盖。`,
      confirmText: "确认刷新",
    });
    if (!ok) {
      return;
    }
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = "刷新中...";
    try {
      await refreshGeneratedArticleWithLatestSkill(event.currentTarget.dataset.refreshGeneratedArticle);
    } catch (error) {
      console.error(error);
      window.alert(`刷新失败：${error.message}`);
      renderGeneratedArticlePage();
    }
  });
  els.generatedArticlePage.querySelector("[data-delete-generated-article]")?.addEventListener("click", async (event) => {
    const ok = await confirmAction({
      title: "删除生成文章",
      message: "确认删除这篇生成文章吗？删除后无法在当前页面恢复。",
      confirmText: "确认删除",
      tone: "danger",
    });
    if (ok) {
      await deleteGeneratedArticle(event.currentTarget.dataset.deleteGeneratedArticle);
    }
  });
}

function renderDocumentLibrary() {
  const allTags = [...new Set(state.documents.flatMap((doc) => doc.tags || []))].sort();
  els.libraryTags.innerHTML = "";
  allTags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tag-chip${state.activeTag === tag ? " is-active" : ""}`;
    button.textContent = tag;
    button.addEventListener("click", () => {
      state.activeTag = state.activeTag === tag ? "" : tag;
      renderDocumentLibrary();
    });
    els.libraryTags.appendChild(button);
  });

  const keyword = state.librarySearch.trim().toLowerCase();
  const tagKeyword = state.libraryTagSearch.trim().toLowerCase();
  const filtered = state.documents.filter((doc) => {
    const tagMatch = !state.activeTag || (doc.tags || []).includes(state.activeTag);
    const tagKeywordMatch = !tagKeyword || (doc.tags || []).join(" ").toLowerCase().includes(tagKeyword);
    const categoryMatch =
      !state.activeDocCategory ||
      (state.activeDocCategory === "preset-other" ? !doc.categoryId || doc.categoryId === "preset-other" : doc.categoryId === state.activeDocCategory);
    const searchable = `${doc.title} ${doc.fileName}`.toLowerCase();
    return tagMatch && tagKeywordMatch && categoryMatch && (!keyword || searchable.includes(keyword));
  });
  const visibleDocs = filtered;

  els.documentList.innerHTML = "";
  if (!visibleDocs.length) {
    els.documentList.innerHTML = `<p class="empty-state compact">${state.documents.length ? "没有匹配的文档。" : "还没有保存文档。"}</p>`;
    return;
  }

  const template = document.querySelector("#documentTemplate");
  visibleDocs.forEach((doc) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.classList.toggle("is-active", doc.id === state.currentDocId);
    const main = node.querySelector(".document-main");
    main.querySelector("strong").textContent = doc.title;
    const owner = isAdmin() && doc.ownerEmail ? ` · ${doc.ownerEmail}` : "";
    main.querySelector("small").textContent = `${formatDate(doc.lastStudiedAt || doc.updatedAt)} · ${doc.analysis?.topics?.length || 0} 个话题${owner}`;
    const tagText = (doc.tags || []).length ? doc.tags.join(" / ") : "未打标签";
    main.querySelector(".doc-tags").textContent = `${doc.categoryName || "其他"} · ${tagText}`;
    main.addEventListener("click", () => {
      loadDocumentIntoWorkspace(doc.id).catch((error) => {
        els.parseHint.textContent = `打开文档失败：${error.message}`;
      });
    });
    const categorySelect = node.querySelector(".document-category");
    categorySelect.innerHTML = state.docCategories
      .map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`)
      .join("");
    categorySelect.value = doc.categoryId && categoryById(doc.categoryId) ? doc.categoryId : "preset-other";
    const tagsEditor = node.querySelector(".document-tags-editor");
    tagsEditor.value = (doc.tags || []).join(", ");
    node.querySelector(".document-save-meta").addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "保存文档信息",
        message: `确认保存“${doc.title}”的分类和标签调整吗？`,
        confirmText: "确认保存",
      });
      if (ok) {
        await updateDocumentMetadata(doc.id, categorySelect.value, tagsEditor.value);
      }
    });
    node.querySelector(".document-delete").addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "删除文档",
        message: `确认删除“${doc.title}”吗？删除后这篇资料和话题将无法继续学习。`,
        confirmText: "确认删除",
        tone: "danger",
      });
      if (ok) {
        await deleteDocument(doc.id);
      }
    });
    els.documentList.appendChild(node);
  });
}

function renderAnalyzedMaterialList() {
  if (!els.analyzedMaterialList) {
    return;
  }
  const docs = [...state.allDocuments]
    .filter((doc) => !doc.deletedAt && (doc.ownerEmailKey || "").toLowerCase() === state.currentUser?.emailKey)
    .filter((doc) => doc.analysis)
    .sort((a, b) => new Date(b.lastStudiedAt || b.updatedAt || b.createdAt) - new Date(a.lastStudiedAt || a.updatedAt || a.createdAt));
  if (!docs.length) {
    els.analyzedMaterialList.innerHTML = `<p class="empty-state compact">还没有已完成分析的材料。这里仅展示当前登录用户自己的内容。</p>`;
    if (els.deleteAnalyzedMaterialsBtn) {
      els.deleteAnalyzedMaterialsBtn.disabled = true;
    }
    return;
  }
  const sourceOptions = state.materialSources.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
  const typeOptions = state.materialTypes.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
  els.analyzedMaterialList.innerHTML = docs.map((doc) => `
    <article class="analyzed-material-item">
      <label class="upload-check">
        <input type="checkbox" data-analyzed-select="${escapeHtml(doc.id)}" />
      </label>
      <div class="analyzed-material-main">
        <input class="text-input analyzed-title-input" type="text" data-analyzed-title="${escapeHtml(doc.id)}" maxlength="120" value="${escapeHtml(doc.title || doc.fileName || "")}" aria-label="修改材料名称" />
        <small>${escapeHtml(formatDate(doc.lastStudiedAt || doc.updatedAt || doc.createdAt))} · ${escapeHtml(String(doc.analysis?.topics?.length || 0))} 个话题</small>
      </div>
      <select class="text-input" data-analyzed-source="${escapeHtml(doc.id)}">${sourceOptions}</select>
      <select class="text-input" data-analyzed-type="${escapeHtml(doc.id)}">${typeOptions}</select>
      <button class="mini-button" type="button" data-analyzed-update="${escapeHtml(doc.id)}" disabled>更新</button>
      <button class="mini-button danger" type="button" data-analyzed-delete="${escapeHtml(doc.id)}">删除</button>
    </article>
  `).join("");
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-title]").forEach((input) => {
    input.dataset.originalValue = input.value.trim();
    input.addEventListener("input", () => updateAnalyzedMaterialRowState(input.dataset.analyzedTitle));
  });
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-source]").forEach((select) => {
    const doc = docs.find((item) => item.id === select.dataset.analyzedSource);
    select.value = materialSourceIdForDoc(doc) || state.materialSources[0]?.id || "";
    select.dataset.originalValue = select.value;
    select.addEventListener("change", () => updateAnalyzedMaterialRowState(select.dataset.analyzedSource));
  });
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-type]").forEach((select) => {
    const doc = docs.find((item) => item.id === select.dataset.analyzedType);
    select.value = materialTypeIdForDoc(doc) || state.materialTypes[0]?.id || "";
    select.dataset.originalValue = select.value;
    select.addEventListener("change", () => updateAnalyzedMaterialRowState(select.dataset.analyzedType));
  });
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-update]").forEach((button) => {
    button.addEventListener("click", async () => {
      const doc = docs.find((item) => item.id === button.dataset.analyzedUpdate);
      const titleInput = els.analyzedMaterialList.querySelector(`[data-analyzed-title="${cssEscape(button.dataset.analyzedUpdate)}"]`);
      const sourceSelect = els.analyzedMaterialList.querySelector(`[data-analyzed-source="${cssEscape(button.dataset.analyzedUpdate)}"]`);
      const typeSelect = els.analyzedMaterialList.querySelector(`[data-analyzed-type="${cssEscape(button.dataset.analyzedUpdate)}"]`);
      if (!doc || !titleInput || !sourceSelect || !typeSelect || button.disabled) {
        return;
      }
      const title = titleInput.value.trim();
      if (!title) {
        window.alert("材料名称不能为空。");
        return;
      }
      const ok = await confirmAction({
        title: "更新材料信息",
        message: `确认更新“${doc.title || doc.fileName}”的材料名称、资料来源和材料类型吗？`,
        confirmText: "确认更新",
      });
      if (ok) {
        await updateDocumentMaterialMeta(doc.id, sourceSelect.value, typeSelect.value, title);
      }
    });
  });
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const doc = docs.find((item) => item.id === button.dataset.analyzedDelete);
      if (!doc) {
        return;
      }
      const ok = await confirmAction({
        title: "删除材料",
        message: `确认删除“${doc.title || doc.fileName}”吗？删除后相关话题会进入回收站。`,
        confirmText: "确认删除",
        tone: "danger",
      });
      if (ok) {
        await deleteDocument(doc.id);
        renderAnalyzedMaterialList();
      }
    });
  });
  els.analyzedMaterialList.querySelectorAll("[data-analyzed-select]").forEach((checkbox) => {
    checkbox.addEventListener("change", updateAnalyzedMaterialDeleteButton);
  });
  updateAnalyzedMaterialDeleteButton();
}

function updateAnalyzedMaterialRowState(docId) {
  if (!els.analyzedMaterialList) {
    return;
  }
  const sourceSelect = els.analyzedMaterialList.querySelector(`[data-analyzed-source="${cssEscape(docId)}"]`);
  const typeSelect = els.analyzedMaterialList.querySelector(`[data-analyzed-type="${cssEscape(docId)}"]`);
  const titleInput = els.analyzedMaterialList.querySelector(`[data-analyzed-title="${cssEscape(docId)}"]`);
  const updateButton = els.analyzedMaterialList.querySelector(`[data-analyzed-update="${cssEscape(docId)}"]`);
  if (!sourceSelect || !typeSelect || !titleInput || !updateButton) {
    return;
  }
  const title = titleInput.value.trim();
  const changed = title !== titleInput.dataset.originalValue || sourceSelect.value !== sourceSelect.dataset.originalValue || typeSelect.value !== typeSelect.dataset.originalValue;
  updateButton.disabled = !changed || !title;
}

function selectedAnalyzedMaterialIds() {
  if (!els.analyzedMaterialList) {
    return [];
  }
  return [...els.analyzedMaterialList.querySelectorAll("[data-analyzed-select]:checked")].map((input) => input.dataset.analyzedSelect);
}

function updateAnalyzedMaterialDeleteButton() {
  if (els.deleteAnalyzedMaterialsBtn) {
    els.deleteAnalyzedMaterialsBtn.disabled = selectedAnalyzedMaterialIds().length === 0;
  }
}

async function updateDocumentMetadata(docId, categoryId, tagsValue) {
  const doc = state.documents.find((item) => item.id === docId);
  const category = categoryById(categoryId) || categoryById("preset-other");
  if (!doc || (!isAdmin() && doc.ownerEmailKey !== state.currentUser.emailKey) || !category) {
    return;
  }
  await withStore(DOC_STORE, "readwrite", (store) => store.put({
    ...doc,
    categoryId: category.id,
    categoryName: category.name,
    tags: parseTags(tagsValue),
    updatedAt: new Date().toISOString(),
  }));
  await logEvent("change_doc_metadata", { docId, categoryId: category.id, categoryName: category.name });
  await loadDocuments();
}

async function updateDocumentMaterialMeta(docId, sourceId, typeId, title = "") {
  const doc = state.allDocuments.find((item) => item.id === docId);
  if (!doc || doc.deletedAt || (!isAdmin() && doc.ownerEmailKey !== state.currentUser.emailKey)) {
    return;
  }
  const materialSource = sourceId ? materialSourceById(sourceId) : materialSourceForDoc(doc);
  const materialType = typeId ? materialTypeById(typeId) : materialTypeForDoc(doc);
  const nextTitle = String(title || doc.title || doc.fileName || "").trim();
  const updated = {
    ...doc,
    title: nextTitle || doc.title || doc.fileName || "未命名材料",
    materialSourceId: materialSource?.id || "",
    materialSourceName: materialSource?.name || "",
    materialTypeId: materialType?.id || "",
    materialTypeName: materialType?.name || "",
    materialTypeTemplate: materialType?.name || "",
    updatedAt: new Date().toISOString(),
  };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(updated));
  if (updated.title !== (doc.title || doc.fileName || "")) {
    const relatedArticles = await withStore(GENERATED_ARTICLE_STORE, "readonly", (store) => storeRequest(store, (s) => s.getAll()));
    const changedArticles = relatedArticles.filter((article) => article.docId === docId);
    if (changedArticles.length) {
      await withStore(GENERATED_ARTICLE_STORE, "readwrite", (store) => {
        changedArticles.forEach((article) => store.put({ ...article, docTitle: updated.title, updatedAt: new Date().toISOString() }));
      });
    }
  }
  await logEvent("change_material_meta", { docId, title: updated.title, sourceId: updated.materialSourceId, typeId: updated.materialTypeId });
  await loadDocuments();
  await loadGeneratedArticles();
}

function renderOwnerFilter() {
  if (!els.libraryOwnerFilter || !isAdmin()) {
    return;
  }
  const options = [
    `<option value="all">所有用户资料</option>`,
    `<option value="${escapeHtml(state.currentUser.emailKey)}">只看自己</option>`,
    ...state.users
      .filter((user) => user.emailKey !== state.currentUser.emailKey)
      .map((user) => `<option value="${escapeHtml(user.emailKey)}">${escapeHtml(user.email)}</option>`),
  ].join("");
  els.libraryOwnerFilter.innerHTML = options;
  els.libraryOwnerFilter.value = state.activeOwner;
}

function renderConfigPage() {
  if (!els.configPage) {
    return;
  }
  const theme = selectedTheme();
  const ds = readDeepSeekSettings();
  const fs = readFontSettings();
  const providerOptions = MODEL_PROVIDERS.map((provider) => `<option value="${escapeHtml(provider.id)}"${(ds.provider || "deepseek") === provider.id ? " selected" : ""}>${escapeHtml(provider.name)}</option>`).join("");
  const fontOptions = FONT_SIZE_PRESETS.map((preset) => `
    <button class="font-option${(fs.presetId || "small") === preset.id ? " is-active" : ""}" type="button" data-font-preset="${preset.id}">
      <strong>${escapeHtml(preset.name)}</strong>
      <span>${escapeHtml(preset.bodySize)} / ${escapeHtml(preset.buttonSize)} / ${escapeHtml(preset.titleSize)}</span>
      <small>${escapeHtml(preset.note)}</small>
    </button>
  `).join("");
  els.configPage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Configuration</p>
        <h2>系统配置</h2>
      </div>
      <p>账号、系统配色、字体大小和大模型连接统一在这里管理。</p>
    </div>
    <nav class="module-anchor-nav" aria-label="系统配置定位">
      <button type="button" data-anchor-target="#accountSettings">账号设置</button>
      <button type="button" data-anchor-target="#themeSettings">系统配色</button>
      <button type="button" data-anchor-target="#fontSettings">字体大小</button>
      <button type="button" data-anchor-target="#deepseekSettings">大模型配置</button>
    </nav>
    <div class="config-grid">
      <section class="config-card" id="accountSettings">
        <h3>账号设置</h3>
        <p class="auth-note" id="accountEmail">当前账号：${escapeHtml(state.currentUser?.email || "")}</p>
        <input class="text-input" id="oldPassword" type="password" autocomplete="current-password" placeholder="当前密码" />
        <input class="text-input" id="newPassword" type="password" autocomplete="new-password" placeholder="新密码：至少10位，含大小写、数字、特殊字符" />
        <input class="text-input" id="confirmPassword" type="password" autocomplete="new-password" placeholder="再次输入新密码" />
        <button class="primary full-button" id="changePasswordBtn" type="button">修改密码</button>
        <p class="auth-message" id="accountMessage"></p>
      </section>
      <section class="config-card config-theme-card" id="themeSettings">
        <h3>系统配色</h3>
        <p class="auth-note">当前方案：${escapeHtml(theme.scope)} · ${escapeHtml(theme.name)}。${escapeHtml(theme.description)}</p>
        <div class="theme-grid" id="configThemeGrid"></div>
      </section>
      <section class="config-card config-theme-card" id="fontSettings">
        <h3>字体大小</h3>
        <p class="auth-note">全局只保留正文 / 按钮 / 标题三类字号，选择一个档位即可。</p>
        <div class="font-options">${fontOptions}</div>
      </section>
      <section class="config-card config-theme-card" id="deepseekSettings">
        <h3>大模型配置</h3>
        <p class="auth-note">每位用户独立配置自己的大模型，系统只会调用当前登录用户保存的 token。</p>
        <label class="config-field">
          <span>大模型选择 <em>必填</em></span>
          <select class="text-input" id="deepseekProvider">${providerOptions}</select>
        </label>
        <label class="config-field">
          <span>API Key <em>必填</em></span>
          <input class="text-input example-input" id="deepseekApiKey" type="password" data-example="sk-xxxxxxxxxxxxxxxx" placeholder="sk-xxxxxxxxxxxxxxxx" value="${escapeHtml(ds.apiKey)}" />
        </label>
        <label class="config-field">
          <span>Base URL <em>必填</em></span>
          <input class="text-input example-input" id="deepseekBaseUrl" type="text" data-example="https://api.deepseek.com" placeholder="https://api.deepseek.com" value="${escapeHtml(ds.baseUrl)}" />
        </label>
        <label class="config-field">
          <span>模型名称 <em>必填</em></span>
          <input class="text-input example-input" id="deepseekModel" type="text" data-example="deepseek-v4-flash" placeholder="deepseek-v4-flash" value="${escapeHtml(ds.model)}" />
        </label>
        <label class="config-field">
          <span>思考模式</span>
          <select class="text-input" id="deepseekThinking">
          <option value="enabled"${ds.thinking === "enabled" ? " selected" : ""}>启用思考</option>
          <option value="disabled"${ds.thinking === "disabled" ? " selected" : ""}>关闭思考</option>
          </select>
        </label>
        <label class="config-field">
          <span>推理强度</span>
          <select class="text-input" id="deepseekReasoningEffort">
          <option value="low"${ds.reasoningEffort === "low" ? " selected" : ""}>低</option>
          <option value="medium"${ds.reasoningEffort === "medium" ? " selected" : ""}>中</option>
          <option value="high"${ds.reasoningEffort === "high" ? " selected" : ""}>高</option>
          </select>
        </label>
        <div class="config-actions">
          <button class="primary nowrap-button" id="testDeepseekBtn" type="button">测试连接</button>
          <button class="primary full-button" id="saveDeepseekSettingsBtn" type="button">保存大模型配置</button>
        </div>
        <p class="auth-message" id="deepseekMessage"></p>
      </section>
    </div>
  `;
  bindAnchorNav(els.configPage);
  els.configPage.querySelector("#changePasswordBtn")?.addEventListener("click", async () => {
    const ok = await confirmAction({
      title: "修改密码",
      message: "确认提交密码修改吗？修改成功后请使用新密码登录。",
      confirmText: "确认修改",
    });
    if (!ok) {
      return;
    }
    changeOwnPassword().catch((error) => {
      const message = els.configPage.querySelector("#accountMessage");
      if (message) {
        message.textContent = `修改失败：${error.message}`;
      }
    });
  });
  els.configPage.querySelector("#saveDeepseekSettingsBtn")?.addEventListener("click", async () => {
    const ok = await confirmAction({
      title: "保存大模型配置",
      message: "确认保存当前 DeepSeek 配置吗？后续执行分析会使用这套配置。",
      confirmText: "确认保存",
    });
    if (!ok) {
      return;
    }
    const nextSettings = readDeepSeekSettingsFromConfig();
    await saveDeepSeekSettings(nextSettings);
    state.deepseekTestSignature = "";
    syncDeepSeekConfigButtons();
    const message = els.configPage.querySelector("#deepseekMessage");
    if (message) {
      message.textContent = "大模型配置已保存。";
      message.dataset.tone = "success";
    }
  });
  els.configPage.querySelectorAll("[data-font-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = FONT_SIZE_PRESETS.find((item) => item.id === button.dataset.fontPreset) || FONT_SIZE_PRESETS[1];
      const next = {
        presetId: preset.id,
        bodySize: preset.bodySize,
        buttonSize: preset.buttonSize,
        titleSize: preset.titleSize,
      };
      saveFontSettings(next);
      applyFontSettings(next);
      renderConfigPage();
    });
  });
  const providerSelect = els.configPage.querySelector("#deepseekProvider");
  providerSelect?.addEventListener("change", () => {
    const provider = MODEL_PROVIDERS.find((item) => item.id === providerSelect.value) || MODEL_PROVIDERS[0];
    const baseInput = els.configPage.querySelector("#deepseekBaseUrl");
    const modelInput = els.configPage.querySelector("#deepseekModel");
    if (baseInput && !baseInput.value.trim()) {
      baseInput.value = provider.baseUrl;
    }
    if (modelInput && !modelInput.value.trim()) {
      modelInput.value = provider.model;
    }
    syncDeepSeekConfigButtons("配置已变更，请重新测试连接。");
  });
  els.configPage.querySelectorAll("#deepseekSettings input, #deepseekSettings select").forEach((field) => {
    field.addEventListener("input", () => {
      state.deepseekTestSignature = "";
      syncDeepSeekConfigButtons("配置已变更，请重新测试连接。");
    });
    field.addEventListener("change", () => {
      state.deepseekTestSignature = "";
      syncDeepSeekConfigButtons("配置已变更，请重新测试连接。");
    });
  });
  els.configPage.querySelectorAll(".example-input").forEach((field) => {
    const example = field.dataset.example || "";
    field.addEventListener("focus", () => {
      field.placeholder = "";
    });
    field.addEventListener("blur", () => {
      field.placeholder = example;
      syncDeepSeekConfigButtons();
    });
  });
  els.configPage.querySelector("#testDeepseekBtn")?.addEventListener("click", async () => {
    const ok = await confirmAction({
      title: "测试大模型连接",
      message: "确认用当前配置发起一次 DeepSeek 连接测试吗？",
      confirmText: "确认测试",
    });
    if (!ok) {
      return;
    }
    const message = els.configPage.querySelector("#deepseekMessage");
    if (message) {
      message.textContent = "正在测试连接...";
      message.dataset.tone = "info";
    }
    try {
      const settings = readDeepSeekSettingsFromConfig();
      const result = await testDeepSeekConnection(settings);
      state.deepseekTestSignature = deepSeekSettingsSignature(settings);
      if (message) {
        message.textContent = result?.message || "DeepSeek 连接成功。";
        message.dataset.tone = "success";
      }
      syncDeepSeekConfigButtons();
    } catch (error) {
      state.deepseekTestSignature = "";
      if (message) {
        message.textContent = `测试失败：${error.message}`;
        message.dataset.tone = "error";
      }
      syncDeepSeekConfigButtons();
    }
  });
  syncDeepSeekConfigButtons();
  renderThemeGrid();
  scrollToModuleTop(els.configPage);
}

function renderTopicSkillPage() {
  if (!els.topicSkillPage) {
    return;
  }
  const activeTypeId = state.materialTypes.some((type) => type.id === state.activeSkillMaterialTypeId)
    ? state.activeSkillMaterialTypeId
    : "type-executive-view";
  state.activeSkillMaterialTypeId = activeTypeId;
  const activeType = materialTypeById(activeTypeId) || DEFAULT_MATERIAL_TYPES[0];
  const latest = currentTopicSkill(activeTypeId);
  const baseSkill = topicSkillTemplateForMaterialType(activeTypeId);
  const versions = dedupeTopicSkills([
    ...state.topicSkills.filter((skill) => skillTypeId(skill) === activeTypeId),
    baseSkill,
  ]);
  if (!versions.some((skill) => skill.version === latest.version)) {
    versions.unshift(latest);
  }
  const typeOptions = state.materialTypes
    .map((type) => `<option value="${escapeHtml(type.id)}" ${type.id === activeTypeId ? "selected" : ""}>${escapeHtml(type.name)}</option>`)
    .join("");
  const versionOptions = versions
    .map((skill) => `<option value="${escapeHtml(skill.version)}">${escapeHtml(skill.version)} · ${escapeHtml(skill.skillFileName || skillFileNameForMaterialType(activeType.name, activeTypeId))}</option>`)
    .join("");
  const batchCandidates = skillRefreshCandidateDocs(activeTypeId, latest);
  const batchRunning = state.skillBatchRefresh.active && state.skillBatchRefresh.skillTypeId === activeTypeId && state.skillBatchRefresh.skillVersion === latest.version;
  const batchCompleted = state.skillBatchRefresh.completed && state.skillBatchRefresh.skillTypeId === activeTypeId && state.skillBatchRefresh.skillVersion === latest.version;
  const batchProgressItems = Object.values(state.skillBatchRefresh.progressByDoc || {});
  const batchDoneCount = batchProgressItems.filter((item) => item.status === "done").length;
  const batchSelectedCount = (state.skillBatchRefresh.selectedIds || []).length;
  const batchCandidateTopicCount = totalTopicCount(batchCandidates);
  const batchPanel = (batchRunning || batchCompleted) ? `
    <div class="skill-batch-status-panel">
      <strong>${batchRunning ? "批量刷新执行中" : "批量刷新已完成"}</strong>
      <span>${escapeHtml(skillDisplayName(latest, "话题拆解 SKILL.md"))} · ${escapeHtml(String(batchDoneCount))}/${escapeHtml(String(batchSelectedCount || batchProgressItems.length || 0))} 份</span>
      <button class="mini-button" type="button" data-open-skill-batch>查看执行窗口</button>
    </div>
  ` : "";
  const defaultCompareLeft = versions[1]?.version || versions[0]?.version || "";
  const defaultCompareRight = versions[0]?.version || "";
  const versionRows = versions.map((skill) => {
    const previousSkill = previousSkillForVersion(skill, versions);
    const changeLog = skillChangeLogForVersion(skill, versions);
    return `
      <article class="skill-version-card${skill.version === latest.version ? " is-current" : ""}">
        <div class="skill-version-head">
          <div>
            <strong>${escapeHtml(skill.version)} · ${escapeHtml(skill.skillFileName || skillFileNameForMaterialType(activeType.name, activeTypeId))}</strong>
            <small>${escapeHtml(skill.skillFileName || "SKILL.md")} · ${escapeHtml(skill.targetMaterialTypeName || activeType.name)} · ${escapeHtml(skill.isPreset ? "系统预设" : "自定义版本")} · ${escapeHtml(formatDate(skill.createdAt))}</small>
          </div>
          ${skill.version === latest.version ? `<span class="skill-current-badge">当前生效</span>` : ""}
        </div>
        <p>${escapeHtml(skill.summary || "暂无版本说明")}</p>
        <div class="skill-change-log">
          <div class="skill-change-log-head">
            <h4>版本差异日志</h4>
            ${previousSkill ? `<button class="material-skill-diff-link" type="button" data-skill-version-diff="${escapeHtml(skill.version)}">查看差异</button>` : ""}
          </div>
          <ul>${changeLog.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <details>
          <summary>查看 SKILL 组织规则</summary>
          <pre>${escapeHtml(skill.prompt || "")}</pre>
        </details>
      </article>
    `;
  }).join("");
  els.topicSkillPage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Skill Hall</p>
        <h2>话题 SKILL</h2>
      </div>
      <p>这里按资料类型管理话题拆解 SKILL.md，不同资料类型可以拥有不同的拆解方式。</p>
    </div>
    <nav class="module-anchor-nav" aria-label="话题 SKILL 定位">
      <button type="button" data-anchor-target="#skillCreate">发布新版本</button>
      <button type="button" data-anchor-target="#skillVersions">版本管理</button>
    </nav>
    <p class="category-notice" id="topicSkillNotice" data-tone="${escapeHtml(state.skillNotice.tone || "info")}">${escapeHtml(state.skillNotice.message || `当前生效版本会用于新的${activeType.name}材料分析，也会作为材料列表的可刷新目标。`)}</p>
    <div class="config-grid skill-config-grid">
      <section class="config-card config-theme-card" id="skillCreate">
        <h3>发布新版本</h3>
        <label class="config-field compact-config-field skill-type-field">
          <span>SKILL 类型来源</span>
          <select class="text-input" id="skillMaterialTypeSelect">${typeOptions}</select>
        </label>
        <p class="auth-note">适用材料类型：${escapeHtml(activeType.name)}。新版本默认继承上一版 SKILL.md 内容，只对当前登录用户生效。</p>
        <label class="config-field">
          <span>版本说明 <em>必填</em></span>
          <input class="text-input" id="newSkillSummary" type="text" placeholder="例如：强化原文证据约束，增加业务场景与管理动作拆解" value="${escapeHtml(latest.summary || "")}" />
        </label>
        <label class="config-field">
          <span>SKILL.md 内容 <em>必填</em></span>
          <textarea class="text-input skill-prompt-input" id="newSkillPrompt" rows="18" placeholder="写清楚话题抽取标准、文章模块顺序、证据要求、禁止事项等。">${escapeHtml(latest.prompt || "")}</textarea>
        </label>
        <button class="primary" id="createTopicSkillBtn" type="button" disabled>发布话题 SKILL 新版本</button>
      </section>
      <section class="config-card config-theme-card" id="skillVersions">
        <h3>版本管理</h3>
        <p class="auth-note">当前最新版本：${escapeHtml(latest.version)}。材料刷新后会保留历史版本，可在材料列表中切换查看。</p>
        <div class="skill-latest-actions">
          <button class="primary" data-open-skill-batch type="button" ${(!batchCandidates.length && !batchRunning && !batchCompleted) ? "disabled" : ""}>批量刷新材料</button>
          <span>${batchCandidates.length ? `有 ${escapeHtml(String(batchCandidates.length))} 份材料 / ${escapeHtml(String(batchCandidateTopicCount))} 个话题尚未使用最新 SKILL。` : "当前没有需要刷新到最新 SKILL 的材料。"}</span>
        </div>
        ${batchPanel}
        ${versions.length > 1 ? `
          <div class="skill-version-compare">
            <label class="config-field compact-config-field">
              <span>历史版本</span>
              <select class="text-input" id="skillCompareLeft">${versionOptions}</select>
            </label>
            <label class="config-field compact-config-field">
              <span>对比版本</span>
              <select class="text-input" id="skillCompareRight">${versionOptions}</select>
            </label>
            <button class="mini-button" id="skillCompareBtn" type="button">查看差异</button>
          </div>
        ` : ""}
        <div class="skill-version-list">
          ${versionRows || `<p class="empty-state compact">暂无 SKILL 版本。</p>`}
        </div>
      </section>
    </div>
  `;
  bindAnchorNav(els.topicSkillPage);
  els.topicSkillPage.querySelector("#skillMaterialTypeSelect")?.addEventListener("change", (event) => {
    state.activeSkillMaterialTypeId = event.target.value;
    state.skillNotice = { message: "", tone: "info" };
    renderTopicSkillPage();
  });
  els.topicSkillPage.querySelectorAll("[data-open-skill-batch]").forEach((button) => {
    button.addEventListener("click", () => openSkillBatchRefreshModal(activeTypeId));
  });
  const skillByRenderedVersion = (version) => versions.find((skill) => skill.version === version);
  els.topicSkillPage.querySelectorAll("[data-skill-version-diff]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = skillByRenderedVersion(button.dataset.skillVersionDiff);
      const previousSkill = previousSkillForVersion(skill, versions);
      if (!skill || !previousSkill) {
        setSkillNotice("这个版本暂无上一版可比较。", "info");
        return;
      }
      showSkillDiffCompareModal({
        title: `${skill.targetMaterialTypeName || activeType.name} · ${skill.version} 与上一版差异`,
        leftSkill: previousSkill,
        rightSkill: skill,
        leftLabel: "上一版本",
        rightLabel: "当前版本",
      });
    });
  });
  const compareLeft = els.topicSkillPage.querySelector("#skillCompareLeft");
  const compareRight = els.topicSkillPage.querySelector("#skillCompareRight");
  const compareButton = els.topicSkillPage.querySelector("#skillCompareBtn");
  if (compareLeft && defaultCompareLeft) {
    compareLeft.value = defaultCompareLeft;
  }
  if (compareRight && defaultCompareRight) {
    compareRight.value = defaultCompareRight;
  }
  const syncCompareButton = () => {
    if (compareButton) {
      compareButton.disabled = !compareLeft?.value || !compareRight?.value || compareLeft.value === compareRight.value;
    }
  };
  compareLeft?.addEventListener("change", syncCompareButton);
  compareRight?.addEventListener("change", syncCompareButton);
  compareButton?.addEventListener("click", () => {
    const leftSkill = skillByRenderedVersion(compareLeft?.value);
    const rightSkill = skillByRenderedVersion(compareRight?.value);
    if (!leftSkill || !rightSkill || leftSkill.version === rightSkill.version) {
      return;
    }
    showSkillDiffCompareModal({
      title: `${activeType.name} · SKILL 历史版本对比`,
      leftSkill,
      rightSkill,
      leftLabel: "左侧版本",
      rightLabel: "右侧版本",
    });
  });
  syncCompareButton();
  const summaryInput = els.topicSkillPage.querySelector("#newSkillSummary");
  const promptInput = els.topicSkillPage.querySelector("#newSkillPrompt");
  const createButton = els.topicSkillPage.querySelector("#createTopicSkillBtn");
  const syncButton = () => {
    if (createButton) {
      createButton.disabled = !summaryInput?.value.trim() || !promptInput?.value.trim();
    }
  };
  summaryInput?.addEventListener("input", syncButton);
  promptInput?.addEventListener("input", syncButton);
  createButton?.addEventListener("click", async () => {
    if (createButton.disabled) {
      return;
    }
    const diffLog = buildSkillDiffLog(latest, {
      summary: summaryInput.value,
      prompt: promptInput.value,
    });
    const ok = await confirmAction({
      title: "发布话题 SKILL 新版本",
      message: `确认发布新的${activeType.name}话题 SKILL 版本吗？\n\n与上一版差异：\n${diffLog.map((item) => `- ${item}`).join("\n")}\n\n发布后新的同类型材料分析会默认使用它，已有材料会出现 SKILL 刷新提示。`,
      confirmText: "确认发布",
    });
    if (ok) {
      await createTopicSkillVersion(summaryInput.value, promptInput.value, diffLog);
    }
  });
  syncButton();
}

function bindAnchorNav(root) {
  root?.querySelectorAll("[data-anchor-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = root.querySelector(button.dataset.anchorTarget);
      if (!target) {
        return;
      }
      if (button.dataset.anchorTarget === "#accountSettings") {
        scrollToModuleTop(root, "smooth");
        return;
      }
      const headerHeight = document.querySelector(".page-utility-bar")?.getBoundingClientRect().height || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });
  });
}

function scrollToModuleTop(root, behavior = "auto") {
  if (!root) {
    return;
  }
  requestAnimationFrame(() => {
    const headerHeight = document.querySelector(".page-utility-bar")?.getBoundingClientRect().height || 0;
    const targetTop = root.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior,
    });
  });
}

function renderArticleSkillPage() {
  if (!els.articleSkillPage) {
    return;
  }
  const versions = dedupeArticleSkills(state.articleSkills?.length ? state.articleSkills : [DEFAULT_ARTICLE_SKILL]);
  const latest = currentArticleSkill();
  const versionOptions = versions
    .map((skill) => `<option value="${escapeHtml(skill.version)}">${escapeHtml(skill.version)} · ${escapeHtml(skill.skillFileName || "文章 SKILL.md")}</option>`)
    .join("");
  const defaultCompareLeft = versions[1]?.version || versions[0]?.version || "";
  const defaultCompareRight = versions[0]?.version || "";
  const versionRows = versions.map((skill) => {
    const previousSkill = previousSkillForVersion(skill, versions);
    const changeLog = skillChangeLogForVersion(skill, versions);
    return `
      <article class="skill-version-card${skill.version === latest.version ? " is-current" : ""}">
        <div class="skill-version-head">
          <div>
            <strong>${escapeHtml(skill.version)} · ${escapeHtml(skill.skillFileName || "文章 SKILL.md")}</strong>
            <small>${escapeHtml(skill.name || "文章 SKILL")} · ${escapeHtml(skill.isPreset ? "系统预设" : "自定义版本")} · ${escapeHtml(formatDate(skill.createdAt))}</small>
          </div>
          ${skill.version === latest.version ? `<span class="skill-current-badge">当前生效</span>` : ""}
        </div>
        <p>${escapeHtml(skill.summary || "暂无版本说明")}</p>
        <div class="skill-change-log">
          <div class="skill-change-log-head">
            <h4>版本差异日志</h4>
            ${previousSkill ? `<button class="material-skill-diff-link" type="button" data-article-skill-version-diff="${escapeHtml(skill.version)}">查看差异</button>` : ""}
          </div>
          <ul>${changeLog.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <details>
          <summary>查看 ${escapeHtml(skill.skillFileName || "文章 SKILL.md")}</summary>
          <pre>${escapeHtml(skill.prompt || "")}</pre>
        </details>
      </article>
    `;
  }).join("");

  els.articleSkillPage.innerHTML = `
    <header class="admin-header">
      <div>
        <p class="section-kicker">Article Skill</p>
        <h2>文章 SKILL</h2>
      </div>
    </header>
    <nav class="module-anchor-nav" aria-label="文章 SKILL 定位">
      <button type="button" data-anchor-target="#articleSkillCreate">发布新版本</button>
      <button type="button" data-anchor-target="#articleSkillVersions">版本管理</button>
    </nav>
    <p class="category-notice" id="articleSkillNotice" data-tone="${escapeHtml(state.articleSkillNotice.tone || "info")}">${escapeHtml(state.articleSkillNotice.message || "当前最新文章 SKILL 会用于延伸文章推荐、生成和刷新。")}</p>
    <div class="config-grid skill-config-grid">
      <section class="config-card config-theme-card" id="articleSkillCreate">
        <h3>发布文章 SKILL 新版本</h3>
        <label class="config-field compact-config-field">
          <span>版本说明</span>
          <input class="text-input compact-text-input" id="newArticleSkillSummary" maxlength="80" placeholder="例如：强化六段结构和案例展开" />
        </label>
        <label class="config-field">
          <span>${escapeHtml(latest.skillFileName || "文章 SKILL.md")}</span>
          <textarea class="text-input skill-prompt-input" id="newArticleSkillPrompt" rows="18" placeholder="写清楚文章结构、篇幅、证据要求、禁止事项等。">${escapeHtml(latest.prompt || "")}</textarea>
        </label>
        <button class="primary" id="createArticleSkillBtn" type="button" disabled>发布文章 SKILL 新版本</button>
      </section>
      <section class="config-card config-theme-card" id="articleSkillVersions">
        <h3>版本管理</h3>
        <p class="auth-note">当前最新版本：${escapeHtml(latest.version)}。生成文章可按最新版本重新刷新正文。</p>
        ${versions.length > 1 ? `
          <div class="skill-version-compare">
            <label>
              <span>左侧版本</span>
              <select class="text-input" id="articleSkillCompareLeft">${versionOptions}</select>
            </label>
            <label>
              <span>右侧版本</span>
              <select class="text-input" id="articleSkillCompareRight">${versionOptions}</select>
            </label>
            <button class="mini-button" id="articleSkillCompareBtn" type="button">查看差异</button>
          </div>
        ` : ""}
        <div class="skill-version-list">
          ${versionRows || `<p class="empty-state compact">暂无文章 SKILL 版本。</p>`}
        </div>
      </section>
    </div>
  `;

  bindAnchorNav(els.articleSkillPage);
  const skillByRenderedVersion = (version) => versions.find((skill) => skill.version === version);
  els.articleSkillPage.querySelectorAll("[data-article-skill-version-diff]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = skillByRenderedVersion(button.dataset.articleSkillVersionDiff);
      const previousSkill = previousSkillForVersion(skill, versions);
      if (!skill || !previousSkill) {
        return;
      }
      showSkillDiffModal({
        title: `${skill.version} 与上一版文章 SKILL 差异`,
        leftSkill: previousSkill,
        rightSkill: skill,
        leftLabel: "上一版",
        rightLabel: "当前版",
      });
    });
  });
  const compareLeft = els.articleSkillPage.querySelector("#articleSkillCompareLeft");
  const compareRight = els.articleSkillPage.querySelector("#articleSkillCompareRight");
  const compareButton = els.articleSkillPage.querySelector("#articleSkillCompareBtn");
  if (compareLeft) {
    compareLeft.value = defaultCompareLeft;
  }
  if (compareRight) {
    compareRight.value = defaultCompareRight;
  }
  compareButton?.addEventListener("click", () => {
    const leftSkill = skillByRenderedVersion(compareLeft?.value);
    const rightSkill = skillByRenderedVersion(compareRight?.value);
    if (!leftSkill || !rightSkill || leftSkill.version === rightSkill.version) {
      setArticleSkillNotice("请选择两个不同的文章 SKILL 版本进行对比。", "error");
      return;
    }
    showSkillDiffModal({
      title: "文章 SKILL 历史版本差异",
      leftSkill,
      rightSkill,
      leftLabel: "左侧版本",
      rightLabel: "右侧版本",
    });
  });
  const summaryInput = els.articleSkillPage.querySelector("#newArticleSkillSummary");
  const promptInput = els.articleSkillPage.querySelector("#newArticleSkillPrompt");
  const createButton = els.articleSkillPage.querySelector("#createArticleSkillBtn");
  const syncCreateState = () => {
    const summary = summaryInput?.value.trim() || "";
    const prompt = promptInput?.value.trim() || "";
    if (createButton) {
      createButton.disabled = !summary || !prompt || prompt === (latest.prompt || "");
    }
  };
  summaryInput?.addEventListener("input", syncCreateState);
  promptInput?.addEventListener("input", syncCreateState);
  createButton?.addEventListener("click", async () => {
    const summary = summaryInput?.value.trim() || "";
    const prompt = promptInput?.value.trim() || "";
    const diffLog = buildSkillDiffLog(latest, { summary, prompt });
    const ok = await confirmAction({
      title: "发布文章 SKILL 新版本",
      message: `确认发布新的文章 SKILL 版本吗？\n\n与上一版差异：\n${diffLog.map((item) => `- ${item}`).join("\n")}\n\n发布后新的延伸文章生成会默认使用它，历史文章可手动刷新。`,
      confirmText: "确认发布",
    });
    if (ok) {
      await createArticleSkillVersion(summary, prompt, diffLog);
    }
  });
  syncCreateState();
}

function renderMaterialManagePage() {
  if (!els.materialManagePage) {
    return;
  }
  const sourceOptions = state.materialSources
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}${item.isPreset ? "（预设）" : ""}</option>`)
    .join("");
  const typeOptions = state.materialTypes
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}${item.isPreset ? "（预设）" : ""}</option>`)
    .join("");
  els.materialManagePage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Material</p>
        <h2>资料管理</h2>
      </div>
      <p>配置材料上传时使用的资料来源和资料类型。</p>
    </div>
    <nav class="module-anchor-nav" aria-label="资料管理定位">
      <button type="button" data-anchor-target="#sourceSettings">资料来源</button>
      <button type="button" data-anchor-target="#typeSettings">资料类型</button>
    </nav>
    <div class="config-grid">
      <section class="config-card config-theme-card" id="sourceSettings">
        <h3>资料来源配置</h3>
        <p class="auth-note">先选择已有来源进行修改，或选择“新增资料来源”。名称必填，最多20个字符。</p>
        <form class="material-config-form" id="sourceConfigForm">
          <label class="config-field compact-config-field">
            <span>资料来源</span>
            <select class="text-input" id="sourceConfigSelect">
              ${sourceOptions}
              <option value="__new__">新增资料来源</option>
            </select>
          </label>
          <label class="config-field compact-config-field">
            <span>来源名称 <em>必填</em></span>
            <input class="text-input compact-text-input" id="sourceConfigName" type="text" maxlength="20" required placeholder="最多20个字符" />
          </label>
          <button class="primary material-config-save" type="submit">保存资料来源</button>
        </form>
      </section>
      <section class="config-card config-theme-card" id="typeSettings">
        <h3>资料类型配置</h3>
        <p class="auth-note">资料类型会决定话题 SKILL 的类型。修改类型名称后，对应 SKILL 类型名称会同步更新，具体拆解方法在 SKILL.md 中维护。</p>
        <form class="material-config-form" id="typeConfigForm">
          <label class="config-field compact-config-field">
            <span>资料类型</span>
            <select class="text-input" id="typeConfigSelect">
              ${typeOptions}
              <option value="__new__">新增资料类型</option>
            </select>
          </label>
          <label class="config-field compact-config-field">
            <span>类型名称 <em>必填</em></span>
            <input class="text-input compact-text-input" id="typeConfigName" type="text" maxlength="20" required placeholder="最多20个字符" />
          </label>
          <button class="primary material-config-save" type="submit">保存资料类型</button>
        </form>
        <p class="auth-message" id="materialConfigMessage">${escapeHtml(state.materialConfigNotice.message || "")}</p>
      </section>
    </div>
  `;
  const notice = els.materialManagePage.querySelector("#materialConfigMessage");
  if (notice) {
    notice.dataset.tone = state.materialConfigNotice.tone || "info";
  }
  bindAnchorNav(els.materialManagePage);
  const sourceSelect = els.materialManagePage.querySelector("#sourceConfigSelect");
  const sourceName = els.materialManagePage.querySelector("#sourceConfigName");
  const typeSelect = els.materialManagePage.querySelector("#typeConfigSelect");
  const typeName = els.materialManagePage.querySelector("#typeConfigName");
  const syncSourceForm = () => {
    const item = state.materialSources.find((entry) => entry.id === sourceSelect?.value);
    if (sourceName) {
      sourceName.value = item?.name || "";
      sourceName.placeholder = sourceSelect?.value === "__new__" ? "例如：CEO Marks" : "最多20个字符";
    }
    syncMaterialConfigButtons();
  };
  const syncTypeForm = () => {
    const item = state.materialTypes.find((entry) => entry.id === typeSelect?.value);
    if (typeName) {
      typeName.value = item?.name || "";
      typeName.placeholder = typeSelect?.value === "__new__" ? "例如：会议纪要" : "最多20个字符";
    }
    syncMaterialConfigButtons();
  };
  const syncMaterialConfigButtons = () => {
    const sourceButton = els.materialManagePage.querySelector("#sourceConfigForm button[type='submit']");
    const typeButton = els.materialManagePage.querySelector("#typeConfigForm button[type='submit']");
    const sourceValue = String(sourceName?.value || "").trim();
    const typeValue = String(typeName?.value || "").trim();
    if (sourceButton) {
      sourceButton.disabled = !sourceValue || sourceValue.length > 20;
    }
    if (typeButton) {
      typeButton.disabled = !typeValue || typeValue.length > 20;
    }
  };
  sourceSelect?.addEventListener("change", syncSourceForm);
  typeSelect?.addEventListener("change", syncTypeForm);
  sourceName?.addEventListener("input", syncMaterialConfigButtons);
  typeName?.addEventListener("input", syncMaterialConfigButtons);
  syncSourceForm();
  syncTypeForm();
  els.materialManagePage.querySelector("#sourceConfigForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isNew = sourceSelect?.value === "__new__";
    const ok = await confirmAction({
      title: isNew ? "新增资料来源" : "修改资料来源",
      message: isNew ? "确认新增这个资料来源吗？" : "确认修改这个资料来源吗？历史材料中的来源名称也会同步更新。",
      confirmText: "确认保存",
    });
    if (!ok) {
      return;
    }
    if (isNew) {
      await createMaterialSource(sourceName.value);
    } else {
      await updateMaterialSourceConfig(sourceSelect.value, sourceName.value);
    }
    renderMaterialManagePage();
  });
  els.materialManagePage.querySelector("#typeConfigForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isNew = typeSelect?.value === "__new__";
    const ok = await confirmAction({
      title: isNew ? "新增资料类型" : "修改资料类型",
      message: isNew ? "确认新增这个资料类型吗？新增后可以在话题 SKILL 中配置对应 SKILL.md。" : "确认修改这个资料类型吗？对应 SKILL 类型名称会同步更新。",
      confirmText: "确认保存",
    });
    if (!ok) {
      return;
    }
    if (isNew) {
      await createMaterialType(typeName.value);
    } else {
      await updateMaterialTypeConfig(typeSelect.value, typeName.value);
    }
    renderMaterialManagePage();
  });
}

function renderRecyclePage() {
  if (!els.recyclePage || !isAdmin()) {
    return;
  }
  const users = [...new Set(state.allDocuments.filter((doc) => doc.deletedAt).map((doc) => doc.ownerEmail).filter(Boolean))].sort();
  const filter = String(state.recycleUserFilter || "").trim().toLowerCase();
  const docs = state.allDocuments
    .filter((doc) => doc.deletedAt)
    .filter((doc) => !filter || `${doc.ownerEmail} ${doc.ownerEmailKey}`.toLowerCase().includes(filter))
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
  const docRows = docs.map((doc) => {
    const topics = doc.analysis?.topics || [];
    const expanded = state.recycleExpandedDocIds.includes(doc.id);
    const topicList = expanded
      ? `
        <tr class="recycle-topic-row">
          <td colspan="6">
            <div class="recycle-topic-list">
              ${topics.length ? topics.map((topic, index) => `
                <button type="button" data-recycle-topic="${escapeHtml(doc.id)}" data-recycle-topic-index="${index}">
                  <span>${escapeHtml(topic.topicCode || topicCodeFromNumber(index + 1))}</span>
                  ${escapeHtml(topic.title || `话题${index + 1}`)}
                </button>
              `).join("") : `<p class="empty-state compact">这份材料没有关联话题。</p>`}
            </div>
          </td>
        </tr>
      `
      : "";
    return `
      <tr>
        <td><button class="link-button" type="button" data-recycle-doc-preview="${escapeHtml(doc.id)}">${escapeHtml(doc.title || doc.fileName)}</button></td>
        <td>${escapeHtml(doc.ownerEmail || "")}</td>
        <td>${escapeHtml(formatDate(doc.deletedAt))}</td>
        <td>${escapeHtml(doc.deletedBy || "")}</td>
        <td><button class="mini-button compact-mini" type="button" data-recycle-toggle="${escapeHtml(doc.id)}">${expanded ? "收起" : "展开"} ${escapeHtml(String(topics.length || 0))}</button></td>
        <td>
          <button class="mini-button" type="button" data-restore-doc="${escapeHtml(doc.id)}">恢复</button>
          <button class="mini-button danger" type="button" data-hard-delete-doc="${escapeHtml(doc.id)}">彻底删除</button>
        </td>
      </tr>
      ${topicList}
    `;
  }).join("");
  els.recyclePage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Recycle Bin</p>
        <h2>回收站</h2>
      </div>
      <p>所有用户删除的材料会先进入这里。恢复后相关话题重新出现；彻底删除后不可恢复。</p>
    </div>
    <div class="admin-toolbar">
      <input class="text-input" id="recycleUserFilter" list="recycleUserOptions" type="search" placeholder="按用户邮箱筛选" value="${escapeHtml(state.recycleUserFilter || "")}" />
      <datalist id="recycleUserOptions">${users.map((email) => `<option value="${escapeHtml(email)}"></option>`).join("")}</datalist>
    </div>
    <section class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>材料</th><th>用户</th><th>删除时间</th><th>删除人</th><th>话题</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${docs.length ? docRows : `<tr><td colspan="6">回收站为空。</td></tr>`}
        </tbody>
      </table>
    </section>
    <section class="recycle-preview-panel" id="recyclePreviewPanel">
      ${buildRecyclePreviewHtml(docs)}
    </section>
  `;
  els.recyclePage.querySelector("#recycleUserFilter")?.addEventListener("input", (event) => {
    state.recycleUserFilter = event.target.value;
    renderRecyclePage();
  });
  els.recyclePage.querySelectorAll("[data-recycle-doc-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      const docId = button.dataset.recycleDocPreview;
      const isExpanded = state.recycleExpandedDocIds.includes(docId);
      state.recycleExpandedDocIds = isExpanded
        ? state.recycleExpandedDocIds.filter((id) => id !== docId)
        : [...state.recycleExpandedDocIds, docId];
      state.recyclePreview = isExpanded && state.recyclePreview.type === "doc" && state.recyclePreview.docId === docId
        ? { type: "", docId: "", topicIndex: 0 }
        : { type: "doc", docId, topicIndex: 0 };
      renderRecyclePage();
    });
  });
  els.recyclePage.querySelectorAll("[data-recycle-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const docId = button.dataset.recycleToggle;
      state.recycleExpandedDocIds = state.recycleExpandedDocIds.includes(docId)
        ? state.recycleExpandedDocIds.filter((id) => id !== docId)
        : [...state.recycleExpandedDocIds, docId];
      renderRecyclePage();
    });
  });
  els.recyclePage.querySelectorAll("[data-recycle-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.recyclePreview = {
        type: "topic",
        docId: button.dataset.recycleTopic,
        topicIndex: Number(button.dataset.recycleTopicIndex || 0),
      };
      renderRecyclePage();
    });
  });
  els.recyclePage.querySelectorAll("[data-restore-doc]").forEach((button) => {
    button.addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "恢复材料",
        message: "确认恢复这份材料吗？恢复后相关话题会重新出现在话题列表。",
        confirmText: "确认恢复",
      });
      if (ok) {
        await restoreDocument(button.dataset.restoreDoc);
      }
    });
  });
  els.recyclePage.querySelectorAll("[data-hard-delete-doc]").forEach((button) => {
    button.addEventListener("click", async () => {
      const ok = await confirmAction({
        title: "彻底删除材料",
        message: "确认彻底删除这份材料吗？此操作不可恢复。",
        confirmText: "彻底删除",
        tone: "danger",
      });
      if (ok) {
        await hardDeleteDocument(button.dataset.hardDeleteDoc);
      }
    });
  });
}

function recycleTopicRow(doc, topic, index) {
  return {
    id: `${doc.id}::${index}`,
    docId: doc.id,
    docTitle: doc.title,
    doc,
    topic,
    topicIndex: index,
    displayIndex: topic.topicCode || topicCodeFromNumber(index + 1),
    title: topic.title || `话题${index + 1}`,
    tags: [...new Set([...(topic.problemTypes || []), ...(doc.tags || [])])].slice(0, 5),
    type: materialTypeNameForDoc(doc),
    source: materialSourceNameForDoc(doc),
    ownerEmail: doc.ownerEmail || "",
    ownerEmailKey: doc.ownerEmailKey || "",
    updatedAt: doc.lastStudiedAt || doc.updatedAt || doc.createdAt,
  };
}

function buildRecyclePreviewHtml(docs) {
  const preview = state.recyclePreview || {};
  const doc = docs.find((item) => item.id === preview.docId);
  if (!doc) {
    return `<p class="empty-state compact">点击材料名称查看材料内容，或展开话题后点击话题查看解析。</p>`;
  }
  if (preview.type === "topic") {
    const topic = doc.analysis?.topics?.[preview.topicIndex];
    if (!topic) {
      return `<p class="empty-state compact">没有找到这个话题。</p>`;
    }
    return `
      <div class="recycle-preview-header">
        <p class="section-kicker">话题预览</p>
      </div>
      <article class="topic-article recycle-topic-preview">
        ${buildTopicArticleHtml(topic, recycleTopicRow(doc, topic, preview.topicIndex))}
      </article>
    `;
  }
  const isCurrentDoc = preview.type === "doc" && preview.docId === doc.id;
  if (!isCurrentDoc) {
    return `<p class="empty-state compact">点击材料名称查看材料内容，或展开话题后点击话题查看解析。</p>`;
  }
  const paragraphs = formatOriginalParagraphs(doc.rawText || "");
  const body = paragraphs.length
    ? paragraphs.map((paragraph) => renderOriginalParagraph(paragraph)).join("")
    : `<p class="empty-state compact">这份材料没有可展示的原文。</p>`;
  return `
    <div class="recycle-preview-header">
      <p class="section-kicker">材料预览</p>
      <h3>${escapeHtml(doc.title || doc.fileName)}</h3>
    </div>
    <div class="topic-meta source-meta">
      <span class="pill">用户：${escapeHtml(doc.ownerEmail || "")}</span>
      <span class="pill">资料来源：${escapeHtml(materialSourceNameForDoc(doc))}</span>
      <span class="pill">资料类型：${escapeHtml(materialTypeNameForDoc(doc))}</span>
    </div>
    <div class="topic-original-body recycle-original-preview">${body}</div>
  `;
}

function readSystemVersionState() {
  try {
    return JSON.parse(localStorage.getItem(SYSTEM_VERSION_STATE_KEY) || localStorage.getItem(LEGACY_SYSTEM_VERSION_STATE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveSystemVersionState(next) {
  localStorage.setItem(SYSTEM_VERSION_STATE_KEY, JSON.stringify(next));
  localStorage.removeItem(LEGACY_SYSTEM_VERSION_STATE_KEY);
}

function canRollbackVersion(version) {
  const ageMs = Date.now() - new Date(version.date).getTime();
  return ageMs <= 30 * 24 * 60 * 60 * 1000;
}

function renderVersionPage() {
  if (!els.versionPage) {
    return;
  }
  const versionState = readSystemVersionState();
  const currentVersion = versionState.activeVersion || SYSTEM_VERSIONS[0].version;
  els.versionPage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Release Notes</p>
        <h2>系统版本</h2>
      </div>
      <p>当前系统版本：${escapeHtml(currentVersion)}。普通用户可查看更新日志；管理员可登记 30 天内版本还原。</p>
    </div>
    <div class="version-list">
      ${SYSTEM_VERSIONS.map((version) => `
        <article class="version-card${version.version === currentVersion ? " is-active" : ""}">
          <div>
            <strong>${escapeHtml(version.version)} · ${escapeHtml(version.title)}</strong>
            <small>${escapeHtml(formatVersionDate(version))}${version.version === currentVersion ? " · 当前版本" : ""}</small>
          </div>
          <ul>${version.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join("")}</ul>
          ${isAdmin() ? `<div class="version-actions"><button class="mini-button version-rollback-button" type="button" data-version-rollback="${escapeHtml(version.version)}" ${canRollbackVersion(version) ? "" : "disabled"}>版本还原</button></div>` : ""}
        </article>
      `).join("")}
    </div>
  `;
  els.versionPage.querySelectorAll("[data-version-rollback]").forEach((button) => {
    button.addEventListener("click", async () => {
      const version = SYSTEM_VERSIONS.find((item) => item.version === button.dataset.versionRollback);
      const ok = await confirmAction({
        title: "版本还原",
        message: `确认将系统版本标记还原到 ${version.version} 吗？当前静态原型会记录还原版本和操作日志。`,
        confirmText: "确认还原",
      });
      if (!ok) {
        return;
      }
      saveSystemVersionState({
        activeVersion: version.version,
        rollbackAt: new Date().toISOString(),
        rollbackBy: state.currentUser.email,
      });
      await logEvent("rollback_version", { version: version.version });
      renderVersionPage();
    });
  });
}

function renderAdminPage(revealedPassword = "", targetEmail = "") {
  if (!els.adminPage) {
    return;
  }
  if (!isAdmin()) {
    els.adminPage.innerHTML = `<p class="empty-state">只有 Simon.Lv@fanruan.com 可以进入管理后台。</p>`;
    return;
  }

  const userRows = state.users
    .map((user) => {
      const userDocs = state.allDocuments.filter((doc) => (doc.ownerEmailKey || "").toLowerCase() === user.emailKey);
      const activeDocsForUser = userDocs.filter((doc) => !doc.deletedAt);
      const deletedDocsForUser = userDocs.filter((doc) => doc.deletedAt);
      const activeTopicCount = activeDocsForUser.reduce((sum, doc) => sum + Number(doc.analysis?.topics?.length || 0), 0);
      const deletedTopicCount = deletedDocsForUser.reduce((sum, doc) => sum + Number(doc.analysis?.topics?.length || 0), 0);
      const statusText = user.status === "active" ? "已开通" : "待分配密码";
      const resetText = user.pendingReset ? "有找回申请" : "无";
      const action = user.emailKey === state.currentUser.emailKey
        ? `<span class="muted-text">超级管理员</span>`
        : `<button class="mini-button" type="button" data-user-action="activate" data-email-key="${escapeHtml(user.emailKey)}">${user.status === "active" ? "重置密码" : "生成初始密码"}</button>`;
      return `
        <tr>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.role === "admin" ? "管理员" : "用户")}</td>
          <td>${statusText}</td>
          <td>${formatDate(user.registeredAt || user.createdAt)}</td>
          <td>${user.lastLoginAt ? formatDate(user.lastLoginAt) : "未登录"}</td>
          <td>${user.loginCount || 0}</td>
          <td>${user.visitCount || 0}</td>
          <td>${activeDocsForUser.length}</td>
          <td>${activeTopicCount}</td>
          <td>${deletedDocsForUser.length}</td>
          <td>${deletedTopicCount}</td>
          <td>${resetText}</td>
          <td>${action}</td>
        </tr>
      `;
    })
    .join("");

  const totalDocs = state.documents.length;
  const pendingUsers = state.users.filter((user) => user.status !== "active").length;
  const resetUsers = state.users.filter((user) => user.pendingReset).length;
  const activeUsers = state.users.filter((user) => user.status === "active").length;
  const reveal = revealedPassword
    ? `
      <section class="password-reveal">
        <h3>已为 ${escapeHtml(targetEmail)} 生成密码</h3>
        <p>请把下面的密码发送给对方；页面刷新后不会再次显示。</p>
        <code>${escapeHtml(revealedPassword)}</code>
      </section>
    `
    : "";

  els.adminPage.innerHTML = `
    <div class="admin-header">
      <div>
        <p class="section-kicker">Admin Console</p>
        <h2>用户与平台管理</h2>
      </div>
      <p>超级管理员：${ADMIN_EMAIL}</p>
    </div>
    <section class="admin-metrics">
      <div><strong>${state.users.length}</strong><span>登记用户</span></div>
      <div><strong>${activeUsers}</strong><span>已开通</span></div>
      <div><strong>${pendingUsers}</strong><span>待处理</span></div>
      <div><strong>${resetUsers}</strong><span>找回申请</span></div>
      <div><strong>${totalDocs}</strong><span>可见文档</span></div>
    </section>
    ${reveal}
    <section class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>最近登录</th>
            <th>登录</th>
            <th>访问</th>
            <th>文档数量</th>
            <th>话题数量</th>
            <th>已删除文档</th>
            <th>已删除话题</th>
            <th>找回</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${userRows}</tbody>
      </table>
    </section>
  `;

  els.adminPage.querySelectorAll("[data-user-action='activate']").forEach((button) => {
    button.addEventListener("click", async () => {
      const isReset = button.textContent.includes("重置");
      const ok = await confirmAction({
        title: isReset ? "重置用户密码" : "生成初始密码",
        message: isReset ? "确认为该用户重置密码吗？旧密码将不能继续使用。" : "确认为该用户生成初始密码吗？生成后请复制给对方。",
        confirmText: isReset ? "确认重置" : "确认生成",
      });
      if (ok) {
        await activateUser(button.dataset.emailKey, isReset ? "reset" : "initial");
      }
    });
  });
}

function formatDate(value) {
  if (!value) {
    return "刚刚";
  }
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatVersionDate(version) {
  if (!isAdmin()) {
    return version.date;
  }
  const date = new Date(version.updatedAt || `${version.date}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) {
    return version.date;
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
}

async function loadDocumentIntoWorkspace(id) {
  const doc = state.documents.find((item) => item.id === id);
  if (!doc) {
    return;
  }
  const now = new Date().toISOString();
  const studiedDoc = { ...doc, lastStudiedAt: now };
  await withStore(DOC_STORE, "readwrite", (store) => store.put(studiedDoc));
  state.currentDocId = doc.id;
  state.lastViewedDocId = doc.id;
  state.fileName = doc.fileName || doc.title;
  state.rawText = doc.rawText || "";
  state.analysis = doc.analysis || analyzeText(state.rawText);
  state.activeTopic = 0;
  state.drillStack = [];
  setUploadLocked(true);
  els.docNameInput.value = doc.title || "";
  renderCategoryControls();
  els.docCategorySelect.value = doc.categoryId || "";
  els.tagInput.value = (doc.tags || []).join(", ");
  els.sourceText.value = state.rawText;
  renderAnalysis();
  renderDrillEmpty();
  await loadDocuments();
  switchModule("learning");
  switchStudyView("analysis");
  els.parseHint.textContent = `已切换到：${doc.title}`;
}

function openDrill(question, topic) {
  if (!question || !topic) {
    return;
  }
  state.drillStack = [buildDrillNode(question, topic, 1)];
  renderDrillPage();
  switchModule("learning");
  switchStudyView("drill");
}

function continueDrill(question) {
  const current = state.drillStack[state.drillStack.length - 1];
  if (!current) {
    return;
  }
  state.drillStack.push(buildDrillNode(question, current.topic, current.depth + 1));
  renderDrillPage();
  switchModule("learning");
  switchStudyView("drill");
}

function buildDrillNode(question, topic, depth) {
  return {
    question,
    topic,
    depth,
    why: buildDrillWhy(question, topic),
    framework: buildDrillFramework(question, topic),
    evidence: topic.evidence.slice(0, 3),
    exercise: buildDrillExercise(question, topic),
    nextQuestions: buildNextQuestions(question, topic, depth),
  };
}

function buildDrillWhy(question, topic) {
  if (/矛盾|本质|真实/.test(question)) {
    return `这个问题的价值，是逼你把“${topic.category.name}”从观点层继续下探到矛盾层。只有说清楚矛盾，CEO 的做法才不是一句正确的话，而是一套能迁移的判断方法。`;
  }
  if (/关键|动作|忽略/.test(question)) {
    return `这个问题把注意力放在动作上：同样的管理理念，不同动作会产生完全不同的组织结果。学习材料，关键不是记住结论，而是找出哪个动作让结论成立。`;
  }
  return `这个问题用于判断方法的适用边界。你不是把 CEO 的话原样搬走，而是理解它在什么条件下有效、迁移时需要改哪一层。`;
}

function buildDrillFramework(question, topic) {
  return [
    `先定义问题：这是不是一个${topic.category.name}问题，还是被包装成${topic.category.name}的其他问题？`,
    `再找矛盾：CEO 的原文里，哪一组冲突最明显，例如长期与短期、总部与一线、经验与数据、速度与质量？`,
    "然后看机制：讲话中有没有把个人判断沉淀为流程、数据、激励或组织共识？",
    "最后做迁移：换到你的业务场景时，保留底层逻辑，调整具体做法。",
  ];
}

function buildDrillExercise(question, topic) {
  return [
    `用一句话写下你对“${question}”的当前答案。`,
    "从原文依据里选一句最能支撑答案的话，解释它为什么关键。",
    "把答案转成一个下周可执行动作，并明确一个反馈指标。",
  ];
}

function buildNextQuestions(question, topic, depth) {
  const categoryName = topic.category.name;
  const templates = [
    `如果 CEO 重新回答这个问题，他会先看哪三个事实？`,
    `这个${categoryName}问题背后，最大的利益冲突或认知冲突是什么？`,
    `哪些做法只是表层动作，哪些才是能复制的底层机制？`,
    `如果把它迁移到我的团队，第一步最小试点应该怎么设计？`,
    `这个方法在什么情况下会失效，我需要提前设置什么保护栏？`,
  ];
  const offset = Math.min(depth - 1, 2);
  return templates.slice(offset, offset + 3);
}

function renderDrillPage() {
  const current = state.drillStack[state.drillStack.length - 1];
  if (!current) {
    renderDrillEmpty();
    return;
  }

  const trail = state.drillStack
    .map((item, index) => `<button class="trail-button" type="button" data-depth="${index}">${index + 1}. ${escapeHtml(item.question)}</button>`)
    .join("");
  const evidence = current.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const framework = current.framework.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const exercise = current.exercise.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const next = current.nextQuestions
    .map((item, index) => `
      <button class="next-question" type="button" data-next-index="${index}">
        <span>继续分析</span>
        <strong>${escapeHtml(item)}</strong>
      </button>
    `)
    .join("");

  els.drillPage.innerHTML = `
    <div class="drill-hero">
      <p class="section-kicker">话题分析 · 第 ${current.depth} 层</p>
      <h2>${escapeHtml(current.question)}</h2>
      <div class="topic-meta">
        <span class="pill">来源话题：${escapeHtml(current.topic.title)}</span>
        <span class="pill">类型：${escapeHtml(current.topic.category.name)}</span>
        <button class="drill-back" type="button">回到话题文章</button>
      </div>
    </div>
    <div class="drill-trail">${trail}</div>
    ${drillBlock("为什么要分析这个问题", `<p>${escapeHtml(current.why)}</p>`)}
    ${drillBlock("回到原文", `<ul>${evidence}</ul>`)}
    ${drillBlock("拆解框架", `<ol>${framework}</ol>`)}
    ${drillBlock("学习练习", `<ol>${exercise}</ol>`)}
    <section class="drill-block">
      <h3>下一步分析</h3>
      <div class="next-grid">${next}</div>
    </section>
  `;

  els.drillPage.querySelectorAll(".next-question").forEach((button) => {
    button.addEventListener("click", () => {
      guardAnalysisNavigation(() => continueDrill(current.nextQuestions[Number(button.dataset.nextIndex)]));
    });
  });
  els.drillPage.querySelectorAll(".trail-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.drillStack = state.drillStack.slice(0, Number(button.dataset.depth) + 1);
      renderDrillPage();
    });
  });
  els.drillPage.querySelector(".drill-back").addEventListener("click", () => guardAnalysisNavigation(() => switchStudyView("analysis")));
}

function drillBlock(title, body) {
  return `
    <section class="drill-block">
      <h3>${escapeHtml(title)}</h3>
      ${body}
    </section>
  `;
}

function renderDrillEmpty() {
  els.drillPage.innerHTML = `<p class="empty-state">选择一个话题后，这里会展示可深入阅读的内容。</p>`;
}

function renderQuotes(quotes) {
  if (!els.quoteList) {
    return;
  }
  els.quoteList.innerHTML = "";
  if (!quotes.length) {
    els.quoteList.innerHTML = `<p class="empty-state">这里会沉淀最值得反复学习的原文句子。</p>`;
    return;
  }
  quotes.forEach((quote) => {
    const block = document.createElement("blockquote");
    block.className = "quote-item";
    block.textContent = quote;
    els.quoteList.appendChild(block);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cssEscape(value) {
  if (window.CSS?.escape) {
    return CSS.escape(String(value));
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

async function handleFile(file) {
  if (state.uploadLocked) {
    setAnalysisProgress("已锁定", Number(els.analysisProgressPercent?.textContent?.replace("%", "") || 0), "当前已有材料，请点击“重置”后再重新上传。");
    return;
  }
  state.currentDocId = "";
  state.fileName = file.name;
  els.docNameInput.value = file.name.replace(/\.[^.]+$/, "");
  els.parseHint.textContent = `正在读取：${file.name}`;

  try {
    if (file.name.toLowerCase().endsWith(".docx")) {
      const buffer = await file.arrayBuffer();
      state.rawText = await extractDocxText(buffer);
    } else {
      state.rawText = await file.text();
    }
    els.sourceText.value = state.rawText;
    const previewAnalysis = analyzeText(state.rawText);
    if (!els.tagInput.value.trim() && previewAnalysis.suggestedTags?.length) {
      els.tagInput.value = previewAnalysis.suggestedTags.join(", ");
    }
    renderOriginalText(state.rawText);
    setUploadLocked(true);
    els.parseHint.textContent = `已读取：${file.name}，已识别核心标签，可选择分类后点击“执行”。`;
  } catch (error) {
    console.error(error);
    els.parseHint.textContent = `读取失败：${error.message}`;
  }
}

async function handleFiles(files) {
  const list = Array.from(files || []).filter(Boolean);
  if (!list.length) {
    return;
  }
  if (state.isAnalyzing || state.uploadLocked) {
    setUploadLog("分析中", "大模型正在执行分析，暂时不能继续上传。");
    return;
  }
  if (state.draftUploadItems.length + state.uploadItems.length + list.length > MAX_UPLOAD_FILES) {
    setUploadLog("超过限制", `最多保留 ${MAX_UPLOAD_FILES} 份待处理材料，当前已有 ${state.draftUploadItems.length + state.uploadItems.length} 份。`);
    if (els.fileInput) {
      els.fileInput.value = "";
    }
    return;
  }
  const oversized = list.find((file) => file.size > MAX_UPLOAD_FILE_SIZE);
  if (oversized) {
    setUploadLog("文件过大", `${oversized.name} 为 ${formatFileSize(oversized.size)}，单个文件不能超过 50MB。`);
    if (els.fileInput) {
      els.fileInput.value = "";
    }
    return;
  }
  state.uploadBatchSaved = false;
  state.uploadAnalysisCompleted = false;
  state.currentDocId = "";
  state.fileName = [...state.draftUploadItems.map((item) => item.fileName), ...list.map((file) => file.name)].join("、");
  setUploadLog("读取材料", `正在读取 ${list.length} 个材料。最多 ${MAX_UPLOAD_FILES} 份，单个文件不超过 50MB。`);
  try {
    for (let index = 0; index < list.length; index += 1) {
      const file = list[index];
      let rawText = "";
      if (file.name.toLowerCase().endsWith(".docx")) {
        const buffer = await file.arrayBuffer();
        rawText = await extractDocxText(buffer);
      } else {
        rawText = await file.text();
      }
      const nextItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fileName: file.name,
        fileSize: file.size,
        title: file.name.replace(/\.[^.]+$/, ""),
        rawText,
        wordCount: normalizeText(rawText).length,
        materialSourceId: "",
        materialTypeId: "",
        selected: true,
        overwrite: false,
      };
      nextItem.fileFingerprint = materialFingerprint(nextItem.fileName, nextItem.fileSize, nextItem.rawText);
      const duplicateDoc = findDuplicateDocument(nextItem);
      if (duplicateDoc) {
        nextItem.existingDocId = duplicateDoc.id;
        nextItem.existingDocTitle = duplicateDoc.title;
      }
      state.draftUploadItems.push(nextItem);
      setUploadLog("读取材料", duplicateDoc ? `已读取 ${index + 1}/${list.length}：${file.name}，发现个人历史同名/同内容材料。` : `已读取 ${index + 1}/${list.length}：${file.name}`);
    }
    const combinedText = state.draftUploadItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
    state.rawText = combinedText;
    els.sourceText.value = combinedText;
    els.docNameInput.value = state.draftUploadItems.length === 1 ? state.draftUploadItems[0].title : `批量材料 ${state.draftUploadItems.length} 篇`;
    renderUploadMaterialList();
    setUploadLocked(false);
    setUploadLog("待保存", `已读取 ${state.draftUploadItems.length} 个材料，请逐份选择资料来源和材料场景并点击保存。`);
  } catch (error) {
    setUploadLog("读取失败", `读取失败：${error.message}`);
  } finally {
    if (els.fileInput) {
      els.fileInput.value = "";
    }
  }
}

function normalizeArticleUrl(value = "") {
  const url = new URL(String(value).trim());
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("只支持 http 或 https 链接。");
  }
  return url.toString();
}

function articleTitleFromUrl(url) {
  const parsed = new URL(url);
  const slug = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() || parsed.hostname)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return slug || parsed.hostname;
}

function extractArticleFromHtml(html, url) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("script, style, noscript, iframe, svg, canvas, nav, header, footer, aside, form, button").forEach((node) => node.remove());
  const title = doc.querySelector("meta[property='og:title']")?.content
    || doc.querySelector("meta[name='twitter:title']")?.content
    || doc.querySelector("title")?.textContent
    || articleTitleFromUrl(url);
  const candidates = [
    doc.querySelector("article"),
    doc.querySelector("main"),
    doc.querySelector("[role='main']"),
    doc.body,
  ].filter(Boolean);
  let best = "";
  for (const node of candidates) {
    const text = normalizeText(node.textContent || "");
    if (text.length > best.length) {
      best = text;
    }
  }
  return {
    title: normalizeText(title).slice(0, 120) || articleTitleFromUrl(url),
    rawText: best,
  };
}

async function fetchArticleFromUrl(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!/text\/html|text\/plain|application\/xhtml\+xml/i.test(contentType)) {
      throw new Error(`URL 返回的不是网页正文：${contentType || "未知类型"}`);
    }
    const body = await response.text();
    return /text\/plain/i.test(contentType)
      ? { title: articleTitleFromUrl(url), rawText: normalizeText(body) }
      : extractArticleFromHtml(body, url);
  } catch (error) {
    const response = await fetch("/api/url/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.message || detail.error || `URL 读取失败：${error.message}`);
    }
    return response.json();
  }
}

async function handleUrlImport(value) {
  if (state.isAnalyzing || state.uploadLocked) {
    setUploadLog("分析中", "大模型正在执行分析，暂时不能继续导入 URL。");
    return;
  }
  if (state.draftUploadItems.length + state.uploadItems.length + 1 > MAX_UPLOAD_FILES) {
    setUploadLog("超过限制", `最多保留 ${MAX_UPLOAD_FILES} 份待处理材料，当前已有 ${state.draftUploadItems.length + state.uploadItems.length} 份。`);
    return;
  }
  let url = "";
  try {
    url = normalizeArticleUrl(value);
  } catch (error) {
    setUploadLog("URL 无效", error.message);
    return;
  }
  state.uploadBatchSaved = false;
  state.uploadAnalysisCompleted = false;
  setUploadLog("读取 URL", `正在读取文章：${url}`);
  try {
    const article = await fetchArticleFromUrl(url);
    const rawText = normalizeText(article.rawText || "");
    if (rawText.length < 100) {
      throw new Error("没有解析到足够正文内容，请检查链接是否需要登录，或改为上传/粘贴文档。");
    }
    const title = normalizeText(article.title || articleTitleFromUrl(url)).slice(0, 80);
    const nextItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fileName: url,
      fileSize: new Blob([rawText]).size,
      title,
      rawText,
      sourceUrl: url,
      wordCount: normalizeText(rawText).length,
      materialSourceId: "",
      materialTypeId: "",
      selected: true,
      overwrite: false,
    };
    nextItem.fileFingerprint = materialFingerprint(nextItem.fileName, nextItem.fileSize, nextItem.rawText);
    const duplicateDoc = findDuplicateDocument(nextItem);
    if (duplicateDoc) {
      nextItem.existingDocId = duplicateDoc.id;
      nextItem.existingDocTitle = duplicateDoc.title;
    }
    state.draftUploadItems.push(nextItem);
    state.rawText = state.draftUploadItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
    if (els.sourceText) {
      els.sourceText.value = state.rawText;
    }
    if (els.docNameInput) {
      els.docNameInput.value = state.draftUploadItems.length === 1 ? title : `批量材料 ${state.draftUploadItems.length} 篇`;
    }
    if (els.urlInput) {
      els.urlInput.value = "";
    }
    renderUploadMaterialList();
    setUploadLocked(false);
    setUploadLog("待保存", `已读取 URL 文章：${title}。请选择资料来源和材料场景后点击保存。`);
  } catch (error) {
    setUploadLog("读取失败", `URL 读取失败：${error.message}`);
  }
}

function readUInt16(data, offset) {
  return data[offset] | (data[offset + 1] << 8);
}

function readUInt32(data, offset) {
  return (
    data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    (data[offset + 3] << 24)
  ) >>> 0;
}

function findEndOfCentralDirectory(data) {
  for (let offset = data.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32(data, offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error("无法识别 docx 文件结构。");
}

function decodeBytes(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}

function parseZipEntries(data) {
  const eocd = findEndOfCentralDirectory(data);
  const entryCount = readUInt16(data, eocd + 10);
  const centralOffset = readUInt32(data, eocd + 16);
  const entries = [];
  let offset = centralOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (readUInt32(data, offset) !== 0x02014b50) {
      throw new Error("docx 中央目录损坏。");
    }

    const method = readUInt16(data, offset + 10);
    const compressedSize = readUInt32(data, offset + 20);
    const uncompressedSize = readUInt32(data, offset + 24);
    const fileNameLength = readUInt16(data, offset + 28);
    const extraLength = readUInt16(data, offset + 30);
    const commentLength = readUInt16(data, offset + 32);
    const localOffset = readUInt32(data, offset + 42);
    const nameStart = offset + 46;
    const name = decodeBytes(data.slice(nameStart, nameStart + fileNameLength));

    entries.push({
      name,
      method,
      compressedSize,
      uncompressedSize,
      localOffset,
    });

    offset = nameStart + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

async function inflateRaw(bytes) {
  if (!("DecompressionStream" in window)) {
    throw new Error("当前浏览器不支持离线解压 docx，请换用 Chrome/Edge，或粘贴正文。");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
}

async function readZipFile(data, entry) {
  const offset = entry.localOffset;
  if (readUInt32(data, offset) !== 0x04034b50) {
    throw new Error(`无法读取文件：${entry.name}`);
  }

  const fileNameLength = readUInt16(data, offset + 26);
  const extraLength = readUInt16(data, offset + 28);
  const dataStart = offset + 30 + fileNameLength + extraLength;
  const compressed = data.slice(dataStart, dataStart + entry.compressedSize);

  if (entry.method === 0) {
    return compressed;
  }
  if (entry.method === 8) {
    return inflateRaw(compressed);
  }
  throw new Error(`不支持的 docx 压缩方式：${entry.method}`);
}

async function extractDocxText(buffer) {
  const data = new Uint8Array(buffer);
  const entries = parseZipEntries(data);
  const documentEntry = entries.find((entry) => entry.name === "word/document.xml");
  if (!documentEntry) {
    throw new Error("没有找到 word/document.xml。");
  }

  const xmlBytes = await readZipFile(data, documentEntry);
  const xml = decodeBytes(xmlBytes);
  return extractTextFromDocumentXml(xml);
}

function extractTextFromDocumentXml(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const paragraphs = [...doc.getElementsByTagNameNS("*", "p")];
  const lines = paragraphs
    .map((paragraph) => {
      const pieces = [...paragraph.getElementsByTagNameNS("*", "t")].map((node) => node.textContent || "");
      return pieces.join("");
    })
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    const textNodes = [...doc.getElementsByTagNameNS("*", "t")].map((node) => node.textContent || "");
    return normalizeText(textNodes.join(""));
  }

  return normalizeText(lines.join("\n\n"));
}

function startAnalysisTicker(item, index, total, skillDisplay = "话题拆解 SKILL") {
  const isTrainingSkill = /培训/.test(skillDisplay);
  const messages = isTrainingSkill
    ? [
        "正在等待大模型返回结构化 JSON。",
        "正在按知识点和概念拆解培训内容。",
        "正在梳理讲解场景、注意问题和知识扩展。",
        "长文分析可能需要更久，请保持页面打开。",
      ]
    : [
        "正在等待大模型返回结构化 JSON。",
        "正在拆解话题、证据和问题实质。",
        "正在生成解法、理论锚点和案例对照。",
        "长文分析可能需要更久，请保持页面打开。",
      ];
  let tick = 0;
  return window.setInterval(() => {
    const percent = Math.min(78, 55 + Math.round(((index + 0.35) / Math.max(1, total)) * 22) + tick);
    setAnalysisProgress("模型分析", percent, `第 ${index + 1}/${total} 份：${item.title}，使用 ${skillDisplay}，${messages[tick % messages.length]}`);
    tick += 1;
  }, 7000);
}

async function runAnalyze() {
  if (state.draftUploadItems.length) {
    setAnalysisProgress("未保存", 0, "请先点击保存，把本次上传材料归入下方待分析清单后再执行分析。");
    return;
  }
  if (!state.uploadItems.length) {
    setAnalysisProgress("未就绪", 0, "请先上传材料并保存到待分析清单。");
    return;
  }
  const analyzedItems = selectedUploadItems();
  if (!analyzedItems.length) {
    setAnalysisProgress("未选择", 0, "请至少勾选一份需要执行分析的材料。");
    return;
  }
  if (analyzedItems.some((item) => !uploadItemReady(item))) {
    setAnalysisProgress("未就绪", 0, "请先为勾选的材料选择资料来源和材料场景。");
    return;
  }
  state.rawText = analyzedItems.map((item) => `【${item.title}】\n${item.rawText}`).join("\n\n");
  const skillPlan = analyzedItems.map((item, index) => `${index + 1}. ${item.title} → ${uploadItemSkillDisplay(item)}`);
  const uniqueSkillNames = [...new Set(analyzedItems.map((item) => uploadItemSkillDisplay(item)))];
  resetAnalysisLog();
  setAnalysisProgress("整理原文", 10, `正在整理原文，本次将使用 ${uniqueSkillNames.join("、")} 调用 DeepSeek。`);
  appendAnalysisLog(`本次执行 SKILL：${skillPlan.join("；")}`);
  if (els.analysisSourceBadge) {
    els.analysisSourceBadge.textContent = "分析中";
    els.analysisSourceBadge.dataset.source = "progress";
  }
  state.isAnalyzing = true;
  state.allowAnalysisBackground = false;
  state.analysisAbortController = new AbortController();
  sessionStorage.setItem(ANALYSIS_RUNNING_KEY, state.currentUser?.emailKey || "running");
  setUploadLocked(true);
  els.analyzeBtn.disabled = true;
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
  state.activeTopic = 0;
  state.drillStack = [];
  try {
    setAnalysisProgress("连接模型", 25, "正在连接 DeepSeek。");
    setAnalysisProgress("模型分析", 55, "DeepSeek 正在阅读原文并生成结构化拆解，长文可能需要等待。");
    const itemResults = [];
    for (let index = 0; index < analyzedItems.length; index += 1) {
      const item = analyzedItems[index];
      const itemType = materialTypeByKey(item.materialTypeId, item.materialTypeName);
      const itemSkill = currentTopicSkill(itemType?.id || item.materialTypeId || "type-executive-view");
      const itemSkillDisplay = skillDisplayName(itemSkill, "话题拆解 SKILL.md");
      setAnalysisProgress("模型分析", 55 + Math.round((index / Math.max(1, analyzedItems.length)) * 20), `正在分析第 ${index + 1}/${analyzedItems.length} 份资料：${item.title}，使用 ${itemSkillDisplay}`);
      appendAnalysisLog(`调用大模型：${item.title} 使用 ${itemSkillDisplay}`);
      const ticker = startAnalysisTicker(item, index, analyzedItems.length, itemSkillDisplay);
      let analysis;
      try {
        analysis = await analyzeWithDeepSeek(item.rawText || "", { signal: state.analysisAbortController.signal, skill: itemSkill });
      } finally {
        window.clearInterval(ticker);
      }
      itemResults.push({ item: { ...item, skill: itemSkill }, analysis });
      appendAnalysisLog(`已完成第 ${index + 1}/${analyzedItems.length} 份资料：${item.title}`);
      if (state.analysisAbortController.signal.aborted) {
        throw new Error("本次分析已停止。");
      }
    }
    const merged = mergeTopicAnalyses(itemResults);
    state.analysis = merged.analysis;
    setAnalysisProgress("解析结果", 82, "DeepSeek 已返回，正在解析结构化结果。");
    const savedDocs = [];
    for (const entry of itemResults) {
      const doc = await saveAnalyzedDocument(entry.item, entry.analysis);
      if (doc) {
        savedDocs.push(doc);
      }
    }
    renderAnalysis();
    renderDrillEmpty();
    const analyzedKeys = new Set(analyzedItems.map(pendingUploadKey));
    state.uploadItems = removeCompletedPendingUploads(state.uploadItems.filter((item) => !analyzedKeys.has(pendingUploadKey(item))));
    state.uploadAnalysisCompleted = !state.uploadItems.length;
    state.uploadBatchSaved = Boolean(state.uploadItems.length);
    state.rawText = "";
    if (els.sourceText) {
      els.sourceText.value = state.rawText;
    }
    await persistPendingUploads();
    sessionStorage.setItem(ANALYSIS_COMPLETED_REDIRECT_KEY, "true");
    setAnalysisProgress("完成", 100, `共计处理 ${savedDocs.length || analyzedItems.length} 份材料，已分析完成，请进入话题列表查看`);
    await confirmAction({
      title: "分析完成",
      message: `共计处理 ${savedDocs.length || analyzedItems.length} 份材料，已分析完成，请进入话题列表查看。`,
      confirmText: "确认",
    });
    sessionStorage.removeItem(ANALYSIS_COMPLETED_REDIRECT_KEY);
    renderUploadMaterialList();
    renderPendingUploadMaterialList();
    switchModule("learning");
    switchStudyView("topicsHome");
    renderTopicHome();
  } catch (error) {
    state.analysis = null;
    renderDrillEmpty();
    if (els.analysisSourceBadge) {
      els.analysisSourceBadge.textContent = "失败";
      els.analysisSourceBadge.dataset.source = "error";
    }
    const stopped = /已停止|aborted|abort/i.test(String(error.message || ""));
    if (stopped) {
      setAnalysisProgress("已停止", 0, "已停止本次执行分析。");
    } else {
      setAnalysisProgress("失败", 0, `DeepSeek 分析失败：${error.message}`);
    }
    state.isAnalyzing = false;
    state.analysisAbortController = null;
    sessionStorage.removeItem(ANALYSIS_RUNNING_KEY);
    setUploadLocked(false);
    renderUploadMaterialList();
    renderPendingUploadMaterialList();
    return;
  }
  state.isAnalyzing = false;
  state.allowAnalysisBackground = false;
  state.analysisAbortController = null;
  sessionStorage.removeItem(ANALYSIS_RUNNING_KEY);
  setUploadLocked(false);
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
  updateUploadButtons();
}

function switchModule(moduleName) {
  const activeStudyView = document.querySelector(".study-view.is-active")?.id?.replace(/View$/, "") || "topicsHome";
  els.moduleTabs.forEach((tab) => {
    const isStudyTab = Boolean(tab.dataset.studyView);
    const isActive = tab.dataset.module === moduleName && (!isStudyTab || tab.dataset.studyView === activeStudyView);
    tab.classList.toggle("is-active", isActive);
  });
  document.querySelectorAll(".module-view").forEach((view) => {
    view.classList.toggle("is-active", view.id === `${moduleName}Module`);
  });
  if (moduleName === "config") {
    renderConfigPage();
  }
  if (moduleName === "materials") {
    renderMaterialManagePage();
  }
  if (moduleName === "skill") {
    renderTopicSkillPage();
  }
  if (moduleName === "articleSkill") {
    renderArticleSkillPage();
  }
  if (moduleName === "recycle") {
    renderRecyclePage();
  }
  if (moduleName === "version") {
    renderVersionPage();
  }
}

function switchStudyView(viewName) {
  const viewMap = {
    overview: "analysis",
    topics: "analysis",
    materialOverview: "materialOverview",
    generatedArticles: "generatedArticles",
    upload: "upload",
    materialLibrary: "materialLibrary",
    library: "library",
    analysis: "analysis",
    drill: "drill",
    quotes: "quotes",
    method: "method",
  };
  const normalizedView = viewMap[viewName] || viewName;
  els.studyTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.studyView === normalizedView);
  });
  document.querySelectorAll(".study-view").forEach((view) => {
    view.classList.toggle("is-active", view.id === `${normalizedView}View`);
  });
  const learningActive = document.querySelector("#learningModule")?.classList.contains("is-active");
  els.moduleTabs.forEach((tab) => {
    if (tab.dataset.studyView) {
      tab.classList.toggle("is-active", Boolean(learningActive) && tab.dataset.studyView === normalizedView);
    }
  });
}

function buildMarkdown() {
  if (!state.analysis) {
    return "";
  }
  const { overview, activeCategories, topics, quotes, deepeningModes: modelDeepeningModes } = state.analysis;
  const modes = modelDeepeningModes || deepeningModes;
  const lines = [
    `# ${state.fileName || "材料拆解"}`,
    "",
    "## 一、核心思想一句话概括",
    overview.oneLine,
    "",
    "## 二、逻辑框架",
    overview.logicLine,
    "",
    "## 三、观点分类",
  ];

  activeCategories
    .sort((a, b) => b.items.length - a.items.length)
    .forEach((group) => {
      lines.push("", `### ${group.category.name}`);
      pickTopSentences(group.items, 5).forEach((sentence) => lines.push(`- ${sentence}`));
    });

  lines.push("", "## 四、金句清单");
  quotes.forEach((quote) => lines.push(`- ${quote}`));

  const hasTrainingTopics = topics.some((topic) => topic.trainingTopic);
  lines.push("", hasTrainingTopics ? "## 五、培训话题拆解" : "## 五、问题化拆解");
  topics.forEach((topic) => {
    if (topic.trainingTopic) {
      const trainingTopic = normalizeTrainingTopic(topic.trainingTopic);
      lines.push(
        "",
        `### 话题${topic.index}：${topic.title}`,
        `- 难度等级：${"★".repeat(topic.difficulty)}${"☆".repeat(5 - topic.difficulty)}`,
        `- 话题类型：${normalizeProblemTypes(topic.problemTypes, topic.categoryName, topic.category?.name).join(" / ")}`,
        `- 知识点名称：${trainingTopic.knowledgeName || ""}`,
        `- 知识点类型：${trainingTopic.knowledgeType || ""}`,
        `- 学习问题：${trainingTopic.learningQuestion || ""}`,
        `- 核心观点：${trainingTopic.coreViewpoint || ""}`,
        `- 老师怎么讲：${trainingTopic.teacherExplanation || ""}`,
        `- 详细展开：${trainingTopic.detailedExplanation || ""}`,
        "- 讲解场景：",
        ...(trainingTopic.scenarios || []).map((item) => `  - ${item.name}：${item.context}｜${item.teacherExplanation}｜展开：${item.detailedExpansion || ""}｜适用条件：${item.applicability}`),
        "- 注意问题：",
        ...(trainingTopic.attentionPoints || []).map((item) => `  - ${item.issue}：${item.whyItMatters}｜分析：${item.detailedAnalysis || ""}｜纠偏：${item.correction}`),
        "- 知识体系延伸：",
        ...(trainingTopic.extensions || []).map((item) => `  - ${item.title}：${item.industryCase}｜扩展：${item.detailedExpansion || ""}｜关联知识：${item.relatedKnowledge}｜迁移场景：${item.transferScenario}`),
        "- 练习任务：",
        `  - 任务：${trainingTopic.practice?.task || ""}`,
        ...(trainingTopic.practice?.steps || []).map((item) => `  - 步骤：${item}`),
        ...(trainingTopic.practice?.checkpoints || []).map((item) => `  - 检验：${item}`),
        `- 整体逻辑：${trainingTopic.logicSummary || ""}`,
        `- 学习者收获：${trainingTopic.learnerTakeaway || ""}`,
      );
      return;
    }
    lines.push(
      "",
      `### 问题${topic.index}：${topic.title}`,
      `- 难度等级：${"★".repeat(topic.difficulty)}${"☆".repeat(5 - topic.difficulty)}`,
      `- 问题类型：${normalizeProblemTypes(topic.problemTypes, topic.categoryName, topic.category?.name).join(" / ")}`,
      `- 问题实质：${topic.problemEssence || topic.essence || ""}`,
      `- 表面现象：${topic.surfacePhenomenon || ""}`,
      "- 深层本质：",
      ...(topic.deepNature || []).map((item) => `  - ${item.title}：${item.explanation}｜案例：${item.case}`),
      "- CEO的解法与关键动作：",
      `  - 核心判断：${topic.ceoSolution?.coreJudgment || ""}`,
      ...(topic.ceoSolution?.verificationMethods || []).map((item) => `  - 验证方法：${item}`),
      ...(topic.ceoSolution?.keyActions || []).map((item) => `  - 关键行动：${item}`),
      "- 底层逻辑（理论锚点）：",
      ...(topic.theoryAnchors?.linkedTheoryModel || []).map((item) => `  - 关联理论/模型：${item}`),
      ...(topic.theoryAnchors?.logicDissection || []).map((item) => `  - 逻辑拆解：${item}`),
      "- 案例对照（跨时空验证）：",
      `  - 反例：${topic.caseComparison?.counterexample || ""}`,
      `  - 正例：${topic.caseComparison?.positiveExample || ""}`,
      `  - 历史类比：${topic.caseComparison?.historicalAnalogy || ""}`,
      "- 更多解法与选择（拓展思维）：",
      ...(topic.moreSolutions || []).flatMap((item, idx) => [
        `  - 解法${idx + 1}：${item.title || ""}`,
        ...(item.steps || []).map((step) => `    - ${step}`),
        `    - 适用场景：${item.applicability || ""}`,
      ]),
      "- 可迁移的启示：",
      `  - 对团队的启示：${topic.transferableInsights?.team || ""}`,
      `  - 对读者的行动建议：${topic.transferableInsights?.reader || ""}`,
    );
  });

  lines.push("", "## 六、演化式深化");
  modes.forEach((mode) => {
    lines.push("", `### ${mode.title}`, `- 核心目标：${mode.goal}`, "- 核心问题：");
    mode.questions.forEach((question) => lines.push(`  - ${question}`));
  });

  return lines.join("\n");
}

function exportMarkdown() {
  const markdown = buildMarkdown();
  if (!markdown) {
    els.parseHint.textContent = "请先完成拆解，再导出 Markdown。";
    return;
  }
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(state.fileName || "wistalk-analysis").replace(/\.[^.]+$/, "")}-拆解.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyMarkdown() {
  const markdown = buildMarkdown();
  if (!markdown) {
    els.parseHint.textContent = "请先完成拆解，再复制 Markdown。";
    return;
  }
  try {
    await navigator.clipboard.writeText(markdown);
    els.parseHint.textContent = "已复制 Markdown。";
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = markdown;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    els.parseHint.textContent = ok ? "已复制 Markdown。" : "复制受浏览器限制，请使用导出。";
  }
}

function resetResults() {
  els.docTitle.textContent = "尚未分析材料";
  els.oneLine.textContent = "上传材料后，这里会生成核心思想。";
  els.logicLine.textContent = "系统会自动识别战略、数字化、AI、组织、流程、数据、激励、文化、领导力等维度。";
  els.metricTopics.textContent = "0";
  els.metricCategories.textContent = "0";
  els.metricQuotes.textContent = "0";
  els.metricWords.textContent = "0";
  els.categoryBoard.innerHTML = "";
  els.topicList.innerHTML = "";
  els.topicArticle.innerHTML = `<p class="empty-state">拆解完成后，选择左侧话题查看学习文章。</p>`;
  renderOriginalText("");
  renderDrillEmpty();
  switchModule("learning");
  switchStudyView("topicsHome");
}

function clearWorkspace() {
  state.fileName = "";
  state.rawText = "";
  state.draftUploadItems = [];
  state.uploadBatchSaved = false;
  state.uploadAnalysisCompleted = false;
  state.analysis = null;
  state.activeTopic = 0;
  state.currentDocId = "";
  state.activeTopicRef = null;
  state.drillStack = [];
  resetAnalysisLog();
  els.docNameInput.value = "";
  els.docCategorySelect.value = "";
  if (els.materialSourceSelect) {
    els.materialSourceSelect.value = state.materialSources[0]?.id || "";
  }
  if (els.materialTypeSelect) {
    els.materialTypeSelect.value = state.materialTypes[0]?.id || "";
  }
  els.tagInput.value = "";
  els.sourceText.value = "";
  els.fileInput.value = "";
  if (els.urlInput) {
    els.urlInput.value = "";
  }
  setUploadLocked(false);
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
  resetResults();
  setAnalysisProgress("未分析", 0, "已重置，可以重新上传材料。");
  updateUploadButtons();
  switchModule("learning");
  switchStudyView("upload");
}

els.fileInput.addEventListener("change", (event) => {
  if (state.uploadLocked) {
    event.target.value = "";
    setAnalysisProgress("分析中", Number(els.analysisProgressPercent?.textContent?.replace("%", "") || 0), "大模型正在执行分析，暂时不能继续上传。");
    return;
  }
  handleFiles(event.target.files);
});

els.urlImportForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  handleUrlImport(els.urlInput?.value || "");
});

els.authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthTab(tab.dataset.authTab));
});

els.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const ok = await confirmAction({
      title: "登记试用",
      message: "确认提交试用登记吗？提交后需要联系 Simon.Lv@fanruan.com 分配初始密码。",
      confirmText: "确认登记",
    });
    if (ok) {
      await registerUser(els.registerEmail.value);
    }
  } catch (error) {
    showAuthMessage(`登记失败：${error.message}`, "error");
  }
});

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await login(els.loginEmail.value, els.loginPassword.value);
    els.loginPassword.value = "";
  } catch (error) {
    showAuthMessage(`登录失败：${error.message}`, "error");
  }
});

document.querySelector("#adminRescueBtn")?.addEventListener("click", async () => {
  try {
    await rescueAdminPassword();
  } catch (error) {
    showAuthMessage(`管理员密码救援失败：${error.message}`, "error");
  }
});

els.forgotForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const ok = await confirmAction({
      title: "提交找回申请",
      message: "确认提交密码找回申请吗？提交后管理员会在后台处理。",
      confirmText: "确认提交",
    });
    if (ok) {
      await requestPasswordReset(els.forgotEmail.value);
      els.forgotEmail.value = "";
    }
  } catch (error) {
    showAuthMessage(`提交失败：${error.message}`, "error");
  }
});

els.accountBtn?.addEventListener("click", () => {
  guardAnalysisNavigation(() => switchModule("config"));
});

function syncSidebarCollapsed() {
  els.appShell?.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
  if (els.sidebarToggle) {
    const label = state.sidebarCollapsed ? "展开左侧导航" : "收缩左侧导航";
    els.sidebarToggle.setAttribute("aria-label", label);
    els.sidebarToggle.title = label;
  }
}

els.sidebarToggle?.addEventListener("click", () => {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  syncSidebarCollapsed();
});

els.logoutBtn.addEventListener("click", () => guardAnalysisNavigation(async () => {
  const ok = await confirmAction({
    title: "退出登录",
    message: "确认退出当前账号吗？",
    confirmText: "确认退出",
  });
  if (ok) {
    await logEvent("logout");
    clearSession();
    state.currentUser = null;
    clearWorkspace();
    state.documents = [];
    renderDocumentLibrary();
    renderAuthGate();
  }
}));

["dragenter", "dragover"].forEach((name) => {
  els.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    els.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((name) => {
  els.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    els.dropZone.classList.remove("is-dragging");
  });
});

els.dropZone.addEventListener("drop", (event) => {
  if (state.uploadLocked) {
    setAnalysisProgress("分析中", Number(els.analysisProgressPercent?.textContent?.replace("%", "") || 0), "大模型正在执行分析，暂时不能继续上传。");
    return;
  }
  handleFiles(event.dataTransfer.files);
});

els.analyzeBtn.addEventListener("click", async () => {
  const skillPlan = selectedUploadItems()
    .map((item, index) => `${index + 1}. ${item.title || item.fileName}：${uploadItemSkillDisplay(item)}`)
    .join("\n");
  const ok = await confirmAction({
    title: "执行材料分析",
    message: `确认调用大模型执行分析吗？长文可能需要等待一段时间。\n\n本次执行 SKILL：\n${skillPlan || "请先选择待分析材料。"}`,
    confirmText: "确认执行",
  });
  if (ok) {
    runAnalyze();
  }
});
els.saveUploadBtn?.addEventListener("click", async () => {
  if (!state.draftUploadItems.length) {
    setAnalysisProgress("未就绪", 0, "请先上传材料。");
    return;
  }
  if (!uploadItemsReady()) {
    setAnalysisProgress("未完善", 0, "请先为每份材料选择资料来源和材料场景。");
    return;
  }
  const ok = await confirmAction({
    title: "保存上传材料",
    message: `确认保存 ${state.draftUploadItems.length} 份待分析材料吗？保存后会进入下方待分析清单，但不会立刻生成话题。`,
    confirmText: "确认保存",
  });
  if (!ok) {
    return;
  }
  const savedItems = state.draftUploadItems.map((item) => ({ ...item, selected: true }));
  state.uploadItems = [...state.uploadItems, ...savedItems];
  state.draftUploadItems = [];
  state.uploadBatchSaved = true;
  state.uploadAnalysisCompleted = false;
  state.rawText = "";
  if (els.sourceText) {
    els.sourceText.value = "";
  }
  setUploadLocked(false);
  renderUploadMaterialList();
  renderPendingUploadMaterialList();
  await persistPendingUploads();
  setUploadLog("已保存", "材料已保存到待分析清单，请在下方勾选后执行分析。");
});
els.deleteAnalyzedMaterialsBtn?.addEventListener("click", async () => {
  const ids = selectedAnalyzedMaterialIds();
  if (!ids.length) {
    return;
  }
  const ok = await confirmAction({
    title: "删除已分析材料",
    message: `确认删除选中的 ${ids.length} 份材料吗？相关话题会从话题列表移除，并进入管理员回收站。`,
    confirmText: "确认删除",
    tone: "danger",
  });
  if (!ok) {
    return;
  }
  for (const id of ids) {
    await deleteDocument(id);
  }
  renderAnalyzedMaterialList();
});
els.newMaterialBtn?.addEventListener("click", () => guardAnalysisNavigation(openNewMaterialFlow));
els.topNewMaterialBtn?.addEventListener("click", () => guardAnalysisNavigation(openNewMaterialFlow));
els.sampleBtn?.addEventListener("click", () => {
  if (state.uploadLocked) {
    setAnalysisProgress("已锁定", Number(els.analysisProgressPercent?.textContent?.replace("%", "") || 0), "当前已有材料，请点击“重置”后再载入示例。");
    return;
  }
  state.currentDocId = "";
  state.fileName = "材料示例.txt";
  els.docNameInput.value = "材料示例";
  els.docCategorySelect.value = "preset-strategy";
  els.tagInput.value = "战略, 数字化, AI, 组织管理";
  els.sourceText.value = sampleText;
  renderOriginalText(sampleText);
  setUploadLocked(true);
  els.parseHint.textContent = "已载入示例文本，可点击“执行”。";
});
els.clearBtn.addEventListener("click", async () => {
  const ok = await confirmAction({
    title: "重置上传区",
    message: "确认重置当前上传区吗？重置后才可以重新上传材料。",
    confirmText: "确认重置",
    tone: "danger",
  });
  if (ok) {
    clearWorkspace();
  }
});

els.topicSearchInput?.addEventListener("input", (event) => {
  state.topicSearch = event.target.value;
  state.topicPage = 1;
  renderTopicHome();
});

els.topicSourceFilter?.addEventListener("change", (event) => {
  state.topicSourceFilter = event.target.value;
  state.topicPage = 1;
  renderTopicHome();
});

els.topicTypeFilter?.addEventListener("change", (event) => {
  state.topicTypeFilter = event.target.value;
  state.topicPage = 1;
  renderTopicHome();
});
els.topicFavoriteFilter?.addEventListener("click", () => {
  state.topicFavoriteOnly = !state.topicFavoriteOnly;
  state.topicPage = 1;
  if (els.topicFavoriteFilter) {
    els.topicFavoriteFilter.dataset.active = String(state.topicFavoriteOnly);
    els.topicFavoriteFilter.setAttribute("aria-pressed", String(state.topicFavoriteOnly));
    const icon = els.topicFavoriteFilter.querySelector(".favorite-filter-icon");
    const text = els.topicFavoriteFilter.querySelector(".favorite-filter-text");
    if (icon) icon.textContent = state.topicFavoriteOnly ? "♥" : "♡";
    if (text) text.textContent = state.topicFavoriteOnly ? "已收藏" : "收藏";
  }
  renderTopicHome();
});
els.topicOwnerFilter?.addEventListener("input", (event) => {
  state.topicOwnerFilter = event.target.value;
  state.topicPage = 1;
  renderTopicHome();
});
els.exportBtn?.addEventListener("click", exportMarkdown);
els.copyBtn?.addEventListener("click", copyMarkdown);

els.moduleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    guardAnalysisNavigation(() => {
      switchModule(tab.dataset.module);
      if (tab.dataset.studyView) {
        switchStudyView(tab.dataset.studyView);
        if (tab.dataset.studyView === "topicsHome") {
          renderTopicHome();
        }
        if (tab.dataset.studyView === "materialOverview") {
          renderMaterialOverviewPage();
        }
        if (tab.dataset.studyView === "materialLibrary") {
          renderAnalyzedMaterialList();
        }
        if (tab.dataset.studyView === "generatedArticles") {
          renderGeneratedArticlePage();
        }
      }
    });
  });
});

window.addEventListener("beforeunload", (event) => {
  if (state.articleGeneration.active || state.isAnalyzing) {
    event.preventDefault();
    event.returnValue = "当前仍有大模型任务正在执行，刷新或关闭页面会中断当前任务。";
    return event.returnValue;
  }
  return undefined;
});

els.librarySearch.addEventListener("input", (event) => {
  state.librarySearch = event.target.value;
  renderDocumentLibrary();
});

els.libraryTagSearch.addEventListener("input", (event) => {
  state.libraryTagSearch = event.target.value;
  renderDocumentLibrary();
});

els.libraryCategoryFilter.addEventListener("change", (event) => {
  state.activeDocCategory = event.target.value;
  renderDocumentLibrary();
});

els.libraryOwnerFilter.addEventListener("change", async (event) => {
  state.activeOwner = event.target.value;
  await loadDocuments();
});

els.resetFilterBtn.addEventListener("click", () => {
  state.activeTag = "";
  state.activeDocCategory = "";
  state.librarySearch = "";
  state.libraryTagSearch = "";
  els.librarySearch.value = "";
  els.libraryTagSearch.value = "";
  els.libraryCategoryFilter.value = "";
  if (isAdmin()) {
    state.activeOwner = state.currentUser.emailKey;
    els.libraryOwnerFilter.value = state.currentUser.emailKey;
    loadDocuments();
  }
  renderDocumentLibrary();
});

renderDrillEmpty();
restoreSession().catch((error) => {
  renderAuthGate();
  showAuthMessage(`系统初始化失败：${error.message}`, "error");
});
