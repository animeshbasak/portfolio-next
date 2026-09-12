import type { PostMeta } from '../../lib/blog'
import { FolioIcon } from './FolioPrimitives'
import { career, independentProjects, practice } from './portfolio-data'
import styles from './story.module.css'

const perspectives = ['Reliability', 'Clarity', 'Evolution', 'Performance', 'Leadership']
const projectIdeas = [
  ['01 / ORGANIZE', 'Turn a scattered search into a considered next step.'],
  ['02 / REASON', 'Give an agent a method it can follow and verify.'],
  ['03 / CONNECT', 'Let tools carry context, so the next idea starts further ahead.'],
]

function Label({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className={styles.label}><span>{number}</span>{children}</div>
}

export default function PortfolioContent({ posts }: { posts: PostMeta[] }) {
  return <>
    <section id="story-start" className={styles.hero} data-story-at="0">
      <div id="new-profile" className={styles.heroBody}>
        <Label number="01">ANIMESH BASAK / ENGINEER & BUILDER</Label>
        <h1>Built over time.<br /><em>Still becoming.</em></h1>
        <p className={styles.lead}>I build interfaces, systems, and the ideas that connect them.</p>
        <p className={styles.byline}>Lead Engineer at Airtel Digital.<br />Independent builder. Always a student of the craft.</p>
        <a className={styles.textLink} href="#new-record">Follow the thread <FolioIcon name="down" /></a>
      </div>
      <div className={styles.heroFooter}><span>NEW DELHI, INDIA</span><span>WEB / MOBILE / AI</span></div>
    </section>

    <section className={styles.biography} data-story-at="0.055">
      <Label number="01.1">THE PERSON BEHIND THE WORK</Label>
      <h2>Curiosity is<br /><em>the through-line.</em></h2>
      <p className={styles.lead}>From my first interface to the systems I lead today, I keep coming back to the same question: how could this work better?</p>
      <p>My journey runs through Infosys, Sparklin, Paytm, MakeMyTrip, and Airtel Digital. Along the way, the work has grown from individual interfaces to systems, teams, and products.</p>
      <p>Outside my day job, I build independent tools and write about the decisions behind them.</p>
      <div className={styles.facts}><div><strong>2018</strong><span>THE START</span></div><div><strong>05</strong><span>CAREER CHAPTERS</span></div><div><strong>Web + AI</strong><span>A GROWING PRACTICE</span></div></div>
      <div className={styles.tags}>{practice.map(item => <span key={item}>{item}</span>)}</div>
    </section>

    <section id="new-record" className={styles.careerSection}>
      <div className={styles.chapterIntro} data-story-at="0.09"><Label number="02">EXPERIENCE / 2018 — PRESENT</Label><h2>Every chapter<br /><em>adds a layer.</em></h2><p>What changes over a career isn’t only the title. It’s the way you see the work.</p></div>
      <ol className={styles.career}>{[...career].reverse().map((job, i) => <li key={job.company} className={styles.job} data-story-at={(0.115 + i * 0.025).toFixed(3)}>
        <div className={styles.jobTime}><span>0{i + 1} / {job.dates}</span><span>{i === 4 ? 'NOW' : 'CHAPTER ' + String(i + 1).padStart(2, '0')}</span></div>
        <p className={styles.perspective}>{perspectives[i]}<span>.</span></p>
        <h3>{job.company}</h3><p className={styles.role}>{job.role}</p>
        <p>{job.focus}</p><div className={styles.tags}>{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </li>)}</ol>
    </section>

    <section id="new-projects" className={styles.projectsSection}>
      <div className={styles.chapterIntro} data-story-at="0.28"><Label number="03">INDEPENDENT WORK</Label><h2>Experience becomes<br /><em>something tangible.</em></h2><p>Personal products and open-source experiments. Here, the layers turn into things you can explore.</p></div>
      {independentProjects.map((project, i) => <article key={project.number} className={styles.project} data-story-at={[0.36, 0.5, 0.64][i]}>
        <div className={styles.jobTime}><span>EXP / {project.number}</span><span>INDEPENDENT PROJECT</span></div>
        <p className={styles.projectType}>{project.type}</p><h3>{project.name}</h3><p>{project.description}</p>
        <div className={styles.projectDiagram} data-diagram={project.art}>
          <span>{projectIdeas[i][0]}</span>
          <div aria-hidden="true" className={styles.diagramGeometry}>{project.art === 'board' ? <>{['Discover', 'Consider', 'Act'].map((label, j) => <div key={label}><b>{label}</b>{Array.from({length: 3-j}, (_, k) => <i key={k} />)}</div>)}</> : project.art === 'orbit' ? <div className={styles.agentCycle}><span>Perceive</span><span>Recall</span><span>Plan</span><span>Act</span><span>Verify</span></div> : <svg viewBox="0 0 400 130" fill="none"><path d="M0 65H80C150 65 110 15 180 15H400M0 65H400M0 65H80C150 65 110 115 180 115H400" /><circle cx="80" cy="65" r="5" /><circle cx="250" cy="15" r="5" /><circle cx="200" cy="65" r="5" /><circle cx="290" cy="115" r="5" /></svg>}</div>
          <p>{projectIdeas[i][1]}</p>
        </div>
        <div className={styles.tags}>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <a className={styles.textLink} href={project.href} target="_blank" rel="noopener noreferrer">{project.action}<FolioIcon name="arrow" /></a>
      </article>)}
    </section>

    <section id="new-writing" className={styles.writingSection}>
      <div className={styles.chapterIntro} data-story-at="0.79"><Label number="04">WRITING & PERSPECTIVES</Label><h2>Make something.<br /><em>Make sense of it.</em></h2><p>Building takes an idea apart. Writing brings the lessons back together.</p></div>
      <figure className={styles.quote} data-story-at="0.9"><span aria-hidden="true">“</span><blockquote>The hardest part of going public wasn’t the code. It was naming things consistently.</blockquote><figcaption>Animesh Basak · From my notes on <a href="/blog/superagent-cost-aware-routing">building SuperAgent in public ↗</a></figcaption></figure>
      <div className={styles.archive} data-story-at="0.97"><div className={styles.archiveHeader}><h3>The notebook</h3><span>{String(posts.length).padStart(2, '0')} ARTICLES / OPEN TO EXPLORE</span></div>{posts.map((post, i) => <a href={'/blog/' + post.slug} key={post.slug}><span className={styles.postIndex}>{String(i + 1).padStart(2, '0')}</span><span className={styles.postCategory}>{post.category}</span><h4>{post.title}</h4><span className={styles.postRead}>{post.readTime} MIN</span><FolioIcon name="arrow" /></a>)}</div>
    </section>

    <footer id="new-contact" className={styles.contact} data-story-at="1"><Label number="05">THE NEXT CHAPTER</Label><h2>Good work starts<br /><em>with a conversation.</em></h2><p>The next layer hasn’t been written yet.</p><a className={styles.email} href="mailto:animeshsbasak@gmail.com">animeshsbasak@gmail.com <FolioIcon name="arrow" /></a><div className={styles.footerLinks}><a href="https://github.com/animeshbasak" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/animeshbasak" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="/design-system">Design system ↗</a><a href="#story-start">Back to the beginning ↑</a></div><div className={styles.footerLine}><span>© 2026 ANIMESH BASAK</span><span>BUILT OVER TIME.</span></div></footer>
  </>
}
