import { useEffect } from 'react'
import { Platform } from 'react-native'
import { router } from 'expo-router'

export function useKeyboardShortcuts() {
  useEffect(() => {
    if (Platform.OS !== 'web') return

    const handler = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case '1': router.navigate('/(tabs)/feeds'); break
          case '2': router.navigate('/(tabs)/events'); break
          case '3': router.navigate('/(tabs)/search'); break
          case '4': router.navigate('/(tabs)/saved'); break
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        router.navigate('/(tabs)/search')
      }
      if (e.key === 'Escape') router.back()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}