import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Shield, 
  CheckCircle2, 
  Lock, 
  Search, 
  Wifi, 
  Globe, 
  FileText, 
  Sliders,
  Check,
  Zap,
  Radio,
  ChevronRight,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { CYBER_LABS } from '../data/cyberContent';
import type { UserProfile } from '../types';
import { BackButton } from './BackButton';
import { QuorvaneTerminal } from './QuorvaneTerminal';

interface CyberRangeViewProps {
  userProfile: UserProfile;
  selectedLabId?: string;
  onCompleteLab: (labId: string, score: number) => void;
  onBackToHome?: () => void;
}

export const CyberRangeView: React.FC<CyberRangeViewProps> = ({
  userProfile,
  selectedLabId,
  onCompleteLab,
  onBackToHome
}) => {
  const [activeLabId, setActiveLabId] = useState<string>(
    selectedLabId || CYBER_LABS[0].id
  );

  const activeLab = CYBER_LABS.find((l) => l.id === activeLabId) || CYBER_LABS[0];
  const isCompleted = userProfile.completedLabs.includes(activeLab.id);

  // --- Lab 1: Password Lab States ---
  const [testPassword, setTestPassword] = useState('Admin2026!');
  const [saltEnabled, setSaltEnabled] = useState(true);

  const calcEntropy = (pwd: string) => {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
    if (pool === 0) return 0;
    return Math.round(pwd.length * (Math.log(pool) / Math.log(2)));
  };
  const entropy = calcEntropy(testPassword);

  // --- Lab 2: Recon Lab States ---
  const [reconTarget, setReconTarget] = useState('target-corp.internal');
  const [reconLog, setReconLog] = useState<string[]>([
    '[INIT] Querying public Certificate Transparency logs for target-corp.internal...',
    '[CT LOGS] Found: api.target-corp.internal (Issued: Let\'s Encrypt)',
    '[CT LOGS] Found: staging-db.target-corp.internal (EXPOSED INTERNAL INSTANCE)',
    '[DNS MX] Priority 10: mail.target-corp.internal (IP: 198.51.100.14)',
    '[DNS TXT] "v=spf1 include:_spf.google.com ip4:198.51.100.14 -all"'
  ]);

  // --- Lab 3: Network Scan Lab States ---
  const [scanPorts] = useState([
    { port: 21, service: 'FTP', state: 'Closed', banner: 'None' },
    { port: 22, service: 'SSH', state: 'Open', banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6' },
    { port: 25, service: 'SMTP', state: 'Filtered', banner: 'Firewall Drop' },
    { port: 80, service: 'HTTP', state: 'Open', banner: 'nginx/1.24.0 (Ubuntu)' },
    { port: 443, service: 'HTTPS', state: 'Open', banner: 'TLSv1.3 TLS_AES_256_GCM_SHA384' },
    { port: 3306, service: 'MySQL', state: 'Filtered', banner: 'Packet Dropped by iptables' },
    { port: 8080, service: 'HTTP-Proxy', state: 'Closed', banner: 'TCP RST Received' }
  ]);
  const [isScanning, setIsScanning] = useState(false);

  // --- Lab 4: Vulnerability Lab States ---
  const [cvssAV, setCvssAV] = useState<'N' | 'A' | 'L' | 'P'>('N');
  const [cvssPR, setCvssPR] = useState<'N' | 'L' | 'H'>('N');
  const [cvssImpact, setCvssImpact] = useState<'H' | 'L' | 'N'>('H');

  const calcCvssScore = () => {
    let score = 5.0;
    if (cvssAV === 'N') score += 2.5;
    else if (cvssAV === 'A') score += 1.5;
    else if (cvssAV === 'L') score += 0.8;

    if (cvssPR === 'N') score += 1.5;
    else if (cvssPR === 'L') score += 0.5;

    if (cvssImpact === 'H') score += 1.0;
    else if (cvssImpact === 'N') score -= 2.0;

    return Math.min(Math.round(score * 10) / 10, 10.0);
  };

  // --- Lab 5: Web Security Lab States ---
  const [inputSQLi, setInputSQLi] = useState("' OR '1'='1");
  const [useParameterized, setUseParameterized] = useState(false);
  const [sqliResult, setSqliResult] = useState<string | null>(null);

  const testSQLi = () => {
    if (useParameterized) {
      setSqliResult('SAFE: Parameterized prepared statement parsed input as string literal. 0 records matched. Authentication blocked.');
    } else {
      setSqliResult('VULNERABLE: Direct string interpolation executed `WHERE user = \'\' OR \'1\'=\'1\'`. Authentication BYPASSED! Admin session initialized.');
    }
  };

  // --- Lab 6: Pentest Workflow Lab States ---
  const [pentestStage, setPentestStage] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back to Home Navigation Button */}
      {onBackToHome && (
        <BackButton onBackToHome={onBackToHome} currentPageName="Cyber Range Simulation" />
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081220]/90 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>ISOLATED SIMULATED THREAT SANDBOXES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              QUORVANE Cyber Range
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Execute hands-on offensive and defensive exercises on synthetic sandbox targets. Safe, isolated, 100% authorized simulation telemetry designed for real-world practitioner mastery.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#050b14]/90 border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Labs Mastered</div>
              <div className="text-xl font-bold text-white flex items-center justify-end gap-1.5 font-mono">
                <span className="text-cyan-400">{userProfile.completedLabs.length}</span>
                <span className="text-slate-600">/</span>
                <span>{CYBER_LABS.length}</span>
                <span className="text-xs font-sans text-slate-400 ml-1">Labs</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#081b33] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-5 p-3 rounded-xl bg-[#050b14] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AUTHORIZED TRAINING ENVIRONMENT ONLY</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Synthetic sandbox telemetry. All tools run client-side in containment.
          </span>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Lab Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>AVAILABLE SANDBOX LABS</span>
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              {userProfile.completedLabs.length}/{CYBER_LABS.length}
            </span>
          </div>

          <div className="space-y-2">
            {CYBER_LABS.map((lab) => {
              const isActive = activeLab.id === lab.id;
              const isDone = userProfile.completedLabs.includes(lab.id);

              return (
                <button
                  key={lab.id}
                  id={`cyber-lab-btn-${lab.id}`}
                  onClick={() => setActiveLabId(lab.id)}
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
                      {isDone ? <Check className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-200'}`}>
                        {lab.title}
                      </div>
                      <div className={`text-[11px] flex items-center gap-2 mt-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                        <span className="font-mono text-[10px]">{lab.category}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span>{lab.difficulty}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-cyan-400 font-mono font-bold">+{lab.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Lab Operational Workbench (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Lab Header */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    TARGET: {activeLab.targetEnvironment}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs font-semibold text-slate-400">{activeLab.difficulty}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeLab.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeLab.scenario}
                </p>
              </div>

              <button
                id={`btn-complete-lab-${activeLab.id}`}
                onClick={() => onCompleteLab(activeLab.id, activeLab.xpReward)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-extrabold hover:-translate-y-0.5'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'LAB CLEARED (+XP SAVED)' : 'SUBMIT LAB OBJECTIVE'}</span>
              </button>
            </div>

            {/* Objectives */}
            <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90">
              <span className="text-xs uppercase text-cyan-400 font-bold block mb-2">
                LAB OBJECTIVES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                {activeLab.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LAB 1: PASSWORD LAB WORKBENCH */}
          {activeLab.labType === 'password' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  ENTROPY & HASH CRACKING BENCHMARK
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Input Password to Benchmark:
                </label>
                <input
                  type="text"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-sm font-mono text-white outline-none transition-all"
                />
              </div>

              {/* Entropy & Crack time telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-center">
                  <div className="text-slate-400 mb-1 font-medium">Shannon Entropy</div>
                  <div className={`text-xl font-mono font-extrabold ${entropy < 40 ? 'text-rose-400' : entropy < 65 ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {entropy} bits
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {entropy < 40 ? 'Critically Weak' : entropy < 65 ? 'Moderate Strength' : 'Cryptographically Strong'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-center">
                  <div className="text-slate-400 mb-1 font-medium">MD5 8x RTX 4090 GPU Crack</div>
                  <div className="text-xl font-mono font-extrabold text-rose-400">
                    {entropy < 45 ? '< 1.4 seconds' : entropy < 70 ? '4.2 hours' : '18 days'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">@ 120 Billion guesses/sec</div>
                </div>

                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-center">
                  <div className="text-slate-400 mb-1 font-medium">Argon2id Memory-Hard Crack</div>
                  <div className="text-xl font-mono font-extrabold text-cyan-400">
                    {entropy < 45 ? '12 minutes' : '3,800+ years'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">64MB RAM memory-hard cost</div>
                </div>
              </div>

              {/* Salt Demonstrator */}
              <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Cryptographic Salt Comparison:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saltEnabled}
                      onChange={(e) => setSaltEnabled(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-slate-300 font-medium">Enable 128-bit Random Salt</span>
                  </label>
                </div>

                <div className="p-3.5 rounded-lg bg-[#02050a] border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div>Simulated User A Hash: <span className="text-cyan-300">{saltEnabled ? 'e9b72f108a3d4... [SALT: 0x9f4a]' : '5d41402abc4b2a76b9719d911017c592'}</span></div>
                  <div>Simulated User B Hash: <span className="text-cyan-300">{saltEnabled ? '7c14a29d81e01... [SALT: 0x2b8c]' : '5d41402abc4b2a76b9719d911017c592 (COLLISION!)'}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: RECONNAISSANCE LAB */}
          {activeLab.labType === 'recon' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  PASSIVE OSINT & CERTIFICATE LOG HARVESTER
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={reconTarget}
                  onChange={(e) => setReconTarget(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={() => {
                    setReconLog((prev) => [
                      ...prev,
                      `[QUERY] Re-scanning Certificate Transparency logs for ${reconTarget}...`,
                      `[FOUND] dev-vpn.${reconTarget} (Port 443 active)`,
                      `[DNS] MX record discovered: priority 5 cluster.${reconTarget}`
                    ]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  DISCOVER SUBDOMAINS
                </button>
              </div>

              {/* Recon Output Terminal */}
              <div className="p-4 rounded-xl bg-[#02050a] border border-slate-800 font-mono text-xs space-y-1.5 h-48 overflow-y-auto text-slate-300">
                {reconLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={log.includes('EXPOSED') ? 'text-rose-400 font-bold' : log.includes('FOUND') ? 'text-cyan-300' : 'text-slate-400'}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LAB 3: NETWORK SCANNING LAB */}
          {activeLab.labType === 'network' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  SYN STEALTH PORT SCANNER & FIREWALL SIMULATOR
                </h3>
                <button
                  onClick={() => {
                    setIsScanning(true);
                    setTimeout(() => setIsScanning(false), 1200);
                  }}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  {isScanning ? 'TRANSMITTING SYN PROBES...' : 'EXECUTE TCP SYN SWEEP'}
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#040810] text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-3">PORT</th>
                      <th className="p-3">SERVICE</th>
                      <th className="p-3">STATE</th>
                      <th className="p-3">VERSION BANNER DISCLOSURE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {scanPorts.map((p) => (
                      <tr key={p.port} className="hover:bg-[#08182b]/40">
                        <td className="p-3 font-mono font-bold text-white">{p.port}/TCP</td>
                        <td className="p-3">{p.service}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.state === 'Open' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40' :
                            p.state === 'Filtered' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                            'bg-[#050b14] text-slate-400'
                          }`}>
                            {p.state}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400 truncate max-w-xs">{p.banner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LAB 4: VULNERABILITY CVSS LAB */}
          {activeLab.labType === 'vuln' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  CVSS v3.1 BASE VECTOR CALCULATOR & SCORER
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Attack Vector (AV):</label>
                  <select
                    value={cvssAV}
                    onChange={(e) => setCvssAV(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#040810] border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="N">Network (Remote Internet)</option>
                    <option value="A">Adjacent Network (LAN)</option>
                    <option value="L">Local Machine</option>
                    <option value="P">Physical Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Privileges Required (PR):</label>
                  <select
                    value={cvssPR}
                    onChange={(e) => setCvssPR(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#040810] border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="N">None (Unauthenticated)</option>
                    <option value="L">Low (Standard User)</option>
                    <option value="H">High (Administrator)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Impact (Confidentiality/Integrity):</label>
                  <select
                    value={cvssImpact}
                    onChange={(e) => setCvssImpact(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#040810] border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="H">High (Total System Takeover)</option>
                    <option value="L">Low (Partial Non-Critical Read)</option>
                    <option value="N">None (No Impact)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#040810] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Calculated CVSS v3.1 Base Score:</div>
                  <div className="text-3xl font-mono font-extrabold text-rose-400 mt-0.5">{calcCvssScore()} / 10.0</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium mb-1">Triage Priority:</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    calcCvssScore() >= 9.0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                    calcCvssScore() >= 7.0 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                    'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {calcCvssScore() >= 9.0 ? 'CRITICAL - IMMEDIATE FIX' : calcCvssScore() >= 7.0 ? 'HIGH SEVERITY' : 'MEDIUM SEVERITY'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LAB 5: WEB SECURITY LAB (SQLi & XSS) */}
          {activeLab.labType === 'web' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  SQL INJECTION & DEFENSIVE PARAMETERIZATION BENCH
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Simulated User Login Input:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputSQLi}
                    onChange={(e) => setInputSQLi(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={testSQLi}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                  >
                    SEND TEST PAYLOAD
                  </button>
                </div>

                <label className="flex items-center gap-2 p-3.5 rounded-xl bg-[#040810] border border-slate-800 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={useParameterized}
                    onChange={(e) => setUseParameterized(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="font-medium">Engage Defensive Control: Parameterized Prepared Statements (db.query(sql, [params]))</span>
                </label>

                {sqliResult && (
                  <div className={`p-4 rounded-xl text-xs font-medium ${
                    sqliResult.startsWith('SAFE')
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}>
                    {sqliResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LAB 6: PENTEST WORKFLOW LAB */}
          {activeLab.labType === 'pentest' && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  END-TO-END AUDIT ENGAGEMENT LIFECYCLE
                </h3>
                <span className="text-xs font-mono font-semibold text-cyan-400">Step {pentestStage} of 4</span>
              </div>

              <div className="p-5 rounded-xl bg-[#040810] border border-slate-800 text-xs space-y-3">
                {pentestStage === 1 && (
                  <>
                    <div className="text-cyan-400 font-bold uppercase">1. Scoping Contract & Rules of Engagement:</div>
                    <p className="text-slate-300 leading-relaxed">
                      You are contracted by FinTech Corp. In-scope target: 198.51.100.0/28. Excluded: Production payment gateway at 198.51.100.15.
                    </p>
                    <button
                      onClick={() => setPentestStage(2)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      SIGN RULES OF ENGAGEMENT CONTRACT &rarr;
                    </button>
                  </>
                )}

                {pentestStage === 2 && (
                  <>
                    <div className="text-white font-bold uppercase">2. Vulnerability Verification:</div>
                    <p className="text-slate-300 leading-relaxed">
                      Discovery reveals an unauthenticated debug endpoint on port 8080 exposing internal stack traces and environment credentials.
                    </p>
                    <button
                      onClick={() => setPentestStage(3)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      EXECUTE SAFE READ-ONLY CANARY PROOF &rarr;
                    </button>
                  </>
                )}

                {pentestStage === 3 && (
                  <>
                    <div className="text-amber-300 font-bold uppercase">3. Artifact Cleanup Audit:</div>
                    <p className="text-slate-300 leading-relaxed">
                      Purging all test sessions, verifying no residual audit files or elevated test keys remain on remote sandbox instances.
                    </p>
                    <button
                      onClick={() => setPentestStage(4)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wider transition-all shadow-xs mt-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      CERTIFY CLEANUP RESTORATION &rarr;
                    </button>
                  </>
                )}

                {pentestStage === 4 && (
                  <>
                    <div className="text-cyan-400 font-bold uppercase">4. Deliver Executive Remediation Report:</div>
                    <p className="text-slate-300 leading-relaxed">
                      Executive summary delivered to CISO. Structured remediation roadmap assigned with re-test scheduled in 14 business days.
                    </p>
                    <button
                      onClick={() => onCompleteLab(activeLab.id, activeLab.xpReward)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      FINALIZE ENGAGEMENT & CLAIM +350 XP
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {/* Interactive Operator CLI Terminal Enclave */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE LAB CLI CONSOLE (AUTHORIZED TOOLS ENCLAVE)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Target: {activeLab.targetEnvironment}
              </span>
            </div>
            <QuorvaneTerminal
              contextTarget={activeLab.targetEnvironment || 'target-corp.internal'}
              heightClass="h-[340px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
