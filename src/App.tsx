import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import CustomCursor from "./components/feature/CustomCursor";
import CursorParticles from "./components/feature/CursorParticles";
import PageTransitionCurtain from "./components/feature/PageTransitionCurtain";
import CommandPalette from "./components/feature/CommandPalette";
import { AnimatePresence, motion } from "framer-motion";

/** Inner shell — lives inside BrowserRouter so it can call useLocation */
function InnerApp() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18, delay: 0.05 } }}
          exit={{ opacity: 0, transition: { duration: 0.14 } }}
          style={{ minHeight: "100vh" }}
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>
      <PageTransitionCurtain />
      <CommandPalette />
    </>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <CursorParticles />
        <CustomCursor />
        <InnerApp />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;