import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const faqs = [
    {
      id: "events",
      question: "How do I create a new event?",
      answer: "Navigate to the Events page from the main menu, then click the 'Create Event' button. Fill in the event details including name, date, location, and description. Click 'Create Event' to save."
    },
    {
      id: "volunteers",
      question: "How do I add volunteers to the system?",
      answer: "Go to the Volunteers page and click 'Add Volunteer'. Enter the volunteer's personal information, contact details, and any relevant skills or preferences. Save to add them to your volunteer database."
    },
    {
      id: "hours",
      question: "How do I track volunteer hours?",
      answer: "Visit the Hours page to view and manage volunteer time tracking. You can log hours for volunteers, view reports, and export data for record-keeping purposes."
    },
    {
      id: "notifications",
      question: "How do I send notifications?",
      answer: "Go to the Notifications page where you can create new notifications. Choose whether to send to everyone or specific volunteers, write your message, and click send."
    },
    {
      id: "resources",
      question: "How do I upload and manage resources?",
      answer: "Access the Resources page to upload files, documents, and materials that volunteers can access. Click 'Upload Resource' and select your files to share with your team."
    },
    {
      id: "theme",
      question: "How do I change the theme?",
      answer: "Go to Settings > Appearance to switch between light, dark, or system theme. Your preference will be saved automatically and applied throughout the application."
    },
    {
      id: "profile",
      question: "How do I update my profile?",
      answer: "Click on your profile picture or name in the navigation, then select 'Profile'. Here you can update your personal information, contact details, and account settings."
    }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Open FAQ"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Find answers to common questions about using the volunteer management system.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Need more help? Contact support or check the documentation for detailed guides.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FAQWidget;