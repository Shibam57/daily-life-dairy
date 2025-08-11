import React, { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSearchResults } from '../components/Search/FetchSearch';
import SearchBar from '../components/Search/SearchBar';
import { getCurrentUser } from '../components/Cards/userApi';
import image from '../assets/large.svg';
import NavProfile from '../components/Cards/NavProfile';
import { Menu, User, X } from 'lucide-react';
import axios from 'axios';

function Navbar({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onSearchResults([]);
      return;
    }
    const data = await fetchSearchResults(searchQuery);
    onSearchResults(data);
  };

  const onClearSearch = () => {
    setSearchQuery('');
    onSearchResults([]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserInfo(user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post('/api/v1/users/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 py-4 bg-gradient-to-br from-blue-500 via-fuchsia-500 to-purple-500 shadow-md w-full z-50">
      {/* Logo */}
      <div className="font-bold flex items-center">
        <Link to="/" className="flex items-center space-x-1">
          <img src={image} alt="notesLife" className="h-10 w-10" />
          <h2 className="flex items-end font-serif">
            <span className="text-slate-200 text-xl sm:text-xl italic">
              notes.
            </span>
            <span className="text-slate-900 text-sm sm:text-sm ml-1 italic font-extrabold">
              life
            </span>
          </h2>
        </Link>
      </div>

      {isLoggedIn && (
        <div className="hidden md:flex items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      )}

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white hover:text-yellow-300 transition ${isActive ? 'font-bold underline' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/add-note"
              className={({ isActive }) =>
                `text-white hover:text-yellow-300 transition ${isActive ? 'font-bold' : ''}`
              }
            >
              Add Note
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `text-white hover:text-yellow-300 transition ${isActive ? 'font-bold' : ''}`
              }
            >
              About Us
            </NavLink>

            <NavProfile userInfo={userInfo} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <Link to="/login">
              <motion.button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                Signup
              </motion.button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="flex md:hidden items-center gap-2">
    {isLoggedIn && (
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
    )}
    <button onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <X className="text-white" size={25} /> : <Menu className="text-white" size={25} />}
    </button>
  </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-gradient-to-br from-blue-500 via-fuchsia-500 to-purple-500 p-6 space-y-6 z-50 shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoggedIn && (
                <>
                  {/* Profile at top */}
                  <div className="mb-4">
                    <NavProfile userInfo={userInfo} onLogout={handleLogout} />
                  </div>
                </>
              )}

              {/* Links */}
              <div className="space-y-4">
                {isLoggedIn ? (
                  <>
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className="block text-white hover:text-yellow-300">
                      Home
                    </NavLink>
                    <NavLink to="/add-note" onClick={() => setMenuOpen(false)} className="block text-white hover:text-yellow-300">
                      Add Note
                    </NavLink>
                    <NavLink to="/about-us" onClick={() => setMenuOpen(false)} className="block text-white hover:text-yellow-300">
                      About Us
                    </NavLink>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <motion.button className="w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition mb-4">
                        Login
                      </motion.button>
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <motion.button className="w-full px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                        Signup
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;