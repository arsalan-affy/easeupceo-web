import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MarketingLayout from "./marketing/layouts/MarketingLayout";

// Lazy load marketing pages
const HomePage = lazy(() => import("./marketing/pages/HomePage"));
const FeaturesPage = lazy(() => import("./marketing/pages/FeaturesPage"));
const PricingPage = lazy(() => import("./marketing/pages/PricingPage"));
const HowItWorksPage = lazy(() => import("./marketing/pages/HowItWorksPage"));
const AboutPage = lazy(() => import("./marketing/pages/AboutPage"));
const ContactPage = lazy(() => import("./marketing/pages/ContactPage"));
const BlogPage = lazy(() => import("./marketing/pages/BlogPage"));

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontWeight: 500,
          },
        }}
      />
      <Routes>
        {/* Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/features"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <FeaturesPage />
              </Suspense>
            }
          />
          <Route
            path="/pricing"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <PricingPage />
              </Suspense>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <HowItWorksPage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<div className="h-screen" />}>
                <BlogPage />
              </Suspense>
            }
          />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
