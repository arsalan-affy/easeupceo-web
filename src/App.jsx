import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MarketingLayout from "./marketing/layouts/MarketingLayout";

const HomePage = lazy(() => import("./marketing/pages/HomePage"));
const FeaturesPage = lazy(() => import("./marketing/pages/FeaturesPage"));
const PricingPage = lazy(() => import("./marketing/pages/PricingPage"));
const AboutPage = lazy(() => import("./marketing/pages/AboutPage"));
const ContactPage = lazy(() => import("./marketing/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./marketing/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./marketing/pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("./marketing/pages/CookiePolicyPage"));
const GDPRPage = lazy(() => import("./marketing/pages/GDPRPage"));

const LiveOrderLayout = lazy(() => import("./live-order/LiveOrderLayout"));
const CategoriesPage = lazy(() => import("./live-order/pages/CategoriesPage"));
const ProductsPage = lazy(() => import("./live-order/pages/ProductsPage"));
const SearchPage = lazy(() => import("./live-order/pages/SearchPage"));
const ThankYouPage = lazy(() => import("./live-order/pages/ThankYouPage"));

const Fallback = () => <div className="h-screen" />;

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
          <Route path="/" element={<Suspense fallback={<Fallback />}><HomePage /></Suspense>} />
          <Route path="/features" element={<Suspense fallback={<Fallback />}><FeaturesPage /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<Fallback />}><PricingPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<Fallback />}><AboutPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<Fallback />}><ContactPage /></Suspense>} />
          <Route path="/privacy-policy" element={<Suspense fallback={<Fallback />}><PrivacyPolicyPage /></Suspense>} />
          <Route path="/terms-of-service" element={<Suspense fallback={<Fallback />}><TermsOfServicePage /></Suspense>} />
          <Route path="/cookie-policy" element={<Suspense fallback={<Fallback />}><CookiePolicyPage /></Suspense>} />
          <Route path="/gdpr" element={<Suspense fallback={<Fallback />}><GDPRPage /></Suspense>} />
        </Route>

        {/* Live Order Routes (customer-facing, no marketing layout) */}
        <Route path="/live-order" element={<Suspense fallback={<Fallback />}><LiveOrderLayout /></Suspense>}>
          <Route index element={<Suspense fallback={<Fallback />}><CategoriesPage /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Fallback />}><ProductsPage /></Suspense>} />
          <Route path="search" element={<Suspense fallback={<Fallback />}><SearchPage /></Suspense>} />
          <Route path="thank-you" element={<Suspense fallback={<Fallback />}><ThankYouPage /></Suspense>} />
          <Route path="*" element={<Navigate to="/live-order" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
