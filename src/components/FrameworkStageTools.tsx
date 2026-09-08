import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Shield, 
  Globe, 
  Cpu, 
  Layers, 
  FileText, 
  CheckSquare, 
  Copy, 
  Check, 
  RotateCcw, 
  Play, 
  AlertTriangle, 
  Sliders, 
  Database, 
  Wifi, 
  Lock, 
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Zap,
  Radio,
  Server
} from 'lucide-react';
import { PORT_REFERENCES } from '../data/cyberContent';
import { QuorvaneTerminal } from './QuorvaneTerminal';

interface FrameworkStageToolsProps {
  stageId: string; // 'stage-1' through 'stage-7'
  stageNumber: number;
}

export const FrameworkStageTools: React.FC<FrameworkStageToolsProps> = ({ stageId, stageNumber }) => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // ==========================================
  // STAGE 1 TOOLS: RECONNAISSANCE
  // ==========================================
  // Tool 1.1: WHOIS Lookup
  const [whoisDomain, setWhoisDomain] = useState('target-corp.internal');
  const [whoisLoading, setWhoisLoading] = useState(false);
  const [whoisResult, setWhoisResult] = useState<any | null>(null);

  const runWhoisLookup = () => {
    setWhoisLoading(true);
    setTimeout(() => {
      setWhoisResult({
        domain: whoisDomain,
        registrar: 'MarkMonitor Inc. / QUORVANE Registry',
        creationDate: '2019-04-12T08:30:00Z',
        updatedDate: '2025-11-20T14:15:00Z',
        expiryDate: '2028-04-12T08:30:00Z',
        status: ['clientTransferProhibited', 'clientUpdateProhibited'],
        nameServers: [
          'ns1.quorvane-dns.internal (198.51.100.10)',
          'ns2.quorvane-dns.internal (198.51.100.11)'
        ],
        registrantOrg: 'Target Enterprise Security Operations LLC',
        registrantCountry: 'US',
        dnssec: 'Signed (Algorithm 13 - ECDSAP256SHA256)',
        abuseEmail: 'security-abuse@target-corp.internal'
      });
      setWhoisLoading(false);
    }, 600);
  };

  // Tool 1.2: DNS Lookup
  const [dnsDomain, setDnsDomain] = useState('target-corp.internal');
  const [dnsType, setDnsType] = useState('ALL');
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsResult, setDnsResult] = useState<any[] | null>(null);

  const runDnsLookup = () => {
    setDnsLoading(true);
    setTimeout(() => {
      setDnsResult([
        { type: 'A', name: dnsDomain, value: '198.51.100.42', ttl: 300 },
        { type: 'AAAA', name: dnsDomain, value: '2001:db8:85a3::8a2e:370:7334', ttl: 300 },
        { type: 'MX', name: dnsDomain, value: '10 mail.target-corp.internal', ttl: 3600 },
        { type: 'TXT', name: dnsDomain, value: 'v=spf1 include:_spf.google.com ip4:198.51.100.42 -all', ttl: 3600 },
        { type: 'TXT', name: '_dmarc.' + dnsDomain, value: 'v=DMARC1; p=reject; rua=mailto:dmarc@target-corp.internal; pct=100', ttl: 3600 },
        { type: 'NS', name: dnsDomain, value: 'ns1.quorvane-dns.internal', ttl: 86400 },
        { type: 'SOA', name: dnsDomain, value: 'ns1.quorvane-dns.internal hostmaster.' + dnsDomain + ' 2026030901', ttl: 86400 }
      ]);
      setDnsLoading(false);
    }, 500);
  };

  // Tool 1.3: IP Information
  const [ipTarget, setIpTarget] = useState('198.51.100.42');
  const [ipLoading, setIpLoading] = useState(false);
  const [ipResult, setIpResult] = useState<any | null>(null);

  const runIpLookup = () => {
    setIpLoading(true);
    setTimeout(() => {
      setIpResult({
        ip: ipTarget,
        asn: 'AS64512 (QUORVANE Autonomous Network)',
        org: 'Quorvane Cloud Infrastructure Services',
        city: 'Ashburn',
        region: 'Virginia',
        country: 'United States (US)',
        ptr: 'edge-gw-01.target-corp.internal',
        torExit: 'No (Clean reputation)',
        threatScore: '0/100 (Safe Educational Target)',
        openPortsReported: '22/TCP, 80/TCP, 443/TCP'
      });
      setIpLoading(false);
    }, 450);
  };

  // Tool 1.4: Subdomain Discovery Simulator
  const [subTarget, setSubTarget] = useState('target-corp.internal');
  const [subLoading, setSubLoading] = useState(false);
  const [subdomains, setSubdomains] = useState<Array<{ sub: string; ip: string; status: number; note: string }> | null>(null);

  const runSubdomainDiscovery = () => {
    setSubLoading(true);
    setTimeout(() => {
      setSubdomains([
        { sub: 'www.' + subTarget, ip: '198.51.100.42', status: 200, note: 'Primary Web Portal' },
        { sub: 'api.' + subTarget, ip: '198.51.100.45', status: 200, note: 'REST API Gateway (Swagger docs enabled)' },
        { sub: 'mail.' + subTarget, ip: '198.51.100.14', status: 200, note: 'Webmail Interface (TLS 1.3)' },
        { sub: 'staging.' + subTarget, ip: '198.51.100.89', status: 401, note: 'Staging Environment (Basic Auth Required)' },
        { sub: 'vpn.' + subTarget, ip: '198.51.100.5', status: 200, note: 'OpenVPN / WireGuard Access Gateway' },
        { sub: 'admin.' + subTarget, ip: '198.51.100.99', status: 403, note: 'Internal Dashboard (IP Whitelisted)' }
      ]);
      setSubLoading(false);
    }, 700);
  };

  // Tool 1.5: Passive Recon OSINT Analyzer
  const [osintTarget, setOsintTarget] = useState('target-corp.internal');
  const [osintLoading, setOsintLoading] = useState(false);
  const [osintResult, setOsintResult] = useState<any | null>(null);

  const runOsintAnalysis = () => {
    setOsintLoading(true);
    setTimeout(() => {
      setOsintResult({
        certLogs: ['api.target-corp.internal', 'dev-auth.target-corp.internal', 'mail.target-corp.internal'],
        cloudBuckets: 'target-corp-assets-public (S3-compatible bucket, read-only authorized)',
        leakedCredsCheck: '0 active credentials leaked across monitored breach repositories',
        techStack: 'Nginx 1.24.0, Node.js v20 LTS, PostgreSQL 15, Ubuntu Linux 22.04 LTS',
        attackSurfaceRating: 'Low-to-Medium (Minimal unnecessary exposure)'
      });
      setOsintLoading(false);
    }, 600);
  };

  // ==========================================
  // STAGE 2 TOOLS: SCANNING & ENUMERATION
  // ==========================================
  // Tool 2.1: Port Scanner Simulator
  const [scanHost, setScanHost] = useState('198.51.100.42');
  const [scanType, setScanType] = useState<'syn' | 'connect' | 'udp'>('syn');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanPortsResult, setScanPortsResult] = useState<any[] | null>(null);

  const runPortScan = () => {
    setScanLoading(true);
    setTimeout(() => {
      setScanPortsResult([
        { port: 21, proto: 'tcp', service: 'ftp', state: 'closed', version: '-', latency: '4ms' },
        { port: 22, proto: 'tcp', service: 'ssh', state: 'open', version: 'OpenSSH 8.9p1 Ubuntu 3ubuntu0.6', latency: '12ms' },
        { port: 25, proto: 'tcp', service: 'smtp', state: 'filtered', version: 'Firewall Drop', latency: '150ms' },
        { port: 80, proto: 'tcp', service: 'http', state: 'open', version: 'nginx 1.24.0 (Ubuntu)', latency: '8ms' },
        { port: 443, proto: 'tcp', service: 'https', state: 'open', version: 'nginx (TLSv1.3 TLS_AES_256_GCM_SHA384)', latency: '9ms' },
        { port: 3306, proto: 'tcp', service: 'mysql', state: 'filtered', version: 'Packet Dropped by iptables', latency: '180ms' },
        { port: 8080, proto: 'tcp', service: 'http-alt', state: 'closed', version: 'TCP RST received', latency: '6ms' }
      ]);
      setScanLoading(false);
    }, 700);
  };

  // Tool 2.2: Network Discovery Simulator
  const [subnetCidr, setSubnetCidr] = useState('192.168.10.0/24');
  const [netLoading, setNetLoading] = useState(false);
  const [netHosts, setNetHosts] = useState<any[] | null>(null);

  const runNetworkDiscovery = () => {
    setNetLoading(true);
    setTimeout(() => {
      setNetHosts([
        { ip: '192.168.10.1', mac: '00:1A:2B:3C:4D:01', vendor: 'Cisco Systems', os: 'Cisco IOS 15.2', role: 'Default Gateway' },
        { ip: '192.168.10.15', mac: '52:54:00:12:34:56', vendor: 'QEMU/KVM', os: 'Ubuntu 22.04 LTS', role: 'Web Server' },
        { ip: '192.168.10.20', mac: '00:50:56:A1:B2:C3', vendor: 'VMware Inc.', os: 'Debian 12 Bookworm', role: 'Database Server' },
        { ip: '192.168.10.45', mac: 'B8:27:EB:12:34:56', vendor: 'Raspberry Pi Foundation', os: 'Raspbian GNU/Linux', role: 'Telemetry Node' }
      ]);
      setNetLoading(false);
    }, 650);
  };

  // Tool 2.3: Service & Banner Grabber
  const [bannerHost, setBannerHost] = useState('198.51.100.42');
  const [bannerPort, setBannerPort] = useState('22');
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerResult, setBannerResult] = useState<string | null>(null);

  const runBannerGrab = () => {
    setBannerLoading(true);
    setTimeout(() => {
      if (bannerPort === '22') {
        setBannerResult('SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6\nProtocol: SSHv2\nKey Exchanges: curve25519-sha256, ecdh-sha2-nistp256\nCiphers: chacha20-poly1305@openssh.com, aes256-gcm@openssh.com');
      } else if (bannerPort === '80' || bannerPort === '443') {
        setBannerResult('HTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nDate: ' + new Date().toUTCString() + '\nContent-Type: text/html; charset=UTF-8\nStrict-Transport-Security: max-age=31536000; includeSubDomains\nX-Content-Type-Options: nosniff\nX-Frame-Options: SAMEORIGIN');
      } else {
        setBannerResult(`Connection established to ${bannerHost}:${bannerPort}.\n[!] Banner: Generic Service Listening.\nNo automated version disclosure banner transmitted.`);
      }
      setBannerLoading(false);
    }, 500);
  };

  // Tool 2.4: HTTP Service Checker
  const [httpUrl, setHttpUrl] = useState('https://target-corp.internal');
  const [httpLoading, setHttpLoading] = useState(false);
  const [httpResult, setHttpResult] = useState<any | null>(null);

  const runHttpCheck = () => {
    setHttpLoading(true);
    setTimeout(() => {
      setHttpResult({
        url: httpUrl,
        statusCode: 200,
        statusText: 'OK',
        responseTime: '42ms',
        tlsVersion: 'TLSv1.3 (Cipher: TLS_AES_256_GCM_SHA384)',
        certIssuer: 'Let\'s Encrypt Authority X3',
        redirects: '0 redirects (Direct 200 OK)',
        compression: 'gzip, br enabled',
        httpVersion: 'HTTP/2.0'
      });
      setHttpLoading(false);
    }, 500);
  };

  // Tool 2.5: Port Reference Database
  const [portSearch, setPortSearch] = useState('');
  const filteredPorts = PORT_REFERENCES.filter(
    (p) =>
      p.port.toString().includes(portSearch) ||
      p.service.toLowerCase().includes(portSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(portSearch.toLowerCase())
  );

  // ==========================================
  // STAGE 3 TOOLS: VULNERABILITY ASSESSMENT
  // ==========================================
  // Tool 3.1: CVE Information Viewer
  const [cveSearch, setCveSearch] = useState('CVE-2021-44228');
  const [cveLoading, setCveLoading] = useState(false);
  const [cveResult, setCveResult] = useState<any | null>(null);

  const cveDatabase: Record<string, any> = {
    'cve-2021-44228': {
      id: 'CVE-2021-44228',
      name: 'Log4Shell (Apache Log4j2 JNDI RCE)',
      cvss: 10.0,
      severity: 'CRITICAL',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
      vendor: 'Apache Software Foundation',
      product: 'Log4j 2.0-beta9 through 2.15.0',
      description: 'JNDI features used in configuration, log messages, and parameters do not protect against attacker-controlled LDAP and other JNDI related endpoints, allowing remote code execution.',
      cisaKev: 'Yes (Active Exploitation Confirmed)',
      mitigation: 'Upgrade to Apache Log4j 2.17.1 or newer. Set system property log4j2.formatMsgNoLookups=true or remove JndiLookup.class.'
    },
    'cve-2017-0144': {
      id: 'CVE-2017-0144',
      name: 'EternalBlue (SMBv1 Remote Code Execution)',
      cvss: 9.8,
      severity: 'CRITICAL',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      vendor: 'Microsoft Corporation',
      product: 'Windows SMBv1 Server',
      description: 'A remote code execution vulnerability exists in Microsoft Server Message Block 1.0 (SMBv1) when handling specially crafted packets.',
      cisaKev: 'Yes (Historically Exploited by WannaCry)',
      mitigation: 'Apply Microsoft Security Bulletin MS17-010 and disable SMBv1 globally across all domain endpoints.'
    },
    'cve-2024-3094': {
      id: 'CVE-2024-3094',
      name: 'XZ Utils Backdoor (liblzma SSH bypass)',
      cvss: 10.0,
      severity: 'CRITICAL',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
      vendor: 'Tukaani Project / XZ Utils',
      product: 'XZ Utils 5.6.0 and 5.6.1',
      description: 'Malicious code introduced into the upstream release tarballs that intercepts OpenSSH authentication routines in certain systemd-linked Linux distributions.',
      cisaKev: 'Yes (Supply Chain Breach)',
      mitigation: 'Downgrade to uncompromised XZ Utils versions 5.4.x or upgrade to vetted vendor releases.'
    }
  };

  const runCveLookup = () => {
    setCveLoading(true);
    setTimeout(() => {
      const key = cveSearch.trim().toLowerCase();
      const match = cveDatabase[key] || {
        id: cveSearch.toUpperCase(),
        name: 'Vulnerability Advisory Record',
        cvss: 7.5,
        severity: 'HIGH',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        vendor: 'Standard Enterprise Package',
        product: 'Network Service Component',
        description: `Automated vulnerability record cataloged for ${cveSearch}. Requires security patch verification.`,
        cisaKev: 'Monitoring in progress',
        mitigation: 'Apply vendor patch update and restrict ingress exposure to trusted management subnets.'
      };
      setCveResult(match);
      setCveLoading(false);
    }, 450);
  };

  // Tool 3.2: CVSS v3.1 Calculator
  const [cvssAv, setCvssAv] = useState<'N' | 'A' | 'L' | 'P'>('N');
  const [cvssAc, setCvssAc] = useState<'L' | 'H'>('L');
  const [cvssPr, setCvssPr] = useState<'N' | 'L' | 'H'>('N');
  const [cvssUi, setCvssUi] = useState<'N' | 'R'>('N');
  const [cvssScope, setCvssScope] = useState<'U' | 'C'>('U');
  const [cvssConf, setCvssConf] = useState<'H' | 'L' | 'N'>('H');
  const [cvssInteg, setCvssInteg] = useState<'H' | 'L' | 'N'>('H');
  const [cvssAvail, setCvssAvail] = useState<'H' | 'L' | 'N'>('H');

  const computeCvssScore = () => {
    let base = 0;
    if (cvssAv === 'N') base += 3.2;
    else if (cvssAv === 'A') base += 2.2;
    else if (cvssAv === 'L') base += 1.2;
    else base += 0.5;

    if (cvssAc === 'L') base += 1.5;
    else base += 0.6;

    if (cvssPr === 'N') base += 1.5;
    else if (cvssPr === 'L') base += 0.9;
    else base += 0.3;

    if (cvssUi === 'N') base += 1.2;
    else base += 0.5;

    let impact = 0;
    if (cvssConf === 'H') impact += 0.9;
    else if (cvssConf === 'L') impact += 0.4;

    if (cvssInteg === 'H') impact += 0.9;
    else if (cvssInteg === 'L') impact += 0.4;

    if (cvssAvail === 'H') impact += 0.9;
    else if (cvssAvail === 'L') impact += 0.4;

    if (cvssScope === 'C') base += 1.2;

    const total = Math.min(10.0, Math.round((base + impact) * 10) / 10);
    let severity = 'LOW';
    if (total >= 9.0) severity = 'CRITICAL';
    else if (total >= 7.0) severity = 'HIGH';
    else if (total >= 4.0) severity = 'MEDIUM';
    else if (total > 0.0) severity = 'LOW';
    else severity = 'NONE';

    return {
      score: total,
      severity,
      vector: `CVSS:3.1/AV:${cvssAv}/AC:${cvssAc}/PR:${cvssPr}/UI:${cvssUi}/S:${cvssScope}/C:${cvssConf}/I:${cvssInteg}/A:${cvssAvail}`
    };
  };

  const cvssScoreData = computeCvssScore();

  // Tool 3.3: Security Header Checker
  const [headerUrl, setHeaderUrl] = useState('https://target-corp.internal');
  const [headerLoading, setHeaderLoading] = useState(false);
  const [headerAudit, setHeaderAudit] = useState<any | null>(null);

  const runHeaderAudit = () => {
    setHeaderLoading(true);
    setTimeout(() => {
      setHeaderAudit({
        url: headerUrl,
        grade: 'A',
        headers: [
          { name: 'Strict-Transport-Security (HSTS)', present: true, value: 'max-age=31536000; includeSubDomains; preload', status: 'PASS' },
          { name: 'Content-Security-Policy (CSP)', present: true, value: "default-src 'self'; script-src 'self'; object-src 'none'", status: 'PASS' },
          { name: 'X-Frame-Options (XFO)', present: true, value: 'DENY', status: 'PASS' },
          { name: 'X-Content-Type-Options', present: true, value: 'nosniff', status: 'PASS' },
          { name: 'Referrer-Policy', present: true, value: 'strict-origin-when-cross-origin', status: 'PASS' },
          { name: 'Permissions-Policy', present: false, value: 'Missing (Recommended: camera=(), microphone=())', status: 'WARN' }
        ]
      });
      setHeaderLoading(false);
    }, 550);
  };

  // ==========================================
  // STAGE 4 TOOLS: EXPLOITATION (SAFE CONCEPTS)
  // ==========================================
  const [exploitConcept, setExploitConcept] = useState<'sqli' | 'xss' | 'cmdi' | 'traversal'>('sqli');
  const [simulatedPayload, setSimulatedPayload] = useState("' OR '1'='1");
  const [simFilterActive, setSimFilterActive] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const runExploitSimulation = () => {
    if (simFilterActive) {
      setSimOutput(`[SAFE DEFENSE ENFORCED]\nInput safely handled via Parameterized Prepared Statements / HTML Encoding.\nSanitized Input: "${simulatedPayload.replace(/'/g, "\\'")}"\nDatabase / Parser Execution: Literal string comparison only.\nResult: 0 rows affected. Attack vector neutralized.`);
    } else {
      if (exploitConcept === 'sqli') {
        setSimOutput(`[VULNERABLE EXECUTION DEMONSTRATED]\nRaw SQL Query: SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '...';\nLogic Tree: Condition '1'='1' evaluated to TRUE for all rows.\nResult: Authentication BYPASSED. Returned record ID 1 (Administrator account).`);
      } else if (exploitConcept === 'xss') {
        setSimOutput(`[VULNERABLE EXECUTION DEMONSTRATED]\nReflected in DOM without HTML Entity Encoding.\nPayload rendered as executable script in browser window context.\nResult: Document cookie / session token accessible.`);
      } else if (exploitConcept === 'cmdi') {
        setSimOutput(`[VULNERABLE EXECUTION DEMONSTRATED]\nShell Execution: ping -c 1 127.0.0.1; whoami\nStandard Output: 127.0.0.1 replied.\nAppended Command Output: uid=1000(student) gid=1000(student) groups=1000\nResult: Arbitrary operating system command executed.`);
      } else {
        setSimOutput(`[VULNERABLE EXECUTION DEMONSTRATED]\nFile Path Resolver: /var/www/uploads/../../../../etc/passwd\nPath Traversal: Normalized to /etc/passwd\nResult: root:x:0:0:root:/root:/bin/bash read.`);
      }
    }
  };

  // ==========================================
  // STAGE 5 TOOLS: POST-EXPLOITATION
  // ==========================================
  const [privUser, setPrivUser] = useState<'www-data' | 'guest_user' | 'local_admin'>('www-data');
  const [privCheckOutput, setPrivCheckOutput] = useState<string | null>(null);

  const runPrivCheck = () => {
    if (privUser === 'www-data') {
      setPrivCheckOutput(`[AUDIT FOR USER: www-data (UID 33)]\n1. Sudo Privileges: (ALL) NOPASSWD: /usr/bin/htop (POTENTIAL ESCALATION VECTOR)\n2. SUID Binaries: /usr/bin/passwd, /usr/bin/sudo, /usr/bin/newgrp\n3. Writable Directories: /tmp, /var/tmp, /var/www/html/uploads\n4. Kernel: Linux 5.15.0-101-generic (Up-to-date, dirtycow patched)\n5. Remediation Note: Remove NOPASSWD entry from /etc/sudoers.d/www-data immediately.`);
    } else if (privUser === 'guest_user') {
      setPrivCheckOutput(`[AUDIT FOR USER: guest_user (UID 1002)]\n1. Sudo Privileges: User guest_user may not run sudo on this host.\n2. SUID Binaries: Standard system binaries only.\n3. Writable Directories: /home/guest_user\n4. Defense Status: Least Privilege Enforced.`);
    } else {
      setPrivCheckOutput(`[AUDIT FOR USER: local_admin (UID 1000)]\n1. Sudo Privileges: (ALL : ALL) ALL (Full Administrative Clearance)\n2. Action Item: Audit session logs for MFA enforcement.`);
    }
  };

  // Stage 5 Tool: Cleanup Checklist
  const [cleanupItems, setCleanupItems] = useState([
    { id: 'c1', label: 'Purged temporary test canary files (/tmp/test_canary_quorvane.txt)', done: true },
    { id: 'c2', label: 'Deactivated and deleted temporary testing user accounts', done: true },
    { id: 'c3', label: 'Restored modified configuration files to verified Git baseline', done: false },
    { id: 'c4', label: 'Logged start and end timestamps for SOC SIEM correlation', done: true },
    { id: 'c5', label: 'Signed formal digital completion acknowledgment with system owner', done: false }
  ]);

  const toggleCleanup = (id: string) => {
    setCleanupItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // ==========================================
  // STAGE 6 TOOLS: REPORTING
  // ==========================================
  const [findings, setFindings] = useState<Array<{
    id: string;
    title: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    asset: string;
    cvss: number;
    description: string;
  }>>([
    {
      id: 'f-1',
      title: 'Missing HTTP Strict-Transport-Security (HSTS)',
      severity: 'MEDIUM',
      asset: 'https://staging.target-corp.internal',
      cvss: 5.3,
      description: 'Web server does not enforce encrypted HTTPS transport, allowing man-in-the-middle SSL stripping.'
    },
    {
      id: 'f-2',
      title: 'Unauthenticated Swagger API Documentation Endpoint',
      severity: 'HIGH',
      asset: 'https://api.target-corp.internal/swagger-ui/',
      cvss: 7.5,
      description: 'Internal endpoints and parameter schemas exposed without token authorization.'
    }
  ]);

  const [newFindingTitle, setNewFindingTitle] = useState('');
  const [newFindingSeverity, setNewFindingSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newFindingAsset, setNewFindingAsset] = useState('https://target-corp.internal');
  const [newFindingDesc, setNewFindingDesc] = useState('');

  const addFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFindingTitle.trim()) return;
    const cvssMap = { CRITICAL: 9.5, HIGH: 7.5, MEDIUM: 5.3, LOW: 3.1 };
    setFindings((prev) => [
      ...prev,
      {
        id: 'f-' + Date.now(),
        title: newFindingTitle.trim(),
        severity: newFindingSeverity,
        asset: newFindingAsset.trim(),
        cvss: cvssMap[newFindingSeverity],
        description: newFindingDesc.trim() || 'Verified vulnerability finding documented during security assessment.'
      }
    ]);
    setNewFindingTitle('');
    setNewFindingDesc('');
  };

  const generateReportMarkdown = () => {
    return `# QUORVANE SECURITY ASSESSMENT REPORT
Target Organization: Target Enterprise Operations LLC
Assessment Type: Authorized Ethical Penetration Test & Methodology Audit
Date: ${new Date().toISOString().split('T')[0]}
Status: Certified Complete

## 1. Executive Summary
During the authorized assessment, our security team identified ${findings.length} actionable findings across target assets. 
All actions were conducted within agreed Rules of Engagement with zero production disruption.

## 2. Findings Matrix
${findings.map((f, i) => `### ${i + 1}. [${f.severity}] ${f.title}
- **Affected Asset**: \`${f.asset}\`
- **CVSS v3.1 Score**: ${f.cvss}
- **Description**: ${f.description}
- **Remediation SLA**: ${f.severity === 'CRITICAL' ? '24 Hours' : f.severity === 'HIGH' ? '7 Days' : '30 Days'}
`).join('\n')}

