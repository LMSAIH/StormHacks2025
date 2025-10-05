// Example usage of MapDLogo component

import MapDLogo from '../components/ui/MapDLogo';

// In your Navbar or Header:
<MapDLogo variant="full" size={40} />

// For just the icon (like in mobile view):
<MapDLogo variant="icon" size={32} />

// With custom styling:
<MapDLogo 
  variant="full" 
  size={48} 
  className="hover:opacity-80 transition-opacity cursor-pointer" 
/>

// In dark mode, you might want to invert colors:
<MapDLogo variant="icon" size={40} className="dark:invert" />
