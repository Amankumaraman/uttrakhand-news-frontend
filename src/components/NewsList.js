// src/components/NewsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NewsList.css';

const API_URL = 'https://uttrakhand-news-backend.onrender.com/api/fetch-news/';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        console.log("Fetched news:", res.data);
        setNews(res.data);
        setFilteredNews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news from backend:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = news;

    if (category) {
      filtered = filtered.filter(item =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [searchTerm, category, news]);

  const handleToggleTheme = () => {
    setAnimating(true);
    setTimeout(() => {
      setDarkMode(!darkMode);
      setAnimating(false);
    }, 500);
  };

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`news-container ${darkMode ? 'dark' : 'light'} ${animating ? 'fade-transition' : ''}`}>
      <div className="news-header">
        <h1>📰 Uttarakhand News</h1>
        <button onClick={handleToggleTheme} className="theme-toggle">
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="news-controls">
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Politics">Politics</option>
          <option value="Weather">Weather</option>
          <option value="Environment">Environment</option>
          <option value="Tourism">Tourism</option>
          <option value="Disaster">Disaster</option>
          <option value="General">General</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading news...</p>
      ) : paginatedNews.length === 0 ? (
        <p className="loading-text">No news available.</p>
      ) : (
        <div className="news-grid">
          {paginatedNews.map((item, index) => (
            <div key={index} className="news-card">
              <h2>{item.title}</h2>
              <p className="short-desc">{item.short_description || 'No short description'}</p>
              <p className="full-desc">{item.full_description || 'No full description'}</p>
              <p className="meta">{item.source || 'Unknown'} | {item.published_at ? new Date(item.published_at).toLocaleString() : 'N/A'}</p>
              <p className="meta"><strong>Category:</strong> {item.category || 'N/A'}</p>
              <a href={item.url} target="_blank" rel="noreferrer">🔗 Read Full Article</a>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
          ⬅ Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage * itemsPerPage >= filteredNews.length}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next ➡
        </button>
      </div>

      <div className="mobile-nav">
        <button onClick={() => setCategory('Politics')}>🗳️</button>
        <button onClick={() => setCategory('Weather')}>☀️</button>
        <button onClick={() => setCategory('Tourism')}>🏞️</button>
        <button onClick={handleToggleTheme}>{darkMode ? '🌞' : '🌙'}</button>
      </div>
    </div>
  );
};

export default NewsList;
