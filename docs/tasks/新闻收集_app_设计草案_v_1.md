# 目标与定位
- **核心价值**：让用户以「关键字 × 来源 × 请求规则」的方式收集信息，并通过 AI 去噪、去重、归纳，像“情报日报”一样推送高信噪比结果。
- **目标用户**：重度信息关注者、OSINT/安全研究、投研、品牌/舆情、行业观察。
- **MVP 范围**：
  1) 支持多源抓取（RSS、X/Twitter、Reddit、Telegram 频道、RSSHub、自定义爬虫 URL 列表）
  2) 关键字/规则配置，按频率调度抓取
  3) 去重（文本/URL/标题）、相似聚类
  4) AI 摘要与多条合并总结
  5) Web UI 展示、筛选与导出

---

# 用户故事（User Stories）
1. 作为用户，我可以添加 **来源 Source**（RSS 链接、X 列表、Telegram 频道、网址列表等），并设置抓取频率与限速。
2. 我可以创建 **关键字集合 KeywordSet**（含多语言同义词、正负面关键词），并复用到多个请求。
3. 我可以创建一个 **请求 Request**：选择来源集合 + 关键字集合 + 时间窗 + 过滤规则（排除域名/作者、最小长度、语言等）。
4. 系统定时抓取，返回**候选条目**，执行去重/聚类/摘要后，生成**聚合卡片**推送到我的**收件箱 Inbox**。
5. 我可以在 Inbox 中快速**标注**（有用/无用）、**收藏**、**导出**（Markdown/PDF/CSV）、**生成日报**。
6. 我可以订阅**每天 08:30**的「我的关键词情报日报」。

---

# 总体架构（提议）
前端 **Next.js (App Router) + React + Tailwind/Material UI**
后端 **Node.js (NestJS/Express) 或 Python (FastAPI)** —— 二选一；下文给出 Node 方案为主，Python Worker 可作抓取/AI 管道。
持久化 **PostgreSQL + Prisma ORM**
消息队列 **Redis (BullMQ)** 或 **Kafka**（若要高吞吐）
全文检索/嵌入检索 **OpenSearch/Meilisearch** + **向量库（pgvector / Qdrant）**
任务调度 **BullMQ repeatable jobs** / **Temporal**（如需复杂编排）

数据流（简化）：
1) 用户配置 Source/Keyword/Request → 2) Scheduler 产出抓取任务 → 3) Fetcher Worker 拉取内容（统一标准化）→ 4) 去重/相似性计算/聚类 → 5) AI 生成摘要与合并总结 → 6) 写入聚合结果（Cluster/Summary）→ 7) 通知（邮件/Telegram Bot/Web 推送）→ 8) 前端展示/筛选/导出。

---

# 数据模型（Prisma 草案）
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  hashedPwd    String
  createdAt    DateTime @default(now())
  requests     Request[]
  keywordSets  KeywordSet[]
  sources      Source[]
  subscriptions Subscription[]
}

model Source {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        SourceType
  name        String
  url         String   // rss url / api endpoint / seed url
  meta        Json?
  active      Boolean  @default(true)
  rateLimit   Int?     // requests per minute
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  requests    RequestSource[]
}

enum SourceType { RSS X TWITTER REDDIT TELEGRAM RSSHUB CUSTOM }

model KeywordSet {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  include     String[] // e.g. ["LLM", "大模型", "ChatGPT"]
  exclude     String[] // e.g. ["招聘", "广告"]
  lang        String?  // zh/en/ja/auto
  synonyms    String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  requests    Request[]
}

model Request {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String
  keywordSetId  String
  keywordSet    KeywordSet @relation(fields: [keywordSetId], references: [id])
  timeWindowHrs Int       @default(24)
  minLen        Int       @default(40)
  lang          String?   // override
  filters       Json?     // e.g. { excludeDomains: [], authors: [] }
  scheduleCron  String?   // optional if using cron-like scheduling
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sources       RequestSource[]
}

model RequestSource {
  id        String  @id @default(cuid())
  requestId String
  sourceId  String
  request   Request @relation(fields: [requestId], references: [id])
  source    Source  @relation(fields: [sourceId], references: [id])
}

model RawItem {
  id          String   @id @default(cuid())
  sourceId    String
  source      Source   @relation(fields: [sourceId], references: [id])
  externalId  String?  // guid / tweet id / tg msg id
  url         String?
  title       String?
  author      String?
  publishedAt DateTime?
  content     String
  lang        String?
  hash        String   @unique // sha256(content normalized)
  createdAt   DateTime @default(now())
  embedVec    Bytes?   // pgvector if using Postgres
}

model Cluster {
  id          String   @id @default(cuid())
  requestId   String
  request     Request  @relation(fields: [requestId], references: [id])
  title       String
  summary     String
  items       ClusterItem[]
  centroidVec Bytes?
  createdAt   DateTime @default(now())
}

