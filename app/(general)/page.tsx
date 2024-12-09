// @ts-nocheck
'use client'
import { useState } from 'react'
import ComposeSection from '@/components/ComposeSection'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import { AtSign, ImageIcon, Swords } from 'lucide-react'
import { useAccount } from 'wagmi'
import { create } from 'ipfs-http-client'
import { WalletConnect } from '@/components/blockchain/wallet-connect'
import Gallery from '@/components/collect/gallery'
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
    <div className="w-full bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm max-w-2xl mx-auto">
      <div className="flex space-x-4">
        <img
          src={isConnected ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />

        <div className="relative w-full">
          <textarea
            placeholder={`Use "/challenge @username" to create a new challenge`}
            value={content}
            onChange={handleContentChange}
            className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:text-white resize-none"
            rows={1}
          />
          {showUserSuggestions && (
            <div className="absolute z-10 bg-white dark:bg-neutral-800 border rounded-lg shadow-md max-h-60 overflow-y-auto">
              {mockUsers
                .filter((user) => user.username.toLowerCase().includes(userQuery.toLowerCase()))
                .map((user) => (
                  <button
                    key={user.username}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer w-full"
                    onClick={() => handleUserSelect(user.username)}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-gray-500 text-sm">@{user.username}</span>
                    </div>
                  </button>
                ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-full">
                <AtSign size={20} />
              </button>
              <label className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-full cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <ImageIcon size={20} />
              </label>
            </div>
            <button
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
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
          <img src={`https://ipfs.io/ipfs/${fileIpfsHash}`} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
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
