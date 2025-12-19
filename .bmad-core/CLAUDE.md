[根目录](../CLAUDE.md) > **.bmad-core**

---

# BMad Core Framework 模块文档

## 变更记录 (Changelog)

### 2025-12-19 10:12:29
- 初始化模块文档
- 完成组件清单与接口映射
- 生成使用指南

---

## 模块职责

**BMad Core Framework** 是整个 BMad Method 的核心实现，提供：
- **10 个 AI 代理**：模拟不同角色（分析师、PM、架构师、开发、QA 等）
- **27 个任务模板**：可复用的原子化工作流程
- **6 个标准工作流**：Greenfield/Brownfield 全栈/服务/UI 工作流
- **13 个文档模板**：PRD、架构、Story、QA Gate 等
- **知识库与检查清单**：测试框架、技术偏好、质量标准

---

## 入口与启动

### 核心配置文件
**文件路径**: `core-config.yaml`

```yaml
markdownExploder: true
qa:
  qaLocation: docs/qa
prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true
  prdShardedLocation: docs/prd
architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories
slashPrefix: BMad
```

### 框架版本
- **当前版本**: v4.44.3
- **安装时间**: 2025-12-19T02:12:50.085Z
- **安装类型**: full
- **IDE 集成**: claude-code

---

## 对外接口

### 代理系统（Agents）

框架提供 10 个角色化 AI 代理，每个代理专注于特定职责：

| 代理 | 文件 | 职责 | 激活方式 |
|------|------|------|---------|
| **BMad-Master** | `bmad-master.md` | 全能代理，可执行除 Story 实施外的所有任务 | `/bmad-master` |
| **BMad-Orchestrator** | `bmad-orchestrator.md` | Web 平台团队协调器（重量级，仅限 Web） | `/bmad-orchestrator` |
| **Analyst** | `analyst.md` | 市场调研、竞品分析、需求挖掘 | `/analyst` |
| **PM** | `pm.md` | 产品需求文档（PRD）创建与维护 | `/pm` |
| **Architect** | `architect.md` | 系统架构设计与技术决策 | `/architect` |
| **PO** | `po.md` | Epic/Story 管理，文档对齐检查 | `/po` |
| **SM** | `sm.md` | Sprint 计划，Story 草稿创建 | `/sm` |
| **Dev** | `dev.md` | 代码实施、测试编写、调试 | `/dev` |
| **QA** | `qa.md` | 测试架构设计、风险评估、质量保证 | `/qa` |
| **UX-Expert** | `ux-expert.md` | 前端规范、UI 设计、可访问性 | `/ux-expert` |

**代理依赖系统示例**:
```yaml
dependencies:
  templates:
    - prd-template.md
  tasks:
    - create-doc.md
    - shard-doc.md
  data:
    - bmad-kb.md
```

### 任务库（Tasks）

27 个可复用任务模板，按功能分类：

#### 风险与质量管理
- `risk-profile.md`: 风险评估与打分（P×I 矩阵）
- `nfr-assess.md`: 非功能性需求评估（安全、性能、可靠性、可维护性）
- `qa-gate.md`: 质量门决策管理
- `review-story.md`: Story 全面质量审查
- `apply-qa-fixes.md`: 应用 QA 建议的修复

#### 测试设计
- `test-design.md`: 创建测试策略（场景、级别、优先级）
- `trace-requirements.md`: 需求追溯与覆盖率验证

#### 文档管理
- `shard-doc.md`: 拆分大文档为模块化碎片
- `create-doc.md`: 按模板生成新文档
- `document-project.md`: 项目文档化
- `index-docs.md`: 创建文档索引

#### Story 管理
- `create-next-story.md`: 从 Epic 创建下一个 Story
- `validate-next-story.md`: 验证 Story 草稿质量
- `brownfield-create-story.md`: Brownfield 项目 Story 创建
- `brownfield-create-epic.md`: Brownfield 项目 Epic 创建

