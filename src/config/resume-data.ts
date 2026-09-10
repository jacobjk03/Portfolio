export interface ResumeData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    // Deliberately not stored here — a plain-text number in a public repo gets
    // scraped into spam databases. It lives only in the resume PDF.
    phone?: string;
    location: string;
    bio: string;
    avatar: string;
  };
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  /**
   * The handful shown large at the top of the Skills section — what you want a
   * recruiter to take away in one glance. Everything else stays available under
   * the toggle.
   *
   * `proof` is an authoring gate, not display text — the Skills cards show only
   * the diagram and the name. Requiring a concrete, already-verified result from
   * the experience or projects below keeps unbacked claims out of the headline
   * set; anything without one belongs in the full list under the toggle.
   */
  headlineSkills: { name: string; proof: string }[];
  experience: {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
    technologies?: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements?: string[];
  }[];
  projects: {
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    technologies: string[];
    link?: string;
    github?: string;
    featured: boolean;
    isPrivate?: boolean;
    category: "personal" | "team";
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
  blog?: {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tags: string[];
  }[];
}

// Resume PDF — single source of truth for the view + download buttons.
// Bump RESUME_VERSION whenever public/Jacob-Kuriakose-Resume.pdf is replaced so
// browsers and the CDN don't serve a cached copy of the old file.
export const RESUME_FILE_NAME = "Jacob-Kuriakose-Resume.pdf";
export const RESUME_PATH = `/${RESUME_FILE_NAME}`;
export const RESUME_VERSION = "2026-09";
export const RESUME_URL = `${RESUME_PATH}?v=${RESUME_VERSION}`;

