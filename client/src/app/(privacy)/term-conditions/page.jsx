"use client";
import Footer from "@/app/_components/Footer";
import undraw_terms from "@/public/undraw_terms_sx63.svg";
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
const termsSections = [
  {
    title: "Acceptance of Terms",
    content: `Welcome to Skill Trade! These Terms and Conditions ("Terms") govern your use of our website https://skilltrade.com and the services provided by Skill Trade ("we", "us", or "our"). By accessing or using our platform, you agree to comply with and be bound by these Terms & Conditions and our Privacy Policy. Please review these documents carefully before using our services. If you do not agree to these terms, you should not use Skill Trade.`,
    links: [
      { text: "https://skilltrade.com", url: "https://skill-trade-next-15.vercel.app" }
    ]
  },
  {
    title: "Who Can Use Our Platform",
    content: `You must be at least 18 years old and capable of forming legally binding contracts to use the platform. By registering an account, you represent and warrant that you meet these eligibility requirements.`,
  },
  {
    title: "Your Account & Security",
    content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately if you suspect unauthorized access or use of your account.`,
  },
  {
    title: "Community Guidelines",
    content: `All users must behave respectfully toward each other. Harassment, discrimination, fraudulent activity, or any unlawful behavior is strictly prohibited. Skill Trade reserves the right to suspend or terminate accounts engaging in such activities.`,
  },
  {
    title: "Your Responsibilities",
    content: `You are responsible for providing accurate, current, and complete information at all times. You agree not to misuse the platform, not to engage in harmful or illegal behavior, and to follow all applicable laws and regulations.`,
  },
  {
    title: "Booking Cancellations & Refunds",
    content: `Our cancellation and refund policies are outlined during the booking process and in our Refund Policy. Users are encouraged to read these carefully prior to confirming any booking.`,
    links: [
      { text: "Refund Policy", url: "/refund-policy" }
    ]
  },
  {
    title: "Platform Safety & Liability",
    content: `To the fullest extent permitted by law, Skill Trade will not be liable for any damages or losses, including direct, indirect, or incidental damages, arising from your use of the platform or services provided by third parties.`,
  }
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
      <p className="text-gray-700 text-xl leading-relaxed text-justify">
        {renderContentWithLinks(section.content, section.links)}
      </p>
    </div>
  );
}

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200 py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-xl px-2 py-8 p-8">
          {/* Header Section with Interactive SVGs */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <div className="mb-6">
              <div className="relative group">
                <Image 
                  src={undraw_terms} 
                  alt="Terms and Conditions Illustration"
                  className="mx-auto max-w-40 md:max-w-64 h-auto transition-all duration-500 hover:scale-105 filter hover:brightness-110 animate-float"
                />
              </div>
            </div>

            <p className="text-gray-600 px-4 text-lg">
              Please read our Terms & Conditions carefully before using Skill Trade.
            </p>
            {/* Shield and Scale SVG for legal emphasis - Homepage color scheme */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.5V11.5H13.5V10.5C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
              
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z" />
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="prose prose-lg max-w-none">
            {termsSections.map((section, index) => (
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