// Session-based storage that keeps data in memory during editing
// and saves to server when user clicks "Save Online"

import { SiteData } from './store'

let sessionData: SiteData | null = null

export function setSessionData(data: SiteData): void {
  sessionData = data
  console.log('Session data updated')
}

export function getSessionData(): SiteData | null {
  return sessionData
}

export function clearSessionData(): void {
  sessionData = null
}

export function updateSessionData(partial: Partial<SiteData>): void {
  if (sessionData) {
    sessionData = { ...sessionData, ...partial }
  }
}
