"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, CheckCircle, Star, Users } from "lucide-react";
import ServiceCard from "./_components/service-card";
import TestimonialCard from "./_components/testimonial-card";
import { useState } from "react";
import MarqueeImages from "./_components/MarqeeImage";
import CountUp from "@/components/ui/countUp";
import FAQ from "./_components/FAQ";

const LottieAnimation = dynamic(
  () => import("./_components/homepageanimation"),
  {
    ssr: false,
  }
);

const Footer = dynamic(() => import("./_components/Footer"), { ssr: false });

function Home() {
  const [activeTab, setActiveTab] = useState("popular");

  const services = [
    {
      id: 1,
      title: "Electrical Repairs",
      description: "Professional electrical services for your home and office",
      image: "/homepage_assets/electrical.svg?height=200&width=300",
      rating: 4.8,
      reviews: 124,
      price: "₹500/hr",
    },
    {
      id: 2,
      title: "Plumbing Services",
      description: "Expert plumbing solutions for all your needs",
      image: "/homepage_assets/plumbing.svg?height=200&width=300",
      rating: 4.7,
      reviews: 98,
      price: "₹450/hr",
    },
    {
      id: 3,
      title: "Carpentry Work",
      description: "Custom carpentry and furniture repair services",
      image: "/homepage_assets/carpentary.svg?height=200&width=300",
      rating: 4.9,
      reviews: 87,
      price: "₹600/hr",
    },
    {
      id: 4,
      title: "Painting Services",
      description: "Transform your space with professional painting",
      image: "/homepage_assets/painting.svg?height=200&width=300",
      rating: 4.6,
      reviews: 76,
      price: "₹400/hr",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Homeowner",
      content:
        "Found an excellent electrician through Skill Trade. The service was prompt and professional. Highly recommended!",
      avatar: "/homepage_assets/user_profileicon.png",
      rating: 5,
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Business Owner",
      content:
        "As a small business owner, finding reliable service providers was always a challenge until I discovered Skill Trade.",
      avatar: "/homepage_assets/user_profileicon.png",
      rating: 4,
    },
    {
      id: 3,
      name: "Ananya Patel",
      role: "Interior Designer",
      content:
        "The platform connects me with skilled professionals who help bring my design visions to life. Great experience!",
      avatar: "/homepage_assets/user_profileicon.png",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div
        className="flex items-center flex-col sm:h-[500px] h-[550px] justify-center
         bg-[url('/hero_backGround.webp')] bg-cover bg-center bg-no-repeat 
         gap-7 sm:gap-5 p-3 sm:mt-0 mt-[70px] relative"
      >

        <div className="relative  max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold font-sans text-white text-center mb-4">
            Your Trusted Partner for Home Services
          </h1>

          <p className="text-white text-xl sm:text-2xl leading-[32px] tracking-normal text-center mb-8">
            Book reliable electricians, plumbers, carpenters, and more with just
            a few clicks!
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-300 font-bold text-lg px-6"
            >
              <Link href="user/create_request">Book A Service Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-black hover:bg-gray-300 font-bold text-lg px-6"
            >
              <Link href="/user/hire">Hire Worker</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-gray-900">
              <CountUp end={5000} duration={3} suffix="+" />
            </p>
            <p className="text-gray-600">Professionals</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-gray-900">
              <CountUp end={10} duration={3} suffix="K+" />
            </p>
            <p className="text-gray-600">Completed Jobs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-gray-900">
              <CountUp end={4.8} duration={3} suffix="★" />
            </p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-4xl font-bold text-gray-900">
              <CountUp end={50} duration={3} suffix="+" />
            </p>
            <p className="text-gray-600">Service Categories</p>
          </div>
        </div>
      </div>

      {/* Worker section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl text-center font-bold mb-12">
            Showcase Your Skills And Find Opportunities
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            {/* Lottie Animation Section */}
            <div className="md:w-[45%] xl:w-1/2">
              <LottieAnimation />
            </div>

            {/* Text Section */}
            <div className="md:w-[50%] xl:w-1/2 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Are you a skilled professional looking to expand your reach?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">
                    Showcase your skills and find opportunities with people who
                    need your services.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">
                    Communicate directly, review their work, and collaborate
                    seamlessly.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">
                    Build your reputation and expand your professional network.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Join as Professional <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl text-center font-bold mb-8">
            Find the Right Expertise for Your Needs
          </h2>

          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Browse through our wide range of professional services tailored to
            meet your specific requirements
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
            >
              <Link
                href="#"
                className="flex items-center gap-2"
              >
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>


      {/* Testimonials section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-gray-900" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold ml-3">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="py-16 bg-gray-100">
        <FAQ />
      </div>

      {/* CTA section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto text-center px-0 md:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers and professionals on Skill
            Trade today.
          </p>
          <MarqueeImages />
          <div className="flex flex-col sm:flex-row gap-4 px-4 md:px-0 justify-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold"
            >
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
