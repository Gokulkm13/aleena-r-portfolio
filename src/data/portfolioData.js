const BASE = import.meta.env.BASE_URL;

export const personalInfo = {
  name: "ALEENA R",
  role: "HR Intern",
  company: "S & O Maritime Services Private Limited",
  companyUrl: "https://www.sandomaritime.com/",
  portrait: `${BASE}assets/images/aleena-portrait.jpg`,
  footerPortrait: `${BASE}assets/images/aleena-footer-blended.png`,
  email: "aleenaraju203@gmail.com",
  instagram: "https://www.instagram.com/aleena.rosu.raju?stkn=MWFlbHRnazVrZXJtcg==",
  linkedIn: "https://www.linkedin.com/in/aleena-r-244691280",
  telegram: "https://t.me/Aleenaraju",
  telegramHandle: "@Aleenaraju",
  bioHeadline: "I bridge human psychology, workplace dynamics, and organizational excellence.",
  aboutIntro: "I am a Psychology postgraduate with a strong interest in understanding people, workplace behaviour, and the factors that contribute to healthy and productive organizational environments.",
  about: [
    "I am a Psychology postgraduate with a strong interest in understanding people, workplace behaviour, and the factors that contribute to healthy and productive organizational environments.",
    "My academic journey has given me a foundation in psychological theory, research, observation, communication, and understanding human behaviour. Through my internships and academic experiences, I have had opportunities to work in professional and multidisciplinary environments where I developed my interpersonal, documentation, observation, and communication skills.",
    "I am particularly interested in bringing psychological understanding into human resources and workplace practices. I believe that understanding people is an important part of building supportive, effective, and meaningful workplaces.",
    "As I continue developing my career, I am looking forward to learning, contributing, and growing within the field of Human Resources."
  ],
  careerDirection: {
    heading: "WHERE I'M HEADED",
    content: "I am building my career at the intersection of Psychology and Human Resources. My goal is to continue learning about people, workplace behaviour, employee well-being, and organizational practices while developing myself as an HR professional. I want to bring empathy, curiosity, research-based thinking, and a willingness to learn into every professional environment I become part of."
  },
  languages: [
    { language: "Malayalam", proficiency: "Native" },
    { language: "English", proficiency: "Fluent" },
    { language: "Hindi", proficiency: "Conversational" }
  ]
};

export const experiences = [
  {
    id: "exp-current",
    role: "HR Intern",
    company: "S & O Maritime Services Private Limited",
    companyUrl: "https://www.sandomaritime.com/",
    period: "Present",
    isCurrent: true,
    location: "Kochi, Kerala",
    description: "As an HR Intern at S & O Maritime Services Private Limited, I am applying behavioral insights, active listening, and people-oriented practices within everyday operations. I support workplace documentation, team communication, and professional coordination, while learning how to build supportive and productive organizational environments."
  },
  {
    id: "exp-mhc",
    role: "Psychological Intern",
    company: "Mental Health Centre",
    period: "25/04/2025 – 28/05/2025",
    isCurrent: false,
    location: "Thiruvananthapuram, Kerala",
    description: "During my internship at the Mental Health Centre, I worked alongside professionals in a multidisciplinary environment. I participated in documentation, maintained records, observed professional practices, and developed my communication and coordination skills."
  },
  {
    id: "exp-svh",
    role: "Psychological Intern",
    company: "St. Vincent's Hospital",
    period: "26/12/2022 – 30/12/2022",
    isCurrent: false,
    location: "Kadampanadu, Kerala",
    description: "During my internship at St. Vincent's Hospital, I had the opportunity to observe professional practices within an institutional environment. The experience helped me develop my interpersonal skills and understand the importance of confidentiality and professional conduct."
  }
];

export const education = [
  {
    id: "edu-msc",
    degree: "MSc Psychology",
    institution: "MES College Marampally, Aluva",
    university: "Mahatma Gandhi University, Kerala",
    period: "2024 – 2026"
  },
  {
    id: "edu-bsc",
    degree: "BSc Psychology",
    institution: "Mater DEI CMI College, Pathanamthitta",
    university: "Kerala University",
    period: "2021 – 2024"
  }
];