#### 其他
- `facilitate-brainstorming-session.md`: 引导头脑风暴会议
- `generate-ai-frontend-prompt.md`: 生成前端 AI 工具提示词
- `create-deep-research-prompt.md`: 创建深度研究提示词
- `kb-mode-interaction.md`: 知识库模式交互
- `correct-course.md`: 纠正偏离路径
- `advanced-elicitation.md`: 高级需求挖掘
- `execute-checklist.md`: 执行检查清单

### 工作流（Workflows）

6 个标准化工作流，编排任务和代理：

| 工作流 | 文件 | 适用场景 |
|--------|------|---------|
| **Greenfield Fullstack** | `greenfield-fullstack.yaml` | 新建全栈项目（前端+后端+数据库） |
| **Greenfield Service** | `greenfield-service.yaml` | 新建后端服务/API 项目 |
| **Greenfield UI** | `greenfield-ui.yaml` | 新建前端/UI 项目 |
| **Brownfield Fullstack** | `brownfield-fullstack.yaml` | 改造现有全栈项目 |
| **Brownfield Service** | `brownfield-service.yaml` | 改造现有后端服务 |
| **Brownfield UI** | `brownfield-ui.yaml` | 改造现有前端项目 |

**工作流阶段**:
1. **规划阶段**: Analyst → PM → Architect → PO 检查清单
2. **开发阶段**: SM 草稿 Story → QA 评估 → Dev 实施 → QA 审查
3. **交付阶段**: 回归测试 → 提交代码

---

## 关键依赖与配置

### 模板系统（Templates）

13 个 YAML 格式的文档模板：

| 模板 | 用途 | 输出路径 |
|------|------|---------|
| `prd-tmpl.yaml` | 产品需求文档 | `docs/prd.md` |
| `architecture-tmpl.yaml` | 系统架构文档 | `docs/architecture.md` |
| `story-tmpl.yaml` | 用户故事 | `docs/stories/{epic}.{story}.md` |
| `qa-gate-tmpl.yaml` | 质量门决策 | `docs/qa/gates/{epic}.{story}-{slug}.yml` |
| `front-end-spec-tmpl.yaml` | 前端规范 | `docs/front-end-spec.md` |
| `front-end-architecture-tmpl.yaml` | 前端架构 | `docs/front-end-architecture.md` |
| `fullstack-architecture-tmpl.yaml` | 全栈架构 | `docs/architecture.md` |
| `brownfield-prd-tmpl.yaml` | Brownfield PRD | `docs/prd.md` |
| `brownfield-architecture-tmpl.yaml` | Brownfield 架构 | `docs/architecture.md` |
| `project-brief-tmpl.yaml` | 项目概要 | `docs/project-brief.md` |
| `market-research-tmpl.yaml` | 市场调研 | `docs/market-research.md` |
| `competitor-analysis-tmpl.yaml` | 竞品分析 | `docs/competitor-analysis.md` |
| `brainstorming-output-tmpl.yaml` | 头脑风暴输出 | `docs/brainstorming-output.md` |

### 知识库与数据（Data）

6 个知识库文件，为代理提供方法论支持：

| 文件 | 内容 | 用途 |
|------|------|------|
| `bmad-kb.md` | BMad 方法论知识库 | 所有代理的核心参考 |
| `test-levels-framework.md` | 测试级别框架 | 定义 Unit/Integration/E2E 标准 |
| `test-priorities-matrix.md` | 测试优先级矩阵 | 基于风险的测试优先级决策 |
| `technical-preferences.md` | 技术偏好配置 | PM/Architect 技术栈推荐依据 |
| `brainstorming-techniques.md` | 头脑风暴技巧 | Analyst 引导创意会议 |
| `elicitation-methods.md` | 需求挖掘方法 | Analyst/PM 需求收集技巧 |

### 检查清单（Checklists）

6 个角色级检查清单：

| 清单 | 角色 | 用途 |
|------|------|------|
| `po-master-checklist.md` | Product Owner | 文档对齐与准备状态验证 |
| `architect-checklist.md` | Architect | 架构设计完整性检查 |
| `pm-checklist.md` | Product Manager | PRD 质量检查 |
| `story-draft-checklist.md` | Scrum Master | Story 草稿质量验证 |
| `story-dod-checklist.md` | Dev/QA | Story 完成定义（DoD）验证 |
| `change-checklist.md` | 所有角色 | 变更管理流程 |

