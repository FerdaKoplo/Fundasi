import React, { useMemo, useRef } from 'react'

export const useSectionRefs = (navList: {key:string}[]) => {
  return useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {}

    navList.forEach((section) => {
      refs[section.key] = useRef<HTMLDivElement | null>(null)
    })

    return refs
  }, [navList]) 
}