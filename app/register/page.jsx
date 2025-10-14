"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import UserRegisterForm from "../_components/register/UserRegisterForm";
import WorkerRegisterForm from "../_components/register/WorkerRegisterForm";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Toaster } from "react-hot-toast";

const Register = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="min-h-screen relative bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Join Our Platform
            </h1>
            <p className="text-slate-600 text-lg">
              Create your account and get started today
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="flex flex-col sm:flex-row w-full h-auto sm:h-12 bg-slate-100">
                  <TabsTrigger
                    value="user"
                    className="font-semibold text-base py-3 sm:py-0 data-[state=active]:bg-black data-[state=active]:text-white  data-[state=active]:shadow-sm"
                  >
                    Register As User
                  </TabsTrigger>
                  <TabsTrigger
                    value="worker"
                    className="font-semibold text-base py-3 sm:py-0 data-[state=active]:bg-black data-[state=active]:text-white  data-[state=active]:shadow-sm"
                  >
                    Register As Service Provider
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="mt-0">
                  <UserRegisterForm setLoading={setLoading} loading={loading} />
                </TabsContent>

                <TabsContent value="worker" className="mt-0">
                  <WorkerRegisterForm
                    setLoading={setLoading}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
