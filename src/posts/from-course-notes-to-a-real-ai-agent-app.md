---
title: "From Course Notes to a Real AI Agent App"
subtitle: "A practical stack for moving fast with small agents, server-rendered UI, and AI pairing"
author: "Kulcsar Rudolf"
date: "2026-04-18"
description: "How I built a Python AI agent app as a solo developer using FastAPI, HTMX, Gemini, Groq, and AI pair programming. Notes on the stack and the trade-offs."
keywords:
  [
    "ai agents",
    "llm",
    "fastapi",
    "htmx",
    "python",
    "gemini",
    "groq",
    "solo developer",
    "ai pair programming",
    "cursor",
  ]
private: true
---

## Introduction

I recently finished [The Complete Agentic AI Engineering Course](https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/learn/lecture/49770319?start=15#overview) on Udemy. The instructor kept pushing one simple idea: build agents, explore, and play with LLMs by doing real work.

After more than 17 hours of lessons, plus plenty of additional self-study on the side, I wanted to stop consuming and start building. So I created this app as a small playground for agents, LLMs, and the kind of engineering patterns I wanted to understand better.

<PostImage
src="https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1776523645/udemy-ai-agents-rudolf_b4u2gm.jpg"
alt="Udemy certificate for AI Engineer Agentic Track: The Complete Agent & MCP Course"

/>

I wanted to build it fast, without dragging a big frontend stack into the project. I also wanted clear code, fast feedback, and a setup that I could hold in my head as a solo developer.

So I picked [FastAPI](https://fastapi.tiangolo.com/), [Jinja2](https://jinja.palletsprojects.com/), [HTMX](https://htmx.org/), [Google Gemini](https://ai.google.dev/), and [Groq](https://groq.com/). I used [uv](https://docs.astral.sh/uv/) for Python packages, [Ruff](https://docs.astral.sh/ruff/) for code quality, and Docker for local services. That stack let me focus on the agent flow, not on framework glue.

### TL;DR

I used two small agents instead of one big prompt. I used HTMX instead of React. I used AI pair programming to write boring code faster, clean up rough edges, and keep moving.

In short, the app takes a YouTube video and turns it into structured information. I handle the YouTube download, the transcript, and the agent flow that produces a summary, topics, quotes, and discussion questions from the video.

The app also persists everything. The audio, the transcript, the video metadata, and every summary the app generates all sit in storage. The saved summaries are filterable by many fields, so I can search and slice the archive instead of running the pipeline again.

**This is more than a playground for me. I plan to use it every day, and I think a few friends will use it soon too. That matters a lot to me. I do not want to build things only for the sake of building them. I want to build things that are useful in real life.**

## Two small agents worked better than one big prompt

The core idea is simple. One agent handles the main analysis. Another agent handles quote extraction. Each agent has a small job, a smaller prompt, and a clearer output shape.

That split helped me more than one giant prompt ever did. Smaller prompts are easier to tune. Smaller outputs are easier to validate. When one part goes wrong, I know where to look first.

I also run both agents in parallel, so I do not wait for one result before I start the next one.

```py
with ThreadPoolExecutor(max_workers=2) as executor:
    analysis_future = executor.submit(call_gemini, system_prompt, transcript_text)
    quotes_future = executor.submit(
        extract_quotes,
        transcript_text,
        lang_code,
        approved_examples,
        denied_examples,
    )
```

This pattern keeps the code simple and keeps latency lower. The trade-off is clear too. I now maintain two prompts instead of one.

## I keep prompts in Markdown files

I did not want prompt text buried inside Python strings. I wanted normal files, normal diffs, and normal reviews. So I keep prompts as Markdown files under `agents/prompts/` and load them with a tiny helper.

```py
def load_prompt(path: str | Path) -> tuple[dict[str, str], str]:
    path = Path(path).resolve()
    text = path.read_text(encoding="utf-8")
    meta: dict[str, str] = {}
    body = text
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            body = parts[2].strip()
    return meta, body
```

This gave me a better workflow. I can version prompts like any other file. I can compare prompt changes in Git. I can ask AI to help rewrite a prompt without mixing that work into Python code.

## HTMX gave me enough UI without React

I like React, but this project did not need React. I did not need a client-side app with complex local state, routing, hydration, or a build pipeline. I needed forms, partial updates, loading states, and a clean server-rendered UI.

HTMX handled that with very little code. FastAPI returns HTML. Jinja renders the templates. HTMX swaps the right fragment into the page.

```html
<form
  hx-post="/quotes/{{ q._id }}/text"
  hx-target="#quote-{{ q._id }}"
  hx-swap="outerHTML"
>
  <textarea name="text" required>{{ q.text }}</textarea>
  <button type="submit">Save</button>
</form>
```

That was enough for this app. I skipped a bundler. I skipped frontend state management. I skipped a lot of glue code. If I needed offline-first UX or very rich client-side state, I would pick React. For this app, HTMX let me move faster.

## AI pair programming helped most with boring code

The biggest speed boost did not come from one magic prompt. It came from many small loops with AI.

AI helped me scaffold FastAPI routes, shape Pydantic models, draft prompt files, write repetitive HTML, and clean up refactors. It also helped me move between ideas faster because I could ask for a first draft, review it, and tighten it in small steps.

AI did not solve the hard parts for me. I still had to decide the product shape, tune prompts, debug async edges, and judge output quality. That part still needs taste and context.

The best trick I found is simple. Keep files small. Give things clear names. Split responsibilities early. AI works much better when the context stays clean.

## What's next

I still want to keep learning about agents. I want to understand how to make them safer, more reliable, and cheaper to run.

That feels more important to me now than adding one more feature. I think that is where the real engineering work starts.
