import React, { useState, useEffect } from "react";
import "./exploreMenu.css";
import { menu_list } from "../../assets/assets";
import { motion } from "framer-motion"; // If you have framer-motion installed

const ExploreMenu = ({ category, setCategory }) => {
  // Animation for when items appear
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // If you don't have framer-motion, remove the motion components and use regular divs

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>

      {category !== "All" && (
        <div className="category-indicator">Currently viewing: {category}</div>
      )}

      <motion.div
        className="explore-menu-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {menu_list.map((item, index) => {
          return (
            <motion.div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
              variants={itemVariants}
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </motion.div>
          );
        })}
      </motion.div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
