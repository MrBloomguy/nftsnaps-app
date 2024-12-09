import { useState } from 'react';
import { useAccount } from 'wagmi';
import { MessageCircle, Send } from 'lucide-react';
import styles from '../styles/CommentSection.module.css';

export default function CommentSection({ postId, comments, onAddComment }) {
  const { isConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnected) {
      // Show connect wallet notification
      return;
    }
    if (newComment.trim()) {
      onAddComment({
        id: Date.now(),
        author: {
          address: address,
          username: address?.slice(0, 6) + '...' + address?.slice(-4),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`
        },
        content: newComment,
        timestamp: 'just now',
        likes: 0
      });
      setNewComment('');
    }
  };

  return (
    <div className={styles.commentSection}>
      <button 
        className={styles.toggleComments}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={18} />
        <span>{comments.length} Comments</span>
      </button>

      {isOpen && (
        <div className={styles.commentsContainer}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <img 
                src={comment.author.avatar}
                alt=""
                className={styles.commentAvatar}
              />
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>
                    {comment.author.username}
                  </span>
                  <span className={styles.commentTime}>
                    {comment.timestamp}
                  </span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className={styles.commentForm}>
            <img 
              src={isConnected 
                ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`
                : `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`}
              alt=""
              className={styles.commentAvatar}
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
            />
            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={!newComment.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 