
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserIcon, Settings, LogOut, Save, Loader2, Home, Dumbbell, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const translations = {
  he: {
    profile: "פרופיל",
    personalInfo: "מידע אישי",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    email: "אימייל",
    language: "שפה",
    saveChanges: "שמור שינויים",
    logout: "התנתק",
    personalFitnessAssessment: "שאלון התאמה אישית",
    hebrew: "עברית",
    english: "English"
  },
  en: {
    // English translations
    profile: "Profile",
    personalInfo: "Personal Info",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    language: "Language",
    saveChanges: "Save Changes",
    logout: "Logout",
    personalFitnessAssessment: "Personal Fitness Assessment",
    hebrew: "Hebrew",
    english: "English"
  }
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('he');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        preferred_language: currentUser.preferred_language || 'he'
      });
      if (currentUser.preferred_language) {
        setLanguage(currentUser.preferred_language);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(formData);
      setUser({...user, ...formData});
      if (formData.preferred_language && formData.preferred_language !== language) {
        setLanguage(formData.preferred_language);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
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

  if (!user) {
    return (
      <div className="p-4 bg-black min-h-screen flex items-center justify-center">
        <Card className="metallic-card w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <UserIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-4 text-white">אנא התחבר</h3>
            <Button onClick={() => User.login()} className="metallic-button w-full text-white">
              התחברות
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4 space-y-6 pb-24">
        <style jsx>{`
          .metallic-card {
            background: rgba(17, 17, 17, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(184, 115, 51, 0.2);
          }
          .metallic-button {
            background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
            border: 1px solid rgba(251, 191, 36, 0.3);
            filter: grayscale(49%);
          }
          .gold-text {
            background: linear-gradient(135deg, #B87333 0%, #CD7F32 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: grayscale(49%);
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
          .nav-glow {
            box-shadow: 0 -5px 20px -5px rgba(184, 115, 51, 0.2);
          }
        `}</style>

        <div className="flex items-start justify-between pt-2">
           <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/657771b33_Screenshot2025-06-27161435.png" alt="KOACH Logo" className="h-8" />
           <div className="flex-1"></div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold gold-text mb-2">{t.profile}</h1>
          <p className="copper-text/70">נהל את המידע האישי שלך</p>
        </div>

        <div className="space-y-4">
          <Card className="metallic-card">
            <CardContent className="p-4 space-y-3">
              <Link to={createPageUrl("FitnessAssessment")}>
                <Button className="w-full metallic-button text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  {t.personalFitnessAssessment}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="metallic-card">
          <CardHeader>
            <CardTitle className="flex items-center copper-text">
              <UserIcon className="w-5 h-5 mr-2 text-amber-500" />
              {t.personalInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="copper-text/80">{t.firstName}</Label>
                <Input
                  id="firstName"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="mt-1 input-field text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="copper-text/80">{t.lastName}</Label>
                <Input
                  id="lastName"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="mt-1 input-field text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="copper-text/80">{t.email}</Label>
              <Input
                id="email"
                value={formData.email || ''}
                disabled
                className="mt-1 bg-gray-800/50 border-gray-600 text-white/60"
              />
            </div>
            <div>
              <Label htmlFor="language" className="copper-text/80">{t.language}</Label>
            <Select
                value={formData.preferred_language || 'he'}
                onValueChange={(value) => setFormData({...formData, preferred_language: value})}
              >
                <SelectTrigger className="mt-1 input-field text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-amber-500/30">
                  <SelectItem value="he" className="text-white hover:bg-amber-500/20">{t.hebrew}</SelectItem>
                  <SelectItem value="en" className="text-white hover:bg-amber-500/20">{t.english}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'שומר...' : t.saveChanges}
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-black border border-amber-600/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </div>

      {/* Navigation Bar is now handled by Layout.js */}
    </div>
  );
}
