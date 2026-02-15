import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { PageHeader } from '@/components/ui/page-header'
import { SettingsContent } from '@/app/settings/settings-content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Settings — SCP Reader',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/settings')
  }

  return (
    <Main>
      <Container size="md">
        <Breadcrumb items={[{ label: 'Settings' }]} />
        <PageHeader title="Terminal Configuration" />
        <SettingsContent userId={user.id} userEmail={user.email ?? undefined} />
      </Container>
    </Main>
  )
}
