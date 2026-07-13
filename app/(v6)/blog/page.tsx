import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Transmissions — Animesh Basak',
  description: 'Field notes from a decade at the intersection of engineering craft, AI systems, and building things that survive contact with reality.',
}

export default function BlogPage() {
  // Unified SPA experience: Any request to /blog redirects back to the 
  // transmissions section on the main homepage scroll.
  redirect('/#blog')
}
