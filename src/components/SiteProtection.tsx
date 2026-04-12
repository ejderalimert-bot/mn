"use client";

import { useEffect } from 'react';

export default function SiteProtection() {
  useEffect(() => {
    // Sağ tık menüsünü engelle
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Geliştirici araçlarını ve tehlikeli kısayolları engelle
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
      }
    };

    // Tarayıcıdaki IDM ve Harici eklentilerin element seçmesini zorlaştır
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    // Sayfa üzerindeki tüm video elementlerine özel nitelikler ekle (DOM mutation observer kullanarak)
    const observer = new MutationObserver((mutations) => {
       mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
             if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                const mediaNode = node as HTMLMediaElement;
                mediaNode.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");
                mediaNode.setAttribute("disablePictureInPicture", "true");
                mediaNode.oncontextmenu = (e) => e.preventDefault();
             }
          });
       });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      observer.disconnect();
    };
  }, []);

  return null;
}
