
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Star, ArrowLeft, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allKnownFoods as baseAllKnownFoods, getFoodsByCategory } from "../components/foodData";

const translations = {
  he: {
    nutrition: "תזונה",
    buildMenu: "הרכבת תפריט",
    nutritionGoals: "יעד תזונתי",
    calories: "קלוריות",
    protein: "חלבון",
    carbs: "פחמימות",
    fat: "שומן",
    totalProtein: "סה״כ חלבון",
    totalCarbs: "סה״כ פחמימות",
    totalFat: "סה״כ שומן",
    grams: "גרם",
    buildMenuMale: "דבר אליי, מה אתה אוכל?",
    buildMenuFemale: "דברי אליי, מה את אוכלת?",
    soTitle: "אז ככה",
    youNeedMale: "לפי החישוב שלי אתה צריך...",
    youNeedFemale: "לפי החישוב שלי את צריכה...",
    chooseRatioMale: "תבחר את היחס שמתאים לך",
    chooseRatioFemale: "תבחרי את היחס שמתאים לך",
    myMenu: "התפריט שלי",
    addFood: "הוסף מאכל",
    resetMenu: "איפוס תפריט",
    foodName: "שם המאכל",
    proteinPerUnit: "חלבון ליחידה",
    carbsPerUnit: "פחמימות ליחידה",
    fatPerUnit: "שומן ליחידה",
    save: "שמור",
    cancel: "ביטול",
  }
};

