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
para('Lead Frontend Engineer&nbsp; |&nbsp; React, TypeScript, React Native&nbsp; |&nbsp; BFF&nbsp; |&nbsp; AI-native delivery', 10, space=1.5)
para('Delhi NCR, India&nbsp; |&nbsp; +91-9971340719&nbsp; |&nbsp; animeshsbasak@gmail.com', 7.8, space=0.5)
para('linkedin.com/in/animeshbasak&nbsp; |&nbsp; github.com/animeshbasak&nbsp; |&nbsp; animeshbasak.com', 7.8, space=1)

heading('PROFESSIONAL SUMMARY')
para('Frontend lead with 8 years on high-traffic consumer products: hotels booking at MakeMyTrip (5M+ monthly sessions), merchant payments at Paytm (3M+ active merchants) and the Airtel Thanks app (150M+ MAU). '
     
     'Owns journeys end to end: React and TypeScript front ends on mobile web, desktop and React Native, and the <b>BFF layer</b> behind them, with Spring Boot services where needed. '
     '<b>Ships with AI</b>: MCP-integrated delivery workflows at work, and open-source AI developer tools (PAARTH, Trinetra) outside it.', space=1)

heading('SKILLS')
para('<b>Frontend:</b> TypeScript, JavaScript, React, Next.js, React Native, Angular, Redux, Zustand, Server-Driven / Schema-Driven UI, Design Systems, Component Libraries, HTML5, CSS3', space=0.6)
para('<b>Architecture &amp; Performance:</b> HLD/LLD, Micro-frontends, Module Federation, Monorepos, SSR, Core Web Vitals, LCP, Critical Rendering Path, Bundle Optimization, Accessibility', space=0.6)
para('<b>BFF &amp; Backend:</b> BFF design and orchestration, REST API design, Java, Spring Boot, Node.js, Express, Python, SQL, PostgreSQL', space=0.6)
para('<b>AI:</b> Claude Code, Cursor, Copilot, Codex, MCP servers, LLM applications (RAG, model routing, agentic workflows), agent hooks, local models with Ollama', space=0.6)
para('<b>Quality &amp; Delivery:</b> Vitest, Jest, React Testing Library, Sentry, GrowthBook (experimentation), Superset, Jenkins, GitHub Actions, Docker', space=1)

heading('WORK EXPERIENCE')
role('Lead Engineer', 'June 2025 - Present', 'Airtel Digital Ltd.&nbsp; |&nbsp; New Delhi, India')
bullet('Lead a squad of 5-7 engineers across prepaid, postpaid, Airtel One, Black and Self-KYC journeys on the Airtel Thanks app (150M+ MAU), on mobile web, desktop web and React Native; own HLD/LLD with architect sign-off and serve as the final production review gate for code quality and regression safety.')
bullet('Lead the Gen4 Self-KYC revamp across prepaid, postpaid and eSIM: a multi-page, schema-driven UI catalog and <b>one unified BFF family</b> covering cart, plans, number selection, porting, eSIM, Aadhaar and referee OTP, and order submission, replacing fragmented legacy flows. Phase 1 is live; Phase 2 fixes are verified in production.')
bullet('Designed the in-flight address-change orchestration (OTP-protected links, parallel order validation, feasibility checks, conditional update or cancel) so customers correct an address instead of cancelling the order.')
bullet('Shipped prepaid physical-SIM Self-KYC end to end, from acquisition to activation: OTP verification, resumable orders, cart and payment integration, post-payment KYC and SIM pairing.')
bullet('Shipped <b>Spring Boot REST services</b> for address update, order validation and cancellation, and BFF data mapping for a billing wallet; own GrowthBook experiments, Superset dashboards and Jenkins CI/CD, accountable for reducing P1 incidents.')
bullet('<b>AI-native delivery:</b> integrated MCP servers into Cursor (Figma designs, API contracts) with context packs for multi-repo work, and built my own AI coding agent for day-to-day Airtel work, adapted from PAARTH, for Cursor and Copilot: plan gates, org-policy checks and context that survives refreshes, across Spring and React codebases.')
role('Senior Software Engineer II, Frontend', 'July 2024 - May 2025', 'MakeMyTrip India Pvt. Ltd.&nbsp; |&nbsp; Gurugram, India')
bullet('Raised Lighthouse performance scores from 6 to 8-9 on the <b>hotels booking</b> PWA and desktop web (5M+ monthly sessions) through SSR tuning, LCP optimization and critical-rendering-path work, across a micro-frontend, Module Federation and monorepo architecture.')
bullet('Resolved a systemic defect generating 1,000+ Sentry errors within 48 hours; built a reusable component architecture that cut onboarding time 30% while sustaining 90%+ test coverage with Vitest, Jest and React Testing Library.')
role('Software Engineer', 'October 2021 - June 2024', 'One97 Communications Ltd. (Paytm)&nbsp; |&nbsp; Noida, India')
bullet('Led the migration of legacy merchant workflows to a modern React architecture for journeys serving 3M+ active merchants, using micro-frontends, Module Federation and monorepos; optimized the Soundbox checkout, contributing to a 40% increase in EDC device sales.')
bullet('As Analytics SPOC, built analytics dashboards that lifted merchant engagement metrics 10-15% and sped up cross-functional product decisions.')
role('Frontend Developer', 'Jan 2021 - Oct 2021', 'Sparklin Innovations&nbsp; |&nbsp; ICICI Bank (Nirvana)')
role('Systems Engineer', 'Dec 2018 - Jan 2021', 'Infosys Ltd.&nbsp; |&nbsp; ANZ Bank (FINACLE)')

heading('OPEN SOURCE (AI DEVELOPER TOOLS)')
para('<b>PAARTH</b>&nbsp; |&nbsp; <i>Claude Code, MCP, Python</i>&nbsp; |&nbsp; github.com/animeshbasak/Paarth&nbsp; (v4.1.0, MIT)', space=0.8)
bullet('A routing layer for AI coding tools: picks the workflow and skills for each request, keeps memory between sessions, asks before risky commands, and can switch to a free local model.')
para('<b>Trinetra</b>&nbsp; |&nbsp; <i>Swift, SwiftUI, agent hooks</i>&nbsp; |&nbsp; trinetra.animeshbasak.com&nbsp; (v0.1, MIT)', space=0.8)
bullet('A macOS menu bar app that keeps the Mac awake, lid closed included, exactly while Claude Code, Codex, Gemini CLI or Cursor agents work; live agent list, session summaries and a system monitor.')
para('<b>Also building:</b> Lakshya Hub (Next.js, LLMs: résumé to tracked application, personal beta) and Glass (a Fire TV home screen with a Claude assistant, in daily use). Demos at animeshbasak.com.', space=0.6)

heading('EDUCATION')
para('<b>B.Tech, Computer Science and Engineering</b> - Inderprastha Engineering College, Delhi NCR&nbsp; |&nbsp; 2014 - 2018')

c.showPage()
c.save()
for copy in COPIES:
    shutil.copyfile(OUT, copy)
print(OUT, f'{y:.0f}pt left above the bottom margin')
