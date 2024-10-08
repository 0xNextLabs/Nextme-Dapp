export enum TASK_TYPE {
  PUBLISH = 0,
  INVITED_IN,
  INVITED_OTHERS,
  CLAIM_SBT,
  JOIN_DISCORD,
  LINK_TWITTER,
  CONNECT_FARCASTER,
}

export const TASK_LIST = [
  {
    type: TASK_TYPE.PUBLISH,
    name: 'Publish Bio',
    icon: 'publish_filled',
    score: '20（Max）',
    detail: 'All Blocks types personalized',
    btn: 'Publish',
    tooltip: 'Advice to personalize your own data',
  },
  {
    type: TASK_TYPE.LINK_TWITTER,
    name: 'Connect X(Twitter)',
    icon: 'twitter',
    score: '15',
    detail: 'Copy your portal link ➙ Twitter',
    btn: 'Verify Twitter',
  },
  {
    type: TASK_TYPE.JOIN_DISCORD,
    name: 'Discord Social',
    icon: 'discord',
    score: '5',
    detail: 'Join Official Discord',
    btn: 'Join Discord',
  },
  {
    type: TASK_TYPE.CLAIM_SBT,
    name: 'Claim Nextme Pay',
    icon: 'proof',
    score: '50',
    detail: 'Freemint in limited time',
    btn: 'Mint',
  },
  {
    type: TASK_TYPE.INVITED_OTHERS,
    name: 'Invite Friends',
    icon: 'invite',
    score: 'x 10（Per user）',
    detail: 'Invite new users to Nextme',
    btn: 'Invite',
  },
  {
    type: TASK_TYPE.CONNECT_FARCASTER,
    name: 'Connect Farcaster',
    icon: 'farcaster',
    score: '10',
    detail: 'Explore Farcaster Ecosystem',
    btn: 'Upcoming',
    disabled: true,
  },
]
