import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ThumbsUp, Share2, Copy, Twitter } from 'lucide-react';
import styles from '../styles/PostEngagement.module.css';

export default function PostEngagement({ post, onLike, onShare }) {
  const { isConnected, address } = useAccount();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.engagement?.likes || 0);

  const handleLike = async () => {
    if (!isConnected) {
      // Show connect wallet notification
      return;
    }

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    if (onLike) {
      await onLike({
        postId: post.id,
        address: address,
        action: isLiked ? 'unlike' : 'like'
      });
    }
  };

  const handleShare = async (platform) => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(postUrl);
        // Show success notification
        break;
      case 'twitter':
        const tweetText = encodeURIComponent(`Check out this ${post.type} on PepeBets!\n\n${postUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
        break;
      default:
        if (onShare) {
          await onShare({
            postId: post.id,
            platform,
            address: address
          });
        }
    }
    setShowShareMenu(false);
  };

  return (
    <div className={styles.engagement}>
      <button 
        className={`${styles.engagementButton} ${isLiked ? styles.liked : ''}`}
        onClick={handleLike}
      >
        <ThumbsUp size={18} />
        <span>{likeCount}</span>
      </button>

      <div className={styles.shareWrapper}>
        <button 
          className={styles.engagementButton}
          onClick={() => setShowShareMenu(!showShareMenu)}
        >
          <Share2 size={18} />
          <span>{post.engagement?.shares || 0}</span>
        </button>

        {showShareMenu && (
          <div className={styles.shareMenu}>
            <button 
              className={styles.shareOption}
              onClick={() => handleShare('copy')}
            >
              <Copy size={18} />
              <span>Copy Link</span>
            </button>
            <button 
              className={styles.shareOption}
              onClick={() => handleShare('twitter')}
            >
              <Twitter size={18} />
              <span>Share on Twitter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 