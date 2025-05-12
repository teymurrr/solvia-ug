import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const LearningSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-8 text-center">
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
            Solvia Learning
          </h2>
          <p className="text-[20px] text-gray-600">
            Expand your knowledge and skills with our specialized healthcare courses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2">Course 1</h3>
            <p className="text-gray-600">Description of course 1.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2">Course 2</h3>
            <p className="text-gray-600">Description of course 2.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2">Course 3</h3>
            <p className="text-gray-600">Description of course 3.</p>
          </div>
           <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2">Course 4</h3>
            <p className="text-gray-600">Description of course 4.</p>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
            <Link to="/learning" className="flex items-center">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
