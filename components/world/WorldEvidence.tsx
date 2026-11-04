import {career, practice, projects} from '../../lib/portfolio/data'
import {getPublicPosts} from '../../lib/portfolio/public-blog'

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>
}

function Tags({items, label}: {items: readonly string[]; label: string}) {
  return <ul className="world-tags" aria-label={label}>{items.map(item => <li key={item}>{item}</li>)}</ul>
}

export default function WorldEvidence() {
  const posts = getPublicPosts()
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'})

  return <>
    <section className="world-section" id="world-experience" data-world-chapter="1" aria-labelledby="world-experience-title">
      <div className="world-reading-lane">
        <div className="world-section-heading"><p className="world-eyebrow">01 / EXPERIENCE</p><h2 id="world-experience-title">Built over time.</h2><p className="world-section-intro">The teams, products and responsibilities that shaped how I work.</p><a className="world-text-link" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">Read my résumé <Arrow/><span className="world-sr-only"> (PDF, opens in a new tab)</span></a></div>
        <div className="world-career-list">{career.map((role, index) => <article className="world-career-row" id={`world-career-${role.id}`} key={role.id}>
          <div className="world-record-meta"><p>{role.dates}</p>{index === 0 && <span className="world-current">Current</span>}</div>
          <h3>{role.company}</h3><p className="world-role">{role.role}</p>
          <p className="world-record-theme">{role.theme}</p><p className="world-body">{role.narrative}</p>
          <Tags items={role.focus} label={`Focus at ${role.company}`}/>
          <details className="world-details"><summary><span>Responsibilities<span className="world-sr-only"> at {role.company}</span></span><span className="world-details-mark" aria-hidden="true"/></summary><ul>{role.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></details>
        </article>)}</div>
      </div>
    </section>

    <section className="world-section" id="world-work" data-world-chapter="2" aria-labelledby="world-work-title">
      <div className="world-reading-lane">
        <div className="world-section-heading"><p className="world-eyebrow">02 / INDEPENDENT WORK</p><h2 id="world-work-title">Ideas, made real.</h2><p className="world-section-intro">Products, tools and experiments beyond the day job. Each with its own question—and an honest account of where it stands.</p></div>
        <div className="world-project-list">{projects.map(project => <article className="world-project-row" id={`world-project-${project.slug}`} key={project.slug}>
          <div className="world-record-meta"><span>{project.number} / PROJECT</span><p>{project.status}</p></div>
          <h3><a href={`/work/${project.slug}`}>{project.name}<Arrow/></a></h3><p className="world-record-theme">{project.line}</p><p className="world-body">{project.description}</p>
          <Tags items={project.tags} label={`${project.name} tools and focus`}/>
          <details className="world-details"><summary><span>Approach & current limits<span className="world-sr-only"> of {project.name}</span></span><span className="world-details-mark" aria-hidden="true"/></summary><div className="world-project-detail"><p className="world-detail-label">The question</p><p>{project.problem}</p><p className="world-detail-label">The approach</p><p>{project.approach}</p><p className="world-detail-label">The tradeoff</p><p>{project.tradeoff}</p><p className="world-detail-label">Current limits</p><p>{project.limitations}</p></div></details>
          <div className="world-project-links"><a className="world-text-link" href={`/work/${project.slug}`}>Inside the project <Arrow/></a>{project.href && project.action && <a className="world-text-link" href={project.href} {...(project.href.startsWith('https://') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>{project.action}<Arrow/>{project.href.startsWith('https://') && <span className="world-sr-only"> (opens in a new tab)</span>}</a>}</div>
        </article>)}</div>
      </div>
    </section>

    <section className="world-section" id="world-practice" data-world-chapter="3" aria-labelledby="world-practice-title">
      <div className="world-reading-lane">
        <div className="world-section-heading"><p className="world-eyebrow">03 / PRACTICE & PERSPECTIVE</p><h2 id="world-practice-title">Across the layers.</h2><p className="world-section-intro">A frontend foundation, with care for the systems and people around it.</p></div>
        <div className="world-practice-list">{practice.map((group, index) => <article className="world-practice-row" key={group.name}><span className="world-practice-number" aria-hidden="true">0{index + 1}</span><div><h3>{group.name}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div></article>)}</div>
        <aside className="world-education" aria-labelledby="world-education-title"><p className="world-eyebrow">EDUCATION / 2014–2018</p><h3 id="world-education-title">B.Tech</h3><p className="world-degree">Computer Science and Engineering</p><p className="world-body">Inderprastha Engineering College<br/>Delhi NCR</p><a className="world-text-link" href="/resume-public.pdf" target="_blank" rel="noopener noreferrer">View the résumé <Arrow/><span className="world-sr-only"> (PDF, opens in a new tab)</span></a></aside>
        {posts.length > 0 && <div className="world-notes" id="world-notes" aria-labelledby="world-notes-title"><div className="world-section-heading"><p className="world-eyebrow">NOTES FROM THE WORK</p><h3 id="world-notes-title">Thinking out loud.</h3></div>{posts.slice(0, 3).map(post => <article className="world-note-row" key={post.slug}><div className="world-record-meta"><span>{post.category}</span><time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time><span>{post.readTime} min read</span></div><h4><a href={`/blog/${post.slug}`}>{post.title}<Arrow/></a></h4><p className="world-body">{post.excerpt}</p></article>)}<a className="world-text-link" href="/blog">Read all {posts.length} notes <Arrow/></a></div>}
      </div>
    </section>
  </>
}