model ClusterItem {
  id         String  @id @default(cuid())
  clusterId  String
  rawItemId  String
  cluster    Cluster @relation(fields: [clusterId], references: [id])
  rawItem    RawItem @relation(fields: [rawItemId], references: [id])
}

model Feedback {
  id        String   @id @default(cuid())
  userId    String
  clusterId String
  useful    Boolean
  tags      String[]
  note      String?
  createdAt DateTime @default(now())
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  requestId String
  schedule  String   // cron or RRULE
  channel   String   // EMAIL / TG / WEBPUSH
}
```

---

# 抓取与标准化（Fetcher）
- **统一内容模型**：`{sourceId, externalId, url, title, author, publishedAt, content, lang}`
- **连接器建议**：
  - RSS：`rss-parser` (Node) 或 `feedparser` (Python)
  - X/Twitter：官方 API 或第三方代理；支持按 List/用户/搜索拉流
  - Reddit：JSON API
  - Telegram：bot + channel history（遵守条款）
  - RSSHub：扩展长尾站点
  - CUSTOM：提供网页抓取器（Playwright）+ 可插拔「提取器」
- **反爬/限速**：respect robots、UA 轮换、并发控制、指数退避、持久 Cookie、IP 池（合规）
- **语言检测**：fastText/langdetect/CLD3，写入 `lang`

**Node Worker 片段（BullMQ）**
```ts
// queue.ts
import { Queue } from 'bullmq'
export const fetchQueue = new Queue('fetch', { connection: { host: '127.0.0.1', port: 6379 }})

// producer: schedule per Request
await fetchQueue.add('fetch-request', { requestId }, { repeat: { every: 1000 * 60 * 30 } })
```

**Python 抓取器（示例，RSS）**
```python
import feedparser, hashlib, datetime as dt

def normalize(entry, source_id):
    content = (entry.get('summary') or '') + ' ' + ' '.join([c.get('value','') for c in entry.get('content',[])])
    text = ' '.join(content.split())
    h = hashlib.sha256(text.encode('utf-8')).hexdigest()
    return {
        'sourceId': source_id,
        'externalId': entry.get('id'),
        'url': entry.get('link'),
        'title': entry.get('title'),
        'author': entry.get('author'),
        'publishedAt': entry.get('published_parsed') and dt.datetime(*entry.published_parsed[:6]),
        'content': text,
        'hash': h
    }
```

---

# 去重与相似聚类
**多层去重策略**：
1. **硬去重**：`hash(content_normalized)`、`url`、`title` 三级判重。
2. **近似去重**：SimHash/MinHash（LSH）；阈值如 `hamming <= 3`。
3. **语义聚类**：文本嵌入（中文可考虑 `bge-small-zh-v1.5` / 多语可用 `multilingual-e5`），向量相似度 > 0.82 → 同簇；再做层次/社区划分（HDBSCAN/Community）。

**SimHash 伪代码**
```python
from collections import Counter

def simhash(tokens, f=64):
    v=[0]*f
    for t,cnt in Counter(tokens).items():
        h=hash(t)
        for i in range(f):
            v[i]+=cnt if (h>>i)&1 else -cnt
    fingerprint=0
    for i,x in enumerate(v):
        if x>0: fingerprint |= (1<<i)
    return fingerprint
