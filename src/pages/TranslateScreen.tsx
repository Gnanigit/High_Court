import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranslateSingle from "@/components/TranslateSingle";
import TranslateMultiple from "@/components/TranslateMultiple";

const TranslateScreen = ({ type }) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="sticky top-0 left-0 right-0 z-10 ">
        <Header />
      </div>

      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto p-6">
          {type === "single" ? <TranslateSingle /> : <TranslateMultiple />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TranslateScreen;
