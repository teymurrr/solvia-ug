import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, GraduationCap, Globe, CheckCircle, Star, Users, Clock, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSectionRedesigned = () => {
  const { t } = useLanguage();

  const courses = [
    {
      title: "Medical German A1-C1",
      description: "Complete German language courses specifically designed for healthcare professionals",
      features: ["Medical vocabulary focus", "Interactive lessons", "Native speaker instructors"],
      duration: "6-12 months",
      students: "2,500+",
      rating: 4.9,
      highlight: "Most Popular",
      icon: Globe,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "FSP Exam Preparation",
      description: "Intensive preparation for the Fachsprachprüfung with proven success methods",
      features: ["Mock exams", "1-on-1 coaching", "95% pass rate"],
      duration: "3-6 months",
      students: "1,200+",
      rating: 4.8,
      highlight: "Best Results",
      icon: Award,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Advance Your Career</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t?.learning?.title || "Solvia Learning"}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t?.learning?.subtitle || "Master Medical German and pass your FSP exam with our specialized courses designed by healthcare professionals, for healthcare professionals."}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          {courses.map((course, index) => {
            const IconComponent = course.icon;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Highlight badge */}
                {course.highlight && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className={`bg-gradient-to-r ${course.color} text-white border-0`}>
                      <Star className="h-3 w-3 mr-1" />
                      {course.highlight}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} {t?.learning?.students || "students"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    asChild
                  >
                    <Link to="/learning" className="flex items-center justify-center gap-2">
                      {t?.learning?.exploreCourses || "Learn More"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-6 p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg max-w-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{t?.learning?.startLearningJourney || "Start Your Learning Journey Today"}</h3>
              <p className="text-muted-foreground">{t?.learning?.joinProfessionals || "Join over 3,700 healthcare professionals who chose Solvia Learning"}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button size="lg" asChild className="group flex-1">
                <Link to="/learning" className="flex items-center justify-center gap-2">
                  {t?.learning?.exploreAllCourses || "Explore All Courses"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link to="/contact">
                  {t?.learning?.getFreeConsultation || "Get Free Consultation"}
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/50 w-full justify-center">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-background"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-background"></div>
                </div>
                <span>3,700+ {t?.learning?.students || "students"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 {t?.learning?.rating || "rating"}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>95% {t?.learning?.passRate || "pass rate"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSectionRedesigned;