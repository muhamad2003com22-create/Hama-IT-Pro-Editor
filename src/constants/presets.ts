/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Preset {
  id: string;
  platform: string;
  name: string;
  width: number;
  height: number;
  aspect: number;
}

export const PRESETS: Preset[] = [
  // Instagram
  { id: 'ig-post', platform: 'Instagram', name: 'Square (1:1)', width: 1080, height: 1080, aspect: 1 },
  { id: 'ig-story', platform: 'Instagram', name: 'Story / Reels (9:16)', width: 1080, height: 1920, aspect: 9 / 16 },
  { id: 'ig-portrait', platform: 'Instagram', name: 'Portrait (4:5)', width: 1080, height: 1350, aspect: 4 / 5 },
  
  // Facebook
  { id: 'fb-post', platform: 'Facebook', name: 'Post (4:3)', width: 1080, height: 810, aspect: 4 / 3 },
  { id: 'fb-story', platform: 'Facebook', name: 'Story (9:16)', width: 1080, height: 1920, aspect: 9 / 16 },
  { id: 'fb-cover', platform: 'Facebook', name: 'Cover (16:9)', width: 820, height: 461, aspect: 16 / 9 },
  { id: 'fb-profile', platform: 'Facebook', name: 'Profile Photo', width: 1080, height: 1080, aspect: 1 },

  // Telegram
  { id: 'tg-profile', platform: 'Telegram', name: 'Profile / Channel Photo', width: 512, height: 512, aspect: 1 },

  // YouTube
  { id: 'yt-thumb', platform: 'YouTube', name: 'Thumbnail', width: 1280, height: 720, aspect: 16 / 9 },
  { id: 'yt-banner', platform: 'YouTube', name: 'Banner', width: 2560, height: 1440, aspect: 16 / 9 },

  // TikTok
  { id: 'tt-video', platform: 'TikTok', name: 'Full-screen Video / Image', width: 1080, height: 1920, aspect: 9 / 16 },
  { id: 'tt-profile', platform: 'TikTok', name: 'Profile Photo', width: 200, height: 200, aspect: 1 },

  // X (Twitter)
  { id: 'x-post', platform: 'X (Twitter)', name: 'Post', width: 1200, height: 675, aspect: 16 / 9 },
  { id: 'x-header', platform: 'X (Twitter)', name: 'Header', width: 1500, height: 500, aspect: 3 / 1 },
];
