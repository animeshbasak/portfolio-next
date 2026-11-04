import {career, practice, projects} from '../../lib/portfolio/data'
import {getPublicPosts} from '../../lib/portfolio/public-blog'
import './portfolio-evidence.css'

function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>
}

function FocusList({items, label}: {items: readonly string[]; label: string}) {
  return <ul className="evidence-tags" aria-label={label}>{items.map(item => <li key={item}>{item}</li>)}</ul>
}

export default function PortfolioEvidence() {
  const posts = getPublicPosts()
  const latestPosts = posts.slice(0, 3)
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'})

  return <div className="portfolio-evidence">
    <section className="evidence-section" id="experience" aria-labelledby="evidence-experience-title">
      <div className="evidence-section-heading"><div><p className="evidence-eyebrow">01 / THE ROAD SO FAR</p><h2 id="evidence-experience-title">Experience, in full.</h2></div><a className="evidence-text-link" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Read my résumé <Arrow/><span className="personal-sr-only"> (PDF, opens in a new tab)</span></a></div>
      <div className="evidence-career">{career.map((role, index) => <article className="evidence-career-row" id={`career-${role.id}`} key={role.id}>
        <div className="evidence-career-identity"><p className="evidence-date">{role.dates}{index === 0 && <span className="evidence-current">Current</span>}</p><h3>{role.company}</h3><p className="evidence-role">{role.role}</p></div>
        <div className="evidence-career-story"><p className="evidence-career-theme">{role.theme}</p><p className="evidence-body">{role.narrative}</p><FocusList items={role.focus} label={`Focus at ${role.company}`}/><details className="evidence-responsibilities"><summary><span>Responsibilities<span className="personal-sr-only"> at {role.company}</span></span><span className="evidence-details-mark" aria-hidden="true"/></summary><ul>{role.responsibilities.map(responsibility => <li key={responsibility}>{responsibility}</li>)}</ul></details></div>
      </article>)}</div>
    </section>

    <section className="evidence-section" id="projects" aria-labelledby="evidence-projects-title">
      <div className="evidence-section-heading"><div><p className="evidence-eyebrow">02 / OUTSIDE THE DAY JOB</p><h2 id="evidence-projects-title">Independent work.</h2></div><p className="evidence-section-intro">The products, tools and experiments I’m building—and where each one stands.</p></div>
      <div className="evidence-projects">{projects.map(project => <article className="evidence-project-row" key={project.slug}>
        <span className="evidence-project-number" aria-hidden="true">{project.number}</span>
        <div className="evidence-project-identity"><p className="evidence-status">{project.status}</p><h3><a href={`/work/${project.slug}`}>{project.name}<Arrow/></a></h3><p className="evidence-project-line">{project.line}</p></div>
        <div className="evidence-project-story"><p className="evidence-body">{project.description}</p><FocusList items={project.tags} label={`${project.name} tools and focus`}/><div className="evidence-project-links"><a className="evidence-text-link" href={`/work/${project.slug}`}>Inside the project <Arrow/></a>{project.href && project.action && <a className="evidence-text-link evidence-secondary-link" href={project.href} {...(project.href.startsWith('https://') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>{project.action}<Arrow/>{project.href.startsWith('https://') && <span className="personal-sr-only"> (opens in a new tab)</span>}</a>}</div></div>
      </article>)}</div>
    </section>

    <section className="evidence-section" id="practice" aria-labelledby="evidence-practice-title">
      <div className="evidence-section-heading"><div><p className="evidence-eyebrow">03 / HOW I WORK</p><h2 id="evidence-practice-title">Across the layers.</h2></div><p className="evidence-section-intro">A frontend foundation, with care for the systems and people around it.</p></div>
      <div className="evidence-practice-layout"><div className="evidence-practice-groups">{practice.map((group, index) => <article className="evidence-practice-group" key={group.name}><span className="evidence-practice-number" aria-hidden="true">0{index + 1}</span><div><h3>{group.name}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div></article>)}</div><aside className="evidence-education" aria-labelledby="evidence-education-title"><p className="evidence-eyebrow">EDUCATION / 2014–2018</p><h3 id="evidence-education-title">B.Tech</h3><p className="evidence-degree">Computer Science<br/>and Engineering</p><p className="evidence-body">Inderprastha Engineering College<br/>Delhi NCR</p><a className="evidence-text-link" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">View the résumé <Arrow/><span className="personal-sr-only"> (PDF, opens in a new tab)</span></a></aside></div>
    </section>

    {latestPosts.length > 0 && <section className="evidence-section evidence-notes-section" id="notes" aria-labelledby="evidence-notes-title">
      <div className="evidence-section-heading"><div><p className="evidence-eyebrow">04 / NOTES FROM THE WORK</p><h2 id="evidence-notes-title">Thinking out loud.</h2></div><a className="evidence-text-link" href="/blog">Read all {posts.length} notes <Arrow/></a></div>
      <div className="evidence-notes">{latestPosts.map(post => <article className="evidence-note-row" key={post.slug}><div className="evidence-note-meta"><span>{post.category}</span><time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time><span>{post.readTime} min read</span></div><div className="evidence-note-story"><h3><a href={`/blog/${post.slug}`}>{post.title}<Arrow/></a></h3><p className="evidence-body">{post.excerpt}</p></div></article>)}</div>
    </section>}
  </div>
}
