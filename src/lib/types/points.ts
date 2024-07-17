export enum PointRules {
  INIT_PUBLISH = 0, // 初始发布
  REGISTER = 1, // 注册
  INVITE = 2, // 邀请
  SBT = 3, // SBT上链
  DISCORD = 4, // 加入Discord群组
  TWITTER = 5, // Twitter Profile校验
  // blocks各模块对应积分
  BLOCKS_SOCIAL = 10001,
  BLOCKS_TEXT = 10002,
  BLOCKS_LINK = 10003,
  BLOCKS_CARD = 10004,
  BLOCKS_GROUP = 10005,
  BLOCKS_CAREER = 10006,
  BLOCKS_NFT = 10007,
  BLOCKS_BADGE = 10008,
  // twitter、discord唯一验证
  TWITTER_VERIFY_UNIQUE = 10009,
  DISCORD_VERIFY_UNIQUE = 10010,
}

// 以下种类的积分只会生效一次
export const PointList = [
  PointRules.INIT_PUBLISH,
  PointRules.REGISTER,
  PointRules.SBT,
  PointRules.DISCORD,
  PointRules.TWITTER,
  PointRules.TWITTER_VERIFY_UNIQUE,
  PointRules.DISCORD_VERIFY_UNIQUE,
  PointRules.BLOCKS_SOCIAL,
  PointRules.BLOCKS_BADGE,
  PointRules.BLOCKS_CARD,
  PointRules.BLOCKS_CAREER,
  PointRules.BLOCKS_GROUP,
  PointRules.BLOCKS_LINK,
  PointRules.BLOCKS_NFT,
  PointRules.BLOCKS_TEXT,
]

export const PointMap: Record<string, PointRules> = {
  social: PointRules.BLOCKS_SOCIAL,
  text: PointRules.BLOCKS_TEXT,
  link: PointRules.BLOCKS_LINK,
  card: PointRules.BLOCKS_CARD,
  group: PointRules.BLOCKS_GROUP,
  career: PointRules.BLOCKS_CAREER,
  nft: PointRules.BLOCKS_NFT,
  badge: PointRules.BLOCKS_BADGE,
}
