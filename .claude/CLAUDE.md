[根目录](../CLAUDE.md) > **.claude**

---

# Claude IDE Integration 模块文档

## 变更记录 (Changelog)

### 2025-12-19 10:12:29
- 初始化 Claude Code 集成模块文档
- 完成命令映射清单
- 生成使用指南

---

## 模块职责

**.claude** 目录提供 **Claude Code IDE** 的集成配置，通过 `/` 命令系统激活 BMad Method 的代理和任务。

### 核心功能
- 将 `.bmad-core/` 中的代理和任务镜像到 Claude Code 可识别的结构
- 提供 slash 命令接口（`/pm`, `/architect`, `/dev`, `/qa` 等）
- 与 `.bmad-core/` 保持同步（由 `bmad-method install` 管理）

---

## 入口与启动

### 激活方式
在 Claude Code 中，使用 `/` 前缀调用代理：

```bash
# 代理调用
/bmad-master        # 全能代理
/pm                 # 产品经理
/architect          # 架构师
/dev                # 开发者
/qa                 # QA 测试架构师
/sm                 # Scrum Master
/po                 # 产品负责人
/analyst            # 需求分析师
/ux-expert          # UX 专家

# 任务调用（通过代理）
/qa *risk {story}            # QA 代理执行风险评估任务
/po *shard {document}        # PO 代理执行文档拆分任务
/sm *create-next-story       # SM 代理创建下一个 Story
```

### 目录结构
```
.claude/
├── commands/
│   └── BMad/
│       ├── agents/           # 10 个代理定义（镜像 .bmad-core/agents/）
│       └── tasks/            # 27 个任务模板（镜像 .bmad-core/tasks/）
└── index.json                # 元数据索引（本次初始化生成）
```

---

## 对外接口

### 代理命令清单

| Slash 命令 | 代理文件 | 职责 | 关联任务 |
|-----------|---------|------|---------|
| `/bmad-master` | `agents/bmad-master.md` | 全能代理 | 除 Dev 实施外的所有任务 |
| `/pm` | `agents/pm.md` | 产品经理 | `create-doc`, `shard-doc` |
| `/architect` | `agents/architect.md` | 架构师 | `create-doc`, `execute-checklist` |
| `/dev` | `agents/dev.md` | 开发者 | 实施 Story 任务列表 |
| `/qa` | `agents/qa.md` | 测试架构师 | `*risk`, `*design`, `*trace`, `*nfr`, `*review`, `*gate` |
| `/sm` | `agents/sm.md` | Scrum Master | `create-next-story`, `validate-next-story` |
| `/po` | `agents/po.md` | 产品负责人 | `execute-checklist`, `shard-doc`, `validate-next-story` |
| `/analyst` | `agents/analyst.md` | 需求分析师 | `facilitate-brainstorming-session`, `advanced-elicitation` |
| `/ux-expert` | `agents/ux-expert.md` | UX 专家 | `generate-ai-frontend-prompt`, `create-doc` |

### 任务命令清单（通过代理调用）

**风险与质量管理**
- `*risk` → `tasks/risk-profile.md`: 风险评估
- `*nfr` → `tasks/nfr-assess.md`: 非功能性需求评估
- `*gate` → `tasks/qa-gate.md`: 质量门管理
- `*review` → `tasks/review-story.md`: Story 全面审查
- `tasks/apply-qa-fixes.md`: 应用 QA 修复

**测试设计**
- `*design` → `tasks/test-design.md`: 测试策略设计
- `*trace` → `tasks/trace-requirements.md`: 需求追溯

**文档管理**
- `*shard` → `tasks/shard-doc.md`: 拆分文档
- `tasks/create-doc.md`: 创建新文档
- `tasks/document-project.md`: 项目文档化
- `tasks/index-docs.md`: 文档索引

**Story 管理**
- `*create-next-story` → `tasks/create-next-story.md`: 创建下一个 Story
- `*validate-next-story` → `tasks/validate-next-story.md`: 验证 Story
- `tasks/brownfield-create-story.md`: Brownfield Story
- `tasks/brownfield-create-epic.md`: Brownfield Epic

**其他**
- `tasks/facilitate-brainstorming-session.md`: 头脑风暴
- `tasks/generate-ai-frontend-prompt.md`: 前端 AI 提示词
- `tasks/create-deep-research-prompt.md`: 深度研究提示词
- `tasks/kb-mode-interaction.md`: 知识库交互
- `tasks/correct-course.md`: 纠正路径
- `tasks/advanced-elicitation.md`: 高级需求挖掘
- `tasks/execute-checklist.md`: 执行检查清单

---

## 关键依赖与配置

### 依赖关系
- **上游依赖**: `.bmad-core/` (核心框架)
- **同步机制**: 通过 `npx bmad-method install -f` 自动同步
- **版本绑定**: 跟随 `.bmad-core/install-manifest.yaml` 中的版本

### 配置文件
**元数据索引**: `.claude/index.json`（本次初始化生成）

该文件记录：
- 模块列表与职责
- 代理与任务的映射关系
- 文件哈希（用于变更检测）
- 依赖关系

**注意**: 此文件由架构师工具自动生成，不建议手动编辑。

---

## 数据模型

**无独立数据模型**。`.claude/` 模块完全依赖 `.bmad-core/` 的模板和配置。

---

## 测试与质量

### 同步验证
确保 `.claude/` 与 `.bmad-core/` 保持一致：

```bash
# 检查文件完整性
npx bmad-method install -f

# 验证哈希值
cat .bmad-core/install-manifest.yaml | grep -A 5 "modified: false"
```

