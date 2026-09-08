export type Role = 'trainee' | 'analyst' | 'operator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: Role;
  xp: number;
  level: number;
  completedLabs: string[];
  completedModules: string[];
  completedStages: string[];
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  category: 'lab' | 'academy' | 'framework' | 'special';
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  category: 'lab' | 'academy' | 'framework' | 'tool' | 'auth';
  details: string;
  timestamp: string;
}

export interface FrameworkStage {
  id: string;
  stepNumber: number;
  name: string;
  tagline: string;
  purpose: string;
  explanation?: string;
  authorizedUse: string;
  learningObjectives: string[];
  lectureContent?: {
    title: string;
    sections: { heading: string; body: string }[];
    keyTakeaways: string[];
  };
  recommendedTools?: {
    name: string;
    purpose: string;
    safeUsageNote: string;
  }[];
  practicalLabActivities?: string[];
  activities: string[];
  defensiveRelevance: string;
  safetyBoundaries: string[];
  realWorldExample: {
    title: string;
    scenario: string;
    offensivePerspective: string;
    defensiveMitigation: string;
  };
  interactiveExercise: {
    prompt: string;
    task: string;
    options?: string[];
    correctAnswerIndex?: number;
    explanation: string;
  };
  assessmentQuestions?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  durationMinutes: number;
  learningObjectives: string[];
  lectureContent: string;
  keyConcepts: { term: string; explanation: string }[];
  practicalExample: {
    scenario: string;
    codeOrDiagnostic?: string;
    takeaway: string;
  };
  securityNotes: string;
  summary: string;
}

export interface AcademyModule {
  id: string;
  number: number;
  title: string;
  category: string;
  estimatedMinutes: number;
  xpReward: number;
  summary: string;
  learningObjectives?: string[];
  lessons?: AcademyLesson[];
  // Legacy / backward-compat fields for existing components
  lesson?: {
    overview: string;
    coreConcepts: { title: string; content: string }[];
    defensiveMindset: string;
  };
  example?: {
    title: string;
    vulnerableSnippet?: string;
    hardenedSnippet?: string;
    language?: string;
    attackWalkthrough: string;
    defenseMechanism: string;
  };
  interactiveExercise?: {
    instructions: string;
    challengeType: 'select' | 'input' | 'patch';
    question: string;
    choices?: string[];
    correctAnswer: string | number;
    hint: string;
    solutionExplanation: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SecurityTool {
  id: string;
  name: string;
  category: 'recon' | 'scan' | 'vuln' | 'web' | 'password' | 'network' | 'defensive' | 'reporting';
  stageCategory: string;
  purpose: string;
  explanation: string;
  learningMaterial: string;
  demoType: string;
  cliEquivalent: string;
  tags: string[];
}

export interface CyberLab {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  xpReward: number;
  description: string;
  objectives: string[];
  scenario: string;
  targetEnvironment: string;
  labType: 'linux' | 'recon' | 'network' | 'web' | 'password' | 'headers' | 'incident' | 'vuln' | 'pentest';
  instructions?: string[];
  flag?: string;
  hint?: string;
  authorizationNotice?: string;
  challengeTasks?: {
    id: string;
    title: string;
    instruction: string;
    points: number;
  }[];
}

export type ViewTab = 'home' | 'dashboard' | 'framework' | 'training' | 'academy' | 'range' | 'tools' | 'about';
