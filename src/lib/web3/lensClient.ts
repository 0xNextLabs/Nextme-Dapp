import { LensClient, production } from '@lens-protocol/client'

const lensClient = new LensClient({
  environment: production,
})

export const getAddressByLensHandle = async (handle: string): Promise<string> => {
  const lensProfile = await lensClient.profile.fetch({
    forHandle: handle,
  })
  return lensProfile?.ownedBy?.address || ''
}
