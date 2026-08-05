export const AIResponseFormat = `
interface Feedback {
  // 1. Overall Resume Analysis
  overallResumeScore: number; // 0-100
  atsCompatibilityScore: number;
  recruiterAppealScore: number;
  technicalStrengthScore: number;
  professionalismScore: number;
  industryReadinessScore: number;
  confidenceScore: number;
  overallGrade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

  // 2. ATS Compatibility Analysis
  atsFriendlyStatus: boolean;
  resumeParsingAccuracy: number;
  pdfDocxValidation: boolean;
  fontCompatibility: boolean;
  multiColumnDetection: boolean;
  tablesDetection: boolean;
  iconsGraphicsDetection: boolean;
  headerFooterIssues: boolean;
  textExtractionAccuracy: number;
  atsRedFlags: string[];
  atsImprovementSuggestions: string[];

  // 3. Resume Structure Analysis
  structureAnalysis: {
    contactInformation: boolean;
    professionalSummary: boolean;
    technicalSkills: boolean;
    softSkills: boolean;
    workExperience: boolean;
    internshipExperience: boolean;
    projects: boolean;
    education: boolean;
    certifications: boolean;
    achievements: boolean;
    languages: boolean;
    publications: boolean;
    volunteerExperience: boolean;
    references: boolean;
    missingSections: string[];
    completenessPercentage: number;
  };

  // 4. Contact Information Validation
  contact: {
    hasFullName: boolean;
    hasProfessionalEmail: boolean;
    hasPhoneNumber: boolean;
    hasLinkedInProfile: boolean;
    hasGitHubProfile: boolean;
    hasPortfolioWebsite: boolean;
    hasLocation: boolean;
    professionalEmailFormat: boolean;
    missingOrInvalidInfo: string[];
  };

  // 5. Professional Summary Analysis
  summary: {
    length: "Too Short" | "Optimal" | "Too Long";
    clarity: number; // 0-100
    impact: number;
    personalBranding: number;
    keywords: number;
    professionalTone: number;
    atsOptimization: number;
    improvedAiGeneratedSummary: string;
  };

  // 6. Skills Analysis
  skillsAnalysis: {
    technical: {
      programmingLanguages: string[];
      frontend: string[];
      backend: string[];
      databases: string[];
      frameworks: string[];
      libraries: string[];
      devOps: string[];
      cloud: string[];
      aiMl: string[];
      dataScience: string[];
      cybersecurity: string[];
      mobileDevelopment: string[];
      testingTools: string[];
      versionControl: string[];
      operatingSystems: string[];
      apis: string[];
      otherTechnicalSkills: string[];
    };
    soft: {
      leadership: boolean;
      communication: boolean;
      teamwork: boolean;
      collaboration: boolean;
      adaptability: boolean;
      problemSolving: boolean;
      criticalThinking: boolean;
      creativity: boolean;
      timeManagement: boolean;
      decisionMaking: boolean;
    };
    skillsFound: string[];
    missingSkills: string[];
    recommendedSkills: string[];
  };

  // 7. Keyword Analysis
  keywords: {
    totalKeywords: number;
    relevantKeywords: number;
    missingKeywords: string[];
    keywordDensity: number;
    keywordMatchPercentage: number;
    technicalKeywords: string[];
    softSkillKeywords: string[];
    industryKeywords: string[];
    overusedKeywords: string[];
    underusedKeywords: string[];
  };

  // 8. Experience Analysis
  experience: {
    totalExperienceYears: number;
    relevantExperienceYears: number;
    hasInternshipExperience: boolean;
    hasLeadershipExperience: boolean;
    careerProgression: "Excellent" | "Good" | "Average" | "Poor";
    employmentGaps: boolean;
    jobStability: "High" | "Medium" | "Low";
    promotions: boolean;
    roleDiversity: "High" | "Medium" | "Low";
    industryRelevance: number; // 0-100
    experienceQualityScore: number; // 0-100
  };

  // 9. Project Analysis
  projectsList: {
    projectTitle: string;
    techStack: string[];
    complexity: "High" | "Medium" | "Low";
    innovation: "High" | "Medium" | "Low";
    businessImpact: "High" | "Medium" | "Low";
    realWorldRelevance: "High" | "Medium" | "Low";
    hasGitHubLink: boolean;
    hasLiveDemo: boolean;
    deploymentStatus: boolean;
    documentationQuality: "High" | "Medium" | "Low" | "None";
    quantifiedResults: boolean;
    technologiesUsed: string[];
    aiGeneratedContentDetection: boolean;
    projectRating: number; // 0-100
  }[];

  // 10. Education Analysis
  education: {
    degree: boolean;
    university: boolean;
    graduationYear: boolean;
    gpaCgpa: boolean;
    relevantCoursework: boolean;
    academicPerformance: "Excellent" | "Good" | "Average" | "Poor" | "Unknown";
    academicAchievements: boolean;
  };

  // 11. Certification Analysis
  certificationsList: {
    certificationName: string;
    industryRelevance: "High" | "Medium" | "Low";
    expiryStatus: "Valid" | "Expired" | "Unknown";
    certificationLevel: "Beginner" | "Intermediate" | "Advanced";
  }[];
  missingRecommendedCertifications: string[];

  // 12. Achievement Analysis
  achievements: {
    hasAwards: boolean;
    hasScholarships: boolean;
    hasHackathons: boolean;
    hasCodingCompetitions: boolean;
    hasOpenSourceContributions: boolean;
    hasResearchPapers: boolean;
    hasPublications: boolean;
    hasPatents: boolean;
    hasLeadershipAchievements: boolean;
  };

  // 13. Formatting Analysis
  formattingAnalysis: {
    resumeLength: "Too Short" | "Optimal" | "Too Long";
    whiteSpace: "Excellent" | "Good" | "Poor";
    margins: "Optimal" | "Suboptimal";
    alignment: "Consistent" | "Inconsistent";
    fontSize: "Appropriate" | "Inappropriate";
    fontConsistency: boolean;
    headingHierarchy: boolean;
    bulletPoints: boolean;
    visualConsistency: boolean;
    readability: number; // 0-100
    professionalAppearance: "Excellent" | "Good" | "Average" | "Poor";
    formattingScore: number; // 0-100
  };

  // 14. Writing Quality
  writingQuality: {
    grammar: number; // 0-100
    spelling: number;
    readability: number;
    passiveVoiceDetected: boolean;
    activeVoiceDominant: boolean;
    sentenceLength: "Optimal" | "Too Long" | "Too Short";
    actionVerbsScore: number;
    professionalToneScore: number;
    buzzwordsDetected: string[];
    repeatedWords: string[];
    weakWords: string[];
    strongActionWords: string[];
    rewrittenContentSuggestion: string;
  };

  // 15. Quantification Analysis
  quantification: {
    detectsPercentages: boolean;
    detectsRevenue: boolean;
    detectsPerformanceImprovements: boolean;
    detectsTimeSaved: boolean;
    detectsCostReduction: boolean;
    detectsUserGrowth: boolean;
    detectsTeamSize: boolean;
    detectsProductivityMetrics: boolean;
    bulletsLackingMeasurableImpact: string[];
  };

  // 16. ATS Red Flags
  atsRedFlagsList: {
    issue: string;
    severityLevel: "Critical" | "High" | "Medium" | "Low";
  }[];

  // 17. Strength Analysis
  strengths: {
    strongSkills: string[];
    strongProjects: string[];
    excellentExperience: boolean;
    leadership: boolean;
    quantifiedAchievements: boolean;
    atsFriendlyLayout: boolean;
    technicalExcellence: boolean;
    recruiterHighlights: string[];
  };

  // 18. Weakness Analysis
  weaknesses: {
    missingSkills: string[];
    weakSummary: boolean;
    lowKeywordMatch: boolean;
    poorFormatting: boolean;
    weakProjects: boolean;
    lackOfNumbers: boolean;
    missingCertifications: boolean;
    missingLeadership: boolean;
    weakTechnicalDepth: boolean;
  };

  // 19. Improvement Roadmap
  improvementRoadmap: {
    critical: { issue: string; reason: string; suggestedFix: string; expectedImpact: string; }[];
    highImpact: { issue: string; reason: string; suggestedFix: string; expectedImpact: string; }[];
    recommended: { issue: string; reason: string; suggestedFix: string; expectedImpact: string; }[];
  };

  // 20. Job Match Analysis
  jobMatch: {
    overallMatchPercentage: number;
    skillMatchPercentage: number;
    experienceMatchPercentage: number;
    educationMatchPercentage: number;
    responsibilityMatchPercentage: number;
    qualificationMatchPercentage: number;
    missingRequirements: string[];
    matchingKeywords: string[];
    missingKeywords: string[];
    aiSuggestionsToIncreaseMatch: string[];
  };

  // 21. Career Insights
  careerInsights: {
    bestMatchingRoles: string[];
    careerLevel: "Entry Level" | "Mid Level" | "Senior Level" | "Executive";
    industryFit: string[];
    expectedSalaryRange: string;
    hiringProbability: "High" | "Medium" | "Low";
    suitableCompanies: string[];
    skillGapAnalysis: string[];
    learningRecommendations: string[];
  };

  // 22. Resume Benchmarking
  benchmarking: {
    industryStandard: number;
    freshers: number;
    midLevelEngineers: number;
    seniorEngineers: number;
    top10PercentResumes: number;
    atsBenchmarks: number;
    percentileRanking: number; // 0-100
  };

  // 23. AI Optimization
  optimization: {
    improvedExperienceBulletPoints: string[];
    strongerProjectDescriptions: string[];
    betterActionVerbs: string[];
    resumeRewriteSuggestions: string[];
  };

  // 24. Recruiter Simulation
  recruiterSimulation: {
    firstImpressionScore: number;
    estimatedResumeReadingTimeSeconds: number;
    topStrengths: string[];
    topConcerns: string[];
    shortlistProbability: number; // 0-100
    interviewProbability: number; // 0-100
  };

  // 25. Final Verdict
  finalVerdict: {
    overallResumeGrade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
    atsReady: boolean;
    recruiterReady: boolean;
    jobReady: boolean;
    estimatedInterviewChance: number; // 0-100
    estimatedAtsPassChance: number; // 0-100
    confidenceScore: number; // 0-100
  };

  // Legacy format mappings required for the gamified dashboard to still work (AI Optimization Lab)
  overallScore: number;
  categoryScores: { content: number; formatting: number; grammar: number; keywords: number; impact: number; };
  checklist: { id: string; label: string; passed: boolean; detail: string; category: "content" | "formatting" | "grammar" | "keywords" | "impact"; }[];
  matchScore: { score: number; matchedKeywords: string[]; missingKeywords: string[]; } | null;
  bulletFeedback: { originalText: string; issue: string; suggestion: string; }[];
  hotspots: {
    exactText: string; // MUST EXACTLY MATCH substring in resume text!
    type: "grammar" | "weak_verb" | "missing_metric" | "formatting" | "vague_language";
    explanation: string;
    suggestion: string;
    confidence: number;
    difficulty: "Easy" | "Medium" | "Hard";
    estimatedAtsImprovement: number;
  }[];
}
`;

