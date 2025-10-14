"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Home,
  CheckCircle,
  Upload,
  Loader2,
} from "lucide-react";
import { GetUserInfo } from "./fetchfunction/GetUserInfo";
import { UpdateUserInfo } from "./fetchfunction/UpdateUserInfo";
import { useAuth } from "../../../_context/UserAuthContent";

const Userinfo = () => {
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imgurl, setImgUrl] = useState("/demouserimage.jpg");
  const [emailVerified, setEmailVerified] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Preview image before upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImgUrl(URL.createObjectURL(file));
    }
  };

  // Fetch user info
  useEffect(() => {
    if (!auth?.user?._id) return;
    (async () => {
      try {
        const res = await GetUserInfo(auth.user._id);
        if (res.data.success) {
          setEmailVerified(res.data.user.email_verified);
          setFormData({
            name: res.data.user.Name || "",
            mobile: res.data.user.MobileNo || "",
            email: res.data.user.Email || "",
            address: res.data.user.Address || "",
            pincode: res.data.user.Pincode || "",
          });
          setImgUrl(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/GetUserImage/${auth.user._id}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [auth?.user?._id]);

  // Update user info
  const updateuserdata = async () => {
    if (!auth?.user?._id) return;
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    try {
      setOpenBackdrop(true);
      const data = new FormData();
      Object.entries({
        Name: formData.name,
        MobileNo: formData.mobile,
        Email: formData.email,
        Address: formData.address,
        Pincode: formData.pincode,
      }).forEach(([key, val]) => data.append(key, val));

      if (imageFile) data.append("image", imageFile);

      const response = await UpdateUserInfo(auth.user._id, data);
      if (response.success) {
        setAuth({ ...auth, user: response.updateduser });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: response.updateduser })
        );
        toast.success(response.message);
      } else toast.error(response.message);
    } catch (error) {
      console.error(error);
      toast.error("Error updating user info");
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Personal Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account details
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={imgurl}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Label
                  htmlFor="profile-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" /> Change Photo
                </Label>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "name", icon: <User />, label: "Full Name" },
                { id: "mobile", icon: <Phone />, label: "Mobile Number" },
                {
                  id: "email",
                  icon: <Mail />,
                  label: "Email Address",
                  disabled: true,
                },
                {
                  id: "pincode",
                  icon: <MapPin />,
                  label: "Pincode",
                  type: "number",
                },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label
                    htmlFor={field.id}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {field.icon} {field.label}
                    {field.id === "email" && emailVerified && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-green-100 text-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field.label}`}
                    disabled={field.disabled}
                    type={field.type || "text"}
                    className="h-11"
                  />
                </div>
              ))}

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="address"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin className="w-4 h-4" /> Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  className="h-11"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={updateuserdata}
                disabled={openBackdrop}
                className="h-11 px-8 text-white font-medium"
              >
                {openBackdrop ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link href="/">
                <Button variant="outline" className="h-11 w-full font-medium">
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Backdrop */}
      {openBackdrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userinfo;
