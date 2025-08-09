import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaFacebook, FaInstagram, FaGithub, FaLinkedin, 
  FaEnvelope, FaPhone, FaMapMarkerAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const socalMedia=[
  { icon: FaFacebook, link: "https://www.facebook.com/share/1CVFDD79mG/", color: "hover:bg-blue-500" },
  { icon: FaInstagram, link: "https://www.instagram.com/shiba_m57?igsh=NGNjcmN4ZjhwYTRp", color: "hover:bg-pink-500" },
  { icon: FaGithub, link: "https://github.com", color: "hover:bg-gray-500" },
  { icon: FaLinkedin, link: "https://www.linkedin.com/in/shibam-samanta-765698292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", color: "hover:bg-blue-400" }
]

function AnimatedFooter() {

  const userInfo = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const goToProfile=(e)=>{
    e.preventDefault();
    if(!userInfo){
      navigate('/login');
      return;
    }
    navigate("/profile",{ state: {userInfo} })
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 pt-12 mt-10"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
 
        <div>
          <h2 className="text-3xl font-bold mb-3 text-white italic">
            notes.<span className="text-blue-400 italic">life</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            A simple yet powerful platform to store, organize, and search your notes. 
            Boost productivity with ease — anytime, anywhere.
          </p>
          <p className="text-xs text-gray-500">
            Built with ❤️ using React, Node.js, and MongoDB.
          </p>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-400 italic">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">🏠 Home</Link></li>
            <li><Link to="/profile" onClick={goToProfile} className="hover:text-white transition-colors">👤 Profile</Link></li>
            <li><Link to="/about-us" className="hover:text-white transition-colors">ℹ️ About Us</Link></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-400 italic">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" /> support@noteslife.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-blue-400" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" /> Kolkata, India
            </li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-400 italic">Follow Us</h3>
          <div className="flex space-x-4">
            {socalMedia.map(({ icon: Icon, link, color }, index) => (
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                key={index}
                href={link}
                target="_blank"
                rel="noreferrer"
                className={`p-2 bg-gray-700 rounded-full transition-colors ${color}`}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

  
      <div className="mt-10 bg-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            📩 Subscribe to our newsletter for updates and tips!
          </p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 rounded-l-lg focus:outline-none text-black"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} notes.life — All rights reserved.
      </div>
    </motion.footer>
  );
}

export default AnimatedFooter;