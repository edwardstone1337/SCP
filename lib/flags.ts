export const flags = {
  premiumEnabled: process.env.NODE_ENV === 'development',
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  degradedMode: process.env.NEXT_PUBLIC_DEGRADED_MODE === 'true',
} as const