## 3. Post-Assessment Sign-Off
All testing artifacts have been purged and verification re-tests are scheduled.
Certified by QUORVANE Security Architecture.`;
  };

  // ==========================================
  // STAGE 7 TOOLS: DEFENSIVE IMPROVEMENT
  // ==========================================
  const [defenseChecklist, setDefenseChecklist] = useState([
    { id: 'd1', category: 'Perimeter', label: 'Egress firewall restricts outbound database and LDAP ports', done: true },
    { id: 'd2', category: 'Identity', label: 'Multi-Factor Authentication (MFA) mandated on all SSO & VPN gateways', done: true },
    { id: 'd3', category: 'Endpoints', label: 'Endpoint Detection & Response (EDR) agent deployed across 100% of hosts', done: true },
    { id: 'd4', category: 'Web App', label: 'Web Application Firewall (WAF) running in active blocking mode', done: false },
    { id: 'd5', category: 'SIEM/Logging', label: 'Centralized immutable log aggregation with 90-day retention', done: true },
    { id: 'd6', category: 'Hardening', label: 'Default passwords changed and root SSH remote login disabled', done: false }
  ]);

  const toggleDefense = (id: string) => {
    setDefenseChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const defenseScore = Math.round(
    (defenseChecklist.filter((d) => d.done).length / defenseChecklist.length) * 100
  );

  // Stage tool metadata lists
  const stageToolDefinitions: Record<string, string[]> = {
    'stage-1': ['WHOIS Lookup', 'DNS Lookup', 'IP Information', 'Subdomain Discovery', 'OSINT Surface Analyzer', 'Live Kali Console'],
    'stage-2': ['Port Scanner Simulator', 'Network Discovery', 'Banner Grabber', 'HTTP Service Checker', 'Port Database', 'Live Kali Console'],
    'stage-3': ['CVE Information Viewer', 'CVSS v3.1 Calculator', 'Security Header Checker', 'Live Kali Console'],
    'stage-4': ['Safe Exploitation Concepts', 'Sanitized Input Tester', 'Live Kali Console'],
    'stage-5': ['Access & Privilege Audit', 'Post-Test Cleanup Checklist', 'Live Kali Console'],
    'stage-6': ['Finding Documentation', 'Security Report Generator', 'Live Kali Console'],
    'stage-7': ['Defensive Hardening Checklist', 'Security Posture Assessment', 'Live Kali Console']
  };

  const currentTools = stageToolDefinitions[stageId] || stageToolDefinitions['stage-1'];

  return (
    <div className="space-y-6">
      {/* Tool Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Stage 0{stageNumber} Working Tools Suite
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            {currentTools.length} Live Utilities
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentTools.map((toolName, idx) => (
            <button
              key={toolName}
              onClick={() => setActiveToolIndex(idx)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeToolIndex === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-[#040810] text-slate-300 hover:text-white hover:bg-[#0c1a2e] border border-slate-800'
              }`}
            >
              {toolName}
            </button>
          ))}
        </div>
      </div>

      {currentTools[activeToolIndex] === 'Live Kali Console' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>STAGE 0{stageNumber} INTEGRATED KALI TERMINAL</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Target Scope: target-corp.internal (Safe Enclave)
            </span>
          </div>
          <QuorvaneTerminal
            contextTarget="target-corp.internal"
            heightClass="h-[440px]"
          />
        </div>
      ) : (
        <>
          {/* =========================================================================
              STAGE 1 TOOL PANELS
             ========================================================================= */}
      {stageId === 'stage-1' && (
        <>
          {/* Tool 1.1: WHOIS Lookup */}
          {activeToolIndex === 0 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  WHOIS Domain Registration Lookup
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Query domain registrar details, registration lifecycle dates, nameservers, and DNSSEC parameters without contacting target servers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={whoisDomain}
                  onChange={(e) => setWhoisDomain(e.target.value)}
                  placeholder="e.g. target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runWhoisLookup}
                  disabled={whoisLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{whoisLoading ? 'Querying...' : 'Query WHOIS'}</span>
                </button>
              </div>

              {whoisResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-400 font-bold">
                    <span>WHOIS QUERY RESULTS ({whoisResult.domain})</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(whoisResult, null, 2), 'whois')}
                      className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-sans text-[11px]"
                    >
                      {copiedKey === 'whois' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div><span className="text-slate-500">Registrar:</span> {whoisResult.registrar}</div>
                    <div><span className="text-slate-500">Registrant Org:</span> {whoisResult.registrantOrg}</div>
                    <div><span className="text-slate-500">Created:</span> {whoisResult.creationDate}</div>
                    <div><span className="text-slate-500">Expires:</span> {whoisResult.expiryDate}</div>
                    <div><span className="text-slate-500">DNSSEC:</span> {whoisResult.dnssec}</div>
                    <div><span className="text-slate-500">Abuse Email:</span> {whoisResult.abuseEmail}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block mb-1">Authoritative Name Servers:</span>
                    {whoisResult.nameServers.map((ns: string, i: number) => (
                      <div key={i} className="text-cyan-300 pl-2">&bull; {ns}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 1.2: DNS Lookup */}
          {activeToolIndex === 1 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  Authoritative DNS Records Lookup
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Enumerate standard A, AAAA, MX mail exchangers, SPF authorization policies, and DMARC alignment records.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={dnsDomain}
                  onChange={(e) => setDnsDomain(e.target.value)}
                  placeholder="e.g. target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <select
                  value={dnsType}
                  onChange={(e) => setDnsType(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="ALL">ALL Records</option>
                  <option value="A">A (IPv4)</option>
                  <option value="MX">MX (Mail)</option>
                  <option value="TXT">TXT / SPF / DMARC</option>
                  <option value="NS">NS (Name Server)</option>
                </select>
                <button
                  onClick={runDnsLookup}
                  disabled={dnsLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{dnsLoading ? 'Resolving...' : 'Lookup DNS'}</span>
                </button>
              </div>

              {dnsResult && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#040810] text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                      <tr>
                        <th className="p-3">TYPE</th>
                        <th className="p-3">HOST</th>
                        <th className="p-3">RECORD VALUE</th>
                        <th className="p-3">TTL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                      {dnsResult.map((r, i) => (
                        <tr key={i} className="hover:bg-[#091527] transition-colors">
                          <td className="p-3 font-bold text-cyan-400">{r.type}</td>
                          <td className="p-3 text-slate-300">{r.name}</td>
                          <td className="p-3 text-white break-all">{r.value}</td>
                          <td className="p-3 text-slate-400">{r.ttl}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tool 1.3: IP Information */}
          {activeToolIndex === 2 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  IP Intelligence & Geolocation Profiler
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Inspect autonomous system numbers (ASN), hosting provider infrastructure, reverse PTR mappings, and threat reputation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={ipTarget}
                  onChange={(e) => setIpTarget(e.target.value)}
                  placeholder="e.g. 198.51.100.42"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runIpLookup}
                  disabled={ipLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{ipLoading ? 'Analyzing...' : 'Analyze IP'}</span>
                </button>
              </div>

              {ipResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-slate-300">
                    <div><span className="text-slate-500">Target IP:</span> <strong className="text-cyan-400">{ipResult.ip}</strong></div>
                    <div><span className="text-slate-500">Autonomous System:</span> {ipResult.asn}</div>
                    <div><span className="text-slate-500">Host Organization:</span> {ipResult.org}</div>
                    <div><span className="text-slate-500">Geo Location:</span> {ipResult.city}, {ipResult.region}, {ipResult.country}</div>
                    <div><span className="text-slate-500">Reverse PTR:</span> {ipResult.ptr}</div>
                    <div><span className="text-slate-500">Reputation:</span> <span className="text-cyan-300 font-semibold">{ipResult.threatScore}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 1.4: Subdomain Discovery Simulator */}
          {activeToolIndex === 3 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Subdomain Discovery Simulator (DNS Enumeration)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Discover exposed shadow IT, forgotten staging servers, and API gateways using wordlist brute-force simulation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={subTarget}
                  onChange={(e) => setSubTarget(e.target.value)}
                  placeholder="e.g. target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runSubdomainDiscovery}
                  disabled={subLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{subLoading ? 'Discovering...' : 'Run Discovery'}</span>
                </button>
              </div>

              {subdomains && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <div className="p-3 bg-[#040810] border-b border-slate-800 font-mono text-[11px] text-cyan-400 font-semibold">
                    DISCOVERED {subdomains.length} ACTIVE HOSTS
                  </div>
                  <div className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                    {subdomains.map((s, i) => (
                      <div key={i} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#091527] transition-colors">
                        <div>
                          <span className="font-bold text-white">{s.sub}</span>
                          <span className="text-slate-500 ml-2">({s.ip})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px] font-sans">{s.note}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 200 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            s.status === 401 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            HTTP {s.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 1.5: Passive OSINT Analyzer */}
          {activeToolIndex === 4 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Passive Reconnaissance & OSINT Surface Analyzer
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Correlate Certificate Transparency logs, cloud storage bucket exposure, and external web stack signatures.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={osintTarget}
                  onChange={(e) => setOsintTarget(e.target.value)}
                  placeholder="e.g. target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runOsintAnalysis}
                  disabled={osintLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{osintLoading ? 'Scanning...' : 'Analyze Surface'}</span>
                </button>
              </div>

              {osintResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 text-xs space-y-3 font-mono">
                  <div className="text-cyan-400 font-bold border-b border-slate-800 pb-2">
                    PASSIVE OSINT AGGREGATION FOR {osintTarget}
                  </div>
                  <div>
                    <span className="text-slate-500 block">Certificate Transparency SANs Found:</span>
                    {osintResult.certLogs.map((c: string, idx: number) => (
                      <div key={idx} className="text-slate-200 pl-3">&bull; {c}</div>
                    ))}
                  </div>
                  <div>
                    <span className="text-slate-500">Public Cloud Storage:</span>
                    <div className="text-slate-200 pl-3">{osintResult.cloudBuckets}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Credential Leak Check:</span>
                    <div className="text-cyan-300 pl-3">{osintResult.leakedCredsCheck}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Discovered Technology Stack:</span>
                    <div className="text-slate-200 pl-3">{osintResult.techStack}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          STAGE 2 TOOL PANELS: SCANNING & ENUMERATION
         ========================================================================= */}
      {stageId === 'stage-2' && (
        <>
          {/* Tool 2.1: Port Scanner */}
          {activeToolIndex === 0 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  TCP SYN / Connect Port Scanner Simulator
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Send simulated SYN probes across common ports to identify open listening services, version banners, and firewall packet drop states.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={scanHost}
                  onChange={(e) => setScanHost(e.target.value)}
                  placeholder="e.g. 198.51.100.42"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="syn">TCP SYN Scan (-sS)</option>
                  <option value="connect">Full TCP Connect (-sT)</option>
                  <option value="udp">UDP Service Scan (-sU)</option>
                </select>
                <button
                  onClick={runPortScan}
                  disabled={scanLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{scanLoading ? 'Scanning...' : 'Execute Scan'}</span>
                </button>
              </div>

              {scanPortsResult && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#040810] text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                      <tr>
                        <th className="p-3">PORT</th>
                        <th className="p-3">STATE</th>
                        <th className="p-3">SERVICE</th>
                        <th className="p-3">VERSION / DISCLOSURE</th>
                        <th className="p-3">RTT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                      {scanPortsResult.map((p, i) => (
                        <tr key={i} className="hover:bg-[#091527] transition-colors">
                          <td className="p-3 font-bold text-white">{p.port}/{p.proto}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.state === 'open' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                              p.state === 'filtered' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {p.state.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-cyan-400 font-semibold">{p.service}</td>
                          <td className="p-3 text-slate-300">{p.version}</td>
                          <td className="p-3 text-slate-500">{p.latency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tool 2.2: Network Discovery Simulator */}
          {activeToolIndex === 1 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Subnet Host Discovery (ARP &amp; Ping Sweep)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Sweep target CIDR subnets to locate active live IP addresses, MAC manufacturer vendors, and OS fingerprints.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={subnetCidr}
                  onChange={(e) => setSubnetCidr(e.target.value)}
                  placeholder="e.g. 192.168.10.0/24"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runNetworkDiscovery}
                  disabled={netLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{netLoading ? 'Sweeping...' : 'Sweep Subnet'}</span>
                </button>
              </div>

              {netHosts && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <div className="p-3 bg-[#040810] border-b border-slate-800 font-mono text-[11px] text-cyan-400 font-semibold">
                    FOUND {netHosts.length} ACTIVE HOSTS ON {subnetCidr}
                  </div>
                  <div className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                    {netHosts.map((h, i) => (
                      <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#091527] transition-colors">
                        <div>
                          <span className="font-bold text-cyan-300">{h.ip}</span>
                          <span className="text-slate-400 ml-2 font-sans">({h.role})</span>
                        </div>
                        <div className="text-slate-300 text-xs">
                          <span className="text-slate-500 mr-2">Vendor:</span>{h.vendor} &bull; <span className="text-slate-500 ml-2 mr-1">OS:</span>{h.os}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 2.3: Banner Grabber */}
          {activeToolIndex === 2 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Service Banner Grabber &amp; Version Fingerprinter
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Connect directly to authorized target ports and capture raw protocol greeting strings disclosing software builds.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={bannerHost}
                  onChange={(e) => setBannerHost(e.target.value)}
                  placeholder="e.g. 198.51.100.42"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <input
                  type="text"
                  value={bannerPort}
                  onChange={(e) => setBannerPort(e.target.value)}
                  placeholder="Port (e.g. 22 or 80)"
                  className="w-32 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runBannerGrab}
                  disabled={bannerLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{bannerLoading ? 'Grabbing...' : 'Grab Banner'}</span>
                </button>
              </div>

              {bannerResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono space-y-2">
                  <div className="text-cyan-400 font-bold">RAW PROTOCOL RESPONSE BANNER</div>
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{bannerResult}</pre>
                </div>
              )}
            </div>
          )}

          {/* Tool 2.4: HTTP Service Checker */}
          {activeToolIndex === 3 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  HTTP/HTTPS Service Checker
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Probe target web servers for response latency, HTTP/2 or HTTP/3 protocol support, and TLS cipher negotiation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={httpUrl}
                  onChange={(e) => setHttpUrl(e.target.value)}
                  placeholder="e.g. https://target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runHttpCheck}
                  disabled={httpLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{httpLoading ? 'Checking...' : 'Check Service'}</span>
                </button>
              </div>

              {httpResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div><span className="text-slate-500">Target:</span> {httpResult.url}</div>
                    <div><span className="text-slate-500">Status:</span> <span className="text-cyan-400 font-bold">{httpResult.statusCode} {httpResult.statusText}</span></div>
                    <div><span className="text-slate-500">Latency:</span> {httpResult.responseTime}</div>
                    <div><span className="text-slate-500">Protocol:</span> {httpResult.httpVersion}</div>
                    <div><span className="text-slate-500">TLS Suite:</span> {httpResult.tlsVersion}</div>
                    <div><span className="text-slate-500">Certificate:</span> {httpResult.certIssuer}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 2.5: Port Reference Database */}
          {activeToolIndex === 4 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Cybersecurity Port Reference Database
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Search across standard and specialized networking ports, associated service daemons, and security risks.
                </p>
              </div>

              <input
                type="text"
                value={portSearch}
                onChange={(e) => setPortSearch(e.target.value)}
                placeholder="Filter by port number (e.g. 445), service (e.g. ssh), or description..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
              />

              <div className="rounded-xl border border-slate-800 max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#040810] text-slate-400 sticky top-0 border-b border-slate-800 font-mono text-[11px]">
                    <tr>
                      <th className="p-2.5">PORT</th>
                      <th className="p-2.5">SERVICE</th>
                      <th className="p-2.5">DESCRIPTION & RISKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                    {filteredPorts.map((p, i) => (
                      <tr key={i} className="hover:bg-[#091527] transition-colors">
                        <td className="p-2.5 text-cyan-400 font-bold">{p.port}</td>
                        <td className="p-2.5 text-white">{p.service}</td>
                        <td className="p-2.5 text-slate-300 font-sans">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          STAGE 3 TOOL PANELS: VULNERABILITY ASSESSMENT
         ========================================================================= */}
      {stageId === 'stage-3' && (
        <>
          {/* Tool 3.1: CVE Information Viewer */}
          {activeToolIndex === 0 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  CVE National Vulnerability Database Viewer
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Query standardized Common Vulnerabilities and Exposures (CVE) records, CVSS scores, CISA KEV status, and official mitigation recipes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={cveSearch}
                  onChange={(e) => setCveSearch(e.target.value)}
                  placeholder="e.g. CVE-2021-44228 or CVE-2024-3094"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none uppercase"
                />
                <button
                  onClick={runCveLookup}
                  disabled={cveLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{cveLoading ? 'Searching...' : 'Lookup CVE'}</span>
                </button>
              </div>

              {cveResult && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-mono font-bold text-cyan-400 text-sm">{cveResult.id}</span>
                      <span className="text-slate-300 font-semibold ml-2">{cveResult.name}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                      cveResult.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      CVSS {cveResult.cvss} &bull; {cveResult.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{cveResult.description}</p>
                  <div className="p-3 rounded-lg bg-[#071526] border border-cyan-500/30 font-mono text-[11px] text-cyan-300">
                    Vector: {cveResult.vector}
                  </div>
                  <div className="p-3 rounded-lg bg-[#06101c] border border-slate-800 text-slate-300">
                    <strong className="text-cyan-400 block mb-1">Recommended Mitigation:</strong>
                    {cveResult.mitigation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 3.2: CVSS Calculator */}
          {activeToolIndex === 1 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    CVSS v3.1 Base Score Calculator
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Calculate standardized Common Vulnerability Scoring System metrics across Exploitability and Impact dimensions.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#08182b] border border-cyan-500/40 text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Calculated Severity</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    {cvssScoreData.score} &bull; <span className="text-white text-sm">{cvssScoreData.severity}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Attack Vector (AV)</label>
                  <select
                    value={cvssAv}
                    onChange={(e) => setCvssAv(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="N">Network (Remote)</option>
                    <option value="A">Adjacent (LAN)</option>
                    <option value="L">Local</option>
                    <option value="P">Physical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Attack Complexity (AC)</label>
                  <select
                    value={cvssAc}
                    onChange={(e) => setCvssAc(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="L">Low (Routine)</option>
                    <option value="H">High (Special conditions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Privileges Required (PR)</label>
                  <select
                    value={cvssPr}
                    onChange={(e) => setCvssPr(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="N">None (Unauthenticated)</option>
                    <option value="L">Low (Standard user)</option>
                    <option value="H">High (Administrator)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">User Interaction (UI)</label>
                  <select
                    value={cvssUi}
                    onChange={(e) => setCvssUi(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="N">None</option>
                    <option value="R">Required (Phish/Click)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Confidentiality (C)</label>
                  <select
                    value={cvssConf}
                    onChange={(e) => setCvssConf(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="H">High (Full disclosure)</option>
                    <option value="L">Low (Partial)</option>
                    <option value="N">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Integrity (I)</label>
                  <select
                    value={cvssInteg}
                    onChange={(e) => setCvssInteg(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="H">High (Full modification)</option>
                    <option value="L">Low (Partial)</option>
                    <option value="N">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Availability (A)</label>
                  <select
                    value={cvssAvail}
                    onChange={(e) => setCvssAvail(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="H">High (Complete shutdown)</option>
                    <option value="L">Low (Degraded)</option>
                    <option value="N">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Scope (S)</label>
                  <select
                    value={cvssScope}
                    onChange={(e) => setCvssScope(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[#040810] border border-slate-800 text-white outline-none cursor-pointer"
                  >
                    <option value="U">Unchanged</option>
                    <option value="C">Changed (Cross-boundary)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#040810] border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Vector String:</span>
                <span className="text-cyan-400 font-bold">{cvssScoreData.vector}</span>
                <button
                  onClick={() => copyToClipboard(cvssScoreData.vector, 'cvss')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-sans"
                >
                  {copiedKey === 'cvss' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          )}

          {/* Tool 3.3: Security Header Checker */}
          {activeToolIndex === 2 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  HTTP Security Header Compliance Auditor
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Audit web response headers for defense-in-depth protections: HSTS, Content Security Policy, and frame clickjacking guards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={headerUrl}
                  onChange={(e) => setHeaderUrl(e.target.value)}
                  placeholder="e.g. https://target-corp.internal"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={runHeaderAudit}
                  disabled={headerLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{headerLoading ? 'Auditing...' : 'Audit Headers'}</span>
                </button>
              </div>

              {headerAudit && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#08182b] border border-cyan-500/30 text-xs">
                    <span className="text-slate-300 font-semibold">Security Header Grade</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/40">
                      GRADE: {headerAudit.grade}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                    <div className="divide-y divide-slate-800/80 font-mono bg-[#050b14]">
                      {headerAudit.headers.map((h: any, i: number) => (
                        <div key={i} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-[#091527]">
                          <div>
                            <span className="text-white font-bold block">{h.name}</span>
                            <span className="text-slate-400 text-[11px]">{h.value}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-auto ${
                            h.status === 'PASS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          STAGE 4 TOOL PANELS: EXPLOITATION (SAFE CONCEPTS)
         ========================================================================= */}
      {stageId === 'stage-4' && (
        <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>STRICTLY CONTROLLED EDUCATIONAL ENVIRONMENT</span>
            </div>
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Safe Vulnerability &amp; Payload Execution Simulator
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Observe how attack strings alter interpreter logic in an un-sanitized environment versus how parameterized defenses eliminate the vulnerability entirely.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'sqli', label: 'SQL Injection', sample: "' OR '1'='1" },
              { id: 'xss', label: 'Reflected XSS', sample: "<script>alert(document.cookie)</script>" },
              { id: 'cmdi', label: 'Command Injection', sample: "127.0.0.1; whoami" },
              { id: 'traversal', label: 'Path Traversal', sample: "../../../../etc/passwd" }
            ].map((concept) => (
              <button
                key={concept.id}
                onClick={() => {
                  setExploitConcept(concept.id as any);
                  setSimulatedPayload(concept.sample);
                  setSimOutput(null);
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  exploitConcept === concept.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-[#040810] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {concept.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Simulated Payload String
              </label>
              <input
                type="text"
                value={simulatedPayload}
                onChange={(e) => setSimulatedPayload(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-cyan-300 outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#040810] border border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200 font-semibold">Enable Defense Filter (Prepared Statements / HTML Encoding)</span>
              </div>
              <input
                type="checkbox"
                checked={simFilterActive}
                onChange={(e) => setSimFilterActive(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <button
              onClick={runExploitSimulation}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Simulate Parser Execution</span>
            </button>
          </div>

          {simOutput && (
            <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-cyan-400 font-bold">SIMULATED EXECUTION TELEMETRY</div>
              <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{simOutput}</pre>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STAGE 5 TOOL PANELS: POST-EXPLOITATION
         ========================================================================= */}
      {stageId === 'stage-5' && (
        <div className="space-y-6">
          {/* Privilege Audit */}
          {activeToolIndex === 0 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Access &amp; Privilege Analysis Simulator
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Audit current process security context, SUID permissions, and un-quoted path privilege escalation vectors without modifying host configurations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-semibold">Simulated User Context:</span>
                <select
                  value={privUser}
                  onChange={(e) => setPrivUser(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="www-data">www-data (Service Account with Sudo Misconfiguration)</option>
                  <option value="guest_user">guest_user (Restricted Least-Privilege Account)</option>
                  <option value="local_admin">local_admin (Full Root Administrator)</option>
                </select>
                <button
                  onClick={runPrivCheck}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Audit Permissions
                </button>
              </div>

              {privCheckOutput && (
                <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 text-xs font-mono space-y-2">
                  <div className="text-cyan-400 font-bold">PRIVILEGE AUDIT TRACE</div>
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{privCheckOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* Cleanup Checklist */}
          {activeToolIndex === 1 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Post-Assessment Artifact Cleanup Protocol
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  A professional mandatory checklist ensuring zero residual testing artifacts, test accounts, or persistent backdoors remain on the customer system.
                </p>
              </div>

              <div className="space-y-2.5">
                {cleanupItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#040810] border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleCleanup(item.id)}
                      className="mt-0.5 w-4 h-4 accent-cyan-500 cursor-pointer"
                    />
                    <span className={`text-xs ${item.done ? 'text-slate-200 line-through' : 'text-white'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STAGE 6 TOOL PANELS: REPORTING
         ========================================================================= */}
      {stageId === 'stage-6' && (
        <div className="space-y-6">
          {/* Finding Documentation Tool */}
          {activeToolIndex === 0 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Finding Documentation &amp; Risk Rating Tool
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Document technical security defects, assign severity ratings, and structure reproducible steps for development teams.
                </p>
              </div>

              <form onSubmit={addFinding} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Finding Title</label>
                    <input
                      type="text"
                      required
                      value={newFindingTitle}
                      onChange={(e) => setNewFindingTitle(e.target.value)}
                      placeholder="e.g. Unauthenticated API Endpoint Disclosing PII"
                      className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Severity</label>
                    <select
                      value={newFindingSeverity}
                      onChange={(e) => setNewFindingSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-800 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="CRITICAL">CRITICAL (9.0 - 10.0)</option>
                      <option value="HIGH">HIGH (7.0 - 8.9)</option>
                      <option value="MEDIUM">MEDIUM (4.0 - 6.9)</option>
                      <option value="LOW">LOW (0.1 - 3.9)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Affected Asset URL or IP</label>
                  <input
                    type="text"
                    required
                    value={newFindingAsset}
                    onChange={(e) => setNewFindingAsset(e.target.value)}
                    placeholder="e.g. https://api.target-corp.internal/v1/users"
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Description &amp; Reproduction</label>
                  <textarea
                    rows={2}
                    value={newFindingDesc}
                    onChange={(e) => setNewFindingDesc(e.target.value)}
                    placeholder="Document root cause, exploit proof-of-concept, and engineering remediation..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040810] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  + Add Finding to Report
                </button>
              </form>

              {/* Current Findings List */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="text-xs font-bold uppercase text-slate-400">Current Assessment Findings ({findings.length})</div>
                {findings.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl bg-[#040810] border border-slate-800 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          f.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          f.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {f.severity}
                        </span>
                        <span className="font-bold text-white">{f.title}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1 font-mono">Asset: {f.asset}</div>
                      <p className="text-slate-300 text-xs mt-1">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Report Generator */}
          {activeToolIndex === 1 && (
            <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    Structured Security Report Generator &amp; Exporter
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Compile executive summary, vulnerability metrics, and remediation SLAs into a structured security deliverable.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(generateReportMarkdown(), 'report')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'report' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'report' ? 'Copied' : 'Copy Report'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-slate-200">
                <pre className="whitespace-pre-wrap leading-relaxed">{generateReportMarkdown()}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STAGE 7 TOOL PANELS: DEFENSIVE IMPROVEMENT
         ========================================================================= */}
      {stageId === 'stage-7' && (
        <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Defensive Hardening Checklist &amp; Posture Score
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Implement structured defense-in-depth engineering controls to remediate penetration test findings and harden the perimeter.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#08182b] border border-cyan-500/40 text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Posture Hardening</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">{defenseScore}% Ready</div>
            </div>
          </div>

          <div className="space-y-2.5">
            {defenseChecklist.map((d) => (
              <label
                key={d.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#040810] border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={d.done}
                  onChange={() => toggleDefense(d.id)}
                  className="mt-0.5 w-4 h-4 accent-cyan-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] mr-2">[{d.category}]</span>
                  <span className={d.done ? 'text-white' : 'text-slate-400'}>{d.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
