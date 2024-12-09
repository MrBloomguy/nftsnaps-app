'use client'
import { useState } from 'react'
import { AtSign, ImageIcon, Swords } from 'lucide-react'
import { useAccount } from 'wagmi'
import { create } from 'ipfs-http-client'

type User = {
  username: string
  name: string
}

// IPFS Configuration and component code
export default function ComposeSection() {
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
  const mockUsers: User[] = [
    { username: 'johndoe', name: 'John Doe' },
    { username: 'janedoe', name: 'Jane Doe' }
  ]

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleUserSelect = (username: string) => {
    setContent(prev => prev.replace(/@\w+/, `@${username}`))
    setShowUserSuggestions(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
      console.log('Creating challenge:', content)
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
          src={isConnected ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        
        <div className="relative w-full">
          <textarea
            placeholder="Use '/challenge @username' to create a new challenge"
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
                    onClick={() => handleUserSelect(user.username)}
                  >
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
              disabled={!content.trim() || isLoading}
            >
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
     