SEEBURGER Training Platform

This repository is a training and simulation platform inspired by SEEBURGER BIS.
It is designed to help practice EDI message monitoring, validation, mapping, and ACK handling in a controlled environment.

The platform currently consists of two independent frontend applications and one backend runtime API, reflecting the real separation between design-time and run-time components in BIS.

Repository Structure
seeburger-training-platform/
├── backend/
├── bis-frontend-app/
│   └── bis-frontend/
├── mapping-designer-app/
│   └── mapping-designer/
├── docs/
├── package.json
└── README.md

Applications Overview
1. BIS Frontend (Monitoring & Runtime UI)

Path

bis-frontend-app/bis-frontend


Purpose

Simulates the BIS monitoring landscape

Displays message lifecycle and processing stages

Executes validation, mapping, and ACK logic (currently local utilities)

Key Features Implemented

Message monitoring dashboard

Filtering (INBOUND / OUTBOUND / ERRORS)

Message drill-down view

Stage tabs:

ENVELOPE

VALIDATION

MAPPING

ACK

ERROR

Partner-specific validation rules

Validation severity (ERROR vs WARNING)

Mapping execution preview

Reprocess logic:

Allowed only for mapping errors

Requires newer ACTIVE mapping

ACK handling:

997 Accepted

999 Rejected

AK3 (segment errors)

AK4 (element errors)

Run Instructions

cd bis-frontend-app/bis-frontend
npm install
npm start


Runs on

http://localhost:3000

2. Mapping Designer (Design-time Tool)

Path

mapping-designer-app/mapping-designer


Purpose

Simulates the BIS Mapping Designer

Used to author, preview, and publish mappings

Key Features Implemented

Source structure tree (segments, loops, elements)

Target structure tree

Element-level drag & drop

BICMD-style text editor

Rule-aware editor behavior:

RULE / FROM / TO pairing

LOOP context handling (e.g. PO1[*])

Mapping rule parsing

Mapping execution preview

Mapping versioning

Publish mapping to backend runtime

Activate mapping version

Run Instructions

cd mapping-designer-app/mapping-designer
npm install
npm start


Runs on

http://localhost:3000


Note: This application is design-time only and does not process messages directly.

3. Backend Runtime API

Path

backend


Purpose

Acts as a central runtime engine

Serves as the integration point between Mapping Designer and BIS Frontend

Stores mappings and active versions (in-memory)

Executes validation, mapping, and ACK generation

Implemented Capabilities

In-memory mapping storage

Mapping publish API

Mapping activation API

Runtime processing endpoint:

Validation

Mapping execution

ACK generation (997 / 999 with AK3 / AK4)

Run Instructions

cd backend
npm install
node server.js


Runs on

http://localhost:4000


Available Endpoints

POST /api/mappings – publish a mapping

POST /api/mappings/:id/activate – activate mapping version

POST /api/runtime/process – process a message through validation → mapping → ACK

No environment variables or database setup are required at this stage.

Current Integration Status

Mapping Designer can publish and activate mappings in the backend

Backend acts as the single source of truth for mappings

BIS Frontend currently runs with local runtime utilities

Full end-to-end frontend ↔ backend execution wiring is in progress

This staged approach mirrors real SEEBURGER BIS architecture:

Mapping Designer = design-time

BIS Frontend = runtime UI

Backend = runtime engine

Validation & Mapping Features (Implemented)
Validation

Partner-specific validation profiles

Element-level validation

Mandatory element checks

Type checks

Code list checks

Validation severity:

ERROR → blocks mapping

WARNING → allows mapping

Validation stage reporting

Mapping

Rule-based mapping engine

Loop-aware execution (PO1[*])

Mapping preview output

Version-aware mapping activation

ACK Handling

997 Accepted

999 Rejected

AK3 segment error details

AK4 element error details

ACK displayed in monitoring UI

What Is Not Implemented Yet (By Design)

Persistent database storage

End-to-end inbound EDI file upload

Authentication / user roles

Production deployment configuration

Full BIS Frontend ↔ Backend runtime wiring

How This Repository Should Be Validated

For automated or manual validation:

Each frontend application should start successfully via npm start

Backend API should start via node server.js

Mapping Designer should be able to:

Create rules

Preview mapping

Publish mapping

Activate mapping

Backend should store and activate mappings in memory

BIS Frontend should:

Display message lifecycle

Execute validation and mapping preview

Generate correct ACKs with AK3 / AK4

Project Intent

This repository is intended as a learning and training platform, not a production system.
The focus is on functional accuracy and behavioral similarity to SEEBURGER BIS rather than infrastructure completeness.

Next Planned Steps

Connect BIS Frontend runtime execution to backend /api/runtime/process

Remove frontend-local execution utilities

Add inbound file ingestion simulation

Add persistence layer (database)

Summary

This project currently provides a faithful simulation of BIS design-time and run-time behavior, suitable for hands-on practice with validation, mapping, and ACK processing.