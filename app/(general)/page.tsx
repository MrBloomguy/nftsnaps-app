// @ts-nocheck
'use client'
import { useState } from 'react'

import { motion } from 'framer-motion'
import { create } from 'ipfs-http-client'
import { AtSign, ImageIcon, Swords } from 'lucide-react'
import Balancer from 'react-wrap-balancer'
import { useAccount } from 'wagmi'

import { WalletConnect } from '@/components/blockchain/wallet-connect'
import Gallery from '@/components/collect/gallery'
import ComposeSection from '@/components/ComposeSection'
import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import useScroll from '@/lib/hooks/use-scroll'

// Inline Compose Section Component
function ComposeSection() {
  const [content, setContent] = useState('')
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [userQuery, setUserQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fileIpfsHash, setFileIpfsHash] = useState('')

  const { address, isConnected } = useAccount()

  // IPFS Configuration
  const projectId = process.env.NEXT_PUBLIC_IPFS_ID
  const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: { authorization: auth },
  })

  // Mock users for suggestions
  const mockUsers = [
    { username: 'johndoe', name: 'John Doe' },
    { username: 'janedoe', name: 'Jane Doe' },
  ]

  const handleContentChange = (e) => {
    const value = e.target.value
    setContent(value)

    // Check for user suggestion trigger
    const mentionMatch = value.match(/@(\w+)/)
    if (mentionMatch) {
      setUserQuery(mentionMatch[1])
      setShowUserSuggestions(true)
    } else {
      setShowUserSuggestions(false)
    }
  }

  const handleUserSelect = (username) => {
    // Replace the partial mention with full username
    setContent((prev) => prev.replace(/@\w+/, `@${username}`))
    setShowUserSuggestions(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const added = await client.add(file)
      setFileIpfsHash(added.path)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const handleCreateChallenge = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      // Implement challenge creation logic here
      console.log('Creating challenge:', content)
      // Reset after successful creation
      setContent('')
      setFileIpfsHash('')
    } catch (error) {
      console.error('Challenge creation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    return isLoading ? 'Creating...' : 'Challenge'
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
      <div className="flex space-x-4">
        <img
          src={isConnected ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`}
          alt="Avatar"
          className="h-12 w-12 rounded-full"
        />

        <div className="relative w-full">
          <textarea
            placeholder={`Use "/challenge @username" to create a new challenge`}
            value={content}
            onChange={handleContentChange}
            className="w-full resize-none rounded-lg border p-2 dark:bg-neutral-800 dark:text-white"
            rows={1}
          />
          {showUserSuggestions && (
            <div className="absolute z-10 max-h-60 overflow-y-auto rounded-lg border bg-white shadow-md dark:bg-neutral-800">
              {mockUsers
                .filter((user) => user.username.toLowerCase().includes(userQuery.toLowerCase()))
                .map((user) => (
                  <button
                    key={user.username}
                    className="flex w-full cursor-pointer items-center p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    onClick={() => handleUserSelect(user.username)}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="mr-2 h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-sm text-gray-500">@{user.username}</span>
                    </div>
                  </button>
                ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700">
                <AtSign size={20} />
              </button>
              <label className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <ImageIcon size={20} />
              </label>
            </div>
            <button
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              onClick={handleCreateChallenge}
              disabled={!content.trim() || isLoading}>
              <Swords size={18} />
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
      {fileIpfsHash && (
        <div className="mt-2 flex items-center justify-center">
          <img src={`https://ipfs.io/ipfs/${fileIpfsHash}`} alt="Uploaded" className="h-auto max-w-full rounded-lg" />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const scrolled = useScroll(50)

  return (
    <>
      <div className="relative flex flex-1 pt-12">
        <div className="flex-center flex h-full flex-1 flex-col items-center justify-center text-center">
          <motion.div
            className="max-w-5xl px-5 xl:px-0"
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}>
            <motion.h1
              className="text-gradient-primary text-center text-5xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-8xl md:leading-[8rem]"
              variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <Balancer>NFT Snaps Disappearing NFTs</Balancer>
            </motion.h1>
            <motion.p className="mt-6 text-center text-gray-700 dark:text-gray-200 md:text-xl" variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <Balancer className="text-2xl leading-8">Collect your favorite Snaps while they&apos;re still visible.</Balancer>
            </motion.p>
            <div className="mt-8 flex min-w-fit items-center justify-center">
              <BranchIsWalletConnected>
                <Gallery />
                <WalletConnect />
              </BranchIsWalletConnected>
            </div>

            {/* Compose Section */}
            <div className="mt-8 w-full">
              <ComposeSection />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
