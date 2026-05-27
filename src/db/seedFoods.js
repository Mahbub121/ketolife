import db from './dexie'

const foods = [
  // ── মাংস (Meat) ─────────────────────────────────────────────────────
  { name_bn: 'গরুর মাংস', name_en: 'Beef', category: 'মাংস', carbs_g: 0, protein_g: 26, fat_g: 15, kcal: 250, is_custom: false },
  { name_bn: 'খাসির মাংস', name_en: 'Mutton / Lamb', category: 'মাংস', carbs_g: 0, protein_g: 25, fat_g: 21, kcal: 294, is_custom: false },
  { name_bn: 'মুরগির বুকের মাংস', name_en: 'Chicken Breast', category: 'মাংস', carbs_g: 0, protein_g: 31, fat_g: 3.6, kcal: 165, is_custom: false },
  { name_bn: 'মুরগির ড্রামস্টিক', name_en: 'Chicken Drumstick', category: 'মাংস', carbs_g: 0, protein_g: 24, fat_g: 10, kcal: 186, is_custom: false },
  { name_bn: 'মুরগির উরু', name_en: 'Chicken Thigh', category: 'মাংস', carbs_g: 0, protein_g: 22, fat_g: 15, kcal: 229, is_custom: false },
  { name_bn: 'গরুর কলিজা', name_en: 'Beef Liver', category: 'মাংস', carbs_g: 3.8, protein_g: 20, fat_g: 5, kcal: 135, is_custom: false },
  { name_bn: 'খাসির কলিজা', name_en: 'Mutton Liver', category: 'মাংস', carbs_g: 3.5, protein_g: 21, fat_g: 6, kcal: 154, is_custom: false },
  { name_bn: 'হাঁসের মাংস', name_en: 'Duck', category: 'মাংস', carbs_g: 0, protein_g: 23, fat_g: 28, kcal: 337, is_custom: false },
  { name_bn: 'কোয়েলের মাংস', name_en: 'Quail', category: 'মাংস', carbs_g: 0, protein_g: 25, fat_g: 14, kcal: 226, is_custom: false },
  { name_bn: 'মুরগির পাখা', name_en: 'Chicken Wings', category: 'মাংস', carbs_g: 0, protein_g: 22, fat_g: 17, kcal: 241, is_custom: false },

  // ── মাছ (Fish) ───────────────────────────────────────────────────────
  { name_bn: 'ইলিশ মাছ', name_en: 'Hilsa', category: 'মাছ', carbs_g: 0, protein_g: 22, fat_g: 20, kcal: 268, is_custom: false },
  { name_bn: 'রুই মাছ', name_en: 'Rui / Rohu', category: 'মাছ', carbs_g: 0, protein_g: 19, fat_g: 8, kcal: 148, is_custom: false },
  { name_bn: 'কাতলা মাছ', name_en: 'Catla', category: 'মাছ', carbs_g: 0, protein_g: 17, fat_g: 12, kcal: 176, is_custom: false },
  { name_bn: 'চিংড়ি', name_en: 'Shrimp', category: 'মাছ', carbs_g: 0, protein_g: 24, fat_g: 0.3, kcal: 99, is_custom: false },
  { name_bn: 'টুনা মাছ', name_en: 'Tuna', category: 'মাছ', carbs_g: 0, protein_g: 26, fat_g: 2, kcal: 122, is_custom: false },
  { name_bn: 'স্যালমন মাছ', name_en: 'Salmon', category: 'মাছ', carbs_g: 0, protein_g: 20, fat_g: 13, kcal: 197, is_custom: false },
  { name_bn: 'মাগুর মাছ', name_en: 'Magur', category: 'মাছ', carbs_g: 0, protein_g: 18, fat_g: 10, kcal: 162, is_custom: false },
  { name_bn: 'পাঙ্গাস মাছ', name_en: 'Pangas', category: 'মাছ', carbs_g: 0, protein_g: 15, fat_g: 14, kcal: 186, is_custom: false },
  { name_bn: 'কই মাছ', name_en: 'Koi', category: 'মাছ', carbs_g: 0, protein_g: 17, fat_g: 6, kcal: 122, is_custom: false },
  { name_bn: 'টেংরা মাছ', name_en: 'Tengra', category: 'মাছ', carbs_g: 0, protein_g: 19, fat_g: 9, kcal: 157, is_custom: false },
  { name_bn: 'শিং মাছ', name_en: 'Shing', category: 'মাছ', carbs_g: 0, protein_g: 18, fat_g: 8, kcal: 144, is_custom: false },
  { name_bn: 'সরষে ইলিশ', name_en: 'Hilsa in Mustard', category: 'মাছ', carbs_g: 2, protein_g: 20, fat_g: 18, kcal: 250, is_custom: false },

  // ── ডিম / দুগ্ধ (Eggs & Dairy) ──────────────────────────────────────
  { name_bn: 'ডিম (সিদ্ধ)', name_en: 'Boiled Egg', category: 'ডিম/দুগ্ধ', carbs_g: 1.1, protein_g: 13, fat_g: 11, kcal: 155, is_custom: false },
  { name_bn: 'ডিম (ভাজি)', name_en: 'Fried Egg', category: 'ডিম/দুগ্ধ', carbs_g: 0.7, protein_g: 13, fat_g: 15, kcal: 190, is_custom: false },
  { name_bn: 'পনির', name_en: 'Paneer', category: 'ডিম/দুগ্ধ', carbs_g: 1.2, protein_g: 18, fat_g: 20, kcal: 256, is_custom: false },
  { name_bn: 'মাখন', name_en: 'Butter', category: 'ডিম/দুগ্ধ', carbs_g: 0.1, protein_g: 0.5, fat_g: 81, kcal: 717, is_custom: false },
  { name_bn: 'ঘি', name_en: 'Ghee', category: 'ডিম/দুগ্ধ', carbs_g: 0, protein_g: 0, fat_g: 99, kcal: 897, is_custom: false },
  { name_bn: 'টক দই', name_en: 'Sour Yogurt', category: 'ডিম/দুগ্ধ', carbs_g: 4.1, protein_g: 3.5, fat_g: 3.3, kcal: 59, is_custom: false },
  { name_bn: 'ক্রিম পনির', name_en: 'Cream Cheese', category: 'ডিম/দুগ্ধ', carbs_g: 2.6, protein_g: 6, fat_g: 34, kcal: 342, is_custom: false },
  { name_bn: 'হেভি ক্রিম', name_en: 'Heavy Cream', category: 'ডিম/দুগ্ধ', carbs_g: 2.8, protein_g: 2.8, fat_g: 37, kcal: 345, is_custom: false },

  // ── সবজি (Vegetables) ────────────────────────────────────────────────
  { name_bn: 'পালং শাক', name_en: 'Spinach', category: 'সবজি', carbs_g: 1.4, protein_g: 2.9, fat_g: 0.4, kcal: 23, is_custom: false },
  { name_bn: 'লাল শাক', name_en: 'Red Amaranth', category: 'সবজি', carbs_g: 1.8, protein_g: 2.5, fat_g: 0.3, kcal: 18, is_custom: false },
  { name_bn: 'বাঁধাকপি', name_en: 'Cabbage', category: 'সবজি', carbs_g: 3.3, protein_g: 1.3, fat_g: 0.1, kcal: 25, is_custom: false },
  { name_bn: 'ফুলকপি', name_en: 'Cauliflower', category: 'সবজি', carbs_g: 2.9, protein_g: 1.9, fat_g: 0.3, kcal: 25, is_custom: false },
  { name_bn: 'ব্রকলি', name_en: 'Broccoli', category: 'সবজি', carbs_g: 4, protein_g: 2.8, fat_g: 0.4, kcal: 34, is_custom: false },
  { name_bn: 'শসা', name_en: 'Cucumber', category: 'সবজি', carbs_g: 2.2, protein_g: 0.7, fat_g: 0.1, kcal: 15, is_custom: false },
  { name_bn: 'করলা', name_en: 'Bitter Gourd', category: 'সবজি', carbs_g: 2.5, protein_g: 1, fat_g: 0.2, kcal: 19, is_custom: false },
  { name_bn: 'লাউ', name_en: 'Bottle Gourd', category: 'সবজি', carbs_g: 2.1, protein_g: 0.6, fat_g: 0.1, kcal: 14, is_custom: false },
  { name_bn: 'কাঁচা পেঁপে', name_en: 'Green Papaya', category: 'সবজি', carbs_g: 2.5, protein_g: 0.5, fat_g: 0.1, kcal: 19, is_custom: false },
  { name_bn: 'মাশরুম', name_en: 'Mushroom', category: 'সবজি', carbs_g: 2.3, protein_g: 3.1, fat_g: 0.3, kcal: 22, is_custom: false },
  { name_bn: 'বেগুন', name_en: 'Eggplant', category: 'সবজি', carbs_g: 2.9, protein_g: 1, fat_g: 0.2, kcal: 25, is_custom: false },
  { name_bn: 'লেটুস পাতা', name_en: 'Lettuce', category: 'সবজি', carbs_g: 1.4, protein_g: 0.9, fat_g: 0.1, kcal: 11, is_custom: false },

  // ── বাদাম / তেল (Nuts & Oils) ────────────────────────────────────────
  { name_bn: 'নারকেল তেল', name_en: 'Coconut Oil', category: 'বাদাম/তেল', carbs_g: 0, protein_g: 0, fat_g: 100, kcal: 862, is_custom: false },
  { name_bn: 'অলিভ অয়েল', name_en: 'Olive Oil', category: 'বাদাম/তেল', carbs_g: 0, protein_g: 0, fat_g: 100, kcal: 884, is_custom: false },
  { name_bn: 'সরিষার তেল', name_en: 'Mustard Oil', category: 'বাদাম/তেল', carbs_g: 0, protein_g: 0, fat_g: 100, kcal: 884, is_custom: false },
  { name_bn: 'ফ্ল্যাক্স সিড', name_en: 'Flax Seeds', category: 'বাদাম/তেল', carbs_g: 1.6, protein_g: 18, fat_g: 42, kcal: 534, is_custom: false },
  { name_bn: 'পেকান বাদাম', name_en: 'Pecans', category: 'বাদাম/তেল', carbs_g: 4.3, protein_g: 9, fat_g: 72, kcal: 691, is_custom: false },
  { name_bn: 'পাইন বাদাম', name_en: 'Pine Nuts', category: 'বাদাম/তেল', carbs_g: 3.7, protein_g: 14, fat_g: 68, kcal: 673, is_custom: false },
  { name_bn: 'ব্রাজিল বাদাম', name_en: 'Brazil Nuts', category: 'বাদাম/তেল', carbs_g: 4.2, protein_g: 14, fat_g: 66, kcal: 659, is_custom: false },
  { name_bn: 'কুমড়ার বীজ', name_en: 'Pumpkin Seeds', category: 'বাদাম/তেল', carbs_g: 3.8, protein_g: 19, fat_g: 49, kcal: 559, is_custom: false },
].map((f) => ({ id: crypto.randomUUID(), ...f }))

export async function seedFoods() {
  const count = await db.foodItems.count()
  if (count > 0) return
  await db.foodItems.bulkAdd(foods)
}