---

## 数据模型

### 质量门（QA Gate）模型

**路径**: `docs/qa/gates/{epic}.{story}-{slug}.yml`

```yaml
story_id: "epic-1.story-2"
story_title: "用户登录功能"
gate_decision: "PASS"  # PASS | CONCERNS | FAIL | WAIVED
gate_date: "2025-12-19"
reviewer: "Quinn (QA Agent)"

summary:
  requirements_coverage: 100
  test_coverage: 95
  critical_issues: 0
  concerns: 1

issues:
  critical: []
  major: []
  minor:
    - description: "登录失败消息可以更友好"
      severity: "low"
      recommendation: "改进错误提示文案"

waiver: null  # 如 WAIVED，包含 reason, approver, expiry_date
```

### 风险评估（Risk Profile）模型

**路径**: `docs/qa/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`

```yaml
story_id: "epic-1.story-2"
assessment_date: "2025-12-19"
risk_score: 12  # Probability (1-3) × Impact (1-3)

risks:
  - category: "Security"
    description: "用户密码存储"
    probability: 3  # High
    impact: 4       # Critical
    score: 12
    mitigation: "使用 bcrypt 哈希，加盐轮数≥12"

  - category: "Performance"
    description: "高并发登录"
    probability: 2  # Medium
    impact: 3       # High
    score: 6
    mitigation: "实现 Redis 会话缓存，设置速率限制"
```

### Story 模型

**路径**: `docs/stories/{epic}.{story}.md`

```yaml
story_id: "epic-1.story-2"
title: "用户登录功能"
epic_reference: "docs/prd/epic-1.md"
acceptance_criteria:
  - "用户输入有效凭证后成功登录"
  - "登录失败时显示友好错误消息"
  - "实现 CSRF 保护"

tasks:
  - id: "task-1"
    description: "创建登录 API 端点"
    status: "done"
  - id: "task-2"
    description: "实现密码哈希验证"
    status: "done"

qa_results:
  gate_file: "docs/qa/gates/epic-1.story-2-login.yml"
  decision: "PASS"
```

---

## 测试与质量

### QA 代理（Test Architect）工作流

#### 1. 风险评估阶段（Story 草稿后）
```bash
/qa *risk {story-file}
```
**输出**: `docs/qa/assessments/{epic}.{story}-risk-{date}.md`
- 识别 6 类风险：Technical, Security, Performance, Data, Business, Operational
- 计算风险分数（P×I，1-9 分）
- 提供缓解策略
- 高风险（≥9）触发 FAIL，中风险（≥6）触发 CONCERNS

#### 2. 测试设计阶段（风险评估后）
```bash
/qa *design {story-file}
```
**输出**: `docs/qa/assessments/{epic}.{story}-test-design-{date}.md`
- 为每个验收标准设计测试场景
- 推荐测试级别（Unit/Integration/E2E）
- 风险驱动优先级（P0/P1/P2）
- 测试数据与 Mock 策略

#### 3. 需求追溯阶段（开发中）
```bash
/qa *trace {story-file}
```
**输出**: `docs/qa/assessments/{epic}.{story}-trace-{date}.md`
- 映射验收标准到测试用例
- 使用 Given-When-Then 格式（文档化）
- 识别覆盖率缺口
- 生成可追溯性矩阵

#### 4. NFR 评估阶段（开发中/早期审查）
```bash
/qa *nfr {story-file}
```
**输出**: `docs/qa/assessments/{epic}.{story}-nfr-{date}.md`
- 验证 4 大 NFR：Security, Performance, Reliability, Maintainability
- 基于证据（不是假设）
- NFR 失败直接影响质量门

#### 5. 全面审查阶段（Story 完成后）
```bash
/qa *review {story-file}
```
**输出**: Story 内 QA Results 章节 + `docs/qa/gates/{epic}.{story}-{slug}.yml`
- 执行需求追溯性分析
- 测试级别分析
- 覆盖率评估
- **主动重构**（安全时改进代码）
- 发布质量门决策

