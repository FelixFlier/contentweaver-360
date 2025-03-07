
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Only access window if it exists (client-side)
    if (typeof window !== "undefined") {
      // Check if device has touch capability for better mobile detection
      const hasTouchCapability = 'ontouchstart' in window || 
                                 navigator.maxTouchPoints > 0 ||
                                 (navigator as any).msMaxTouchPoints > 0;
                                 
      // First check width, then fall back to touch capability
      return window.innerWidth < MOBILE_BREAKPOINT || 
             (window.innerWidth < 1024 && hasTouchCapability);
    }
    return false; // Default for server-side rendering
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth;
      const hasTouchCapability = 'ontouchstart' in window || 
                                 navigator.maxTouchPoints > 0 ||
                                 (navigator as any).msMaxTouchPoints > 0;
      
      // Consider both screen width and touch capability
      setIsMobile(width < MOBILE_BREAKPOINT || (width < 1024 && hasTouchCapability));
    }

    // Add event listener with passive option for better performance
    window.addEventListener("resize", handleResize, { passive: true });
    
    // Check on initial render to ensure accurate initial state
    handleResize();
    
    // Also check on orientation change for mobile devices
    window.addEventListener("orientationchange", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    }
  }, [])

  return isMobile
}
