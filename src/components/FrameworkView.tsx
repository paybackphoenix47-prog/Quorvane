import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  Info, 
  Check, 
  Wrench, 
  Layers, 
  Terminal, 
  ExternalLink 
} from 'lucide-react';
import { FRAMEWORK_STAGES } from '../data/cyberContent';
import type { UserProfile } from '../types';
import { BackButton } from './BackButton';
import { FrameworkStageTools } from './FrameworkStageTools';

interface FrameworkViewProps {
  userProfile: UserProfile;
  selectedStageId?: string;
  onToggleCompleteStage: (stageId: string) => void;
  onBackToHome?: () => void;
}

export const FrameworkView: React.FC<FrameworkViewProps> = ({
  userProfile,
  selectedStageId,
  onToggleCompleteStage,
  onBackToHome
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(
    selectedStageId || FRAMEWORK_STAGES[0].id
  );
  const [stageTab, setStageTab] = useState<'tools' | 'methodology' | 'checkpoint'>('tools');
  const [selectedExerciseOption, setSelectedExerciseOption] = useState<number | null>(null);
  const [exerciseSubmitted, setExerciseSubmitted] = useState<boolean>(false);

  const activeStage = FRAMEWORK_STAGES.find((s) => s.id === activeStageId) || FRAMEWORK_STAGES[0];
  const isCompleted = userProfile.completedStages.includes(activeStage.id);

  const handleStageSelect = (id: string) => {
    setActiveStageId(id);
    setSelectedExerciseOption(null);
    setExerciseSubmitted(false);
  };

  const handleExerciseSubmit = () => {
    if (selectedExerciseOption === null) return;
    setExerciseSubmitted(true);
    if (
      selectedExerciseOption === activeStage.interactiveExercise.correctAnswerIndex &&
      !isCompleted
    ) {
      onToggleCompleteStage(activeStage.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back to Home Navigation Button */}
      {onBackToHome && (
        <BackButton onBackToHome={onBackToHome} currentPageName="Methodology Framework" />
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/90 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>CORE OPERATIONAL METHODOLOGY &amp; WORKING SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ethical Hacking Framework <span className="text-cyan-400 font-mono">(7 Stages)</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              The professional lifecycle of ethical security auditing. Each stage integrates foundational methodology, authorized boundaries, real-world case studies, and live working security utilities.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#050b14]/90 border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Framework Progress</div>
              <div className="text-xl font-bold text-white flex items-center justify-end gap-1.5 font-mono">
                <span className="text-cyan-400">{userProfile.completedStages.length}</span>
                <span className="text-slate-600">/</span>
                <span>{FRAMEWORK_STAGES.length}</span>
                <span className="text-xs font-sans text-slate-400 ml-1">Stages</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#081b33] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 7-Stage Sequence Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-300">Methodology Sequence</span>
            <span className="font-mono text-cyan-400">
              {Math.round((userProfile.completedStages.length / 7) * 100)}% Mastered
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {FRAMEWORK_STAGES.map((s) => {
              const done = userProfile.completedStages.includes(s.id);
              const isCurr = s.id === activeStageId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStageSelect(s.id)}
                  title={`Stage ${s.stepNumber}: ${s.name}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    done
                      ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                      : isCurr
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 7-Stage Grid Cards Overview (Quick-Switch Matrix) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {FRAMEWORK_STAGES.map((stage) => {
          const isActive = activeStage.id === stage.id;
          const isDone = userProfile.completedStages.includes(stage.id);

          return (
            <button
              key={stage.id}
              id={`stage-card-${stage.stepNumber}`}
              onClick={() => handleStageSelect(stage.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'bg-[#08182b] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/50'
                  : 'bg-[#060e1a] border-slate-800/90 hover:border-cyan-500/40 hover:bg-[#0a1526]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                      isDone
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : isActive
                        ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-[#050b14] border border-slate-800 text-slate-400 group-hover:text-cyan-300'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : `0${stage.stepNumber}`}
                  </div>

                  {isDone ? (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">
                      Stage 0{stage.stepNumber}
                    </span>
                  )}
                </div>

                <div className={`text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-200'}`}>
                  {stage.name}
                </div>
              </div>

              {/* Tools chip summary */}
              {stage.recommendedTools && stage.recommendedTools.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[10px] text-cyan-400/80 font-mono truncate">
                  <Wrench className="w-2.5 h-2.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{stage.recommendedTools[0].name}</span>
                  {stage.recommendedTools.length > 1 && (
                    <span className="text-slate-500 text-[9px]">+{stage.recommendedTools.length - 1}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Detailed Inspection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stage Stepper & Quick Jump (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Methodology Sequence</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">STAGE {activeStage.stepNumber} / 07</span>
          </div>

          <div className="space-y-2">
            {FRAMEWORK_STAGES.map((stage) => {
              const isActive = activeStage.id === stage.id;
              const isDone = userProfile.completedStages.includes(stage.id);

              return (
                <button
                  key={stage.id}
                  id={`framework-stage-btn-${stage.stepNumber}`}
                  onClick={() => handleStageSelect(stage.id)}
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
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : isActive
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-[#050b14] border border-slate-800 text-slate-400 group-hover:text-cyan-300'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : `0${stage.stepNumber}`}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-200'}`}>
                        {stage.name}
                      </div>
                      <div className={`text-[11px] truncate ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {stage.tagline}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Stage Content & Interactive Experience (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Stage Banner Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    STAGE 0{activeStage.stepNumber} OF 07
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs font-semibold text-slate-400">Core Methodology</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {activeStage.name}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-cyan-300/90 mt-1">
                  {activeStage.tagline}
                </p>
              </div>

              <button
                id={`btn-toggle-stage-${activeStage.id}`}
                onClick={() => onToggleCompleteStage(activeStage.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-extrabold hover:-translate-y-0.5'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'STAGE COMPLETED (+100 XP)' : 'MARK AS MASTERED'}</span>
              </button>
            </div>

            {/* Stage Inner Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#040810] border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setStageTab('tools')}
                className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  stageTab === 'tools'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c1a2e]'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Working Tools (Stage 0{activeStage.stepNumber})</span>
              </button>
              <button
                onClick={() => setStageTab('methodology')}
                className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  stageTab === 'methodology'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c1a2e]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Methodology &amp; Details</span>
              </button>
              <button
                onClick={() => setStageTab('checkpoint')}
                className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  stageTab === 'checkpoint'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c1a2e]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Stage Checkpoint</span>
              </button>
            </div>
          </div>

          {/* TAB 1: WORKING TOOLS SUITE */}
          {stageTab === 'tools' && (
            <FrameworkStageTools stageId={activeStage.id} stageNumber={activeStage.stepNumber} />
          )}

          {/* TAB 2: METHODOLOGY & CASE STUDY */}
          {stageTab === 'methodology' && (
            <div className="space-y-6">
              {/* Purpose & Authorized Protocol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#060e1a] border border-slate-800/90">
                  <div className="text-xs uppercase text-slate-200 font-bold mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Stage Purpose
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStage.purpose}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#060e1a] border border-slate-800/90">
                  <div className="text-xs uppercase text-slate-200 font-bold mb-1.5 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Authorized Protocol
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStage.authorizedUse}
                  </p>
                </div>
              </div>

              {/* Defensive Relevance Highlight */}
              <div className="p-4 rounded-xl bg-[#08182b] border border-cyan-500/30">
                <div className="text-xs uppercase text-cyan-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Defensive Relevance (Why Defenders Must Master This)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStage.defensiveRelevance}
                </p>
              </div>

              {/* Operational Activities & Learning Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm">
                  <h3 className="text-xs font-bold uppercase text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Operational Activities
                  </h3>
                  <ul className="space-y-2">
                    {activeStage.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">&bull;</span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm">
                  <h3 className="text-xs font-bold uppercase text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {activeStage.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="text-slate-500 font-bold">&bull;</span>
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Safety Boundaries */}
              <div className="p-5 rounded-2xl bg-[#0d121c] border border-amber-900/40 shadow-sm">
                <h3 className="text-xs font-bold uppercase text-amber-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Safety Boundaries &amp; Compliance Thresholds
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeStage.safetyBoundaries.map((b, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#060b14] border border-amber-900/30 text-xs text-slate-300">
                      <span className="text-amber-400 font-mono font-bold block mb-1">BOUNDARY 0{i + 1}</span>
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-World Case Study / Example */}
              <div className="p-5 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm">
                <h3 className="text-xs font-bold uppercase text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Real-World Case Study: {activeStage.realWorldExample.title}
                </h3>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {activeStage.realWorldExample.scenario}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#140b0e] border border-rose-900/40 text-slate-300">
                    <span className="text-rose-400 font-bold block mb-1">Adversary Tactic:</span>
                    <span className="leading-relaxed">{activeStage.realWorldExample.offensivePerspective}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#06151e] border border-cyan-900/50 text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">Defensive Countermeasure:</span>
                    <span className="leading-relaxed">{activeStage.realWorldExample.defensiveMitigation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAGE CHECKPOINT */}
          {stageTab === 'checkpoint' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    INTERACTIVE STAGE CHECKPOINT
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  +50 XP ON CORRECT CHOICE
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                <strong className="text-white">Situation:</strong> {activeStage.interactiveExercise.prompt}
              </p>
              <p className="text-xs text-white font-bold mb-4">
                {activeStage.interactiveExercise.task}
              </p>

              <div className="space-y-2.5">
                {activeStage.interactiveExercise.options?.map((opt, idx) => {
                  const isSelected = selectedExerciseOption === idx;
                  const isCorrect = idx === activeStage.interactiveExercise.correctAnswerIndex;

                  let btnStyles = 'bg-[#040810] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#08101e]';
                  if (isSelected && !exerciseSubmitted) {
                    btnStyles = 'bg-[#08182b] border-cyan-500 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]';
                  } else if (exerciseSubmitted) {
                    if (isCorrect) {
                      btnStyles = 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyles = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`framework-option-${idx}`}
                      onClick={() => {
                        if (!exerciseSubmitted) setSelectedExerciseOption(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyles}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!exerciseSubmitted ? (
                <button
                  id="btn-submit-framework-checkpoint"
                  onClick={handleExerciseSubmit}
                  disabled={selectedExerciseOption === null}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  SUBMIT OPERATIONAL DECISION
                </button>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-[#040810] border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedExerciseOption === activeStage.interactiveExercise.correctAnswerIndex ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        CORRECT DEFENSIVE PROTOCOL VERIFIED
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        PROTOCOL VIOLATION IDENTIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeStage.interactiveExercise.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
