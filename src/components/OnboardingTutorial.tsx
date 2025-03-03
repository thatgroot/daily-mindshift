
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Info, Lightbulb, BarChart, Calendar as CalendarIcon, Settings2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const OnboardingTutorial = () => {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const steps: Step[] = [
    {
      title: "Welcome to Daily Routines",
      description: "Track your habits, build consistency, and achieve your goals with our intelligent habit tracking app.",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
    },
    {
      title: "Create Your Habits",
      description: "Start by creating habits you want to track. Customize them with categories, colors, and frequency.",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: "Track Your Progress",
      description: "Mark habits as complete each day to build streaks and see your consistency over time.",
      icon: <Check className="h-8 w-8 text-primary" />,
    },
    {
      title: "Review Analytics",
      description: "Explore detailed analytics to understand your progress and identify areas for improvement.",
      icon: <BarChart className="h-8 w-8 text-primary" />,
    },
    {
      title: "Calendar View",
      description: "See your habits organized by date and track your completion patterns over time.",
      icon: <CalendarIcon className="h-8 w-8 text-primary" />,
    },
    {
      title: "Personalize Settings",
      description: "Customize the app to fit your needs, including dark mode, notifications, and more.",
      icon: <Settings2 className="h-8 w-8 text-primary" />,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    setOpen(false);
    localStorage.setItem('onboardingCompleted', 'true');
    toast({
      title: "Onboarding Completed",
      description: "You're all set! Start tracking your first habit.",
    });
  };

  const skipOnboarding = () => {
    setOpen(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  // If user already completed onboarding, don't show it again
  if (localStorage.getItem('onboardingCompleted') === 'true') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-xl text-center">{steps[currentStep].title}</DialogTitle>
          <DialogDescription className="text-center py-4">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {currentStep > 0 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={skipOnboarding}>
                Skip
              </Button>
            )}
          </div>
          <Button onClick={nextStep} className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;
