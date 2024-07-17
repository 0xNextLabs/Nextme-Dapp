import Image from 'next/image'
import { Link } from '@mui/material'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getBlurDataURL } from '@/lib/utils'
import config from '@/config'

const { images } = config

export default function Privacy() {
  return (
    <Layout customClass="max-w-screen-2k pt-2 px-4">
      <Header logoTextClass="text-theme-primary-focus" />
      <main className="w-11/12 sm:5/6 md:w-4/5 py-16 m-auto">
        <Image
          alt=""
          width="1280"
          height="480"
          placeholder="blur"
          src={images.banner.dark}
          blurDataURL={getBlurDataURL(1280, 480)}
          className="rounded-lg"
        />
        <article className="prose max-w-none">
          <h1 className="font-righteous font-semibold mt-10 text-5xl max-sm:text-3xl">Privacy Policy</h1>
          <blockquote className="-mt-6 text-sm sm:text-base font-normal">Last Updated: September 22nd, 2022</blockquote>
          <h2>Your privacy is important to us</h2>
          <p>
            It is Nextme's policy to respect your privacy regarding any information we may collect while operating our
            website. This Privacy Policy applies to <Link href="/">nextme.one</Link> (hereinafter, "us", "we", or
            "nextme.one"). We respect your privacy and are committed to protecting personally identifiable information
            you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain
            what information may be collected on our Website, how we use this information, and under what circumstances
            we may disclose the information to third parties. This Privacy Policy applies only to information we collect
            through the Website and does not apply to our collection of information from other sources.
          </p>
          <p>
            This Privacy Policy, together with the Terms of service posted on our Website, set forth the general rules
            and policies governing your use of our Website. Depending on your activities when visiting our Website, you
            may be required to agree to additional terms of service.
          </p>
          <h2>Contents</h2>
          <span>Click below to jump to any section of this privacy policy</span>
          <ol>
            <li>
              <strong>Website Visitors</strong>
            </li>
            <li>
              <strong>Personally-Identifying Information</strong>
            </li>
            <li>
              <strong>Security</strong>
            </li>
            <li>
              <strong>Advertisements</strong>
            </li>

            <li>
              <strong>strongs To External Sites</strong>
            </li>
            <li>
              <strong>Protection of Certain Personally-Identifying Information</strong>
            </li>
            <li>
              <strong>Aggregated Statistics</strong>
            </li>
            <li>
              <strong>Cookies</strong>
            </li>
            <li>
              <strong>E-commerce</strong>
            </li>

            <li>
              <strong>Business Transfers</strong>
            </li>
            <li>
              <strong>Privacy Policy Changes</strong>
            </li>
            <li>
              <strong>Contact Information & Credit</strong>
            </li>
          </ol>
          <h3>Website Visitors</h3>
          <p>
            Like most website operators, Nextme collects non-personally-identifying information of the sort that web
            browsers and servers typically make available, such as the browser type, language preference, referring
            site, and the date and time of each visitor request. Nextme's purpose in collecting non-personally
            identifying information is to better understand how Nextme's visitors use its website.
          </p>
          <p>
            From time to time, Nextme may release non-personally-identifying information in the aggregate, e.g., by
            publishing a report on trends in the usage of its website. Nextme also collects potentially
            personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users
            leaving comments on <Link href="/">nextme.one</Link> blog posts. Nextme only discloses logged in user and
            commenter IP addresses under the same circumstances that it uses and discloses personally-identifying
            information as described below.
          </p>
          <h3>Personally-Identifying Information</h3>
          <p>
            Certain visitors to Nextme's websites choose to interact with Nextme in ways that require Nextme to gather
            personally-identifying information. The amount and type of information that Nextme gathers depends on the
            nature of the interaction. For example, we ask visitors who leave a comment at
            <Link href="/"> nextme.one</Link> to provide a username and email address.
          </p>
          <h3>Security</h3>
          <p>
            The security of your Personal Information is important to us, but remember that no method of transmission
            over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </p>
          <h3>Advertisements</h3>
          <p>
            Ads appearing on our website may be delivered to users by creation partners, who may set cookies. These
            cookies allow the ad server to recognize your computer each time they send you an online advertisement to
            compile information about you or others who use your computer. This information allows ad networks to, among
            other things, deliver targeted advertisements that they believe will be of most interest to you. This
            Privacy Policy covers the use of cookies by Nextme and does not cover the use of cookies by any advertisers.
          </p>
          <h3>Links To External Sites</h3>
          <p>
            Our Service may contain links to external sites that are not operated by us. If you click on a third party
            link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy
            and terms of service of every site you visit.
          </p>
          <p>
            We have no control over, and assume no responsibility for the content, privacy policies or practices of any
            third party sites, products or services.
          </p>
          <h3>Protection of Certain Personally-Identifying Information</h3>
          <p>
            Nextme discloses potentially personally-identifying and personally-identifying information only to those of
            its employees, contractors and affiliated organizations that (i) need to know that information in order to
            process it on Nextme's behalf or to provide services available at Nextme's website, and (ii) that have
            agreed not to disclose it to others. Some of those employees, contractors and affiliated organizations may
            be located outside of your home country; by using Nextme's website, you consent to the transfer of such
            information to them. Nextme will not rent or sell potentially personally-identifying and
            personally-identifying information to anyone. Other than to its employees, contractors and affiliated
            organizations, as described above, Nextme discloses potentially personally-identifying and
            personally-identifying information only in response to a subpoena, court order or other governmental
            request, or when Nextme believes in good faith that disclosure is reasonably necessary to protect the
            property or rights of Nextme, third parties or the public at large.
          </p>
          <p>
            If you are a registered user of <Link href="/">nextme.one</Link> and have supplied your email address,
            Nextme may occasionally send you an email to tell you about new features, solicit your feedback, or just
            keep you up to date with what's going on with Nextme and our products. We primarily use our blog to
            communicate this type of information, so we expect to keep this type of email to a minimum. If you send us a
            request (for example via a support email or via one of our feedback mechanisms), we reserve the right to
            publish it in order to help us clarify or respond to your request or to help us support other users. Nextme
            takes all measures reasonably necessary to protect against the unauthorized access, use, alteration or
            destruction of potentially personally-identifying and personally-identifying information.
          </p>
          <h3>Aggregated Statistics</h3>
          <p>
            Nextme may collect statistics about the behavior of visitors to its website. Nextme may display this
            information publicly or provide it to others. However, Nextme does not disclose your personally-identifying
            information.
          </p>
          <h3>Cookies</h3>
          <p>
            To enrich and perfect your online experience, Nextme uses "Cookies", similar technologies and services
            provided by others to display personalized content, appropriate creation and store your preferences on your
            computer.
          </p>
          <p>
            A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's
            browser provides to the website each time the visitor returns. Nextme uses cookies to help Nextme identify
            and track visitors, their usage of <Link href="/">nextme.one</Link> and their website access preferences.{' '}
          </p>
          <p>
            Nextme visitors who do not wish to have cookies placed on their computers should set their browsers to
            refuse cookies before using Nextme's websites, with the drawback that certain features of Nextme's websites
            may not function properly without the aid of cookies.
          </p>
          <p>
            By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and
            agree to Nextme's use of cookies.
          </p>
          <h3>E-commerce</h3>
          <p>
            Those who engage in transactions with Nextme – by purchasing Nextme's services or products, are asked to
            provide additional information, including as necessary the personal and financial information required to
            process those transactions. In each case, Nextme collects such information only insofar as is necessary or
            appropriate to fulfill the purpose of the visitor's interaction with Nextme. Nextme does not disclose
            personally-identifying information other than as described below. And visitors can always refuse to supply
            personally-identifying information, with the caveat that it may prevent them from engaging in certain
            website-related activities.
          </p>
          <h3>Business Transfers</h3>
          <p>
            If Nextme, or substantially all of its assets, were acquired, or in the unlikely event that Nextme goes out
            of business or enters bankruptcy, user information would be one of the assets that is transferred or
            acquired by a third party. You acknowledge that such transfers may occur, and that any acquirer of Nextme
            may continue to use your personal information as set forth in this policy.
          </p>
          <h3>Privacy Policy Changes</h3>
          <p>
            Although most changes are likely to be minor, Nextme may change its Privacy Policy from time to time, and in
            Nextme's sole discretion. Nextme encourages visitors to frequently check this page for any changes to its
            Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your
            acceptance of such change.
          </p>
          <h3>Contact Information & Credit</h3>
          <p>
            If you have any questions about our Privacy Policy, please contact us via
            <Link href="mailto:contact@nextme.one" className="ml-1">
              contact@nextme.one
            </Link>
            .
          </p>
        </article>
      </main>
      <Footer />
    </Layout>
  )
}
