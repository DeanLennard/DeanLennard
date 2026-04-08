export const servicePillars = [
  {
    title: "Web Design & Development",
    description:
      "Next.js applications, full-stack platforms, WordPress builds, responsive UI systems, and API integrations.",
    bullets: [
      "Next.js and React applications",
      "Node.js, MongoDB, and API architecture",
      "PHP and WordPress solutions",
      "Responsive interfaces and UX refinement",
    ],
  },
  {
    title: "SEO",
    description:
      "Technical SEO foundations that help modern sites stay discoverable, fast, and measurable.",
    bullets: [
      "Technical audits and optimisation",
      "Core Web Vitals and performance tuning",
      "Site structure, indexing, and metadata",
      "Analytics and reporting setup",
    ],
  },
  {
    title: "Hosting",
    description:
      "Deployment workflows and infrastructure decisions that keep projects stable, secure, and maintainable.",
    bullets: [
      "Vultr, VPS, and cloud deployments",
      "CI/CD pipelines and release workflows",
      "Domain, DNS, and environment setup",
      "Runtime performance and observability",
    ],
  },
  {
    title: "Game Design & Development",
    description:
      "Interactive builds and gameplay systems created with a product mindset and a strong technical foundation.",
    bullets: [
      "Unity and C# gameplay systems",
      "Prototype development",
      "Interactive experiences and tooling",
      "Indie project support",
    ],
  },
  {
    title: "Delivery, Project & Programme Management",
    description:
      "End-to-end delivery support that keeps stakeholders aligned and projects moving from idea to launch.",
    bullets: [
      "Agile and Scrum delivery",
      "Roadmap and milestone planning",
      "Stakeholder communication",
      "Execution across technical teams",
    ],
  },
] as const;

export const featuredProjects = [
  {
    title: "Outbreak Interactive",
    category: "Web Platform & Analytics",
    summary:
      "A full marketing website with a backend system for financial performance tracking, game telemetry APIs, SEO foundations, and an integrated blogging workflow.",
    outcomes: [
      "Built a full-stack platform in Next.js and MongoDB",
      "Delivered telemetry and financial tracking capabilities",
      "Supported marketing, SEO, and content publishing in one system",
    ],
  },
  {
    title: "Arcbound",
    category: "Game Design & Development",
    summary:
      "A systems-driven sci-fi colony simulation game built in Unity for PC, iOS, and Android, centred on pressure management, chaos, and player-driven outcomes.",
    outcomes: [
      "Built cross-platform gameplay systems in Unity and C#",
      "Supported a systems-led colony simulation experience",
      "Developed a product with clear creative and technical direction",
    ],
  },
  {
    title: "Arcbound Community",
    category: "Community Platform",
    summary:
      "A Next.js and MongoDB community forum and chat system built to support player discussion, engagement, and ongoing platform interaction.",
    outcomes: [
      "Built a tailored forum and chat experience for the Arcbound community",
      "Created a scalable web platform around discussion and engagement",
      "Connected product ecosystem thinking with community growth",
    ],
  },
  {
    title: "Virgin Media O2",
    category: "Programme Delivery & Technology Leadership",
    summary:
      "Senior programme leadership across large-scale migration, sales platform redesign, governance, and multi-team delivery within a complex telecoms environment.",
    outcomes: [
      "Delivered major cost savings and stability improvements",
      "Led cross-functional teams across delivery, engineering, product, and QA",
      "Strengthened governance, reporting, and change management at scale",
    ],
  },
] as const;

