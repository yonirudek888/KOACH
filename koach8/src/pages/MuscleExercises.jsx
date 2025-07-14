
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Link as LinkIcon } from "lucide-react";

const translations = {
  he: {
    exercises: "תרגילים",
    backToBank: "חזרה לבנק תרגילים",
    watchVideo: "צפה בסרטון",
    noExercises: "לא נמצאו תרגילים עבור הסינון הנוכחי",
    chest: "חזה",
    shoulders: "כתפיים",
    biceps: "יד קדמית",
    triceps: "יד אחורית",
    abs: "בטן",
    legs: "רגליים",
    back: "גב",
    glutes: "ישבן",
    gym: "חדר כושר",
    bodyweight: "משקל גוף",
    upperBack: "גב עליון",
    lats: "רחב גבי",
    upperChest: "חזה עליון",
    midChest: "חזה אמצעי",
    lowerChest: "חזה תחתון"
  },
  en: {
    // ... English translations can be added here
  }
};

const exerciseData = {
  back: {
    subGroups: {
      upperBack: {
        name_he: "גב עליון",
        gym: [
          "https://www.muscleandstrength.com/exercises/machine-t-bar-row.html", 
          "https://www.youtube.com/shorts/vqPY3fDessY",
          "https://www.muscleandstrength.com/exercises/machine-t-bar-row.html"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/Dy2kQ9YZPOM", 
          "https://www.youtube.com/shorts/ZPG8OsHKXLw",
          "https://www.youtube.com/shorts/Dy2kQ9YZPOM"
        ]
      },
      lats: {
        name_he: "רחב גבי",
        gym: [
          "https://www.youtube.com/shorts/5s6KGLTMgoI", 
          "https://www.youtube.com/shorts/LyZH4UGdDTc",
          "https://www.youtube.com/shorts/5s6KGLTMgoI"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/Oi3bW9nQmGI",
          "https://www.youtube.com/shorts/Oi3bW9nQmGI",
          "https://www.youtube.com/shorts/Oi3bW9nQmGI"
        ]
      }
    }
  },
  chest: {
    subGroups: {
      upperChest: {
        name_he: "חזה עליון",
        gym: [
          "https://www.youtube.com/shorts/AUJtWOQRHPI", 
          "https://www.youtube.com/shorts/BwqlWtr3v10",
          "https://www.youtube.com/shorts/AUJtWOQRHPI"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/SOu-3_YyX2c",
          "https://www.youtube.com/shorts/SOu-3_YyX2c",
          "https://www.youtube.com/shorts/SOu-3_YyX2c"
        ]
      },
      midChest: {
        name_he: "חזה אמצעי",
        gym: [
          "https://www.youtube.com/shorts/WbCEvFA0NJs", 
          "https://www.youtube.com/shorts/P2QigTGUiDw",
          "https://www.youtube.com/shorts/WbCEvFA0NJs"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/SOu-3_YyX2c",
          "https://www.youtube.com/shorts/SOu-3_YyX2c",
          "https://www.youtube.com/shorts/SOu-3_YyX2c"
        ]
      },
      lowerChest: {
        name_he: "חזה תחתון",
        gym: [
          "https://www.youtube.com/shorts/CYviQI1Mnwg",
          "https://www.youtube.com/shorts/CYviQI1Mnwg",
          "https://www.youtube.com/shorts/CYviQI1Mnwg"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/ZV20m6B9hFs",
          "https://www.youtube.com/shorts/ZV20m6B9hFs",
          "https://www.youtube.com/shorts/ZV20m6B9hFs"
        ]
      }
    }
  },
  biceps: {
    subGroups: {
      biceps: {
        name_he: "יד קדמית",
        gym: [
          "https://www.youtube.com/shorts/j5f_0rNkPwU", 
          "https://www.youtube.com/shorts/_GziHDdJY10",
          "https://www.youtube.com/shorts/j5f_0rNkPwU"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/906kGe7_Kec",
          "https://www.youtube.com/shorts/906kGe7_Kec",
          "https://www.youtube.com/shorts/906kGe7_Kec"
        ]
      }
    }
  },
  triceps: {
    subGroups: {
      triceps: {
        name_he: "יד אחורית",
        gym: [
          "https://www.youtube.com/shorts/rGI88vZdArg", 
          "https://www.youtube.com/shorts/b5le--KkyH0",
          "https://www.youtube.com/shorts/rGI88vZdArg"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/ZV20m6B9hFs", 
          "https://www.youtube.com/shorts/PPTj-MW2tcs",
          "https://www.youtube.com/shorts/ZV20m6B9hFs"
        ]
      }
    }
  },
  abs: {
    subGroups: {
      abs: {
        name_he: "בטן",
        gym: [
          "https://www.youtube.com/watch?v=OXthtOV4508", 
          "https://www.youtube.com/shorts/Gtv_pe0E42U",
          "https://www.youtube.com/watch?v=OXthtOV4508"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/6tkgHJZYh1A", 
          "https://www.youtube.com/shorts/cHlc_uKkG0M",
          "https://www.youtube.com/shorts/6tkgHJZYh1A"
        ]
      }
    }
  },
  shoulders: {
     subGroups: {
        shoulder_middle: {
            name_he: 'כתף אמצעית',
            gym: [
              'https://www.youtube.com/shorts/f_OGBg2KxgY', 
              'https://www.youtube.com/shorts/EIfWki7Omac',
              'https://www.youtube.com/shorts/f_OGBg2KxgY'
            ],
            bodyweight: [
              'https://www.youtube.com/shorts/Q44qVPfDgN4',
              'https://www.youtube.com/shorts/Q44qVPfDgN4',
              'https://www.youtube.com/shorts/Q44qVPfDgN4'
            ]
        },
        shoulder_front: {
            name_he: 'כתף קדמית',
            gym: [
              'https://www.youtube.com/shorts/k6tzKisR3NY',
              'https://www.youtube.com/shorts/k6tzKisR3NY',
              'https://www.youtube.com/shorts/k6tzKisR3NY'
            ],
            bodyweight: [
              'https://www.youtube.com/shorts/_wYRaVHVr6g',
              'https://www.youtube.com/shorts/_wYRaVHVr6g',
              'https://www.youtube.com/shorts/_wYRaVHVr6g'
            ]
        }
    }
  },
  hamstring: {
    subGroups: {
      hamstring: {
        name_he: "חבליים",
        gym: [
          "https://www.youtube.com/shorts/example1", 
          "https://www.youtube.com/shorts/example2",
          "https://www.youtube.com/shorts/example3"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/example4",
          "https://www.youtube.com/shorts/example5",
          "https://www.youtube.com/shorts/example6"
        ]
      }
    }
  },
  glutes: {
    subGroups: {
      glutes: {
        name_he: "ישבן",
        gym: [
          "https://www.youtube.com/shorts/example7", 
          "https://www.youtube.com/shorts/example8",
          "https://www.youtube.com/shorts/example9"
        ],
        bodyweight: [
          "https://www.youtube.com/shorts/example10",
          "https://www.youtube.com/shorts/example11",
          "https://www.youtube.com/shorts/example12"
        ]
      }
    }
  }
};


