import { Wrench, Zap, Shield, Clock, Hammer } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        
        <div className="flex justify-start mb-8">
          <img
            src="/icons/faddedsmsLogo.svg"
            alt="FaddedSMS Logo"
            className="h-7 w-auto"
          />
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-[#5DEBD7]">
              <Hammer className="w-12 h-12 text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a] text-balance">
            We're Making Things Better
          </h1>
          <p className="text-lg mb-2 text-black text-balance">
            Our site is currently undergoing maintenance
          </p>
          <p className="text-base text-[#666666] text-balance">
            We're working hard to improve your experience. We'll be back online shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Zap, title: "Performance", text: "Optimizing speed and reliability for you" },
            { icon: Shield, title: "Security", text: "Enhancing protection for your data" },
            { icon: Clock, title: "Coming Soon", text: "New features and improvements await" },
            { icon: Wrench, title: "Better UX", text: "Crafting a smoother user experience" },
          ].map((item, index) => (
            <div
              key={index}
              className="border-2 border-[#E5FFCF] rounded-xl p-6 bg-[#fafaf9] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg border border-[#A2E29B] bg-[#E5FFCF] flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#1a1a1a]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm text-[#666666]">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 text-center border-2 bg-[#E5FFCF] border-[#E5FFCF]">
          <h2 className="text-2xl font-semibold mb-3 text-[#1a1a1a]">
            Thank You for Your Patience
          </h2>
          <p className="mb-6 text-[#4a7c3c] text-balance">
            We appreciate your understanding as we work to deliver an even better experience. Check back soon!
          </p>
        </div>

        <div className="mt-12 text-center text-sm text-[#999999]">
          <p>Last updated: {new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </div>
    </main>
  );
}
