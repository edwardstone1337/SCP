// All GA4 custom events for SCP Reader.
// Event schema is documented in TRACKING.md — update both when adding events.

export type SignInTrigger = 'nav' | 'bookmark' | 'read_toggle' | 'recently_viewed' | 'top_rated'

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: Record<string, unknown>) => void
  }
}

export function trackSignInModalOpen(trigger: SignInTrigger) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'sign_in_modal_open', {
    trigger_source: trigger,
  })
}

export type SignInMethod = 'magic_link' | 'google'

export function trackSignInSubmit(method?: SignInMethod) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'sign_in_submit', {
    ...(method && { sign_in_method: method }),
  })
}

export function trackSignInModalClose(trigger: SignInTrigger) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'sign_in_modal_close', {
    trigger_source: trigger,
  })
}

export function trackAuthComplete() {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'auth_complete')
}

export function trackOutboundWikiClick(scpId: string) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'outbound_wiki_click', {
    scp_id: scpId,
  })
}
