interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    imagePaths?: string[];
    resumePath: string;
    feedback: Feedback;
    signedThumbnailUrl?: string;
    signedResumeUrl?: string;
}

interface V1Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface V2Feedback {
    overallScore: number;
    categoryScores: {
        content: number;
        formatting: number;
        grammar: number;
        keywords: number;
        impact: number;
    };
    checklist: {
        id: string;
        label: string;
        passed: boolean;
        detail: string;
        category: "content" | "formatting" | "grammar" | "keywords" | "impact";
    }[];
    matchScore: {
        score: number;
        matchedKeywords: string[];
        missingKeywords: string[];
    } | null;
    bulletFeedback: {
        originalText: string;
        issue: string;
        suggestion: string;
    }[];
}

interface Feedback extends Partial<V1Feedback>, V2Feedback {}
