import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { Container } from '@/components/ui/container'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'

export async function Navigation() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav
      style={{
        backgroundColor: 'var(--color-grey-9)',
        borderBottom: '1px solid var(--color-grey-8)',
        paddingTop: 'var(--spacing-2)',
        paddingBottom: 'var(--spacing-2)',
      }}
    >
      <Container size="lg">
        <div
          style={{
            paddingLeft: 'var(--spacing-page-padding)',
            paddingRight: 'var(--spacing-page-padding)',
          }}
        >
          <Stack direction="horizontal" align="center" justify="between" gap="normal">
            <Link href="/" variant="nav">
              <Stack direction="horizontal" align="center" gap="tight">
                <Logo size="sm" />
                <span>SCP Continuum</span>
              </Stack>
            </Link>

            <Stack direction="horizontal" align="center" gap="loose">
              {user ? (
                <>
                  <Link href="/series" variant="default">
                    Series
                  </Link>
                  <Text as="span" variant="secondary" size="sm">
                    {user.email}
                  </Text>
                  <form action={signOut}>
                    <Button type="submit" variant="ghost" size="sm">
                      Sign Out
                    </Button>
                  </form>
                </>
              ) : (
                <Button href="/login" variant="ghost" size="sm">
                  Sign In
                </Button>
              )}
            </Stack>
          </Stack>
        </div>
      </Container>
    </nav>
  )
}