```

**聚类产物**：为每个簇生成 `title`（自动命名：Top TF-IDF 关键词拼接）、`summary`（见下）。

---

# AI 摘要与合并总结（Pipeline）
阶段化 Prompt：
1. **条目级摘要（bullet 3-5 条）**
2. **簇级合并总结**：对同簇多条进行去重合并，输出核心事实、差异点、时间线
3. **日报级概览**：对多个簇生成 Executive Summary + 风险/机会 + 后续关注点

示例 Prompt（簇级）
```text
你是资讯编辑。给定同一主题的多条新闻摘录，请：
1) 合并重复信息；2) 保留关键时间、数字、来源差异；3) 输出：
- 标题（<=18字）
- 核心要点（3-6条，分点，每条<=40字）
- 时间线（如存在）
- 参考来源（域名列表）
```

**安全与合规**：
- 对模型输出做**来源映射**与**引用列表**（可点击原文）
- 标注模型不确定处；支持人工一键修订

---

# API 设计（Next.js App Router）
- `POST /api/sources` 创建来源
- `GET /api/sources` 列表
- `POST /api/keyword-sets` 创建关键字集合
- `POST /api/requests` 创建请求（绑定 sources 与 keywordSet）
- `POST /api/ingest/raw`（可选）用于外部 webhook 推送
- `POST /api/feedback` 用户反馈（useful/tags）
- `GET /api/inbox?requestId=&date=` 查询聚类结果

**示例 route 片段**
```ts
// app/api/requests/route.ts
import { prisma } from '@/lib/prisma'
export async function POST(req: Request) {
  const body = await req.json()
  const r = await prisma.request.create({ data: body })
  // enqueue first run
  // fetchQueue.add('fetch-request', { requestId: r.id })
  return Response.json(r)
}
```

---

# 前端信息架构（IA）与组件
**页面**：
- **Dashboard**：今日总览、簇数、Top 源/关键词热度
- **Sources**：来源管理（表格 + 测试连通 + 速率）
- **Keywords**：关键词集合管理（同义词、排除词、语言）
- **Requests**：请求编排（来源×关键字×时间窗×过滤）
- **Inbox**：聚类结果流（卡片：标题/要点/来源/一键收藏/导出）
- **Reports**：日报/周报生成与导出
- **Settings**：通知、API Key、速率、隐私

**React 状态建议**：
- 全局使用 **Zustand/Redux Toolkit** 存储用户当前选中的 `requestId`、筛选条件。
- `useKeywordSets()` 与 `useSources()` 作为数据 hooks；`useRequests()` 用于编排。
- `useInboxFeed({requestId, dateRange, query})` 分页加载簇列表。

**Hook 示例（关键词/分类可扩展）**
```ts
// hooks/useKeywordSets.ts
import { useEffect, useState } from 'react'
export function useKeywordSets() {
  const [data,setData]=useState([])
  useEffect(()=>{ fetch('/api/keyword-sets').then(r=>r.json()).then(setData)},[])
  const add= async (payload)=>{ const r=await fetch('/api/keyword-sets',{method:'POST',body:JSON.stringify(payload)}); setData(d=>[...(d||[]), await r.json()]) }
  const remove= async (id)=>{ await fetch(`/api/keyword-sets/${id}`,{method:'DELETE'}); setData(d=>d.filter(x=>x.id!==id)) }
  return {data, add, remove}
}
```

**Inbox 卡片元素**：标题、聚合要点、时间线(可折叠)、来源徽章（域名去重）、相似条目计数、操作（👍/👎、收藏、展开原文、复制 Markdown、生成分享链接）。

---

# 评估与反馈闭环
- **去重指标**：重复率、误杀率（distinct 原文却被合并）、近似查全率/查准率
- **摘要质量**：用户 👍 比例、纠错次数、平均阅读时长
- **端到端延迟**：抓取→用户可见时间
- **A/B**：不同阈值、不同模型摘要风格
- **主动学习**：基于用户反馈微调/规则更新（如增加排除域名、关键字权重）

---

# 权限与隐私
- 多租户隔离（Row Level Security 或每租户前缀）
- 敏感来源（受限频道/企业内部源）加密存储凭据
- 审计日志（谁在何时读取了哪些聚合）

---

# 部署与运维
- **单体起步**：Next.js + API Routes + BullMQ Worker（同仓）
- **拆分阶段**：
  - 服务 A：Ingest/Fetche
  - 服务 B：Dedup/Cluster/Embed
  - 服务 C：Summarize/Report
  - 网关：GraphQL/REST
- 观测：OpenTelemetry + Prometheus + Grafana
- 任务可视化：bull-board / Temporal Web UI

---

# 路线图（Roadmap）
**M1（2-3周）**：MVP：RSS + 关键词 + 去重 + 聚类 + 摘要 + Inbox 展示
**M2**：更多来源（TG、X、Reddit），速率/失败重试、导出日报
**M3**：智能订阅（基于历史反馈自动扩展同义词）、多模型摘要风格
**M4**：团队与共享、Webhooks、自动生成「主题追踪」时间线

---

# 附：样例日报 Markdown 模板
```markdown
# {日期} 关键词情报日报（{请求名}）

## 总览
- 簇数：{clusters}
- 核心趋势：{bullets}

---
{#each cluster as c}
### {c.title}
- 要点：
{#each c.points as p}
- {p}
{/each}
- 时间线：{c.timeline}
- 来源：{c.sources}

> 摘要生成于 {generatedAt}（可点开查看原文）
{/each}
```

---

# 我建议的默认技术栈
- **前端**：Next.js 14+、TypeScript、Tailwind 或 MUI、TanStack Query、Zustand
- **后端**：Next.js API Routes / NestJS；Prisma + PostgreSQL；BullMQ + Redis
- **AI**：本地嵌入（bge/multilingual-e5）+ 远程或本地 LLM（可插拔）
- **检索**：pgvector（轻量）或 Qdrant；长文搜索用 Meilisearch/OpenSearch
- **运维**：Docker Compose 起步，后续 K8s

---

# 接下来可以做什么
1) 用 Prisma 初始化数据库与基础 API
2) 实现 RSS 抓取与规范化入库
3) 写一个最小的去重 + 语义相似聚类脚本
4) 前端做 Sources/Keywords/Requests 三个页面 + Inbox 卡片流
5) 加入一个日报导出按钮（Markdown→PDF）

