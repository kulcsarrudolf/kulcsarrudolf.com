---
title: "Multiple Git Accounts Without Losing Your Mind"
subtitle: "Two GitHub accounts, a Bitbucket account, and the SSH config that makes it all click"
author: "Kulcsar Rudolf"
date: "2026-04-18"
description: "A short, practical guide to juggling multiple GitHub accounts and a Bitbucket account on the same machine. Auth keys, signing keys, and a ready-to-use SSH config."
keywords: ["github", "bitbucket", "ssh", "ssh keys", "signing key", "authentication key", "git", "multiple accounts", "ssh config", "gpg signing"]
---

## Introduction

I have fought with SSH keys for years. Every new laptop, same wall. My personal account works, my work account breaks, or my commits show up "Unverified". I always forget why.

It got worse when I had projects on Bitbucket and two GitHub accounts at the same time. Three hosts, three keys, and one `git clone` that picked the wrong one every single time.

This is the short guide I wish I had on day one. Clear steps. No magic.

### TL;DR

1. Create one SSH key per account. One per GitHub account, one per Bitbucket account.
2. Add an **Authentication Key** and a **Signing Key** on each account.
3. Point each account to its own key in `~/.ssh/config` with a host alias.
4. GitHub does not allow the same key on two accounts. Use separate keys.

## Auth Key vs Signing Key in one minute

GitHub treats these as two different things, even if the key file is the same.

- **Authentication Key**: proves you can push and pull. Used when you run `git push` or `git clone`.
- **Signing Key**: proves **you** made the commit. GitHub checks the signature and shows a "Verified" badge.

Add the same public key in both slots if you want. They are separate entries. I always add both, because I want the green "Verified" badge on every commit.

## One key per account, always

GitHub blocks the same SSH key on two accounts. Add your personal key on a work account and GitHub rejects it with "Key is already in use". This cost me a full afternoon before I read the actual error.

Bitbucket does not block it, but I still use a separate key per host. It keeps things clean and makes revocation simple if one laptop goes missing.

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

I keep the full version in [this gist](https://gist.github.com/kulcsarrudolf). Fork it and add or remove hosts as you need.

One warning. This overwrites `~/.ssh/config`. If you already have entries there, back it up or append instead.

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

If you have a cleaner setup, I want to see it. Send it to me on [LinkedIn](https://www.linkedin.com/in/kulcsarrudolf/) or open an issue on the [repo of this site](https://github.com/kulcsarrudolf/kulcsarrudolf.com/issues).
