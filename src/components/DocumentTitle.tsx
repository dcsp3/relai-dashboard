import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/auth": "Authentication",
  "/profile": "Profile",
  "/limits": "Limits",
  "/community": "Community",
  "/rewards": "Rewards",
};

const DocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = routeTitles[location.pathname] || "Page Not Found";
    document.title = `RelAI - ${pageName}`;
  }, [location.pathname]);

  return null;
};

export default DocumentTitle;


