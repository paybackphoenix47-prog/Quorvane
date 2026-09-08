# QUORVANE — Securing the Digital Future

**QUORVANE** is an enterprise-grade ethical hacking framework, cybersecurity training academy, and hands-on cyber range simulation platform engineered with React 19, TypeScript, Tailwind CSS, Motion, and Firebase Firestore/Auth.

Designed for security analysts, penetration testers, security engineers, and DevOps operators, QUORVANE bridges theoretical defensive/offensive principles with hands-on, sandbox-isolated security simulations.

---

##  Key Features

### 1. 5-Stage Ethical Hacking Methodology
- **Reconnaissance & OSINT**: Subdomain enumeration, DNS record querying, WHOIS lookup, and Shodan/Censys passive asset mapping.
- **Scanning & Enumeration**: Port sweep engine, Nmap service fingerprinting, banner grabbing, and network perimeter mapping.
- **Vulnerability Assessment**: CVSS v3.1 base metric scoring calculator with vector string generation, CVE indexing, and criticality matrix.
- **Exploitation & PoC**: SQL injection payload testing, reflected/stored XSS sanitization, and authorization bypass simulations in a sandboxed runtime.
- **Reporting & Remediation**: Executive impact summaries, technical remediation guides, structured risk ratings, and exportable remediation roadmaps.

### 2. Quorvane Academy (12 In-Depth Modules)
Interactive, hands-on cybersecurity curriculum complete with technical deep dives, side-by-side vulnerable vs hardened code snippets, attack walkthroughs, interactive remediation exercises, and certification quizzes:
1. Cybersecurity Fundamentals & CIA Triad
2. Cryptography & Password Security (Argon2id, PBKDF2)
3. Network Defense & Packet Analysis (TCP/IP, Wireshark)
4. Web Security: SQL Injection (OWASP Top 10)
5. Web Security: Cross-Site Scripting (XSS & CSP)
6. Social Engineering & Phishing Defense
7. Threat Modeling & Attack Surface Reduction (STRIDE)
8. Security Operations & SIEM Telemetry
9. Vulnerability Assessment & Penetration Testing (VAPT)
10. Cloud Infrastructure & IAM Security (Least Privilege, IMDSv2)
11. Incident Response & Threat Hunting (NIST SP 800-61, Pyramid of Pain)
12. API Security & Microservices Hardening (BOLA, IDOR, Mass Assignment)

### 3. Interactive Cyber Range Labs
- **Lab 1: Password Entropy & Hash Resistance Auditor**: Real-time entropy computation (Shannon formula), character pool analysis, and crack-time benchmark for Argon2id, SHA-256, and NTLM.
- **Lab 2: Reconnaissance & OSINT Simulator**: Target WHOIS querying, sub-domain brute-force simulation, and MX/TXT record analysis.
- **Lab 3: Port & Vulnerability Sweep Engine**: Real-time SYN stealth sweep across standard enterprise ports (21, 22, 80, 443, 3306, 8080) with service banner classification.
- **Lab 4: CVSS v3.1 Calculator**: Interactive vector calculator computing Base Metric Exploitability and Impact scores with automated severity classification (Low, Medium, High, Critical).
- **Lab 5: Web Application Defense Simulator**: SQL injection testing (blind/tautology bypasses) and XSS sanitization audit with defensive parameterization testing.
- **Lab 6: Full Penetration Testing Lifecycle**: 5-phase guided scenario from reconnaissance to executive remediation reporting.

### 4. Operator Dossier, XP & Persistence
- **Firebase Authentication & Firestore**: Secure user registration, authentication, role-based access control, operator level progression, and live activity audit trails.
- **Offline & Fallback Support**: Seamless local storage fallback ensures zero downtime and instant interactivity even when offline.
- **Operator Badges & Achievements**: Real-time XP rewards, level ranking (Trainee, Analyst, Operator, Architect), and unlockable achievement credentials.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom Electric Cyan Design System (`#06b6d4`, `#030712`, `#050b14`)
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Cloud Backend**: Google Cloud Firestore & Firebase Auth
- **Deployment**: Google Cloud Run / Containerized Nginx / Static SPA Hosting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/quorvane.git
cd quorvane

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` (or configure in your deployment platform):
```bash
cp .env.example .env
```

Set the required environment variables:
- `GEMINI_API_KEY`: (Optional) API key for extended AI threat analysis capabilities.
- `APP_URL`: The public URL of your deployed application.

Firebase configuration is automatically loaded from `firebase-applet-config.json` (or can be configured via environment variables).

### Running in Development
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```
Compiled production-ready assets are generated in the `dist/` directory.

### Previewing Production Build
```bash
npm run preview
```

---

## 📦 Deployment Options

### 1. Google Cloud Run (Recommended)
This application is optimized for Google Cloud Run:
- The build script compiles static assets to `dist/`.
- Deploy directly from Google AI Studio using the **Deploy to Cloud Run** button in the header.

### 2. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

### 3. Vercel Deployment
The project includes `vercel.json` pre-configured for SPA client-side routing.
1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables on Vercel** (Optional - if not bundling `firebase-applet-config.json`):
   - `VITE_FIREBASE_API_KEY`: Your Firebase Web API Key
   - `VITE_FIREBASE_AUTH_DOMAIN`: `your-project.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID
   - `VITE_FIRESTORE_DATABASE_ID`: (Optional, if using custom database ID)
   - `VITE_FIREBASE_STORAGE_BUCKET`: `your-project.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase sender ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase Web App ID
   - `GEMINI_API_KEY`: (Optional) For AI security analysis features
   - `APP_URL`: Your Vercel deployment URL (e.g. `https://quorvane.vercel.app`)

### 4. Docker
```dockerfile
# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🛡 Security & Ethics Disclaimer

QUORVANE is developed strictly for authorized educational, research, and defensive cybersecurity training purposes. All scanning, payload testing, and vulnerability exercises are simulated inside controlled, sandboxed browser environments. Never execute vulnerability assessments or exploitation techniques against unauthorized targets.

---

## 📄 License
MIT License. Created with Google AI Studio.
