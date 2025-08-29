# Focus Bulletin Implementation

说明：当前文件是示例文件，编写代码时按照格式和要求编写。

关注速报模块：用户可配置关键词、分类、平台、站点、搜索引擎、代理与 AI 设置，系统自动监控并展示相关内容，支持收藏、详情查看与实体提取。

---

## Completed Tasks

- [x] 定义 Prisma schema（Keyword / Category / Content / DerivedKeyword / Platform / Site / SearchEngine / ProxyResource）
- [x] 实现 API 路由 `/api/focus-bulletin/content`（GET，分页+筛选）
- [x] 实现 API 路由 `/api/focus-bulletin/favorites`（POST/DELETE）

## In Progress Tasks

- [ ] UI：配置页（关键词管理、分类管理、平台设置、站点管理）
- [ ] UI：内容页（卡片列表 + 详情抽屉）
- [ ] SWR hooks：`useFocusContent`, `useKeywords`, `useFavorites`
- [ ] 乐观更新收藏按钮（收藏/取消收藏）
- [ ] AI 接口 `/api/ai/keywords/derive`（关键词派生）

## Future Tasks

- [ ] 支持代理资源配置（前端表单 + API）
- [ ] 配置项更新频率限制（后端校验）
- [ ] 关注内容的全文检索（结合 Postgres + pg_trgm 或 ElasticSearch）
- [ ] UI：支持筛选条件保存为视图
- [ ] 收藏夹与报告编写模块联动（选择收藏内容作为报告素材）

---

## Implementation Plan

### 数据模型

- `Keyword`：用户关注的关键词
- `DerivedKeyword`：由 AI 派生的关键词（多语言/同义）
- `Content`：系统抓取的内容，存储 Markdown + 元数据
- `ContentEntity`：实体提取结果（人物/组织/地点）
- `Favorite`：用户收藏的内容

### API 路由

- `GET /api/focus-bulletin/content` → 获取内容列表（分页+去重）
- `POST /api/focus-bulletin/favorites` → 收藏内容
- `DELETE /api/focus-bulletin/favorites` → 取消收藏
- `POST /api/ai/keywords/derive` → 关键词派生（调用 LLM Gateway）

### 前端 UI

- **配置页**：
  - Tab 结构（关键词 / 分类 / 平台 / 站点 / 搜索引擎 / 代理 / AI）
  - 表单基于 React Hook Form + Zod
- **内容页**：
  - 卡片视图（`FocusCard`）→ 摘要 + 标签 + 收藏按钮
  - 详情抽屉（`DetailDrawer`）→ Markdown 渲染 + Refer 列表

### 状态管理

- 数据通过 SWR 获取与缓存
- 收藏使用乐观更新 + rollbackOnError

### AI 集成

- 关键词派生：固定 schema 输出
- 内容摘要 & 实体提取：后端 pipeline，前端只消费结果

---

## Relevant Files

- apps/web/app/(focus-bulletin)/page.tsx 🚧 内容页入口
- apps/web/app/(focus-bulletin)/config/page.tsx 🚧 配置页入口
- apps/web/app/api/focus-bulletin/content/route.ts ✅ 内容列表 API
- apps/web/app/api/focus-bulletin/favorites/route.ts ✅ 收藏 API
- apps/web/app/api/ai/keywords/derive/route.ts 🚧 关键词派生 API
- packages/ui/card/FocusCard.tsx 🚧 卡片组件
- packages/ui/detail/DetailDrawer.tsx ✅ 详情抽屉组件
- packages/hooks/useFocusContent.ts 🚧 SWR hook
- packages/hooks/useFavorites.ts 🚧 SWR hook
