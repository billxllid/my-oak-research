# Oak Research - 全局任务清单

本文件跟踪整个项目的开发进度。模块内的更细粒度任务可拆分到 `docs/tasks/` 下的子任务文件。

---

## Completed Tasks

- [x] 搭建 Next.js 15 + Tailwind + Shadcn UI 项目结构
- [x] 初始化 Prisma Schema（User / Role / Keyword / Content / Report 等基础模型）
- [x] 建立 Cursor 规则体系（project-structure, page-layouts, features/_, ai/_, utilities, api-routes 等）

## In Progress Tasks

- [ ] 关注速报模块（配置 + 内容展示）
- [ ] 报告编写模块（模板 + 编辑 + 管理）
- [ ] 资料库模块（知识库 + 收藏夹）
- [ ] 仪表盘模块（热词 + 最新内容）
- [ ] 系统管理模块（用户 + 日志）

## Future Tasks

- [ ] AI Agent Orchestration（多 Agent 协作与任务调度）
- [ ] CI/CD 流程与部署脚本
- [ ] E2E 测试（Playwright）覆盖核心路径
- [ ] AI 功能测试（Schema + Prompt 注入防御回归）
- [ ] 国际化支持（i18n）
- [ ] 导出功能（PDF/DOCX/Markdown 报告）

---

## Implementation Plan

- 前端：Next.js 15 App Router + Tailwind + Shadcn UI
- 表单：React Hook Form + Zod
- 数据：Prisma + Postgres（pgvector）
- 数据获取：SWR 全局 fetcher + tag 缓存
- 后端：Next.js API Route + Server Actions
- AI：统一通过 LLM Gateway 调用 + Schema 校验
- 测试：Vitest 单测 + Playwright E2E + AI 专用回归测试

---

## Relevant Files

- apps/web/app/(focus-bulletin)/... 🚧
- apps/web/app/(report-writer)/... 🚧
- apps/web/app/(library)/... 🚧
- apps/web/app/(dashboard)/... 🚧
- apps/web/app/(admin)/... 🚧
- packages/prisma/schema.prisma ✅
- cursor-rules/@project-structure.mdc ✅
- cursor-rules/@task-workflow.mdc ✅
- cursor-rules/features/focus-bulletin.mdc ✅
- cursor-rules/features/report-writer.mdc ✅
- cursor-rules/features/library-system.mdc ✅
- cursor-rules/features/dashboard.mdc ✅
- cursor-rules/features/sys-admin.mdc ✅
