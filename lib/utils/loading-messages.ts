const loadingMessages = {
  default: [
    'Retrieving document...',
    'Decrypting file...',
    'Accessing archive...',
    'Loading classified data...',
    'Authenticating clearance...',
  ],
  reader: [
    'Retrieving SCP document...',
    'Decrypting containment file...',
    'Loading classified entry...',
    'Accessing Foundation archive...',
  ],
  series: [
    'Loading series index...',
    'Accessing classification records...',
    'Retrieving containment database...',
  ],
  saved: [
    'Loading saved documents...',
    'Retrieving bookmarked files...',
    'Accessing personal archive...',
  ],
  auth: [
    'Verifying credentials...',
    'Authenticating clearance level...',
    'Processing access request...',
  ],
}

export function getLoadingMessage(context: keyof typeof loadingMessages = 'default'): string {
  const messages = loadingMessages[context]
  return messages[Math.floor(Math.random() * messages.length)]
}
