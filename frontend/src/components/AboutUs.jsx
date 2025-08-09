import React from "react";
import { motion } from "framer-motion";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
});

const AboutUs = () => {
  return (
    <motion.div
      className="w-full max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <motion.div
        className="absolute w-[360px] h-[460px] rounded-3xl ring-4 ring-purple-600 animate-spin-slow blur-md opacity-30 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
       />

      <motion.h2
        className="text-3xl font-bold mb-4 text-center text-gray-800"
       initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        📘 About Us
      </motion.h2>

      <motion.p
        className="text-center text-gray-600 mb-6"
        variants={fadeIn(0.1)}
      >
        Learn more about MiniDiary and the vision behind it.
      </motion.p>

      <motion.div
        className="text-gray-700 space-y-4 leading-relaxed text-justify text-sm"
        variants={fadeIn(0.2)}
      >
        <p>
          <strong>MiniDiary</strong> is a simple yet powerful note-taking app crafted to help you document your life, ideas, and moments easily.
        </p>

        <p>
          Designed with minimalism in mind, it allows you to focus on writing — without distraction. We emphasize privacy and control, ensuring your notes remain yours.
        </p>

        <p>
          Built using modern tools like React, Node.js, and MongoDB, MiniDiary combines performance with elegance.
        </p>

        <p>
          Whether you're a student, developer, or dreamer — we’re happy you're here 💙.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;