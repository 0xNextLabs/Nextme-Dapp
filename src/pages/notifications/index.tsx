import StudioLayout from '@/components/layout/studio'
import NmComing from '@/components/nm-coming'

import config from '@/config'

const { domains } = config

export default function Notifications() {
  return (
    <StudioLayout>
      <NmComing />
    </StudioLayout>
  )
}