#### 6. 质量门更新阶段（修复后）
```bash
/qa *gate {story-file}
```
**输出**: 更新 `docs/qa/gates/{epic}.{story}-{slug}.yml`
- 更新质量门状态
- 记录修复验证
- 更新风险评估

### 质量标准

- ✅ **无不稳定测试**: 通过适当的异步处理
- ✅ **无硬等待**: 动态等待策略（如 `waitForElement`）
- ✅ **无状态 & 并行安全**: 测试间无依赖
- ✅ **自清理**: 测试管理自己的测试数据
- ✅ **适当的测试级别**: Unit（逻辑）/ Integration（交互）/ E2E（旅程）
- ✅ **显式断言**: 断言在测试中，而非帮助函数

### 质量门决策规则

| 状态 | 触发条件 | 含义 |
|------|---------|------|
| **PASS** | 所有 P0 测试通过，无 Critical 问题 | 可以发布 |
| **CONCERNS** | 有 Major 问题或中等风险（6-8 分） | 团队应审查 |
| **FAIL** | 有 Critical 问题或高风险（≥9 分） | 应该修复后再发布 |
| **WAIVED** | 团队明确接受已识别问题 | 需记录原因、批准人、到期日期 |

---

## 常见问题 (FAQ)

### Q1: 如何选择使用哪个代理？
**A**:
- **简单任务**：使用 `BMad-Master`（全能代理）
- **复杂流程**：按角色分工使用专门代理（PM、Architect、Dev、QA 等）
- **Web 平台**：使用 `BMad-Orchestrator`（仅限 Web UI）

### Q2: Greenfield 与 Brownfield 的区别？
**A**:
- **Greenfield**: 从零开始的新项目
  - 使用 `greenfield-*.yaml` 工作流
  - 强调前期设计与架构
- **Brownfield**: 改造现有项目
  - 使用 `brownfield-*.yaml` 工作流
  - 需额外的遗留系统评估
  - 重点关注兼容性与迁移策略

### Q3: 如何配置 devLoadAlwaysFiles？
**A**: 编辑 `core-config.yaml` 中的 `devLoadAlwaysFiles` 列表，确保：
1. 这些文件存在于项目中
2. 内容精简，仅包含核心编码标准
3. 随项目演进定期更新
4. Dev 代理会自动加载这些文件到上下文

### Q4: 质量门（QA Gate）是否会阻塞发布？
**A**: **不会**。质量门是**咨询性（Advisory）**的：
- PASS/CONCERNS/FAIL 是建议，不是强制
- 团队可选择 WAIVED（需记录原因）
- QA 代理拥有 `docs/qa/` 目录的**并行权限**（不修改源代码）

### Q5: 如何更新框架版本？
**A**:
```bash
# 强制刷新到最新版本
npx bmad-method install -f

# 检查是否有文件被修改
cat .bmad-core/install-manifest.yaml
```

### Q6: 代理的依赖系统如何工作？
**A**:
- 每个代理的 YAML frontmatter 声明依赖（templates, tasks, data）
- IDE 集成时自动解析依赖关系
- 只加载所需资源，保持上下文精简
- 依赖是共享的，确保一致性

### Q7: 如何自定义技术偏好？
**A**: 编辑 `.bmad-core/data/technical-preferences.md`：
- 添加首选框架（React, Vue, Angular 等）
- 定义数据库选择
- 指定测试工具
- 配置架构模式偏好
- PM 和 Architect 代理会参考此配置

### Q8: Story 与 Task 的区别？
**A**:
- **Story**: 用户价值单元，包含验收标准、任务列表、QA 结果
  - 文件路径: `docs/stories/{epic}.{story}.md`
  - 由 SM 创建，Dev 实施，QA 审查
- **Task**: BMad 框架的可复用任务模板
  - 文件路径: `.bmad-core/tasks/{task-name}.md`
  - 由代理调用，不直接暴露给用户

---

## 相关文件清单

