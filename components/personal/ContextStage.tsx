'use client'

import { career, practice, projects } from '@lib/portfolio/data'

type ContextStageProps = {
  topic: string
  onAsk: (question: string) => void
  busy: boolean
}

function RecordLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      className="context-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${children} (opens in a new tab)`}
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

export function ContextStage({ topic, onAsk, busy }: ContextStageProps) {
  const project = topic.startsWith('project:')
    ? projects.find(item => item.slug === topic.slice('project:'.length))
    : undefined
  const focusedRole = topic.startsWith('career:')
    ? career.find(item => item.id === topic.slice('career:'.length))
    : undefined

  if (project) {
    return (
      <section className="context-stage" aria-labelledby="context-heading" data-topic={topic}>
        <p className="context-label">Selected work / {project.number} · {project.status}</p>
        <h2 className="context-title" id="context-heading">{project.name}</h2>
        <p className="context-description"><strong>{project.line}</strong></p>
        <p className="context-description">{project.description}</p>
        <ol className="context-path" aria-label={`${project.name} conceptual workflow`}>
          {project.stages.map((stage, index) => (
            <li key={stage}>
              <span className="context-step-number" aria-hidden="true">0{index + 1}</span>
              <span>{stage}</span>
            </li>
          ))}
        </ol>
        <ul className="context-tags" aria-label="Project technologies and focus">
          {project.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
        <p className="context-limitation">{project.limitations}</p>
        <RecordLink href={`/work/${project.slug}`}>Explore the project record</RecordLink>
      </section>
    )
  }

  if (topic === 'career' || topic === 'fit' || focusedRole) {
    return (
      <section className="context-stage" aria-labelledby="context-heading" data-topic={topic}>
        <p className="context-label">Experience / The public career record</p>
        <h2 className="context-title" id="context-heading">Built over time.</h2>
        <p className="context-description">
          {focusedRole?.theme ?? 'From frontend development and quality engineering to technical direction across frontend, backend and native journeys.'}
        </p>
        <ol className="context-career" aria-label="Career timeline, most recent first">
          {career.map(role => (
            <li key={role.id} className={focusedRole?.id === role.id ? 'is-selected' : undefined}>
              <div>
                <h3>{role.company}</h3>
                <p>{role.role}</p>
              </div>
              <p>{role.dates}</p>
              {focusedRole?.id === role.id && <p className="context-career-focus">{role.theme}</p>}
            </li>
          ))}
        </ol>
        <RecordLink href="/profile">Read the full career record</RecordLink>
      </section>
    )
  }

  if (topic === 'approach' || topic === 'collaboration') {
    return (
      <section className="context-stage" aria-labelledby="context-heading" data-topic={topic}>
        <p className="context-label">Practice / How the work comes together</p>
        <h2 className="context-title" id="context-heading">Intent into systems.</h2>
        <p className="context-description">A frontend foundation, hands-on backend and native delivery, and a focus on architecture and quality.</p>
        <ul className="context-practice" aria-label="Engineering practice">
          {practice.map(area => (
            <li key={area.name}>
              <h3>{area.name}</h3>
              <p>{area.items.join(' · ')}</p>
            </li>
          ))}
        </ul>
        {topic === 'collaboration' && (
          <p className="context-limitation">Scope, timing and availability need direct confirmation with Animesh.</p>
        )}
        <RecordLink href={topic === 'collaboration' ? '/contact' : '/profile'}>
          {topic === 'collaboration' ? 'Discuss your idea' : 'Explore the engineering practice'}
        </RecordLink>
      </section>
    )
  }

  if (topic === 'projects') {
    return (
      <section className="context-stage" aria-labelledby="context-heading" data-topic={topic}>
        <p className="context-label">Independent work / Three places to start</p>
        <h2 className="context-title" id="context-heading">Ideas, made real.</h2>
        <p className="context-description">Explore the decisions, workflows and limits behind the projects.</p>
        <ul className="context-projects" aria-label="Choose a project to explore">
          {projects.slice(0, 3).map(item => (
            <li key={item.slug}>
              <button type="button" disabled={busy} onClick={() => onAsk(`Tell me about ${item.name}`)}>
                <span className="context-label">{item.number} / {item.status}</span>
                <strong>{item.name}</strong>
                <span>{item.line}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </li>
          ))}
        </ul>
        <RecordLink href="/work">See all project records</RecordLink>
      </section>
    )
  }

  if (topic === 'contact') {
    return (
      <section className="context-stage" aria-labelledby="context-heading" data-topic={topic}>
        <p className="context-label">Contact / Start a conversation</p>
        <h2 className="context-title" id="context-heading">Meet the person.</h2>
        <p className="context-description">Discuss a project, engineering role or collaboration directly with Animesh.</p>
        <RecordLink href="/contact">Contact Animesh</RecordLink>
      </section>
    )
  }

  return (
    <section className="context-stage" aria-labelledby="context-heading" data-topic="overview">
      <p className="context-label">Animesh Basak / The public profile</p>
      <h2 className="context-title" id="context-heading">Engineering with intent.</h2>
      <p className="context-description">{career[0].role} at {career[0].company}. Frontend platform engineering, backend and native delivery, and independent AI tools.</p>
      <ul className="context-tags" aria-label="Areas of practice">
        {practice.map(area => <li key={area.name}>{area.name}</li>)}
      </ul>
      <RecordLink href="/profile">Explore the public profile</RecordLink>
    </section>
  )
}

export default ContextStage
