import Link from 'next/link'
import OnboardingDemo from './OnboardingDemo'
import s from './services.module.css'

export default function ServicesPage() {
  return <div className={s.page}>
    <header className={s.hero}>
      <p className="folio-eyebrow">A focused service / for small agencies</p>
      <h1>A clearer path<br />from yes <span>to kickoff.</span></h1>
      <p className={s.lead}>Client onboarding workflow sprint</p>
      <p>When a new client says yes, the next step shouldn’t depend on searching through messages. I’ll help turn one onboarding workflow into an intake, a tracker and a kickoff brief your team can review.</p>
      <div className={s.actions}><a className="folio-btn" data-variant="primary" href="#onboarding-demo">Try the working demo ↓</a><a className="folio-btn" href="mailto:animeshsbasak@gmail.com?subject=Client%20onboarding%20workflow%20sprint%20enquiry">Discuss your workflow ↗</a></div>
    </header>

    <section className={s.offer} aria-labelledby="scope-title">
      <div><p className="folio-eyebrow">One workflow / a clear handoff</p><h2 id="scope-title">Small enough<br />to finish.</h2><p>For a small agency or independent studio with a repeatable client intake process and a named person who can review the result.</p></div>
      <div className={s.price}><span className="folio-eyebrow">Proposed pilot price</span><strong>₹15,000</strong><span>One time · one onboarding workflow</span><p>Final scope, timing and total price are confirmed before work or payment. This is a pilot offer, not a booking or payment page.</p></div>
      <ol className={s.scope}>
        <li><span>01</span><div><h3>One intake</h3><p>A form that captures the facts and decisions your team needs before kickoff.</p></div></li>
        <li><span>02</span><div><h3>One tracker</h3><p>A shared place for the owner, status, missing items and next action, using agreed tools you already have.</p></div></li>
        <li><span>03</span><div><h3>A reviewed kickoff</h3><p>A reusable brief and checklist, with a person checking the details before anything is shared.</p></div></li>
        <li><span>04</span><div><h3>A usable handoff</h3><p>A fictional test case, written setup notes and one handoff review so your team knows how to run it.</p></div></li>
      </ol>
      <div className={s.boundaries}><h3>Agree the edges first.</h3><p>The pilot covers one form → one tracker → one reviewed kickoff template. Custom CRM builds, data migration, paid tools, automatic outreach and ongoing support are outside this offer. Any integration that needs paid access is discussed before it is added. Maintenance is optional and quoted separately.</p></div>
    </section>

    <section id="onboarding-demo" className={s.demo} aria-labelledby="demo-title">
      <p className="folio-eyebrow">Try the shape of the workflow</p><h2 id="demo-title">From intake<br /><span>to a usable brief.</span></h2>
      <p className={s.demoIntro}>Use the fictional example or enter a small project. This demo formats your facts into a Markdown brief and checklist. It doesn’t connect your tools or create a live tracker.</p>
      <OnboardingDemo />
    </section>

    <section className={s.next} aria-labelledby="next-title"><p className="folio-eyebrow">If the workflow fits</p><h2 id="next-title">Start with one handoff.</h2><p>Send a short description of your current intake process and where it gets stuck. We’ll confirm fit, scope and timing before any work begins.</p><div className={s.actions}><a className="folio-btn" data-variant="primary" href="mailto:animeshsbasak@gmail.com?subject=Client%20onboarding%20workflow%20sprint%20enquiry">Open an email enquiry ↗</a><Link className="folio-btn" href="/work">See independent work ↗</Link></div><p className={s.note}>Email: animeshsbasak@gmail.com · Opens your email app; you review and send.</p></section>
  </div>
}
