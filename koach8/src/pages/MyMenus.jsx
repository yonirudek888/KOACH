
import React, { useState, useEffect } from 'react';
import { SavedMenu } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Home, Dumbbell, Utensils, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { allKnownFoods as baseAllKnownFoods } from "../components/foodData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const translations = {
  he: {
    myMenus: "התפריטים של",
    noMenus: "עדיין לא שמרת תפריטים.",
    deleteMenu: "מחק תפריט",
    deleteConfirmTitle: "האם אתה בטוח?",
    deleteConfirmDesc: "פעולה זו לא ניתנת לביטול. התפריט יימחק לצמיתות.",
    cancel: "ביטול",
    delete: "מחק",
    calories: "קלוריות",
    protein: "חלבון",
    carbs: "פחמימות",
    fat: "שומן",
    home: "בית",
    training: "אימון",
    nutrition: "תזונה",
    profile: "פרופיל",
  }
};

const MenuCard = ({ menu, onDelete, allFoods }) => {
    const t = translations['he'];
    
    const totals = React.useMemo(() => {
        let calculatedTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        try {
            const menuData = JSON.parse(menu.menu_data);
            Object.values(menuData).flat().forEach(item => {
                const food = allFoods.find(f => f.id === item.id);
                if(food) {
                    calculatedTotals.calories += food.calories * item.quantity;
                    calculatedTotals.protein += food.protein * item.quantity;
                    calculatedTotals.carbs += food.carbs * item.quantity;
                    calculatedTotals.fat += food.fat * item.quantity;
                }
            });
        } catch(e) { console.error("Failed to parse menu data", e) }
        return calculatedTotals;
    }, [menu.menu_data, allFoods]);

    return (
        <div className="relative">
            <Link to={createPageUrl(`ViewMenu?id=${menu.id}`)} className="block menu-card p-4 flex flex-col gap-3 rounded-lg">
                <div>
                    <CardTitle className="gold-text text-lg">{menu.name}</CardTitle>
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(menu.created_date).toLocaleDateString('he-IL')}
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                    {Object.entries({
                        calories: t.calories,
                        protein: t.protein,
                        carbs: t.carbs,
                        fat: t.fat
                    }).map(([key, label]) => (
                        <div key={key} className="border border-white/20 rounded-full p-1 coil-border">
                            <p className="font-bold gold-text text-sm">{Math.round(totals[key])}</p>
                            <p className="text-xs text-white/70 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </Link>
            <div className="absolute top-2 left-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-red-500 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                                {t.deleteConfirmDesc}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-gray-600 hover:bg-gray-700">{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(menu.id)} className="bg-red-600 hover:bg-red-700">
                                {t.delete}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default function MyMenus() {
  const [menus, setMenus] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allFoods, setAllFoods] = useState([]);
  const t = translations['he'];
  const location = useLocation();

  useEffect(() => {
    const customFoods = JSON.parse(localStorage.getItem('koach-custom-foods') || '[]');
    setAllFoods([...baseAllKnownFoods, ...customFoods]);

    const loadData = async () => {
      setLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser) {
            const savedMenus = await SavedMenu.filter({}, '-created_date');
            setMenus(savedMenus);
        }
      } catch (error) {
        console.error("Error loading menus:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [location]);

  const handleDelete = async (menuId) => {
    try {
      await SavedMenu.delete(menuId);
      setMenus(menus.filter(menu => menu.id !== menuId));
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const userName = user?.first_name || '';
  
  const navItems = [
    { name: "home", path: createPageUrl("Home"), icon: Home },
    { name: "training", path: createPageUrl("Training"), icon: Dumbbell },
    { name: "nutrition", path: createPageUrl("Nutrition"), icon: Utensils },
    { name: "profile", path: createPageUrl("Profile"), icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
       <style jsx>{`
        .menu-card {
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(184, 115, 51, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .menu-card:hover {
          border-color: rgba(184, 115, 51, 0.6);
          transform: translateY(-5px);
        }
        .gold-text {
          background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
        .coil-border {
             border-color: rgba(184, 115, 51, 0.8);
             filter: grayscale(49%);
        }
        .nav-glow {
          box-shadow: 0 -5px 20px -5px rgba(184, 115, 51, 0.2);
        }
      `}</style>
      <h1 className="text-2xl font-bold text-center mb-6 gold-text">{t.myMenus} {userName}</h1>

      {menus.length === 0 ? (
        <p className="text-center text-gray-400">{t.noMenus}</p>
      ) : (
        <div className="space-y-4">
          {menus.map(menu => (
            <MenuCard key={menu.id} menu={menu} onDelete={handleDelete} allFoods={allFoods} />
          ))}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-amber-800/30 z-50 nav-glow">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-around py-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-amber-400"
                        : "text-white/70 hover:text-amber-500"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mb-1 transition-all duration-300 ${isActive ? 'text-amber-400' : ''}`} style={isActive ? {filter: 'drop-shadow(0 0 5px #B87333)'} : {}} />
                    <span className="text-xs font-medium">{t[item.name.toLowerCase()] || item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
    </div>
  );
}
