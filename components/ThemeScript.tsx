/**
 * Inline script that sets the theme BEFORE first paint to avoid a flash of the
 * wrong theme. Reads a saved choice from localStorage, else the OS preference.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
