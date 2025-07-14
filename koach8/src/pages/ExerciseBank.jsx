import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
  he: {
    exerciseBank: "מאגר תרגילים",
    backToTraining: "חזרה לכושר",
    selectMuscle: "בוא נבחر קבוצת שרירים – קבל תרגילים מותאמים אישית",
    chest: "חזה",
    back: "גב",
    shoulders: "כתפיים", 
    biceps: "יד קדמית",
    triceps: "יד אחורית",
    abs: "בטן",
    hamstring: "חבליים",
    glutes: "ישבן"
  },
  en: {
    exerciseBank: "Exercise Bank",
    backToTraining: "Back to Training",
    selectMuscle: "Choose a muscle group – Get personalized exercises",
    chest: "Chest",
    back: "Back", 
    shoulders: "Shoulders",
    biceps: "Biceps",
    triceps: "Triceps",
    abs: "Abs",
    hamstring: "Hamstring",
    glutes: "Glutes"
  }
};

const muscleGroups = [
  {
    id: 'chest',
    nameHe: 'חזה',
    nameEn: 'Chest',
    bgGradient: 'from-red-500 to-pink-600',
    hoverGradient: 'from-red-400 to-pink-500',
    shadowColor: 'shadow-red-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a722277dd_8685a82b-7cf5-4373-93cf-0d6677d30b1c.png'
  },
  {
    id: 'back',
    nameHe: 'גב',
    nameEn: 'Back',
    bgGradient: 'from-blue-600 to-indigo-700',
    hoverGradient: 'from-blue-500 to-indigo-600',
    shadowColor: 'shadow-blue-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/14a0af70a_9b61a5a9-c6cb-466f-b85d-5088c6961c1d.png'
  },
  {
    id: 'shoulders',
    nameHe: 'כתפיים',
    nameEn: 'Shoulders',
    bgGradient: 'from-orange-500 to-red-600',
    hoverGradient: 'from-orange-400 to-red-500',
    shadowColor: 'shadow-orange-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/fb076c100_17083b59-4055-42a1-ab22-a09769cb675d.png'
  },
  {
    id: 'biceps',
    nameHe: 'יד קדמית',
    nameEn: 'Biceps',
    bgGradient: 'from-purple-500 to-violet-600',
    hoverGradient: 'from-purple-400 to-violet-500',
    shadowColor: 'shadow-purple-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ea86e0bb7_83ffaffc-dac0-485f-b332-d591cce2c432.png'
  },
  {
    id: 'triceps',
    nameHe: 'יד אחורית',
    nameEn: 'Triceps',
    bgGradient: 'from-emerald-500 to-teal-600',
    hoverGradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/793493d98_0068894a-b207-47b7-b9ed-fa37ed091c5f.png'
  },
  {
    id: 'abs',
    nameHe: 'בטן',
    nameEn: 'Abs',
    bgGradient: 'from-yellow-500 to-orange-600',
    hoverGradient: 'from-yellow-400 to-orange-500',
    shadowColor: 'shadow-yellow-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c5519deba_ac95293a-fa15-49c2-8d85-062c5d60d1df.png'
  },
  {
    id: 'hamstring',
    nameHe: 'חבליים',
    nameEn: 'Hamstring',
    bgGradient: 'from-green-600 to-emerald-700',
    hoverGradient: 'from-green-500 to-emerald-600',
    shadowColor: 'shadow-green-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3308658ce_817466b3-3e49-4de1-bc9f-131d85861069.png'
  },
  {
    id: 'glutes',
    nameHe: 'ישבן',
    nameEn: 'Glutes',
    bgGradient: 'from-pink-500 to-rose-600',
    hoverGradient: 'from-pink-400 to-rose-500',
    shadowColor: 'shadow-pink-200',
    backgroundImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3308658ce_817466b3-3e49-4de1-bc9f-131d85861069.png'
  }
];

export default function ExerciseBank() {
  const [language] = useState('he');

  const handleMuscleClick = (muscleGroup) => {
    window.location.href = createPageUrl(`MuscleExercises?muscle=${muscleGroup}`);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl("Training")}>
            <Button variant="ghost" className="p-2 text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold copper-text">{t.exerciseBank}</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 copper-text">
            בחר קבוצת שרירים
          </h2>
        </div>
      </div>

      {/* Muscle Groups Grid */}
      <div className="relative z-10 px-4 pb-8">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {muscleGroups.map((muscle, index) => (
            <div
              key={muscle.id}
              onClick={() => handleMuscleClick(muscle.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className={`
                  relative overflow-hidden rounded-3xl p-6 h-40 flex flex-col justify-end items-center
                  ${muscle.backgroundImage ? 'bg-cover bg-center' : `bg-gradient-to-br ${muscle.bgGradient}`}
                  group-hover:bg-gradient-to-br group-hover:${muscle.hoverGradient}
                  shadow-lg ${muscle.shadowColor} group-hover:shadow-2xl
                  transition-all duration-300
                  border border-white/20
                `}
                style={muscle.backgroundImage ? {
                  backgroundImage: `linear-gradient(135deg, rgba(184, 115, 51, 0.5), rgba(210, 105, 30, 0.5)), url(${muscle.backgroundImage})`,
                  backgroundSize: muscle.backgroundSize || 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Background pattern - only for non-image cards */}
                {!muscle.backgroundImage && (
                  <>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>  
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                  </>
                )}
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-white font-bold text-xl group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg">
                    {language === 'he' ? muscle.nameHe : muscle.nameEn}
                  </h3>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-400/30 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            לחץ על השריר לתרגילים מותאמים
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-8 w-3 h-3 bg-yellow-400/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 left-8 w-2 h-2 bg-pink-400/40 rounded-full animate-bounce"></div>
      
      <style jsx>{`
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
      `}</style>
    </div>
  );
}