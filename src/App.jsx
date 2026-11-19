
import React, { useEffect, useState } from "react";
import {
  BookOpen, Bookmark, Heart, MessageCircle, Search,
  Plus, Sun, Moon, PenLine, Trash2, X, ArrowLeft,
  Feather, Compass, Library, Clock, Sparkles, Send,
  Menu, BookMarked
} from "lucide-react";
import "./App.css";

const starterStories = [
  {
    id: 1,
    title: "The Coffee Shop at Midnight",
    author: "Mira Rose",
    category: "Romance",
    cover: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900",
    content: "The rain was falling softly outside the window. The little coffee shop was almost empty, except for one girl sitting near the window.\n\nShe always came here at midnight. Not because she loved coffee, but because this was the only place where her thoughts felt quiet.\n\nTonight, something was different. Someone had left a small handwritten note on her table.\n\nIt simply said: 'Some stories begin with a stranger.'",
    likes: 24,
    comments: [],
    date: "Nov 12, 2026"
  },
  {
    id: 2,
    title: "Letters I Never Sent",
    author: "Aria Writes",
    category: "Poetry",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900",
    content: "Dear you,\n\nThere are a thousand things I wanted to say, but somehow silence became my favourite language.\n\nI kept every memory like a pressed flower inside an old book. Some days I open that book. Some days I don't.\n\nMaybe growing up is learning that not every letter needs to be sent.",
    likes: 42,
    comments: [],
    date: "Nov 10, 2026"
  },
  {
    id: 3,
    title: "Beyond the Stars",
    author: "Noah Blake",
    category: "Fantasy",
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900",
    content: "Nobody believed that the stars were alive.\n\nBut Luna had always heard them whisper. Every night, she climbed the tallest hill and listened to their stories.\n\nOne evening, a star fell from the sky. It landed right in front of her, glowing like a tiny sun.\n\nAnd then it spoke her name.",
    likes: 18,
    comments: [],
    date: "Nov 08, 2026"
  },
  {
    id: 4,
    title: "A Place Called Home",
    author: "Ethan Cole",
    category: "Life",
    cover: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=900",
    content: "Home was never just a place.\n\nIt was the sound of someone laughing in the kitchen, the smell of fresh rain, and the feeling that you could finally take a deep breath.\n\nSometimes we travel far away just to understand what we had all along.",
    likes: 31,
    comments: [],
    date: "Nov 05, 2026"
  }
];

