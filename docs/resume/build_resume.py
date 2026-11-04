"""Build the one-page public résumé (public/resume-public.pdf) from the approved record.

Sources: the October 2026 public résumé and the Airtel write-up Animesh approved on
31 Oct 2026. Only finished or live projects; no internal tool or script names.
Run: python3 docs/resume/build_resume.py
"""
from pathlib import Path
import shutil
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'resume-public.pdf'
COPIES = [ROOT / 'public' / 'resume.pdf', ROOT / 'public' / 'Animesh_Basak_Resume_2026.pdf']

FONT_DIR = Path('/usr/share/fonts/truetype/liberation')
for name, file in [('Sans', 'LiberationSans-Regular.ttf'), ('Sans-Bold', 'LiberationSans-Bold.ttf'), ('Sans-Italic', 'LiberationSans-Italic.ttf'), ('Sans-BoldItalic', 'LiberationSans-BoldItalic.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='Sans-Bold', italic='Sans-Italic', boldItalic='Sans-BoldItalic')

W, H = letter
X = 40
WIDTH = W - 2 * X
INK = HexColor('#111111')
y = H - 34

c = canvas.Canvas(str(OUT), pagesize=letter)
c.setTitle('Animesh Basak - Lead Frontend Engineer - Résumé')
c.setAuthor('Animesh Basak')
c.setSubject('Lead Frontend Engineer, New Delhi')


def para(markup, size=8.3, lead=1.19, space=0.0, indent=0, bold=False, font=None):
    global y
    style = ParagraphStyle('p', fontName=font or ('Sans-Bold' if bold else 'Sans'), fontSize=size, leading=size * lead, textColor=INK, alignment=TA_LEFT)
    p = Paragraph(markup, style)
    _, h = p.wrap(WIDTH - indent, H)
    p.drawOn(c, X + indent, y - h)
    y -= h + space
    if y < 30:
        raise RuntimeError('Résumé runs past one page')


def heading(title):
    global y
    y -= 5
    para(f'<b>{title}</b>', 10.4, space=1.5)
    c.setLineWidth(0.7); c.setStrokeColor(INK); c.line(X, y, W - X, y)
    y -= 3.5


def bullet(markup):
    global y
    c.setFont('Sans', 8.3); c.setFillColor(INK); c.drawString(X + 1, y - 7.1, '•')
    para(markup, indent=7, space=0.6)


def role(title, dates, org):
    global y
    top = y
    para(f'<b>{title}</b>', 8.9, space=0)
    c.setFont('Sans', 8.9); c.setFillColor(INK); c.drawRightString(W - X, top - 8.4, dates)
    if org:
        para(f'<i>{org}</i>', 8.6, space=0.8)


para('<b>Animesh Basak</b>', 21, lead=1.1, space=1)
para('Lead Frontend Engineer | React, TypeScript, Schema-Driven UI | Frontend Architecture &amp; Design Systems', 10, space=1.5)
para('New Delhi, India&nbsp; |&nbsp; +91-9971340719&nbsp; |&nbsp; animeshsbasak@gmail.com&nbsp; |&nbsp; linkedin.com/in/animeshbasak&nbsp; |&nbsp; github.com/animeshbasak&nbsp; |&nbsp; animeshbasak.com', 7.8, space=1)

heading('PROFESSIONAL SUMMARY')
para('Frontend-focused Lead Engineer with 7.5+ years building high-scale consumer web and mobile products, including the Airtel Thanks app at 150M+ MAU. '
     'Leads a squad of 5-7 engineers shipping journeys on a shared schema-driven frontend platform, from HLD/LLD and architect sign-off through delivery and final production review. '
     'Specializes in React/TypeScript architecture, schema-driven UI, design systems, micro-frontends, Module Federation, performance, accessibility and testability. '
     'Full-stack capable across Spring Boot and Node backends, and a hands-on builder of LLM applications (RAG, multi-model routing, agentic systems). '
     'Owns ambiguous problems end to end, across teams.', space=1)

heading('SKILLS')
para('<b>Languages:</b> JavaScript, TypeScript, Python, Java, SQL, HTML5, CSS3', space=0.6)
para('<b>Frontend:</b> React, React Native, Next.js, Angular, Server-Driven UI (SDUI), Schema-Driven UI, Configuration-Driven Rendering, Design Systems, Widget/Component Libraries, Redux, Zustand, Tailwind CSS, shadcn/ui, Framer Motion', space=0.6)
para('<b>Architecture &amp; Performance:</b> Micro-frontends, Module Federation, Monorepos, HLD/LLD, SSR, BFF, Core Web Vitals, LCP, Bundle Optimization, Accessibility (A11y)', space=0.6)
para('<b>Backend:</b> Spring Boot, Node.js, Express, REST APIs, PostgreSQL, Supabase', space=0.6)
para('<b>AI &amp; LLM:</b> Claude Code, Claude, GPT, Gemini, Groq, Ollama, LangChain, LlamaIndex, RAG, Model Routing, Agentic Workflows, MCP, Vector Memory, Prompt Engineering, Evaluations', space=0.6)
para('<b>Testing &amp; DevOps:</b> Vitest, Jest, React Testing Library, Sentry, Jenkins, GitHub Actions, Docker, GrowthBook, Superset, Vercel', space=1)

heading('WORK EXPERIENCE')
role('Lead Engineer', 'June 2025 - Present', 'Airtel Digital Ltd.&nbsp; |&nbsp; New Delhi, India')
bullet('Lead a squad of 5-7 engineers owning React/TypeScript architecture, delivery and release standards across prepaid, postpaid, Airtel One, Black and Self-KYC journeys on the Airtel Thanks app at 150M+ MAU; serve as final production review gate for code quality and regression safety.')
bullet('Ship journeys on Airtel\u2019s shared schema-driven frontend platform, composing the shared design system and widget library through server-defined schemas and BFF scripts; author HLD/LLD with architect sign-off.')
bullet('Lead the Gen4 Self-KYC revamp across prepaid, postpaid and eSIM: a multi-page, schema-driven UI catalog and one unified BFF script family replacing fragmented legacy flows. Phase 1 is live; Phase 2 fixes verified in production.')
bullet('Built a conversational, LLM-driven Self-KYC journey in React Native, where server-defined schemas compose native design-system widgets integrated with KYC and verification APIs: document upload, live selfie, DOB correction, referee address and device location.')
bullet('Shipped prepaid physical-SIM Self-KYC end to end (OTP verification, resumable orders, cart and payment, post-payment KYC, SIM pairing), the base for corporate-to-retail conversion and the Gen4 revamp; designed in-flight address changes so customers correct an address instead of cancelling.')
bullet('Expanded into backend engineering with the broadband team: shipped Spring Boot REST services for DTH address update, order validation and cancellation; own GrowthBook experimentation, Superset dashboards and Jenkins CI/CD, and am accountable for reducing P1 incidents on the squad\u2019s journeys.')
role('Senior Software Engineer II, Frontend', 'July 2024 - May 2025', 'MakeMyTrip India Pvt. Ltd.&nbsp; |&nbsp; Gurugram, India')
bullet('Improved Lighthouse scores from 6 to 8-9 through SSR tuning, LCP optimization and critical-rendering-path improvements on the hotels booking PWA and desktop web serving 5M+ monthly sessions; worked across micro-frontend, Module Federation and monorepo architecture.')
bullet('Resolved a systemic defect generating 1,000+ Sentry errors within 48 hours; built reusable component architecture cutting onboarding time 30% while sustaining 90%+ test coverage with Vitest, Jest and React Testing Library.')
role('Software Engineer', 'October 2021 - June 2024', 'One97 Communications Ltd. (Paytm)&nbsp; |&nbsp; Noida, India')
bullet('Led migration from legacy merchant workflows to modern React architecture across journeys serving 3M+ active merchants, with micro-frontends, Module Federation and monorepo-based codebases; optimized Soundbox checkout, contributing to a 40% increase in EDC device sales.')
bullet('Built analytics dashboards as Analytics SPOC, lifting merchant engagement metrics 10-15% and enabling faster cross-functional product decisions.')
role('Frontend Developer - Sparklin Innovations (ICICI Bank Nirvana)', 'Jan 2021 - Oct 2021', '')
role('Systems Engineer - Infosys Ltd. (ANZ Bank, FINACLE)', 'Dec 2018 - Jan 2021', '')
bullet('Built Angular and React modules for ICICI (Nirvana) and ANZ Bank (FINACLE) internet-banking platforms; delivered modular components, API validation, and automation with Postman and WebDriverIO.')

heading('PROJECTS')
para('<b>PAARTH (formerly SuperAgent)</b>&nbsp; |&nbsp; <i>Claude Code, MCP, SQLite, Model Routing</i>', space=0.8)
bullet('Open-source layer around AI coding tools: workflow routing, persistent memory, action checks and cost controls; a rules-only build answers job descriptions on animeshbasak.com.')

para('<b>Trinetra</b>&nbsp; |&nbsp; <i>Swift, SwiftUI, macOS</i>&nbsp; |&nbsp; github.com/animeshbasak/trinetra', space=0.8)
bullet('Open-source macOS menu bar app that keeps the Mac awake, lid closed included, exactly while AI agents work; agent hooks, a tested decision core and a minimal privileged helper.')

heading('EDUCATION')
para('<b>B.Tech, Computer Science and Engineering</b> - Inderprastha Engineering College, Delhi NCR&nbsp; |&nbsp; 2014 - 2018&nbsp; |&nbsp; 75.4%')

c.showPage()
c.save()
for copy in COPIES:
    shutil.copyfile(OUT, copy)
print(OUT, f'{y:.0f}pt left above the bottom margin')
