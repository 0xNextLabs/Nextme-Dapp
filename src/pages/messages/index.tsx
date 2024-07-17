/*
 * Copyright (c) 2022 Next Labs. All rights reseved.
 * @fileoverview | IM Messages
 * @version 0.1 | 2024-01-14 // Initial version.
 * @Date: 2024-01-14 10:00:03
 * @Last Modified by: 0x3Anthony
 * @Last Modified time: 2022-12-23 17:44:15
 */
import StudioLayout from '@/components/layout/studio'
import NmComing from '@/components/nm-coming'

import config from '@/config'

const { domains } = config

export default function Messages() {
  return (
    <StudioLayout>
      <NmComing />
    </StudioLayout>
  )
}
