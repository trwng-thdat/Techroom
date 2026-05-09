window.StudentData = {
  profile: {
    name: "Maya Sterling",
    role: "Student",
    avatar: "MS",
    color: "#f39b54",
  },
  classes: [
    {
      title: "Advanced Calculus III",
      code: "MATH-402-A",
      subject: "Mathematics",
      level: "Advanced",
      day: "Tue & Thu",
      time: "4:30 - 6:00 PM",
      status: "Active",
      accent: "#14b99e",
      actionLabel: "Details",
      teacher: {
        name: "Dr. Julian Rivers",
        role: "Lead Instructor",
        avatar: "JR",
        color: "#f39b54",
      },
      description:
        "This advanced curriculum is designed for students who demonstrate aptitude to learn rigorous reasoning and the foundations of proofs, and other mathematics. In honor of Jem's research interests to Calculus applications in several modern scientific and engineering contexts.",
      credits: 3,
      building: "Science Building A",
      room: "Room 301",
      learningObjectives: [
        "Mastery of parametric functions and their graphical representations",
        "Understanding of advanced integration techniques and applications",
        "Proficiency with multiple variable calculus concepts in three dimensions",
        "Development of rigorous proof techniques applicable to multivariable functions",
        "Application of calculus principles to real-world engineering and physical problems",
      ],
      curriculum: [
        {
          unit: "Unit 1",
          title: "Parametric Equations & Polar Coordinates",
          topics:
            "Curves defined parametrically, polar curves, calculus with parametric equations",
        },
        {
          unit: "Unit 2",
          title: "Vector Calculus Foundations",
          topics:
            "Vectors in 3D space, dot products, cross products, vector functions",
        },
        {
          unit: "Unit 3",
          title: "Multivariable Calculus",
          topics:
            "Partial derivatives, gradient vectors, directional derivatives, extrema",
        },
      ],
      assignments: [
        {
          id: "MATH-402-A-QUAD-01",
          title: "Quadratic Equations Practice",
          deadline: "Apr 9, 2026",
          deadlineDate: "2026-04-09",
          attachments: 1,
          status: "not-submitted",
          statusLabel: "Not Submitted",
          badge: "2 DAYS LEFT",
          accent: "#f0b75e",
          postedAt: "Apr 5, 2026",
          instructor: "Dr. Elena Rodriguez",
          instructions:
            "Complete the attached problem set focused on solving quadratic equations through factoring, completing the square, and the quadratic formula. Clearly document each step and include labeled graphing work where requested.",
          referenceFiles: [
            {
              id: "MATH-402-A-QUAD-01-REF-1",
              name: "Problem_Set_Quadratics.pdf",
              sizeLabel: "1.2 MB",
              updatedLabel: "Updated yesterday",
              category: "Worksheet",
            },
            {
              id: "MATH-402-A-QUAD-01-REF-2",
              name: "Graphing_Template.xlsx",
              sizeLabel: "450 KB",
              updatedLabel: "Supplemental resource",
              category: "Template",
            },
          ],
          submissionHistory: [],
        },
        {
          id: "MATH-402-A-GEO-02",
          title: "Geometry Proof Set 1",
          deadline: "Apr 5, 2026",
          deadlineDate: "2026-04-05",
          attachments: 2,
          status: "submitted",
          statusLabel: "Submitted",
          accent: "#14b99e",
          postedAt: "Apr 1, 2026",
          instructor: "Dr. Elena Rodriguez",
          instructions:
            "Provide full two-column proofs for the assigned triangle congruence and parallel-line theorems.",
          referenceFiles: [
            {
              id: "MATH-402-A-GEO-02-REF-1",
              name: "Proof_Guideline.pdf",
              sizeLabel: "700 KB",
              updatedLabel: "Updated 3 days ago",
              category: "Guideline",
            },
          ],
          submissionHistory: [
            {
              id: "MATH-402-A-GEO-02-SUB-1",
              submittedAt: "Apr 4, 2026 09:12 PM",
              note: "Submitted through upload",
              files: [
                {
                  name: "Geometry_Proof_Set_1_Maya.pdf",
                  sizeLabel: "2.1 MB",
                  type: "application/pdf",
                },
                {
                  name: "Proof_Diagrams.png",
                  sizeLabel: "480 KB",
                  type: "image/png",
                },
              ],
            },
          ],
        },
        {
          id: "MATH-402-A-LOG-03",
          title: "Logarithm Worksheet",
          deadline: "Completed",
          deadlineDate: "2026-03-28",
          attachments: 1,
          status: "graded",
          statusLabel: "Graded",
          score: "88/100",
          badge: "SCORE: 88/100",
          accent: "#40464a",
          postedAt: "Mar 21, 2026",
          instructor: "Dr. Elena Rodriguez",
          instructions:
            "Solve logarithmic and exponential transformation exercises and include short reasoning steps.",
          referenceFiles: [
            {
              id: "MATH-402-A-LOG-03-REF-1",
              name: "Logarithm_Practice.pdf",
              sizeLabel: "980 KB",
              updatedLabel: "Updated 2 weeks ago",
              category: "Worksheet",
            },
          ],
          submissionHistory: [
            {
              id: "MATH-402-A-LOG-03-SUB-1",
              submittedAt: "Mar 27, 2026 05:40 PM",
              note: "Graded with feedback",
              files: [
                {
                  name: "Logarithm_Worksheet_Maya.pdf",
                  sizeLabel: "1.4 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
        {
          id: "MATH-402-A-TRIG-04",
          title: "Trigonometry Introduction",
          deadline: "Apr 17, 2026",
          deadlineDate: "2026-04-17",
          attachments: 0,
          status: "not-submitted",
          statusLabel: "Not Submitted",
          accent: "#f0b75e",
          postedAt: "Apr 8, 2026",
          instructor: "Dr. Elena Rodriguez",
          instructions:
            "Complete introductory unit-circle and angle conversion questions in the LMS answer sheet.",
          referenceFiles: [],
          submissionHistory: [],
        },
      ],
      upcomingSessions: [
        { date: "Today", time: "4:30 PM - 6:00 PM", status: "ongoing" },
        { date: "Tue, Apr 2", time: "4:30 PM - 6:00 PM", status: "scheduled" },
        { date: "Thu, Apr 4", time: "4:30 PM - 6:00 PM", status: "scheduled" },
        { date: "Tue, Apr 9", time: "4:30 PM - 6:00 PM", status: "scheduled" },
      ],
    },
    {
      title: "Quantum Mechanics",
      code: "PHYS-312-C",
      subject: "Physics",
      level: "Advanced",
      day: "Mon & Wed",
      time: "10:00 - 11:30 AM",
      status: "Active",
      accent: "#14b99e",
      actionLabel: "Details",
      teacher: {
        name: "Prof. Sarah Chen",
        role: "Course Coordinator",
        avatar: "SC",
        color: "#5468ff",
      },
      description:
        "Explore the fundamental principles of quantum mechanics, from wave functions to quantum operators. This course covers the mathematical framework necessary for understanding modern quantum theory and its applications in contemporary physics research.",
      credits: 4,
      building: "Science Building B",
      room: "Lab 205",
      learningObjectives: [
        "Understanding of wave-particle duality and quantum superposition",
        "Proficiency with Schrödinger equation and its solutions",
        "Application of operator formalism to physical observables",
        "Knowledge of quantum entanglement and Bell's theorem",
        "Exposure to contemporary quantum research directions",
      ],
      curriculum: [
        {
          unit: "Unit 1",
          title: "Wave Functions & Operators",
          topics:
            "Probability amplitudes, Hermitian operators, eigenvalue equations",
        },
        {
          unit: "Unit 2",
          title: "Schrödinger Equation",
          topics:
            "Time-dependent and time-independent formulations, potential wells, harmonic oscillator",
        },
        {
          unit: "Unit 3",
          title: "Quantum Entanglement",
          topics:
            "Multi-particle systems, EPR paradox, Bell inequalities, quantum information",
        },
      ],
      assignments: [
        {
          id: "PHYS-312-C-WAVE-01",
          title: "Wave Function Problem Set",
          deadline: "Apr 3, 2026",
          deadlineDate: "2026-04-03",
          attachments: 2,
          status: "submitted",
          statusLabel: "Submitted",
          accent: "#14b99e",
          postedAt: "Mar 29, 2026",
          instructor: "Prof. Sarah Chen",
          instructions:
            "Solve normalization and expectation value exercises from chapter 2.",
          referenceFiles: [
            {
              id: "PHYS-312-C-WAVE-01-REF-1",
              name: "WaveFunction_Sheet.pdf",
              sizeLabel: "860 KB",
              updatedLabel: "Updated last week",
              category: "Worksheet",
            },
          ],
          submissionHistory: [
            {
              id: "PHYS-312-C-WAVE-01-SUB-1",
              submittedAt: "Apr 2, 2026 08:10 PM",
              note: "Submitted through upload",
              files: [
                {
                  name: "Wave_Function_Set_Maya.pdf",
                  sizeLabel: "1.1 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
        {
          id: "PHYS-312-C-OPER-02",
          title: "Quantum Operators Quiz",
          deadline: "Apr 8, 2026",
          deadlineDate: "2026-04-08",
          attachments: 1,
          status: "not-submitted",
          statusLabel: "Not Submitted",
          badge: "5 DAYS LEFT",
          accent: "#f0b75e",
          postedAt: "Apr 4, 2026",
          instructor: "Prof. Sarah Chen",
          instructions:
            "Complete short-response quiz covering commutators and operators.",
          referenceFiles: [],
          submissionHistory: [],
        },
        {
          id: "PHYS-312-C-SCH-03",
          title: "Schrodinger Equation Lab",
          deadline: "Completed",
          deadlineDate: "2026-03-29",
          attachments: 3,
          status: "graded",
          statusLabel: "Graded",
          score: "94/100",
          badge: "SCORE: 94/100",
          accent: "#40464a",
          postedAt: "Mar 18, 2026",
          instructor: "Prof. Sarah Chen",
          instructions:
            "Lab report on finite potential well simulation and boundary condition analysis.",
          referenceFiles: [],
          submissionHistory: [
            {
              id: "PHYS-312-C-SCH-03-SUB-1",
              submittedAt: "Mar 28, 2026 10:22 PM",
              note: "Graded with feedback",
              files: [
                {
                  name: "Schrodinger_Lab_Report.pdf",
                  sizeLabel: "2.6 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
      ],
      upcomingSessions: [
        {
          date: "Mon, Apr 1",
          time: "10:00 AM - 11:30 AM",
          status: "scheduled",
        },
        {
          date: "Wed, Apr 3",
          time: "10:00 AM - 11:30 AM",
          status: "scheduled",
        },
        {
          date: "Mon, Apr 8",
          time: "10:00 AM - 11:30 AM",
          status: "scheduled",
        },
      ],
    },
    {
      title: "UX Design Principles",
      code: "DSGN-101-B",
      subject: "Design",
      level: "Foundation",
      day: "Friday",
      time: "2:00 - 5:00 PM",
      status: "Active",
      accent: "#14b99e",
      actionLabel: "Details",
      teacher: {
        name: "Alex Thompson",
        role: "Senior Designer",
        avatar: "AT",
        color: "#4b5563",
      },
      description:
        "Learn the fundamental principles of user-centered design. This course covers research methodologies, wireframing, prototyping, and user testing. Ideal for students beginning their design career or exploring design thinking for their projects.",
      credits: 3,
      building: "Design Studio",
      room: "Studio 4",
      learningObjectives: [
        "Comprehensive understanding of the design thinking process",
        "Proficiency in user research and persona development",
        "Ability to create effective wireframes and prototypes",
        "Practical experience with industry-standard design tools",
        "Understanding of accessibility and inclusive design principles",
      ],
      curriculum: [
        {
          unit: "Unit 1",
          title: "Design Thinking & User Research",
          topics:
            "Empathy mapping, user interviews, competitive analysis, persona creation",
        },
        {
          unit: "Unit 2",
          title: "Wireframing & Prototyping",
          topics:
            "Information architecture, low-fidelity sketches, mid-fidelity wireframes, interactive prototypes",
        },
        {
          unit: "Unit 3",
          title: "Design Tools & Testing",
          topics:
            "Figma fundamentals, user testing methods, feedback iteration, accessibility standards",
        },
      ],
      assignments: [
        {
          id: "DSGN-101-B-PER-01",
          title: "Persona Research Notes",
          deadline: "Apr 4, 2026",
          deadlineDate: "2026-04-04",
          attachments: 1,
          status: "not-submitted",
          statusLabel: "Not Submitted",
          badge: "1 DAY LEFT",
          accent: "#f0b75e",
          postedAt: "Apr 1, 2026",
          instructor: "Alex Thompson",
          instructions:
            "Submit user persona summaries for two user segments with pain points and behavior goals.",
          referenceFiles: [
            {
              id: "DSGN-101-B-PER-01-REF-1",
              name: "Persona_Template.docx",
              sizeLabel: "190 KB",
              updatedLabel: "Updated 2 days ago",
              category: "Template",
            },
          ],
          submissionHistory: [],
        },
        {
          id: "DSGN-101-B-WIR-02",
          title: "Wireframe Critique",
          deadline: "Apr 6, 2026",
          deadlineDate: "2026-04-06",
          attachments: 2,
          status: "submitted",
          statusLabel: "Submitted",
          accent: "#14b99e",
          postedAt: "Apr 2, 2026",
          instructor: "Alex Thompson",
          instructions:
            "Upload low-fidelity mobile wireframes and a one-page design rationale.",
          referenceFiles: [],
          submissionHistory: [
            {
              id: "DSGN-101-B-WIR-02-SUB-1",
              submittedAt: "Apr 5, 2026 04:54 PM",
              note: "Awaiting grading",
              files: [
                {
                  name: "Wireframe_Critique_Maya.pdf",
                  sizeLabel: "1.8 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
        {
          id: "DSGN-101-B-DS-03",
          title: "Design System Review",
          deadline: "Completed",
          deadlineDate: "2026-03-30",
          attachments: 0,
          status: "graded",
          statusLabel: "Graded",
          score: "100/100",
          badge: "SCORE: 100/100",
          accent: "#40464a",
          postedAt: "Mar 22, 2026",
          instructor: "Alex Thompson",
          instructions:
            "Review a design system and evaluate consistency, accessibility, and scalability.",
          referenceFiles: [],
          submissionHistory: [
            {
              id: "DSGN-101-B-DS-03-SUB-1",
              submittedAt: "Mar 29, 2026 11:12 AM",
              note: "Perfect score",
              files: [
                {
                  name: "Design_System_Review_Maya.pdf",
                  sizeLabel: "1.3 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
      ],
      upcomingSessions: [
        { date: "Fri, Apr 5", time: "2:00 PM - 5:00 PM", status: "scheduled" },
        { date: "Fri, Apr 12", time: "2:00 PM - 5:00 PM", status: "scheduled" },
      ],
    },
    {
      title: "Intro to Algorithms",
      code: "CS-201-D",
      subject: "Computer Science",
      level: "Intermediate",
      day: "Wed & Fri",
      time: "8:30 - 10:00 AM",
      status: "Completed",
      accent: "#d3dad7",
      actionLabel: "Report",
      teacher: {
        name: "Dr. Linda Wu",
        role: "Senior Lecturer",
        avatar: "LW",
        color: "#787f84",
      },
      description:
        "Explore fundamental computer science algorithms and data structures. This course provides the foundation for understanding how to design, analyze, and implement efficient computational solutions.",
      credits: 3,
      building: "Computer Science Building",
      room: "Lab 110",
      learningObjectives: [
        "Understanding of fundamental algorithm design paradigms",
        "Proficiency in analyzing time and space complexity",
        "Mastery of essential data structures: arrays, linked lists, trees, graphs",
        "Ability to implement sorting and searching algorithms efficiently",
        "Experience with algorithm optimization and real-world application",
      ],
      curriculum: [
        {
          unit: "Unit 1",
          title: "Data Structures Fundamentals",
          topics: "Arrays, linked lists, stacks, queues, hash tables",
        },
        {
          unit: "Unit 2",
          title: "Sorting & Searching",
          topics:
            "Bubble sort, merge sort, quick sort, binary search, algorithm analysis",
        },
        {
          unit: "Unit 3",
          title: "Advanced Topics",
          topics:
            "Trees and graphs, depth-first search, breadth-first search, dynamic programming",
        },
      ],
      assignments: [
        {
          id: "CS-201-D-FINAL-01",
          title: "Final Project Report",
          deadline: "Completed",
          deadlineDate: "2026-03-25",
          attachments: 4,
          status: "graded",
          statusLabel: "Graded",
          score: "91/100",
          badge: "SCORE: 91/100",
          accent: "#40464a",
          postedAt: "Mar 1, 2026",
          instructor: "Dr. Linda Wu",
          instructions:
            "Submit final report including algorithm analysis, benchmarks, and reflection section.",
          referenceFiles: [],
          submissionHistory: [
            {
              id: "CS-201-D-FINAL-01-SUB-1",
              submittedAt: "Mar 24, 2026 07:31 PM",
              note: "Graded with instructor comments",
              files: [
                {
                  name: "Final_Project_Report_Maya.pdf",
                  sizeLabel: "3.4 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
        {
          id: "CS-201-D-GRAPH-02",
          title: "Graph Traversal Worksheet",
          deadline: "Submitted",
          deadlineDate: "2026-03-18",
          attachments: 1,
          status: "submitted",
          statusLabel: "Submitted",
          accent: "#14b99e",
          postedAt: "Mar 12, 2026",
          instructor: "Dr. Linda Wu",
          instructions:
            "Solve BFS and DFS traversal tasks and explain complexity assumptions.",
          referenceFiles: [],
          submissionHistory: [
            {
              id: "CS-201-D-GRAPH-02-SUB-1",
              submittedAt: "Mar 17, 2026 10:02 PM",
              note: "Pending feedback",
              files: [
                {
                  name: "Graph_Traversal_Worksheet_Maya.pdf",
                  sizeLabel: "1.0 MB",
                  type: "application/pdf",
                },
              ],
            },
          ],
        },
      ],
      upcomingSessions: [],
    },
  ],
};
