import { unstable_cache } from "next/cache";

export async function getPixabayImage(query: string) {
  try {
    const res = await fetch(`https://pixabay.com/api?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustrations&category=feelings`)

    const data = await res.json();
    const imageUrl = data.hits[0]?.largeImageURL || null;
    
    // Check if the URL is valid before returning
    if (imageUrl) {
      try {
        const checkRes = await fetch(imageUrl, { method: 'HEAD' });
        if (!checkRes.ok) {
          console.warn(`Invalid image URL: ${imageUrl}`);
          return null;
        }
        return imageUrl;
      } catch (err) {
        console.error("Error validating image URL:", err);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching Pixabay image:", error);
    return null
  }
}

export const getDailyPrompt = unstable_cache(
  async () => {
    try {
      const res = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const data = await res.json();
      return data.slip.advice;
    } catch (error) {
      console.error("Error fetching daily prompt:", error);
      return {
        success: false,
        data: "What's on your mind today?",
      };
    }
  },
  ["daily-prompt"], // cache key
  {
    revalidate: 86400, // 24 hours in seconds
    tags: ["daily-prompt"],
  }
);
