# How to Use Antigravity Skills

This guide explains how skills work in the **Antigravity** environment, how the AI agent discovers and uses them, and how you can request specific skills during your development workflow.

---

## 💡 What are Skills?

In Antigravity, **Skills** are specialized workflows, domain-specific instruction sets, and helper scripts packaged into folders. They extend the agent's capabilities for specific technical tasks (e.g., building 3D experiences, running accessibility audits, setup A/B testing, or generating presentation slides).

---

## 📂 Skill Folder Structure

Each skill lives in its own directory and follows a standardized layout:

```text
.agents/skills/skills/<skill-name>/
├── SKILL.md           # Required: Instructions with YAML frontmatter (name, description)
├── scripts/           # Optional: Deterministic helper scripts (Python, JS, Shell)
├── templates/         # Optional: Code templates or boilerplate
└── references/        # Optional: Extra documentation or cheatsheets
```

---

## ⚙️ How the Agent Uses Skills

### 1. Automatic Discovery
Antigravity automatically scans for skills in the following standard roots:
- Workspace Local: `.agents/skills/` (and `.agents/skills/skills/`)
- Global Config: `~/.gemini/config/skills/`

### 2. On-Demand Loading
When you ask for a task (e.g., *"Perform an accessibility audit on my app"* or *"Help me set up an A/B test"*):
1. The agent searches the skill catalog for a matching skill name or description.
2. The agent reads the corresponding `SKILL.md` using its file viewing tools.
3. The agent follows the step-by-step guidance provided in the skill to complete your request.

---

## 🚀 How You Can Prompt the Agent to Use Skills

### Option A: Explicit Request (Recommended)
You can directly mention the skill name or topic in your prompt:
> *"Use the `accessibility-compliance-accessibility-audit` skill to audit my homepage."*  
> *"Apply the `3d-web-experience` skill guidelines to add a 3D Canvas element."*

### Option B: Implicit Request
Simply ask for the domain task:
> *"Create a 2-slide presentation summary of this project."*  
> *(The agent will automatically locate and load `.agents/skills/skills/2slides-ppt-generator/SKILL.md`)*

---

## 🛠️ Frequently Used Skills Available in `antigravity-awesome-skills`

Below are a few examples of skills available in your workspace repository:

| Skill Directory Name | Purpose |
| :--- | :--- |
| `3d-web-experience` | Step-by-step guidance for building Three.js / WebGL 3D web applications. |
| `accessibility-compliance-accessibility-audit` | Auditing web apps against WCAG accessibility guidelines. |
| `ab-testing` | Designing and implementing split tests and experiment tracking. |
| `2slides-ppt-generator` | Generating presentation deck outlines and code. |
| `acceptance-orchestrator` | Structuring acceptance criteria and test suite verification flows. |

---

## 📌 Best Practices for Managing Skills

1. **Keep `SKILL.md` updated**: If a workflow changes, edit the `SKILL.md` file in the respective skill folder.
2. **Do not modify execution scripts directly during tasks**: Let the agent invoke scripts in `scripts/` as specified in `SKILL.md`.
3. **Add Custom Workspace Skills**: You can create your own custom skill at any time by making a directory `.agents/skills/skills/my-custom-skill/` with a `SKILL.md` file!