export const researchPublications = {
  sectionIntro: "Research has been an important part of my journey in Psychology. Through academic projects, publications, interviews, analysis, and presentations, I have developed a deeper appreciation for understanding human behaviour through evidence and structured inquiry.",
  featuredPaper: {
    badge: "RESEARCH PUBLICATION 02",
    title: "EXPLORING THE ROLE OF PSYCHOLOGICAL CAPITAL IN SHAPING EMPLOYEES JOB SATISFACTION: A PHENOMENOLOGICAL STUDY",
    description: "I co-authored this research article exploring the role of psychological capital in employee job satisfaction. Through this work, I gained experience with semi-structured interviews, qualitative research, reflexive thematic analysis, research documentation, academic writing, and communicating research findings.",
    journal: "Journal of Advance and Future Research (JAAFR)",
    volume: "Volume 4, Issue 7",
    date: "July 2026",
    paperId: "JAAFR2607586",
    coAuthor: "Feha Marzook",
    pdfUrl: `${BASE}JAAFR2607586.pdf`,
    certificateImage: `${BASE}assets/certificates/jaafr-publication-certificate.png`,
    certificatePdf: `${BASE}assets/certificates/jaafr-publication-certificate.pdf`
  },
  bookChapter: {
    badge: "RESEARCH PUBLICATION 01 • BOOK CHAPTER",
    title: "THE ROLE OF PERSONALITY TRAITS ON INTERNET ADDICTION AMONG YOUNG ADULTS",
    description: "I co-authored this research work as part of my academic journey and contributed to the exploration of the relationship between personality traits and internet addiction among young adults. Working on this publication helped me strengthen my research documentation, data analysis, collaborative writing, and presentation skills.",
    bookTitle: "Addictions and Mental Health",
    publisher: "Union Christian College, Aluva",
    isbn: "978-81-964183-9-7",
    authors: ["Aleena R.", "Amna Ashraf", "Anamika R."],
    coAuthor: "Feha Marzook"
  },
  presentations: [
    {
      badge: "SHARING MY RESEARCH",
      type: "Paper Presentation",
      title: "The Role of Personality Traits on Internet Addiction Among Young Adults",
      venue: "Prof. T. Simon Memorial National Seminar, Union Christian College, Aluva",
      date: "5–6 September 2024",
      description: "I presented my research on the role of personality traits in internet addiction among young adults at the Prof. T. Simon Memorial National Seminar at Union Christian College, Aluva. Presenting the research helped me become more confident in communicating academic findings, coordinating with team members, and presenting information to a professional audience."
    },
    {
      badge: "MY DISSERTATION",
      type: "Dissertation",
      title: "Effect of Spirituality on Resilience among Undergraduate Students",
      year: "2024",
      description: "For my dissertation, I explored the effect of spirituality on resilience among undergraduate students. The research involved data collection, analysis, documentation, and report writing, giving me valuable experience in conducting independent academic research."
    }
  ]
};

