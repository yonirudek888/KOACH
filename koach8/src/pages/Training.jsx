
import React, { useState, useEffect } from "react";
import { Program } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Database, ArrowRight, Dumbbell as DumbbellIcon, PersonStanding, Moon, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const translations = {
  he: {
    training: "כושר",
    viewProgram: "צפה בתוכנית",
    exerciseBank: "מאגר תרגילים",
    bodyweightTitle: "משקל גוף",
    bodyweightSubtitle: "אין ציוד זה לא אומר שאין תירוצים",
    mainTitle: "הכנתי לך אחלה של שגרת אימונים",
    mainTitlePersonal: "שגרת האימונים של",
    gymTitle: "חדר כושר",
    breatheAndWalk: "תרגיל נשימות + הליכה",
    firstTimeMessage: "בניתי לך 2 תוכניות אימון, אחת לחדר כושר והשנייה אך ורק משקל גוף ותרגילים שניתן לבצע בבית",
    editName: "שינוי שם",
    save: "שמור",
    cancel: "ביטול"
  },
  en: {
    // English translations
  }
};

const WeeklySchedule = ({ user }) => {
    const [selectedDay, setSelectedDay] = useState('א');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalVideoUrl, setModalVideoUrl] = useState('');
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

    useEffect(() => {
        const dayMap = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
        const currentDayIndex = new Date().getDay(); // 0 is Sunday
        setSelectedDay(dayMap[currentDayIndex]);
    }, []);

    const gender = user?.gender || 'male';
    
    const maleImages = {
        'א': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8b304b799_pexels-frame-kings-255818-812746.jpg",
        'ב': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2b3d07cf3_WhatsAppImage2025-07-02at085227.jpg",
        'ג': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2998c2f91_pexels-alesiakozik-7289368.jpg",
        'ד': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5761383d_pexels-olia-danilevich-9004303.jpg",
        'ה': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8b304b799_pexels-frame-kings-255818-812746.jpg",
        'ו': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2b3d07cf3_WhatsAppImage2025-07-02at085227.jpg",
        'ש': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5761383d_pexels-olia-danilevich-9004303.jpg"
    };

    const femaleImages = {
        'א': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/955c9afdc_pexels-pixabay-416778.jpg",
        'ב': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8341baa92_pexels-olly-868704.jpg",
        'ג': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b4f11d3d0_pexels-olly-3757366.jpg",
        'ד': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5761383d_pexels-olia-danilevich-9004303.jpg",
        'ה': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/955c9afdc_pexels-pixabay-416778.jpg",
        'ו': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8341baa92_pexels-olly-868704.jpg",
        'ש': "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f5761383d_pexels-olia-danilevich-9004303.jpg"
    };
    
    const t = translations['he'];

    const getContentForDay = (day) => {
        let text, image, link, onClick;
        const imageSrc = gender === 'female' ? femaleImages[day] : maleImages[day];
        
        if (['א', 'ג', 'ה'].includes(day)) {
            text = "אימון כוח";
            let dayIndex = 0;
            if (day === 'ג') dayIndex = 1; // יום שלישי
            if (day === 'ה') dayIndex = 2; // יום חמישי
            link = createPageUrl(`WorkoutSession?dayIndex=${dayIndex}&gender=${user?.gender || 'male'}`);
        } else if (['ב', 'ד', 'ו'].includes(day)) {
             text = "תרגיל נשימות + הליכה";
             link = null;
             onClick = () => {
                 setModalVideoUrl("https://www.youtube.com/embed/tybOi4hjZFQ");
                 setIsModalOpen(true);
             };
        }
        else if (day === 'ש') {
            text = "מנוחה";
            link = null;
        }
        
        return { text, image: imageSrc, link, onClick };
    };

    const renderContent = () => {
        const content = getContentForDay(selectedDay);
        if (!content) return null;

        const contentElement = (
            <div className="mt-4 text-center cursor-pointer" onClick={content.onClick}>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden group">
                     <img src={content.image} alt={content.text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                     <div className="absolute inset-0 bg-black/30"></div>
                     <h3 className="absolute bottom-4 right-4 text-white text-xl font-bold">{content.text}</h3>
                </div>
            </div>
        );

        if (content.link) {
            return <Link to={content.link}>{contentElement}</Link>;
        }
        return contentElement;
    };

    return (
        <>
            <div className="p-4 rounded-2xl border border-white/20 bg-black/30" style={{filter: 'grayscale(49%)', borderColor: 'rgba(184, 115, 51, 0.6)', borderWidth: '2px'}}>
                <div className="flex justify-around mb-4">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300
                                ${selectedDay === day 
                                    ? 'bg-amber-500 text-black' 
                                    : 'bg-black text-amber-500 border border-amber-500'
                                }
                            `}
                            style={selectedDay === day ? {filter: 'grayscale(0%)'} : {filter: 'grayscale(49%)'}}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                {renderContent()}
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-black border-amber-500 p-0 max-w-lg w-full">
                    <div className="aspect-video">
                        <iframe 
                            src={modalVideoUrl} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function Training() {
  const [programs, setPrograms] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    loadData();
    const firstVisit = !localStorage.getItem('hasVisitedTraining');
    setIsFirstVisit(firstVisit);
    if(firstVisit) {
        localStorage.setItem('hasVisitedTraining', 'true');
    }
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.preferred_language) setLanguage(currentUser.preferred_language);
    } catch (error) {
      // User not logged in
    }

    try {
      const programsData = await Program.filter({ is_active: true });
      setPrograms(programsData);
    } catch (error) {
      console.error("Error loading programs:", error);
      setPrograms([]);
    }
    setLoading(false);
  };

  const getFullBodyProgramId = () => {
    return 'full_body_program'; 
  };

  const getBodyweightProgramId = () => {
    return 'bodyweight_program';
  };
  
  const getPageTitle = () => {
      const t = translations[language];
      const userName = user?.first_name || '';
      if (isFirstVisit || !userName) {
          return t.mainTitle;
      }
      return `${t.mainTitlePersonal} ${userName}`;
  }

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        .card-entrance {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes slideInUp { to { opacity: 1; transform: translateY(0); } }
        
        .metallic-button {
          background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
          border: 1px solid rgba(251, 191, 36, 0.3);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(184, 115, 51, 0.2);
        }
        .metallic-button:hover {
          box-shadow: 0 6px 25px rgba(184, 115, 51, 0.4);
          transform: translateY(-2px);
        }
        .card-border {
           border: 1px solid rgba(184, 115, 51, 0.6);
        }
        .gold-text {
          background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .connected-border {
            border-color: rgba(184, 115, 51, 0.6);
        }
      `}</style>

      <div className="p-4">
        <div className="mb-8 text-center pt-8">
          <h1 className="text-2xl font-bold gold-text mb-3">
            {getPageTitle()}
          </h1>
          {isFirstVisit && (
            <p className="text-white/80 text-sm mb-4">{t.firstTimeMessage}</p>
          )}
        </div>
        
        <div className="space-y-4 mb-4">
            <WeeklySchedule user={user} />
            
            <div className="rounded-2xl overflow-hidden border connected-border relative" style={{borderColor: 'rgba(184, 115, 51, 0.6)', borderWidth: '2px'}}>
                <Link to={createPageUrl(`ProgramDetails?id=${getFullBodyProgramId()}`)}>
                  <div className="relative overflow-hidden group h-64 card-entrance">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3bd4b7981_20250627_1137_Ultra-LuxuryGymScene_simple_compose_01jyr8fa6pfr587hbqzdnf1ytx.png"
                      alt="Full Body Program"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-4">
                       <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm font-semibold text-white z-10">
                           {t.gymTitle}
                       </div>
                       <div className="mt-4">
                         <Button asChild className="metallic-button text-white px-6 py-2 rounded-full text-sm font-semibold h-auto">
                             <span>{t.viewProgram}</span>
                         </Button>
                       </div>
                    </div>
                  </div>
                </Link>
            </div>
        </div>

        <div className="space-y-1 mt-4">
          <Link to={createPageUrl(`ProgramDetails?id=${getBodyweightProgramId()}`)} className="w-full block">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 rounded-2xl group card-entrance connected-border h-full">
              <div className="relative h-32">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2f433914f_IMG_3389.jpg"
                  alt={t.bodyweightTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute bottom-4 right-4 text-right">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{t.bodyweightTitle}</h3>
                  <p className="text-xs text-gray-200 drop-shadow-md">{t.bodyweightSubtitle}</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to={createPageUrl("ExerciseBank")} className="w-full block">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 rounded-2xl group card-entrance connected-border h-full">
              <div className="relative h-32">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/810ec32d2_20250627_1155_CopperFitnessArt_simple_compose_01jyr9gq8kf8f875ett5wphdyj.png"
                  alt={t.exerciseBank}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 flex items-center justify-between p-6">
                  <div className="text-white">
                        <div className="flex items-center space-x-3 mb-2 rtl:space-x-reverse">
                            <Database className="w-5 h-5" />
                            <h3 className="text-xl font-bold drop-shadow-lg">{t.exerciseBank}</h3>
                        </div>
                    <p className="text-xs text-gray-200 drop-shadow-md">{t.exerciseBankSubtitle}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/70" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
