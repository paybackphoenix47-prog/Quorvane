import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  Award, 
  Zap, 
  Terminal, 
  Shield, 
  Filter,
  Check,
  Code2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { ACADEMY_MODULES } from '../data/cyberContent';
import type { UserProfile } from '../types';
import { BackButton } from './BackButton';

interface AcademyViewProps {
  userProfile: UserProfile;
  selectedModuleId?: string;
  onCompleteModule: (moduleId: string, xpEarned: number) => void;
  onBackToHome?: () => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  userProfile,
  selectedModuleId,
  onCompleteModule,
  onBackToHome
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(
    selectedModuleId || ACADEMY_MODULES[0].id
  );
  const [activeStep, setActiveStep] = useState<'lesson' | 'example' | 'exercise' | 'quiz' | 'complete'>('lesson');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Exercise & Quiz states
  const [exerciseChoice, setExerciseChoice] = useState<number | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState<boolean>(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeModule = ACADEMY_MODULES.find((m) => m.id === activeModuleId) || ACADEMY_MODULES[0];
  const isCompleted = userProfile.completedModules.includes(activeModule.id);

  const categories = ['all', ...Array.from(new Set(ACADEMY_MODULES.map((m) => m.category)))];
  const filteredModules = categoryFilter === 'all'
    ? ACADEMY_MODULES
    : ACADEMY_MODULES.filter((m) => m.category === categoryFilter);

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setActiveStep('lesson');
    setExerciseChoice(null);
    setExerciseSubmitted(false);
    setQuizChoice(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (quizChoice === null) return;
    setQuizSubmitted(true);
    if (quizChoice === activeModule.quiz.correctIndex) {
      if (!isCompleted) {
        onCompleteModule(activeModule.id, activeModule.xpReward);
      }
      setActiveStep('complete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back to Home Navigation Button */}
      {onBackToHome && (
        <BackButton onBackToHome={onBackToHome} currentPageName="Cybersecurity Training Academy" />
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/90 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>DEFENSIVE CURRICULUM & THREAT DYNAMICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Cybersecurity Training Academy
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Engineered modules for defensive practitioners, red-team auditors, and security analysts. Master secure architecture, threat modeling, offensive vector breakdown, and verified code remediation.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#050b14]/90 border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Curriculum Completed</div>
              <div className="text-xl font-bold text-white flex items-center justify-end gap-1.5 font-mono">
                <span className="text-cyan-400">{userProfile.completedModules.length}</span>
                <span className="text-slate-600">/</span>
                <span>{ACADEMY_MODULES.length}</span>
                <span className="text-xs font-sans text-slate-400 ml-1">Modules</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#081b33] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Domain Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-[#050b14] text-slate-400 hover:bg-[#0c1a2e] hover:text-cyan-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Module Syllabus (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRAINING SYLLABUS ({filteredModules.length})</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {Math.round((userProfile.completedModules.length / ACADEMY_MODULES.length) * 100)}% DONE
            </span>
          </div>

          <div className="space-y-2">
            {filteredModules.map((mod) => {
              const isActive = activeModule.id === mod.id;
              const isDone = userProfile.completedModules.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  id={`academy-mod-${mod.number}`}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-[#08182b] text-white border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#060e1a] border-slate-800 hover:border-cyan-500/30 hover:bg-[#0a1526]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isDone
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : isActive
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-[#050b14] border border-slate-800 text-slate-400 group-hover:text-cyan-300'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : `0${mod.number}`}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-200'}`}>
                        {mod.title}
                      </div>
                      <div className={`text-[11px] flex items-center gap-2 mt-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                        <span className="font-mono text-[10px]">{mod.category}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span>{mod.estimatedMinutes}m</span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-cyan-400 font-mono font-bold">+{mod.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Module Multi-Step Experience (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Module Banner */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    MODULE 0{activeModule.number}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase">{activeModule.category}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeModule.title}
                </h2>
              </div>

              {isCompleted ? (
                <button
                  id={`btn-complete-module-${activeModule.id}`}
                  onClick={() => onCompleteModule(activeModule.id, activeModule.xpReward)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer hover:bg-cyan-500/25 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>COMPLETED (+{activeModule.xpReward} XP)</span>
                </button>
              ) : (
                <button
                  id={`btn-complete-module-${activeModule.id}`}
                  onClick={() => onCompleteModule(activeModule.id, activeModule.xpReward)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shrink-0 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MARK AS COMPLETE (+{activeModule.xpReward} XP)</span>
                </button>
              )}
            </div>

            {/* Stepper Navigation: Lesson -> Example -> Exercise -> Quiz -> Completion */}
            <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-[#040810] border border-slate-800 overflow-x-auto text-xs font-semibold">
              {[
                { id: 'lesson', label: '1. Lesson' },
                { id: 'example', label: '2. Code Walkthrough' },
                { id: 'exercise', label: '3. Hands-On Exercise' },
                { id: 'quiz', label: '4. Knowledge Quiz' },
                { id: 'complete', label: '5. Mastery' }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as any)}
                  className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    activeStep === step.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-[#0c192c]'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: LESSON */}
          {activeStep === 'lesson' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Overview & Threat Dynamics
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeModule.lesson.overview}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-white tracking-wide">
                  Core Architectural Concepts
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {activeModule.lesson.coreConcepts.map((concept, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 space-y-1">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        {concept.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-4">
                        {concept.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#08182b] border border-cyan-500/30">
                <div className="text-xs uppercase text-cyan-300 font-bold mb-1.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Defensive Mindset (Practitioner Rule)
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeModule.lesson.defensiveMindset}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="btn-academy-next-example"
                  onClick={() => setActiveStep('example')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <span>PROCEED TO CODE & ATTACK EXAMPLE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EXAMPLE */}
          {activeStep === 'example' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  {activeModule.example.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Compare vulnerable implementations with production-grade hardened code.
                </p>
              </div>

              {/* Code comparison */}
              {activeModule.example.vulnerableSnippet && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#140b0e] border border-rose-900/50">
                    <div className="text-xs text-rose-400 font-bold uppercase mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Vulnerable Implementation (Flawed Pattern)</span>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-[#050b14] border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto">
                      <code>{activeModule.example.vulnerableSnippet}</code>
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-[#04161a] border border-cyan-900/60">
                    <div className="text-xs text-cyan-400 font-bold uppercase mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>Hardened Implementation (Secure Pattern)</span>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-[#050b14] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      <code>{activeModule.example.hardenedSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800">
                  <div className="text-xs uppercase text-rose-400 font-bold mb-1">
                    Offensive Vector Walkthrough
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModule.example.attackWalkthrough}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800">
                  <div className="text-xs uppercase text-cyan-400 font-bold mb-1">
                    Defensive Mechanism & Root Fix
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModule.example.defenseMechanism}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep('lesson')}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#0a1526] cursor-pointer"
                >
                  &larr; Back to Lesson
                </button>
                <button
                  id="btn-academy-next-exercise"
                  onClick={() => setActiveStep('exercise')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <span>PROCEED TO HANDS-ON EXERCISE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: INTERACTIVE EXERCISE */}
          {activeStep === 'exercise' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase mb-1">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>HANDS-ON INTERACTIVE DEFENSIVE CHALLENGE</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeModule.interactiveExercise.question}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeModule.interactiveExercise.instructions}
                </p>
              </div>

              <div className="space-y-2.5">
                {activeModule.interactiveExercise.choices?.map((choice, idx) => {
                  const isSelected = exerciseChoice === idx;
                  const isCorrect = idx === activeModule.interactiveExercise.correctAnswer;

                  let style = 'bg-[#040810] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#08101e]';
                  if (isSelected && !exerciseSubmitted) {
                    style = 'bg-[#08182b] border-cyan-500 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]';
                  } else if (exerciseSubmitted) {
                    if (isCorrect) {
                      style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`exercise-choice-${idx}`}
                      onClick={() => {
                        if (!exerciseSubmitted) setExerciseChoice(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{choice}</span>
                    </button>
                  );
                })}
              </div>

              {!exerciseSubmitted ? (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400 italic">
                    Hint: {activeModule.interactiveExercise.hint}
                  </span>
                  <button
                    id="btn-submit-exercise"
                    onClick={() => {
                      if (exerciseChoice !== null) setExerciseSubmitted(true);
                    }}
                    disabled={exerciseChoice === null}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                  >
                    SUBMIT DEFENSIVE ACTION
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    {exerciseChoice === activeModule.interactiveExercise.correctAnswer ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        CORRECT REMEDIATION VERIFIED
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        DEFENSIVE DEFECT DETECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModule.interactiveExercise.solutionExplanation}
                  </p>

                  <div className="flex justify-end pt-2">
                    <button
                      id="btn-academy-next-quiz"
                      onClick={() => setActiveStep('quiz')}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      <span>PROCEED TO KNOWLEDGE CHECK QUIZ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: QUIZ */}
          {activeStep === 'quiz' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase mb-1">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>CERTIFICATION KNOWLEDGE CHECK</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeModule.quiz.question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {activeModule.quiz.options.map((opt, idx) => {
                  const isSelected = quizChoice === idx;
                  const isCorrect = idx === activeModule.quiz.correctIndex;

                  let style = 'bg-[#040810] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#08101e]';
                  if (isSelected && !quizSubmitted) {
                    style = 'bg-[#08182b] border-cyan-500 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]';
                  } else if (quizSubmitted) {
                    if (isCorrect) {
                      style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => {
                        if (!quizSubmitted) setQuizChoice(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <div className="flex justify-end pt-2">
                  <button
                    id="btn-submit-quiz"
                    onClick={handleQuizSubmit}
                    disabled={quizChoice === null}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                  >
                    SUBMIT ANSWERS & EARN XP
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    {quizChoice === activeModule.quiz.correctIndex ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        CERTIFIED CORRECT (+{activeModule.xpReward} XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        INCORRECT OPTION SELECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModule.quiz.explanation}
                  </p>

                  <div className="flex justify-end pt-2">
                    <button
                      id="btn-quiz-proceed-completion"
                      onClick={() => setActiveStep('complete')}
                      className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer hover:-translate-y-0.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    >
                      VIEW MODULE SUMMARY &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: COMPLETION */}
          {activeStep === 'complete' && (
            <div className="p-8 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#08182b] border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-xs uppercase text-cyan-400 tracking-widest font-bold">
                  MODULE MASTERED
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {activeModule.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have successfully internalized the core lesson, reviewed attack examples, executed the interactive challenge, and certified the knowledge quiz.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>+{activeModule.xpReward} XP Awarded to Operator Dossier</span>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    const nextMod = ACADEMY_MODULES.find((m) => m.number === activeModule.number + 1);
                    if (nextMod) handleSelectModule(nextMod.id);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  NEXT MODULE &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