export function prepareInstructions({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) {
  return `You are an advanced futuristic AI Resume Scanning Core.
Your task is to scan EVERY SINGLE WORD of the provided resume text and generate a comprehensive, HIGHLY CRITICAL gamified report covering 25 detailed sections.

CRITICAL GRADING RULES:
1. BE EXTREMELY STRICT. Treat this like a ruthless ATS and senior hiring manager. 
2. DO NOT artificially inflate scores just to be nice. If the resume is mediocre, give it a C or D. If formatting is slightly off, deduct points severely.
3. Most resumes should score between 50-70. Only truly exceptional resumes with metrics, perfect formatting, and strong impact should score above 80.

Please analyze this resume and return a structured JSON response EXACTLY matching this TypeScript interface:

${AIResponseFormat}

Requirements:
1. For hotspots: Identify 5-10 "hotspots" which are exact text snippets from the resume that have issues (grammar, weak verbs, vague language, missing metrics). The 'exactText' field MUST PRECISELY MATCH A SUBSTRING IN THE USER'S RESUME. Do not paraphrase. The UI will crash if 'exactText' is not a perfect match.
2. For the 25 sections: Follow the interface perfectly. No extra fields, no missing fields. 
3. If no Job Description is provided (empty string), output default values for Job Match section and matchScore.
4. Job Title provided: "${jobTitle}"
5. Job Description provided: "${jobDescription}"

Return ONLY the raw JSON object, without any markdown formatting or backticks. Do not prepend or append any text. NEVER include the word json or any formatting characters.`;
}
