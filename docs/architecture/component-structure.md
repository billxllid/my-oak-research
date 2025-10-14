# Oak Research 组件架构规范

本文档定义了 Oak Research 项目中的组件组织结构和使用规范。

## 📁 目录结构

```
components/
├── ui/                          # 🔹 Shadcn UI 原生组件
│   ├── button.tsx              # 按钮组件
│   ├── input.tsx               # 输入组件
│   ├── dialog.tsx              # 对话框组件
│   ├── table.tsx               # 表格组件
│   ├── ...                     # 其他 Shadcn UI 组件
│   └── index.ts                # 导出所有 UI 原生组件
├── common/                      # 🔸 业务通用组件
│   ├── data-table.tsx          # 通用数据表格
│   ├── resource-dialog.tsx     # 通用资源对话框
│   ├── delete-alert.tsx        # 通用删除确认
│   ├── setting-card.tsx        # 通用设置卡片
│   └── index.ts                # 导出所有通用组件
├── business/                    # 🔸 业务特定组件
│   ├── NewsCard.tsx            # 新闻卡片
│   ├── NewsDetailCard.tsx      # 新闻详情卡片
│   ├── ErrorMessage.tsx        # 错误消息组件
│   ├── SettingCard.tsx         # 原业务设置卡片
│   └── index.ts                # 导出所有业务组件
├── layout/                      # 🔸 布局相关组件
│   ├── SettingEditDialog.tsx   # 设置编辑对话框
│   ├── SettingDeleteAlertDialog.tsx # 设置删除确认对话框
│   └── index.ts                # 导出所有布局组件
└── index.ts                     # 统一导出入口
```

## 🎯 设计原则

### 1. 清晰分层

- **ui/**: 纯 UI 组件，无业务逻辑
- **common/**: 可复用的业务组件，封装常见模式
- **business/**: 特定业务场景组件
- **layout/**: 页面布局和容器组件

### 2. 依赖方向

```
business/ → common/ → ui/
layout/ → ui/
```

### 3. 命名规范

- **ui/**: 小写 kebab-case (如 `button.tsx`)
- **其他目录**: PascalCase (如 `DataTable.tsx`)

## 📝 使用指南

### 导入方式

```tsx
// ✅ 推荐：从分类导入
import { Button, Input, Card } from "@/components/ui";
import { DataTable, DeleteAlert } from "@/components/common";
import { NewsCard, ErrorMessage } from "@/components/business";
import { SettingEditDialog } from "@/components/layout";

// ✅ 也可以：从统一入口导入
import {
  Button,
  Input,
  Card, // ui
  DataTable,
  DeleteAlert, // common
  NewsCard,
  ErrorMessage, // business
  SettingEditDialog, // layout
} from "@/components";

// ❌ 避免：直接导入具体文件
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
```

### 新建组件指南

#### 1. 判断组件类型

**UI 组件** - 放入 `ui/`

- 纯展示组件
- 无业务逻辑
- 可在任何项目中复用
- 示例: Button, Input, Dialog

**通用组件** - 放入 `common/`

- 封装常见业务模式
- 可配置，适用多场景
- 基于 UI 组件构建
- 示例: DataTable, ResourceDialog

**业务组件** - 放入 `business/`

- 特定业务场景
- 包含具体业务逻辑
- 示例: NewsCard, KeywordCard

**布局组件** - 放入 `layout/`

- 页面布局相关
- 容器和对话框组件
- 示例: SettingEditDialog

#### 2. 创建新组件流程

1. **确定组件类型和目录**
2. **创建组件文件**
3. **更新对应的 index.ts**
4. **添加类型导出(如需要)**
5. **编写使用文档**

### 迁移指南

从旧结构迁移到新结构：

```bash
# 旧的导入方式
import { DataTable } from "@/components/ui/data-table";

# 新的导入方式
import { DataTable } from "@/components/common";
# 或
import { DataTable } from "@/components";
```

## 🔄 组件分类详解

### UI 组件 (`ui/`)

基于 Shadcn UI 的原生组件，专注于**表现层**：

- ✅ 纯 UI 展示
- ✅ 可主题化
- ✅ 可访问性支持
- ❌ 无业务逻辑
- ❌ 无数据获取
- ❌ 无状态管理

### 通用组件 (`common/`)

封装常见业务模式的**可复用组件**：

- ✅ 配置驱动
- ✅ 类型安全
- ✅ 内置最佳实践
- ✅ React Query 集成
- ✅ 统一错误处理
- ❌ 不包含具体业务逻辑

**示例**:

- `DataTable`: 配置式表格，支持排序、分页、操作
- `ResourceDialog`: 通用 CRUD 对话框
- `DeleteAlert`: 统一删除确认
- `SettingCard`: 设置页面卡片

### 业务组件 (`business/`)

包含具体业务逻辑的**特定场景组件**：

- ✅ 业务逻辑封装
- ✅ 数据获取和处理
- ✅ 特定交互模式
- ❌ 不追求通用性

### 布局组件 (`layout/`)

页面结构和容器相关的**布局组件**：

- ✅ 页面布局
- ✅ 对话框容器
- ✅ 导航结构
- ❌ 不包含具体内容

## 🚀 最佳实践

### 1. 组件设计原则

- **单一职责**: 每个组件只做一件事
- **可组合**: 小组件组合成大组件
- **可配置**: 通过 props 控制行为
- **可预测**: 相同输入产生相同输出

### 2. API 设计

- **一致性**: 相似组件使用相似的 API
- **扩展性**: 预留扩展接口
- **类型安全**: 完整的 TypeScript 支持
- **文档化**: 清晰的 JSDoc 注释

### 3. 性能考虑

- **按需导入**: 避免全量导入
- **懒加载**: 大型组件支持动态导入
- **优化渲染**: 使用 memo 避免不必要渲染
- **批量更新**: 合理使用 batching

## 📊 迁移收益

### 组织收益

- 🎯 **清晰分层**: Shadcn UI vs 业务组件完全分离
- 🛠️ **易于维护**: 组件职责明确，修改影响范围可控
- 📈 **可扩展性**: 新增组件有明确的归属规则
- 🔄 **易于升级**: Shadcn UI 升级不影响业务组件

### 开发收益

- ⚡ **开发效率**: 通用组件减少重复开发
- 🐛 **质量提升**: 统一组件减少 bug
- 📚 **学习成本**: 清晰的组件分类降低上手成本
- 🧪 **测试覆盖**: 通用组件集中测试

### 代码收益

- 📉 **代码减少**: 平均减少 50-87% 重复代码
- 🎨 **一致性**: 统一的 UI/UX 体验
- 🔧 **可维护**: 修改一处，全局生效
- 📦 **体积优化**: 按需导入减少 bundle 大小

这个新的组件架构完全符合 Oak Research 的发展需要，为项目的长期维护和扩展提供了坚实的基础！