export const projectCaseStudies = [
  {
    title: "Outbreak Interactive",
    category: "Full-Stack Web Development Project - Game Studio Platform",
    imageLabel: "Outbreak Interactive platform",
    imageSrc: "/outbreak-interactive.png",
    projectUrl: "https://www.outbreakinteractive.co.uk",
    projectLinkLabel: "Visit Website",
    overview:
      "Outbreak Interactive is a game studio and publishing business. The objective was to design and build a scalable full-stack web application that combined a marketing website with internal systems for financial tracking and game telemetry.",
    challenge:
      "The platform needed to support both external marketing and internal operational workflows. This required combining a high-performance marketing website, backend reporting systems, game telemetry APIs, and SEO and content publishing infrastructure.",
    solution:
      "I developed a full-stack web application using Next.js, Node.js, and MongoDB that unified marketing, analytics, and operational systems. The solution included API endpoints integrated directly with the game, a structured technical SEO setup, and a scalable blogging and content system.",
    technologies: ["Next.js", "Node.js", "MongoDB", "SEO", "Custom APIs"],
    deliveryApproach: [
      "Executed as a full-stack development and technical delivery project, aligning architecture, SEO, and backend systems with business goals",
      "Coordinated the structure of public content, backend data, and telemetry flows",
      "Delivered the build with performance, publishing, and maintainability in mind",
    ],
    outcomes: [
      "Delivered one connected platform for website, blog, financial tracking, and telemetry",
      "Improved the studio's ability to track game performance and marketing activity",
      "Created stronger SEO foundations and a scalable content workflow",
    ],
    takeaway:
      "What made this project successful was the combination of public-facing marketing delivery and internal business tooling in a single, coherent platform.",
  },
  {
    title: "Arcbound",
    category: "Unity Game Development Project - Cross-Platform Simulation",
    imageLabel: "Arcbound gameplay",
    imageSrc: "/arcbound-game.png",
    projectUrl: "https://store.steampowered.com/app/4469180/Arcbound/",
    projectLinkLabel: "View on Steam",
    overview:
      "Arcbound is a systems-driven colony simulation game developed in Unity (C#), designed for PC, iOS, and Android. This project focused on aligning technical implementation with gameplay systems and cross-platform delivery.",
    challenge:
      "The project needed to balance technical execution with systems-heavy design. It also required support for multiple platforms while preserving a clear gameplay identity built around simulation, pressure, and player choice.",
    solution:
      "I built the project in Unity with a focus on systems-driven gameplay, colony simulation mechanics, and a structure that could support iteration across PC and mobile platforms. The work centred on creating a playable, flexible foundation that aligned technical implementation with the intended player experience.",
    technologies: ["Unity", "C#", "PC", "iOS", "Android"],
    deliveryApproach: [
      "Planned development around systems-first gameplay priorities",
      "Coordinated execution to support iteration across multiple target platforms",
      "Focused delivery on playable milestones and sustainable technical foundations",
    ],
    outcomes: [
      "Produced a functional colony simulation experience across multiple platforms",
      "Established core gameplay systems around pressure, chaos, and adaptation",
      "Created a stronger base for continued iteration and feature development",
    ],
    takeaway:
      "What made this project successful was aligning technical development with a clear gameplay vision, allowing systems and player experience to evolve together.",
  },
  {
    title: "Arcbound Community",
    category: "Next.js Web Application - Community Platform",
    imageLabel: "Arcbound community forum",
    imageSrc: "/arcbound-community-forum.png",
    projectUrl: "https://www.arcbound.co.uk",
    projectLinkLabel: "Visit Website",
    overview:
      "Arcbound Community is a full-stack web application built with Next.js and MongoDB, designed to support discussion, player engagement, and ongoing platform interaction.",
    challenge:
      "The platform needed to do more than host posts. It had to provide a reliable space for community conversation, support ongoing engagement, and create a scalable structure for both forum content and chat-based interaction.",
    solution:
      "I built a scalable web application combining forum functionality and real-time chat, creating a tailored community platform designed for performance, usability, and growth.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Forum Systems", "Chat"],
    deliveryApproach: [
      "Defined the platform around community needs and ongoing interaction",
      "Structured the build to support both discussion threads and live communication",
      "Delivered a maintainable system designed for growth and continued iteration",
    ],
    outcomes: [
      "Created a dedicated community space for Arcbound players and followers",
      "Improved the ecosystem around the core game with stronger engagement tools",
      "Delivered a scalable platform for conversation, support, and community growth",
    ],
    takeaway:
      "What made this project successful was extending the product beyond the game itself and creating a dedicated platform for community interaction.",
  },
  {
    title: "Virgin Media O2",
    category: "Technical Delivery & Programme Management - Telecoms Platform",
    imageLabel: "Virgin Media O2 delivery programme",
    imageSrc: "/virgin-media-o2.jpg",
    projectUrl: "https://www.virginmedia.com",
    projectLinkLabel: "Visit Website",
    overview:
      "A large-scale technical delivery programme involving platform migration, web application redesign, and multi-team coordination across a complex telecoms environment.",
    challenge:
      "The programme combined complex migration work, multiple product integrations, budget governance, and coordination across more than 15 cross-functional teams. It also required operational stability, compliance, and clearer delivery structure across disciplines.",
    solution:
      "I led a GBP 6M+ cost-saving technical delivery programme over 12 months, redesigned and rebuilt a sales web application aligned to End State Architecture, unified cross-functional teams around shared delivery goals, and established governance and change management processes to keep platform engineering and execution controlled and compliant.",
    technologies: [
      "Programme Delivery",
      "Next.js",
      "Node.js",
      "QA Automation",
      "Governance",
    ],
    deliveryApproach: [
      "Led planning, governance, and cross-team coordination across 15+ functions",
      "Provided leadership across delivery, product, frontend, backend, and QA disciplines",
      "Managed reporting, coaching, KPIs, 1:1s, and performance reviews across 35 engineering reports",
    ],
    outcomes: [
      "Reduced downtime by 40% and increased platform stability by 35%",
      "Drove a 25% increase in customer engagement through integrated product delivery",
      "Improved sales process efficiency by 30% and kept a GBP 18m programme budget within 5% variance",
    ],
    takeaway:
      "What made this project successful was disciplined programme leadership across delivery, governance, engineering management, and business alignment at enterprise scale.",
  },
  {
    title: "Barclays Bank",
    category: "Enterprise Agile Transformation & Delivery Leadership",
    imageLabel: "Barclays transformation programme",
    imageSrc: "/barclays-bank.jpg",
    projectUrl: "https://www.barclays.co.uk",
    projectLinkLabel: "Visit Website",
    overview:
      "An enterprise transformation and technical delivery initiative focused on improving web and mobile application development, delivery performance, and organisational alignment.",
    challenge:
      "The work spanned organisational transformation, executive alignment, product consistency, delivery performance, and management across large multidisciplinary teams. Success depended on changing delivery culture while also improving practical output and governance.",
    solution:
      "I designed and executed an enterprise-wide Agile transformation, embedded continuous improvement practices across a large employee base, led a blueprint UX/UI initiative covering more than 40 digital products, and managed multiple development teams delivering applications across web, iOS, and Android.",
    technologies: [
      "Agile Delivery",
      "Angular",
      "Next.js",
      "Swift",
      "Kotlin",
      "QA Automation",
    ],
    deliveryApproach: [
      "Aligned transformation initiatives with executive strategy and organisational objectives",
      "Led three development teams while managing cross-discipline reporting and performance",
      "Established structured coaching, delivery oversight, and continuous improvement practices",
    ],
    outcomes: [
      "Improved team performance by 40% and delivered GBP 12M in financial savings",
      "Drove 25% productivity gains and reduced defects by 35%",
      "Achieved a 20% faster release cycle and over 90% adoption across teams",
    ],
    takeaway:
      "What made this project successful was combining transformation leadership with practical delivery execution, ensuring strategic change translated into measurable results.",
  },
] as const;

export const techGroups = [
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "PHP", "REST APIs"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    title: "Other",
    items: ["Unity (C#)", "WordPress", "SEO", "Hosting & DevOps"],
  },
] as const;

export const deliveryPoints = [
  "Translate ideas into practical architecture and phased execution plans.",
  "Own both the technical implementation and the delivery process around it.",
  "Create reliable release, hosting, and performance foundations alongside the codebase.",
  "Support startups, agencies, and businesses that need a dependable technical partner.",
] as const;

export const stats = [
  { value: "5", label: "Service pillars" },
  { value: "End-to-end", label: "Delivery focus" },
  { value: "Full-stack", label: "Build capability" },
  { value: "Scalable", label: "Solution mindset" },
] as const;
