import {Suspense} from 'react'
import ProofStudio from '../../../components/portfolio/ProofStudio'
export const metadata={alternates:{canonical:'/studio'},title:'Proof Studio — Animesh Basak',description:'Change a requirement, compare two approaches, and replay the counterexample.'}
export default function Page(){return <Suspense fallback={<p style={{padding:60}}>Opening the experiment…</p>}><ProofStudio/></Suspense>}
