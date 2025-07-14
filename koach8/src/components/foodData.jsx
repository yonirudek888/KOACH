export const allKnownFoods = [
  // חלבונים
  { id: 'egg', name: "ביצה", protein: 7, carbs: 0, fat: 5, calories: 70, categories: ['protein', 'fat'] },
  { id: 'cottage', name: "גביע קוטג", protein: 20, carbs: 5, fat: 1, calories: 110, categories: ['protein'] },
  { id: 'cheese', name: "פרוסת גבינה צהובה", protein: 7, carbs: 1, fat: 7, calories: 100, categories: ['protein', 'fat'] },
  { id: 'red_meat', name: "100 גרם בשר אדום", protein: 22, carbs: 0, fat: 20, calories: 270, categories: ['protein', 'fat'] },
  { id: 'chicken_breast', name: "100 גרם חזה עוף", protein: 22, carbs: 0, fat: 2, calories: 110, categories: ['protein'] },
  { id: 'protein_scoop', name: "סקופ חלבון", protein: 24, carbs: 2, fat: 1, calories: 115, categories: ['protein'] },
  { id: 'tofu', name: "100 גרם טופו", protein: 17, carbs: 3, fat: 9, calories: 160, categories: ['protein'] },
  { id: 'tuna', name: "פחית טונה", protein: 26, carbs: 0, fat: 1, calories: 116, categories: ['protein'] },
  { id: 'lentils', name: "100 גרם עדשים מבושלות", protein: 9, carbs: 20, fat: 0.4, calories: 116, categories: ['protein'] },
  { id: 'salmon', name: "100 גרם סלמון אפוי", protein: 25, carbs: 0, fat: 15, calories: 250, categories: ['protein', 'fat'] },
  { id: 'milk', name: "כוס חלב (240 מ\"ל)", protein: 8, carbs: 12, fat: 8, calories: 150, categories: ['protein'] },
  { id: 'seitan', name: "100 גרם סייטן", protein: 24, carbs: 4, fat: 1, calories: 120, categories: ['protein'] },
  
  // פחמימות
  { id: 'bread_slice', name: "פרוסת לחם", protein: 3, carbs: 15, fat: 1, calories: 80, categories: ['carbs'] },
  { id: 'rice_cooked', name: "אורז מבושל 100 גרם", protein: 3, carbs: 28, fat: 0, calories: 130, categories: ['carbs'] },
  { id: 'potato', name: "תפוח אדמה בינוני", protein: 2, carbs: 30, fat: 0, calories: 130, categories: ['carbs'] },
  { id: 'sweet_potato', name: "בטטה בינונית", protein: 2, carbs: 27, fat: 0, calories: 120, categories: ['carbs'] },
  { id: 'light_bread', name: "פרוסת לחם קל", protein: 2, carbs: 10, fat: 0.5, calories: 50, categories: ['carbs'] },
  { id: 'pasta', name: "חצי כוס פסטה מבושלת", protein: 4, carbs: 20, fat: 1, calories: 100, categories: ['carbs'] },
  { id: 'date', name: "תמר מג'הול", protein: 0.5, carbs: 18, fat: 0, calories: 70, categories: ['carbs'] },
  { id: 'baguette', name: "חצי בגט לבן (125 גרם)", protein: 10, carbs: 65, fat: 2, calories: 320, categories: ['carbs'] },
  { id: 'grapes', name: "100 גרם ענבים", protein: 0.6, carbs: 17, fat: 0.2, calories: 70, categories: ['carbs'] },
  { id: 'hummus', name: "100 גרם חומוס מבושל", protein: 8, carbs: 27, fat: 18, calories: 250, categories: ['carbs'] },
  { id: 'cookie', name: "עוגייה בינונית (20 גרם)", protein: 1, carbs: 15, fat: 6, calories: 120, categories: ['carbs'] },
  { id: 'crackers', name: "חופן קרקרים (30 גרם)", protein: 2, carbs: 20, fat: 4, calories: 130, categories: ['carbs'] },
  { id: 'juice', name: "כוס מיץ תפוזים", protein: 1, carbs: 26, fat: 0, calories: 110, categories: ['carbs'] },
  { id: 'banana', name: "בננה בינונית", protein: 1, carbs: 27, fat: 0, calories: 110, categories: ['carbs'] },
  
  // שומנים
  { id: 'avocado', name: "אבוקדו 1 בינוני", protein: 2, carbs: 9, fat: 21, calories: 240, categories: ['fat'] },
  { id: 'coconut_oil', name: "כף שמן קוקוס", protein: 0, carbs: 0, fat: 14, calories: 120, categories: ['fat'] },
  { id: 'olive_oil', name: "כף שמן זית", protein: 0, carbs: 0, fat: 14, calories: 120, categories: ['fat'] },
  { id: 'butter', name: "כפית חמאה", protein: 0.1, carbs: 0, fat: 4, calories: 36, categories: ['fat'] },
  { id: 'peanut_butter', name: "כף חמאת בוטנים", protein: 4, carbs: 3, fat: 8, calories: 95, categories: ['fat'] },
  { id: 'walnuts', name: "10 אגוזי מלך", protein: 4, carbs: 3, fat: 18, calories: 190, categories: ['fat'] }
];

export const getFoodsByCategory = (category) => {
  return allKnownFoods.filter(food => food.categories.includes(category));
};

export const getFoodById = (id) => {
  return allKnownFoods.find(food => food.id === id);
};