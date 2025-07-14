
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { SavedMenu } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { allKnownFoods as baseAllKnownFoods } from "../components/foodData";

const translations = {
    he: {
      breakfast: "ארוחת בוקר",
      lunch: "ארוחת צהריים", 
      dinner: "ארוחת ערב",
      snacks: "נשנושים",
      calories: "קלוריות",
      protein: "חלבון",
      carbs: "פחמימות",
      fat: "שומן",
    }
};

const calculateTotals = (items, allFoods) => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (!items) return totals;
    items.forEach(item => {
        const food = allFoods.find(f => f.id === item.id);
        if(food) {
            totals.calories += food.calories * item.quantity;
            totals.protein += food.protein * item.quantity;
            totals.carbs += food.carbs * item.quantity;
            totals.fat += food.fat * item.quantity;
        }
    });
    return totals;
}

const MealTotalsRow = ({ totals, t }) => (
    <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg border border-white/20 mt-2">
        {Object.entries({
            calories: t.calories,
            protein: t.protein,
            carbs: t.carbs,
            fat: t.fat
        }).map(([key, label]) => (
            <div key={key}>
                <p className="font-bold gold-text text-md">{Math.round(totals[key])}</p>
                <p className="text-xs text-white/70">{label}</p>
            </div>
        ))}
    </div>
);

export default function ViewMenu() {
    const location = useLocation();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allFoods, setAllFoods] = useState([]);
    const t = translations['he'];

    useEffect(() => {
        const customFoods = JSON.parse(localStorage.getItem('koach-custom-foods') || '[]');
        setAllFoods([...baseAllKnownFoods, ...customFoods]);

        // If menu data is passed via navigation state, use it directly.
        // This avoids a refetch race condition after creation.
        if (location.state?.menu) {
            setMenu(location.state.menu);
            setLoading(false);
        } else {
            // Otherwise (e.g., on page refresh or direct URL access), fetch from the API.
            const fetchMenu = async () => {
                const params = new URLSearchParams(location.search);
                const menuId = params.get('id');
                if (menuId) {
                    try {
                        const fetchedMenu = await SavedMenu.get(menuId);
                        setMenu(fetchedMenu);
                    } catch (error) {
                        console.error("Failed to fetch menu:", error);
                        // Set menu to null to trigger the 'not found' message
                        setMenu(null);
                    }
                }
                setLoading(false);
            };
            fetchMenu();
        }
    }, [location.search, location.state]);

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        );
    }

    if (!menu) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <h2 className="text-2xl font-bold mb-4 gold-text">לא נמצא תפריט</h2>
                <p className="text-gray-400 mb-6 text-center">התפריט שאתה מנסה להציג אינו קיים או שאין לך גישה אליו.</p>
                <Link to={createPageUrl('MyMenus')}>
                    <Button variant="outline" className="bg-black border-amber-600/50 text-amber-500 hover:bg-amber-500/10">
                        חזור לתפריטים שלי
                    </Button>
                </Link>
            </div>
        );
    }

    const menuData = JSON.parse(menu.menu_data);
    const overallTotals = calculateTotals(Object.values(menuData).flat(), allFoods);
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snacks'];

    return (
        <div className="min-h-screen bg-black text-white p-4 space-y-4">
             <style jsx>{`
                .gold-text {
                  background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  filter: grayscale(49%);
                }
                .menu-card {
                  background: rgba(17, 17, 17, 0.7);
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(184, 115, 51, 0.3);
                }
            `}</style>
            <div className="relative text-center pt-8">
                <h1 className="text-2xl font-bold gold-text">{menu.name}</h1>
            </div>

            <MealTotalsRow totals={overallTotals} t={t} />

            <div className="space-y-4">
                {mealOrder.map(mealType => {
                    const mealItems = menuData[mealType];
                    if (!mealItems || mealItems.length === 0) return null;
                    const mealTotals = calculateTotals(mealItems, allFoods);

                    return (
                        <Card key={mealType} className="menu-card">
                            <CardHeader>
                                <CardTitle className="gold-text">{t[mealType]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {mealItems.map(item => {
                                        const food = allFoods.find(f => f.id === item.id);
                                        return (
                                            <p key={item.id} className="text-sm text-white">{food?.name} - x{item.quantity}</p>
                                        )
                                    })}
                                </div>
                                <MealTotalsRow totals={mealTotals} t={t} />
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
