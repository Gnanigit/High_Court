import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Translate from "@/components/Translate";

const TranslateScreen = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Translate />
      <Footer />
    </div>
  );
};

export default TranslateScreen;
