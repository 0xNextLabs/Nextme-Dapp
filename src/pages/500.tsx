import NmStatus from '@/components/nm-status'

export default function Page404() {
  return (
    <NmStatus
      status="500"
      text="Server lost！"
      imageClass="mb-8"
      image="https://cdn.svgator.com/images/2022/11/Cactus-party-of-4.gif"
    />
  )
}