export const certificates = [
  {
    id: "cert-udemy",
    title: "REBT to Overcome Negative Thinking & Attitude",
    provider: "Udemy",
    instructor: "Psychologyclass Org",
    recipient: "Aleena R",
    date: "May 18, 2026",
    duration: "2 total hours",
    previewImage: `${BASE}assets/certificates/udemy-rebt.png`,
    pdfUrl: `${BASE}assets/certificates/udemy-rebt.pdf`,
    aspectRatio: "4 / 3"
  },
  {
    id: "cert-swayam",
    title: "Educational Psychology",
    provider: "SWAYAM Online Course Certification (NPTEL)",
    courseDetails: "2 credit course",
    score: "86%",
    coursePeriod: "December 2024",
    issuedDate: "31/01/2025",
    previewImage: `${BASE}assets/certificates/swayam-educational-psychology.png`,
    pdfUrl: `${BASE}assets/certificates/swayam-educational-psychology.pdf`,
    aspectRatio: "1.41 / 1"
  },
  {
    id: "cert-jaafr",
    title: "Journal Publication Certificate",
    provider: "Journal of Advance and Future Research (JAAFR)",
    recipient: "Aleena R",
    paper: "EXPLORING THE ROLE OF PSYCHOLOGICAL CAPITAL IN SHAPING EMPLOYEES JOB SATISFACTION: A PHENOMENOLOGICAL STUDY",
    publicationInfo: "Volume 4 Issue 7, July 2026",
    paperId: "JAAFR2607586",
    previewImage: `${BASE}assets/certificates/jaafr-publication-certificate.png`,
    pdfUrl: `${BASE}assets/certificates/jaafr-publication-certificate.pdf`,
    aspectRatio: "0.77 / 1"
  },
  {
    id: "cert-apa",
    title: "APA Membership Certificate",
    provider: "American Psychological Association (APA)",
    recipient: "Aleena R",
    previewImage: `${BASE}assets/certificates/apa-membership.png`,
    pdfUrl: `${BASE}assets/certificates/apa-membership.pdf`,
    aspectRatio: "0.77 / 1"
  }
];

export const continuousLearning = [
  {
    title: "A Course on Educational Psychology",
    organization: "SWAYAM / NPTEL",
    detail: "2 Credit Course — Score: 86%"
  },
  {
    title: "Mindfulness Based Practices: Integrating Intelligence and Consciousness",
    organization: "Workshop",
    detail: "Practical contemplative psychology & consciousness study"
  },
  {
    title: "International Webinar on Neuropsychological Screening Tools",
    organization: "Webinar",
    detail: "Assessment instruments and cognitive evaluation techniques"
  },
  {
    title: "Workshop on Cognitive Behavioural Therapy",
    organization: "Workshop",
    detail: "CBT framework, cognitive reframing & behavioral techniques"
  },
  {
    title: "Workshop on Art Therapy",
    organization: "Workshop",
    detail: "Expressive psychological intervention and creative therapy"
  },
  {
    title: "Research Methodology Webinar",
    organization: "Webinar",
    detail: "Qualitative & quantitative inquiry methods and data analysis"
  },
  {
    title: "Prof. T. Simon Memorial National Seminar",
    organization: "Union Christian College, Aluva",
    detail: "Addictions & Mental Health conference and research presentation"
  }
];

export const skills = [
  { name: "Communication Skills", category: "People & Interpersonal" },
  { name: "Interpersonal Skills", category: "People & Interpersonal" },
  { name: "Active Listening", category: "People & Interpersonal" },
  { name: "Team Collaboration", category: "People & Interpersonal" },
  { name: "Observation", category: "Analytical & Research" },
  { name: "Report Writing", category: "Analytical & Research" },
  { name: "Problem Solving", category: "Analytical & Research" },
  { name: "Attention to Detail", category: "Analytical & Research" },
  { name: "Professionalism", category: "Workplace & Governance" },
  { name: "Confidentiality", category: "Workplace & Governance" },
  { name: "Adaptability", category: "Growth & Mindset" },
  { name: "Willingness to Learn", category: "Growth & Mindset" },
  { name: "Time Management", category: "Growth & Mindset" },
  { name: "Organizational Skills", category: "Growth & Mindset" }
];

export const communityActivities = [
  {
    role: "Resource Person",
    title: "Delivered awareness session on Health Care",
    organization: "Nusrath-ul Islam Vocational HSS",
    date: "11/05/2025",
    description: "I delivered an awareness session on health care, which gave me an opportunity to communicate information clearly and interact with an audience."
  },
  {
    role: "Volunteer",
    title: "Community Outreach & Care",
    organization: "Abhaya Old Age Home, Kalamassery",
    description: "I supported activities and organizational needs through volunteering, an experience that strengthened my sense of empathy, coordination, and responsibility."
  },
  {
    role: "Volunteer",
    title: "Rehabilitation & Social Support",
    organization: "Peace Valley, Nellikkuzhi",
    description: "I supported activities and organizational needs through volunteering, an experience that strengthened my sense of empathy, coordination, and responsibility."
  }
];
