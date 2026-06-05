---
title: "Building Kőszikla: A Church App With an AI Sermon Agent"
subtitle: "A React PWA, an Express API, and a Python AI service for one community"
author: "Kulcsar Rudolf"
date: "2026-06-05"
description: "How I built Kőszikla, a volunteer scheduling PWA for my church, and the multi-agent AI service that turns sermons into searchable study guides. Notes on the stack, the agents, the transcript flow, and the code size."
keywords:
  [
    "pwa",
    "react",
    "express",
    "mongodb",
    "fastapi",
    "ai agents",
    "openai agents sdk",
    "groq whisper",
    "gemini",
    "twilio",
    "open source",
  ]
private: false
---

## Introduction

The Kőszikla community needed a simple way to coordinate church life. Volunteers had different roles for services, events, and other small but important tasks. We tracked many things in spreadsheets, but reminders, changes, and communication still needed too much manual work.

So in August 2023 I started **Kőszikla**, church management software for my local church community. It now serves around 50 members. It sends an SMS when someone gets assigned to a service. It helps members connect with each other every month, like a small [Slack Donut](https://www.donut.com/). It also lists upcoming events and gives access to past recordings.

I built it because the problem was close to me. I knew the people, the workflows, and the small details that usually disappear from generic tools. That made the project useful from the first version.

### TL;DR

Kőszikla is three apps. A **React PWA** for members. An **Express API** for data, scheduling, and SMS. A **Python AI service** that turns a sermon video into a searchable study guide.

The AI part became the most interesting technical layer. It transcribes a sermon, then a set of small agents produce a summary, the Bible verses, discussion questions, and short shareable quotes. My long-term goal is to open-source the whole thing so any church can run it.

## Three apps, one community

I split the project into three repositories. Each one has a single job.

- **`koszikla-app`** is the frontend. React 18, TypeScript 5, Vite 5, Tailwind CSS 3. It installs as a PWA through `vite-plugin-pwa`, so members keep it on the home screen. Forms use React Hook Form and Yup. I document components in Storybook.
- **`koszikla-api`** is the backend. Node.js 20, Express 4, MongoDB 7 with Mongoose. Auth is JWT plus `bcrypt`. SMS goes through Twilio, email through Nodemailer. It syncs the schedule from Google Sheets with `googleapis`, stores audio and covers on Cloudflare R2, and runs reminders with `node-cron`. It ships to Fly.io.
- **`koszikla-ai`** is the sermon service. Python 3.11, FastAPI, Jinja2, and HTMX for the UI. It uses Groq Whisper for transcription and Google Gemini for analysis.

The split keeps each app small. I can change the SMS logic without touching the AI pipeline. I can also run the AI service locally with mocked external services, which helps a lot when I work on UI or tests without spending API credits.

## The scheduling and SMS core

The API reads the schedule from a Google Sheet every five minutes. A cron job sends an SMS reminder every Saturday at 5pm, so nobody forgets their Sunday role.

There is also a connect feature. A service generates monthly groups from members who opt in, then notifies them. The goal is simple. Help people in a 50-person community actually meet each other.

The admin side covers the boring but important parts too. Admins can manage members, roles, events, teaching records, registration requests, and schedule settings. The API also exposes Swagger docs, which makes it easier to test endpoints and explain the system later.

## The AI agents

The sermon service is where I spent the most engineering time. It is not one big prompt. It is a chain of small agents, and each one has a narrow job.

- **Analysis agent**: reads the transcript and returns a one-paragraph summary, the main scripture, other Bible references, suggested topics, and five discussion questions.
- **Quotes pipeline**: a four-step chain. Extraction pulls quote candidates. Deterministic **guardrails** drop bad ones (prayers, bare verses, greetings). An LLM **evaluator** judges the rest and can trigger one retry. A **polish** step cleans the wording.

The analysis and quote extraction run in parallel. Smaller prompts are easier to tune, and smaller outputs are easier to validate.

The quotes agent also learns from feedback. Reviewers approve or deny quotes in the UI. Those decisions feed back into the prompt as approved and denied examples, so the model calibrates over time.

I added two things that made this feel like real engineering, not a demo. I trace every run with [Langfuse](https://langfuse.com/), so I can see why a quote got dropped. I also keep an offline eval harness, so I can change a prompt and measure the result instead of guessing.

I wrapped the analysis and quotes calls as tools for the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python). That orchestrator sits behind a feature flag today. The hand-written path is still the default. It is a migration, not a rewrite.

I also keep the prompts as normal Markdown files, split by language. The service supports Hungarian, Romanian, and English. This matters because the sermons and Bible references do not always follow the same patterns across languages.

## The transcript flow

This is the full path from a video link to a saved study guide. The job runs async, and the UI polls a status endpoint.

1. **Load**: paste a YouTube URL (downloaded with `yt-dlp`) or upload an MP3, M4A, WAV, or OGG file.
2. **Trim**: cut to the part you want with `ffmpeg` stream copy. This skips the worship and keeps the preaching, with no re-encoding.
3. **Transcribe**: send the audio to Groq Whisper `large-v3`. Large files compress to 16kHz mono MP3 first. The output keeps segment timestamps.
4. **Build transcript**: format segments as `[H:MM:SS - H:MM:SS] text`.
5. **Analyze**: run the agents above on the transcript.
6. **Archive**: save the sermon to the shared API or to a local MongoDB. It becomes searchable by title, preacher, topic, date, or Bible reference.

The job moves through a small state machine: `downloading → cutting → transcribing → done`. Each approved quote becomes a one-click link that opens YouTube at the exact second of the quote.

I added a local-only mode too. That mode stores the teaching in the AI service's own MongoDB and uploads assets to MinIO or R2-compatible storage. It helps me test the whole archive flow without touching production data.

## The numbers

I checked the code size across the three repositories. These are code lines only, without lockfiles or generated JSON.

| Repo           | Stack             |  Code lines |
| -------------- | ----------------- | ----------: |
| `koszikla-app` | React PWA         |     ~12,500 |
| `koszikla-api` | Express + MongoDB |     ~10,200 |
| `koszikla-ai`  | Python + FastAPI  |     ~16,800 |
| **Total**      |                   | **~39,500** |

The AI service includes around 3,700 lines of tests. The three repos hold about 650 commits since August 2023. For a side project that runs in production for a real community, I am happy with that.

## What's next

The big goal is open source. I want any church to clone Kőszikla, add their credentials, and run it. That needs better docs, a cleaner setup, and a few config changes to remove my own assumptions.

I also want the AI service to become useful outside my own church. A small church should be able to upload a sermon and get a structured archive without hiring a media team. That means setup must stay simple, costs must stay clear, and the generated content must stay easy to review.

If you build software for a community, or you work with AI agents in production, I would like to hear how you handle quality and evals. Send me a note on [LinkedIn](https://www.linkedin.com/in/kulcsarrudolf/).
