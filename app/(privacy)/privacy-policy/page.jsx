"use client";

import Footer from "@/app/_components/Footer";
import undraw_personal from "@/public/undraw_personal-information.svg";
import Image from "next/image";

// Custom animations with website color palette
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const privacySections = [
  {
    title: "Information We Collect",
    content: `We collect personal information you provide during registration, booking, and communication with professionals, including your name, contact details, payment information, and service history. We may also collect technical information such as IP address, device details, and cookies to improve your experience on https://skilltrade.com.`,
    links: [
      { text: "https://skilltrade.com", url: "https://skill-trade-next-15.vercel.app" }
    ]
  },
  {
    title: "How We Use Your Information",
    content: `We use your information to facilitate smooth service delivery, process payments, verify users and professionals, personalize your experience, improve our platform, and ensure compliance with our Terms & Conditions and policies.`,
    links: [
      { text: "Terms & Conditions", url: "/term-conditions" }
    ]
  },
  {
    title: "Data Security",
    content: `We employ industry-standard security measures to protect your personal data. However, please be aware that no method of internet transmission or electronic storage is 100% secure. For any security concerns, please contact us immediately.`,
  },
  {
    title: "Sharing of Information",
    content: `We do not sell your personal information to third parties. We may share your information with service providers and third parties only as necessary to fulfill your requests, protect our users, comply with the law, or in connection with a business transfer (such as a merger or acquisition).`,
  },
  {
    title: "Cookies Policy",
    content: `Our website uses cookies and similar technologies to enhance your experience, remember preferences, and analyze usage. You can manage your cookie preferences in your browser settings. For more detail, please review our Cookies Policy.`,
    links: [
      { text: "Cookies Policy", url: "/cookies-policy" }
    ]
  },
  {
    title: "Data Retention",
    content: `We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, and enforce our agreements. This policy aligns with our Terms & Conditions regarding data handling.`,
    links: [
      { text: "Terms & Conditions", url: "/term-conditions" }
    ]
  },
  {
    title: "Your Rights",
    content: `You have the right to access, correct, update, or request deletion of your personal data. You may also object to certain processing or request data portability where applicable. For requests, please Contact Us using the details provided on our website.`,
    links: [
      { text: "Contact Us", url: "/contact-us" }
    ]
  },
  {
    title: "Changes to this Privacy Policy",
    content: `We may update this Privacy Policy from time to time. We encourage you to review this policy periodically. Your continued use of Skill Trade after changes indicates your acceptance of the updated policy.`,
  },
];


// Helper function to render content with links
function renderContentWithLinks(content, links) {
  if (!links || links.length === 0) {
    return content;
  }

  let processedContent = content;
  links.forEach(link => {
    processedContent = processedContent.replace(
      link.text,
      `<a href="${link.url}" class="text-black hover:text-gray-600 font-medium border-b border-gray-500 hover:border-gray-500 transition-colors duration-200">${link.text}</a>`
    );
  });

  return <span dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

function Section({ section }) {
  return (
    <div className="mb-10 pb-6 border-b border-gray-100 last:border-b-0">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        {section.title}
      </h3>
      <p className="text-gray-700 text-xl leading-relaxed text-justify md:text-left">
        {renderContentWithLinks(section.content, section.links)}
      </p>
    </div>
  );
}

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200 py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-xl px-2 py-8 md:p-8 lg:p-12">
          {/* Header Section with Interactive SVGs */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <div className="mb-6">
              <div className="relative group">
                <Image 
                  src={undraw_personal} 
                  alt="Privacy Policy Illustration"
                  className="mx-auto max-w-40 md:max-w-64 h-auto transition-all duration-500 hover:scale-105 filter hover:brightness-110 animate-float"
                />

              </div>
            </div>

            <p className="text-gray-600 px-4 text-lg">
              Please read our Privacy Policy carefully before using Skill Trade.
            </p>
            {/* Shield and Eye SVG for privacy emphasis - Homepage color scheme */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" />
              </svg>
              
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="prose prose-lg max-w-none">
            {privacySections.map((section, index) => (
              <Section key={index} section={section} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;