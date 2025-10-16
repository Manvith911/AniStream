import { createPortal } from "react-dom";

const HoverCardPortal = ({ children }) => {
  const portalRoot = document.getElementById("hover-portal");
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
};

export default HoverCardPortal;
