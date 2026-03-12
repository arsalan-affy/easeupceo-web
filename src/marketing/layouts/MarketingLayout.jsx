import { Outlet } from "react-router-dom";
import MarketingNavbar from "../components/navbar/MarketingNavbar";
import MarketingFooter from "../components/footer/MarketingFooter";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
