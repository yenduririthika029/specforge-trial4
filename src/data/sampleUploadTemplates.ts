/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecTemplate {
  id: string;
  name: string;
  fileName: string;
  format: 'yaml' | 'json' | 'tex';
  category: string;
  size: string;
  content: string;
}

export const sampleSpecTemplates: SpecTemplate[] = [
  {
    id: 'yaml-cs301',
    name: 'CS-301 Distributed Systems Specification',
    fileName: 'CS-301-Distributed-Systems.yaml',
    format: 'yaml',
    category: 'ABET EAC 2026 Curriculum Node',
    size: '4.8 KB',
    content: `# SpecForge Course Specification Schema v2.4
# Academic Institution: Faculty of Computer Science & Engineering
code: "CS-301"
title: "Distributed Systems Engineering"
level: "Upper Division / Level 300"
term: 5
track: "Systems"
status: "Under Review"
accreditation_cycle: "ABET 2026 Review Cycle"
credits:
  lecture: 3.0
  lab: 1.0
  recitation: 0.0
  total: 4.0

prerequisites:
  - code: "CS-201"
    title: "Data Structures & Algorithms"
    min_grade: "C+"
    type: "hard"
  - code: "CS-240"
    title: "Operating Systems & Concurrency"
    min_grade: "B-"
    type: "hard"
  - code: "MATH-215"
    title: "Discrete Probability & Graph Theory"
    min_grade: "C"
    type: "soft"

modules:
  - chapter: 1
    title: "Foundations of Fault-Tolerant Distributed Architecture"
    weeks: "Week 1-3"
    lecture_hours: 9
    lab_hours: 6
    learning_outcomes:
      - "Differentiate synchronous and partially synchronous network models"
      - "Formulate Lamport logical clocks and vector timestamp lattices"
      - "Model network partitioning using FLP impossibility theorem"
    deliverables:
      - "Lab 1: RPC Transport Layer & Heartbeat Protocol"
      - "Problem Set 1: Vector Clock Causality DAGs"
    required_tools:
      - "Rust 1.85+"
      - "Wireshark Network Analyzer"
      - "Docker Sandbox"

  - chapter: 2
    title: "Consensus Protocols: Multi-Paxos & Raft State Machines"
    weeks: "Week 4-7"
    lecture_hours: 12
    lab_hours: 8
    learning_outcomes:
      - "Prove leader completeness and state machine safety under Raft"
      - "Implement randomized election timers and vote arbitration"
      - "Construct persistent log compaction and snapshotting"
    deliverables:
      - "Lab 2: Complete Raft Consensus Node Implementation"
      - "Jepsen Chaos Invariant Test Suite"
    required_tools:
      - "Go 1.24 / Rust"
      - "Jepsen Distributed Testing Framework"

rubric:
  - category: "Lab 1 & 2: Raft Consensus Cluster"
    weight: 30
    delivery_week: "Week 7"
    abet_outcomes: ["SO-1", "SO-2", "SO-6"]
  - category: "Lab 3: Sharded Transactional Engine"
    weight: 20
    delivery_week: "Week 10"
    abet_outcomes: ["SO-1", "SO-2"]
  - category: "Midterm Comprehensive Examination"
    weight: 20
    delivery_week: "Week 8"
    abet_outcomes: ["SO-1"]
  - category: "Capstone Engineering Project & Defense"
    weight: 20
    delivery_week: "Week 14"
    abet_outcomes: ["SO-2", "SO-3", "SO-6", "SO-7"]
  - category: "Recitation & Peer Code Review"
    weight: 10
    delivery_week: "Continuous"
    abet_outcomes: ["SO-3", "SO-5"]
`,
  },
  {
    id: 'json-cs445',
    name: 'CS-445 Deep Learning Systems Specification',
    fileName: 'CS-445-Deep-Learning-Systems.json',
    format: 'json',
    category: 'ACM CS2023 Advanced Elective',
    size: '3.6 KB',
    content: `{
  "schema_version": "2.4",
  "code": "CS-445",
  "title": "Deep Learning Systems & High-Performance Compute",
  "level": "Senior Elective / Level 400",
  "term": 7,
  "track": "AI/ML",
  "status": "Accredited",
  "accreditation_cycle": "ABET 2026 Review Cycle",
  "credits": {
    "lecture": 3.0,
    "lab": 1.0,
    "recitation": 0.0,
    "total": 4.0
  },
  "prerequisites": [
    {
      "code": "CS-240",
      "title": "Operating Systems & Concurrency",
      "min_grade": "B",
      "type": "hard"
    }
  ],
  "modules": [
    {
      "chapter": 1,
      "title": "GPU Microarchitecture, Tensor Cores & Memory Hierarchy",
      "weeks": "Week 1-4",
      "lecture_hours": 12,
      "lab_hours": 8,
      "learning_outcomes": [
        "Profile warp divergence and bank conflicts in shared memory",
        "Implement coalesced global memory access kernels in CUDA C++"
      ],
      "deliverables": [
        "Lab 1: FlashAttention CUDA Kernel Optimization"
      ],
      "required_tools": ["CUDA 12.6", "Nsight Compute"]
    },
    {
      "chapter": 2,
      "title": "Distributed Training Paradigms: Megatron-LM & DeepSpeed",
      "weeks": "Week 5-9",
      "lecture_hours": 15,
      "lab_hours": 10,
      "learning_outcomes": [
        "Analyze collective communications (AllReduce, AllGather) via NCCL",
        "Formulate 3D parallelism: Tensor, Pipeline, and ZeRO-3 Data Parallelism"
      ],
      "deliverables": [
        "Lab 2: Sharded Transformer Pipeline across Multi-GPU Cluster"
      ],
      "required_tools": ["PyTorch 2.6", "NCCL", "Slurm Cluster"]
    }
  ],
  "rubric": [
    {
      "category": "CUDA Kernel Benchmark Labs",
      "weight": 50,
      "delivery_week": "Bi-weekly",
      "abet_outcomes": ["SO-1", "SO-6"]
    },
    {
      "category": "Distributed Scaling Project",
      "weight": 35,
      "delivery_week": "Week 12",
      "abet_outcomes": ["SO-1", "SO-2"]
    },
    {
      "category": "Oral Technical Defense",
      "weight": 15,
      "delivery_week": "Week 14",
      "abet_outcomes": ["SO-3"]
    }
  ]
}`,
  },
  {
    id: 'tex-cs220',
    name: 'CS-220 Computer Architecture Specification',
    fileName: 'CS-220-Computer-Architecture.tex',
    format: 'tex',
    category: 'Faculty Senate TeX Master Specification',
    size: '5.2 KB',
    content: `% Academic Curriculum Board Specification
% Document Class: Academic Senate Syllabus Standard
\\documentclass[11pt,a4paper]{article}
\\usepackage{amsmath,amssymb}
\\usepackage{tabularx}

\\title{Course Specification: CS-220 Computer Systems Architecture}
\\author{Department of Electrical Engineering \\& Computer Science}
\\date{Academic Year 2026--2027}

\\begin{document}
\\maketitle

\\section{Administrative Information}
\\begin{itemize}
  \\item \\textbf{Course Code:} CS-220
  \\item \\textbf{Course Title:} Computer Systems Architecture
  \\item \\textbf{Credits:} 4.0 Carnegie Units (Lecture: 3.0, Lab: 1.0)
  \\item \\textbf{Prerequisites:} CS-102 Introduction to Computing (Min. Grade: C)
  \\item \\textbf{Level:} Level 200 (Sophomore Core)
  \\item \\textbf{Track:} Systems
\\end{itemize}

\\section{Course Description}
CS-220 investigates the structural organization of digital computers, instruction set architecture (ISA) design using RISC-V, pipelined datapath engineering with hazard mitigation, multi-level cache hierarchies, and memory consistency models.

\\section{Syllabus Modules}
\\subsection{Module 1: RISC-V Instruction Set Architecture (Weeks 1--4)}
Lecture Hours: 12, Laboratory Hours: 8.
Topics: Register files, instruction encoding formats (R, I, S, B, U, J), assembly idioms, procedure calling conventions, and ABI invariants.

\\subsection{Module 2: 5-Stage Pipelined Datapath & Hazard Mitigation (Weeks 5--8)}
Lecture Hours: 12, Laboratory Hours: 8.
Topics: Structural, data, and control hazards; forwarding units, branch target buffers, and 2-bit saturating counter branch predictors.

\\subsection{Module 3: Memory Hierarchy, Cache Design & TLBs (Weeks 9--14)}
Lecture Hours: 18, Laboratory Hours: 12.
Topics: Direct-mapped vs. set-associative cache placement; write-through and write-back policies; virtual memory address translation, page tables, and Translation Lookaside Buffers (TLBs).

\\section{Accreditation Alignment (ABET Criterion 3)}
\\begin{itemize}
  \\item \\textbf{SO-1 (Complex Engineering):} Addressed via Lab 2 (pipelined CPU emulator in Verilog/Chisel).
  \\item \\textbf{SO-2 (Engineering Design):} Addressed via Capstone Cache Controller Design.
\\end{itemize}

\\end{document}
`,
  },
];
