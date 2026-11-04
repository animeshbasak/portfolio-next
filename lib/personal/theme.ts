export type PortfolioThemeName = 'light' | 'dark'
export const THEME_KEY = 'portfolio-theme'
export function resolveTheme(saved: unknown, systemDark: boolean): PortfolioThemeName {
  return saved === 'light' || saved === 'dark' ? saved : systemDark ? 'dark' : 'light'
}
// Resolve before paint; storage can be blocked independently of system preferences.
export const THEME_BOOTSTRAP = `(function(){var saved=null;try{saved=localStorage.getItem('${THEME_KEY}')}catch(e){}var theme=saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-portfolio-theme',theme)})();`
