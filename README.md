SEEBURGER Training Platform

This repository is a hands-on training and simulation platform inspired by SEEBURGER BIS.
It recreates the design-time and run-time separation of BIS, allowing users to practice:

Mapping design (BICMD-style)

Partner-specific validation

Message lifecycle monitoring

ACK generation (997 / 999 with AK3 / AK4)

Reprocess logic

Backend-driven runtime execution

The goal of this project is functional and behavioral accuracy, not production deployment.

Repository Structure
seeburger-training-platform/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── messages.js
│   ├── store/
│   │   └── messageStore.js
│   ├── utils/
│   │   ├── executeValidation.js
│   │   ├── executeMapping.js
│   │   └── generateAck.js
│   └── data/
│       └── validationProfiles.js
│
├── bis-frontend-app/
│   └── bis-frontend/
│
├── mapping-designer-app/
│   └── mapping-designer/
│
├── docs/
├── package.json
└── README.md

Architecture Overview

The platform intentionally mirrors SEEBURGER BIS architecture:

Mapping Designer (design-time)
        |
        |  Publish & Activate Mapping
        v
Backend Runtime (single source of truth)
        ^
        |  Fetch Messages / Reprocess
        |
BIS Frontend (runtime monitoring UI)


Mapping Designer → design-time only

Backend → owns validation, mapping, ACKs, message state

BIS Frontend → display & control only (no business logic)

Applications
1️⃣ Mapping Designer (Design-Time Tool)

Path

mapping-designer-app/mapping-designer


Purpose

Author mappings using a BICMD-style editor

Preview mappings

Publish and activate mappings in the backend runtime

Implemented Features

Source structure tree (segments, loops, elements)

Target structure tree

Element-level drag & drop

BICMD rule editor (RULE / FROM / TO / TYPE / LOOP)

Loop context handling (e.g. PO1[*])

Mapping rule parsing

Mapping execution preview

Mapping versioning

Publish mapping to backend

Activate mapping version

Run

cd mapping-designer-app/mapping-designer
npm install
npm start


Runs on:

http://localhost:3000

2️⃣ Backend Runtime API

Path

backend


Purpose

Central runtime engine (single source of truth)

Executes validation, mapping, and ACK generation

Stores messages and mappings in memory

Bridges Mapping Designer and BIS Frontend

Run

cd backend
npm install
node server.js


Runs on:

http://localhost:4000

Backend Endpoints
Process Message (runtime ingestion)
POST /messages/process


Payload example:

{
  "id": "MSG001",
  "partner": "Walmart",
  "docType": "850",
  "direction": "INBOUND"
}


Behavior:

Runs validation

Runs mapping (if valid)

Generates ACK (997 / 999)

Stores message lifecycle

Fetch Messages (monitoring)
GET /messages


Returns all processed messages for monitoring UI.

Reprocess Message
POST /messages/reprocess/:id


Rules:

Allowed only for mapping errors

Uses latest active mapping

Regenerates ACK

3️⃣ BIS Frontend (Runtime Monitoring UI)

Path

bis-frontend-app/bis-frontend


Purpose

Runtime monitoring UI

Displays backend-driven message lifecycle

Triggers backend reprocess

Implemented Features

Monitoring dashboard

Filters (INBOUND / OUTBOUND / ERRORS)

Message drill-down

Stage tabs:

ENVELOPE

VALIDATION

MAPPING

ACK

ERROR

Partner-specific validation results

Validation severity (ERROR vs WARNING)

ACK display (997 / 999 with AK3 / AK4)

Backend-driven reprocess

Run

cd bis-frontend-app/bis-frontend
npm install
npm start


Runs on:

http://localhost:3000

Validation & ACK Capabilities
Validation

Partner-specific validation profiles

Element-level validation

Mandatory checks

Type checks

Code list checks

Severity support:

ERROR → blocks mapping

WARNING → allows mapping

ACK Handling

997 Accepted

999 Rejected

AK3 (segment-level errors)

AK4 (element-level errors)

ACKs generated centrally in backend

How to Verify End-to-End Flow
1️⃣ Start backend
cd backend
node server.js

2️⃣ Start Mapping Designer
cd mapping-designer-app/mapping-designer
npm start


Create mapping

Publish & Activate

3️⃣ Inject a message
curl -X POST http://localhost:4000/messages/process \
  -H "Content-Type: application/json" \
  -d '{"id":"MSG100","partner":"Walmart","docType":"850","direction":"INBOUND"}'

4️⃣ Start BIS Frontend
cd bis-frontend-app/bis-frontend
npm start


Message appears in Monitoring

Click message → view stages

ACK visible

Reprocess works (mapping errors only)

Codex / CI Notes

Both React apps run long-lived dev servers

Codex and CI runners will terminate them after a timeout

Successful compilation before timeout = valid setup

No automated E2E tests are included by design

What Is Not Implemented (Intentionally)

Database persistence

Authentication / roles

Inbound EDI file parsing

Production deployment config

Project Intent

This project is intended as a learning and training platform, not a production system.
It focuses on accurate SEEBURGER BIS behavior and lifecycle modeling.

Next Possible Enhancements

Persistent storage (SQLite/Postgres)

Inbound file upload & parsing

Partner agreement UI

Mapping function library (LOOKUP, CONCAT, IF)

Polling / auto-refresh in monitoring

Summary

This repository provides a realistic, backend-driven simulation of SEEBURGER BIS, covering design-time mapping, runtime processing, validation, ACK handling, and monitoring.