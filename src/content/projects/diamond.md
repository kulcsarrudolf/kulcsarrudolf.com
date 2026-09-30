---
title: "Diamond Detection Platform"
subtitle: "The software behind a line of professional lab-grown diamond detectors."
description: "Full-stack and tech lead work on a lab-grown diamond detection platform: React Native app, Node.js API, React back office and a GPU AI service on AWS."
keywords:
  - lab-grown diamond detection
  - diamond detector software
  - react native
  - node.js
  - aws
  - stripe
  - tensorflow
order: 5
lang: "en"
tech:
  - React Native
  - React
  - Node.js
  - Express
  - MongoDB
  - AWS
  - Stripe
  - Python
  - TensorFlow
schemaType: "WebApplication"
featured: false
private: false
---

From March 2022 to June 2025 I was the full-stack developer and tech lead on the software for a line of professional diamond detectors, built for a company that specialises in detecting lab-grown diamonds.
The team was four people, all working remotely from Romania: a PM, a QA engineer, a mobile developer and me.
We built the platform from scratch, and it now serves more than 4,000 customer accounts and 9,000 registered devices, mostly in the US and India.

It covers the whole path from the detector to the cloud: a React Native app that drives the hardware, a Node.js API, a React back office, a Lambda export pipeline and a GPU service that runs the AI model.
Everything runs on AWS.

As tech lead I sat in the weekly calls with the client where new features were designed, on both the technical and the product side, and I reviewed code across the backend, the mobile app and the infrastructure.

<PostImage variant="diagram" src="https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1790791198/diamond-system-diagram.png" alt="System diagram: the mobile app and the admin portal talk to the Diamond Detector API, which connects to the AI service, the bulk download Lambda, Stripe, Mailchimp, S3 and MongoDB. The detectors connect to the mobile app over Bluetooth, and the AI detectors over USB." title="System diagram of the diamond detection platform" />

## The detectors

There are three models, from a handheld unit to a high-volume desktop device.
The original models connect to the phone over Bluetooth.
Each also has an AI version, which connects over USB.

## Mobile app

The app is where a jeweller runs a test: it drives the detector, shows the result and syncs it to the cloud.
My work on it was mostly the UI: screens, flows and custom components.

I also owned every App Store and Google Play release, and built two things around them.
A forced update screen blocks the app when its version is too old, until the user updates.
An unsupported phone list catches phones that are no longer compatible and tells their users so, on screens of their own.

## Backend

The API is Express, packaged with Docker and deployed on AWS ECS.
It holds the business logic and connects the other services.

Access is by invitation.
A company can have several locations, each with its own devices and users, and every user has one of four roles:

- A SuperAdmin sees every customer account.
- An Admin manages billing, users and locations in their own organisation.
- A Manager manages users and sees business data, but has no access to payments.
- A Tester runs tests, and views and exports the results.

Every endpoint checks both the role and where the user sits in the organisation.

The database is MongoDB Atlas.
Test records hold references to their images in S3, which keeps the database small.
At peak the platform stored about 3 TB of test images, with around 8,000 tests run and more than 1,000 saved to the cloud each day.

Deleting a test takes two steps.
The first is a soft delete: the test waits in a recovery area for 30 days and can be restored in full.
After that, a hard delete strips the personal and business fields from the MongoDB record and removes the images from S3.
The first step covers accidental deletes, and the second keeps storage costs from growing forever.

Each pairing of detector model and phone model behaves a little differently, because the hardware and the cameras differ.
From the SuperAdmin panel, defaults are set per detector model and per phone model, and the app applies them when a phone connects to a detector.
Results stay consistent without customers configuring anything.

Any test can be shared through a public link, a read-only view that needs no login, for passing a result on to a customer or an outside gemologist.

Emails go out through Mailchimp, and a Node.js cron scheduler sends the reminders.

## Payments

Billing runs on Stripe: monthly subscriptions tiered by cloud storage quota, one-time purchases for extended warranties, and storage upgrades on demand, all manageable from the app or the back office.
The integration covers the whole subscription lifecycle (creation, renewal, upgrades and downgrades with proration, cancellation) and handles failed payments through webhooks.
Webhook processing is idempotent and guarded against race conditions, because a mistake there bills a customer wrongly.
Every test submission checks the subscription, and an inactive account or one over its storage quota cannot submit.

## Back office

The back office is where Admins, Managers and SuperAdmins run their accounts.
It is built with React and Material UI.
The components for both the back office and the mobile app were developed in Storybook, which gave the two a shared style guide.

The gallery is a paginated list of tests, each with a thumbnail, name, description, device, date and tester.
It filters by date range, tester, location and device, searches the name, SKU, vendor, customer, description and notes, and downloads or deletes tests in bulk.

Each test has a page with all of its metadata: device, device type, phone model, location, SKU, vendor, customer, tester, date, description, notes and the red filter sensitivity.
From there a test can be edited, cloned, shared or deleted.
A test can hold several runs, for example the same stones scanned from different positions.
Each run has its own five images (Result, LUV, Glowing, Coloured and Original) and its own sensitivity value, and the AI overlay can be switched on or off per run.
Tests also take attachments of any type and size, such as certificates, grading reports or reference photos.

The dashboard shows test statistics, recent activity, storage usage and warranty details.
The other sections are the activity feed (the audit log), device management, firmware versions, advanced settings, discounts, and a recovery page for soft-deleted tests.

## Bulk export

A bulk export runs on AWS Lambda.
The function reads the requested records from MongoDB, downloads their images from S3, and packages the images, an XLS file with the metadata, and a static HTML page for browsing the export without any other tool.
A part holds at most 1,000 tests, so a larger request is split into numbered parts.
The finished export goes to S3, and the user is notified when it is ready.

Exports are rare and come in bursts, which suits Lambda: parallel invocations make a large export fast, and nothing runs, or costs money, between them.

## AI service

In the last two or three months I integrated a TensorFlow computer vision model into the platform.
A specialist team built the model.
I built the production service around it and wired it into the product.

The service takes the four images of a run and returns JSON with a polygon for each detected stone and a label: natural diamond, CVD lab-grown, HPHT lab-grown, or simulant.
The app and the back office draw those polygons over the result images.

Each request is a job that is pending, in progress or completed.
When a test is submitted, the API creates the job and calls the Python service, which usually finishes in under a minute and calls an API endpoint with the result.
The back office polls the job's status and shows the result once it is done.

The service runs on a single EC2 G4 instance with an NVIDIA T4 GPU, which keeps inference on four images short, and is deployed by hand over SSH.

My part was the API routing, the job status handling, preprocessing the images, parsing and validating the model's output, mapping it onto the existing data schema, a safe fallback for when the service is down, and end-to-end performance testing.
Before this, reading a result took an expert.
The company's current AI detector line is built on it.

## Deployment

The code lived on Bitbucket.
AWS CodeBuild deployed the back office and the API: a commit to `master` went to dev, and a commit to `release` went to production.
The AI service was the exception, deployed by hand since it ran on one instance.

## Working part time

I worked about four hours a day as an external contractor.
That made every week a trade between new features and paying down technical debt, and deciding which one could wait.
