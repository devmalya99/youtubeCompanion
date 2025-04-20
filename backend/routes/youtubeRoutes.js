import express from 'express';
import { getVideoData,updateVideoDetails,getVideoComments,addComment,addReply,deleteComment } from '../controller/youtubeController.js';

const router = express.Router();

router.get('/video/:videoId', getVideoData);
router.put('/video/:videoId', updateVideoDetails);
router.get('/comments/:videoId', getVideoComments);
router.post('/comments/:videoId', addComment);
router.post('/comments/:videoId/reply/:parentId', addReply);
router.delete('/comments/:commentId', deleteComment);

export default router;