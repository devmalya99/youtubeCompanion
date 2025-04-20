import { useState, useEffect } from 'react';


function ShowVideoDetails() {
  const VITE_API_URL= import.meta.env.VITE_API_URL
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract video ID from URL (you could also make this an input field)
  const videoUrl = "https://www.youtube.com/watch?v=XIg0sBfFcF8";
  const videoId = new URL(videoUrl).searchParams.get('v');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/api/youtube/video/${videoId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  if (loading) return <div className="loading">Loading video details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>Youtube Companion</h1>
      </header>
      
      <main className="video-container">
        {videoData && (
          <>
            <div className="video-player">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="video-details">
              <h2>{videoData.title}</h2>
              
              <div className="stats">
                <span>👁️ {Number(videoData.viewCount).toLocaleString()} views</span>
                <span>👍 {Number(videoData.likeCount).toLocaleString()} likes</span>
                {videoData.commentCount && (
                  <span>💬 {Number(videoData.commentCount).toLocaleString()} comments</span>
                )}
                <span>📅 {new Date(videoData.publishedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="description">
                <h3>Description</h3>
                <p>{videoData.description || "No description available."}</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ShowVideoDetails;