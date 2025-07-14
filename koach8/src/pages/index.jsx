import Layout from "./Layout.jsx";

import Home from "./Home";

import Training from "./Training";

import Nutrition from "./Nutrition";

import Profile from "./Profile";

import ProgramDetails from "./ProgramDetails";

import FitnessAssessment from "./FitnessAssessment";

import ExerciseBank from "./ExerciseBank";

import MuscleExercises from "./MuscleExercises";

import MenuBuilder from "./MenuBuilder";

import MyMenus from "./MyMenus";

import ViewMenu from "./ViewMenu";

import WorkoutSession from "./WorkoutSession";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Training: Training,
    
    Nutrition: Nutrition,
    
    Profile: Profile,
    
    ProgramDetails: ProgramDetails,
    
    FitnessAssessment: FitnessAssessment,
    
    ExerciseBank: ExerciseBank,
    
    MuscleExercises: MuscleExercises,
    
    MenuBuilder: MenuBuilder,
    
    MyMenus: MyMenus,
    
    ViewMenu: ViewMenu,
    
    WorkoutSession: WorkoutSession,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Training" element={<Training />} />
                
                <Route path="/Nutrition" element={<Nutrition />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ProgramDetails" element={<ProgramDetails />} />
                
                <Route path="/FitnessAssessment" element={<FitnessAssessment />} />
                
                <Route path="/ExerciseBank" element={<ExerciseBank />} />
                
                <Route path="/MuscleExercises" element={<MuscleExercises />} />
                
                <Route path="/MenuBuilder" element={<MenuBuilder />} />
                
                <Route path="/mymenus" element={<MyMenus />} />
                
                <Route path="/ViewMenu" element={<ViewMenu />} />
                
                <Route path="/WorkoutSession" element={<WorkoutSession />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}