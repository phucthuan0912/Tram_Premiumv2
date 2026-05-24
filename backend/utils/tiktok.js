/**
 * Extract TikTok Video ID and Generate HD Direct Link
 * Based on tikwm.com logic
 */
const getTikTokHDLink = (url) => {
    try {
        if (!url || typeof url !== 'string') return "";
        
        // Extract video ID from various TikTok URL formats
        const match = url.match(/\/video\/(\d+)/) || url.match(/v=(\d+)/) || url.match(/\/v\/(\d+)/);
        const videoId = match && match[1] ? match[1] : null;

        if (videoId) {
            return `https://tikwm.com/video/media/hdplay/${videoId}.mp4`;
        }
        
        return "";
    } catch (error) {
        console.error("TikTok link extraction error:", error);
        return "";
    }
};

export { getTikTokHDLink };
