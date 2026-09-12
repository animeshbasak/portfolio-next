export type Perspective = 'hiring' | 'engineering' | 'ai'
export const perspectives = {
 hiring: {label:'Experience & fit', title:'Responsibility, earned through building.', intro:'From testing the foundations to shaping shared frontend platforms. Follow my career, the responsibilities I have taken on and the independent work that keeps me learning.', section:'career'},
 engineering: {label:'Engineering decisions', title:'The interface is where the system becomes real.', intro:'How a product is structured affects how it behaves. Explore my work through architecture, performance, reusable UI and the choices behind independent projects.', section:'work'},
 ai: {label:'Independent AI work', title:'Curiosity, with a working method.', intro:'I build tools around AI: ways to recover context, structure a workflow and keep human review in the process. Explore five independent projects and the decisions behind them.', section:'work'},
} as const
export function classifyPerspective(text:string): Perspective | null {
 if (/\b(ai|agent|paarth|friday|llm|automation|model)\b/i.test(text)) return 'ai'
 if (/\b(hir\w*|recruit\w*|career|resume|résumé|experience|role|team|fit)\b/i.test(text)) return 'hiring'
 if (/\b(engineer\w*|frontend|architecture|react|performance|project|build|code|system)\b/i.test(text)) return 'engineering'
 return null
}
