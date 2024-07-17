import { Box } from '@mui/material'
import GatewayLayout from '@/components/layout/gateway'
import SignCard from '@/components/gateway/SignCard'

export default function Gateway() {
  return (
    <GatewayLayout>
      <>
        <header className="pt-32 md:pt-16">
          <Box className="text-center">
            <h1 className="font-righteous pb-4 text-3xl lg:text-4xl">Log in to your Nextme</h1>
            <p className=" text-black/50 pb-4">Good to have you back!</p>
          </Box>
        </header>
        <SignCard />
      </>
    </GatewayLayout>
  )
}
