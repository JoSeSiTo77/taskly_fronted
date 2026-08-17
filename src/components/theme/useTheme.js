import { useCallback, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'taskly-theme'

function getSavedTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
  }, [theme])

  return {
    theme,
    toggleTheme,
  }
}
