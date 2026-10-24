---
title: "Automating Boring Tasks in the AI Era"
subtitle: "Ten years of PDF exports for my father, automated in 30 minutes"
author: "Kulcsar Rudolf"
date: "2026-10-24"
description: "For ten years I exported PDF sheets from my father's AutoCAD drawings by hand. One afternoon I automated it with CADCraft and AI. Some thoughts on how AI changes what is worth automating."
keywords:
  [
    "automation",
    "ai",
    "home-cooked software",
    "autocad",
    "dwg",
    "pdf",
    "cadcraft",
    "python",
    "side project",
  ]
private: false
---

My father is a civil engineer.
Every few weeks he sends me a DWG file and asks me to export the sheets as PDFs.
I have done this for about ten years.
It takes me one or two hours a month, so in total about 120-150 hours.

It is a boring job, but I do it happily.
It would take him much longer, and for me it is a small effort.

The job is slow because of how the drawings are made.
All the sheets sit next to each other in one big drawing, and each has its own frame and scale.
Most of them are not A3 or A1 but long strips, like 1350 x 594 mm.
So for many sheets I first had to create a custom paper size, which takes about a minute.
My version of AutoCAD TrueView can't export many sheets at once, so I did it one by one.

I always wanted to automate it, and I never did.
Every month it was "just one more hour".
And if you check the famous [xkcd chart](https://xkcd.com/1205/), I was probably right.
For a task you do once a month, you don't have much time to spend on automating it.
There is also [xkcd 1319](https://xkcd.com/1319/), where the script becomes a bigger project than the task it should replace.

Then this week my father sent a drawing with more than 60 sheets.
That is more than an hour of clicking.
I also didn't have my Windows laptop with me, and all my custom paper sizes were saved on it.
On a Mac there are not many ways to even open a DWG file.

So I looked for something I could control from code, and I found [CADCraft](https://github.com/storytold/cadcraft).
It is a free, open-source CAD app, and it has a command-line tool that can open a drawing and export PDFs.
With AI writing most of the code, I had a working tool in about 30 minutes.

The tool is called [dwg-sheets-to-pdf](https://github.com/kulcsarrudolf/dwg-sheets-to-pdf), and it is around 650 lines of Python.
It does what I used to do by hand.
It finds each sheet by its title text, like `PL. NR. A07`, and takes the rectangle around it as the frame.
It reads the scale from the text inside the frame, like `SCARA 1:200`.
From the frame and the scale it calculates the page size, so a 270 m wide sheet at 1:200 becomes a 1350 mm wide PDF.
There are no custom paper sizes to create anymore.
Later that afternoon I also added a simple web page, so my father can upload a drawing and download the PDFs himself.

Some parts are made for my father's drawings only.
The title text, the units and the frame style are fixed by default, and the web page has no settings for them.
I am thinking about how to make it work for other people's drawings, but for now it works for ours.

I don't see that as a problem anymore.
Robin Sloan wrote that [an app can be a home-cooked meal](https://www.robinsloan.com/notes/home-cooked-app/).
He built a small messaging app only for his family, and it was exactly what they needed.
Maggie Appleton made a similar point in her talk on [home-cooked software](https://maggieappleton.com/home-cooked-software): AI lets more people build small tools for their own families and communities.
No CAD company will build a feature for my father's odd paper sizes.
But I could build it in one afternoon.

In 2023 Simon Willison wrote that [AI makes him more ambitious with his projects](https://simonwillison.net/2023/Mar/27/ai-enhanced-development/), because ideas that took days now take an hour.
The xkcd chart is still correct, but the cost of automating dropped a lot.
Ten years ago I would have spent a weekend reading about the DWG format.
This time the hard part was only to explain what I wanted, and after ten years I knew that very well.

So I now think about automation a bit differently.
I look again at tasks I once decided were not worth it, because my old time estimates are wrong now.
I count all the times I will do a task in the coming years.
I also pay attention to blockers.
The saved time never made me start this project, but a missing laptop did.
If a task depends on one specific computer or one specific person, that is a good reason to automate it.
And if the tool helps someone else too, it is worth even more.
My favourite part of this project is that my father doesn't have to wait for me.

When I am not sure how to automate something, I like Dan Slimmon's idea of a [do-nothing script](https://blog.danslimmon.com/2019/07/15/do-nothing-scripting-the-key-to-gradual-automation/).
It is a script that only tells you the next manual step, and you replace the steps with code one by one.
With AI, going from that script to the real thing can take one afternoon.

But xkcd 1319 is still true.
A tool that is cheap to build still needs care later.
If a task is rare, changes every time, or needs real judgement, I still do it by hand.

One question stays with me.
What will I do with the time I save?
One or two hours a month is not much, but over the next ten years it is again more than a hundred hours.
I don't have a good answer yet.
More side projects would just mean more time at the screen.
