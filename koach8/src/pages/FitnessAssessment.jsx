
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const translations = {
  he: {
    fitnessAssessment: "שאלון התאמה אישית",
    subtitle: "נתונים אלו יעזרו לי להתאים לך תוכנית תזונה וכושר מתואמת אישית אלייך",
    backToProfile: "חזרה לפרופיל",
    save: "שמור",
    saving: "שומר...",
    age: "גיל",
    height: "גובה (ס״מ)",
    weight: "משקל (ק״ג)",
    gender: "מין",
    male: "גבר",
    female: "אישה",
    fitnessGoal: "מטרה גופנית",
    daysPerWeek: "מספר אימונים בשבוע",
    fitnessLevel: "רמת כושר",
    buildMuscle: "בניית שריר",
    weightGain: "עלייה במשקל",
    toning: "חיטוב",
    "0": "ללא אימונים",
    "3": "3 ימים",
    "6": "6 ימים",
    neverTrained: "לא התאמנתי בחיים",
    basicFitness: "רמת כושר בסיסית",
    excellentFitness: "בכושר מצוין",
  },
  en: {
    // English translations
    fitnessAssessment: "Personalized Fitness Assessment",
    subtitle: "These details will help me tailor a personalized nutrition and fitness plan for you.",
    backToProfile: "Back to Profile",
    save: "Save",
    saving: "Saving...",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    fitnessGoal: "Fitness Goal",
    daysPerWeek: "Workouts per Week",
    fitnessLevel: "Fitness Level",
    buildMuscle: "Build Muscle",
    weightGain: "Weight Gain",
    toning: "Toning",
    "0": "No workouts",
    "3": "3 days",
    "6": "6 days",
    neverTrained: "Never trained",
    basicFitness: "Basic fitness level",
    excellentFitness: "Excellent fitness",
  }
};

export default function FitnessAssessment() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    age: '', height: '', weight: '', gender: '', goal: '', daysPerWeek: '', fitnessLevel: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setLanguage(currentUser.preferred_language || 'he');
      const validGoals = ['buildMuscle', 'toning', 'weightGain'];
      const currentGoal = currentUser.goals?.[0];
      setFormData({
        age: currentUser.fitness_assessment?.age || '',
        height: currentUser.height || '',
        weight: currentUser.weight || '',
        gender: currentUser.gender || '',
        goal: validGoals.includes(currentGoal) ? currentGoal : '',
        daysPerWeek: currentUser.fitness_assessment?.daysPerWeek || '',
        fitnessLevel: currentUser.fitness_level || '',
      });
    } catch (error) { console.error("Error loading user:", error); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData({
        height: parseInt(formData.height) || 0,
        weight: parseInt(formData.weight) || 0,
        gender: formData.gender,
        goals: [formData.goal],
        fitness_level: formData.fitnessLevel,
        fitness_assessment: {
          ...(user.fitness_assessment || {}),
          age: parseInt(formData.age) || 0,
          daysPerWeek: formData.daysPerWeek,
        }
      });
      navigate(createPageUrl("Profile"));
    } catch (error) { console.error("Error saving data:", error); }
    setSaving(false);
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const isFemale = formData.gender === 'female';

  return (
    <div className="p-4 space-y-6 bg-black min-h-screen">
      <style jsx>{`
        .metallic-card {
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(184, 115, 51, 0.2);
        }
        .metallic-button {
          background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .input-field {
          background-color: rgba(30, 30, 30, 0.5);
          border-color: rgba(184, 115, 51, 0.3);
        }
        .copper-text {
          background: linear-gradient(135deg, #D2691E 0%, #A0522D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: grayscale(49%);
        }
      `}</style>

      <div className="relative text-center mb-6 pt-8">
        <h1 className="text-2xl font-bold copper-text">{t.fitnessAssessment}</h1>
        <p className="text-white/70 text-sm mt-1">{t.subtitle}</p>
      </div>

      <Card className="metallic-card">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="text-white/80">{t.age}</Label>
              <Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="mt-1 input-field text-white"/>
            </div>
            <div>
              <Label htmlFor="height" className="text-white/80">{t.height}</Label>
              <Input id="height" type="number" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="mt-1 input-field text-white"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="text-white/80">{t.weight}</Label>
              <Input id="weight" type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="mt-1 input-field text-white"/>
            </div>
            <div>
              <Label htmlFor="gender" className="text-white/80">{t.gender}</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger id="gender" className="mt-1 input-field text-white"><SelectValue placeholder="בחר מין" /></SelectTrigger>
                <SelectContent className="bg-gray-900 border-amber-500/30">
                  <SelectItem value="male" className="text-white hover:bg-amber-500/20">{t.male}</SelectItem>
                  <SelectItem value="female" className="text-white hover:bg-amber-500/20">{t.female}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="goal" className="text-white/80">{t.fitnessGoal}</Label>
            <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
              <SelectTrigger id="goal" className="mt-1 input-field text-white"><SelectValue placeholder="בחר מטרה" /></SelectTrigger>
              <SelectContent className="bg-gray-900 border-amber-500/30">
                <SelectItem value="buildMuscle" className="text-white hover:bg-amber-500/20">{t.buildMuscle}</SelectItem>
                {isFemale && <SelectItem value="weightGain" className="text-white hover:bg-amber-500/20">{t.weightGain}</SelectItem>}
                <SelectItem value="toning" className="text-white hover:bg-amber-500/20">{t.toning}</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="fitnessLevel" className="text-white/80">{t.fitnessLevel}</Label>
            <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}>
              <SelectTrigger id="fitnessLevel" className="mt-1 input-field text-white"><SelectValue placeholder="בחר רמת כושר" /></SelectTrigger>
              <SelectContent className="bg-gray-900 border-amber-500/30">
                <SelectItem value="beginner" className="text-white hover:bg-amber-500/20">{t.neverTrained}</SelectItem>
                <SelectItem value="intermediate" className="text-white hover:bg-amber-500/20">{t.basicFitness}</SelectItem>
                <SelectItem value="advanced" className="text-white hover:bg-amber-500/20">{t.excellentFitness}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="daysPerWeek" className="text-white/80">{t.daysPerWeek}</Label>
            <Select value={formData.daysPerWeek} onValueChange={(value) => setFormData({ ...formData, daysPerWeek: value })}>
              <SelectTrigger id="daysPerWeek" className="mt-1 input-field text-white"><SelectValue placeholder="בחר ימים" /></SelectTrigger>
              <SelectContent className="bg-gray-900 border-amber-500/30">
                <SelectItem value="0" className="text-white hover:bg-amber-500/20">{t['0']}</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-amber-500/20">{t['3']}</SelectItem>
                <SelectItem value="6" className="text-white hover:bg-amber-500/20">{t['6']}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full metallic-button text-white">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        {saving ? t.saving : t.save}
      </Button>
    </div>
  );
}
