import { PointRules } from '../types/points'
import { calcOncePoints, ListProps } from '../utils'

export const allowMint = (props: {
  user_points: ListProps
  scores: { type: number; score: number }[]
  studioServer: any
}) => {
  const { user_points, scores, studioServer } = props
  if (user_points) {
    const lack = []
    if (
      !user_points.find(point => point.type == PointRules.TWITTER || point.type == PointRules.TWITTER_VERIFY_UNIQUE)
    ) {
      lack.push('twitter')
    }

    const isBlocksEmpty = !studioServer.blocks || (studioServer.blocks && studioServer.blocks.length === 0)
    const isContractsEmpty =
      !studioServer.contracts || (studioServer.contracts && Object.keys(studioServer.contracts).length === 0)
    const isProfileEmpty =
      !studioServer.profile || (studioServer.profile && Object.keys(studioServer.profile).length === 0)
    const isTemplates =
      !studioServer.templates || (studioServer.templates && Object.keys(studioServer.templates).length === 0)

    if (!studioServer || (isBlocksEmpty && isContractsEmpty && isProfileEmpty && isTemplates)) {
      lack.push('publish')
    }
    const { score } = calcOncePoints(user_points, scores)
    if (score < 35) {
      lack.push({ type: 'coins', desc: score })
    }
    return lack
  } else {
    return ['publish', 'twitter', 'coins']
  }
}
