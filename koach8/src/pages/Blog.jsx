
import React, { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/api/entities";
import { UserBlogInteraction } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Star, StarOff, Plus, Loader2, Edit3, Trash2, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const translations = {
  he: {
    blog: "בלוג",
    downloadPdf: "הורד מדריך",
    searchPlaceholder: "חיפוש...",
    noArticles: "לא נמצאו מאמרים",
    addPost: "הוספת מאמר",
    title: "כותרת ראשית",
    summary: "כותרת משנה",
    content: "תוכן מלא",
    uploadImage: "העלאת תמונה",
    creating: "יוצר...",
    create: "צור מאמר",
    cancel: "ביטול",
    edit: "עריכה",
    delete: "מחק",
    moveUp: "העבר למעלה",
    moveDown: "העבר למטה",
    save: "שמור",
    editing: "עריכת מאמר"
  }
};

const FeaturedArticleCard = ({ post, isAdmin, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const longPressTimer = useRef(null);
  const t = translations['he'];

  const handleMouseDown = (e) => {
    if (!isAdmin) return;
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowContextMenu(true);
    }, 800);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  const handleTouchStart = (e) => {
    if (!isAdmin) return;
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowContextMenu(true);
    }, 800);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  return (
    <div className="w-full relative">
      {isAdmin && (
        <Button
          onClick={() => onEdit(post)}
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 z-20 bg-black/50 hover:bg-black/70 text-white"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      )}
      
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="cursor-pointer"
      >
        <Link to={createPageUrl(`BlogPost?id=${post.id}`)} className="block">
          {post.image_url && (
            <div className="aspect-[16/9] overflow-hidden w-full">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </Link>
        
        <div className="w-full p-4 sm:p-6" style={{ background: '#222831' }}>
          <Link to={createPageUrl(`BlogPost?id=${post.id}`)}>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
              {post.title}
            </h1>
            <div className="w-24 h-0.5 bg-red-600 my-4"></div>
            <p className="text-lg text-white font-medium mb-4">
              {post.summary}
            </p>
            <div className="text-sm text-gray-400 flex items-center">
              <span>{post.author || "צוות KOACH"}</span>
              <span className="mx-2">|</span>
              <span>{new Date(post.created_date).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </Link>
        </div>
      </div>

      {showContextMenu && isAdmin && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border z-30 p-2">
          <Button
            onClick={() => {
              onDelete(post);
              setShowContextMenu(false);
            }}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t.delete}
          </Button>
          {canMoveUp && (
            <Button
              onClick={() => {
                onMoveUp(post);
                setShowContextMenu(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              {t.moveUp}
            </Button>
          )}
          {canMoveDown && (
            <Button
              onClick={() => {
                onMoveDown(post);
                setShowContextMenu(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              {t.moveDown}
            </Button>
          )}
          <Button
            onClick={() => setShowContextMenu(false)}
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <X className="w-4 h-4 mr-2" />
            {t.cancel}
          </Button>
        </div>
      )}
    </div>
  );
};

const ArticleRow = ({ post, isAdmin, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const longPressTimer = useRef(null);
  const t = translations['he'];

  const handleMouseDown = (e) => {
    if (!isAdmin) return;
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowContextMenu(true);
    }, 800);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  const handleTouchStart = (e) => {
    if (!isAdmin) return;
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setShowContextMenu(true);
    }, 800);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  return (
    <div 
      className="article-row-container relative"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isAdmin && (
        <Button
          onClick={() => onEdit(post)}
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 z-20 bg-gray-100 hover:bg-gray-200"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      )}
      
      <Link to={createPageUrl(`BlogPost?id=${post.id}`)} className="block">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <h2 className="article-title">{post.title}</h2>
            <p className="article-summary">{post.summary}</p>
            <div className="article-meta">
              <span>{post.author || "צוות KOACH"}</span>
              <span className="mx-1">•</span>
              <span>{new Date(post.created_date).toLocaleDateString('he-IL')}</span>
            </div>
          </div>
          {post.image_url && (
            <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover rounded-md" />
            </div>
          )}
        </div>
      </Link>

      {showContextMenu && isAdmin && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border z-30 p-2">
          <Button
            onClick={() => {
              onDelete(post);
              setShowContextMenu(false);
            }}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t.delete}
          </Button>
          {canMoveUp && (
            <Button
              onClick={() => {
                onMoveUp(post);
                setShowContextMenu(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              {t.moveUp}
            </Button>
          )}
          {canMoveDown && (
            <Button
              onClick={() => {
                onMoveDown(post);
                setShowContextMenu(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              {t.moveDown}
            </Button>
          )}
          <Button
            onClick={() => setShowContextMenu(false)}
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <X className="w-4 h-4 mr-2" />
            {t.cancel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [newPostData, setNewPostData] = useState({ title: '', summary: '', content: '' });
  const [editPostData, setEditPostData] = useState({ title: '', summary: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const t = translations['he'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser && currentUser.email === 'yonirudek9@gmail.com') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log("User not logged in");
    }

    try {
      const blogPosts = await BlogPost.filter({ published: true }, '-created_date');
      
      // Update images for specific posts
      if (blogPosts.length >= 2) {
        // Update sleep article to original image
        const sleepPost = blogPosts.find(post => post.title === 'שינה - הכוח שלכם');
        if (sleepPost) {
          await BlogPost.update(sleepPost.id, {
            ...sleepPost,
            image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          });
          sleepPost.image_url = 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        }
        
        // Update gelatin article to DNA image
        const gelatinPost = blogPosts.find(post => post.title === 'הסופר-פוד שלא הכרתם: ג\'לטין בקר');
        if (gelatinPost) {
          await BlogPost.update(gelatinPost.id, {
            ...gelatinPost,
            image_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694b7c59c_bfc917a4-746f-462d-9d74-51d1a96f84a2.png'
          });
          gelatinPost.image_url = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694b7c59c_bfc917a4-746f-462d-9d74-51d1a96f84a2.png';
        }
      }
      
      setPosts(blogPosts);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    }
    
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostData.title || !newPostData.content) return;
    setIsCreating(true);

    let imageUrl = '';
    if (imageFile) {
      try {
        const { file_url } = await UploadFile({ file: imageFile });
        imageUrl = file_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        setIsCreating(false);
        return;
      }
    }

    try {
      const createdPost = await BlogPost.create({
        ...newPostData,
        image_url: imageUrl,
        author: user?.full_name || "Admin"
      });
      
      setNewPostData({ title: '', summary: '', content: '' });
      setImageFile(null);
      if(fileInputRef.current) fileInputRef.current.value = null;
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPost = (post) => {
    if (!isAdmin) return;
    setEditingPost(post);
    setEditPostData({
      title: post.title,
      summary: post.summary,
      content: post.content
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !editPostData.title || !editPostData.content) return;
    
    try {
      await BlogPost.update(editingPost.id, editPostData);
      setIsEditModalOpen(false);
      setEditingPost(null);
      loadData();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (post) => {
    if (!isAdmin) return;
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המאמר?')) {
      try {
        await BlogPost.delete(post.id);
        loadData();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleMovePost = async (post, direction) => {
    if (!isAdmin) return;
    const currentIndex = posts.findIndex(p => p.id === post.id);
    if (direction === 'up' && currentIndex > 0) {
      // Move up logic - swap with previous post
      const previousPost = posts[currentIndex - 1];
      const currentTime = new Date().toISOString();
      
      try {
        // Update timestamps to change order
        await BlogPost.update(post.id, { ...post, created_date: previousPost.created_date });
        await BlogPost.update(previousPost.id, { ...previousPost, created_date: currentTime });
        loadData();
      } catch (error) {
        console.error("Error moving post:", error);
      }
    } else if (direction === 'down' && currentIndex < posts.length - 1) {
      // Move down logic - swap with next post
      const nextPost = posts[currentIndex + 1];
      const currentTime = new Date().toISOString();
      
      try {
        await BlogPost.update(post.id, { ...post, created_date: nextPost.created_date });
        await BlogPost.update(nextPost.id, { ...nextPost, created_date: currentTime });
        loadData();
      } catch (error) {
        console.error("Error moving post:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        .article-row-container {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          width: 85%;
          margin: 0 auto;
          position: relative;
        }
        .article-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: black;
          line-height: 1.3;
          margin-bottom: 0.25rem;
        }
        .article-summary {
          font-size: 0.9rem;
          color: #4a4a4a;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .article-meta {
          font-size: 0.75rem;
          color: #6b6b6b;
        }
        .admin-fab {
          position: fixed;
          bottom: 5rem;
          left: 1.5rem;
          background: linear-gradient(135deg, #B87333 0%, #A0522D 100%);
          filter: grayscale(49%);
          color: white;
          border-radius: 9999px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          z-index: 40;
        }
      `}</style>
      
      {featuredPost && (
        <FeaturedArticleCard 
          post={featuredPost} 
          isAdmin={isAdmin}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onMoveUp={(post) => handleMovePost(post, 'up')}
          onMoveDown={(post) => handleMovePost(post, 'down')}
          canMoveUp={false}
          canMoveDown={regularPosts.length > 0}
        />
      )}

      <main className="bg-white">
        {regularPosts.length > 0 ? (
          regularPosts.map((post, index) => (
            <ArticleRow 
              key={post.id} 
              post={post} 
              isAdmin={isAdmin}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onMoveUp={(post) => handleMovePost(post, 'up')}
              onMoveDown={(post) => handleMovePost(post, 'down')}
              canMoveUp={true}
              canMoveDown={index < regularPosts.length - 1}
            />
          ))
        ) : (
          !loading && <p className="text-center py-12 text-gray-500">{t.noArticles}</p>
        )}
      </main>

      {isAdmin && (
        <>
          {/* Create Post Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="admin-fab">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-amber-600 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-amber-500">{t.addPost}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">{t.uploadImage}</label>
                  <Input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="bg-gray-800 border-gray-600 file:text-amber-400"
                  />
                </div>
                <Input 
                  placeholder={t.title} 
                  value={newPostData.title}
                  onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                  className="bg-gray-800 border-gray-600"
                />
                <Textarea 
                  placeholder={t.summary} 
                  value={newPostData.summary}
                  onChange={(e) => setNewPostData({...newPostData, summary: e.target.value})}
                  className="bg-gray-800 border-gray-600 h-24"
                />
                <Textarea 
                  placeholder={t.content} 
                  value={newPostData.content}
                  onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                  className="bg-gray-800 border-gray-600 h-40"
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t.cancel}</Button>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={isCreating}
                  className="bg-amber-600 text-black hover:bg-amber-700"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {isCreating ? t.creating : t.create}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Post Dialog */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="bg-gray-900 border-amber-600 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-amber-500">{t.editing}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Input 
                  placeholder={t.title} 
                  value={editPostData.title}
                  onChange={(e) => setEditPostData({...editPostData, title: e.target.value})}
                  className="bg-gray-800 border-gray-600"
                />
                <Textarea 
                  placeholder={t.summary} 
                  value={editPostData.summary}
                  onChange={(e) => setEditPostData({...editPostData, summary: e.target.value})}
                  className="bg-gray-800 border-gray-600 h-24"
                />
                <Textarea 
                  placeholder={t.content} 
                  value={editPostData.content}
                  onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}
                  className="bg-gray-800 border-gray-600 h-60"
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>{t.cancel}</Button>
                <Button 
                  onClick={handleUpdatePost}
                  className="bg-amber-600 text-black hover:bg-amber-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
