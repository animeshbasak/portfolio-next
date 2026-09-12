export default function Icon({name,className}:{name:'home'|'work'|'studio'|'menu'|'arrow'|'close';className?:string}) {
  const paths={home:'M3 10 12 3 21 10V21H15V14H9V21H3Z',work:'M3 6H21V21H3ZM8 6V3H16V6M3 12H21',studio:'M12 3V9M12 9 4 21M12 9 20 21M4 21H20',menu:'M4 6H20M4 12H20M4 18H20',arrow:'M5 19 19 5M5 5H19V19',close:'M5 5 19 19M5 19 19 5'}
  return <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d={paths[name]}/></svg>
}
