🚀 SkillMap
Structured Skill Gap Diagnosis & Career-Aligned Learning Roadmaps


🔗 Live Demo: https://night-shift-amuhacks-5-0.vercel.app

💡 “Diagnosis before recommendation.”

📌 Overview

SkillMap is a career-specific skill gap diagnosis system that models learning as a structured dependency graph.

Unlike traditional platforms that immediately recommend courses, SkillMap first evaluates a user’s competency, identifies foundational gaps, and then generates a logically ordered roadmap based on prerequisite relationships.

The core philosophy:

Personalization begins with structured diagnosis — not blind recommendation.

🧠 Problem

Students often pursue trending skills (AI, ML, Web3, etc.) without:

Understanding their current competency level

Identifying missing prerequisites

Aligning learning with career goals

Seeing structural weaknesses across domains

Most platforms recommend content.

Very few diagnose skill gaps before prescribing learning paths.

SkillMap addresses this structural gap.

🏗 System Architecture & Design
1️⃣ Skills Modeled as a Directed Acyclic Graph (DAG)

Each skill contains:

Domain classification

Prerequisite dependencies

Career relevance mapping

Example:

Linear Algebra → Machine Learning
Statistics → Model Evaluation

By modeling skills as a DAG, learning order is computed dynamically rather than manually hardcoded.

This makes the system scalable and logically consistent.

2️⃣ Dependency-Aware Roadmap (Kahn’s Algorithm)

We implemented topological sorting (Kahn’s Algorithm) to:

Respect prerequisite relationships

Prioritize foundational skills

Prevent premature advanced recommendations

Enable scalable roadmap generation

This ensures roadmap correctness instead of static ordering.

3️⃣ Strict Gap Filtering (Key Design Decision)

Initial Issue:
Even high-scoring users were being recommended foundational skills.

Root Cause:
Topological sorting returned the full dependency chain without checking mastery level.

Fix Implemented:
Roadmap now strictly includes:

Missing skills

Weak skills

Tradeoff:
We sacrificed aggressive upskilling suggestions to preserve diagnostic credibility.

We chose correctness over feature density.

4️⃣ Career-Specific Evaluation

Initial Bug:
All career tracks returned identical questions.

Cause:
The /questions endpoint returned the full question set.

Fix:
Questions filtered based on career-required skills.

Now each career path evaluates only relevant competencies.

5️⃣ Domain-Level Abstraction

Skills are grouped into structural domains:

Mathematics

Programming

Data Handling

Machine Learning

Systems

This allows users to see domain-level weaknesses rather than isolated scores.

Tradeoff:
Domain mapping was hardcoded in the frontend for hackathon speed instead of implementing a dynamic backend domain API.

🔄 Final User Flow

Select Career Track

Complete Assessment Wizard

Skill Competency Evaluation

Career Alignment Score Calculation

Domain-Level Coverage Analysis

Dependency-Ordered Roadmap Generation

Focus-Later Skills Identification

⚙️ Tech Stack

Frontend

React

Chart.js (Radar visualization)

Vercel Deployment

Backend

FastAPI (or your backend framework)

JSON-based skill graph modeling

Algorithmic dependency resolution

🧪 Engineering Challenges
⚠ Multiple React Version Conflict

Error: React radar chart crash

Fix: Aligned chart.js and React versions and rebuilt node_modules

⚠ Roadmap Recommending Strong Skills

Cause: Dependency resolver returned full ordered list

Fix: Post-processed roadmap using evaluation results

⚠ Career Impact Logic Not Scoped

Issue: Dependency impact calculation used global skill graph

Fix: Scoped impact analysis to career-required skills only

⚖️ Key Engineering Tradeoffs
Decision	Tradeoff
Rule-based evaluation	Faster implementation vs ML-based personalization
JSON skill modeling	Simplicity vs database-backed schema
Hardcoded domain mapping	Hackathon speed vs backend abstraction
Strict filtering	Diagnostic clarity vs broader suggestions

We prioritized:

Structural correctness

Clear reasoning

Logical scalability

Demonstrable algorithmic thinking

Over feature volume.

📈 Future Scope

Adaptive question difficulty

ML-based weighting of skill importance

GitHub skill inference

LinkedIn integration

Industry-calibrated benchmarking

Long-term progress tracking

🎯 What Makes SkillMap Different

SkillMap does not just recommend skills.

It:

Models learning as a structured graph

Diagnoses competency gaps

Computes roadmap order algorithmically

Respects career-specific requirements

Emphasizes system design over surface features

This project demonstrates system-level thinking rather than simple feature aggregation.

🏆 Hackathon Context

Built during AMUHACKS 5.0 under time constraints.

The system evolved through multiple iterations:

Flat scoring → Career-aware evaluation → Dependency-aware roadmap → Strict diagnostic filtering → Domain abstraction.

Each iteration improved structural integrity.

✨ Core Insight

Personalization is not about recommending more.

It is about modeling structure correctly.
