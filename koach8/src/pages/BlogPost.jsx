import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { BlogPost } from "@/api/entities";
import { UserBlogInteraction } from "@/api/entities";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, StarOff, Calendar, Clock, Tag, Edit3, Save, X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, Upload } from "lucide-react";
import { UploadFile } from "@/api/integrations";

const translations = {
  he: {
    blog: "בלוג",
    tags: "תגיות",
    backToBlog: "חזרה לבלוג",
    favorite: "הוסף למועדפים",
    unfavorite: "הסר ממועדפים",
    edit: "✏️ ערוך מאמר",
    save: "שמור שינויים",
    cancel: "ביטול",
    editMode: "מצב עריכה",
    uploadImage: "העלה תמונה",
    changeImage: "שנה תמונה"
  },
};

export default function BlogPostPage() {
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = translations["he"];

  useEffect(() => {
    const fetchPostAndUser = async () => {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const postId = params.get("id");

      if (postId) {
        try {
          const fetchedPost = await BlogPost.get(postId);
          setPost(fetchedPost);
          setEditContent(fetchedPost.content || '');
          setEditTitle(fetchedPost.title || '');
          setEditSummary(fetchedPost.summary || '');
        } catch (error) {
          console.error("Failed to fetch blog post:", error);
        }
      }

      try {
        const currentUser = await User.me();
        setUser(currentUser);
        if (currentUser && currentUser.email === 'yonirudek9@gmail.com') {
          setIsAdmin(true);
        }
      } catch (error) {
        // Not logged in
      }
      setLoading(false);
    };

    fetchPostAndUser();
  }, [location.search]);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file: imageFile });
      setUploading(false);
      return file_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = post.image_url;
      
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) return; // Upload failed
      }

      const updatedPost = {
        ...post,
        title: editTitle,
        summary: editSummary,
        content: editorRef.current ? editorRef.current.innerHTML : editContent,
        image_url: imageUrl
      };

      await BlogPost.update(post.id, updatedPost);
      setPost(updatedPost);
      setIsEditing(false);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      applyFormatting('formatBlock', `h${level}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-8 bg-white text-gray-900">
        <p>מאמר לא נמצא.</p>
        <Link to={createPageUrl("Blog")} className="text-blue-600 hover:underline">
          {t.backToBlog}
        </Link>
      </div>
    );
  }

  return (
    <article className="blog-post bg-white min-h-screen">
      <style jsx>{`
        .blog-post {
          background-color: white;
          color: black;
          font-family: 'Heebo', sans-serif;
        }
        .main-image {
          width: 100%;
          height: auto;
          max-height: 40vh;
          object-fit: cover;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 0.5rem;
          padding: 1rem 1rem 0 1rem;
          color: black;
          background: white;
        }
        .subtitle {
          font-size: 18px;
          color: #666;
          margin-bottom: 1.5rem;
          padding: 0 1rem;
          background: white;
        }
        .content {
          background: white;
          color: black;
          font-family: 'Heebo', sans-serif;
          font-size: 12px;
          line-height: 1.6em;
          padding: 1.5rem;
          direction: rtl;
        }
        .content h1, .content h2, .content h3 {
           font-size: 16px;
           font-weight: bold;
           margin-top: 1.5em;
           margin-bottom: 0.5em;
        }
        .content p {
          margin-bottom: 1em;
        }
        .edit-button {
          margin: 1rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .edit-button:hover {
          background: #2563eb;
        }
        .toolbar {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 1rem;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .toolbar button {
          padding: 6px 12px;
          border: 1px solid #ccc;
          background: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
        .toolbar button:hover {
          background: #e9ecef;
        }
        .toolbar select {
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-size: 12px;
        }
        .editor {
          min-height: 400px;
          border: 1px solid #ccc;
          padding: 1rem;
          outline: none;
          font-family: 'Heebo', sans-serif;
          font-size: 12px;
          line-height: 1.6;
          direction: rtl;
        }
        .editor:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        .save-section {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .input-group {
          margin-bottom: 1rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 14px;
        }
        .input-group input, .input-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-family: 'Heebo', sans-serif;
        }
      `}</style>

      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="main-image" />
      )}
      
      {!isEditing ? (
        <>
          <h1 className="title">{post.title}</h1>
          {post.summary && <h2 className="subtitle">{post.summary}</h2>}
          
          {isAdmin && (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              {t.edit}
            </button>
          )}
          
          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </>
      ) : (
        <div className="p-4">
          <div className="save-section">
            <div className="flex gap-4 mb-4">
              <Button onClick={handleSave} disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {uploading ? 'שומר...' : t.save}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>

            <div className="input-group">
              <label>תמונה ראשית:</label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mb-2"
              />
              {post.image_url && (
                <img src={post.image_url} alt="תמונה נוכחית" className="w-32 h-20 object-cover rounded" />
              )}
            </div>

            <div className="input-group">
              <label>כותרת:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>תת-כותרת:</label>
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows="2"
              />
            </div>
          </div>

          <div className="toolbar">
            <button onClick={() => applyFormatting('bold')} title="מודגש">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => applyFormatting('italic')} title="נטוי">
              <Italic className="w-4 h-4" />
            </button>
            <button onClick={() => applyFormatting('underline')} title="קו תחתון">
              <Underline className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <select onChange={(e) => insertHeading(e.target.value)} defaultValue="">
              <option value="">כותרות</option>
              <option value="1">כותרת 1</option>
              <option value="2">כותרת 2</option>
              <option value="3">כותרת 3</option>
            </select>
            
            <select onChange={(e) => applyFormatting('fontSize', e.target.value)} defaultValue="3">
              <option value="1">8px</option>
              <option value="2">10px</option>
              <option value="3">12px</option>
              <option value="4">14px</option>
              <option value="5">18px</option>
              <option value="6">24px</option>
              <option value="7">36px</option>
            </select>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <button onClick={() => applyFormatting('justifyRight')} title="יישור לימין">
              <AlignRight className="w-4 h-4" />
            </button>
            <button onClick={() => applyFormatting('justifyCenter')} title="יישור למרכז">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button onClick={() => applyFormatting('justifyLeft')} title="יישור לשמאל">
              <AlignLeft className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <button onClick={() => applyFormatting('insertUnorderedList')} title="רשימה">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => applyFormatting('insertOrderedList')} title="רשימה ממוספרת">
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <button onClick={() => applyFormatting('undo')} title="בטל">
              ↶
            </button>
            <button onClick={() => applyFormatting('redo')} title="חזור">
              ↷
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="editor"
            dangerouslySetInnerHTML={{ __html: editContent }}
            suppressContentEditableWarning={true}
            onInput={(e) => setEditContent(e.target.innerHTML)}
          />
        </div>
      )}
    </article>
  );
}