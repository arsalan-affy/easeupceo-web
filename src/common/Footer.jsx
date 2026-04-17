import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  PhoneCall,
  MapPin,
  Home,
  Info,
  Newspaper,
  DollarSign,
  Phone,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">
            AUM Securities
          </h4>
          <p className="text-sm">
            Building digital solutions with precision and performance.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Home size={16} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Info size={16} /> About
              </Link>
            </li>
            {/* <li><Link to="/blogs" className="flex items-center gap-2 hover:text-primary"><Newspaper size={16} /> Blogs</Link></li> */}
            <li>
              <Link
                to="/pricing"
                className="flex items-center gap-2 hover:text-primary"
              >
                <DollarSign size={16} /> Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone size={16} /> Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/privacy-policy"
                className="flex items-center gap-2 hover:text-primary"
              >
                <ShieldCheck size={16} /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-and-conditions"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FileText size={16} /> Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Contact Us
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> info@worklynx.io
            </li>
            {/* <li className="flex items-center gap-2">
              <PhoneCall size={16} /> +91-7772886808
            </li> */}
            {/* <li className="flex items-center gap-2">
              <MapPin size={16} /> Remote Office, India
            </li> */}
          </ul>
        </div>
      </div>

      <div className="bg-primary text-background text-center py-3 text-xs font-medium">
        © {new Date().getFullYear()} Worklynx. All rights reserved.
      </div>
    </footer>
  );
}
