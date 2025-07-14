import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const translations = {
  he: {
    programTitle: "התוכנית של ",
    goalPrefix: "מטרת התוכנית:",
    goalBuildMuscle: "בניית שריר",
    descBuildMuscleMaleGym: "בניתי עבורך תוכנית לעלייה במסת שריר עם דגש לחיזוק הפלג הגוף העליון בלי לבזבז שעות בחדר כושר, התוכנית מורכבת מ3 אימונים של שעה בשבוע ובכל אימון נעבוד על כל השרירים בגוף עם דגש קל על השרירים שבחרת להתמקד בהם",
    highlightsTitle: "דגשים לאימון",
    highlightsGym: [
      "לפני תחילת האימון יש לבצע חימום.",
      "באימון נעבוד בין סט אחד לשניים על כל שריר, יש לבצע את התרגילים לפי מספר החזרות המצוין לכל תרגיל, אם הצלחת יותר חזרות סימן שעלייך לעלות משקל, אם לא הצלחת להגיע למספר החזרות המצוין עלייך להוריד משקל.",
      "יש לבצע כל סט עד כשל, זהו קריטריון קריטי להצלחה בתוכנית וישפיע רבות על תוצאותיה.",
      "בכל תרגיל תשאף לבצע יותר חזרות מאשר הצלחת באימון הקודם, זה המדד הישיר לבניית שריר והתחזקות.",
      "ברגע שהצלחתם להגיע לחלק העליון של טווח החזרות שמצויין ליד התרגיל, אימון שאחריי תעלו משקל מה שיגרום למספר החזרות שלכם לרדת לחלק התחתון של הטווח."
    ],
    editDaysPrompt: "אני רוצה להתאמן בימים",
    workoutsOf: "האימונים של ",
    editDayNamesTitle: "עריכת ימי אימון",
    save: "שמור",
    cancel: "ביטול",
    selectDays: "בחר 3 ימי אימון:",
    sunday: "יום ראשון",
    monday: "יום שני", 
    tuesday: "יום שלישי",
    wednesday: "יום רביעי",
    thursday: "יום חמישי",
    friday: "יום שישי",
    saturday: "יום שבת"
  },
};