export default function MuscleExercises() {
  const location = useLocation();
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [muscleGroup, setMuscleGroup] = useState('');
  const [activeSubGroups, setActiveSubGroups] = useState({});
  const [selectedEquipment, setSelectedEquipment] = useState({ gym: false, bodyweight: false });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const muscle = params.get("muscle");
    setMuscleGroup(muscle);

    if (muscle && exerciseData[muscle]) {
      const subGroupKeys = Object.keys(exerciseData[muscle].subGroups);
      // Activate the first sub-group by default
      setActiveSubGroups({ [subGroupKeys[0]]: true });
    }
    setLoading(false);
  }, [location.search]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url || !url.includes('youtu')) return null;
    let videoId;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1].split('?')[0];
    } else {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleEquipmentChange = (equipment) => {
    setSelectedEquipment(prev => ({ ...prev, [equipment]: !prev[equipment] }));
  };
  
  const handleSubGroupClick = (subGroupKey) => {
    setActiveSubGroups(prev => ({ [subGroupKey]: !prev[subGroupKey] }));
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const currentMuscleData = exerciseData[muscleGroup];
  const subGroupKeys = currentMuscleData ? Object.keys(currentMuscleData.subGroups) : [];
  const shouldRenderSubGroupButtons = subGroupKeys.length > 1;

  const VideoCard = ({ url }) => {
    const embedUrl = getYouTubeEmbedUrl(url);

    if (embedUrl) {
      return (
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            title="Exercise Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Card className="bg-gray-800 hover:bg-gray-700 border-gray-700">
          <CardContent className="p-4 flex items-center justify-center text-white">
            <LinkIcon className="w-5 h-5 mr-2" />
            <span>צפה במדריך</span>
          </CardContent>
        </Card>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx>{`
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
      `}</style>
      
      <div className="relative text-center mb-6 pt-8 px-4">
        <h1 className="text-xl font-bold copper-text">
          {t[muscleGroup] || muscleGroup}
        </h1>
      </div>
      
      <div className="p-4 mb-4">
        <div className="flex justify-center gap-4">
          {['gym', 'bodyweight'].map(equip => (
            <Button
              key={equip}
              variant="ghost"
              onClick={() => handleEquipmentChange(equip)}
              className={`px-4 py-2 text-white hover:bg-gray-800 transition-all rounded-lg ${
                selectedEquipment[equip] ? 'border-2 bg-gradient-to-br from-amber-600 to-amber-700 text-black' : 'border-2 border-transparent'
              }`}
              style={selectedEquipment[equip] ? {filter: 'grayscale(49%)'} : {}}
            >
              {t[equip]}
            </Button>
          ))}
        </div>
      </div>

      {shouldRenderSubGroupButtons && (
        <div className="px-4 pb-4 flex flex-wrap justify-center gap-2">
            {subGroupKeys.map(key => (
                 <Button 
                    key={key}
                    onClick={() => handleSubGroupClick(key)}
                    variant={activeSubGroups[key] ? 'default' : 'secondary'}
                    className={`${activeSubGroups[key] ? 'bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-black' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                    style={activeSubGroups[key] ? {filter: 'grayscale(49%)'} : {}}
                 >
                    {currentMuscleData.subGroups[key].name_he}
                 </Button>
            ))}
        </div>
      )}

      <div className="p-4 space-y-8">
        {currentMuscleData && subGroupKeys.map(subGroupKey => {
            if (!activeSubGroups[subGroupKey]) return null;

            const subGroup = currentMuscleData.subGroups[subGroupKey];
            const noEquipmentSelected = !selectedEquipment.gym && !selectedEquipment.bodyweight;
            const showGym = selectedEquipment.gym || noEquipmentSelected;
            const showBodyweight = selectedEquipment.bodyweight || noEquipmentSelected;

            const gymVideos = showGym ? subGroup.gym || [] : [];
            const bodyweightVideos = showBodyweight ? subGroup.bodyweight || [] : [];
            const videosToShow = [...gymVideos, ...bodyweightVideos];

            return (
                <div key={subGroupKey}>
                    {!shouldRenderSubGroupButtons && <h2 className="text-lg font-semibold text-center mb-4 copper-text">{subGroup.name_he}</h2>}
                    {videosToShow.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {videosToShow.map((url, index) => (
                                <VideoCard key={`${subGroupKey}-${index}`} url={url} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Dumbbell className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                            <p>{t.noExercises}</p>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
}