export const resumeData: ResumeData = {
  personal: {
    name: "Jacob Kuriakose",
    title: "Data Scientist & Machine Learning Engineer",
    tagline: "Building intelligent systems with LLMs, NLP, and cloud-first AI pipelines",
    email: "jkuriak3@asu.edu",
    location: "Plano, TX",
    bio: "Data Scientist specializing in NLP, Time Series Forecasting, and multi-agent AI systems, with experience shipping production-grade AI in both research and startup environments. Platform Engineer at Wipro, open to conversations about data science and ML engineering roles.",
    avatar: "/assets/avatar/avatar.png"
  },

  socials: {
    github: "https://github.com/jacobjk03",
    linkedin: "https://linkedin.com/in/jacob-kuriakose",
    website: "https://jacobkuriakose.com"
  },

  // Every proof below traces to a bullet in experience[] or projects[] — nothing
  // here is a new claim.
  headlineSkills: [
    {
      name: "LLM Fine-Tuning",
      proof: "Granite 4.1 8B · 56.5% → 92.3% accuracy",
    },
    {
      name: "Time Series Forecasting",
      proof: "38.92% RMSE improvement over LSTM",
    },
    {
      name: "RAG",
      proof: "Bedrock retrieval · 2,000+ users in production",
    },
    {
      name: "Multi-Agent Systems",
      proof: "Navia · intent routing + Pinecone memory",
    },
    {
      name: "NLP",
      proof: "Transformer classification · +10% accuracy",
    },
    {
      name: "AWS",
      proof: "ECS, CDK, Bedrock · ~85% faster releases",
    },
  ],

  skills: [
    {
      category: "Machine Learning & AI",
      items: [
        "Machine Learning", "Deep Learning", "NLP",
        "Transformers", "Generative AI", "Time Series Forecasting",
        "LLM Fine-Tuning", "Multi-Agent Systems", "RAG",
        "EDA", "Feature Engineering", "Model Evaluation", "A/B Testing"
      ]
    },
    {
      category: "Programming",
      items: ["Python", "C++", "C", "Go", "JavaScript", "SQL"]
    },
    {
      category: "Frameworks & Libraries",
      items: [
        "TensorFlow", "Keras", "PyTorch", "Scikit-Learn",
        "LangChain", "LangGraph", "FastAPI", "Flask", "Statsmodels",
        "SpaCy", "NLTK"
      ]
    },
    {
      category: "Cloud & Tools",
      items: [
        // Individual AWS services live in the Experience bullets (ECS Fargate,
        // ECR, ALB, CloudFront, S3, RDS, DynamoDB, Lambda) — as one tag here it
        // wrapped to two lines and broke the row rhythm.
        "AWS", "AWS Bedrock", "Docker", "Git", "GitHub Actions", "MLflow", "DVC",
        "Jupyter Notebook", "PySpark", "Tableau", "MS Excel"
      ]
    }
  ],

  experience: [
    {
      company: "Wipro",
      position: "Platform Engineer",
      location: "Plano, TX",
      startDate: "Sep 2026",
      endDate: "Present",
      description: [
        // TODO: replace with real responsibilities once the role ramps up
        "Joined full-time as a Platform Engineer after converting from the summer AI Engineer internship"
      ]
    },
    {
      company: "Wipro",
      position: "AI Engineer Intern",
      location: "Plano, TX",
      startDate: "Jun 2026",
      endDate: "Aug 2026",
      description: [
        "Fine-tuned a Granite 4.1 8B SLM for AT&T change risk management, taking accuracy from 56.5% to 92.3% and macro F1 from 0.50 to 0.92, using Claude as an LLM judge for explanation correctness and action relevance",
        "Built an end-to-end synthetic data generation and training pipeline from AT&T-provided schemas and sample records, leveraging Kimi K2.5 to generate 50K domain-specific change tickets for enterprise change management workflows",
        "Developed a change & configuration management agent connected to ServiceNow ticket data and CMDB network topology, enabling the fine-tuned SLM to generate risk rules, blast radius analysis, recommended actions, and rollback plans",
        "Deployed the agentic SLM workflow on AT&T's AWS dev instance and integrated it with Wipro's WINGS platform for testing and validation"
      ],
      technologies: ["Granite 4.1 8B", "LLM Fine-Tuning", "LLM-as-a-Judge", "Synthetic Data Generation", "Agentic AI", "ServiceNow", "CMDB", "AWS", "Python"]
    },
    {
      company: "Arizona State University",
      position: "AI Backend Developer",
      location: "Tempe, AZ",
      startDate: "May 2025",
      endDate: "Jun 2026",
      description: [
        "Led migration of production-grade AI chatbot (Waterbot) to CISA AWS environment",
        "Provisioned AWS CDK stack (ECS Fargate, ECR, ALB, CloudFront, S3, RDS PostgreSQL, DynamoDB, Lambda), cutting manual setup ~40% and deployment downtime ~30%",
        "Built multi-stage RAG pipeline using AWS Bedrock Knowledge Base + GPT-4.1: safety moderation → intent detection → language detection → semantic retrieval → source citation linking",
        "Replaced a self-hosted Chroma vector DB with AWS Bedrock Knowledge Base as the retrieval layer; re-indexed embeddings and wired managed retrieval into ECS tasks for better scalability",
        "Engineered FastAPI backend with 13 REST & WebSocket endpoints; implemented per-session memory management and pluggable ModelAdapter pattern (OpenAI / Bedrock) for swappable LLM backends",
        "Developed real-time voice transcription via WebSocket with S3 storage and presigned URL downloads; added English/Spanish auto-detection using langdetect",
        "Implemented secure RDS integration via Secrets Manager & IAM roles; configured EC2 IAM role-based auth, eliminating static credentials",
        "Built CI/CD with GitHub Actions and pushed Docker images to ECR; switched to ECS CLI redeploys reducing release cycle ~85%",
        "Restored chatbot access for 2,000+ users by removing unintended CloudFront auth"
      ],
      technologies: ["AWS CDK", "AWS Bedrock", "FastAPI", "RAG", "GPT-4.1", "Docker", "ECS Fargate", "PostgreSQL", "Python", "WebSocket", "Lambda", "GitHub Actions"]
    },
    {
      company: "Red Hat",
      position: "Software Quality Engineer Intern",
      location: "Remote",
      startDate: "Jan 2023",
      endDate: "Jul 2023",
      description: [
        "Automated & executed software test suites using GoLang",
        "Reduced test execution time by 30% through optimization",
        "Designed detailed test plans in Polarion",
        "Used Docker for scalable deployment environments"
      ],
      technologies: ["Go", "Docker", "Polarion"]
    },
    {
      company: "BraynixAI",
      position: "NLP Intern",
      location: "Remote",
      startDate: "Jun 2022",
      endDate: "Aug 2022",
      description: [
        "Enhanced legal document classification accuracy by 10% using Transformer models",
        "Built FastAPI ML services for document processing at scale"
      ],
      technologies: ["Python", "Transformers", "FastAPI"]
    }
  ],

  education: [
    {
      institution: "Arizona State University",
      degree: "Master of Science",
      field: "Data Science",
      location: "Tempe, AZ",
      startDate: "2024",
      endDate: "May 2026",
      gpa: "4.00/4.00",
      achievements: [
        "AI Backend Developer on Waterbot, a production RAG platform (azwaterbot.org)",
        "Courses: Software Security, Data Mining, Statistical Machine Learning, Database Management Systems"
      ]
    },
    {
      institution: "Dr. Akhilesh Das Gupta Institute of Technology and Management",
      degree: "Bachelor of Technology",
      field: "Information Technology",
      location: "Delhi, India",
      startDate: "2019",
      endDate: "2023",
      gpa: "9.0/10",
      achievements: [
        "Published 'Monument Tracker' Deep Learning research paper"
      ]
    }
  ],

  projects: [
    {
      title: "Navia",
      description: "Co-founded AI companion for neurodivergent adults, built around multi-agent orchestration, Pinecone memory and E2EE peer messaging",
      longDescription: "Co-founded and lead AI engineering at Navia (joinnavia.com), an AI companion for neurodivergent adults navigating college and the workforce. Designed the multi-agent orchestration system with an intent router that dynamically classifies queries across tasks, brain dumps, email, calendar, and conversation, routing to the correct handler without hardcoding. Built the Pinecone vector memory layer for persistent long-term user context across sessions. Engineered the full LLM pipeline from Groq/Llama through GPT-4.1 and GPT-4.1-mini with tone-optimized prompt engineering. Built Gmail integration (reply detection, draft generation, inbox surfacing) and Google Calendar integration (add/modify/delete via chat). Architected client-side E2EE for all peer messaging with passkey auth (SimpleWebAuthn) and a recovery code fallback system. Built an energy-adaptive AI response system and Magic Mode, a deeper interaction layer with personalized entry messages. Peer matching backend with connection requests, name masking until mutual reveal, block/report/remove, and a full notification system.",
      image: "/assets/projects/navia.jpg",
      technologies: [
        "Next.js", "React 19", "TypeScript", "Tailwind CSS",
        "OpenAI GPT-4.1", "Pinecone", "Groq", "Hume AI", "Tavily",
        "Supabase", "Redis", "Firebase",
        "SimpleWebAuthn", "E2EE", "Vercel", "Zustand"
      ],
      link: "https://www.joinnavia.com/",
      github: "https://github.com/jacobjk03/Navia",
      featured: true,
      isPrivate: true,
      category: "team"
    },
    {
      title: "ReAct-Based Medical Chatbot",
      description: "Agentic medical AI chatbot with ReAct reasoning, dual search, and safety classification",
      longDescription: "Aceso is a medical AI chatbot built on a LangGraph ReAct StateGraph, with explicit Thought → Action → Observation loops powered by LLaMA-3.3-70b. Implements dual retrieval: a Pinecone vector store (Gale Encyclopedia of Medicine) for established facts and DuckDuckGo web search filtered to trusted medical sources (WHO, NIH, CDC, PubMed, Mayo Clinic). Retrieved chunks are reranked with BAAI/bge-reranker-large CrossEncoder for relevance. Every response passes through a dedicated LLaMA-3.1-8b safety classifier before being shown to the user. Conversation history is maintained across turns with automatic summarization for long sessions. Features a collapsible reasoning trace so users can inspect the full Thought-Action-Observation chain. Deployed on Hugging Face Spaces via Docker.",
      image: "/assets/projects/medical_chatbot.jpg",
      technologies: [
        "Python", "LangChain", "LangGraph", "Pinecone",
        "HuggingFace", "Flask", "Cross-Encoder", "LLaMA-3"
      ],
      github: "https://github.com/jacobjk03/Medical_chatbot",
      link: "https://huggingface.co/spaces/jacob03/medical_chatbot",
      featured: true,
      category: "personal"
    },
    {
      title: "Waterbot",
      description: "AI-powered educational chatbot for water literacy with multilingual & voice support",
      longDescription: "Waterbot is an AI-powered educational chatbot developed at Arizona State University to promote water literacy and sustainability awareness. It engages users, especially K-12 students, in interactive, conversational learning about water conservation, the water cycle, and real-world water challenges. The system runs on a fully cloud-based AWS infrastructure (ECS, CDK, S3, DynamoDB, CloudFront, and RDS) and supports multilingual and voice-based interactions. It was designed to deliver scalable, accessible, and engaging water education experiences while showcasing production-grade AI deployment and cloud engineering practices.",
      image: "/assets/projects/waterbot.jpg",
      technologies: [
        "Python", "AWS", "Graph RAG", "JavaScript", "HTML", "CSS"
      ],
      link: "https://azwaterbot.org",
      github: "https://github.com/jacobjk03/waterbot",
      featured: false,
      category: "team"
    },
    // Deliberately last: the projects grid renders the "Beat the forecast" game
    // in the empty cells of the final row, so the forecasting project sits
    // directly beside the forecasting game rather than a row apart.
    {
      title: "Walmart Sales Forecasting",
      description: "Retail demand forecasting using ML & Deep Learning",
      longDescription: "Benchmarked SARIMA, ES, LSTM, RF, and LightGBM for sales forecasting. Exponential Smoothing achieved 38.92% RMSE improvement over LSTM.",
      image: "/assets/projects/walmart_forecasting.jpg",
      technologies: [
        "Python", "Pandas", "Statsmodels",
        "TensorFlow", "Keras", "Matplotlib"
      ],
      github: "https://github.com/jacobjk03/Data-Driven-Walmart-Sales-Predictions",
      featured: true,
      category: "personal"
    }
  ],

  certifications: [
    {
      name: "Generative AI with Large Language Models",
      issuer: "DeepLearning.AI (Logo)",
      date: "Feb 2024",
      link: "https://www.coursera.org/account/accomplishments/verify/C22JZ8SFYQZL"
    },
    {
      name: "Machine Learning",
      issuer: "Coursera (Logo)",
      date: "Jun 2021",
      link: "https://www.coursera.org/account/accomplishments/certificate/WXGSLPAFFVAM"
    },
    {
      name: "30 Days of Google Cloud",
      issuer: "Google Cloud / Qwiklabs (Logo)",
      date: "Nov 2020",
      link: "https://www.skills.google/public_profiles/797612e1-a43f-4631-909c-7c7b46190978"
    }
  ],

  blog: []
};
