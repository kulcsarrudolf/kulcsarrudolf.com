---
title: "Multiple Git Accounts Without Losing Your Mind"
subtitle: "Two GitHub accounts, a Bitbucket account, and the SSH config that makes it all click"
author: "Kulcsar Rudolf"
date: "2026-04-18"
description: "A short, practical guide to juggling multiple GitHub accounts and a Bitbucket account on the same machine. Auth keys, signing keys, and a ready-to-use SSH config."
keywords: ["github", "bitbucket", "ssh", "ssh keys", "signing key", "authentication key", "git", "multiple accounts", "ssh config", "gpg signing"]
---

## Introduction

You just finished your awesome new feature. You try to push and the terminal replies with **"Please make sure you have the correct access rights and the repository exists"**. You try to add an SSH key to GitHub and you see **"Key is already in use"**. The pull request is right there, one push away, and nothing works.

I know the feeling. I have been there many times. I had projects on Bitbucket and two GitHub accounts at the same time. Three hosts, three keys, and one `git clone` that always picked the wrong one.

This is the short guide I wish I had on day one. If you juggle multiple Git accounts and SSH keys drive you crazy, this post is for you. I share what finally worked for me.

### TL;DR

1. Create one SSH key per account. One per GitHub account, one per Bitbucket account.
2. Add an **Authentication Key** and a **Signing Key** on each account.
3. Point each account to its own key in `~/.ssh/config` with a host alias.
4. GitHub does not allow the same key on two accounts. Use separate keys.
5. Prefer a script? Use my [bash script](https://gist.github.com/kulcsarrudolf/99376c3fc94217d1e2cf3d30fcf8e325) to generate `~/.ssh/config` in one command.
6. Prefer an AI agent? Drop my [skill file](https://gist.github.com/kulcsarrudolf/e98b3dcd9a6265787a3863e70f9dfeb5) into `~/.claude/skills/` and let Claude Code handle the setup.

## Auth Key vs Signing Key in one minute

GitHub treats these as two different things, even if the key file is the same.

- **Authentication Key**: proves you can push and pull. Used when you run `git push` or `git clone`.
- **Signing Key**: proves **you** made the commit. GitHub checks the signature and shows a "Verified" badge.

Add the same public key in both slots if you want. They are separate entries. I always add both, because I want the green "Verified" badge on every commit.

## One key per account, always

GitHub blocks the same SSH key on two accounts. Add your personal key on a work account and GitHub rejects it with "Key is already in use". This cost me a full afternoon before I read the actual error.

Bitbucket applies the same rule. An SSH key belongs to a single Bitbucket account, and a second account cannot reuse it.

So the rule is simple. One key per account. Never reuse.

```bash
ssh-keygen -t ed25519 -C "me@personal.com" -f ~/.ssh/id_ed25519_personal
ssh-keygen -t ed25519 -C "me@work.com" -f ~/.ssh/id_ed25519_work
ssh-keygen -t ed25519 -C "me@bitbucket.com" -f ~/.ssh/id_ed25519_bitbucket
```

Then add each public key to its own account, in both the Authentication Keys and Signing Keys sections on GitHub, or in SSH keys on Bitbucket.

## The SSH config that ties it together

`~/.ssh/config` lets me use a different key per account. I give each account a host alias. The alias tells SSH which key to use.

```ssh
# Personal GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

# Work GitHub
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

# Bitbucket
Host bitbucket-work
  HostName bitbucket.org
  User git
  IdentityFile ~/.ssh/id_ed25519_bitbucket
  IdentitiesOnly yes
```

To clone a work GitHub repo, I use the work alias instead of `github.com`:

```bash
git clone git@github-work:my-company/project.git
git clone git@bitbucket-work:my-company/other-project.git
```

`IdentitiesOnly yes` is the small flag that saved me hours. Without it, SSH tries every key in the agent, fails after three wrong tries, and the host locks the connection.

## Generate the config programmatically

I got tired of writing this file by hand on every new machine. Now I run a small bash script.

```bash
#!/usr/bin/env bash
cat > "$HOME/.ssh/config" <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

Host bitbucket-work
  HostName bitbucket.org
  User git
  IdentityFile ~/.ssh/id_ed25519_bitbucket
  IdentitiesOnly yes
EOF
chmod 600 "$HOME/.ssh/config"
```

I keep the full version in [this gist](https://gist.github.com/kulcsarrudolf/99376c3fc94217d1e2cf3d30fcf8e325). Fork it and add or remove hosts as you need.

One warning. This overwrites `~/.ssh/config`. If you already have entries there, back it up or append instead.

## Let an AI agent do it for you

If you use [Claude Code](https://www.anthropic.com/claude-code) or a similar coding agent, you can skip the manual steps. I wrote a skill file for this. Save it as `~/.claude/skills/setup-multi-git-ssh/SKILL.md`, then tell the agent:

> Set up my Git SSH keys. My accounts:
> `personal github me@personal.com`
> `work github me@company.com`
> `work-bb bitbucket me.work@company.com`

The agent generates the keys, writes `~/.ssh/config`, copies each public key to your clipboard, walks you through where to paste it, verifies with `ssh -T`, and turns on commit signing.

You can grab the skill from [this gist](https://gist.github.com/kulcsarrudolf/e98b3dcd9a6265787a3863e70f9dfeb5).

## Turn on commit signing per repo

Global Git config holds one signing key at a time. My personal key lives there. For work repos, I set the signing key locally after I clone.

```bash
git config user.signingkey ~/.ssh/id_ed25519_work.pub
git config gpg.format ssh
git config commit.gpgsign true
```

Three lines inside each work repo. After that, every commit shows "Verified" on GitHub.

## What's next

This setup is boring in the best way. It just works. I stopped fighting SSH keys and went back to writing code.

If you have questions or suggestions, feel free to [contact me](/contact).
