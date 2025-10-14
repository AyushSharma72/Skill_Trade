"use client";
import React, { useState } from "react";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import {Button} from "../../components/ui/button"
import toast, {Toaster} from "react-hot-toast"
import Image from "next/image"

const Footer = dynamic(() => import("../_components/Footer"), { ssr: false });

const ContactForm = () => {
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Message, SetMessage] = useState("");
  const [loading, Setloading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      Setloading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/SubmitUserQueryForm`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ Name, Email, Message }),
        }
      );
      if (response.status === 200) {
        toast.success("We received your query");
        SetName("");
        SetEmail("");
        SetMessage("");
      } else {
        toast.error("Please try after some time");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      Setloading(false);
    }
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-black to-gray-600 p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Get in Touch
        </h1>
        <p className="text-blue-100 text-lg">
          We are here for you. How can we help?
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
            id="name"
            required
            placeholder="Enter your full name"
            value={Name}
            onChange={(e) => SetName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
            id="email"
            required
            placeholder="your.email@example.com"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Message
          </label>
          <textarea
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
            id="message"
            rows="5"
            required
            placeholder="Tell us how we can help you..."
            value={Message}
            onChange={(e) => SetMessage(e.target.value)}
          ></textarea>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-black to-gray-600 hover:from-gray-600 hover:to-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </div>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
};

const Contact = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
        
        <div className="flex flex-col items-center w-full px-4 pt-16 pb-8">
          <div className="flex flex-wrap justify-center gap-12 max-w-6xl w-full">
            <ContactForm />
            
            <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md">
              <div className="relative overflow-hidden rounded-xl mb-6 from-black">
                <Image
                  src="/contactpg.svg"
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                  alt="Contact Us"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <a
                  href="mailto:asharma7588@gmail.com"
                  className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <FaEnvelope className="text-black text-lg" />
                  </div>
                  <span className="text-gray-700 font-medium">asharma7588@gmail.com</span>
                </a>

                <a
                  href="mailto:Mohitsinghtadhiyal8@gmail.com"
                  className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <FaEnvelope className="text-black text-lg" />
                  </div>
                  <span className="text-gray-700 font-medium">Mohitsinghtadhiyal8@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
                  target="blank"
                  className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <FaLinkedin className="text-black text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Ayush Sharma</span>
                </a>
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="mt-20 max-w-2xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                Developed By
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-black to-gray-800 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black to-gray-800"></div>
              
              <div className="relative">
                <div className="relative inline-block mb-6">
                  <Image
                    src="/Ayush2.jpg"
                    alt="Ayush Sharma"
                    className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                    width={128}
                    height={128}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-500 rounded-full border-4 border-white"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ayush Sharma</h3>
                <p className="text-gray-600 font-medium mb-8 text-lg">Developer and Project Manager</p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://github.com/AyushSharma72"
                    target="_blank"
                    className="group bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaGithub className="text-2xl group-hover:animate-pulse" />
                  </a>
                  <a
                    href="mailto:asharma7588@gmail.com"
                    className="group bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaEnvelope className="text-2xl group-hover:animate-pulse" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
                    target="_blank"
                    className="group bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                  >
                    <FaLinkedin className="text-2xl group-hover:animate-pulse" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;