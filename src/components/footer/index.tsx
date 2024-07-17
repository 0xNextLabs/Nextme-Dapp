import { useRouter } from 'next/router'
import { Avatar, Box, Link } from '@mui/material'
import Copyright from '@/components/copyright'
import NmIcon from '@/components/nm-icon'

import config from '@/config'

const { title, logo, footer, mission } = config

const languages = [
  {
    name: 'English',
    available: true,
  },
  {
    name: 'Français',
  },
  {
    name: 'Deutsch',
  },
  {
    name: 'Español',
  },
  {
    name: 'Filipino',
  },
  {
    name: 'Korean',
  },
  {
    name: 'Chinese',
  },

  {
    name: 'Japanese',
  },
  {
    name: 'Bahasa Indonesia',
  },
  {
    name: 'Tiếng Việt',
  },
]

const Footer = () => {
  const router = useRouter()
  return (
    <footer id="home-footer" className="bg-zinc-100 pt-[4.5rem] px-12 -mx-4 max-md:px-6">
      <ul className="flex justify-between max-xl:flex-wrap">
        <li className="-mt-6 xl:max-w-sm max-xl:pb-16 w-full text-left">
          <div className="flex items-center flex-nowrap">
            <Link underline="none" href={router?.pathname === '/' ? '/#home-footer' : '/'}>
              <Avatar
                alt={`${title} Logo`}
                variant="rounded"
                src={logo.light}
                className="size-16 md:size-18 cursor-pointer"
              />
            </Link>
            <span className="text-theme-primary-focus font-satisfy text-3xl mt-4">{title}</span>
          </div>
          {/* Producthunt投票
          <Box className="pt-6 animate__animated animate__pulse animate__infinite animate__slower">
            <Link
              href="https://producthunt.com/posts/nextme-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-nextme&#0045;2"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=383250&theme=light"
                alt="Nextme - The&#0032;most&#0032;Rich&#0032;&#0038;&#0032;Beautiful&#0032;Web3&#0032;Social&#0032;Portal&#0032;and&#0032;Protocol&#0046; | Product Hunt"
                width="250"
                height="54"
              />
            </Link>
          </Box> */}
          <ul className="pt-8 flex gap-5 sm:gap-8 xl:gap-4 flex-wrap">
            {footer.media.map((row, index) => (
              <li
                key={`social-${index.toString()}`}
                className="bg-zinc-800 rounded-lg size-11 inline-flex justify-center items-center"
              >
                <Link
                  underline="none"
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:scale-125 transition ease-in-out"
                >
                  <NmIcon type={`icon-${row.icon}`} className="text-white text-[1.6rem] hover:text-green-400" />
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li className="sm:flex">
          {footer.links.map((row, index) => (
            <ul
              key={`menu-${index.toString()}`}
              className="inline-block align-top pb-12 max-md:pb-8 pr-12 xl:pr-16 2xl:pr-28 xl:last:pr-0"
            >
              <h4 className="font-poppins text-zinc-800 text-xl font-medium pb-4">{row.menu}</h4>
              {row.list.map((item, sIndex) => (
                <li key={`submenu-${sIndex.toString()}`} className="leading-10">
                  <Link
                    underline="none"
                    href={item.url || '/'}
                    target={item.target || '_self'}
                    rel="noopener noreferrer nofollow"
                    className="text-zinc-700 hover:text-theme-primary-focus"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </li>
        <li className="md:flex-1 pb-16 xl:pl-8 md:min-w-72 xl:max-w-[19rem] 2xl:max-w-xs">
          <h4 className="font-poppins text-zinc-800 text-xl font-medium pb-5">Slogan</h4>
          <h5 className="text-zinc-700 whitespace-pre-wrap">{`${mission}.`}</h5>
        </li>
      </ul>
      <ul className="pb-4 flex items-center justify-between max-md:flex-col-reverse">
        <li>
          <Copyright customClass="justify-start max-md:justify-center" />
        </li>
        <li className="flex items-center max-md:pb-5 relative">
          <select defaultValue={0} className="select select-ghost ring-transparent outline-0 ring-0 pr-0">
            {languages.map((row, index) => (
              <option key={`language_${row.name}_${index}`} disabled={!row.available} className="font-semibold">
                {row.name}
              </option>
            ))}
          </select>
          <NmIcon type="icon-world" className="mr-2 mb-1 text-xl absolute right-0" />
        </li>
      </ul>
    </footer>
  )
}

export default Footer
