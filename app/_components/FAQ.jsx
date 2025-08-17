'use client'
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => {
      // Close all items first, then open the clicked one if it was closed
      const newOpenItems = {};
      if (!prev[index]) {
        newOpenItems[index] = true;
      }
      return newOpenItems;
    });
  };

  const faqs = [
    {
      question: "How do I book a service professional?",
      answer: "Simply browse our services, select the one you need, fill out the request form with your requirements, and we'll connect you with qualified professionals in your area."
    },
    {
      question: "Are all professionals verified?",
      answer: "Yes, all our professionals go through a thorough verification process including background checks, skill assessments, and customer reviews to ensure quality service."
    },
    {
      question: "How do I become a service professional on Skill Trade?",
      answer: "Register as a professional, complete your profile with skills and certifications, pass our verification process, and start receiving service requests from customers."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours and we'll work to resolve the issue or provide a refund."
    },
    {
      question: "How are service rates determined?",
      answer: "Service rates are set by professionals based on their expertise, market standards, and service complexity. You can view rates upfront and choose professionals within your budget."
    },
    {
      question: "Is there customer support available?",
      answer: "Yes, our customer support team is available 24/7 through chat, email, and phone to assist with any questions or issues you may have."
    },
    {
      question: "Can I schedule services for a specific time?",
      answer: "Absolutely! You can specify your preferred date and time when booking, and we'll match you with professionals available during that time slot."
    }
  ];

  return (
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our platform, services, and how to get the most out of Skill Trade.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Illustration Section */}
          <div className="order-2 md:order-1 hidden md:block">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col justify-center items-center">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gray-400 rounded-full opacity-15"></div>
              
              {/* Svg Image */}
              <div className="flex-1 flex items-center justify-center">
                <Image
                  src="/faq.svg"
                  alt="FAQ illustration showing customer support and help"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg max-w-md"
                  priority
                />
              </div>
              
              {/* Simple badge without contact info */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Link href="/contact-us" className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">
                        Get Help & Support
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Items Section */}
          <div className="order-1 md:order-2">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className={`w-full px-6 py-5 text-left cursor-pointer transition-all duration-200 hover:bg-gray-300 ${openItems[index] ? 'bg-gray-300' : 'bg-white'}`}
                    aria-expanded={openItems[index]}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-base md:text-lg font-semibold pr-4 leading-tight transition-colors duration-200 text-gray-900">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 ml-2">
                        <div className={`transform transition-all duration-200 ${openItems[index] ? 'rotate-180 text-gray-700' : 'rotate-0 text-gray-600'}`}>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openItems[index] ? 'max-h-96 opacity-100 bg-white' : 'max-h-0 opacity-0'
                  }`}>
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 pb-5"
                    >
                      <p className="text-gray-700 text-sm md:text-base mt-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default FAQ;