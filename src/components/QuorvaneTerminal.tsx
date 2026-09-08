import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  CornerDownLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: string;
}

interface QuorvaneTerminalProps {
  initialPrompt?: string;
  initialHistory?: string[];
  contextTarget?: string;
  className?: string;
  heightClass?: string;
  onExecuteCommand?: (cmd: string) => void;
}

export const QuorvaneTerminal: React.FC<QuorvaneTerminalProps> = ({
  initialPrompt = 'student@quorvane',
  initialHistory,
  contextTarget = 'target-corp.internal',
  className = '',
  heightClass = 'min-h-[360px] max-h-[480px]',
  onExecuteCommand
}) => {
  const [entries, setEntries] = useState<TerminalEntry[]>(() => {
    const defaultWelcome: TerminalEntry[] = [
      {
        id: 'init-1',
        type: 'info',
        content: `QUORVANE SEC-WORKSTATION v4.2 [Kernel 6.8.0-kali-amd64]\nType 'help' to see authorized cybersecurity commands.\nAuthorized Target Enclave: ${contextTarget} [10.10.10.10]`,
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    if (initialHistory && initialHistory.length > 0) {
      initialHistory.forEach((item, idx) => {
        defaultWelcome.push({
          id: `hist-${idx}`,
          type: 'output',
          content: item,
          timestamp: new Date().toLocaleTimeString()
        });
      });
    }
    return defaultWelcome;
  });

  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'help',
    `whois ${contextTarget}`,
    `nmap -sV ${contextTarget}`,
    `dig ${contextTarget} ANY`,
    'cve CVE-2021-44228'
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const [currentDir, setCurrentDir] = useState('~/labs');
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom whenever output changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const addEntry = (type: TerminalEntry['type'], content: string) => {
    const newEntry: TerminalEntry = {
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const handleCopyAll = () => {
    const fullText = entries
      .map((e) => (e.type === 'input' ? `${initialPrompt}:${currentDir}$ ${e.content}` : e.content))
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setEntries([
      {
        id: 'cleared-' + Date.now(),
        type: 'info',
        content: `Terminal buffer cleared. Active session: ${initialPrompt}:${currentDir}$`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    // Record in command history
    setCommandHistory((prev) => [raw, ...prev.filter((c) => c !== raw)]);
    setHistoryIndex(-1);

    // Echo input
    addEntry('input', raw);

    if (onExecuteCommand) {
      onExecuteCommand(raw);
    }

    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    switch (cmd) {
      case 'help': {
        const topic = args[0]?.toLowerCase();
        if (topic === 'nmap') {
          addEntry('info', 
`NMAP SYNTAX & OPTIONS (QUORVANE Enclave):
  nmap [options] <target>
  Examples:
    nmap 10.10.10.10              - Fast SYN port sweep (standard ports)
    nmap -sV 10.10.10.10          - Probe open ports for service version info
    nmap -p 22,80,443 10.10.10.10 - Scan explicit ports
    nmap -sC -sV target-corp.internal - Run default vulnerability verification scripts
Authorized targets: 10.10.10.10, 10.10.10.15, 10.10.10.25, target-corp.internal, localhost`);
        } else if (topic === 'whois') {
          addEntry('info',
`WHOIS SYNTAX:
  whois <domain>
  Examples:
    whois target-corp.internal
    whois quorvane.sec
    whois example.com`);
        } else {
          addEntry('info', 
`QUORVANE CYBERSECURITY WORKSTATION - COMMAND MANUAL:
  help [cmd]           Display this help manual (or topic: help nmap, help whois)
  clear                Clear terminal output screen
  history              List previously executed commands
  whoami               Display current user identity & privilege level
  pwd                  Print working directory
  ls [path]            List directory contents
  cd [path]            Change current directory (cd labs, cd reports, cd ~)
  cat <file>           Display contents of file (e.g. cat notes.txt, cat /etc/hosts)
  echo <text>          Print text to standard output
  date                 Display current UTC and local timestamps
  whois <domain>       Query domain registration & registrar records
  dig <domain> [type]  Query DNS records (A, AAAA, MX, TXT, SPF, NS, SOA)
  nslookup <domain>    Resolve hostnames and IP addresses
  nmap [flags] <host>  Network exploration tool and security / port scanner
  curl -I <url>        Retrieve HTTP response headers & security flags
  cve <CVE-ID>         Query Common Vulnerabilities and Exposures database
  cvss <vector>        Calculate CVSS v3.1 base score from vector string
  subfinder -d <dom>   Simulate passive subdomain enumeration
  ping -c <n> <host>   Send ICMP ECHO_REQUEST packets to verify reachability`);
        }
        break;
      }

      case 'clear':
        handleClear();
        break;

      case 'history': {
        const histText = commandHistory
          .slice(0, 15)
          .map((c, i) => `  ${i + 1}  ${c}`)
          .join('\n');
        addEntry('output', histText || 'No command history available.');
        break;
      }

      case 'whoami':
        addEntry('success', 'operator (UID: 1001, GID: 1001) · Clearance: Certified Security Analyst [Level 2]');
        break;

      case 'pwd':
        addEntry('output', `/home/student/${currentDir.replace('~/', '')}`);
        break;

      case 'ls': {
        const targetDir = args[0] || currentDir;
        if (targetDir.includes('report') || currentDir.includes('report')) {
          addEntry('output',
`total 32K
-rw-r--r-- 1 operator sec 4.2K Sep 08 07:15 executive_summary.md
-rw-r--r-- 1 operator sec 8.6K Sep 08 07:22 vulnerability_matrix.csv
-rw-r--r-- 1 operator sec 1.8K Sep 08 07:30 remediation_roadmap.json
-r--r--r-- 1 operator sec 2.1K Sep 08 07:31 cvss_score_worksheet.txt`);
        } else if (targetDir.includes('wordlist') || currentDir.includes('wordlist')) {
          addEntry('output',
`total 64M
-rw-r--r-- 1 operator sec  14M Sep 08 07:00 rockyou-filtered.txt
-rw-r--r-- 1 operator sec 2.4M Sep 08 07:00 common-subdomains-top5000.txt
-rw-r--r-- 1 operator sec 512K Sep 08 07:00 api-endpoints.txt
-rw-r--r-- 1 operator sec 850K Sep 08 07:00 sqli-bypass-vectors.txt`);
        } else {
          addEntry('output',
`total 48K
drwxr-xr-x 2 operator sec 4.0K Sep 08 07:00 labs/
drwxr-xr-x 2 operator sec 4.0K Sep 08 07:05 reports/
drwxr-xr-x 2 operator sec 4.0K Sep 08 07:10 wordlists/
-rw-r--r-- 1 operator sec  642 Sep 08 07:12 notes.txt
-rw-r--r-- 1 operator sec  285 Sep 08 07:14 targets.txt
-rwxr-xr-x 1 operator sec 1.2K Sep 08 07:15 recon_scan.sh*`);
        }
        break;
      }

      case 'cd': {
        const path = args[0] || '~';
        if (path === '..' || path === '../') {
          setCurrentDir('~');
          addEntry('output', '');
        } else if (path === 'labs' || path === '~/labs') {
          setCurrentDir('~/labs');
          addEntry('output', '');
        } else if (path === 'reports' || path === '~/reports') {
          setCurrentDir('~/reports');
          addEntry('output', '');
        } else if (path === 'wordlists' || path === '~/wordlists') {
          setCurrentDir('~/wordlists');
          addEntry('output', '');
        } else if (path === '~' || path === '/') {
          setCurrentDir('~');
          addEntry('output', '');
        } else {
          addEntry('error', `bash: cd: ${path}: No such file or directory`);
        }
        break;
      }

      case 'cat': {
        const file = args[0];
        if (!file) {
          addEntry('error', 'cat: missing file operand');
        } else if (file === 'notes.txt') {
          addEntry('output',
`[QUORVANE ENGAGEMENT NOTES - AUTHORIZED AUDIT]
Scope: target-corp.internal (10.10.10.10)
Stage: 01 Recon & 02 Enumeration
Findings:
  - SSH (22) running OpenSSH 8.9p1 with publickey authentication
  - HTTP (80) redirects to HTTPS (443)
  - TLS 1.3 enabled, certificate valid for *.target-corp.internal
  - API endpoint identified at /api/v1/auth/login
  - Unauthenticated access denied with 401 Unauthorized`);
        } else if (file === 'targets.txt') {
          addEntry('output',
`10.10.10.10      target-corp.internal      Primary Enterprise Web Application
10.10.10.15      corp-vault.internal       Secure Microservice & Asset Store
10.10.10.25      db-prod.internal          PostgreSQL 15 Database (Internal Only)
127.0.0.1        localhost                 Local Sandbox Loopback`);
        } else if (file === '/etc/hosts') {
          addEntry('output',
`127.0.0.1       localhost
10.10.10.10     target-corp.internal www.target-corp.internal
10.10.10.15     corp-vault.internal api.target-corp.internal
10.10.10.25     db-cluster.internal`);
        } else if (file === 'recon_scan.sh') {
          addEntry('output',
`#!/bin/bash
# QUORVANE Automated Recon Script
TARGET="\${1:-10.10.10.10}"
echo "[*] Launching Nmap SYN scan against $TARGET..."
nmap -sV -sC -p 22,80,443,3306,8080 "$TARGET" -oN scan_results.txt
echo "[+] Recon completed."`);
        } else {
          addEntry('error', `cat: ${file}: No such file or directory`);
        }
        break;
      }

      case 'echo':
        addEntry('output', args.join(' '));
        break;

      case 'date':
        addEntry('output', new Date().toUTCString());
        break;

      // =====================================
      // 5. WHOIS LOOKUP TOOL
      // =====================================
      case 'whois': {
        const domain = args[0] || contextTarget;
        addEntry('info', `[+] Querying WHOIS database for: ${domain}...`);

        setTimeout(() => {
          addEntry('output',
`   Domain Name: ${domain.toUpperCase()}
   Registry Domain ID: 2490184719_DOMAIN_INTERNAL-VRSN
   Registrar WHOIS Server: whois.markmonitor.com
   Registrar URL: http://www.markmonitor.com
   Updated Date: 2025-11-20T14:15:22Z
   Creation Date: 2019-04-12T08:30:00Z
   Registry Expiry Date: 2028-04-12T08:30:00Z
   Registrar: MarkMonitor Inc. / QUORVANE Authorized Registry
   Registrar IANA ID: 292
   Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
   Registrar Abuse Contact Phone: +1.2083895740
   Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
   Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
   Registry Registrant ID: CR391827419
   Registrant Organization: Target Enterprise Operations LLC
   Registrant State/Province: VA
   Registrant Country: US
   Name Server: NS1.QUORVANE-DNS.INTERNAL
   Name Server: NS2.QUORVANE-DNS.INTERNAL
   DNSSEC: signedDelegation (Algorithm 13 - ECDSAP256SHA256)
   DNSSEC DS RR: 48192 13 2 8A9B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B

<<< WHOIS lookup completed successfully (0.42s) >>>`);
        }, 300);
        break;
      }

      // =====================================
      // 6. NMAP PORT SCANNER TOOL
      // =====================================
      case 'nmap': {
        const target = args[args.length - 1] || '10.10.10.10';
        const isVer = args.includes('-sV') || args.includes('-A');
        const isScripts = args.includes('-sC') || args.includes('-A');
        const isPorts = args.includes('-p');

        // Check if target is in authorized enclave
        const isAllowed = 
          target.includes('10.10.10.') || 
          target.includes('target-corp') || 
          target.includes('corp-vault') || 
          target.includes('localhost') || 
          target.includes('127.0.0.1') ||
          target.includes('internal') ||
          target === 'quorvane.sec';

        if (!isAllowed) {
          addEntry('error',
`[SECURITY POLICY VIOLATION] Target '${target}' is outside authorized scope.
Scans are strictly constrained to QUORVANE training range:
  - 10.10.10.10 (target-corp.internal)
  - 10.10.10.15 (corp-vault.internal)
  - 10.10.10.25 (db-prod.internal)
  - 127.0.0.1   (localhost)`);
          break;
        }

        addEntry('info', `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`);

        setTimeout(() => {
          let outputReport = 
`Nmap scan report for ${target} (10.10.10.10)
Host is up (0.0018s latency).
Not shown: 994 closed tcp ports (reset)`;

          if (isPorts && args.includes('22,80,443')) {
            outputReport += `
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https`;
          } else if (isVer) {
            outputReport += `
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http        nginx 1.24.0 (Ubuntu)
443/tcp  open  ssl/https   nginx 1.24.0 (TLS 1.3: TLS_AES_256_GCM_SHA384)
3306/tcp open  mysql       MySQL 8.0.35-0ubuntu0.22.04.1
8080/tcp open  http-proxy  Apache Tomcat/9.0.58`;
          } else {
            outputReport += `
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-alt`;
          }

          if (isScripts) {
            outputReport += `
| ssl-cert: Subject: commonName=*.target-corp.internal
| Issuer: QUORVANE Intermediate CA G2
| Public Key Type: rsa (2048-bit)
| Not valid before: 2026-01-01T00:00:00Z
|_Not valid after:  2027-01-01T00:00:00Z
|_http-title: Target Enterprise Systems | Secure Portal
|_http-server-header: nginx/1.24.0`;
          }

          outputReport += `
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel:5.15

Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds`;

          addEntry('success', outputReport);
        }, 450);
        break;
      }

      // =====================================
      // 7. DNS & RECON TOOLS: DIG & NSLOOKUP
      // =====================================
      case 'dig': {
        const domain = args[0] || contextTarget;
        const qtype = args[1]?.toUpperCase() || 'A';
        addEntry('info', `; <<>> DiG 9.18.28-1~deb12u2-Debian <<>> ${domain} ${qtype}`);
        setTimeout(() => {
          addEntry('output',
`;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48921
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 2, ADDITIONAL: 2

;; QUESTION SECTION:
;${domain}.                 IN      ${qtype}

;; ANSWER SECTION:
${domain}.          300     IN      A       10.10.10.10
${domain}.          300     IN      AAAA    2001:db8:85a3::8a2e:370:7334
${domain}.          3600    IN      MX      10 mail.${domain}.
${domain}.          3600    IN      TXT     "v=spf1 include:_spf.google.com ip4:10.10.10.10 -all"

;; AUTHORITY SECTION:
${domain}.          86400   IN      NS      ns1.quorvane-dns.internal.
${domain}.          86400   IN      NS      ns2.quorvane-dns.internal.

;; Query time: 4 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: ${new Date().toUTCString()}
;; MSG SIZE  rcvd: 248`);
        }, 300);
        break;
      }

      case 'nslookup': {
        const domain = args[0] || contextTarget;
        addEntry('output',
`Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
Name:   ${domain}
Address: 10.10.10.10
Name:   ${domain}
Address: 2001:db8:85a3::8a2e:370:7334`);
        break;
      }

      // =====================================
      // 8. CURL HEADER CHECKER
      // =====================================
      case 'curl': {
        const url = args.find((a) => a.startsWith('http') || a.includes('.')) || 'https://target-corp.internal';
        addEntry('info', `[*] Requesting HTTP headers from ${url}...`);
        setTimeout(() => {
          addEntry('output',
`HTTP/2 200 OK
server: nginx/1.24.0 (Ubuntu)
date: ${new Date().toUTCString()}
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 0
referrer-policy: strict-origin-when-cross-origin
content-security-policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none';
access-control-allow-origin: null`);
        }, 350);
        break;
      }

      // =====================================
      // 9. CVE LOOKUP
      // =====================================
      case 'cve': {
        const cveId = args[0]?.toUpperCase() || 'CVE-2021-44228';
        if (cveId === 'CVE-2021-44228') {
          addEntry('output',
`=== [CVE-2021-44228: Apache Log4j Log4Shell Remote Code Execution] ===
CVSS v3.1: 10.0 [CRITICAL] · Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H
Disclosed: 2021-12-10 · Affected: Apache Log4j 2.0-beta9 through 2.14.1
CWE: CWE-502 (Deserialization of Untrusted Data)
Description:
  Apache Log4j2 JNDI features used in configuration, log messages, and parameters
  do not protect against attacker controlled LDAP and other JNDI related endpoints.
  An attacker who can control log messages or log message parameters can execute
  arbitrary code loaded from LDAP servers when message lookup substitution is enabled.
Remediation:
  Upgrade to Log4j 2.17.1 or newer. Set log4j2.formatMsgNoLookups=true.`);
        } else if (cveId === 'CVE-2017-0144') {
          addEntry('output',
`=== [CVE-2017-0144: EternalBlue SMBv1 Remote Code Execution] ===
CVSS v3.1: 8.1 [HIGH] · Vector: CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H
Disclosed: 2017-03-14 · Affected: Microsoft Windows Vista, 7, 8.1, 10, Server 2008/2012/2016
Description:
  The SMBv1 server in Microsoft Windows allows remote attackers to execute arbitrary
  code via crafted packets (EternalBlue / MS17-010).
Remediation:
  Apply Microsoft Security Bulletin MS17-010. Disable SMBv1 across the domain.`);
        } else {
          addEntry('output',
`=== [${cveId}: Vulnerability Record] ===
NVD Status: Analyzed · Severity: HIGH (CVSS 8.4)
Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N
Summary: Discovered vulnerability in service component requiring immediate patch application.
Remediation: Upgrade component to latest vendor security release.`);
        }
        break;
      }

      // =====================================
      // 10. CVSS VECTOR CALCULATOR
      // =====================================
      case 'cvss': {
        const vec = args[0] || 'AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H';
        addEntry('output',
`[CVSS v3.1 Base Score Calculator]
Vector String: CVSS:3.1/${vec.replace(/^CVSS:3\.1\//, '')}
  Attack Vector (AV): Network [0.85]
  Attack Complexity (AC): Low [0.77]
  Privileges Required (PR): None [0.85]
  User Interaction (UI): None [0.85]
  Scope (S): Unchanged
  Confidentiality (C): High [0.56]
  Integrity (I): High [0.56]
  Availability (A): High [0.56]

Calculated Base Score: 9.8 [CRITICAL SEVERITY]
Exploitability Sub-score: 3.9
Impact Sub-score: 5.9`);
        break;
      }

      // =====================================
      // 11. SUBFINDER / AMASS SIMULATION
      // =====================================
      case 'subfinder':
      case 'amass': {
        const dom = args.find((a) => a.includes('.')) || contextTarget;
        addEntry('info', `[*] Enumerating subdomains for ${dom} using passive sources...`);
        setTimeout(() => {
          addEntry('output',
`[+] www.${dom}
[+] api.${dom}
[+] dev-portal.${dom}
[+] auth.${dom}
[+] staging-assets.${dom}
[+] mail.${dom}
[+] vpn.${dom}
[+] admin-console.${dom}
[+] Found 8 valid subdomains for ${dom} in 0.82s`);
        }, 400);
        break;
      }

      // =====================================
      // 12. PING SIMULATION
      // =====================================
      case 'ping': {
        const host = args.find((a) => !a.startsWith('-')) || '10.10.10.10';
        addEntry('info', `PING ${host} (${host}) 56(84) bytes of data.`);
        setTimeout(() => {
          addEntry('output',
`64 bytes from ${host}: icmp_seq=1 ttl=64 time=1.84 ms
64 bytes from ${host}: icmp_seq=2 ttl=64 time=1.72 ms
64 bytes from ${host}: icmp_seq=3 ttl=64 time=1.89 ms
64 bytes from ${host}: icmp_seq=4 ttl=64 time=1.76 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 1.721/1.802/1.890/0.068 ms`);
        }, 350);
        break;
      }

      default:
        addEntry('error', `bash: ${cmd}: command not found. Type 'help' to see authorized commands.`);
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || '');
      }
    }
  };

  return (
    <div 
      className={`rounded-2xl bg-[#030712] border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col font-mono text-xs ${
        isExpanded ? 'fixed inset-4 z-50 rounded-2xl' : heightClass
      } ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#080e1a] border-b border-slate-800/80 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-cyan-400/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-semibold tracking-wider text-[11px]">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUORVANE Terminal</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400/80 hidden sm:inline font-mono text-[10px]">{contextTarget}</span>
          </div>
        </div>

        {/* Action Controls: Copy, Clear, Expand, Help */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            title="Copy entire terminal output"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#0c1626] border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            title="Clear terminal screen"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#0c1626] border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[10px] hidden md:inline">Clear</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore window size' : 'Expand terminal'}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#0c1626] border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Quick Command Pills for Fast Learning */}
      <div className="px-3 py-1.5 bg-[#050b14] border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
        <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider pl-1 shrink-0">Quick Run:</span>
        <button
          onClick={() => executeCommand('help')}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          help
        </button>
        <button
          onClick={() => executeCommand(`whois ${contextTarget}`)}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          whois {contextTarget}
        </button>
        <button
          onClick={() => executeCommand(`nmap -sV ${contextTarget}`)}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          nmap -sV {contextTarget}
        </button>
        <button
          onClick={() => executeCommand(`dig ${contextTarget} ANY`)}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          dig {contextTarget}
        </button>
        <button
          onClick={() => executeCommand(`curl -I https://${contextTarget}`)}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          curl -I
        </button>
        <button
          onClick={() => executeCommand('cve CVE-2021-44228')}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          cve Log4Shell
        </button>
        <button
          onClick={() => executeCommand('cat notes.txt')}
          className="px-2 py-0.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          cat notes.txt
        </button>
      </div>

      {/* Terminal Scroll Screen */}
      <div 
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-y-auto space-y-2 leading-relaxed bg-[#030712] cursor-text"
      >
        {entries.map((entry) => {
          if (entry.type === 'input') {
            return (
              <div key={entry.id} className="flex items-start gap-2 text-cyan-400">
                <span className="select-none text-slate-400 font-semibold">{initialPrompt}:{currentDir}$</span>
                <span className="font-semibold text-white">{entry.content}</span>
              </div>
            );
          }
          if (entry.type === 'error') {
            return (
              <div key={entry.id} className="text-rose-400 whitespace-pre-wrap pl-2 border-l-2 border-rose-500/60">
                {entry.content}
              </div>
            );
          }
          if (entry.type === 'success') {
            return (
              <div key={entry.id} className="text-cyan-300 whitespace-pre-wrap pl-2 border-l-2 border-cyan-500/60">
                {entry.content}
              </div>
            );
          }
          if (entry.type === 'info') {
            return (
              <div key={entry.id} className="text-slate-400 whitespace-pre-wrap">
                {entry.content}
              </div>
            );
          }
          return (
            <div key={entry.id} className="text-slate-300 whitespace-pre-wrap font-mono">
              {entry.content}
            </div>
          );
        })}

        {/* Live Input Prompt Line */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-1">
          <span className="select-none text-cyan-400 font-semibold shrink-0">
            {initialPrompt}:{currentDir}$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g., whois, nmap, dig, cve, help)..."
            className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder-slate-600"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button 
            type="submit" 
            className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-sans text-[11px] font-bold transition-all cursor-pointer shrink-0"
          >
            Execute
          </button>
        </form>
      </div>

      {/* Terminal Status Footer */}
      <div className="px-4 py-1.5 bg-[#050b14] border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>ENCLAVE: ISOLATED (SANDBOXED)</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UP/DOWN: HISTORY</span>
          <span>TARGET: {contextTarget}</span>
        </div>
      </div>
    </div>
  );
};
