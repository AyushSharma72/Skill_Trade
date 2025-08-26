import MarqueeImages from "@/components/MarqeeImage2";
import CountUp from "@/components/ui/countUp";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Star,
  Heart,
  Shield,
  Globe,
  Award,
  TrendingUp,
  Clock,
  ThumbsUp,
  UserPlus,
  Search,
  Handshake,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from './../_components/Footer';

const Page = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Verified Professionals",
      description:
        "All our professionals are thoroughly vetted and verified for quality assurance",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with no hidden fees or surprises",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "24/7 Availability",
      description:
        "Round-the-clock booking and support whenever you need assistance",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: <Award className="w-8 h-8 text-orange-600" />,
      title: "Quality Guarantee",
      description:
        "We ensure top-notch service quality with our satisfaction guarantee",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Register an Account",
      description: "Create your profile as a user or professional",
      icon: <UserPlus className="w-10 h-10" />,
    },
    {
      step: "2",
      title: "Browse or Offer Services",
      description: "Find services you need or showcase your skills",
      icon: <Search className="w-10 h-10" />,
    },
    {
      step: "3",
      title: "Book or Get Hired",
      description: "Connect with professionals or clients seamlessly",
      icon: <Handshake className="w-10 h-10" />,
    },
    {
      step: "4",
      title: "Rate and Review",
      description: "Share your experience and build trust in our community",
      icon: <MessageSquare className="w-10 h-10" />,
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/demouserimage.jpg",
      bio: "Visionary leader with 10+ years in tech",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/demouserimage.jpg",
      bio: "Full-stack architect passionate about scalable solutions",
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "/demouserimage.jpg",
      bio: "UX/UI expert creating beautiful user experiences",
      social: { linkedin: "#", dribbble: "#" },
    },
    {
      name: "David Kumar",
      role: "Lead Developer",
      image: "/demouserimage.jpg",
      bio: "Senior developer with expertise in modern frameworks",
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "Lisa Wang",
      role: "Product Manager",
      image: "/demouserimage.jpg",
      bio: "Strategic product leader driving user-centric solutions",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "James Wilson",
      role: "Marketing Director",
      image: "/demouserimage.jpg",
      bio: "Growth expert with proven track record",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* Enhanced Hero Section - Matching Home Page Style */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 overflow-hidden">
        {/* Simplified background overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-4 pt-16 md:pt-0 text-center">
          {/* Professional badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8 shadow-xl border border-white/20">
            <Star className="w-5 h-5 mr-2 text-white" />
            Trusted by 5000+ Professionals Worldwide
          </div>

          {/* Main heading - Clean and Bold */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            About <span className="text-white">Skill Trade</span>
          </h1>

          {/* Decorative line */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-1 bg-white rounded-full"></div>
          </div>

          {/* Enhanced description */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Your trusted platform connecting skilled professionals with people
            seeking reliable home and business services. Building trust,
            delivering excellence, one service at a time.
          </p>
        </div>
      </div>

      {/* Who We Are Section - Matching Home Page Style */}
      <div className="py-10 md:py-24 bg-white relative overflow-hidden">
        {/* Simplified background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gray-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-200 rounded-full opacity-40"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-100 rounded-full opacity-25"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-sm font-bold mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Users className="w-5 h-5 mr-2" />
              Our Story
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Who We Are
            </h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering connections between skilled professionals and those who
              need their expertise
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Mission & Vision Cards */}
            <div className="space-y-8">
              {/* Mission Card */}
              <div className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:scale-105">
                {/* Icon */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 transition-colors duration-300">
                    Our Mission
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed transition-colors duration-300">
                    Skill Trade is a trusted platform connecting skilled
                    professionals with people seeking reliable home and business
                    services. We bridge the gap between talented professionals
                    and customers who need quality services.
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-300"></div>
              </div>

              {/* Vision Card */}
              <div className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:scale-105">
                {/* Icon */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 transition-colors duration-300">
                    Our Vision
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed transition-colors duration-300">
                    Founded with the vision of making professional services
                    accessible and reliable, we've grown into a community of
                    thousands of verified professionals and satisfied customers
                    across multiple service categories.
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-300"></div>
              </div>
            </div>

            {/* Stats Card - Matching Home Page Colors */}
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gray-900 rounded-3xl blur-xl opacity-10 scale-110"></div>

              {/* Main stats card */}
              <div className="relative bg-gray-900 p-10 rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Our Impact</h3>
                  <div className="w-16 h-1 bg-white/30 mx-auto rounded-full"></div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-8">
                  {[
                    {
                      number: "5000",
                      suffix: "+",
                      label: "Professionals",
                      icon: <Users className="w-6 h-6" />,
                    },
                    {
                      number: "10",
                      suffix: "K+",
                      label: "Jobs Done",
                      icon: <CheckCircle className="w-6 h-6" />,
                    },
                    {
                      number: "4.8",
                      suffix: "★",
                      label: "Rating",
                      icon: <Star className="w-6 h-6" />,
                    },
                    {
                      number: "50",
                      suffix: "+",
                      label: "Categories",
                      icon: <Award className="w-6 h-6" />,
                    },
                  ].map((stat, index) => (
                    <div key={index} className="group text-center relative">
                      {/* Stat icon */}
                      <div className="flex justify-center mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                          <div className="text-white group-hover:scale-110 transition-transform duration-300">
                            {stat.icon}
                          </div>
                        </div>
                      </div>

                      {/* Stat number */}
                      <div className="text-3xl lg:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                        <CountUp end={stat.number} duration={3} suffix={stat.suffix} />
                      </div>

                      {/* Stat label */}
                      <div className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                        {stat.label}
                      </div>

                      {/* Animated underline */}
                      <div className="mt-2 flex justify-center">
                        <div className="w-8 h-0.5 bg-white/30 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 rounded-3xl opacity-5">
                  <div className="absolute top-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/20 rounded-full"></div>
                  <div className="absolute top-1/2 right-8 w-8 h-8 border border-white/20 rounded-full"></div>
                </div>
              </div>

              {/* Achievement badge */}
              <div className="absolute -top-6 -right-2 md:-right-4 lg:-right-6 w-24 h-24 md:w-28 md:h-28 bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-white mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="text-xs font-bold text-white">Growing</div>
                </div>
              </div>

              {/* Heart badge */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center shadow-xl opacity-80 hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Matching Home Page Style */}
      <div className="py-10 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-bold mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <ThumbsUp className="w-5 h-5 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              What Makes Us Different
            </h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the advantages that set us apart in the professional
              services marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white border-2 border-gray-100 hover:border-gray-300 p-8 rounded-3xl hover:shadow-xl transition-all duration-500 hover:scale-105"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gray-100 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Animated underline */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gray-900 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section - Matching Home Page Style */}
      <div className="py-10 md:py-24 bg-white relative overflow-hidden">
        {/* Simplified background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-200 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gray-100 rounded-full opacity-25"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-sm font-bold mb-6 shadow-md">
              <CheckCircle className="w-5 h-5 mr-2" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get started in just 4 simple steps and join thousands of satisfied
              users
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Curved connecting line - Desktop only */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-20 z-0 pointer-events-none">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="curveGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#374151" />
                    <stop offset="50%" stopColor="#6B7280" />
                    <stop offset="100%" stopColor="#374151" />
                  </linearGradient>
                </defs>
                <path
                  d="M 12.5 10 Q 29.2 5 50 10 Q 70.8 15 87.5 10"
                  stroke="url(#curveGradient)"
                  strokeWidth="0.3"
                  fill="none"
                  strokeDasharray="1,1"
                  className="animate-pulse"
                />
                {/* Connection dots at each step - positioned at 12.5%, 37.5%, 62.5%, 87.5% */}
                <circle
                  cx="12.5"
                  cy="10"
                  r="0.8"
                  fill="#374151"
                  className="animate-pulse"
                />
                <circle
                  cx="37.5"
                  cy="7.5"
                  r="0.8"
                  fill="#6B7280"
                  className="animate-pulse"
                />
                <circle
                  cx="62.5"
                  cy="12.5"
                  r="0.8"
                  fill="#6B7280"
                  className="animate-pulse"
                />
                <circle
                  cx="87.5"
                  cy="10"
                  r="0.8"
                  fill="#374151"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 relative z-10 pt-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="group text-center relative">
                  {/* SVG Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gray-100 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className="text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Step title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Step description */}
                  <p className="text-gray-600 text-lg leading-relaxed transition-colors duration-300 max-w-xs mx-auto">
                    {item.description}
                  </p>

                  {/* Decorative underline */}
                  <div className="mt-8 flex justify-center">
                    <div className="w-16 h-1 bg-gray-900 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  </div>

                  {/* Arrow for mobile flow */}
                  {index < howItWorks.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-12">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="w-5 h-5 text-white rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-2 md:mt-20">
              <Link href={"/login"}>
                <div className="inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-lg hover:scale-105 hover:shadow-2xl transform transition-all duration-300 cursor-pointer">
                  <Star className="w-6 h-6 mr-3" />
                  Start Your Journey Today
                  <ArrowRight className="w-6 h-6 ml-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Team Section with Infinite Slider - Matching Home Page Style */}
      <div className="py-10 md:pt-24 relative overflow-hidden bg-gray-50">
        <div className="relative w-full mx-auto px-2 md:px-16">
          {/* Section header */}
          <div className="text-center px-4 md:px-0">
            <div className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-bold mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Users className="w-5 h-5 mr-2" />
              Our Team
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Meet Our Amazing Team
            </h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Passionate professionals dedicated to delivering exceptional
              experiences and innovative solutions
            </p>
          </div>

          {/* Infinite Slider Container */}
          <MarqueeImages teamMembers={teamMembers} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
