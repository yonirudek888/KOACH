
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SavedMenu } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { allKnownFoods as baseAllKnownFoods } from "../components/foodData";

const translations = {
  he: {
    buildMenu: "הרכבת תפריט",
    getHowEasy: "קבל איזה קל זה לבנות תפריט",
    breakfast: "בוקר",
    lunch: "צהריים", 
    dinner: "ערב",
    snacks: "נשנושים",
    calories: "קלוריות",
    protein: "חלבון",
    carbs: "פחמימות",
    fat: "שומן",
    grams: "גרם",
    dropHere: "בצע לחיצה כפולה על מאכל שתרצה להוסיף",
    saveMenu: "שמירת תפריט",
    saveMenuTitle: "שמור את התפריט שלך",
    menuNamePlaceholder: "הכנס שם לתפריט...",
    save: "שמור",
    cancel: "ביטול",
    myMenus: "התפריטים שלי",
    pleaseEnterMenuName: "אנא הכנס שם לתפריט",
    mustBeLoggedIn: "עליך להיות מחובר כדי לשמור תפריט",
    saveError: "אירעה שגיאה בעת שמירת התפריט"
  }
};

export default function MenuBuilder() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('breakfast');
  const [meals, setMeals] = useState({
    breakfast: [], lunch: [], dinner: [], snacks: []
  });
  const [availableFoods, setAvailableFoods] = useState({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [allFoods, setAllFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const customFoods = JSON.parse(localStorage.getItem('koach-custom-foods') || '[]');
    setAllFoods([...baseAllKnownFoods, ...customFoods]);

    loadUser();

    // This logic ensures correct data synchronization and reset
    const nutritionData = localStorage.getItem('nutrition-to-builder');
    if (nutritionData) {
      // If data is coming from the Nutrition page, it's the single source of truth.
      // Reset meals to ensure no old data persists.
      try {
        setAvailableFoods(JSON.parse(nutritionData));
      } catch (e) { setAvailableFoods({}); }
      setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
    } else {
      // If no data from Nutrition page, load the last saved state of the builder.
      const savedMeals = localStorage.getItem('builder-meals');
      if (savedMeals) {
        try {
          setMeals(JSON.parse(savedMeals));
        } catch (e) { 
          setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
        }
      }
    }
  }, []);

  useEffect(() => {
    // Persist the builder's state whenever meals change.
    localStorage.setItem('builder-meals', JSON.stringify(meals));
  }, [meals]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.preferred_language) {
        setLanguage(currentUser.preferred_language);
      }
    } catch (error) { 
      console.error("Error loading user data:", error); 
    }
    setLoading(false);
  };

  const getFoodById = (id) => {
    return allFoods.find(food => food.id === id);
  };

  const calculateMealTotals = (mealType) => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (!meals[mealType]) return totals;

    meals[mealType].forEach(item => {
      const food = getFoodById(item.id);
      if (food) {
        totals.calories += food.calories * item.quantity;
        totals.protein += food.protein * item.quantity;
        totals.carbs += food.carbs * item.quantity;
        totals.fat += food.fat * item.quantity;
      }
    });
    return totals;
  };

  const handleFoodDoubleClick = (foodId) => {
    const availableQuantity = availableFoods[foodId];
    if (!availableQuantity || availableQuantity <= 0) return;

    const quantityToAdd = parseFloat(availableQuantity);
    
    setMeals(prev => {
        const newMeals = { ...prev };
        const mealArray = [...(newMeals[activeTab] || [])];
        const existingItemIndex = mealArray.findIndex(item => item.id === foodId);
        
        if (existingItemIndex > -1) {
            mealArray[existingItemIndex].quantity += quantityToAdd;
        } else {
            mealArray.push({ id: foodId, quantity: quantityToAdd });
        }
        newMeals[activeTab] = mealArray;
        return newMeals;
    });

    // Remove from available foods after using
    setAvailableFoods(prev => {
        const newAvailable = { ...prev };
        delete newAvailable[foodId];
        return newAvailable;
    });
  };

  const updateQuantity = (mealType, foodId, change) => {
    setMeals(prevMeals => {
      const newMeals = JSON.parse(JSON.stringify(prevMeals));
      const mealArray = newMeals[mealType];
      const itemIndex = mealArray.findIndex(item => item.id === foodId);
      
      if (itemIndex > -1) {
        const currentItem = mealArray[itemIndex];
        const newQuantity = currentItem.quantity + change;

        // Get total available (including what's currently in meals)
        const totalAvailableForThisFood = (availableFoods[foodId] || 0) + currentItem.quantity;
        
        if (newQuantity < 0 || newQuantity > totalAvailableForThisFood) return prevMeals;

        // Update available foods
        setAvailableFoods(prevAvailable => ({
            ...prevAvailable,
            [foodId]: (prevAvailable[foodId] || 0) - change
        }));

        if (newQuantity <= 0) {
          mealArray.splice(itemIndex, 1);
        } else {
          currentItem.quantity = newQuantity;
        }
      }
      return newMeals;
    });
  };

  const t = translations[language];

  const handleSaveMenu = async () => {
    if (!menuName.trim()) {
      alert(t.pleaseEnterMenuName);
      return;
    }
    if (!user || !user.id) {
      alert(t.mustBeLoggedIn);
      return;
    }

    try {
      const createdMenu = await SavedMenu.create({
        name: menuName,
        items: JSON.stringify(meals)
      });

      if (!createdMenu || !createdMenu.id) {
        throw new Error("Save operation failed: No ID returned from creation.");
      }

      // If creation is successful, reset everything.
      setIsSaveModalOpen(false);
      setMenuName("");
      setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
      setAvailableFoods({});
      localStorage.removeItem('builder-meals');
      localStorage.removeItem('nutrition-to-builder');

      // Navigate programmatically. The logic in MyMenus.js will now handle the refetch.
      navigate(createPageUrl('MyMenus'));

    } catch (error) {
      console.error("Error during menu creation:", error);
      alert(t.saveError);
    }
  };

  const userName = user?.first_name || '';
  const mealTotals = calculateMealTotals(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx>{`
        .food-bubble {
          background: rgba(30, 30, 30, 0.7);
          border: 1px solid rgba(184, 115, 51, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          user-select: none;
        }
        .food-bubble:hover {
          border-color: rgba(184, 115, 51, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
        }
        .meal-zone {
          background: rgba(17, 17, 17, 0.5);
          border: 2px dashed rgba(184, 115, 51, 0.3);
          min-height: 200px;
          transition: all 0.3s ease;
        }
        .stats-panel {
          background: rgba(17, 17, 17, 0.7);
          border: 1px solid rgba(184, 115, 51, 0.2);
          backdrop-filter: blur(10px);
        }
        .metallic-button {
          background: rgba(17, 17, 17, 0.7);
          border: 1px solid rgba(184, 115, 51, 0.3);
          filter: grayscale(49%);
        }
        .meal-item-block {
          background-color: rgba(23, 23, 23, 0.9);
          border: 1px solid rgba(184, 115, 51, 0.4);
          width: 48%;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .quantity-button {
          background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
          filter: grayscale(49%);
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-button:hover {
          transform: scale(1.1);
        }
        .gold-text {
          background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
      `}</style>

      <div className="p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold gold-text">
            {userName}, {t.getHowEasy}
          </h1>
        </div>

        {/* Food Bubbles - Display exact quantities from nutrition page */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(availableFoods).map(([foodId, quantity]) => {
            if (quantity <= 0) return null;
            const food = getFoodById(foodId);
            if (!food) return null;
            
            return (
              <div
                key={foodId}
                onDoubleClick={() => handleFoodDoubleClick(foodId)}
                className="food-bubble rounded-lg p-2 text-center"
              >
                <div className="text-xs font-medium text-white">{food.name}</div>
                <div className="text-xs gold-text">{quantity}</div>
              </div>
            );
          })}
        </div>

        {/* Meal Tabs */}
        <div className="flex justify-around bg-black/50 rounded-lg mb-4">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
            <button
              key={mealType}
              onClick={() => setActiveTab(mealType)}
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeTab === mealType ? 'gold-text border-b-2 border-current' : 'text-white/60'
              }`}
            >
              {t[mealType]}
            </button>
          ))}
        </div>

        {/* Drop Zone */}
        <div className="meal-zone rounded-xl p-4">
          {meals[activeTab].length === 0 ? (
            <p className="text-center text-white/50 py-8">{t.dropHere}</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-between">
              {meals[activeTab].map((item, index) => {
                const food = getFoodById(item.id);
                if (!food) return null;
                
                return (
                  <div key={`${item.id}-${index}`} className="meal-item-block">
                    <span className="font-medium text-white text-sm text-center">{food.name}</span>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(activeTab, item.id, 0.5)}
                        className="quantity-button"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-bold gold-text min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(activeTab, item.id, -0.5)}
                        className="quantity-button"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <div className="stats-panel rounded-xl p-4 grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-sm copper-text">{Math.round(mealTotals.calories)}</p>
            <p className="text-xs text-white/60">{t.calories}</p>
          </div>
          <div>
            <p className="text-sm copper-text">{Math.round(mealTotals.protein)}</p>
            <p className="text-xs text-white/60">{t.protein}</p>
          </div>
          <div>
            <p className="text-sm copper-text">{Math.round(mealTotals.carbs)}</p>
            <p className="text-xs text-white/60">{t.carbs}</p>
          </div>
          <div>
            <p className="text-sm copper-text">{Math.round(mealTotals.fat)}</p>
            <p className="text-xs text-white/60">{t.fat}</p>
          </div>
        </div>

        {/* Save/View Buttons */}
        <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setIsSaveModalOpen(true)} className="h-12 bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10" style={{filter: 'grayscale(49%)'}}>
              <Save className="w-4 h-4 mr-2" />
              {t.saveMenu}
            </Button>
            <Link to={createPageUrl("MyMenus")} className="w-full">
                <Button variant="outline" className="w-full h-12 bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10" style={{filter: 'grayscale(49%)'}}>
                  {t.myMenus}
                </Button>
            </Link>
        </div>
      </div>

      {/* Save Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="bg-gray-900 border-amber-600 text-white">
          <DialogHeader>
            <DialogTitle className="copper-text">{t.saveMenuTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder={t.menuNamePlaceholder}
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="bg-gray-800 border-amber-600 text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)} className="text-white">
              {t.cancel}
            </Button>
            <Button onClick={handleSaveMenu} className="metallic-button text-white">
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