const categories = ["All", "Romance", "Fantasy", "Poetry", "Mystery", "Life", "Adventure"];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [stories, setStories] = useState(() =>
    readStorage("storyverse-stories", starterStories)
  );
  const [bookmarks, setBookmarks] = useState(() =>
    readStorage("storyverse-bookmarks", [])
  );
  const [liked, setLiked] = useState(() =>
    readStorage("storyverse-liked", [])
  );
  const [dark, setDark] = useState(() =>
    readStorage("storyverse-dark", false)
  );

  const [page, setPage] = useState("Explore");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "You",
    category: "Romance",
    cover: "",
    content: ""
  });

  const [comment, setComment] = useState("");

  useEffect(() => {
    localStorage.setItem("storyverse-stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("storyverse-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("storyverse-liked", JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem("storyverse-dark", JSON.stringify(dark));
  }, [dark]);

  const myStories = stories.filter(story => story.author === "You");

  const visibleStories = stories.filter(story => {
    const matchesCategory =
      category === "All" || story.category === category;

    const matchesSearch =
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.author.toLowerCase().includes(search.toLowerCase());

    const matchesPage =
      page === "My Stories"
        ? story.author === "You"
        : page === "Bookmarks"
        ? bookmarks.includes(story.id)
        : true;

    return matchesCategory && matchesSearch && matchesPage;
  });

  function openEditor(story = null) {
    if (story) {
      setEditingId(story.id);
      setForm({
        title: story.title,
        author: "You",
        category: story.category,
        cover: story.cover,
        content: story.content
      });
    } else {
      setEditingId(null);
      setForm({
        title: "",
        author: "You",
        category: "Romance",
        cover: "",
        content: ""
      });
    }
    setEditorOpen(true);
  }

  function saveStory(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) return;

    if (editingId) {
      setStories(prev =>
        prev.map(story =>
          story.id === editingId
            ? { ...story, ...form }
            : story
        )
      );
    } else {
      const newStory = {
        ...form,
        id: Date.now(),
        cover: form.cover.trim() ||
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900",
        likes: 0,
        comments: [],
        date: new Date().toLocaleDateString()
      };
      setStories(prev => [newStory, ...prev]);
    }

    setEditorOpen(false);
  }

  function deleteStory(id) {
    if (!window.confirm("Delete this story permanently?")) return;
    setStories(prev => prev.filter(story => story.id !== id));
    setBookmarks(prev => prev.filter(item => item !== id));
    if (selected?.id === id) setSelected(null);
  }

  function toggleLike(id) {
    const isLiked = liked.includes(id);

    setLiked(prev =>
      isLiked ? prev.filter(item => item !== id) : [...prev, id]
    );

    setStories(prev =>
      prev.map(story =>
        story.id === id
          ? { ...story, likes: Math.max(0, story.likes + (isLiked ? -1 : 1)) }
          : story
      )
    );
  }

  function toggleBookmark(id) {
    setBookmarks(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }

  function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    setStories(prev =>
      prev.map(story =>
        story.id === selected.id
          ? {
              ...story,
              comments: [
                ...(story.comments || []),
                { id: Date.now(), author: "You", text: comment.trim() }
              ]
            }
          : story
      )
    );

    setSelected(prev => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        { id: Date.now(), author: "You", text: comment.trim() }
      ]
    }));

    setComment("");
  }

  const navigation = [
    { name: "Explore", icon: Compass },
    { name: "My Stories", icon: Library },
    { name: "Bookmarks", icon: Bookmark }
  ];

  function changePage(name) {
    setPage(name);
    setCategory("All");
    setSelected(null);
    setMobileMenu(false);
  }

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <header className="topbar">
        <div className="brand" onClick={() => changePage("Explore")}>
          <div className="brand-icon"><Feather size={23} /></div>
          <span>story<span>verse</span></span>
        </div>

        <div className="header-search">
          <Search size={18} />
          <input
            placeholder="Search stories, authors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <kbd>⌕</kbd>
        </div>

        <div className="header-actions">
          <button className="icon-btn theme-btn" onClick={() => setDark(!dark)}
            aria-label="Toggle theme">
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="write-btn" onClick={() => openEditor()}>
            <Plus size={18} /> Write a story
          </button>
          <button className="icon-btn mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu size={21} />
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
          <div className="sidebar-label">MENU</div>

          {navigation.map(item => (
            <button
              key={item.name}
              className={`nav-item ${page === item.name ? "active" : ""}`}
              onClick={() => changePage(item.name)}
            >
              <item.icon size={19} />
              {item.name}
              {item.name === "Bookmarks" && bookmarks.length > 0 &&
                <span className="nav-count">{bookmarks.length}</span>}
            </button>
          ))}

          <div className="sidebar-divider" />
          <div className="sidebar-label">YOUR SPACE</div>

          <div className="profile-card">
            <div className="avatar">U</div>
            <div>
              <strong>Your profile</strong>
              <small>Storyteller</small>
            </div>
          </div>

          <div className="sidebar-quote">
            <Sparkles size={18} />
            <p>"Every great story begins with a single word."</p>
            <span>— Storyverse</span>
          </div>

          <div className="sidebar-footer">Made for the love of stories ♡</div>
        </aside>

        <main className="main-content">
          {selected ? (
            <section className="reader">
              <button className="back-btn" onClick={() => setSelected(null)}>
                <ArrowLeft size={18} /> Back to stories
              </button>

              <div className="reader-cover"
                style={{ backgroundImage: `url("${selected.cover}")` }}>
                <div className="cover-overlay" />
                <span className="reader-category">{selected.category}</span>
              </div>

              <article className="reader-article">
                <div className="reader-meta">
                  <span><Clock size={15} /> {selected.date}</span>
                  <span>By {selected.author}</span>
                </div>

                <h1>{selected.title}</h1>

                <div className="reader-actions">
                  <button
                    className={liked.includes(selected.id) ? "liked" : ""}
                    onClick={() => toggleLike(selected.id)}>
                    <Heart size={18} fill={liked.includes(selected.id) ? "currentColor" : "none"} />
                    {selected.likes} Likes
                  </button>

                  <button
                    className={bookmarks.includes(selected.id) ? "saved" : ""}
                    onClick={() => toggleBookmark(selected.id)}>
                    <Bookmark size={18}
                      fill={bookmarks.includes(selected.id) ? "currentColor" : "none"} />
                    {bookmarks.includes(selected.id) ? "Saved" : "Bookmark"}
                  </button>

                  {selected.author === "You" && (
                    <>
                      <button onClick={() => openEditor(selected)}>
                        <PenLine size={17} /> Edit
                      </button>
                      <button className="delete-action"
                        onClick={() => deleteStory(selected.id)}>
                        <Trash2 size={17} /> Delete
                      </button>
                    </>
                  )}
                </div>

                <div className="story-body">
                  {selected.content.split("\n").map((paragraph, i) =>
                    paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
                  )}
                </div>

                <div className="comments-section">
                  <h2><MessageCircle size={20} /> Comments ({(selected.comments || []).length})</h2>

                  <form className="comment-form" onSubmit={addComment}>
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                    />
                    <button type="submit"><Send size={17} /></button>
                  </form>

                  {(selected.comments || []).length === 0 ? (
                    <p className="empty-comments">No comments yet. Be the first to share your thoughts!</p>
                  ) : (
                    selected.comments.map(item => (
                      <div className="comment-item" key={item.id}>
                        <div className="avatar small-avatar">
                          {item.author[0]}
                        </div>
                        <div>
                          <strong>{item.author}</strong>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </section>
          ) : (
            <>
              <section className="hero">
                <div className="hero-text">
                  <span className="eyebrow"><Sparkles size={14} /> A WORLD OF STORIES</span>
                  <h1>Stories bring<br />us <em>together.</em></h1>
                  <p>Discover beautiful stories, share your imagination, and find your next favourite read.</p>
                  <button className="hero-btn" onClick={() => openEditor()}>
                    Start writing <PenLine size={17} />
                  </button>
                </div>
                <div className="hero-art">
                  <div className="hero-circle circle-one" />
                  <div className="hero-circle circle-two" />
                  <BookOpen className="hero-book" size={100} strokeWidth={1.1} />
                  <Sparkles className="hero-sparkle sparkle-one" size={25} />
                  <Sparkles className="hero-sparkle sparkle-two" size={17} />
                </div>
                <div className="hero-decoration">S</div>
              </section>

              <section className="stories-section">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">YOUR NEXT READ</span>
                    <h2>{page === "Explore" ? "Discover stories" : page}</h2>
                    <p>
                      {page === "Explore"
                        ? "Find something wonderful to read today."
                        : page === "My Stories"
                        ? "Your creative world, all in one place."
                        : "Stories you've saved for later."}
                    </p>
                  </div>
                  <span className="story-total">{visibleStories.length} stories</span>
                </div>

                <div className="category-list">
                  {categories.map(item => (
                    <button key={item}
                      className={category === item ? "category active-category" : "category"}
                      onClick={() => setCategory(item)}>
                      {item}
                    </button>
                  ))}
                </div>

                {visibleStories.length === 0 ? (
                  <div className="empty-state">
                    <BookMarked size={40} />
                    <h3>No stories found</h3>
                    <p>Try another search or create your own story.</p>
                    <button className="write-btn" onClick={() => openEditor()}>
                      <Plus size={17} /> Write a story
                    </button>
                  </div>
                ) : (
                  <div className="story-grid">
                    {visibleStories.map((story, index) => (
                      <article className="story-card" key={story.id}
                        style={{ animationDelay: `${index * 80}ms` }}>
                        <div className="story-image"
                          style={{ backgroundImage: `url("${story.cover}")` }}>
                          <span className="story-tag">{story.category}</span>
                          <button className={`bookmark-btn ${bookmarks.includes(story.id) ? "saved" : ""}`}
                            onClick={() => toggleBookmark(story.id)}
                            aria-label="Bookmark story">
                            <Bookmark size={17}
                              fill={bookmarks.includes(story.id) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <div className="story-info">
                          <div className="story-author">
                            <span className="author-dot">{story.author[0]}</span>
                            {story.author}
                            <span className="story-date">{story.date}</span>
                          </div>

                          <h3 onClick={() => setSelected(story)}>{story.title}</h3>
                          <p className="story-excerpt">
                            {story.content.slice(0, 105)}...
                          </p>

                          <div className="story-card-footer">
                            <div className="card-stats">
                              <button className={liked.includes(story.id) ? "liked" : ""}
                                onClick={() => toggleLike(story.id)}>
                                <Heart size={16}
                                  fill={liked.includes(story.id) ? "currentColor" : "none"} />
                                {story.likes}
                              </button>
                              <span><MessageCircle size={16} /> {(story.comments || []).length}</span>
                            </div>
                            <button className="read-btn"
                              onClick={() => setSelected(story)}>
                              Read story <ArrowLeft size={15} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="footer">
            <span>© 2026 Storyverse</span>
            <span>Made with ♡ for storytellers</span>
          </footer>
        </main>
      </div>

      {editorOpen && (
        <div className="modal-backdrop" onClick={() => setEditorOpen(false)}>
          <div className="editor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="eyebrow">YOUR CREATIVE SPACE</span>
                <h2>{editingId ? "Edit your story" : "Create a story"}</h2>
              </div>
              <button className="icon-btn" onClick={() => setEditorOpen(false)}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveStory}>
              <label>Story title</label>
              <input required maxLength={100}
                placeholder="Give your story a beautiful title..."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />

              <label>Category</label>
              <select value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.filter(c => c !== "All").map(c =>
                  <option key={c}>{c}</option>
                )}
              </select>

              <label>Cover image URL <span>(optional)</span></label>
              <input placeholder="https://example.com/image.jpg"
                value={form.cover}
                onChange={e => setForm({ ...form, cover: e.target.value })} />

              <label>Your story</label>
              <textarea required rows={9}
                placeholder="Once upon a time..."
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })} />

              <div className="modal-buttons">
                <button type="button" className="cancel-btn"
                  onClick={() => setEditorOpen(false)}>Cancel</button>
                <button type="submit" className="write-btn">
                  <PenLine size={17} />
                  {editingId ? "Save changes" : "Publish story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