export default function Nutrition() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('protein');
  const [selectedFoods, setSelectedFoods] = useState({});
  const [nutritionalGoals, setNutritionalGoals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [sliderValue, setSliderValue] = useState([50]);
  const [favorites, setFavorites] = useState([]);
  const [isAddFoodModalOpen, setIsAddFoodModal] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', protein: 0, carbs: 0, fat: 0 });
  const [customFoods, setCustomFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const navigate = useNavigate();
  const [showPdfBanner, setShowPdfBanner] = useState(false);

  useEffect(() => {
    const loadedCustomFoods = JSON.parse(localStorage.getItem('koach-custom-foods') || '[]');
    setCustomFoods(loadedCustomFoods);
    setAllFoods([...baseAllKnownFoods, ...loadedCustomFoods]);

    loadData();
    loadSelectedFoods();
    const storedFavorites = localStorage.getItem('koach-favorites');
    if (storedFavorites) {
        try {
            setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
            setFavorites([]);
        }
    }

    const bannerDismissed = localStorage.getItem('koach-nutrition-banner-dismissed');
    if (!bannerDismissed) {
      setShowPdfBanner(true);
    }
  }, []);
  
  useEffect(() => {
      setAllFoods([...baseAllKnownFoods, ...customFoods]);
  }, [customFoods]);

  useEffect(() => {
    if (user) {
      calculateNutritionalGoals();
    }
  }, [user, sliderValue]);

  useEffect(() => {
    saveSelectedFoods();
  }, [selectedFoods]);

  useEffect(() => {
    localStorage.setItem('koach-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('koach-custom-foods', JSON.stringify(customFoods));
  }, [customFoods]);

  const handleDismissBanner = () => {
    setShowPdfBanner(false);
    localStorage.setItem('koach-nutrition-banner-dismissed', 'true');
  };

  const getAllFoodsForCategory = (category) => {
    const baseFoods = getFoodsByCategory(category);
    const customFoodsForCategory = customFoods.filter(food => food.categories.includes(category));
    return [...baseFoods, ...customFoodsForCategory];
  };

  const toggleFavorite = (foodId) => {
    setFavorites(prev =>
        prev.includes(foodId) ? prev.filter(f => f !== foodId) : [...prev, foodId]
    );
  };

  const handleResetMenu = () => {
    // Reset local state for this page
    setSelectedFoods({});
    localStorage.removeItem('nutrition-selected-foods');
    
    // Also reset all data in the builder page to ensure a full, clean reset
    localStorage.removeItem('builder-meals');
    localStorage.removeItem('nutrition-to-builder');
    
    console.log("Full reset executed. All nutrition and builder data cleared.");
  };

  const handleAddFood = () => {
    if (!newFood.name) return;

    const newFoodId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const categories = [];
    
    if (parseFloat(newFood.protein) > 0) categories.push('protein');
    if (parseFloat(newFood.carbs) > 0) categories.push('carbs');
    if (parseFloat(newFood.fat) > 0) categories.push('fat');

    const foodItem = {
      id: newFoodId,
      name: newFood.name,
      protein: parseFloat(newFood.protein) || 0,
      carbs: parseFloat(newFood.carbs) || 0,
      fat: parseFloat(newFood.fat) || 0,
      calories: (parseFloat(newFood.protein) * 4) + (parseFloat(newFood.carbs) * 4) + (parseFloat(newFood.fat) * 9),
      categories
    };

    const newCustomFoods = [...customFoods, foodItem];
    setCustomFoods(newCustomFoods);
    localStorage.setItem('koach-custom-foods', JSON.stringify(newCustomFoods));
    setNewFood({ name: '', protein: 0, carbs: 0, fat: 0 });
    setIsAddFoodModal(false);
  };

  const handleNavigateToBuilder = () => {
    // Create an exact copy of the current food selection
    const foodsToTransfer = {};
    Object.entries(selectedFoods).forEach(([foodId, quantity]) => {
      if (quantity > 0) {
        const food = allFoods.find(f => f.id === foodId);
        if (food) {
          foodsToTransfer[foodId] = parseFloat(quantity);
        }
      }
    });
    
    // Always overwrite the builder's source data with the fresh data from this page
    localStorage.setItem('nutrition-to-builder', JSON.stringify(foodsToTransfer));
    
    // IMPORTANT: Always clear the builder's meal structure when navigating from here
    // to ensure it rebuilds from the new source data and doesn't show stale items.
    localStorage.removeItem('builder-meals');
    
    console.log("Navigating to builder with fresh data:", foodsToTransfer);
    navigate(createPageUrl("MenuBuilder"));
  };

  const loadSelectedFoods = () => {
    try {
      const saved = localStorage.getItem('nutrition-selected-foods');
      if (saved) {
        setSelectedFoods(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading selected foods:", error);
    }
  };

  const saveSelectedFoods = () => {
    try {
      localStorage.setItem('nutrition-selected-foods', JSON.stringify(selectedFoods));
    } catch (error) {
      console.error("Error saving selected foods:", error);
    }
  };

  const loadData = async () => {
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

  const calculateNutritionalGoals = (currentUser = user, currentSliderValue = sliderValue) => {
    if (!currentUser || !currentUser.weight || !currentUser.height || !currentUser.fitness_assessment?.age) {
      return;
    }

    const { weight, height, gender, goals, fitness_assessment: { age } } = currentUser;
    const goal = goals?.[0];

    let calories = (weight * 10) + (height * 6.25) - (age * 5) + 600;

    if (gender === 'female') calories -= 150;
    if (gender === 'male') calories += 5;

    if (goal === 'toning') calories -= 500;
    if (goal === 'buildMuscle') calories += 400;

    // Updated protein calculation for females
    const protein = gender === 'female' ? Math.round(weight * 1.6) : Math.round(weight * 2);
    const proteinCalories = protein * 4;
    const remainingCalories = calories - proteinCalories;

    const fatPercentage = currentSliderValue[0] / 100;
    const carbPercentage = 1 - fatPercentage;

    const fatCalories = remainingCalories * fatPercentage;
    const carbCalories = remainingCalories * carbPercentage;

    const fat = Math.round(fatCalories / 9);
    const carbs = Math.round(carbCalories / 4);

    setNutritionalGoals({
      calories: Math.round(calories),
      protein,
      carbs,
      fat
    });
  };

  const updateFoodQuantity = (foodId, change) => {
    setSelectedFoods(prev => {
      const newSelected = { ...prev };
      const currentQuantity = newSelected[foodId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity <= 0) {
        delete newSelected[foodId];
      } else {
        newSelected[foodId] = newQuantity;
      }
      
      return newSelected;
    });
  };

  const calculateTotal = (category) => {
    // Use the component's allFoods state directly
    return Object.entries(selectedFoods).reduce((total, [foodId, quantity]) => {
        const food = allFoods.find(f => f.id === foodId);
        if (food) {
            return total + (food[category] * quantity);
        }
        return total;
    }, 0);
  };

  const sortFoodsByFavorites = (foods) => {
    return [...foods].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  const youNeedText = user?.gender === 'female' ? t.youNeedFemale : t.youNeedMale;
  const userName = user?.first_name || '';
  const chooseRatioText = user?.gender === 'female' ? t.chooseRatioFemale : t.chooseRatioMale;
  const buildMenuTitle = user?.gender === 'female' ? t.buildMenuFemale : t.buildMenuMale;

  const totalProteinSelected = calculateTotal('protein');
  const totalCarbsSelected = calculateTotal('carbs');
  const totalFatSelected = calculateTotal('fat');

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        .gold-text {
          background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: grayscale(49%);
        }

        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: grayscale(49%);
        }

        .metallic-button {
          background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
          border: 1px solid rgba(251, 191, 36, 0.5);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(184, 115, 51, 0.3);
          filter: grayscale(49%);
        }

        .metallic-button:hover {
          box-shadow: 0 6px 25px rgba(184, 115, 51, 0.5);
          transform: translateY(-2px);
        }

        .glass-panel {
          background: rgba(30, 30, 30, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(184, 115, 51, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .gold-text, .copper-text {
          filter: grayscale(49%);
        }
        .metallic-button {
          filter: grayscale(49%);
        }
        .square-button {
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .food-item-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 120px;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }
        .nutrition-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          text-align: center;
        }
      `}</style>

      {/* Fixed Header / Navigation Bar */}
      <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-10 p-4 flex items-center justify-center border-b border-amber-600/20">
        <h1 className="text-xl font-bold gold-text flex-grow text-center">{t.nutrition}</h1>
      </header>

      <div className="p-4 space-y-6 pt-[6rem]">
        {showPdfBanner && (
          <div className="relative bg-black border border-amber-600/50 p-4 rounded-lg text-center mb-6">
            <button 
              onClick={handleDismissBanner} 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="copper-text mb-4 text-sm leading-relaxed">
              כדי לעזור לך לבנות תפריט הכנתי מדריך פשוט שיעשה לך סדר בראש וייתן לך את הידע הפרקטי לבניית תפריט.
            </p>
            <a href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/defa57f7d_1.pdf" target="_blank" rel="noopener noreferrer">
              <Button className="metallic-button text-white px-6" onClick={handleDismissBanner}>
                להורדה
              </Button>
            </a>
          </div>
        )}

         {/* Adjusted padding-top to account for fixed header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold gold-text mb-1">
            {t.soTitle} {userName}
          </h1>
          <p className="text-white/70 text-md">{youNeedText}</p>
        </div>

        {user && (
          <div className="glass-panel rounded-2xl p-6 space-y-4">
             <div className="flex justify-center items-baseline space-x-6 rtl:space-x-reverse">
              <div className="text-center">
                <p className="text-2xl font-semibold gold-text">{nutritionalGoals.calories.toLocaleString()}</p>
                <p className="text-sm text-white/60">{t.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold copper-text">{nutritionalGoals.protein}</p>
                 <p className="text-sm text-white/60">{t.protein}</p>
              </div>
            </div>

            <p className="text-center text-white/70 text-md pt-4">{chooseRatioText}</p>

            <div className="px-4">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  dir="ltr"
                  className="w-full"
                />
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold gold-text">{nutritionalGoals.carbs} {t.grams}</p>
                    <span className="text-white/70 font-medium text-sm">{t.carbs}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold gold-text">{nutritionalGoals.fat} {t.grams}</p>
                    <span className="text-white/70 font-medium text-sm">{t.fat}</span>
                  </div>
                </div>
              </div>
          </div>
        )}

        <div id="build-menu" className="glass-panel rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold gold-text mb-2">
              {buildMenuTitle}
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-6">
            {['protein', 'carbs', 'fat'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  activeTab === tab
                    ? 'metallic-button text-white shadow-lg'
                    : 'bg-black/20 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'protein' && t.protein}
                {tab === 'carbs' && t.carbs}
                {tab === 'fat' && t.fat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse glass-panel rounded-xl p-4 mb-6">
            <div className="flex-grow text-center">
              <h3 className="text-md font-semibold copper-text mb-1">
                {activeTab === 'protein' && t.totalProtein}
                {activeTab === 'carbs' && t.totalCarbs}
                {activeTab === 'fat' && t.totalFat}
              </h3>
              <p className="text-xl font-bold copper-text">
                 {activeTab === 'protein' && `${totalProteinSelected} / ${nutritionalGoals.protein}`}
                 {activeTab === 'carbs' && `${totalCarbsSelected} / ${nutritionalGoals.carbs}`}
                 {activeTab === 'fat' && `${totalFatSelected} / ${nutritionalGoals.fat}`}
                 <span className="text-sm"> {t.grams}</span>
              </p>
            </div>
            <div className="w-1/3">
              <Button onClick={handleNavigateToBuilder} className="metallic-button w-full h-full flex flex-col px-2 py-3">
                 <span className="font-bold text-black text-sm">{t.buildMenu.split(' ')[0]}</span>
                 <span className="font-bold text-black text-sm">{t.buildMenu.split(' ')[1]}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {sortFoodsByFavorites(allFoods.filter(food => food.categories.includes(activeTab))).map((food) => {
              const quantity = selectedFoods[food.id] || 0;
              const totalValue = Math.round(food[activeTab] * quantity);
              const isFavorite = favorites.includes(food.id);

              return (
                <div key={food.id} className="glass-panel rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                        <button onClick={() => toggleFavorite(food.id)} className="mr-2 rtl:ml-2">
                            <Star className={`w-4 h-4 transition-colors ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} />
                        </button>
                        <span className="font-medium copper-text text-md">{food.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="nutrition-display">
                        <span className="text-sm font-semibold copper-text">
                          {totalValue} {t.grams}  -
                        </span>
                        <span className="text-xs gold-text">
                            {activeTab === 'protein' && t.protein}
                            {activeTab === 'carbs' && t.carbs}
                            {activeTab === 'fat' && t.fat}
                        </span>
                      </div>
                      
                      <div className="food-item-controls">
                        <div className="quantity-controls">
                            <button
                                onClick={() => updateFoodQuantity(food.id, -0.5)}
                                className="metallic-button w-7 h-7 rounded-full flex items-center justify-center text-black font-bold"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
    
                            <div className="w-10 text-center">
                                <span className="text-lg font-bold gold-text">
                                {quantity}
                                </span>
                            </div>
    
                            <button
                                onClick={() => updateFoodQuantity(food.id, 0.5)}
                                className="metallic-button w-7 h-7 rounded-full flex items-center justify-center text-black font-bold"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
             <div className="pt-4 flex gap-2">
                <Dialog open={isAddFoodModalOpen} onOpenChange={setIsAddFoodModal}>
                  <DialogTrigger asChild>
                     <Button variant="outline" className="w-1/2 square-button bg-black border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400" style={{filter: 'grayscale(49%)'}}>
                      {t.addFood}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-amber-600 text-white">
                    <DialogHeader>
                      <DialogTitle>{t.addFood}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="foodName">{t.foodName}</Label>
                        <Input id="foodName" value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} className="bg-gray-800 border-amber-600"/>
                      </div>
                      <div>
                        <Label htmlFor="protein">{t.proteinPerUnit}</Label>
                        <Input id="protein" type="number" value={newFood.protein} onChange={(e) => setNewFood({...newFood, protein: e.target.value})} className="bg-gray-800 border-amber-600"/>
                      </div>
                       <div>
                        <Label htmlFor="carbs">{t.carbsPerUnit}</Label>
                        <Input id="carbs" type="number" value={newFood.carbs} onChange={(e) => setNewFood({...newFood, carbs: e.target.value})} className="bg-gray-800 border-amber-600"/>
                      </div>
                       <div>
                        <Label htmlFor="fat">{t.fatPerUnit}</Label>
                        <Input id="fat" type="number" value={newFood.fat} onChange={(e) => setNewFood({...newFood, fat: e.target.value})} className="bg-gray-800 border-amber-600"/>
                      </div>
                    </div>
                    <DialogFooter>
                       <Button variant="ghost" onClick={() => setIsAddFoodModal(false)}>{t.cancel}</Button>
                       <Button onClick={handleAddFood} className="metallic-button">{t.save}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleResetMenu} className="w-1/2 square-button bg-black border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400" style={{filter: 'grayscale(49%)'}}>
                  {t.resetMenu}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
