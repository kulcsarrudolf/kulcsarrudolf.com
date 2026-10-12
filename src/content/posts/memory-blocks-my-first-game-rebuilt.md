---
title: "Memory Blocks: Finding My First Game Again"
subtitle: "Christmas 1999, a matching game, and the maths of a perfect memory"
author: "Kulcsar Rudolf"
date: "2026-10-12"
description: "The first thing I ever did on a computer was play Memory Blocks, at five years old. Claude helped me find its name and build it on this site, and I worked out how few pairs a perfect memory needs to clear the board."
keywords: ["memory blocks", "windows 3.1", "retro games", "probability", "game theory", "react"]
private: false
---

## Christmas 1999

I was five years old, and it was the first time I sat in front of a computer.

On the screen was a small grey window with an aqua board full of yellow blocks.
The game was Memory Blocks: flip two blocks, and if the pictures match, both disappear.

Other games followed, then Paint, and then it was clear: my dream was to have a computer at home.

## Why it matters to me

It was the first time a machine did something because I told it to.
I wanted more of that, and I still do: building software is what I do every day now.
Every project I have worked on goes back to a five year old in front of those yellow blocks.

## Finding it again

For years I didn't even know the game's name.
All I had was the memory: a grey window, an aqua board, yellow blocks with pictures hiding underneath.
I described it to Claude, and Claude recognised it: Memory Blocks.

Then I asked Claude to build it for me, here on my site: the window, the menus, the yellow blocks and the original pictures.
Try it yourself:

<PlayMemoryBlocks />

It also lives in the site's terminal: on the [home page](/), or behind the **>\_** button in the corner of any other page, type **memory**.

## The maths: how few pairs can you flip?

On Intermediate, the default, the board has 18 pairs.
The minimum is 18 pairs flipped, but only if every guess matches.
The odds of that are 1 in 35 × 33 × 31 × ... × 1, about 1 in 220 quintillion.

A perfect memory doesn't get you there either: you can't remember a block you haven't flipped yet.
The best you can do is this:

1. If you know where both halves of a pair are, take them.
2. Otherwise flip a block you haven't seen. If you have seen its partner, flip that one: a sure match.
3. Otherwise flip another unseen block. It may match by luck, it may be the partner of a block you saw earlier, or it is one more picture to remember. Never flip a block you have already seen here: it can't match.

Here it is on a 4×4 board.
The small pictures are what the player remembers.

<PerfectRun seed="3" />

For n pairs, this takes (3 − 2 ln 2)·n + 7/8 − 2 ln 2 turns on average, about 1.6 per pair.
I checked it with an exact calculation and 200,000 simulated games:

| Skill        | Pairs | Minimum (pure luck) | Perfect memory, average |
| ------------ | ----- | ------------------- | ----------------------- |
| Beginner     | 8     | 8                   | 12.4                    |
| Intermediate | 18    | 18                  | 28.5                    |
| Expert       | 30    | 30                  | 47.9                    |

On Intermediate, three perfect games out of four end on 28 or 29.
So if you clear it in 28 pairs or fewer, nobody could have played it better.

## Did you play it?

Did you play Memory Blocks too?
What was your first interaction with a computer?
[Tell me](/contact), I'd love to know.
