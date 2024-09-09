import { useMemo } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import NmSpin from '@/components/nm-spin'
import Layout from '@/components/layout'
import Portal from '@/components/portal'
import StudioLayout from '@/components/layout/studio'
import LandingLayout from '@/components/landing/base/layout'
import { UserNamePageContext } from '@/components/context/username'
import mongodbPromise from '@/lib/mongodb/mongodb_master'
import { getOneUserByName } from '@/lib/api/user'
import { getUserStudioByUuid } from '@/lib/api/studio'
import { useIsUserLogin, useStudioData } from '@/lib/hooks'

import config from '@/config'

const { logo } = config
interface Params extends ParsedUrlQuery {
  username: string
}

;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
  try {
    await mongodbPromise
  } catch (e: any) {
    if (e.code === 'ENOTFOUND') {
      // cluster is still provisioning
      return {
        props: {
          clusterStillProvisioning: true,
        },
      }
    } else {
      console.log('Error is ', e)

      throw new Error('Connection limit reached. Please try again later.', e)
    }
  }

  const { username } = context.params as Params

  let user = await getOneUserByName(username)
  user = JSON.parse(JSON.stringify(user, (key, value) => (typeof value === 'bigint' ? Number(value) : value))) as any
  if (!user || !user?.uuid) {
    return {
      notFound: true,
      revalidate: 10,
    }
  } else {
    const studio = await getUserStudioByUuid(user.uuid)
    return {
      props: {
        user,
        studio,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    }
  }
}

export default function RenderUser({ user, studio }) {
  const router = useRouter()
  const userStudio = useStudioData()
  const { loginStatus, loginLoading, uuid } = useIsUserLogin()

  const isUserSelf = useMemo(() => {
    if (loginLoading) return true
    if (!uuid) return false
    if (uuid != user?.uuid) return false
    return true
  }, [userStudio, loginLoading, uuid, studio, user])

  if (!isUserSelf || router.query?.newtab) {
    return <LandingLayout user={user} studio={studio} />
  }

  return loginStatus || loginLoading ? (
    <StudioLayout>
      <Portal />
    </StudioLayout>
  ) : (
    <UserNamePageContext.Provider value={{ user, studio }}>
      <Layout>
        {isUserSelf ? (
          <LandingLayout user={user} studio={studio} />
        ) : (
          <section className="relative flex flex-col justify-center items-center h-screen">
            <NmSpin />
            <Box className="absolute right-2 bottom-2 animate__animated animate__pulse animate__slow animate__infinite">
              <Image alt="" width="64" height="64" src={logo.light} />
            </Box>
          </section>
        )}
      </Layout>
    </UserNamePageContext.Provider>
  )
}
