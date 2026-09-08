import type { FrameworkStage, AcademyModule, CyberLab, Achievement } from '../types';

export const FRAMEWORK_STAGES: FrameworkStage[] = [
  {
    id: 'stage-1',
    stepNumber: 1,
    name: 'Reconnaissance',
    tagline: 'Passive OSINT & Active Threat Surface Discovery',
    purpose: 'Gather intelligence regarding target infrastructure, technologies, employee exposure, and leaked credentials using non-intrusive and open-source methods.',
    authorizedUse: 'Inspect public DNS records, WHOIS data, certificate transparency logs (crt.sh), public code repositories for leaked secrets, and employee search surfaces.',
    learningObjectives: [
      'Differentiate Passive Recon (zero contact with target) from Active Recon',
      'Query Certificate Transparency (CT) logs to uncover forgotten subdomains',
      'Audit DNS records (MX, TXT, SPF, DMARC) for misconfigurations',
      'Identify credential spillages in public repositories and archive caches'
    ],
    recommendedTools: [
      { name: 'Whois', purpose: 'Domain registrar and ASN lookup', safeUsageNote: 'Zero packet interaction with target' },
      { name: 'crt.sh', purpose: 'Certificate Transparency log search', safeUsageNote: 'Public queries only' },
      { name: 'theHarvester', purpose: 'OSINT gathering of emails and subdomains', safeUsageNote: 'Search engine aggregation' },
      { name: 'Shodan', purpose: 'Internet-connected device search engine', safeUsageNote: 'Passive database query' },
      { name: 'Recon-ng', purpose: 'Full-featured web reconnaissance framework', safeUsageNote: 'Target modular API queries' }
    ],
    activities: [
      'DNS enumeration (A, CNAME, TXT, SRV records)',
      'Subdomain discovery via Certificate Transparency logs',
      'Open Source Intelligence (OSINT) profiling of web stack and cloud buckets',
      'Social engineering vector discovery (executive profiles, job postings disclosing tech stacks)'
    ],
    defensiveRelevance: 'Defenders use reconnaissance to see their company through the eyes of an adversary, discovering forgotten staging servers and shadow IT before attackers do.',
    safetyBoundaries: [
      'Never interact with employees in social engineering unless explicitly outlined in the Rules of Engagement',
      'Do not download private customer data if found in an open bucket—document and report immediately',
      'Avoid triggering active web crawlers that may flood low-bandwidth branch offices'
    ],
    realWorldExample: {
      title: 'The Forgotten Staging Subdomain',
      scenario: 'A healthcare platform kept dev-api.company.com active after a sprint, exposing internal Swagger docs with no authentication.',
      offensivePerspective: 'Attackers queried crt.sh, located dev-api.company.com, and retrieved database connection strings from the documentation portal.',
      defensiveMitigation: 'Implement automated External Attack Surface Management (EASM) to track all DNS subdomains and decommission orphaned DNS records.'
    },
    interactiveExercise: {
      prompt: 'You are conducting passive reconnaissance on target domain target-corp.internal. You find a DNS TXT record containing: "v=spf1 include:_spf.google.com ip4:203.0.113.50 -all".',
      task: 'What defensive intelligence does this disclose to an ethical analyst?',
      options: [
        'The company does not use Google Workspace and has no mail servers.',
        'Only Google and the specific IP 203.0.113.50 are authorized mail relays; other senders will be rejected (-all).',
        'The target network is running an unpatched mail transfer agent on port 25.',
        'The target server has an open relay vulnerability.'
      ],
      correctAnswerIndex: 1,
      explanation: 'The SPF record with hard-fail (-all) indicates strict email authorization. Unauthorized spoofing will be rejected by compliant mail servers, a key defensive indicator.'
    }
  },
  {
    id: 'stage-2',
    stepNumber: 2,
    name: 'Scanning & Enumeration',
    tagline: 'Port Probing, Service Fingerprinting & Banner Grabbing',
    purpose: 'Identify open ports, active services, software versions, and operating system signatures across the authorized target network.',
    authorizedUse: 'Deploy calibrated SYN scans, service version detection (-sV), and default vulnerability scripts within agreed bandwidth limits.',
    learningObjectives: [
      'Understand TCP 3-way handshake manipulation in SYN (stealth) vs. Full Connect scanning',
      'Extract software banners to map exact service release versions',
      'Detect firewalls and rate-limiting filtering behaviors',
      'Minimize operational noise and network disruption'
    ],
    recommendedTools: [
      { name: 'Nmap', purpose: 'Network discovery and service fingerprinting', safeUsageNote: 'Throttle with -T3 and verify scope' },
      { name: 'Masscan', purpose: 'High-speed asynchronous port scanning', safeUsageNote: 'Use strictly in isolated ranges' },
      { name: 'Wireshark', purpose: 'Packet protocol capture and inspection', safeUsageNote: 'Passive packet sniffer' },
      { name: 'Gobuster', purpose: 'URI directory and DNS brute-forcing', safeUsageNote: 'Set rate-limits' },
      { name: 'Nikto', purpose: 'Web server misconfiguration scanner', safeUsageNote: 'Authorized web targets only' }
    ],
    activities: [
      'Network host discovery (ICMP, ARP, TCP SYN ping sweeps)',
      'Port state classification (Open, Closed, Filtered)',
      'Banner grabbing across HTTP, SSH, FTP, SMTP, and database ports',
      'SNMP community string inspection and SMB share enumeration'
    ],
    defensiveRelevance: 'Enables defenders to harden perimeter firewalls, disable unnecessary daemon services, and ensure internal network segmentation restricts lateral discovery.',
    safetyBoundaries: [
      'Throttle scan rates (e.g., T2 or T3 in Nmap) to prevent tripping legacy industrial devices or knocking down fragile routers',
      'Never send raw fuzzing packets during an enumeration pass',
      'Coordinate with the Security Operations Center (SOC) so they can test their IDS detection alerts'
    ],
    realWorldExample: {
      title: 'Legacy Telnet on a Critical Router',
      scenario: 'A stateful port scan identified TCP port 23 open on an internal core switch that had been operational without reboot for 6 years.',
      offensivePerspective: 'Cleartext credentials could be intercepted via network sniffing or brute-forced without modern lockouts.',
      defensiveMitigation: 'Shut down Port 23 globally, mandate SSHv2 with Ed25519 keys, and implement network access control (NAC).'
    },
    interactiveExercise: {
      prompt: 'During an Nmap scan, Port 443 returns state "filtered" while Port 80 returns "open".',
      task: 'What does the "filtered" state mathematically indicate in network terms?',
      options: [
        'The web server application is listening on 443 and actively refused the connection.',
        'A firewall or packet filter is dropping the probes, preventing probe packets from reaching the port or returning an RST.',
        'The SSL certificate has expired.',
        'The port is open but has no HTTP service bound to it.'
      ],
      correctAnswerIndex: 1,
      explanation: 'In Nmap and TCP terminology, "filtered" means no response was received (or an ICMP unreachable error was returned), indicating a packet filter or firewall is blocking traffic.'
    }
  },
  {
    id: 'stage-3',
    stepNumber: 3,
    name: 'Vulnerability Analysis',
    tagline: 'Flaw Identification, CVSS Scoring & Root Cause Triaging',
    purpose: 'Systematically analyze discovered assets against known vulnerability databases (CVE/NVD), security misconfigurations, and weak defaults.',
    authorizedUse: 'Run authenticated and unauthenticated vulnerability auditing tools, verify software version against the National Vulnerability Database, and calculate CVSS v3.1 vectors.',
    learningObjectives: [
      'Navigate the Common Vulnerabilities and Exposures (CVE) dictionary',
      'Calculate Base, Temporal, and Environmental CVSS scores',
      'Distinguish false positives from actionable security defects',
      'Evaluate vulnerability chaining potential (e.g., SSRF + metadata service)'
    ],
    recommendedTools: [
      { name: 'OpenVAS', purpose: 'Full-fledged open vulnerability scanner', safeUsageNote: 'Schedule during maintenance windows' },
      { name: 'Nessus', purpose: 'Comprehensive compliance and vulnerability assessment', safeUsageNote: 'Authenticate safely' },
      { name: 'Nuclei', purpose: 'Fast template-based targeted vulnerability scanner', safeUsageNote: 'Audit YAML templates before run' },
      { name: 'OWASP ZAP', purpose: 'Web application vulnerability scanner', safeUsageNote: 'Non-destructive automated spidering' },
      { name: 'Trivy', purpose: 'Container image and SBOM vulnerability scanner', safeUsageNote: 'Safe build-pipeline integration' }
    ],
    activities: [
      'Automated flaw scanning (OpenVAS, Nuclei, Nessus)',
      'Manual verification of software version CVE databases',
      'Configuration auditing of SSL/TLS cipher suites and web headers',
      'Dependency analysis of third-party libraries and container images'
    ],
    defensiveRelevance: 'Allows blue teams to prioritize patching based on real exploitability and asset criticality rather than panic-driven reactions.',
    safetyBoundaries: [
      'Do not execute destructive exploit scripts to prove vulnerability existence',
      'Validate that scanners do not fill live transaction databases with test garbage',
      'Protect all scan report files with encryption at rest'
    ],
    realWorldExample: {
      title: 'The Log4Shell (CVE-2021-44228) Triage',
      scenario: 'A legacy microservice parsed user-agent strings using unpatched Apache Log4j 2.14.',
      offensivePerspective: 'Injecting JNDI lookup strings allowed remote arbitrary code execution with root container privileges.',
      defensiveMitigation: 'Patch to Log4j 2.17.1+, disable JNDI lookup flags, and implement outbound firewall egress filtering.'
    },
    interactiveExercise: {
      prompt: 'A vulnerability has CVSS vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H.',
      task: 'What does AV:N and PR:N mean regarding attacker prerequisites?',
      options: [
        'Access Vector: Network (remotely exploitable over internet), Privileges Required: None (no authentication required).',
        'Access Vector: Neighbor (LAN only), Privileges Required: Network user.',
        'Access Vector: Physical, Privileges Required: None.',
        'Access Vector: Network, Privileges Required: Root administrator.'
      ],
      correctAnswerIndex: 0,
      explanation: 'AV:N (Network) and PR:N (None) represents the highest risk tier: remote unauthenticated exploitation without any pre-existing credentials.'
    }
  },
  {
    id: 'stage-4',
    stepNumber: 4,
    name: 'Exploitation',
    tagline: 'Proof of Concept (PoC) & Safe Privilege Verification',
    purpose: 'Safely execute surgical proofs-of-concept to confirm that an identified vulnerability is genuinely exploitable and determine its practical risk.',
    authorizedUse: 'Execute safe, benign commands (e.g., `id`, `whoami`, retrieving static test canary files) without modifying system state or installing persistent backdoors.',
    learningObjectives: [
      'Execute non-destructive Proof-of-Concept demonstrations',
      'Demonstrate business risk without threatening system availability',
      'Avoid trigger mechanisms that could corrupt production data',
      'Document exact timestamps for SOC correlation and forensics'
    ],
    recommendedTools: [
      { name: 'Metasploit', purpose: 'Modular exploit execution and PoC verification', safeUsageNote: 'Select check modules and harmless payloads' },
      { name: 'Burp Suite', purpose: 'Web HTTP request interception and modification', safeUsageNote: 'Observe rate limits and scopes' },
      { name: 'SQLmap', purpose: 'Automated SQL injection detection and PoC', safeUsageNote: 'Do NOT drop or tamper with tables' },
      { name: 'Hydra', purpose: 'Network login authentication tester', safeUsageNote: 'Set conservative lockout thresholds' }
    ],
    activities: [
      'Benign payload delivery (e.g., harmless canary file creation in /tmp)',
      'Authentication bypass proof-of-concept using mock accounts',
      'Proof of privilege escalation via read-only system calls',
      'Verification of firewall and EDR evasion defense responses'
    ],
    defensiveRelevance: 'Proves to executive leadership that an issue is an urgent risk rather than a hypothetical scanner warning, justifying security budget and engineering time.',
    safetyBoundaries: [
      'NEVER exfiltrate sensitive customer data (PII, credit cards, health records)',
      'Do not change admin passwords or lock out legitimate administrators',
      'Always log exact start/stop timestamps and originating IP address for SOC audit'
    ],
    realWorldExample: {
      title: 'The Benign SQLi Canary Extraction',
      scenario: 'An auditor verified an SQL injection vulnerability in a search form.',
      offensivePerspective: 'Instead of dumping customer tables, the auditor executed `SELECT @@version` and captured the DBMS release string.',
      defensiveMitigation: 'Client was able to remediate with parameterized queries within 2 hours without exposing confidential records.'
    },
    interactiveExercise: {
      prompt: 'You discover a Remote Code Execution (RCE) flaw in a document conversion service on an authorized production system.',
      task: 'Which command demonstrates the vulnerability while following safe ethical boundaries?',
      options: [
        'rm -rf / --no-preserve-root to test write permissions.',
        'whoami && uname -a to capture process identity and kernel version harmlessly.',
        'Download and execute an off-the-shelf cryptocurrency miner to check sustained CPU.',
        'Dump the /etc/shadow file and upload it to a public cracking site.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Benign read-only commands like `whoami` and `uname -a` verify code execution cleanly without risking data loss, downtime, or compliance penalties.'
    }
  },
  {
    id: 'stage-5',
    stepNumber: 5,
    name: 'Post-Exploitation',
    tagline: 'Artifact Cleanup, Forensic Footprint & Lateral Audit',
    purpose: 'Understand lateral movement paths, privilege escalation boundaries, and remove all test accounts, temporary canary files, and scripts, restoring the environment to its pristine state.',
    authorizedUse: 'Audit Active Directory trust hierarchies (read-only), inspect local configuration weaknesses, and systematically reverse all temporary test state modifications.',
    learningObjectives: [
      'Audit Active Directory trust relationships using read-only enumeration',
      'Identify local misconfigurations that enable lateral pivoting',
      'Execute a rigorous post-test cleanup checklist',
      'Cross-reference auditor actions against SIEM/EDR detection alerts'
    ],
    recommendedTools: [
      { name: 'BloodHound', purpose: 'Active Directory attack path graphing (read-only)', safeUsageNote: 'Collect via SharpHound on low thread rate' },
      { name: 'LinPEAS / WinPEAS', purpose: 'Local privilege escalation audit script', safeUsageNote: 'Run with safe read-only flags' },
      { name: 'Mimikatz', purpose: 'Windows LSASS authentication mechanics audit', safeUsageNote: 'Use only on isolated test VMs' },
      { name: 'Chisel', purpose: 'TCP/UDP port tunneling for reachability auditing', safeUsageNote: 'Tear down tunnels immediately after test' }
    ],
    activities: [
      'Auditing internal domain trusts and privilege chains',
      'Deletion of test accounts, temporary canary files, and test databases',
      'Restoration of modified configuration files to original baselines',
      'Debrief with the internal SOC team on detection timeline and blind spots'
    ],
    defensiveRelevance: 'Enforces principle of least privilege (PoLP), eliminates domain admin sprawl, and prevents abandoned testing artifacts from becoming backdoors.',
    safetyBoundaries: [
      'Never leave a backdoor, web shell, or unmonitored test account behind',
      'Obtain written verification from the client system administrator that cleanup was verified',
      'Maintain an immutable record of all forensic actions and files created'
    ],
    realWorldExample: {
      title: 'The Orphaned Web Shell Debacle',
      scenario: 'An external testing firm uploaded a PHP web shell to prove upload validation bypass but forgot to delete it after the test ended.',
      offensivePerspective: 'Two months later, an internet crawler discovered the unprotected shell and deployed ransomware.',
      defensiveMitigation: 'Strict post-engagement cleanup sign-offs and automated file integrity monitoring (FIM) alerting on unauthorized .php files.'
    },
    interactiveExercise: {
      prompt: 'You finished testing a customer staging environment where you created a test user account "sec_audit_2026".',
      task: 'What is the required post-assessment step?',
      options: [
        'Leave the account active in case the client wants you to test again next quarter.',
        'Change the password to something simple and give it to a developer.',
        'Delete the account or request the sysadmin disable and purge it, documenting the action in the cleanup log.',
        'Export the user credentials to your local laptop.'
      ],
      correctAnswerIndex: 2,
      explanation: 'All test accounts and temporary privileges must be explicitly removed and audited during post-assessment to eliminate residual attack surfaces.'
    }
  },
  {
    id: 'stage-6',
    stepNumber: 6,
    name: 'Reporting & Remediation',
    tagline: 'Executive Insights, Technical Documentation & Verification',
    purpose: 'Translate technical vulnerabilities into actionable business risks, provide step-by-step engineering remediation guidelines, and re-test patches.',
    authorizedUse: 'Deliver encrypted security reports, conduct executive and engineering debriefs, supply copy-paste secure code recipes, and conduct re-testing.',
    learningObjectives: [
      'Structure an Executive Summary tailored to C-suite risk appetite',
      'Provide reproducible proof-of-concept steps for software engineers',
      'Formulate Defense-in-Depth remediation roadmaps',
      'Conduct verification re-tests to validate remediation effectiveness'
    ],
    recommendedTools: [
      { name: 'CVSS 3.1 Calculator', purpose: 'Standardized vulnerability severity scoring', safeUsageNote: 'Standardized formula scoring' },
      { name: 'Dradis Framework', purpose: 'Collaborative penetration testing reporting portal', safeUsageNote: 'Secure internal database' },
      { name: 'Joplin / Markdown', purpose: 'Structured findings documentation', safeUsageNote: 'GPG encrypted storage' },
      { name: 'DefectDojo', purpose: 'Vulnerability management and remediation tracking', safeUsageNote: 'Central tracking workflow' }
    ],
    activities: [
      'Drafting executive summary with business impact and risk matrix',
      'Technical vulnerability writeups with CVSS, evidence, and remediation',
      'Engineering workshop / technical debrief with development teams',
      'Patch verification and sign-off certification'
    ],
    defensiveRelevance: 'The ultimate deliverable of ethical hacking. Without high-quality reporting and remediation, testing is merely disruptive without making the organization safer.',
    safetyBoundaries: [
      'Encrypt the report both in transit and at rest using strong PGP/TLS with passwords transmitted out-of-band',
      'Never publish or share findings with unauthorized third parties or public forums',
      'Mask customer data and credentials in all screenshots and report appendixes'
    ],
    realWorldExample: {
      title: 'The Actionable Fix vs. The Ignored 200-Page PDF',
      scenario: 'A company ignored a massive automated vulnerability scanner dump. A subsequent penetration test gave 3 prioritized issues with exact code snippets.',
      offensivePerspective: 'Clear prioritization allowed the team to patch the critical authentication bypass within 24 hours.',
      defensiveMitigation: 'Prioritized, contextual reports save developer time and accelerate Mean Time to Remediate (MTTR).'
    },
    interactiveExercise: {
      prompt: 'When presenting findings to the Chief Executive Officer (CEO) and Board of Directors, what should the report focus on?',
      task: 'Choose the most effective reporting approach:',
      options: [
        'A raw dump of 4,000 Nmap terminal outputs and hex code traces.',
        'Business risk, compliance implications, financial exposure, and high-level strategic roadmap for defense.',
        'Blaming individual software engineers for syntax oversights.',
        'Telling them to shut down the internet connection permanently.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Executive reporting must contextualize vulnerabilities into business terms: financial impact, compliance risk, operational continuity, and strategic defensive priorities.'
    }
  },
  {
    id: 'stage-7',
    stepNumber: 7,
    name: 'Defensive Engineering',
    tagline: 'Blue Team Hardening, Detection Rules & Threat Hunting',
    purpose: 'Implement structural defenses, intrusion detection signatures, SIEM correlation rules, and zero-trust policies to ensure long-term resilience against persistent threats.',
    authorizedUse: 'Configure firewall rules, deploy open-source EDR agents, write Sigma / Suricata detection rules, and configure web application firewalls.',
    learningObjectives: [
      'Translate penetration testing findings into active SIEM/IDS detection rules',
      'Deploy defense-in-depth principles (least privilege, network segmentation)',
      'Construct Sigma rules for Windows Event Log detection',
      'Harden container and cloud IAM configurations against privilege escalation'
    ],
    recommendedTools: [
      { name: 'Suricata / Snort', purpose: 'Network Intrusion Detection & Prevention System (IDS/IPS)', safeUsageNote: 'Run in inspection mode' },
      { name: 'Wazuh SIEM / XDR', purpose: 'Open source host-based security monitoring and compliance', safeUsageNote: 'Lightweight agent daemon' },
      { name: 'Zeek (Bro)', purpose: 'Network security monitoring and behavioral analysis', safeUsageNote: 'Passive network tap' },
      { name: 'ModSecurity / Coraza', purpose: 'Open source Web Application Firewall (WAF)', safeUsageNote: 'Test in detection-only first' }
    ],
    activities: [
      'Writing and testing Suricata / Snort intrusion detection rules',
      'Implementing multi-factor authentication (MFA) and conditional access policies',
      'Hardening Linux kernel sysctl parameters and SSH configurations',
      'Threat hunting through centralized Elasticsearch/Wazuh telemetry'
    ],
    defensiveRelevance: 'Completes the cycle of cybersecurity. Knowing how vulnerabilities are exploited allows blue team engineers to build hardened, unbreachable digital infrastructure.',
    safetyBoundaries: [
      'Test firewall rule additions in staging before deploying to avoid cutting off legitimate users',
      'Validate that detection rules do not cause severe CPU overhead on production servers',
      'Ensure audit logs have sufficient disk quota and do not cause disk saturation outages'
    ],
    realWorldExample: {
      title: 'From Pen-Test Finding to Automated SIEM Rule',
      scenario: 'After a penetration test demonstrated password spraying on OWA, the blue team deployed a Wazuh rule that auto-bans any IP failing 5 logins in 60 seconds.',
      offensivePerspective: 'Subsequent adversary credential stuffing attempts were thwarted at the boundary before account lockouts occurred.',
      defensiveMitigation: 'Continuous feedback loop between ethical testing and blue team engineering creates an adaptive, resilient security posture.'
    },
    interactiveExercise: {
      prompt: 'After discovering that attackers used PowerShell to download scripts from external URLs, what is the best defensive engineering countermeasure?',
      task: 'Select the optimal defensive control:',
      options: [
        'Uninstall Windows entirely and revert to pen and paper.',
        'Enable PowerShell Constrained Language Mode (CLM), AppLocker/WDAC script rules, and Script Block Logging (Event ID 4104) sent to SIEM.',
        'Delete powershell.exe without testing system services.',
        'Tell users to promise not to run PowerShell scripts.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Constrained Language Mode combined with Application Whitelisting and centralized Script Block Logging renders unauthorized PowerShell attacks ineffective while giving defenders real-time visibility.'
    }
  }
];

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'mod-fundamentals',
    number: 1,
    title: 'Ethical Hacking Fundamentals & Legal Boundaries',
    category: 'Foundations',
    estimatedMinutes: 20,
    xpReward: 150,
    summary: 'Master the legal framework, ethics of disclosure, and foundational principles distinguishing lawful security research from cybercrime.',
    lesson: {
      overview: 'Ethical hacking (or white-hat security) uses the tools and techniques of adversaries to identify vulnerabilities and fix them before malicious actors can exploit them.',
      coreConcepts: [
        {
          title: 'The CIA Triad',
          content: 'Confidentiality (prevent unauthorized reading), Integrity (prevent unauthorized modification), and Availability (prevent denial of access).'
        },
        {
          title: 'Legal Authorities (CFAA & International Law)',
          content: 'Accessing a computer system without authorization or exceeding authorized access is a federal crime under 18 U.S.C. § 1030 (CFAA). Written authorization is non-negotiable.'
        },
        {
          title: 'Vulnerability Disclosure Policies (VDP)',
          content: 'Responsible disclosure models give organizations 90 days to patch flaws before public disclosure, safeguarding end-users from 0-day exploitation.'
        }
      ],
      defensiveMindset: 'A defender must adopt an attacker mindset to understand paths of least resistance, while remaining anchored in ethics and compliance.'
    },
    example: {
      title: 'Unauthorized Port Scanning vs. Authorized Pen-Testing',
      attackWalkthrough: 'Scanning an unknown organization without permission can trigger IDS alerts, ISP abuse notifications, and law enforcement inquiries.',
      defenseMechanism: 'Always establish bilateral engagement letters with specific IP targets, signed by an authorized corporate officer.'
    },
    interactiveExercise: {
      instructions: 'Review the following statement and determine if it adheres to ethical hacking protocols.',
      challengeType: 'select',
      question: 'A friend asks you to "check out" their employer\'s website for bugs because they think the login is weak. They offer to pay you $50.',
      choices: [
        'Accept and run an automated scanner since your friend is an employee.',
        'Decline until you receive a formal, written contract signed by the employer company executive authorized to grant security testing permission.',
        'Only run passive OSINT queries because passive queries are always legally protected.',
        'Test the login page once with a weak password to see if it locks out.'
      ],
      correctAnswer: 1,
      hint: 'An employee does not usually possess the corporate legal authority to authorize penetration testing on company infrastructure.',
      solutionExplanation: 'Only designated corporate officers (CISO, CTO, VP of Security) with legal authority over the infrastructure can authorize penetration testing.'
    },
    quiz: {
      question: 'What is the primary difference between a Black Hat hacker and a White Hat ethical hacker?',
      options: [
        'White hats only use graphical tools, while black hats use command line tools.',
        'White hats operate with explicit authorization and legal consent to improve defense, while black hats operate unlawfully for personal gain or disruption.',
        'White hats only test Linux systems.',
        'White hats never use exploits.'
      ],
      correctIndex: 1,
      explanation: 'Authorization and intent are the defining criteria. White-hat professionals operate with contractual authorization to discover and remediate vulnerabilities.'
    }
  },
  {
    id: 'mod-passwords',
    number: 2,
    title: 'Password Security & Authentication Mechanics',
    category: 'Identity & Access',
    estimatedMinutes: 25,
    xpReward: 150,
    summary: 'Understand cryptographic hashing, salting, pepper, key derivation functions (Argon2, bcrypt), and credential stuffing defense.',
    lesson: {
      overview: 'Authentication verifies user identity. Storing passwords insecurely leads to catastrophic credential leaks when databases are breached.',
      coreConcepts: [
        {
          title: 'Hashes are One-Way Functions',
          content: 'A cryptographic hash maps arbitrary data to a fixed-length string. It is mathematically infeasible to reverse. Never store passwords in plain text or reversible encryption.'
        },
        {
          title: 'The Purpose of Salts',
          content: 'A salt is a unique, cryptographically random string appended to the password before hashing. It invalidates precomputed Rainbow Tables and ensures two identical passwords produce different hashes.'
        },
        {
          title: 'Memory-Hard Key Derivation (Argon2 / bcrypt)',
          content: 'Fast hashing algorithms (MD5, SHA-256) are disastrous for passwords because GPUs can calculate billions per second. Modern systems use Argon2id or bcrypt, which enforce memory and CPU cost factors.'
        }
      ],
      defensiveMindset: 'Assume your user database will eventually leak. If properly hashed with Argon2id and individual salts, attackers cannot reverse the hashes into plain text.'
    },
    example: {
      title: 'Vulnerable Plaintext/MD5 vs. Hardened Argon2id',
      vulnerableSnippet: `// VULNERABLE: MD5 is broken & calculated at 10+ billion hashes/sec
const hash = crypto.createHash('md5').update(password).digest('hex');`,
      hardenedSnippet: `// SECURE: Argon2id with memory-hard cost factor and random salt
import argon2 from 'argon2';
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3
});`,
      attackWalkthrough: 'An attacker dumps an MD5 database and uses Hashcat on a modern GPU rig to crack 90% of user passwords within 48 hours.',
      defenseMechanism: 'Argon2id forces the attacker to allocate 64MB of RAM per guess, reducing GPU cracking throughput to a negligible crawl.'
    },
    interactiveExercise: {
      instructions: 'Select the primary flaw in using standard SHA-256 for storing user passwords.',
      challengeType: 'select',
      question: 'Why is standard unsalted SHA-256 considered insecure for password storage?',
      choices: [
        'SHA-256 produces variable length output.',
        'SHA-256 is designed to be extremely fast on modern hardware, allowing brute-force rigs to test billions of guesses per second.',
        'SHA-256 can be decrypted using an online private key.',
        'SHA-256 only works on ASCII text.'
      ],
      correctAnswer: 1,
      hint: 'Think about how many calculations an ASIC or GPU can perform per second on general-purpose cryptographic hashes.',
      solutionExplanation: 'SHA-256 was engineered for high-speed file and transaction hashing, not passwords. Without work factors and salts, modern GPUs can crack unsalted passwords rapidly.'
    },
    quiz: {
      question: 'What is the primary security benefit of adding a unique cryptographically random salt to every password before hashing?',
      options: [
        'It encrypts the password with a public key.',
        'It prevents Rainbow Table attacks and ensures identical passwords result in distinct hash digests.',
        'It compresses the password to save database storage.',
        'It eliminates the need for strong user passwords.'
      ],
      correctIndex: 1,
      explanation: 'A unique salt ensures that two users with the password "Password123!" have completely different hashes, making precomputed lookup tables completely useless.'
    }
  },
  {
    id: 'mod-recon',
    number: 3,
    title: 'Reconnaissance & Threat Surface Mapping',
    category: 'Threat Intelligence',
    estimatedMinutes: 30,
    xpReward: 150,
    summary: 'Master Open Source Intelligence (OSINT), DNS harvesting, certificate transparency auditing, and attack surface enumeration.',
    lesson: {
      overview: 'Reconnaissance is the initial phase where an analyst maps the digital footprint of an organization, discovering assets, tech stacks, and potential entry points.',
      coreConcepts: [
        {
          title: 'Passive OSINT vs. Active Discovery',
          content: 'Passive recon queries third-party repositories (Shodan, crt.sh, WHOIS, DNS caches) without sending packets to the target IP, leaving zero forensic trace in their server logs.'
        },
        {
          title: 'Certificate Transparency (CT) Logs',
          content: 'Every TLS certificate issued by a public CA is logged publicly. Querying these logs reveals subdomains that may not be linked on the main site (e.g., vpn.company.com, staging-api.company.com).'
        },
        {
          title: 'DNS Zone Records & MX/SPF Profiling',
          content: 'Examining MX, TXT, SPF, and DMARC records reveals email providers, cloud services (Office365, AWS, Mailgun), and anti-spoofing protections.'
        }
      ],
      defensiveMindset: 'Continuous external attack surface management (EASM) allows defenders to spot exposed cloud storage, rogue test domains, and dangling DNS pointers before adversaries do.'
    },
    example: {
      title: 'Subdomain Takeover via Dangling CNAME',
      attackWalkthrough: 'A company leaves a DNS CNAME pointing to old-bucket.s3.amazonaws.com after deleting the S3 bucket. An attacker registers the abandoned bucket name and serves phishing malware under the company domain.',
      defenseMechanism: 'Implement automated DNS audits to prune CNAME records whenever downstream cloud instances are decommissioned.'
    },
    interactiveExercise: {
      instructions: 'Analyze this Certificate Transparency log entry for target domain quorvane.sec.',
      challengeType: 'select',
      question: 'You discover certificates for: api.quorvane.sec, internal-test-db.quorvane.sec, and vpn-gate.quorvane.sec. Which target represents the highest potential risk of exposure?',
      choices: [
        'api.quorvane.sec (production public API)',
        'internal-test-db.quorvane.sec (likely unhardened staging database endpoint)',
        'quorvane.sec (main marketing landing page)',
        'www.quorvane.sec (static web server)'
      ],
      correctAnswer: 1,
      hint: 'Staging and test infrastructure often lacks production-grade Web Application Firewalls and access controls.',
      solutionExplanation: 'Test and development environments frequently contain weaker passwords, debug logs, and disabled security controls, making internal-test-db a critical defensive focus.'
    },
    quiz: {
      question: 'Which of the following activities is an example of PASSIVE reconnaissance?',
      options: [
        'Running an aggressive Nmap vulnerability scan against the target IP.',
        'Sending SQL injection payloads to the target login form.',
        'Searching Certificate Transparency logs on crt.sh to find subdomains.',
        'Attempting an SSH brute-force login on port 22.'
      ],
      correctIndex: 2,
      explanation: 'Querying crt.sh retrieves public logs from Certificate Authorities. No traffic is sent to the target organization servers, making it 100% passive.'
    }
  },
  {
    id: 'mod-scanning',
    number: 4,
    title: 'Network Scanning & Packet Analysis',
    category: 'Networking',
    estimatedMinutes: 30,
    xpReward: 150,
    summary: 'Analyze TCP/IP transport mechanics, SYN stealth scanning, banner grabbing, firewall filter responses, and Wireshark packet analysis.',
    lesson: {
      overview: 'Scanning determines what ports are active and listening on target systems. Understanding the TCP handshake is essential for network analysis and defense.',
      coreConcepts: [
        {
          title: 'TCP 3-Way Handshake',
          content: '1. Client sends SYN. 2. Server responds with SYN-ACK if open (or RST if closed). 3. Client responds with ACK. The connection is established.'
        },
        {
          title: 'TCP SYN (Stealth / Half-Open) Scanning',
          content: 'The scanner sends SYN. If the server responds with SYN-ACK, the scanner sends RST instead of completing with ACK. In legacy systems, this avoided logging an established session.'
        },
        {
          title: 'Firewall States (Open vs. Closed vs. Filtered)',
          content: 'Open: Service answered. Closed: Kernel answered with RST. Filtered: No response (packet dropped by firewall or ICMP administratively prohibited).'
        }
      ],
      defensiveMindset: 'Defenders configure Next-Generation Firewalls (NGFW) to drop unsolicited inbound probes, disable unused services, and monitor for scanning bursts with Intrusion Detection Systems (IDS).'
    },
    example: {
      title: 'Banner Grabbing on Port 22',
      attackWalkthrough: 'Connecting to Port 22 returns: "SSH-2.0-OpenSSH_7.4p1 Debian-10+deb9u7". This immediately reveals the OS (Debian 9 Stretch) and software version (OpenSSH 7.4p1), exposing known unpatched vulnerabilities.',
      defenseMechanism: 'Keep services patched to modern stable releases and restrict SSH management access via IP whitelisting, VPN, or bastions.'
    },
    interactiveExercise: {
      instructions: 'Interpret the network behavior during a port probe.',
      challengeType: 'select',
      question: 'When an auditor sends a TCP SYN packet to Port 8080 and immediately receives a TCP RST packet back from the host, what is the port status?',
      choices: [
        'Open — the service is ready for HTTP traffic.',
        'Filtered — a firewall silently swallowed the packet.',
        'Closed — the host received the packet, but no service is listening on port 8080.',
        'Compromised — malware is intercepting traffic.'
      ],
      correctAnswer: 2,
      hint: 'The operating system kernel generates a Reset (RST) packet when an incoming connection requests a port where no application is listening.',
      solutionExplanation: 'An RST (Reset) packet sent by the destination indicates the host is reachable, but the specific port is closed (no application listening).'
    },
    quiz: {
      question: 'Why does a TCP SYN scan send an RST packet after receiving a SYN-ACK from an open port?',
      options: [
        'To crash the remote server.',
        'To tear down the connection immediately without completing the full handshake.',
        'To encrypt the payload.',
        'To bypass all modern firewalls.'
      ],
      correctIndex: 1,
      explanation: 'Sending an RST terminates the connection before the full 3-way handshake completes, preventing the creation of a full application session.'
    }
  },
  {
    id: 'mod-vulnerability',
    number: 5,
    title: 'Vulnerability Assessment & CVSS Triaging',
    category: 'Vulnerability Management',
    estimatedMinutes: 25,
    xpReward: 150,
    summary: 'Master vulnerability taxonomy, CVE identification, and Common Vulnerability Scoring System (CVSS v3.1) metrics.',
    lesson: {
      overview: 'Vulnerability assessment catalogs weaknesses in software, protocols, or configurations to prioritize remediation before exploitation happens.',
      coreConcepts: [
        {
          title: 'The Anatomy of a CVE',
          content: 'Common Vulnerabilities and Exposures (e.g., CVE-2024-3094) provides a standardized identifier for publicly known cybersecurity vulnerabilities.'
        },
        {
          title: 'CVSS v3.1 Metric Groups',
          content: 'Base Score evaluates intrinsic characteristics: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), and Confidentiality/Integrity/Availability (C/I/A).'
        },
        {
          title: 'Risk = Threat × Vulnerability × Asset Value',
          content: 'A critical vulnerability on an isolated sandbox has lower business risk than a medium vulnerability on a public-facing billing database.'
        }
      ],
      defensiveMindset: 'Triaging requires balancing CVSS severity with asset exposure. Patch public-facing and actively exploited flaws (CISA KEV catalog) first.'
    },
    example: {
      title: 'Evaluating CVSS for Default Admin Credentials',
      attackWalkthrough: 'A camera web portal uses admin:admin over the public internet. AV:N / AC:L / PR:N / UI:N / C:H / I:H / A:H yields CVSS 9.8 (Critical).',
      defenseMechanism: 'Mandate unique factory-generated passwords, disable default accounts, and require MFA on initial device provisioning.'
    },
    interactiveExercise: {
      instructions: 'Calculate the criticality difference between two vulnerabilities.',
      challengeType: 'select',
      question: 'Vulnerability A requires physical access with user interaction (AV:P / UI:R). Vulnerability B is exploitable over the internet with zero credentials (AV:N / PR:N / UI:N). Which should be prioritized?',
      choices: [
        'Vulnerability A, because physical threats are always more dangerous.',
        'Vulnerability B, because remote, unauthenticated network flaws can be automated and weaponized at global scale.',
        'Both should be treated with identical urgency.',
        'Neither requires patching if a firewall exists.'
      ],
      correctAnswer: 1,
      hint: 'Attack Vector Network (AV:N) with Privileges None (PR:N) allows anonymous attackers anywhere in the world to launch exploits.',
      solutionExplanation: 'Remote, unauthenticated vulnerabilities have maximum exploitability, enabling automated internet-wide scanning and botnet exploitation.'
    },
    quiz: {
      question: 'What does a CVSS v3.1 score of 9.0 to 10.0 indicate?',
      options: [
        'Low severity flaw.',
        'Medium severity flaw.',
        'High severity flaw.',
        'Critical severity flaw.'
      ],
      correctIndex: 3,
      explanation: 'CVSS v3.1 scores 9.0 - 10.0 represent Critical severity vulnerabilities that require urgent emergency patching.'
    }
  },
  {
    id: 'mod-web',
    number: 6,
    title: 'Web Security & OWASP Top 10 Defenses',
    category: 'Application Security',
    estimatedMinutes: 35,
    xpReward: 150,
    summary: 'Defend web applications against SQL Injection, Cross-Site Scripting (XSS), Broken Access Control, and CSRF.',
    lesson: {
      overview: 'Web applications represent the primary corporate attack surface. Securing them requires input sanitization, parameterized queries, and defensive HTTP headers.',
      coreConcepts: [
        {
          title: 'SQL Injection (SQLi)',
          content: 'Occurs when untrusted user input is directly concatenated into SQL query strings. Attackers manipulate query logic with single quotes (\') and comment dashes (--).'
        },
        {
          title: 'Cross-Site Scripting (XSS)',
          content: 'Occurs when untrusted data is injected into HTML/DOM without sanitization, executing malicious JavaScript in victims\' browsers to steal session tokens.'
        },
        {
          title: 'Broken Object Level Authorization (BOLA / IDOR)',
          content: 'Users alter an ID in an API request (e.g., /api/user/1002 to /api/user/1003) and access other users\' private data without server-side permission checks.'
        }
      ],
      defensiveMindset: 'Never trust client input. Validate, sanitize, use parameterized queries, and implement Content Security Policy (CSP).'
    },
    example: {
      title: 'Vulnerable SQL Concatenation vs. Parameterized Query',
      vulnerableSnippet: `// VULNERABLE: Direct string concatenation allows ' OR '1'='1
const query = "SELECT * FROM users WHERE user = '" + input + "' AND pass = '" + pass + "'";`,
      hardenedSnippet: `// SECURE: Parameterized queries treat user input strictly as literal values
const query = "SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?";
const results = await db.query(query, [input, passHash]);`,
      attackWalkthrough: 'Entering username: admin\' -- comments out the password check, granting instant unauthenticated administrative access.',
      defenseMechanism: 'Parameterized prepared statements separate SQL code structure from user data at the database engine level.'
    },
    interactiveExercise: {
      instructions: 'Identify the secure defensive fix for stored Cross-Site Scripting (XSS).',
      challengeType: 'select',
      question: 'A user comment box displays user comments. What is the fundamental defense to prevent stored XSS?',
      choices: [
        'Convert all comments to uppercase letters.',
        'Context-aware output encoding (escaping HTML entities like <, >, &, ", \') and implementing a strict Content Security Policy (CSP).',
        'Restricting the comment box to 20 characters.',
        'Disabling HTTPS on the web server.'
      ],
      correctAnswer: 1,
      hint: 'Browsers parse `<script>` tags as code unless characters like `<` are HTML-encoded as `&lt;`.',
      solutionExplanation: 'Context-aware HTML entity encoding transforms dangerous tags like `<script>` into benign text `&lt;script&gt;`, neutralising execution.'
    },
    quiz: {
      question: 'Why do parameterized queries (prepared statements) prevent SQL Injection?',
      options: [
        'They encrypt the entire database table.',
        'They ensure the database treats input purely as literal data, preventing input from altering the query structure.',
        'They automatically block IP addresses that send quotes.',
        'They require users to solve a CAPTCHA.'
      ],
      correctIndex: 1,
      explanation: 'Prepared statements pre-compile the SQL execution plan. User parameters are bound separately, preventing user input from changing the query syntax.'
    }
  },
  {
    id: 'mod-pentest',
    number: 7,
    title: 'Penetration Testing Methodologies & Workflows',
    category: 'Offensive Security',
    estimatedMinutes: 30,
    xpReward: 150,
    summary: 'Examine industry standard methodologies: PTES, OSSTMM, NIST SP 800-115, and the ethical penetration test lifecycle.',
    lesson: {
      overview: 'Penetration testing is a structured, authorized simulation of an adversary attack to evaluate an organization\'s security controls.',
      coreConcepts: [
        {
          title: 'PTES (Penetration Testing Execution Standard)',
          content: 'The 7 phases: Pre-engagement, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, and Reporting.'
        },
        {
          title: 'Black-Box vs. Gray-Box vs. White-Box',
          content: 'Black-box: Zero prior knowledge. Gray-box: Partial knowledge (e.g., standard user credentials). White-box: Full knowledge (source code, architecture diagrams).'
        },
        {
          title: 'Defensive Value of Gray-Box Testing',
          content: 'Gray-box testing provides the highest return on investment by simulating an insider or an attacker who has already breached initial perimeter credentials.'
        }
      ],
      defensiveMindset: 'Testing validates whether defensive controls actually work under live fire, exposing blind spots in logging, alerting, and incident response.'
    },
    example: {
      title: 'Black-Box vs. White-Box Assessment on an API',
      attackWalkthrough: 'In black-box testing, auditors spent 3 days discovering endpoints. In white-box testing with OpenAPI docs, they immediately focused on business logic flaws.',
      defenseMechanism: 'Provide architectural blueprints and API documentation to maximize auditor depth and coverage.'
    },
    interactiveExercise: {
      instructions: 'Select the optimal penetration testing modality.',
      challengeType: 'select',
      question: 'A financial institution wants to evaluate how their internal banking portal withstands attacks from authenticated junior employees. Which assessment type is most appropriate?',
      choices: [
        'External Black-Box testing without credentials.',
        'Gray-Box testing with a standard junior employee role account provided.',
        'Denial of Service stress testing.',
        'Physical lock-picking test of the server room.'
      ],
      correctAnswer: 1,
      hint: 'The goal is evaluating what an authenticated user with low privileges can access or escalate.',
      solutionExplanation: 'Gray-Box testing with junior credentials accurately simulates insider threat scenarios and broken authorization (BOLA/IDOR).'
    },
    quiz: {
      question: 'According to PTES, what must occur before any technical scanning or vulnerability discovery begins?',
      options: [
        'Immediate exploitation of the database.',
        'Pre-engagement interactions: defining scope, Rules of Engagement, and legal authorization.',
        'Sending phishing emails to the CEO.',
        'Purchasing 0-day exploits on underground forums.'
      ],
      correctIndex: 1,
      explanation: 'Pre-engagement interactions establish contractual boundaries, communication protocols, and legal authorization before technical actions begin.'
    }
  },
  {
    id: 'mod-incident',
    number: 8,
    title: 'Incident Response & Threat Containment',
    category: 'Blue Team & Operations',
    estimatedMinutes: 25,
    xpReward: 150,
    summary: 'Understand NIST SP 800-61 Incident Handling steps: Preparation, Detection, Containment, Eradication, Recovery, and Lessons Learned.',
    lesson: {
      overview: 'Security breaches will happen. A prepared organization limits damage, preserves forensic evidence, and restores operations safely.',
      coreConcepts: [
        {
          title: 'The NIST Incident Response Lifecycle',
          content: '1. Preparation. 2. Detection & Analysis. 3. Containment, Eradication & Recovery. 4. Post-Incident Activity (Lessons Learned).'
        },
        {
          title: 'Containment Strategies (Short-Term vs. Long-Term)',
          content: 'Isolating compromised hosts from the network prevents lateral spread while preserving RAM for volatile memory forensics.'
        },
        {
          title: 'Forensic Preservation (Chain of Custody)',
          content: 'Never reboot a compromised machine immediately; volatile memory (passwords, injected DLLs, open sockets) resides in RAM and is lost upon power-off.'
        }
      ],
      defensiveMindset: 'Containment must precede eradication. If you terminate an adversary tool before understanding their full foothold, they may pivot to a secondary backdoor.'
    },
    example: {
      title: 'Ransomware Containment via Network Quarantine',
      attackWalkthrough: 'Ransomware began encrypting files on a workstation. The EDR agent isolated the host network interface within 12 seconds.',
      defenseMechanism: 'Network isolation stopped SMB lateral movement, restricting encryption to one non-critical laptop.'
    },
    interactiveExercise: {
      instructions: 'Prioritize the immediate response action during an ongoing compromise.',
      challengeType: 'select',
      question: 'An operator discovers an active Cobalt Strike beacon running on an accounting server. What is the immediate correct first containment action?',
      choices: [
        'Format the hard drive immediately to destroy the malware.',
        'Isolate the host from the network (quarantine) while preserving memory state for forensic capture.',
        'Email the attacker asking them what they want.',
        'Ignore the alert until regular business hours.'
      ],
      correctAnswer: 1,
      hint: 'Formatting destroys evidence and alerting the attacker triggers anti-forensics. Isolation severs C2 command and control safely.',
      solutionExplanation: 'Host isolation severs the attacker\'s command and control connection and prevents lateral movement, while preserving volatile memory for forensic investigation.'
    },
    quiz: {
      question: 'Why should incident responders avoid powering off a compromised machine abruptly when investigating an intrusion?',
      options: [
        'Powering off damages the monitor screen.',
        'Volatile data stored in RAM (active processes, network sockets, in-memory keys) is destroyed upon power-off.',
        'The machine will automatically alert the FBI.',
        'Powering off speeds up malware propagation.'
      ],
      correctIndex: 1,
      explanation: 'RAM contains vital ephemeral evidence—running processes, decrypted credentials, and active network connections—that is permanently lost if power is pulled.'
    }
  },
  {
    id: 'mod-remediation',
    number: 9,
    title: 'Security Reporting & Hardened Remediation',
    category: 'Governance & Remediation',
    estimatedMinutes: 20,
    xpReward: 150,
    summary: 'Write high-impact executive summaries, technical bug descriptions, defense-in-depth mitigations, and verification re-tests.',
    lesson: {
      overview: 'The output of an assessment is a report. A well-crafted report bridges the gap between executive risk and developer code fixes.',
      coreConcepts: [
        {
          title: 'Audience Segmentation',
          content: 'Executives care about financial impact, compliance penalties, and strategic posture. Engineers need step-by-step reproduction and specific code patches.'
        },
        {
          title: 'Remediation Hierarchy',
          content: '1. Root Cause Elimination (e.g., parameterization). 2. Defense-in-Depth (e.g., WAF, least privilege). 3. Compensating Controls (e.g., alert monitoring).'
        },
        {
          title: 'The Re-Test Verification Cycle',
          content: 'Never close a critical vulnerability without an authorized re-test proving the patch resolves the flaw without introducing regressions.'
        }
      ],
      defensiveMindset: 'Security is not about "finding bugs"—it is about collaborating with engineering teams to build resilient architectures.'
    },
    example: {
      title: 'Actionable Bug Report with Proof-of-Concept',
      attackWalkthrough: 'A poorly written report stated: "Your API is insecure." The team did nothing. A professional report provided the exact HTTP request, CVSS vector, and suggested Python code fix.',
      defenseMechanism: 'Clear technical documentation reduced remediation turnaround from 45 days to 6 hours.'
    },
    interactiveExercise: {
      instructions: 'Select the most effective remediation recommendation for hardcoded API keys in a mobile app.',
      challengeType: 'select',
      question: 'An audit finds production AWS secret keys hardcoded in an iOS binary. What is the comprehensive remediation?',
      choices: [
        'Obfuscate the binary using a commercial packer and keep the keys in code.',
        'Revoke the exposed AWS keys immediately in IAM, proxy requests through a secure authenticated backend server, and deploy secrets management.',
        'Ask users not to inspect the binary.',
        'Change the variable name from "aws_secret_key" to "random_text".'
      ],
      correctAnswer: 1,
      hint: 'Any secret embedded in client-side applications can be extracted through reverse engineering.',
      solutionExplanation: 'Exposed secrets must be revoked immediately, and the architecture altered so clients communicate with a backend server that holds secrets securely.'
    },
    quiz: {
      question: 'What is the primary objective of the Executive Summary in a cybersecurity report?',
      options: [
        'To list 500 lines of raw scanner log data.',
        'To articulate business risk, financial exposure, regulatory impact, and strategic priorities for leadership.',
        'To mock developers for insecure coding practices.',
        'To reveal the auditor\'s personal political opinions.'
      ],
      correctIndex: 1,
      explanation: 'The Executive Summary translates complex technical findings into business risk, allowing executive leadership to prioritize security investments.'
    }
  },
  {
    id: 'mod-cloud-security',
    number: 10,
    title: 'Cloud Infrastructure & IAM Security',
    category: 'Cloud Security',
    estimatedMinutes: 25,
    xpReward: 175,
    summary: 'Master multi-cloud IAM policies, least-privilege role separation, storage bucket ACL auditing, and IMDSv2 metadata protection against SSRF exploitation.',
    lesson: {
      overview: 'Modern applications operate on shared-responsibility cloud models. Misconfigured IAM permissions, public storage buckets, and vulnerable metadata endpoints represent the leading vectors for cloud breaches.',
      coreConcepts: [
        {
          title: 'Principle of Least Privilege (PoLP)',
          content: 'Grant identities only the specific action boundaries required for their operational scope. Eliminate wildcards ("Action": "*") in production cloud policies.'
        },
        {
          title: 'Instance Metadata Service (IMDSv1 vs IMDSv2)',
          content: 'IMDSv1 permits unauthenticated HTTP GET requests to 169.254.169.254, allowing SSRF attackers to steal instance temporary credentials. IMDSv2 enforces session token PUT handshakes, preventing SSRF exfiltration.'
        },
        {
          title: 'Cloud Storage & Public Access Blocks',
          content: 'Object stores (S3, Cloud Storage) should have organization-level Public Access Blocks enabled with SSE-KMS customer-managed encryption by default.'
        }
      ],
      defensiveMindset: 'Assume identities and tokens will be leaked. Limit lateral movement by constraining policy scopes and enforcing short token lifetimes with session tagging.'
    },
    example: {
      title: 'Vulnerable Wildcard IAM Policy vs Hardened Scope-Constrained Policy',
      vulnerableSnippet: `// ❌ Flawed Policy: Overly permissive administrator wildcard
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}`,
      hardenedSnippet: `//  Hardened Policy: Explicit minimal action and resource constraints
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::corp-data-lake-prod/uploads/\${aws:userid}/*",
      "Condition": {
        "Bool": { "aws:SecureTransport": "true" }
      }
    }
  ]
}`,
      attackWalkthrough: 'Adversary leveraged an SSRF flaw in a document parser to query http://169.254.169.254/latest/meta-data/iam/security-credentials/. Because the attached instance role possessed "*" actions, the attacker assumed total cloud control.',
      defenseMechanism: 'Migrated instances to IMDSv2 (requiring PUT token pre-auth), scoped role permissions to a single S3 folder, and enforced mandatory TLS.'
    },
    interactiveExercise: {
      instructions: 'Analyze the cloud architecture flaw and select the immediate defensive hardening action.',
      challengeType: 'select',
      question: 'A cloud workload experiences an SSRF vulnerability. How do you prevent attackers from extracting IAM temporary credentials from the instance metadata endpoint?',
      choices: [
        'Enforce IMDSv2 requiring a session token PUT request and set the hop limit to 1, while applying IAM least-privilege.',
        'Delete the cloud instances and run everything on local developer workstations.',
        'Increase the IAM token expiration time to 72 hours.',
        'Change the subnet CIDR block from /24 to /16.'
      ],
      correctAnswer: 0,
      hint: 'IMDSv2 mitigates simple SSRF because blind HTTP GET requests cannot supply the required token handshake header.',
      solutionExplanation: 'Enforcing IMDSv2 blocks SSRF credential theft by requiring an HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds header to obtain a session token before metadata can be queried.'
    },
    quiz: {
      question: 'Under the Cloud Shared Responsibility Model, which security domain is the customer responsible for in an IaaS environment?',
      options: [
        'Physical data center HVAC and perimeter biometric security guards.',
        'Hypervisor firmware patching and motherboard replacement.',
        'Customer data encryption, IAM policies, operating system patches, and firewall configurations.',
        'Submarine fiber optic cable maintenance.'
      ],
      correctIndex: 2,
      explanation: 'In IaaS, cloud providers secure the physical facilities and virtualization layer; customers are responsible for data, IAM identities, OS updates, and network security rules.'
    }
  },
  {
    id: 'mod-incident-response',
    number: 11,
    title: 'Incident Response & Threat Hunting',
    category: 'SOC & Defensive Ops',
    estimatedMinutes: 25,
    xpReward: 175,
    summary: 'Internalize the NIST incident handling lifecycle: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Lessons Learned.',
    lesson: {
      overview: 'Breaches are inevitable; operational resilience depends on rapid containment and forensic integrity. Defenders utilize SIEM correlation, memory forensics, and standardized playbooks to minimize dwell time.',
      coreConcepts: [
        {
          title: 'NIST SP 800-61 Lifecycle',
          content: 'A structured 4-phase methodology: 1. Preparation, 2. Detection & Analysis, 3. Containment, Eradication & Recovery, 4. Post-Incident Activity (Lessons Learned).'
        },
        {
          title: 'Forensic Evidence Preservation',
          content: 'Volatile data (RAM, active network connections, running processes) must be captured before power-cycling or rebooting compromised hosts.'
        },
        {
          title: 'Indicators of Compromise (IoCs) & Pyramids of Pain',
          content: 'Hashes and IPs are easy for adversaries to change (bottom of the pyramid). Detecting Adversary Tactics, Techniques, and Procedures (TTPs) inflicts the highest pain on attackers.'
        }
      ],
      defensiveMindset: 'Speed without evidence preservation creates blind spots. Always isolate network interfaces before pulling power, and maintain chain-of-custody for digital evidence.'
    },
    example: {
      title: 'Ransomware Outbreak Containment Protocol',
      vulnerableSnippet: `// ❌ Flawed Reaction: Rebooting machine destroying volatile RAM forensics
sudo reboot
# All in-memory encryption keys, active C2 sockets, and injected processes erased`,
      hardenedSnippet: `//  Hardened Response: Immediate network isolation followed by volatile RAM dump
sudo iptables -P INPUT DROP && sudo iptables -P OUTPUT DROP
# Capture volatile memory state for decryption key recovery
sudo liME-dump --output=/mnt/evidence/mem_dump.raw`,
      attackWalkthrough: 'Adversary deployed memory-resident Cobalt Strike beacon and started lateral SMB staging. Rebooting the server would have destroyed the memory key required to decrypt victim files.',
      defenseMechanism: 'Security Operations isolated the endpoint via EDR network containment, extracted memory artifacts revealing the staging IP, and revoked compromised service credentials within 12 minutes.'
    },
    interactiveExercise: {
      instructions: 'Select the optimal defensive response sequence upon discovering an active root compromise.',
      challengeType: 'select',
      question: 'An analyst confirms an active remote shell connected to a critical database server. What is the correct immediate containment procedure?',
      choices: [
        'Immediately pull the power cord and throw the hard drive away.',
        'Isolate the host from the network at the switch/firewall layer, preserve volatile memory, and begin forensic triage.',
        'Email the attacker asking them to disconnect politely.',
        'Install new games on the server to distract the adversary.'
      ],
      correctAnswer: 1,
      hint: 'Preserving volatile memory enables forensic investigators to extract decryption keys, active sockets, and injected payloads.',
      solutionExplanation: 'Network isolation stops lateral movement and command-and-control communication while preserving volatile system state for forensic analysis.'
    },
    quiz: {
      question: 'According to David Bianco\'s "Pyramid of Pain", which indicator type is hardest for an adversary to alter when detected?',
      options: [
        'MD5 file hashes.',
        'IPv4 destination addresses.',
        'Domain names.',
        'Tactics, Techniques, and Procedures (TTPs).'
      ],
      correctIndex: 3,
      explanation: 'Tactics, Techniques, and Procedures (TTPs) represent how adversaries operate. Forcing them to learn new tools and operational methodologies causes the highest disruption.'
    }
  },
  {
    id: 'mod-api-security',
    number: 12,
    title: 'API Security & Microservices Hardening',
    category: 'Application Security',
    estimatedMinutes: 30,
    xpReward: 200,
    summary: 'Neutralize OWASP API Security Top 10 vulnerabilities: Broken Object Level Authorization (BOLA), Mass Assignment, Rate Limiting, and JWT manipulation.',
    lesson: {
      overview: 'APIs drive modern distributed microservices and mobile applications. Traditional perimeter firewalls cannot detect semantic logical authorization flaws where users access peer records by manipulating resource identifiers.',
      coreConcepts: [
        {
          title: 'Broken Object Level Authorization (BOLA / IDOR)',
          content: 'The #1 API vulnerability: The server checks if the user is authenticated, but fails to check if the authenticated user has permission to access the specific requested object ID.'
        },
        {
          title: 'Mass Assignment / Over-Posting',
          content: 'Binding client JSON payloads directly into database models allows attackers to escalate privileges by injecting unauthorized attributes (e.g., {"isAdmin": true, "role": "superadmin"}).'
        },
        {
          title: 'Cryptographic JWT Verification',
          content: 'Always verify JWT signatures using explicit algorithm whitelists (preventing the "alg: none" bypass) and reject unverified claims from untrusted tokens.'
        }
      ],
      defensiveMindset: 'Never trust IDs sent in URL paths or request bodies. Always bind the database query to the authenticated session user context.'
    },
    example: {
      title: 'BOLA Vulnerability vs Context-Bound Ownership Validation',
      vulnerableSnippet: `// ❌ Flawed API Endpoint: Accesses document purely by URL parameter ID
app.get('/api/documents/:docId', async (req, res) => {
  // Vulnerable to BOLA/IDOR: Any logged-in user can fetch docId: 9999
  const doc = await db.documents.findByPk(req.params.docId);
  res.json(doc);
});`,
      hardenedSnippet: `//  Hardened API Endpoint: Enforces object ownership authorization
app.get('/api/documents/:docId', authenticateToken, async (req, res) => {
  const doc = await db.documents.findOne({
    where: {
      id: req.params.docId,
      ownerOrganizationId: req.user.organizationId // Ownership constraint
    }
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});`,
      attackWalkthrough: 'Adversary enumerated document IDs sequentially (/api/documents/1001, /1002...) and downloaded confidential medical dossiers belonging to other hospital patients.',
      defenseMechanism: 'Enforced tenant isolation filters on every SQL query, binding results strictly to the requesting user\'s organization.'
    },
    interactiveExercise: {
      instructions: 'Identify the flaw and select the correct defensive architectural patch.',
      challengeType: 'select',
      question: 'A user updates their profile by sending PUT /api/user with body: {"bio": "Hello", "role": "admin"}. The server updates their database record, promoting them to admin. What vulnerability occurred?',
      choices: [
        'Mass Assignment: The server unsafely bound untrusted client input directly to internal data model fields.',
        'SQL Injection: The database was dropped.',
        'Cross-Site Scripting (XSS): A script executed in the browser.',
        'Denial of Service: The server ran out of memory.'
      ],
      correctAnswer: 0,
      hint: 'Restricting allowed fields using a strict Data Transfer Object (DTO) or whitelist prevents unexpected attribute assignment.',
      solutionExplanation: 'Mass Assignment occurs when client inputs are mapped directly to database models without filtering. Defensive remediations require explicit DTO schemas permitting only safe fields (e.g. bio, name).'
    },
    quiz: {
      question: 'What is the most effective architectural countermeasure against Broken Object Level Authorization (BOLA)?',
      options: [
        'Encoding resource IDs with Base64 in URL paths.',
        'Hiding API endpoints behind obscure URL paths.',
        'Validating that the authenticated session user possesses ownership or role permissions for the specific requested object ID on every request.',
        'Adding a CAPTCHA to every API endpoint.'
      ],
      correctIndex: 2,
      explanation: 'BOLA can only be solved by performing granular object-level authorization checks validating that the current user context is authorized to view or modify the specific target record.'
    }
  }
];

export const CYBER_LABS: CyberLab[] = [
  {
    id: 'lab-password',
    title: 'Password Security & Entropy Laboratory',
    category: 'Authentication',
    difficulty: 'Beginner',
    duration: '15 min',
    xpReward: 200,
    description: 'Experiment with mathematical entropy, dictionary brute-forcing speeds, hashing algorithms, and salt impact in an isolated workbench.',
    objectives: [
      'Calculate bit-entropy across various password lengths and character sets',
      'Compare crack times across MD5, SHA-256, and Argon2id',
      'Demonstrate how cryptographic salts invalidate Rainbow Tables'
    ],
    scenario: 'You are evaluating the authentication security of an enterprise employee portal where 40% of staff use 8-character dictionary passwords.',
    targetEnvironment: 'Simulated Authentication Hash Cracking Engine (Sandbox ID: HASH-LAB-01)',
    labType: 'password'
  },
  {
    id: 'lab-recon',
    title: 'OSINT & Subdomain Reconnaissance Lab',
    category: 'Intelligence',
    difficulty: 'Beginner',
    duration: '20 min',
    xpReward: 200,
    description: 'Query simulated Certificate Transparency logs, uncover shadow IT subdomains, analyze SPF mail records, and discover exposed credentials.',
    objectives: [
      'Analyze Certificate Transparency (CT) data for target domains',
      'Discover unauthenticated staging endpoints hidden behind DNS records',
      'Perform WHOIS and autonomous system (ASN) profiling safely'
    ],
    scenario: 'Target Corporation (simulated) acquired a subsidiary last year. Your objective is mapping their external attack surface to find unmanaged web assets.',
    targetEnvironment: 'Simulated Passive DNS & Intelligence Hub (Sandbox ID: OSINT-LAB-02)',
    labType: 'recon'
  },
  {
    id: 'lab-network',
    title: 'Network Port Scanner & Firewall Simulator',
    category: 'Networking',
    difficulty: 'Intermediate',
    duration: '25 min',
    xpReward: 250,
    description: 'Perform simulated SYN and Connect port sweeps across simulated DMZ servers. Analyze firewall packet filtering and banner disclosures.',
    objectives: [
      'Execute simulated TCP SYN scans across ports 21, 22, 80, 443, 3306, 8080',
      'Identify open vs filtered vs closed ports based on packet responses',
      'Extract software banners to map vulnerable daemon versions'
    ],
    scenario: 'An internal web server was moved to a new DMZ subnet. Verify that only ports 80 and 443 are reachable from untrusted network segments.',
    targetEnvironment: 'Simulated TCP/IP Packet Sandbox (Sandbox ID: NET-LAB-03)',
    labType: 'network'
  },
  {
    id: 'lab-vuln',
    title: 'Vulnerability Triaging & CVSS Calculator Lab',
    category: 'Vulnerability Management',
    difficulty: 'Intermediate',
    duration: '20 min',
    xpReward: 200,
    description: 'Triage live simulated CVE alerts. Formulate CVSS v3.1 vector strings and build a risk prioritization matrix for patch management.',
    objectives: [
      'Parse CVE advisories and extract attack vector metrics',
      'Construct a valid CVSS v3.1 vector string and calculate base score',
      'Differentiate exploitable network vulnerabilities from low-risk local configurations'
    ],
    scenario: 'A morning vulnerability scan returned 12 potential flaws across web, database, and container instances. Triage the top critical risks.',
    targetEnvironment: 'Simulated Vulnerability Management Console (Sandbox ID: VULN-LAB-04)',
    labType: 'vuln'
  },
  {
    id: 'lab-web',
    title: 'Web Application Defensive Laboratory (SQLi & XSS)',
    category: 'Application Security',
    difficulty: 'Advanced',
    duration: '30 min',
    xpReward: 300,
    description: 'Safely inspect and patch real SQL Injection and Cross-Site Scripting vulnerabilities in an isolated, intentionally vulnerable web application.',
    objectives: [
      'Test for SQL injection vulnerabilities using benign test strings',
      'Observe how string concatenation allows authentication bypass',
      'Implement and test parameterized query defenses and HTML encoding'
    ],
    scenario: 'A simulated e-commerce customer portal has reported anomalies. Investigate input fields, trigger canaries, and verify code patches.',
    targetEnvironment: 'Isolated Sandboxed Web Application (Sandbox ID: WEB-LAB-05)',
    labType: 'web'
  },
  {
    id: 'lab-pentest',
    title: 'Full Penetration Testing Engagement Workflow',
    category: 'Offensive Security',
    difficulty: 'Advanced',
    duration: '35 min',
    xpReward: 350,
    description: 'Walk through an end-to-end simulated engagement: Scoping -> Recon -> Scanning -> Safe PoC -> Post-Cleanup -> Executive Report generation.',
    objectives: [
      'Sign off on digital Rules of Engagement contract',
      'Execute synchronized discovery and safe proof of concept validation',
      'Complete post-test artifact cleanup verification',
      'Generate a standardized remediation report'
    ],
    scenario: 'FinTech Corp has authorized an ethical penetration test of their customer API. Guide the assessment through all professional phases.',
    targetEnvironment: 'Simulated Cyber-Range Operations Environment (Sandbox ID: RANGE-OPS-06)',
    labType: 'pentest'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-lab',
    title: 'First Lab Completed',
    description: 'Successfully initialized and finished your first hands-on cyber range lab.',
    icon: 'Terminal',
    xp: 100,
    category: 'lab'
  },
  {
    id: 'ach-pwd-specialist',
    title: 'Password Security Specialist',
    description: 'Mastered mathematical password entropy, Argon2 hashing, and salting principles.',
    icon: 'Lock',
    xp: 150,
    category: 'lab'
  },
  {
    id: 'ach-recon-beginner',
    title: 'Reconnaissance Beginner',
    description: 'Mapped target attack surfaces using passive OSINT and Certificate Transparency logs.',
    icon: 'Search',
    xp: 150,
    category: 'lab'
  },
  {
    id: 'ach-defensive-thinker',
    title: 'Defensive Thinker',
    description: 'Completed 3 ethical hacking framework stages and analyzed defensive mitigations.',
    icon: 'Shield',
    xp: 200,
    category: 'framework'
  },
  {
    id: 'ach-network-scout',
    title: 'Network Scout',
    description: 'Successfully diagnosed TCP handshake states, port filters, and firewall barriers.',
    icon: 'Wifi',
    xp: 150,
    category: 'academy'
  },
  {
    id: 'ach-zero-day',
    title: '0-Day Mitigator',
    description: 'Triaged and scored critical CVE vulnerabilities using the CVSS v3.1 framework.',
    icon: 'AlertTriangle',
    xp: 200,
    category: 'lab'
  },
  {
    id: 'ach-master-auditor',
    title: 'Master Auditor',
    description: 'Mastered all 7 stages of the ethical hacking operational framework.',
    icon: 'Award',
    xp: 350,
    category: 'framework'
  },
  {
    id: 'ach-quorvane-apprentice',
    title: 'Quorvane Vanguard',
    description: 'Accumulated over 1,000 XP in the Quorvane cybersecurity training ecosystem.',
    icon: 'Zap',
    xp: 500,
    category: 'special'
  }
];

export interface PortReference {
  port: number;
  service: string;
  transport: string;
  description: string;
}

export const PORT_REFERENCES: PortReference[] = [
  { port: 21, service: 'FTP', transport: 'TCP', description: 'File Transfer Protocol. Cleartext credentials. Disable in favor of SFTP (SSH Port 22).' },
  { port: 22, service: 'SSH / SFTP', transport: 'TCP', description: 'Secure Shell remote administration. Enforce public-key authentication, disable root password login.' },
  { port: 23, service: 'Telnet', transport: 'TCP', description: 'Legacy cleartext terminal protocol. Inherently vulnerable to network sniffing; immediately deprecate.' },
  { port: 25, service: 'SMTP', transport: 'TCP', description: 'Simple Mail Transfer Protocol. Configure SPF, DKIM, and DMARC to mitigate domain spoofing.' },
  { port: 53, service: 'DNS', transport: 'UDP/TCP', description: 'Domain Name System. Subject to DNS amplification DDoS and cache poisoning; deploy DNSSEC.' },
  { port: 80, service: 'HTTP', transport: 'TCP', description: 'Hypertext Transfer Protocol. Plaintext web traffic. Enforce 301 redirect to HTTPS (Port 443) with HSTS.' },
  { port: 110, service: 'POP3', transport: 'TCP', description: 'Post Office Protocol v3. Transmits passwords unencrypted; upgrade to POP3S (Port 995).' },
  { port: 143, service: 'IMAP', transport: 'TCP', description: 'Internet Message Access Protocol. Cleartext email retrieval; upgrade to IMAPS (Port 993).' },
  { port: 389, service: 'LDAP', transport: 'TCP', description: 'Lightweight Directory Access Protocol. Sensitive Active Directory queries; enforce LDAPS (Port 636).' },
  { port: 443, service: 'HTTPS', transport: 'TCP', description: 'HTTP over TLS/SSL. Modern web encryption. Enforce TLS 1.3, disable SSLv3/TLS 1.0/1.1.' },
  { port: 445, service: 'SMB', transport: 'TCP', description: 'Server Message Block. Historically targeted by EternalBlue/WannaCry; never expose to public WAN.' },
  { port: 1433, service: 'MS-SQL', transport: 'TCP', description: 'Microsoft SQL Server. Frequently targeted by brute-force bots; isolate behind internal subnet.' },
  { port: 3306, service: 'MySQL', transport: 'TCP', description: 'MySQL / MariaDB database service. Restrict binding strictly to 127.0.0.1 or VPC private IP.' },
  { port: 3389, service: 'RDP', transport: 'TCP/UDP', description: 'Remote Desktop Protocol. Prime target for ransomware intrusion; enforce MFA & VPN gateway.' },
  { port: 5432, service: 'PostgreSQL', transport: 'TCP', description: 'PostgreSQL relational database. Enforce SSL client certificates and pg_hba.conf restrictions.' },
  { port: 6379, service: 'Redis', transport: 'TCP', description: 'In-memory key-value database. Often shipped without default auth; isolate and require strong auth token.' },
  { port: 8080, service: 'HTTP-Proxy / Dev', transport: 'TCP', description: 'Alternative HTTP port used by Tomcat, Spring, and proxies. Ensure same security policies as Port 80.' }
];

export interface IncidentPhase {
  phase: string;
  items: string[];
}

export const INCIDENT_CHECKLISTS: IncidentPhase[] = [
  {
    phase: '1. Preparation & Detection',
    items: [
      'Verify centralized log forwarding from firewalls, EDR agents, and identity providers.',
      'Correlate alert telemetry to rule out false positives against baseline operational traffic.',
      'Assign Incident Commander (IC) and establish secure out-of-band communication channel (Signal/Wire).',
      'Document the initial incident detection timestamp, reporting vector, and affected system hostnames.'
    ]
  },
  {
    phase: '2. Triage & Containment',
    items: [
      'Isolate compromised endpoints from the production network (VLAN quarantine or host firewall rule).',
      'Revoke active session tokens, API keys, and compromised credentials for affected service accounts.',
      'Preserve volatile forensic memory (RAM capture) before cycling power or rebooting virtual machines.',
      'Capture forensic disk snapshot of virtualized assets for offline forensic artifact analysis.'
    ]
  },
  {
    phase: '3. Eradication & Remediation',
    items: [
      'Identify and neutralize persistence mechanisms (cron jobs, scheduled tasks, web shells, backdoors).',
      'Apply vendor security patches for initial access vulnerabilities (CVEs) across all exposed surfaces.',
      'Cycle and rotate all credentials, cryptographic keys, and database secrets associated with the environment.',
      'Validate integrity of critical system binaries using known cryptographically signed golden images.'
    ]
  },
  {
    phase: '4. Recovery & Post-Mortem',
    items: [
      'Restore affected infrastructure from clean, verified offline backups prior to estimated breach date.',
      'Implement enhanced continuous monitoring and custom canary detection rules on recovered assets.',
      'Conduct blameless Root Cause Analysis (RCA) meeting with security, DevOps, and executive leadership.',
      'Publish formal incident report with timeline, technical root cause, and systemic defensive enhancements.'
    ]
  }
];

