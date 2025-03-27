
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 sm:px-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Document Language Translator
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
