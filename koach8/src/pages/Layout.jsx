
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Dumbbell, Utensils, User as UserIcon, ArrowRight, Newspaper } from "lucide-react";
import { User as UserEntity } from "@/api/entities";
import { Button } from "@/components/ui/button";

const translations = {
  he: {
    home: "בית",
    training: "כושר",
    nutrition: "תזונה",
    blog: "בלוג",
    profile: "פרופיל",
  },
  en: {
    home: "Home",
    training: "Training",
    nutrition: "Nutrition",
    blog: "Blog",
    profile: "Profile",
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('he');

  const handleBackClick = () => {
    switch (currentPageName) {
      case 'ProgramDetails':
        navigate(createPageUrl('Training'));
        break;
      case 'WorkoutSession':
        navigate(createPageUrl('ProgramDetails'));
        break;
      case 'BlogPost':
        navigate(createPageUrl('Blog'));
        break;
      default:
        navigate(-1);
        break;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await UserEntity.me();
        if (currentUser?.preferred_language) {
          setLanguage(currentUser.preferred_language);
        }
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, [location.pathname]);

  const t = translations[language];
  const isRTL = language === 'he';

  const navItems = [
    { name: t.home, path: createPageUrl("Home"), icon: Home },
    { name: t.training, path: createPageUrl("Training"), icon: Dumbbell },
    { name: t.nutrition, path: createPageUrl("Nutrition"), icon: Utensils },
    { name: t.blog, path: createPageUrl("Blog"), icon: Newspaper },
    { name: t.profile, path: createPageUrl("Profile"), icon: UserIcon },
  ];

  const showNav = ['Home', 'Nutrition', 'Profile', 'Training', 'Blog'].includes(currentPageName);
  const showBackButton = !['Home'].includes(currentPageName);

  return (
    <div
      className={`min-h-screen bg-black text-white ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style jsx>{`
        .nav-glow {
          box-shadow: 0 -5px 20px -5px rgba(184, 115, 51, 0.2);
        }
        .back-button {
          background: transparent !important;
          border: none !important;
          color: white !important;
          transition: none !important;
          padding: 8px !important;
        }
        .back-button:hover {
          background: transparent !important;
          color: white !important;
          transform: none !important;
        }
        .back-button:active {
          background: transparent !important;
          color: white !important;
        }
      `}</style>

      <main className={showNav ? 'pb-20' : ''}>
        <div className="max-w-md mx-auto bg-black relative">
          {showBackButton && (
            <div className="absolute top-4 right-4 z-20">
              <button onClick={handleBackClick} className="back-button">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
          {children}
        </div>
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-amber-800/30 z-50 nav-glow">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-around py-2">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
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
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
