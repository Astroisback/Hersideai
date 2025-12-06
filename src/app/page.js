"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShoppingBag, Star, Users, Store, Languages,
  Shield, TrendingUp, MessageCircle, DollarSign, Zap, Heart,
  CheckCircle, Lock, Search, Smartphone
} from "lucide-react";

export default function Home() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md shadow-pink-200">
              <Image
                src="/logo.jpeg"
                alt="HERSideHustle Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              HERSideHustle
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-pink-600 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-pink-600 transition-colors">AI Features</a>
            <a href="#impact" className="hover:text-pink-600 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(prev => prev === "en" ? "hi" : "en")}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <Languages size={16} />
              {language === "en" ? "English" : "हिंदी"}
            </button>
            <Link
              href="/seller/login"
              className="text-sm font-bold text-pink-600 hover:text-pink-700 px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/seller/plans"
              className="px-5 py-2.5 bg-pink-600 text-white rounded-full font-bold text-sm hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 hover:shadow-xl"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* 1. Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[100px]" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-pink-200/30 blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-600">#1 Platform for Women Entrepreneurs</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight max-w-5xl mx-auto">
              Empowering Home-Based <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
                Women Entrepreneurs
              </span> <br />
              with AI & Safety.
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Turn your skills into a thriving business. We provide the tools, safety, and visibility you need to succeed from home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/customer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg border border-gray-200 hover:border-pink-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Register as Customer
              </Link>
              <Link
                href="/seller/plans"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-pink-200 transition-all flex items-center justify-center gap-2"
              >
                Register as Entrepreneur
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Problems We Solve */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why HERSideHustle?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We address the core challenges faced by home-based women entrepreneurs.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <Search className="text-blue-600" size={32} />, title: "Limited Digital Presence", desc: "We give you a professional online store in minutes." },
                { icon: <Shield className="text-green-600" size={32} />, title: "Safety Concerns", desc: "Verified profiles and secure communication channels." },
                { icon: <Zap className="text-yellow-600" size={32} />, title: "Lack of Tools", desc: "AI-powered tools for pricing, marketing, and management." },
                { icon: <Users className="text-purple-600" size={32} />, title: "Low Visibility", desc: "Connect directly with customers in your locality." }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-pink-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. How it Works */}
        <section id="how-it-works" className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-400">Start your journey in 4 simple steps</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-30"></div>

              {[
                { step: "01", title: "Register Skill", desc: "Sign up and tell us what you do best." },
                { step: "02", title: "List Offering", desc: "Create your service or product catalog." },
                { step: "03", title: "Receive Orders", desc: "Get bookings from nearby customers." },
                { step: "04", title: "Earn Money", desc: "Get paid securely and grow your savings." }
              ].map((item, idx) => (
                <div key={idx} className="relative text-center group">
                  <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Top Categories */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Top Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Cooking", "Tailoring", "Beauty Services", "Tutors", "Home Bakery", "Handmade Crafts"].map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700 transition-all cursor-pointer group">
                  <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Star size={20} className="text-yellow-500" />
                  </div>
                  <span className="font-medium">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. AI Assistance Preview */}
        <section id="features" className="py-24 bg-gradient-to-b from-purple-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6">
                  <Zap size={16} />
                  AI-Powered Success
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Smart Tools to Grow Your Business</h2>
                <p className="text-xl text-gray-600 mb-8">
                  You don't need to be a tech expert. Our AI handles the hard work so you can focus on your craft.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Auto Replies", desc: "Never miss a customer with smart automated responses." },
                    { title: "Smart Pricing", desc: "Get AI suggestions for competitive pricing." },
                    { title: "Caption Generator", desc: "Create engaging social media posts instantly." },
                    { title: "Analytics", desc: "Understand your growth with simple charts." }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 text-purple-600">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{feature.title}</h4>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-3xl opacity-30"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                  {/* Mock UI for AI */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">AI Assistant</p>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl rounded-tl-none">
                      <p className="text-sm text-gray-600">
                        👋 Hi! I noticed your "Homemade Pickles" are getting lots of views.
                        <br /><br />
                        <strong>Suggestion:</strong> Try offering a 10% discount on bulk orders to increase sales!
                      </p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-xl rounded-tr-none ml-auto max-w-[80%]">
                      <p className="text-sm text-pink-700 font-medium">
                        That sounds great! Apply the discount.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Impact Section */}
        <section id="impact" className="py-24 bg-pink-600 text-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">Empowering 90M+ Skilled Women in India</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-5xl font-extrabold mb-2">₹10k+</div>
                <p className="text-pink-100 text-lg">Avg. Monthly Earnings</p>
              </div>
              <div>
                <div className="text-5xl font-extrabold mb-2">50+</div>
                <p className="text-pink-100 text-lg">Cities Covered</p>
              </div>
              <div>
                <div className="text-5xl font-extrabold mb-2">100%</div>
                <p className="text-pink-100 text-lg">Secure Payments</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Why Trust Us */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Why Trust Us?</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <CheckCircle size={32} />, title: "Verified Profiles", color: "text-blue-600" },
                { icon: <Lock size={32} />, title: "Secure Payments", color: "text-green-600" },
                { icon: <MessageCircle size={32} />, title: "Encrypted Chat", color: "text-purple-600" },
                { icon: <Star size={32} />, title: "Real Reviews", color: "text-yellow-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
