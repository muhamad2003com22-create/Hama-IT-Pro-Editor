/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ku' | 'ar';

export interface Translation {
  title: string;
  subtitle: string;
  uploadBtn: string;
  dragDrop: string;
  selectPreset: string;
  adjustImage: string;
  downloadBtn: string;
  changeImage: string;
  zoom: string;
  rotation: string;
  presets: { [key: string]: string };
  platforms: { [key: string]: string };
  loading: string;
  qualityNote: string;
  howToSave: string;
  darkMode: string;
  lightMode: string;
  watermark: string;
  format: string;
  jpg: string;
  png: string;
}

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    title: 'Hama IT',
    subtitle: 'Professional Social Media Image Resizer',
    uploadBtn: 'Upload Image',
    dragDrop: 'Drag and drop an image or click to browse',
    selectPreset: 'Select Platform Preset',
    adjustImage: 'Adjust Your Image',
    downloadBtn: 'Download HD Image',
    changeImage: 'Change Image',
    zoom: 'Zoom',
    rotation: 'Rotation',
    loading: 'Processing...',
    qualityNote: 'Exporting in Full HD with 100% quality retention.',
    howToSave: 'If download fails, long press the image to save.',
    darkMode: 'Dark',
    lightMode: 'Light',
    watermark: 'Add Hama IT Watermark',
    format: 'Export Format',
    jpg: 'JPG (HD)',
    png: 'PNG (Lossless)',
    platforms: {
      'Instagram': 'Instagram',
      'Facebook': 'Facebook',
      'Telegram': 'Telegram',
      'YouTube': 'YouTube',
      'TikTok': 'TikTok',
      'X (Twitter)': 'X (Twitter)',
    },
    presets: {
      'Square (1:1)': 'Square (1:1)',
      'Story / Reels (9:16)': 'Story / Reels (9:16)',
      'Portrait (4:5)': 'Portrait (4:5)',
      'Post (4:3)': 'Post (4:3)',
      'Story (9:16)': 'Story (9:16)',
      'Cover (16:9)': 'Cover (16:9)',
      'Profile Photo': 'Profile Photo',
      'Profile / Channel Photo': 'Profile / Channel Photo',
      'Thumbnail': 'Thumbnail',
      'Banner': 'Banner',
      'Full-screen Video / Image': 'Full-screen Video / Image',
      'Header': 'Header',
    }
  },
  ku: {
    title: 'Hama IT',
    subtitle: 'ئامرازی پیشەیی بۆ گۆڕینی قەبارەی وێنە',
    uploadBtn: 'وێنە باربکە',
    dragDrop: 'وێنەکە ڕابکێشە ئێرە یان کرتە بکە بۆ هەڵبژاردن',
    selectPreset: 'قەبارەی ئامادە هەڵبژێرە',
    adjustImage: 'وێنەکە ڕێکبخە',
    downloadBtn: 'دابەزاندنی وێنەی HD',
    changeImage: 'گۆڕینی وێنە',
    zoom: 'زووم',
    rotation: 'سوڕانەوە',
    loading: 'لەکاردایە...',
    qualityNote: 'هەناردەکردن بە کوالێتی Full HD و پاراستنی ١٠٠٪ی کوالێتی.',
    howToSave: 'ئەگەر دابەزاندن ئیشی نەکرد، وێنەکە دابگرە بۆ پاراستن.',
    darkMode: 'تاریک',
    lightMode: 'ڕووناک',
    watermark: 'زیادکردنی واترماکی Hama IT',
    format: 'جۆری فایل',
    jpg: 'JPG (HD)',
    png: 'PNG (بێ کەمکردنەوە)',
    platforms: {
      'Instagram': 'ئینستاگرام',
      'Facebook': 'فەیسبووک',
      'Telegram': 'تێلیگرام',
      'YouTube': 'یوتیوب',
      'TikTok': 'تیکتۆک',
      'X (Twitter)': 'X (توییتەر)',
    },
    presets: {
      'Square (1:1)': 'چوارگۆشە (١:١)',
      'Story / Reels (9:16)': 'ستۆری / ڕیڵز (٩:١٦)',
      'Portrait (4:5)': 'پۆرترێت (٤:٥)',
      'Post (4:3)': 'پۆست (٤:٣)',
      'Story (9:16)': 'ستۆری (٩:١٦)',
      'Cover (16:9)': 'بەرگ (١٦:٩)',
      'Profile Photo': 'وێنەی پرۆفایل',
      'Profile / Channel Photo': 'وێنەی پرۆفایل / کەناڵ',
      'Thumbnail': 'وێنەی بچووک (Thumbnail)',
      'Banner': 'بانەر',
      'Full-screen Video / Image': 'ڤیدیۆ / وێنەی نووسراو',
      'Header': 'سەرپەڕە (Header)',
    }
  },
  ar: {
    title: 'Hama IT',
    subtitle: 'أداة احترافية لتغيير حجم الصور للتواصل الاجتماعي',
    uploadBtn: 'رفع صورة',
    dragDrop: 'اسحب الصورة وأفلتها هنا أو انقر للاختيار',
    selectPreset: 'اختر القالب الجاهز',
    adjustImage: 'اضبط الصورة',
    downloadBtn: 'تحميل صورة HD',
    changeImage: 'تغيير الصورة',
    zoom: 'تكبير',
    rotation: 'تدوير',
    loading: 'جاري المعالجة...',
    qualityNote: 'تصدير بجودة Full HD مع الحفاظ على ١٠٠٪ من الجودة.',
    howToSave: 'إذا فشل التحميل، اضغط مطولاً على الصورة لحفظها.',
    darkMode: 'داكن',
    lightMode: 'فاتح',
    watermark: 'إضافة علامة Hama IT المائية',
    format: 'صيغة التصدير',
    jpg: 'JPG (HD)',
    png: 'PNG (بدون فقدان)',
    platforms: {
      'Instagram': 'إنستغرام',
      'Facebook': 'فيسبوك',
      'Telegram': 'تيليغرام',
      'YouTube': 'يوتيوب',
      'TikTok': 'تيك توك',
      'X (Twitter)': 'X (تويتر)',
    },
    presets: {
      'Square (1:1)': 'مربع (١:١)',
      'Story / Reels (9:16)': 'قصة / ريلز (٩:١٦)',
      'Portrait (4:5)': 'عمودي (٤:٥)',
      'Post (4:3)': 'منشور (٤:٣)',
      'Story (9:16)': 'قصة (٩:١٦)',
      'Cover (16:9)': 'غلاف (١٦:٩)',
      'Profile Photo': 'صورة الملف الشخصي',
      'Profile / Channel Photo': 'صورة الملف الشخصي / القناة',
      'Thumbnail': 'صورة مصغرة',
      'Banner': 'غلاف القناة',
      'Full-screen Video / Image': 'فيديو / صورة كاملة',
      'Header': 'رأس الصفحة (Header)',
    }
  }
};