### 核心文件
```
.bmad-core/
├── core-config.yaml                    # 核心配置
├── install-manifest.yaml               # 安装清单（含文件哈希）
├── user-guide.md                       # 用户指南（578 行）
├── working-in-the-brownfield.md        # Brownfield 项目指南
└── enhanced-ide-development-workflow.md # 增强 IDE 工作流
```

### 代理目录（10 个）
```
agents/
├── analyst.md                  # 需求分析师
├── architect.md                # 系统架构师
├── bmad-master.md              # 全能代理
├── bmad-orchestrator.md        # Web 团队协调器
├── dev.md                      # 开发者
├── pm.md                       # 产品经理
├── po.md                       # 产品负责人
├── qa.md                       # 测试架构师
├── sm.md                       # Scrum Master
└── ux-expert.md                # UX 专家
```

### 任务目录（27 个）
```
tasks/
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

### 工作流目录（6 个）
```
workflows/
├── greenfield-fullstack.yaml
├── greenfield-service.yaml
├── greenfield-ui.yaml
├── brownfield-fullstack.yaml
├── brownfield-service.yaml
└── brownfield-ui.yaml
```

### 模板目录（13 个）
```
templates/
├── architecture-tmpl.yaml
├── brainstorming-output-tmpl.yaml
├── brownfield-architecture-tmpl.yaml
├── brownfield-prd-tmpl.yaml
├── competitor-analysis-tmpl.yaml
├── front-end-architecture-tmpl.yaml
├── front-end-spec-tmpl.yaml
├── fullstack-architecture-tmpl.yaml
├── market-research-tmpl.yaml
├── prd-tmpl.yaml
├── project-brief-tmpl.yaml
├── qa-gate-tmpl.yaml
└── story-tmpl.yaml
```

### 数据与知识库（6 个）
```
data/
├── bmad-kb.md
├── brainstorming-techniques.md
├── elicitation-methods.md
├── technical-preferences.md
├── test-levels-framework.md
└── test-priorities-matrix.md
```

### 检查清单（6 个）
```
checklists/
├── architect-checklist.md
├── change-checklist.md
├── pm-checklist.md
├── po-master-checklist.md
├── story-dod-checklist.md
└── story-draft-checklist.md
```

### 工具与实用程序
```
utils/
├── bmad-doc-template.md           # 文档模板格式
└── workflow-management.md         # 工作流管理指南
```

### Agent Teams（4 个）
```
agent-teams/
├── team-all.yaml                  # 全团队（所有代理）
├── team-fullstack.yaml            # 全栈团队
├── team-ide-minimal.yaml          # IDE 最小团队
└── team-no-ui.yaml                # 无 UI 团队（后端）
```

---

## 快速参考

### 常用命令速查

**规划阶段**
```bash
/analyst                    # 开始市场调研
/pm                         # 创建 PRD
/architect                  # 设计架构
/po *master-checklist       # 运行主检查清单
/po *shard {doc}            # 拆分文档
```

**开发阶段**
```bash
/sm *create-next-story      # 创建下一个 Story
/qa *risk {story}           # 风险评估
/qa *design {story}         # 测试设计
/dev                        # 开始开发
/qa *trace {story}          # 检查覆盖率（开发中）
/qa *review {story}         # 全面审查（完成后）
```

**质量保证**
```bash
/qa *nfr {story}            # NFR 评估
/qa *gate {story}           # 更新质量门
```

### 文档路径约定
```
docs/
├── prd.md                           # 产品需求文档（或 prd/）
├── architecture.md                  # 系统架构文档（或 architecture/）
├── stories/                         # 用户故事
│   └── {epic}.{story}.md
├── qa/
│   ├── assessments/                 # QA 评估
│   │   ├── {epic}.{story}-risk-{date}.md
│   │   ├── {epic}.{story}-test-design-{date}.md
│   │   ├── {epic}.{story}-trace-{date}.md
│   │   └── {epic}.{story}-nfr-{date}.md
│   └── gates/                       # 质量门
│       └── {epic}.{story}-{slug}.yml
└── prd/                             # PRD 碎片（Sharded）
    └── epic-*.md
```

---

**模块文档版本**: v1.0.0
**最后更新**: 2025-12-19 10:12:29
**维护者**: BMad Method v4.44.3
