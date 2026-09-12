"""Generate the public resume from approved broad facts, without private attachments.
Run with reportlab installed: python docs/resume/generate_public_resume.py
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[2]
# Historical broad-profile draft; never overwrite the user's selected original PDF.
OUT = ROOT / 'docs' / 'resume' / 'broad-profile-draft.pdf'
OUT.parent.mkdir(exist_ok=True)
W,H=595.28,841.89
INK='#243239'; MUTED='#526875'; SIGNAL='#AF4526'; LINE='#AF C0 C9'.replace(' ','')
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Animesh Basak - Public Resume')
c.setAuthor('Animesh Basak')
c.setSubject('Broad public career record, education and independent projects')
y=0

def text(content,size=10.5,color=MUTED,bold=False,space=8,width=491):
 global y
 st=ParagraphStyle('text',fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,leading=size*1.4,textColor=HexColor(color),alignment=TA_LEFT)
 p=Paragraph(content,st); _,h=p.wrap(width,H)
 p.drawOn(c,52,y-h); y-=h+space
 if y<55: raise RuntimeError('Resume content crosses footer')

def rule():
 global y
 c.setStrokeColor(HexColor(LINE));c.setLineWidth(.6);c.line(52,y,W-52,y);y-=18

def label(value):
 text(value.upper(),8.5,SIGNAL,True,space=12)

def start(page):
 global y
 c.setFillColor(HexColor('#F5F8F9'));c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(HexColor(SIGNAL));c.rect(52,H-52,32,3,fill=1,stroke=0)
 y=H-76
 if page==1:
  text('Animesh Basak',32,INK,True,space=5)
  text('Lead Engineer / Web, Mobile &amp; AI Systems',13,INK,space=12)
  text('New Delhi, India &nbsp; | &nbsp; <link href="mailto:animeshsbasak@gmail.com" color="'+SIGNAL+'">animeshsbasak@gmail.com</link>',10,space=5)
  text('<link href="https://www.linkedin.com/in/animeshbasak" color="'+SIGNAL+'">LinkedIn</link> &nbsp; / &nbsp; <link href="https://github.com/animeshbasak" color="'+SIGNAL+'">GitHub</link> &nbsp; / &nbsp; <link href="https://animeshbasak.com" color="'+SIGNAL+'">animeshbasak.com</link>',10,space=17)
 else:
  text('Animesh Basak',20,INK,True,space=6)
  text('Independent work, practice &amp; education',11,space=18)
 rule()

def footer(page):
 c.setStrokeColor(HexColor(LINE));c.line(52,44,W-52,44)
 c.setFont('Helvetica',8);c.setFillColor(HexColor(MUTED));c.drawString(52,29,'ANIMESH BASAK / PUBLIC RESUME')
 c.drawRightString(W-52,29,f'{page} / 2')
 c.showPage()

start(1)
text('I build web interfaces, mobile experiences and independent AI tools. My work combines hands-on frontend engineering with technical direction, reusable interface foundations and engineering quality.',11,space=18)
label('Career / 2018 - Present')
roles=[
 ('Airtel Digital','Lead Engineer','Jun 2025 - Present','Lead frontend engineering across web and mobile. Shape technical designs and reusable UI capabilities, guide implementation and code review, and support release readiness.'),
 ('MakeMyTrip','Senior Software Engineer II','Jul 2024 - May 2025','Worked on consumer travel interfaces with a focus on server rendering, loading performance, reusable components and production reliability. Strengthened regression coverage with automated testing.'),
 ('Paytm','Software Engineer','Oct 2021 - Jun 2024','Modernised merchant-facing workflows with React, refined purchase journeys and built analytics dashboards in collaboration with engineering and product.'),
 ('Sparklin','Frontend Developer','Jan 2021 - Oct 2021','Built modular Angular interfaces for banking workflows, with attention to usability, accessibility, component structure and initial loading behaviour.'),
 ('Infosys','Systems Engineer','Dec 2018 - Jan 2021','Developed React interface modules for banking software, validated API behaviour with Postman and automated regression checks with WebDriverIO.'),
]
for company,role,dates,desc in roles:
 text(company,14,INK,True,space=2)
 text(role+' &nbsp; / &nbsp; '+dates,9.5,SIGNAL,space=5)
 text(desc,10.5,space=17)
footer(1)
start(2)
label('Independent projects')
projects=[
 ('Lakshya Hub','An AI job-hunt copilot bringing resume fit, job discovery, ranking and application tracking into one workflow.','https://getlakshya.animeshbasak.com/','Explore the product','Next.js / TypeScript / Supabase / Multi-model AI'),
 ('PAARTH Agent','A personal agent organised around a repeatable cycle: perceive, recall, plan, act and verify. The linked development plan describes its proposed evolution; planned capabilities are not presented as released features.','https://github.com/animeshbasak/Paarth/blob/main/docs/superpowers/plans/2026-07-07-paarth-agent-evolution.md','Read the development plan','Python / MCP / Ollama / Agent systems'),
 ('PAARTH + insanemesh.ai','SuperAgent is an open-source routing brain for AI coding tools, with cross-session memory and cost controls. Alongside that developer-tool work, insanemesh.ai explores an independent AI content automation pipeline.','https://github.com/animeshbasak/Paarth','Explore the repository','Developer tools / Routing / Memory / Automation'),
]
for name,desc,url,action,tags in projects:
 text(name,15,INK,True,space=6)
 text(desc,10.5,space=5)
 text(tags,9,MUTED,space=6)
 text('<link href="'+url+'" color="'+SIGNAL+'">'+action+' &gt;</link>',10,space=14)
rule()
label('Practice')
text('<b>Interface:</b> React, TypeScript, React Native, Next.js, Accessibility, Web performance',10.5,space=6)
text('<b>Foundations:</b> System design, Node.js, Spring Boot, Testing',10.5,space=6)
text('<b>AI tools:</b> Agentic systems, RAG, Multi-model routing, MCP',10.5,space=21)
rule()
label('Education')
text('B.Tech, Computer Science and Engineering',13,INK,True,space=6)
text('Inderprastha Engineering College, Delhi NCR<br/>2014 - 2018',10.5,space=8)
footer(2)
c.save()
print(OUT)
