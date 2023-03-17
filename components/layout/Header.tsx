import React from 'react'

import classNames from 'clsx'
import Image from 'next/image'

import { WalletConnect } from '@/components/blockchain/wallet-connect'
import { siteConfig } from '@/config/site'
import useScroll from '@/lib/hooks/use-scroll'

import Dropdown from './dropdown'
import { BranchColorMode } from '../shared/branch-color-mode'
import { LinkComponent } from '../shared/link-component'
import { ResponsiveMobileAndDesktop } from '../shared/responsive-mobile-and-desktop'
import { ThemeToggle } from '../shared/theme-toggle'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const scrolled = useScroll(50)
  const classes = classNames(
    props.className,
    'Header',
    'fixed top-0 w-full',
    'px-6 lg:px-10 py-3 mb-8 flex items-center',
    {
      'border-b border-gray-200 bg-white/50 backdrop-blur-xl dark:bg-black/50 dark:border-gray-800': scrolled,
    },
    'z-30 transition-all'
  )
  return (
    <header className={classes}>
      <ResponsiveMobileAndDesktop>
        <>
          <LinkComponent href="/" className="flex min-w-[32px] flex-1 items-center">
            <BranchColorMode>
              <Image alt="Logo" src="/logo-dark.png" width={32} height={32} />
              <Image alt="Logo" src="/logo-white.png" width={32} height={32} />
            </BranchColorMode>
          </LinkComponent>
          <div className="-mr-2 flex grow justify-end gap-4">
            <WalletConnect />
            <Dropdown />
          </div>
        </>
        <>
          <LinkComponent className="flex items-center" href="/">
            <BranchColorMode>
              <Image alt="Logo" src="/logo-dark.png" width={32} height={32} />
              <Image alt="Logo" src="/logo-white.png" width={32} height={32} />
            </BranchColorMode>
            <h1 className="text-gradient-sand ml-2 text-2xl font-bold">{siteConfig.name}</h1>
          </LinkComponent>
          <div className="-mr-2 flex grow justify-end gap-4">
            <WalletConnect />
            <LinkComponent className="mb-2 flex items-center" href="/collected">
              <button className="btn btn-pill bg-gradient-button-green">
                <span className="px-2">Collected</span>
              </button>
            </LinkComponent>
            <LinkComponent className="mb-2 flex items-center" href="/create">
              <button className="btn btn-pill bg-gradient-button">
                <span className="px-2">Create</span>
              </button>
            </LinkComponent>
            <ThemeToggle />
          </div>
        </>
      </ResponsiveMobileAndDesktop>
    </header>
  )
}
