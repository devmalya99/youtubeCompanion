import axios from 'axios';
// ✅ CORRECT
import prisma from '../lib/db.js';


const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_OAUTH_TOKEN = process.env.YOUTUBE_OAUTH_TOKEN;

export const getVideoData = async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = response.data.items[0];
    res.status(200).json({
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      publishedAt: videoData.snippet.publishedAt,
      viewCount: videoData.statistics.viewCount,
      likeCount: videoData.statistics.likeCount,
      commentCount: videoData.statistics.commentCount,
      thumbnail: videoData.snippet.thumbnails?.medium?.url || null
    });

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId,
        type: 'FETCH_VIDEO_DETAILS',
        details: {}
      }
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const response = await axios.put(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${YOUTUBE_API_KEY}`,
      {
        id: videoId,
        snippet: {
          title,
          description,
          categoryId: '22' // Keep existing category
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${YOUTUBE_OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId,
        type: 'UPDATE_VIDEO_DETAILS',
        details: { title, description }
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to update video details' });
  }
};

export const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId,
        type: 'FETCH_COMMENTS',
        details: {}
      }
    });

    res.status(200).json(response.data.items);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${YOUTUBE_API_KEY}`,
      {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${YOUTUBE_OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId,
        type: 'ADD_COMMENT',
        details: { text }
      }
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const addReply = async (req, res) => {
  try {
    const { videoId, parentId } = req.params;
    const { text } = req.body;

    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/comments?part=snippet&key=${YOUTUBE_API_KEY}`,
      {
        snippet: {
          parentId,
          textOriginal: text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${YOUTUBE_OAUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId,
        type: 'ADD_REPLY',
        details: { parentId, text }
      }
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    await axios.delete(
      `https://www.googleapis.com/youtube/v3/comments?id=${commentId}&key=${YOUTUBE_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${YOUTUBE_OAUTH_TOKEN}`
        }
      }
    );

    // Log event
    await prisma.eventLog.create({
      data: {
        videoId: 'unknown', // We don't have videoId here
        type: 'DELETE_COMMENT',
        details: { commentId }
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};