import dynamic from 'next/dynamic'

import OpenLayout from '@/components/layout/open'
import Header from '@/components/header'
import Banner from '@/components/home/banner'
import ContentGateway from '@/components/home/content-gateway'
import ContentMoments from '@/components/home/content-moments'
import ContentEcosystem from '@/components/home/content-ecosystem'
import ContentDataGlobe from '@/components/home/content-dataglobe'
import ContentSpectrum from '@/components/home/content-spectrum'
import ContentCreator from '@/components/home/content-creator'
import ContentCommunity from '@/components/home/content-community'
import ContentOrganization from '@/components/home/content-organization'

import ContentSpace from '@/components/home/content-space'

import ContentCommerce from '@/components/home/content-commerce'
import ContentQuestions from '@/components/home/content-questions'
import Background from '@/components/home/background'
import Footer from '@/components/footer'

const ContentApps = dynamic(() => import('@/components/home/content-apps'))
const ContentUsers = dynamic(() => import('@/components/home/content-users'))
const ContentPartners = dynamic(() => import('@/components/home/content-partners'))
const ContentMeetups = dynamic(() => import('@/components/home/content-meetups'))

const Index = () => {
  return (
    <OpenLayout>
      <Header buttonClass="text-white border-white" />
      <Banner />
      <ContentGateway />
      <ContentMoments />

      <ContentEcosystem />

      <Background>
        <ContentDataGlobe />
        <ContentSpectrum />
      </Background>

      <ContentCreator />
      <ContentCommunity />

      <Background>
        <ContentOrganization />
      </Background>

      <ContentApps />
      <ContentSpace />

      <Background>
        <ContentUsers />
        <ContentMeetups />
        <ContentPartners />
      </Background>

      <ContentCommerce />

      <Background>
        <ContentQuestions />
      </Background>

      <Footer />
    </OpenLayout>
  )
}

export default Index
