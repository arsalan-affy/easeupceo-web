import { useEffect } from "react";
import { Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SectionHeader from "../components/shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "../components/shared/AnimatedSection";
import HomeCTA from "../components/home/HomeCTA";

const categories = ["All", "Payroll", "Attendance", "HR Tips", "Compliance", "Product Updates"];

const posts = [
  {
    title: "How to Automate PF and ESI Calculations in 2026",
    excerpt: "A step-by-step guide to setting up statutory deduction automation, ensuring 100% compliance with the latest EPFO and ESIC regulations.",
    category: "Compliance",
    author: "Ananya Bose",
    date: "Mar 8, 2026",
    readTime: "8 min read",
    gradient: "from-blue-500 to-indigo-600",
    featured: true,
  },
  {
    title: "Top 5 Mistakes Companies Make with Attendance Tracking",
    excerpt: "Manual attendance tracking leads to errors, buddy punching, and compliance risks. Learn the five most common pitfalls and how to avoid them.",
    category: "Attendance",
    author: "Priya Menon",
    date: "Mar 5, 2026",
    readTime: "6 min read",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    title: "The Complete Guide to Tax-Compliant Invoicing for Service Businesses",
    excerpt: "Everything you need to know about creating invoices that satisfy tax requirements, from tax breakdowns to digital signature compliance.",
    category: "Compliance",
    author: "Ananya Bose",
    date: "Feb 28, 2026",
    readTime: "10 min read",
    gradient: "from-violet-500 to-blue-600",
  },
  {
    title: "Why Businesses Are Moving to Cloud Management Platforms in 2026",
    excerpt: "The shift from desktop tools to cloud business platforms is accelerating. Here's what's driving the change and what to look for in a modern solution.",
    category: "Business Tips",
    author: "Arjun Kapoor",
    date: "Feb 20, 2026",
    readTime: "7 min read",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    title: "Worklynx Q1 2026 Product Updates: What's New",
    excerpt: "We shipped 23 new features this quarter. Highlights include AI-powered attrition prediction, bulk bank transfer integration, and the new mobile app.",
    category: "Product Updates",
    author: "Rahul Desai",
    date: "Feb 15, 2026",
    readTime: "5 min read",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Building a Fair Leave Policy: A Practical Guide for HR Managers",
    excerpt: "From casual leave to compensatory leave — a comprehensive template for building a leave policy that balances employee welfare with business continuity.",
    category: "HR Tips",
    author: "Sneha Iyer",
    date: "Feb 10, 2026",
    readTime: "9 min read",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    title: "Payroll Compliance Checklist for March 2026",
    excerpt: "As FY 2025-26 closes, here's your complete compliance checklist: Form 16, annual returns, and everything you need to close the financial year right.",
    category: "Payroll",
    author: "Ananya Bose",
    date: "Feb 5, 2026",
    readTime: "12 min read",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    title: "How to Reduce Employee Attrition: Data-Driven Strategies",
    excerpt: "Using HR analytics to identify at-risk employees before they quit. Actionable insights from our analysis of 50,000 employee records.",
    category: "HR Tips",
    author: "Vikash Sharma",
    date: "Jan 30, 2026",
    readTime: "8 min read",
    gradient: "from-blue-600 to-violet-600",
  },
];

function BlogCard({ post, large = false }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Cover */}
      <div className={`bg-gradient-to-br ${post.gradient} ${large ? "h-48" : "h-36"} flex items-center justify-center`}>
        <BookOpen className="w-10 h-10 text-white/60" />
      </div>
      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs font-semibold">{post.category}</Badge>
          {post.featured && (
            <Badge className="text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">Featured</Badge>
          )}
        </div>
        <h3 className={`font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors ${large ? "text-lg" : "text-base"}`}>
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogPage() {
  useEffect(() => {
    document.title = "Blog — Worklynx";
  }, []);

  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Knowledge Hub"
            heading={<>Insights for Modern <span className="text-gradient-brand">Business Leaders</span></>}
            subtext="Expert guides, compliance updates, and product news to help you stay ahead."
            className="mb-0"
          />
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-16 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  cat === "All"
                    ? "gradient-brand text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          <StaggerContainer className="mb-8">
            <StaggerItem>
              <div className="grid lg:grid-cols-2 gap-6">
                <BlogCard post={featured} large />
                <div className="grid sm:grid-cols-2 gap-4">
                  {rest.slice(0, 4).map((post) => (
                    <BlogCard key={post.title} post={post} />
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Rest of articles */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.slice(4).map((post) => (
              <StaggerItem key={post.title}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Load more placeholder */}
          <div className="text-center mt-12">
            <button className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 gradient-hero">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader
            eyebrow="Stay Updated"
            heading="Get Business Insights in Your Inbox"
            subtext="Weekly digest of business tips, product updates, and industry news. No spam, unsubscribe anytime."
          />
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@company.com"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-5 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  );
}
