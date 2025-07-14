import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Dumbbell, Utensils, TrendingUp, Target, Clock, ChevronRight, BookOpen, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const translations = {
  he: {
    welcome: "ברוך הבא",
    welcomeBack: "ברוך שובך",
    todaysWorkout: "האימון של היום",
    nutritionPlan: "התפריט שלך",
    quickStats: "סטטיסטיקות מהירות",
    proteinGrams: "גרם חלבון",
    targetCalories: "יעד קלורי",
    streakDays: "רצף ימים",
    training: "כושר",
    nutrition: "תזונה",
    myMenus: "התפריטים שלי",
    buildMenu: "בניית תפריט"
  },
  en: {
    // English translations
  }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [nutritionalGoals, setNutritionalGoals] = useState({
    calories: 0,
    protein: 0
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.preferred_language) {
        setLanguage(currentUser.preferred_language);
      }
      
      // Check if user needs onboarding
      if (currentUser && (!currentUser.fitness_assessment || !currentUser.fitness_assessment.age)) {
        setShowOnboardingModal(true);
      }
      
      if (currentUser && currentUser.weight && currentUser.height && currentUser.fitness_assessment?.age) {
        const { weight, height, gender, goals, fitness_assessment: { age, daysPerWeek } } = currentUser;
        const goal = goals?.[0];

        let calories = (weight * 10) + (height * 6.25) - (age * 5) + 600;
        if (gender === 'female') calories -= 150;
        if (gender === 'male') calories += 5;
        
        if (goal === 'toning') calories -= 500;
        if (goal === 'buildMuscle' || goal === 'weightGain') calories += 400;

        if (daysPerWeek === '6') calories += 300;
        
        // Updated protein calculation for females
        const protein = gender === 'female' ? Math.round(weight * 1.6) : Math.round(weight * 2);
        
        setNutritionalGoals({
          calories: Math.round(calories),
          protein
        });
      }
    } catch (error) {
      // User not logged in
    }
    setLoading(false);
  };

  const getFullBodyUrl = () => {
    return createPageUrl(`ProgramDetails?id=full_body_program`);
  };

  const getNutritionUrlWithScroll = () => {
    return createPageUrl("Nutrition") + "#build-menu";
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-6 bg-black min-h-screen pb-4">
       <style jsx>{`
        .app-background {
          background: rgba(17, 17, 17, 0.9);
        }
        .metallic-card {
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(184, 115, 51, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
        .card-border {
           border: 1px solid rgba(184, 115, 51, 0.3);
        }
        .copper-gold-text {
            color: #b87333; /* A matte copper-gold color */
            filter: grayscale(49%);
        }
      `}</style>
      
      <div className="flex items-center justify-between pt-4 pb-4">
        <div className="text-right">
          <h1 className="text-lg font-bold copper-text">
            {user ? t.welcomeBack : t.welcome}
            {user && user.first_name && (
              <span className="gold-text">, {user.first_name}</span>
            )}
          </h1>
        </div>
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/657771b33_Screenshot2025-06-27161435.png" alt="KOACH Logo" className="h-8" />
      </div>

      <div className="space-y-4">
        <Link to={createPageUrl("Training")}>
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl group h-40 metallic-card card-border">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c60561586_.png" 
              alt={t.training} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-transparent"></div>
            <CardContent className="relative z-10 p-6 h-full flex items-end justify-end">
                <ChevronRight className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl("Nutrition")}>
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl group h-40 metallic-card card-border">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a9364c776_.png" 
              alt={t.nutrition} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-transparent"></div>
            <CardContent className="relative z-10 p-6 h-full flex items-end justify-end">
                <ChevronRight className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {user && (
        <>
          <Card className="metallic-card card-border">
            <CardContent className="p-4">
              <h3 className="text-md font-semibold mb-4 flex items-center copper-text">
                <TrendingUp className="w-4 h-4 mr-2 gold-text" />
                {t.quickStats}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-xl font-bold copper-text">
                    {nutritionalGoals.protein}
                  </div>
                  <div className="text-xs copper-gold-text">{t.proteinGrams}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold gold-text">{nutritionalGoals.calories}</div>
                  <div className="text-xs copper-gold-text">{t.targetCalories}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold copper-text">7</div>
                  <div className="text-xs copper-gold-text">{t.streakDays}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link to={getFullBodyUrl()}>
              <Card className="hover:shadow-md transition-shadow metallic-card card-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Target className="w-4 h-4 gold-text" />
                      </div>
                      <div>
                        <h4 className="font-medium copper-text">{t.todaysWorkout}</h4>
                        <p className="text-sm copper-text/80">Full Body</p>
                      </div>
                    </div>
                    <div className="flex items-center copper-text">
                      <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 copper-gold-text" />
                      <span className="text-sm copper-gold-text">45 דקות</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

          {/* New Menu Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Link to={createPageUrl("MyMenus")}>
              <Card className="hover:shadow-md transition-shadow metallic-card card-border">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-2">
                    <BookOpen className="w-4 h-4 gold-text" />
                  </div>
                  <h4 className="font-medium copper-text text-sm">{t.myMenus}</h4>
                </CardContent>
              </Card>
            </Link>

            <a href={getNutritionUrlWithScroll()}>
              <Card className="hover:shadow-md transition-shadow metallic-card card-border">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-2">
                    <PlusCircle className="w-4 h-4 gold-text" />
                  </div>
                  <h4 className="font-medium copper-text text-sm">{t.buildMenu}</h4>
                </CardContent>
              </Card>
            </a>
          </div>
        </>
      )}
      </div>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-amber-600/50 rounded-lg p-6 max-w-sm w-full text-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold copper-text mb-2">ברוך הבא!</h3>
              <p className="text-white/80 text-sm">
                בשביל שאצור עבורך תוכנית אימון ותזונה מותאמת אישית אלייך תמלא את השאלון הבא
              </p>
            </div>
            <Button 
              onClick={() => {
                setShowOnboardingModal(false);
                window.location.href = createPageUrl("FitnessAssessment");
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-black font-semibold"
              style={{filter: 'grayscale(49%)'}}
            >
              שאלון התאמה אישית
            </Button>
          </div>
        </div>
      )}
    </>
  );
}