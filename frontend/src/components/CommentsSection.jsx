import React, { useState, useEffect } from 'react';

const CommentsSection = ({ videoId, oauthToken }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    // Fetch comments from the YouTube API
    const fetchComments = async () => {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10`, {
        headers: {
          Authorization: `Bearer ${oauthToken}`,
        },
      });
      const data = await response.json();
      setComments(data.items || []);
    };
    fetchComments();
  }, [videoId, oauthToken]);

  const postComment = async () => {
    if (!newComment) return;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: newComment,
            },
          },
        },
      }),
    });

    if (response.ok) {
      setNewComment('');
      // Reload comments
      const res = await response.json();
      setComments([res, ...comments]);
    } else {
      console.error('Failed to post comment');
    }
  };

  const postReply = async (commentId) => {
    if (!replyComment) return;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/comments?part=snippet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          parentId: commentId,
          textOriginal: replyComment,
        },
      }),
    });

    if (response.ok) {
      setReplyComment('');
      setReplyTo(null);
      // Reload comments
      const res = await response.json();
      setComments([res, ...comments]);
    } else {
      console.error('Failed to post reply');
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      
      {/* New Comment Form */}
      <div className="new-comment">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={postComment}>Post Comment</button>
      </div>

      {/* Display Comments */}
      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.snippet.topLevelComment.snippet.textOriginal}</p>
              <button onClick={() => setReplyTo(comment.id)}>Reply</button>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="reply-form">
                  <textarea
                    placeholder="Add a reply..."
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                  />
                  <button onClick={() => postReply(comment.id)}>Post Reply</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet!</p>
      )}
    </div>
  );
};

export default CommentsSection;
