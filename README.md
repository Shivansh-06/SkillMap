🚀 SkillMap
Personalized Skill Gap Self-Diagnosis Tool

“Diagnosis before recommendation.”

🧠 Problem Statement

Students often follow trending skills (AI, ML, Web3) without:

-Knowing their current competency

-Understanding prerequisite gaps

-Aligning learning with career goals

-Most platforms recommend courses.

-Very few diagnose skill gaps before prescribing learning paths.

We wanted to solve the root problem:
lack of structured self-diagnosis before skill acquisition.

💡 Our Approach

Instead of building another recommender system, we built a:

-Career-specific diagnostic engine

SkillMap:

-Evaluates skill competency

-Identifies missing & weak foundations

-Models prerequisite dependencies

-Generates structured learning order

-Highlights high-impact bottlenecks

-Provides domain-level coverage

-We prioritized structure over volume of features.

🏗 System Design Thinking
1️⃣ Skills Modeled as a Directed Acyclic Graph (DAG)

Each skill contains:

-Domain

-Prerequisites

-Career relevance

Example:

Linear Algebra → Machine Learning
Statistics → Model Evaluation


This allows learning order to be computed logically, not manually hardcoded.

2️⃣ Dependency-Aware Roadmap (Kahn’s Algorithm)

We implemented topological sorting (Kahn’s Algorithm) to:

-Respect prerequisite relationships

-Ensure foundational skills are prioritized

-Avoid recommending advanced topics prematurely

-This was chosen over manual ordering to make the system scalable.

3️⃣ Strict Gap Filtering (Important Tradeoff)

Early version issue:

-Even with full score, roadmap recommended Python & Probability.

-Root cause:
  Topological resolver returned full dependency chain without checking mastery.

-Fix:
  We strictly filtered roadmap to include only:

  -Missing skills

  -Weak skills

-Tradeoff:
  We sacrificed “aggressive upskilling suggestions”
  in favor of diagnostic credibility.

-We chose correctness over feature density.

4️⃣ Career-Specific Evaluation

Initial bug:
All career tracks returned identical questions.

Cause:
/questions endpoint returned full question set.

Fix:
Filtered questions by career’s required skills.

Result:
Each career now evaluates relevant competencies only.

5️⃣ Domain-Level Abstraction

Instead of only showing flat skill scores, we grouped skills into domains:

-Mathematics

-Programming

-Data Handling

-Machine Learning

-Systems

This helps users understand structural weaknesses, not just isolated gaps.

Tradeoff:
We hardcoded domain mapping in frontend for hackathon speed
instead of building a dynamic domain API layer.

🧪 Engineering Challenges & Debugging
⚠ React Radar Crash

Error:

Multiple React versions detected

Fix:
Aligned chart.js + React versions and rebuilt node_modules.

⚠ Roadmap Recommending Strong Skills

Cause:
Dependency resolver returned ordered list without skill-level filtering.

Fix:
Post-processed roadmap using skill evaluation results.

⚠ Career Impact Detection Not Scoped

Issue:
High-impact gap logic considered global dependencies.

Fix:
Scoped dependency impact calculation to career-specific required skills.

🔄 Final User Flow

-Select Career Track

-Complete Wizard-Based Assessment

-System Builds Skill DNA

-Career Alignment Score Calculated

-Domain Coverage Analyzed

-Dependency-Ordered Roadmap Generated

-Focus-Later Skills Identified

⚖ Key Tradeoffs We Made
Decision	Tradeoff
Rule-based evaluation	Faster build vs ML-based personalization
JSON skill modeling	Simplicity vs database-backed schema
Hardcoded domain map	Hackathon speed vs backend abstraction
Strict filtering	Diagnostic clarity vs broader suggestions

We prioritized:

-Structural correctness

-Clear reasoning

-Scalability

-Demonstrable logic

-Over adding complexity.

📈 Future Scope

-Adaptive question difficulty

-ML-based recommendation weighting

-GitHub skill inference

-LinkedIn integration

-Industry-calibrated evaluation

-Progress tracking over time

🎯 What Makes SkillMap Different

SkillMap does not just recommend skills.

It:

-Models learning as a structured graph

-Diagnoses competency gaps

-Computes learning order logically

-Respects career-specific requirements

It demonstrates:

-System-level thinking > surface-level features.

🏆 Built During Hackathon

SkillMap evolved from:

-Flat skill scoring →
-Career-aware evaluation →
-Dependency-aware roadmap →
-Strict diagnostic filtering →
-Structured domain abstraction.

Each iteration improved structural integrity.

✨ Final Insight

Personalization is not about recommending more.

It’s about modeling structure correctly.


Live Demo: https://night-shift-amuhacks-5-0.vercel.app


SkillMap focuses on:

Diagnosis before prescription.
