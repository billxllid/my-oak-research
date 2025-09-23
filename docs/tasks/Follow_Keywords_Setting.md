很清晰！基于你的设定（内置/可扩展 Category、Include 合并展示但与 synonyms 分开存储、可勾选 AI 拓展），我给你一套“后端模型 + API 约定 + 表单校验 + UI 行为 + AI 拓展管线”的落地方案，直接可用。

# 1) 数据模型（Prisma 更新）

- **Category** 独立表，支持用户自定义；`KeywordSet` 单选一个分类（若未来需要多选，改成多对多即可）。
- `KeywordSet` 新增 `description`；`include` 与 `synonyms` 分开存储，但前端展示合并。

```prisma
model Category {
  id        String   @id @default(cuid())
  userId    String
  name      String   // Person/Event/Organization/Location... + 用户自定义
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  keywordSets KeywordSet[]
  @@unique([userId, name]) // 同用户下不重复
}

model KeywordSet {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?        // 新增
  lang        String?        // zh/en/ja/auto

  categoryId  String         // 单选分类
  category    Category  @relation(fields: [categoryId], references: [id])

  include     String[]       // 用户直接录入
  exclude     String[]       // 用户直接录入
  synonyms    String[]       // 勾选 AI 拓展后写入
  active      Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 常用索引（按需）
  @@index([userId, categoryId])
  @@index([userId, name])
}
```

> 若你希望 **多分类**：把 `categoryId` 改为中间表 `KeywordSetCategory`（多对多），UI 上就变成多选。

# 2) API 约定

**创建 KeywordSet**

```
POST /api/keyword-sets
{
  "name": "AI 行业动态",
  "description": "关注通用大模型与开源生态",
  "lang": "zh",
  "categoryId": "<category_id>",
  "include": ["AI", "大模型", "ChatGPT"],
  "exclude": ["招聘", "广告"],
  "enableAiExpand": true
}
→ 服务器逻辑：
- 保存 include/exclude
- 若 enableAiExpand=true：触发“同义词拓展”任务，补充到 synonyms[] 后返回（或异步再更新）
```

**列表（用于表格）**

```
GET /api/keyword-sets?query=&categoryId=&lang=&page=&pageSize=
→ 返回：
[
  {
    "id": "...",
    "name": "...",
    "lang": "zh",
    "category": { "id": "...", "name": "Person" },
    "include": [...],
    "exclude": [...],
    "synonyms": [...],   // 前端展示时合并到 Include 区域做不同 badge
    "updatedAt": "..."
  }
]
```

**更新（含重新 AI 拓展）**

```
PATCH /api/keyword-sets/:id
{
  "name": "...",
  "description": "...",
  "lang": "zh",
  "categoryId": "...",
  "include": [...],
  "exclude": [...],
  "enableAiExpand": true  // 重新生成 synonyms（会覆盖或追加，见策略）
}
```

# 3) 表单校验（Zod 示例要点）

- `name`: 1–64 字，去重（同用户下唯一）。
- `include`: 去重、去空、长度限制（每词 1–40 字，最多 200 词）。
- `exclude`: 同上，且不与 include/synonyms 交集。
- `synonyms`: 服务端写入；前端只读展示。
- `lang`: 限定枚举（zh/en/ja/auto）。
- `categoryId`: 必填且必须存在于当前用户的 Category 表。

> 规范化建议：保存前把关键词做 **小写/全半角统一/去首尾空格**；中文空格、标点统一。

# 4) 表格与表单交互细节

- **表格列**：ID / Name / Lang / Category / Include / Exclude / Action

  - Include 展示为徽章 **两种样式**：

    - 手动录入：实心 badge
    - AI 派生：描边/浅色 badge（从 `synonyms`）

  - 提供“展开”查看全部词（Popover/Drawer）

- **Action**：编辑 / 复制（导出 JSON/CSV）/ 停用 / 删除
- **表单**：

  - Name（输入框）、Description（多行）
  - Lang（下拉）、Category（下拉，右侧有“管理分类”入口）
  - Include（可添加标签，按回车/逗号分词）
  - Exclude（同上）
  - [ ] **AI 拓展**（勾选后显示“生成中…”与预览框，允许把建议的一部分取消勾选后再保存 → 最终写入 `synonyms`）

- **回显**：编辑时 Include 面板合并展示（手动+AI），但右上角提供一个切换：`全部 | 仅手动 | 仅AI` 以便用户识别来源。

# 5) AI 拓展（同义词）生成策略

- **输入**：`include[] + lang + category`
- **提示词要点**：

  - 要求输出同义词/常见拼写/缩写/别名/翻译（按 lang），与分类相关（如 Person 只给人名变体）
  - 强约束：不得输出重复；长度限制；不生成含敏感/广告用词

- **去重与质量**：

  - 先和值得信赖的词表（可选）做交叉；
  - 与 `exclude` 求差集；
  - 与 `include` 求差集；
  - 最终写入 `synonyms`（覆盖或追加由参数控制，建议**覆盖**以保持可复现）。

**伪代码（服务端）**

```ts
const base = normalize(input.include);
const draft = await aiExpand({ base, lang, category }); // 返回候选
const syn = unique(
  draft
    .filter((w) => !base.includes(w))
    .filter((w) => !input.exclude.includes(w))
    .slice(0, 200)
);
await prisma.keywordSet.update({ where: { id }, data: { synonyms: syn } });
```

# 6) 检索/匹配规则（用于后续请求构建）

把 **最终用于匹配的词** 定义为：`terms = include ∪ synonyms`

- 关键词查询（示例）：

  - **布尔**：`(AI OR 大模型 OR ChatGPT ...) AND NOT (招聘 OR 广告 ...)`
  - 语言过滤：当 `lang!=auto` 时在抓取标准化阶段打标并在检索层过滤

- **高亮/统计**：源内命中次数、词频 Top N、命中分布（帮助用户调参）

# 7) Category 管理建议

- 预置 4 类（Person/Event/Organization/Location），首次登录自动创建到用户空间。
- Category 删除前应检测是否被引用（`keywordSets.count`）；若有引用可：

  - 阻止删除；或
  - 让用户批量迁移到另一类后删除。

- UI：表格 + 排序（使用次数 desc）+ “合并分类”操作（可选）。

---

如果你愿意，我可以直接给你：

1. **Prisma 迁移脚本**（含 Category 预置数据种子）
2. **Next.js API 路由**：`POST/GET/PATCH /api/keyword-sets` 与 `/api/categories`
3. **Zod + React Hook Form** 的前端新增/编辑表单组件
4. **表格页面**（TanStack Table）含徽章区分与操作列

告诉我你想先哪块代码，我就按你的栈（Next.js + TS + MUI/Tailwind）产出可运行版本。