export default function ProgramDetails() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [dayNames, setDayNames] = useState(['יום ראשון', 'יום שלישי', 'יום חמישי']);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [selectedDayIndices, setSelectedDayIndices] = useState([0, 2, 4]); // ראשון, שלישי, חמישי

  const navigate = useNavigate();

  const allDayNames = [
    'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'
  ];

  useEffect(() => {
    loadData();
    const savedDayNames = localStorage.getItem('koach-day-names');
    const savedIndices = localStorage.getItem('koach-selected-day-indices');
    
    if (savedDayNames) {
      try {
        const parsedNames = JSON.parse(savedDayNames);
        setDayNames(parsedNames);
      } catch (e) {
        console.error("Failed to parse day names from storage", e);
      }
    }
    
    if (savedIndices) {
      try {
        const parsedIndices = JSON.parse(savedIndices);
        setSelectedDayIndices(parsedIndices);
      } catch (e) {
        console.error("Failed to parse day indices from storage", e);
      }
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.preferred_language) setLanguage(currentUser.preferred_language);
    } catch (e) { /* not logged in */ }
    setLoading(false);
  };

  const handleOpenEditModal = () => {
    setIsEditingDays(true);
  };

  const handleDayToggle = (dayIndex) => {
    setSelectedDayIndices(prev => {
      if (prev.includes(dayIndex)) {
        // Remove if already selected
        return prev.filter(index => index !== dayIndex);
      } else if (prev.length < 3) {
        // Add if less than 3 selected
        return [...prev, dayIndex];
      }
      return prev; // Don't add if already 3 selected
    });
  };

  const handleSaveDays = () => {
    if (selectedDayIndices.length === 3) {
      const newDayNames = selectedDayIndices.map(index => allDayNames[index]);
      setDayNames(newDayNames);
      localStorage.setItem('koach-day-names', JSON.stringify(newDayNames));
      localStorage.setItem('koach-selected-day-indices', JSON.stringify(selectedDayIndices));
      setIsEditingDays(false);
    }
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
    <div className="pb-8 bg-black min-h-screen">
      <style jsx>{`
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
        .workout-buttons-container {
          border: 1px solid rgba(184, 115, 51, 0.6);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }
        .day-selection-button {
          padding: 8px 12px;
          border: 1px solid rgba(184, 115, 51, 0.6);
          border-radius: 8px;
          background: transparent;
          color: #b87333;
          transition: all 0.3s ease;
          filter: grayscale(49%);
        }
        .day-selection-button.selected {
          background: #b87333;
          color: black;
        }
        .day-selection-button:hover {
          border-color: rgba(184, 115, 51, 0.8);
        }
      `}</style>
      
      <div className="sticky top-0 bg-black z-10 p-4 text-center space-y-2">
         <h1 className="text-xl font-bold copper-text pt-8">
          {t.programTitle}{user?.first_name || ''}
        </h1>
        <div className="border border-amber-600/50 rounded-lg p-3" style={{filter: 'grayscale(49%)'}}>
          <p className="copper-text font-semibold text-center">{t.goalPrefix} {t.goalBuildMuscle}</p>
          <p className="text-white/80 text-sm mt-1 text-center">{t.descBuildMuscleMaleGym}</p>
        </div>
      </div>

      <div className="px-4 space-y-8 mt-4">
        <div>
          <h2 className="font-semibold copper-text mb-3 text-center text-lg">{t.highlightsTitle}</h2>
          <div className="space-y-3 text-white/90 text-sm">
            {t.highlightsGym.map((text, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-current copper-text flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="workout-buttons-container">
          <div className="text-center space-y-4 relative">
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 left-0 h-7 w-7"
                  onClick={handleOpenEditModal}
              >
                  <Edit className="w-4 h-4 text-amber-500" />
              </Button>
              <h2 className="copper-text font-semibold text-lg">{t.workoutsOf}{user?.first_name || ''}</h2>
              <div className="flex justify-center items-center gap-1 w-[95%] mx-auto">
                  {dayNames.map((dayName, index) => (
                      <Button 
                          key={index}
                          onClick={() => navigate(createPageUrl(`WorkoutSession?dayIndex=${index}&gender=${user?.gender || 'male'}`))}
                          className="flex-1 aspect-square bg-amber-600 text-black hover:bg-amber-700 text-xs"
                          style={{filter: 'grayscale(49%)'}}
                      >
                          {dayName}
                      </Button>
                  ))}
              </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditingDays} onOpenChange={setIsEditingDays}>
        <DialogContent className="bg-black border-amber-600 text-white">
          <DialogHeader>
            <DialogTitle className="copper-text text-center">{t.editDayNamesTitle}</DialogTitle>
          </DialogHeader>
           <div className="py-4 space-y-4">
                <p className="copper-text text-center">{t.selectDays}</p>
                <div className="grid grid-cols-2 gap-2">
                  {allDayNames.map((dayName, index) => (
                    <button
                      key={index}
                      onClick={() => handleDayToggle(index)}
                      className={`day-selection-button ${selectedDayIndices.includes(index) ? 'selected' : ''}`}
                    >
                      {dayName}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/60 text-center">
                  נבחרו {selectedDayIndices.length} מתוך 3 ימים
                </p>
            </div>
          <DialogFooter>
            <Button variant="ghost" className="copper-text" onClick={() => setIsEditingDays(false)}>{t.cancel}</Button>
            <Button 
              onClick={handleSaveDays} 
              disabled={selectedDayIndices.length !== 3}
              className="bg-amber-600 hover:bg-amber-700 text-black disabled:opacity-50"
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}