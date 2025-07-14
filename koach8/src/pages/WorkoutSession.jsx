
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const translations = {
  he: {
    exercise: "תרגיל מספר",
    sets: "סטים",
    reps: "חזרות",
    muscleGroups: "קבוצות שרירים:",
    prevExercise: "תרגיל קודם",
    nextExercise: "תרגיל הבא",
    finishWorkout: "סיימתי אימון",
    sessionTitle: "אימון יומי"
  }
};

const workoutData = {
  male: [
    // יום ראשון - גברים
    [
      { name_he: 'מתח', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/shorts/ZPG8OsHKXLw' },
      { name_he: 'חתירה', sets: '1-2', reps: '6-12', muscle_groups: 'גב עליון, כתף אחורית', video_url: 'https://www.youtube.com/watch?v=0gxI_U2I2G0' },
      { name_he: 'הרחקת כתף', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית', video_url: 'https://www.youtube.com/shorts/f_OGBg2KxgY' },
      { name_he: 'לחיצת חזה בשיפוע 45', sets: '1-2', reps: '6-12', muscle_groups: 'חזה עליון, כתף קדמית', video_url: 'https://www.youtube.com/shorts/AUJtWOQRHPI' },
      { name_he: 'לחיצת כתפיים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף קדמית, כתף אמצעית', video_url: 'https://www.youtube.com/shorts/k6tzKisR3NY' },
      { name_he: 'פשיטת מרפק פולי עליון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/shorts/Rc7-euA8FDI' },
      { name_he: 'כפיפת מרפק בשיפוע 75', sets: '1-2', reps: '6-12', muscle_groups: 'יד קדמית', video_url: 'https://www.youtube.com/shorts/j5f_0rNkPwU' },
      { name_he: 'קירוב שכמות', sets: '1-2', reps: '6-12', muscle_groups: 'טרפזים', video_url: 'https://www.youtube.com/watch?v=yqzRYcOMx2Q' },
      { name_he: 'סקוואט', sets: '1-2', reps: '6-12', muscle_groups: 'ארבע ראשי, ישבן', video_url: 'https://www.youtube.com/shorts/Ak1iHbEeeY8' },
      { name_he: 'כפיפת ירך', sets: '1-2', reps: '6-12', muscle_groups: 'HAMSTRING', video_url: 'https://www.youtube.com/watch?v=Orxowest56U' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=bpwnud0o6-A' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
    ],
    // יום שלישי - גברים
    [
      { name_he: 'הרחקת כתף', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית', video_url: 'https://www.youtube.com/shorts/f_OGBg2KxgY' },
      { name_he: 'חתירה', sets: '1-2', reps: '6-12', muscle_groups: 'גב עליון, כתף אחורית', video_url: 'https://www.youtube.com/watch?v=0UBRfiO4zDs' },
      { name_he: 'מתח בסופינציה', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/watch?v=nMngQ4nxUU0' },
      { name_he: 'לחיצת חזה בשיפוע 15', sets: '1-2', reps: '6-12', muscle_groups: 'חזה', video_url: 'https://www.youtube.com/shorts/WbCEvFA0NJs' },
      { name_he: 'מקבילים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף קדמית, חזה תחתון, יד אחורית', video_url: 'https://www.youtube.com/shorts/CYviQI1Mnwg' },
      { name_he: 'כפיפת מרפק בשיפוע 75', sets: '1-2', reps: '6-12', muscle_groups: 'יד קדמית', video_url: 'https://www.youtube.com/shorts/j5f_0rNkPwU' },
      { name_he: 'פשיטת מרפק פולי תחתון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/shorts/Rc7-euA8FDI' },
      { name_he: 'קירוב שכמות', sets: '1-2', reps: '6-12', muscle_groups: 'טרפזים', video_url: 'https://www.youtube.com/watch?v=yqzRYcOMx2Q' },
      { name_he: 'הרמות אגן', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=ZSPmIyX9RZs' },
      { name_he: 'עליות תאומים', sets: '1-2', reps: '6-12', muscle_groups: 'תאומים', video_url: 'https://www.youtube.com/shorts/wlqTemUXPXY' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=bpwnud0o6-A' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
    ],
    // יום חמישי - גברים
    [
      { name_he: 'סקוואט', sets: '1-2', reps: '6-12', muscle_groups: 'ארבע ראשי, ישבן', video_url: 'https://www.youtube.com/shorts/Ak1iHbEeeY8' },
      { name_he: 'מתח', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/shorts/ZPG8OsHKXLw' },
      { name_he: 'הרחקת כתף', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית', video_url: 'https://www.youtube.com/shorts/f_OGBg2KxgY' },
      { name_he: 'חתירה', sets: '1-2', reps: '6-12', muscle_groups: 'גב עליון, כתף אחורית', video_url: 'https://www.youtube.com/watch?v=0UBRfiO4zDs' },
      { name_he: 'לחיצת כתפיים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף קדמית ואמצעית', video_url: 'https://www.youtube.com/shorts/k6tzKisR3NY' },
      { name_he: 'לחיצת חזה בשיפוע 45', sets: '1-2', reps: '6-12', muscle_groups: 'חזה עליון', video_url: 'https://www.youtube.com/shorts/AUJtWOQRHPI' },
      { name_he: 'מקבילים', sets: '1-2', reps: '6-12', muscle_groups: 'חזה תחתון, יד אחורית, כתף קדמית', video_url: 'https://www.youtube.com/shorts/CYviQI1Mnwg' },
      { name_he: 'קירוב שכמות', sets: '1-2', reps: '6-12', muscle_groups: 'טרפזים', video_url: 'https://www.youtube.com/watch?v=yqzRYcOMx2Q' },
      { name_he: 'כפיפת מרפק בשיפוע קל', sets: '1-2', reps: '6-12', muscle_groups: 'יד קדמית', video_url: 'https://www.youtube.com/shorts/j5f_0rNkPwU' },
      { name_he: 'פשיטת מרפק פולי עליון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/shorts/rGI88vZdArg' },
      { name_he: 'כפיפת ירך', sets: '1-2', reps: '6-12', muscle_groups: 'HAMSTRING', video_url: 'https://www.youtube.com/watch?v=Orxowest56U' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=bpwnud0o6-A' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
    ]
  ],
  female: [
    // יום ראשון - נשים
    [
      { name_he: 'הרמות אגן', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=9vK4GVohtHE' },
      { name_he: 'כפיפת ירך', sets: '1-2', reps: '6-12', muscle_groups: 'HAMSTRING', video_url: 'https://www.youtube.com/watch?v=Orxowest56U' },
      { name_he: 'סקוואט', sets: '1-2', reps: '6-12', muscle_groups: 'ארבע ראשי, ישבן', video_url: 'https://www.youtube.com/watch?v=xqvCmoLULNY' },
      { name_he: 'עליות תאומים', sets: '1-2', reps: '6-12', muscle_groups: 'תאומים', video_url: 'https://www.youtube.com/shorts/wlqTemUXPXY' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=bpwnud0o6-A' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
      { name_he: 'משיכה בפולי עליון', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/shorts/5s6KGLTMgoI' },
      { name_he: 'לחיצת כתפיים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית וקדמית', video_url: 'https://www.youtube.com/shorts/k6tzKisR3NY' },
      { name_he: 'פשיטת מרפק פולי תחתון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/watch?v=1u18yJELsh0' },
    ],
    // יום שלישי - נשים
    [
      { name_he: 'הרמות אגן', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=9vK4GVohtHE' },
      { name_he: 'סקוואט בעמידה רחבה', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=xqvCmoLULNY' },
      { name_he: 'קירוב ירך במכונה', sets: '1-2', reps: '6-12', muscle_groups: 'מקרבים', video_url: 'https://www.youtube.com/shorts/roOzV_hV2iE' },
      { name_he: 'כפיפת ירך', sets: '1-2', reps: '6-12', muscle_groups: 'HAMSTRING', video_url: 'https://www.youtube.com/watch?v=Orxowest56U' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=bpwnud0o6-A' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
      { name_he: 'משיכה בפולי עליון', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/shorts/5s6KGLTMgoI' },
      { name_he: 'לחיצת כתפיים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית וקדמית', video_url: 'https://www.youtube.com/shorts/k6tzKisR3NY' },
      { name_he: 'פשיטת מרפק פולי תחתון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/watch?v=1u18yJELsh0' },
    ],
    // יום חמישי - נשים
    [
      { name_he: 'סקוואט בעמידה רחבה', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=xqvCmoLULNY' },
      { name_he: 'הרמות אגן', sets: '1-2', reps: '6-12', muscle_groups: 'ישבן, ארבע ראשי', video_url: 'https://www.youtube.com/watch?v=9vK4GVohtHE' },
      { name_he: 'כפיפת ירך', sets: '1-2', reps: '6-12', muscle_groups: 'HAMSTRING', video_url: 'https://www.youtube.com/watch?v=Orxowest56U' },
      { name_he: 'עליות תאומים', sets: '1-2', reps: '6-12', muscle_groups: 'תאומים', video_url: 'https://www.youtube.com/shorts/wlqTemUXPXY' },
      { name_he: 'הנפות רגליים', sets: '1-2', reps: '6-12', muscle_groups: 'בטן תחתונה ואמצעית', video_url: 'https://www.youtube.com/shorts/6tkgHJZYh1A' },
      { name_he: 'כפיפות בטן על בוסו', sets: '1-2', reps: '6-12', muscle_groups: 'בטן עליונה ואמצעית', video_url: 'https://www.youtube.com/watch?v=OXthtOV4508' },
      { name_he: 'עליות גו', sets: '1-2', reps: '6-12', muscle_groups: 'גב תחתון, זוקפים', video_url: 'https://www.youtube.com/watch?v=ENXyYltB7CM' },
      { name_he: 'לחיצת כתפיים', sets: '1-2', reps: '6-12', muscle_groups: 'כתף אמצעית וקדמית', video_url: 'https://www.youtube.com/shorts/k6tzKisR3NY' },
      { name_he: 'משיכה בפולי עליון', sets: '1-2', reps: '6-12', muscle_groups: 'גב, יד קדמית', video_url: 'https://www.youtube.com/shorts/5s6KGLTMgoI' },
      { name_he: 'פשיטת מרפק פולי תחתון', sets: '1-2', reps: '6-12', muscle_groups: 'יד אחורית', video_url: 'https://www.youtube.com/watch?v=1u18yJELsh0' },
    ]
  ]
};

export default function WorkoutSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [gender, setGender] = useState('male');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dayParam = params.get("dayIndex");
    const genderParam = params.get("gender");
    
    if (dayParam) setDayIndex(parseInt(dayParam));
    if (genderParam) setGender(genderParam);

    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser.gender && !genderParam) {
            setGender(currentUser.gender);
        }
      } catch (e) { console.error("Could not load user", e); }
    };
    loadUser();
  }, [location.search]);

  const t = translations['he'];

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('/shorts/')[1].split('?')[0];
    } else {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleFinishWorkout = async () => {
    if (!user) return;
    try {
      const updatedCompletedWorkouts = [...(user.completed_workouts || []), new Date().toISOString()];
      await User.updateMyUserData({ completed_workouts: updatedCompletedWorkouts });
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Failed to update completed workouts:", error);
    }
  };

  const currentWorkout = workoutData[gender]?.[dayIndex] || [];
  const currentExercise = currentWorkout[exerciseIndex];
  const embedUrl = currentExercise ? getYouTubeEmbedUrl(currentExercise.video_url) : null;

  const goToNext = () => {
    setExerciseIndex(prev => Math.min(prev + 1, currentWorkout.length - 1));
  };

  const goToPrev = () => {
    setExerciseIndex(prev => Math.max(prev - 1, 0));
  };

  const isLastExercise = exerciseIndex === currentWorkout.length - 1;

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">לא נמצאו תרגילים</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24" dir="rtl">
       <style jsx>{`
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
        .exercise-border {
          border: 1px solid rgba(184, 115, 51, 0.6);
          filter: grayscale(49%);
          padding: 1rem;
        }
        .nav-button {
            filter: grayscale(49%);
        }
      `}</style>

      <div className="sticky top-0 z-10 p-4 bg-black/80 backdrop-blur-md text-center pt-8">
          <h1 className="text-xl font-bold copper-text">{t.sessionTitle}</h1>
      </div>

      <div className="p-4">
        <main className="flex-grow flex flex-col items-center text-center space-y-2 exercise-border rounded-lg relative">
          <div className="pt-6">
            <h1 className="text-2xl font-bold copper-text">{t.exercise} {exerciseIndex + 1}</h1>
            <h2 className="text-xl copper-text mt-2">{currentExercise.name_he}</h2>
            <p className="text-md copper-text mt-2">{t.muscleGroups} {currentExercise.muscle_groups}</p>
            <div className="flex gap-4 copper-text mt-2 justify-center">
                <span>{t.sets}: {currentExercise.sets}</span>
                <span>{t.reps}: {currentExercise.reps}</span>
            </div>
          </div>

          {embedUrl && (
            <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden border border-amber-800/50 mt-4" style={{filter: 'grayscale(49%)'}}>
              <iframe
                src={embedUrl}
                title={currentExercise.name_he}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
          
           <footer className="w-full mt-auto pt-4">
               {isLastExercise ? (
                   <Button 
                      onClick={handleFinishWorkout}
                      className="w-full aspect-square bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 nav-button"
                  >
                      {t.finishWorkout}
                  </Button>
               ) : (
                  <div className="grid grid-cols-2 gap-2">
                      <Button 
                          onClick={goToPrev}
                          disabled={exerciseIndex === 0}
                          className="aspect-square bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 disabled:opacity-50 nav-button mr-5"
                      >
                          {t.prevExercise}
                      </Button>
                      <Button 
                          onClick={goToNext}
                          disabled={isLastExercise}
                          className="aspect-square bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 disabled:opacity-50 nav-button"
                      >
                          {t.nextExercise}
                      </Button>
                  </div>
               )}
          </footer>
        </main>
      </div>
    </div>
  );
}