### 质量标准
- ✅ **镜像完整性**: 所有 `.bmad-core/agents/` 和 `.bmad-core/tasks/` 文件必须在 `.claude/commands/BMad/` 中存在
- ✅ **版本一致性**: 与 `.bmad-core/` 版本号匹配
- ✅ **命令可用性**: 所有 `/` 命令可正常调用

---

## 常见问题 (FAQ)

### Q1: 为什么 `.claude/` 和 `.bmad-core/` 有重复文件？
**A**: `.claude/` 是 **Claude Code 集成层**，需要特定的目录结构才能被 IDE 识别。`.bmad-core/` 是**核心实现**，支持多种 IDE（OpenCode, Codex, Windsurf 等）。重复是为了兼容性，由工具自动管理。

### Q2: 如何添加自定义代理或任务？
**A**: 不建议直接修改 `.claude/` 目录。正确流程：
1. 在 `.bmad-core/agents/` 或 `.bmad-core/tasks/` 中添加自定义文件
2. 运行 `npx bmad-method install -f` 重新同步
3. 自定义内容会自动镜像到 `.claude/`

### Q3: 为什么某个命令不可用？
**A**: 可能原因：
- IDE 未正确加载配置（重启 IDE）
- 文件同步失败（运行 `npx bmad-method install -f`）
- 命令名称错误（检查 `/` 后的名称是否正确）

### Q4: `.claude/index.json` 是做什么用的？
**A**: 记录项目元数据，包括：
- 模块列表与职责
- 文件统计与覆盖率
- 代理与任务的映射关系
- 后续扫描优先级

由架构师工具生成，用于增量更新与断点续扫。

### Q5: 如何切换到其他 IDE（如 Cursor、Windsurf）？
**A**: BMad Method 支持多种 IDE。切换方式：
1. 运行 `npx bmad-method install -f -i <ide-name>`
2. 可用选项：`claude-code`, `opencode`, `codex`, `codex-web`
3. 不同 IDE 的激活方式：
   - Claude Code: `/pm`, `/dev` 等
   - Cursor/Windsurf: `@pm`, `@dev` 等
   - OpenCode: 通过 `opencode.jsonc` 配置

### Q6: 更新框架后 `.claude/` 没有变化？
**A**: 使用 **强制刷新**：
```bash
npx bmad-method install -f -i claude-code
```

### Q7: 可以删除 `.claude/` 目录吗？
**A**: **不可以**。这会导致 Claude Code 无法识别 BMad 代理。如果误删，运行 `npx bmad-method install -f` 重新生成。

---

## 相关文件清单

### 代理文件（10 个）
```
commands/BMad/agents/
├── analyst.md
├── architect.md
├── bmad-master.md
├── bmad-orchestrator.md
├── dev.md
├── pm.md
├── po.md
├── qa.md
├── sm.md
└── ux-expert.md
```

### 任务文件（27 个）
```
commands/BMad/tasks/
├── advanced-elicitation.md
├── apply-qa-fixes.md
├── brownfield-create-epic.md
├── brownfield-create-story.md
├── correct-course.md
├── create-brownfield-story.md
├── create-deep-research-prompt.md
├── create-doc.md
├── create-next-story.md
├── document-project.md
├── execute-checklist.md
├── facilitate-brainstorming-session.md
├── generate-ai-frontend-prompt.md
├── index-docs.md
├── kb-mode-interaction.md
├── nfr-assess.md
├── qa-gate.md
├── review-story.md
├── risk-profile.md
├── shard-doc.md
├── test-design.md
├── trace-requirements.md
└── validate-next-story.md
```

### 元数据文件
```
.claude/
└── index.json                # 项目元数据（本次生成）
```

---

## 快速参考

### 常用 Slash 命令

**规划阶段**
```bash
/analyst                    # 市场调研与需求分析
/pm                         # 创建 PRD
/architect                  # 设计系统架构
/po *master-checklist       # 运行主检查清单
/po *shard docs/prd.md      # 拆分 PRD 文档
```

**开发阶段**
```bash
/sm *create-next-story      # 创建下一个 Story
/qa *risk docs/stories/epic-1.story-2.md      # 风险评估
/qa *design docs/stories/epic-1.story-2.md    # 测试设计
/dev                        # 开始开发
/qa *trace docs/stories/epic-1.story-2.md     # 检查测试覆盖率
/qa *review docs/stories/epic-1.story-2.md    # 全面审查
```

**质量保证**
```bash
/qa *nfr docs/stories/epic-1.story-2.md       # NFR 评估
/qa *gate docs/stories/epic-1.story-2.md      # 更新质量门
```

### 代理选择建议

| 场景 | 推荐代理 | 理由 |
|------|---------|------|
| 快速原型设计 | `/bmad-master` | 全能，减少上下文切换 |
| 严格流程项目 | 专门代理 | 更符合角色分工，输出更聚焦 |
| Web 平台协作 | `/bmad-orchestrator` | 团队协调（仅限 Web） |
| 持续开发 | `/dev` | 专注代码实施与调试 |
| 质量门控 | `/qa` | 风险评估与测试架构 |

---

## 同步检查清单

在以下情况需要重新同步：

- ✅ 更新了 BMad Method 版本
- ✅ 手动修改了 `.bmad-core/` 中的代理或任务
- ✅ 切换了 IDE
- ✅ 添加了扩展包（expansion packs）
- ✅ `.bmad-core/install-manifest.yaml` 显示 `modified: true`

**同步命令**:
```bash
npx bmad-method install -f -i claude-code
```

---

**模块文档版本**: v1.0.0
**最后更新**: 2025-12-19 10:12:29
**IDE**: Claude Code
**框架版本**: BMad Method v4.44.3
