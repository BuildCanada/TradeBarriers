"use client";

import { useEffect } from 'react';

export default function AutoHideScrollbar() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Add scrolling class
      document.documentElement.classList.add('scrolling');
      document.body.classList.add('scrolling');
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Remove scrolling class after 1 second of no scrolling
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('scrolling');
        document.body.classList.remove('scrolling');
      }, 1000);
    };

    const handleMouseMove = () => {
      // Show scrollbar on mouse movement near the edge
      document.documentElement.classList.add('mouse-active');
      document.body.classList.add('mouse-active');
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('mouse-active');
        document.body.classList.remove('mouse-active');
      }, 2000);
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null; // This component doesn't render anything
}
