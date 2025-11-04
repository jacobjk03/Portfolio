export interface ResumeData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    phone: string;
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

export const resumeData: ResumeData = {
  personal: {
    name: "Jacob Kuriakose",
    title: "Data Scientist & Machine Learning Engineer",
    tagline: "Building intelligent systems with LLMs, NLP, and cloud-first AI pipelines",
    email: "jkuriak3@asu.edu",
    phone: "+1 (602) 802-6591",
    location: "Tempe, AZ",
    bio: "Data Scientist specializing in Machine Learning and NLP with hands-on experience in deploying generative AI systems and cloud-native architectures. Strong background in agentic LLM pipelines, time-series forecasting, and scalable ML infrastructure on AWS.",
    avatar: "/assets/avatar/avatar.png"
  },

  socials: {
    github: "https://github.com/jacobjk03",
    linkedin: "https://linkedin.com/in/jacob-kuriakose",
    website: "https://jacobkuriakose.com"
  },

  skills: [
    {
      category: "Machine Learning & AI",
      items: [
        "Machine Learning", "Deep Learning", "NLP",
        "Transformers", "Generative AI", "Time Series Forecasting",
        "EDA", "Feature Engineering", "Model Evaluation"
      ]
    },
    {
      category: "Programming",
      items: ["Python", "C++", "SQL"]
    },
    {
      category: "Frameworks & Libraries",
      items: [
        "TensorFlow", "Keras", "PyTorch", "Scikit-Learn",
        "LangChain", "LangGraph", "Flask", "Statsmodels"
      ]
    },
    {
      category: "Cloud & Tools",
      items: [
        "AWS (EC2, ECS, ECR, RDS, S3, DynamoDB, Lambda, CloudFront, Secrets Manager)",
        "Docker", "Git", "Jupyter Notebook", "PySpark", "Tableau", "MS Excel"
      ]
    }
  ],

  experience: [
    {
      company: "Arizona State University",
      position: "Research Assistant — AI & Cloud",
      location: "Tempe, AZ",
      startDate: "May 2025",
      endDate: "Present",
      description: [
        "Led migration of production-grade AI chatbot (Waterbot) to CISA AWS environment",
        "Provisioned AWS CDK stack — ECS, ECR, ALB, CloudFront, S3, RDS PostgreSQL, DynamoDB, Lambda",
        "Implemented secure RDS integration via Secrets Manager & IAM roles",
        "Built & pushed Docker images to ECR; switched to ECS CLI redeploys reducing deploy time ~85%",
        "Resolved IAM & CloudShell issues improving deployment stability ~30%",
        "Restored chatbot access for 2,000+ users by removing unintended CloudFront auth"
      ],
      technologies: ["AWS CDK", "Docker", "ECS Fargate", "PostgreSQL", "Python", "Lambda"]
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
      endDate: "2026",
      gpa: "4.00/4.00",
      achievements: [
        "Research Assistant — Cloud & AI",
        "Courses: Software Security, Data Mining, Statistical Machine Learning"
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
      title: "ReAct-Based Medical Chatbot",
      description: "Agentic medical AI chatbot using hybrid LLM orchestration",
      longDescription: "Built a ReAct-style medical chatbot using MedGemma + LLaMA-3 with Pinecone retrieval, cross-encoder reranking, and chain-of-thought execution. Implemented evaluation guardrails and memory compression.",
      image: "/assets/projects/medical_chatbot.jpg",
      technologies: [
        "Python", "LangChain", "LangGraph", "Pinecone",
        "HuggingFace", "Flask", "Cross-Encoder", "LLaMA-3"
      ],
      github: "https://github.com/jacobjk03/Medical_chatbot",
      featured: true
    },
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
      featured: true
    },
    {
      title: "Waterbot",
      description: "AI-powered educational chatbot for water literacy with multilingual & voice support",
      longDescription: "Waterbot is an AI-powered educational chatbot developed at Arizona State University to promote water literacy and sustainability awareness. It engages users—especially K-12 students—in interactive, conversational learning about water conservation, the water cycle, and real-world water challenges. The system runs on a fully cloud-based AWS infrastructure (ECS, CDK, S3, DynamoDB, CloudFront, and RDS) and supports multilingual and voice-based interactions. It was designed to deliver scalable, accessible, and engaging water education experiences while showcasing production-grade AI deployment and cloud engineering practices.",
      image: "/assets/projects/waterbot.jpg",
      technologies: [
        "Python", "AWS", "Graph RAG", "JavaScript", "HTML", "CSS"
      ],
      link: "https://azwaterbot.org",
      github: "https://github.com/jacobjk03/waterbot",
      featured: false
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
      name: "Complete Machine Learning and Data Science Bootcamp 2021",
      issuer: "Udemy (Logo)",
      date: "Sep 2021",
      link: "https://udemy-certificate.s3.amazonaws.com/pdf/UC-0a270215-e08e-4608-ba61-52259eeeb0a4.pdf"
    },
    {
      name: "Machine Learning",
      issuer: "Coursera (Logo)",
      date: "Jun 2021",
      link: "https://www.coursera.org/account/accomplishments/certificate/WXGSLPAFFVAM"
    },
    {
      name: "Built a Face Recognition Application using Python",
      issuer: "GUVI (Logo)",
      date: "Apr 2021",
      link: "https://www.guvi.in/verify-certificate?id=g91596x1Tr37H1a3q9"
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
