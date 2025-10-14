const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const WorkerModal = require("../modals/WorkerModal");
const UserModal = require("../modals/UserModal");
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");

async function RegisterUser(req, resp) {
  try {
    const { Name, MobileNo, Email, Password, Address, Pincode } = req.body;

    if (!Name || !MobileNo || !Email || !Password || !Address) {
      return resp.status(400).send({
        success: false,
        error: "All fields are required",
      });
    }
    const userEmailExists = await UserModal.findOne({ Email });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });

    if (userEmailExists) {
      return resp.status(409).send({
        success: false,
        message: "User already exists, please login",
      });
    }
    if (userMobileExists || WorkerMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newuser = new UserModal({
      Name,
      MobileNo,
      Email,
      Password: hashedPassword,
      Address,
      Pincode,
    });
    await newuser.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function UserLogin(req, resp) {
  try {
    const { MobileNo, Password } = req.body;
    if (!MobileNo || !Password) {
      return resp.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModal.findOne({ MobileNo }).select(
      "-Password -image"
    );
    const worker = await WorkerModal.findOne({ MobileNo }).select(
      "-Password -image"
    );

    if (!user && !worker) {
      return resp.status(401).send({
        success: false,
        message: "No such user found",
      });
    }
    let hashedPassword;
    if (user) {
      hashedPassword = await UserModal.findOne({ MobileNo }).select("Password");
    } else {
      hashedPassword = await WorkerModal.findOne({ MobileNo }).select(
        "Password"
      );
    }
    const matchpassword = await bcrypt.compare(
      Password,
      hashedPassword.Password
    );

    if (!matchpassword) {
      return resp.status(210).send({
        success: false,
        message: "Invalid number or password",
      });
    }
    let token;

    if (user) {
      token = JWT.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        user,
      });
    } else {
      token = JWT.sign({ _id: worker._id }, process.env.SECRET, {
        expiresIn: "7d",
      });
      return resp.status(200).send({
        success: true,
        message: "login successfull",
        token,
        worker,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "server error",
    });
  }
}

async function GetUserInfo(req, resp) {
  try {
    const { uid } = req.params;
    const user = await UserModal.findById(uid).select("-image");
    if (user) {
      return resp.status(200).send({
        success: true,
        user,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "error",
    });
  }
}

async function UpdateUserInfo(req, resp) {
  const { uid } = req.params;

  const user = await UserModal.findById(uid);
  if (!user) {
    return resp.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  const { fields, files } = req;

  // console.log("All fields:", fields);

  const updatedData = {
    Name: fields.Name || user.Name,
    MobileNo: fields.MobileNo || user.MobileNo,
    Address: fields.Address || user.Address,
    Pincode: fields.Pincode || user.Pincode,
  };

  const updatedUser = await UserModal.findByIdAndUpdate(uid, updatedData, {
    new: true,
  });

  const image = files.image;

  if (image) {
    try {
      // Read image data and attach it to the user's record
      updatedUser.image = {
        data: await fs.readFile(image.filepath || image.path),
        contentType: image.mimetype || image.type,
      };
    } catch (error) {
      return resp.status(400).send({
        success: false,
        message: "Image processing failed",
      });
    }
  } else {
    console.log("No image exists");
  }

  await updatedUser.save();

  return resp.status(200).send({
    success: true,
    message: "User updated successfully",
    updateduser: updatedUser,
  });
}

async function GetUserImage(req, resp) {
  try {
    const user = await UserModal.findById(req.params.uid).select("image");

    if (!user || !user.image || !user.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", user.image.contentType);
    return resp.status(200).send(user.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

async function UserPassword(req, resp) {
  try {
    const { uid } = req.params;

    const user = await UserModal.findById(uid);
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "No such user found",
      });
    } else {
      if (!req.body.passwords.oldpassword || !req.body.passwords.newpass) {
        return resp.status(400).send({
          message: "All fields are required",
        });
      }
      // console.log(req.body.passwords.newpassword);
      // check the old password is correct or not
      const verify = await bcrypt.compare(
        req.body.passwords.oldpassword,
        user.Password
      );
      if (verify) {
        //if yes then update the pass with the new password
        const newpassword = await bcrypt.hash(req.body.passwords.newpass, 10);
        user.Password = newpassword;
        user.save();
        return resp.status(200).send({
          success: true,
          message: "password was changed",
        });
      } else {
        return resp.status(400).send({
          success: false,
          message: "incorrect password",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function SendOtp(req, resp) {
  const { GeneratedOtp, email } = req.body;

  try {
    if (!GeneratedOtp || !email) {
      return resp.status(400).send({
        success: false,
        message: "OTP and Email are required",
      });
    }

    const user = await UserModal.findOne({ Email: email });
    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = GeneratedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (!process.env.email_id || !process.env.pass_key) {
      return resp.status(500).send({
        success: false,
        message: "Email configuration missing on the server",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email_id,
        pass: process.env.pass_key,
      },
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dqe7okgzb/image/upload/v1743163315/logo_yhxmjl.png" alt="Skill Trade Logo" style="width: 250px; margin-bottom: 10px; background-color: black;">

          <h1 style="color: #333;">Your Otp To Reset Password</h1>
          <p style="font-size: 18px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the OTP below to proceed:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${GeneratedOtp}</p>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Skill Trade. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.email_id,
      to: email,
      subject: "Reset Password - Skill Trade",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).send({
          success: false,
          message: "Error sending email. Please try again later.",
        });
      } else {
        console.log("Email sent:", info.response);
        return resp.status(200).send({
          success: true,
          message: "OTP sent successfully to the provided email",
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    resp.status(500).send({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
// async function VerifyOtp(req, resp) {
//   try {
//     const { email, otp, foremail = false } = req.body;

//     if (!email || !otp) {
//       return resp.status(400).send({
//         success: false,
//         message: "Email or otp not received",
//       });
//     }

//     const user = await UserModal.findOne({ Email: email });

//     if (!user) {
//       return resp.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.otp !== otp) {
//       return resp.status(400).send({
//         success: false,
//         message: "Incorrect otp. Please try again.",
//       });
//     }

//     if (new Date() > user.otpExpiry) {
//       return resp.status(400).send({
//         success: false,
//         message: "otp has expired. Please request a new one.",
//       });
//     }
//     if (foremail) {
//       user.email_verified = true;
//       await user.save();
//     }
//     return resp.status(200).send({
//       success: true,
//       message: "Verification successfull",
//     });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return resp.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }
async function VerifyOtp(req, res) {
  const { email, otp, generatedOtp, foremail } = req.body;
  if (!email || !otp || !generatedOtp) {
    return res.status(400).send({ success: false, message: "Missing required fields" });
  }

  if (otp === generatedOtp) {
    return res.status(200).send({ success: true, message: "OTP verified" });
  } else {
    return res.status(400).send({ success: false, message: "Invalid OTP" });
  }
}


async function ResetPassword(req, resp) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    console.log(email);
    if (newPassword !== confirmPassword) {
      return resp.status(400).send({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await UserModal.findOne({ Email: email });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.Password = hashedPassword;
    await user.save();

    return resp.status(200).send({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "internal Server error",
    });
  }
}

async function SubmitForReview(req, resp) {
  try {
    const { rid } = req.params;
    const report = await ReportModal.findOne({ requestId: rid });
    const request = await RequestModal.findById(rid);

    if (!report) {
      return resp.status(404).send({
        success: false,
        message: "Report not found ",
      });
    }
    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found ",
      });
    }
    request.ReportedInfo.Review = true;
    report.ReviewRequested = true;
    await report.save();
    await request.save();
    resp.status(200).send({
      success: true,
      message: "requested review",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function SendEmailVerificationOtp(req, resp) {
  const { GeneratedOtp, email } = req.body;
  try {
    if (!GeneratedOtp || !email) {
      return resp.status(400).send({
        success: false,
        message: "OTP and Email are required",
      });
    }
    const user = await UserModal.findOne({ Email: email });

    if (user) {
      return resp.status(400).send({
        success: false,
        message: "User with this email already exists",
      });
    }
    const worker = await WorkerModal.findOne({ Email: email })

    if (worker) {
      return resp.status(400).send({
        success: false,
        message: "Worker with this email already exists",
      });
    }
    if (user) {
      return resp.status(400).send({
        success: false,
        message: "user with this email already exist ",
      });
    }


    if (!process.env.email_id || !process.env.pass_key) {
      return resp.status(500).send({
        success: false,
        message: "Email configuration missing on the server",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email_id,
        pass: process.env.pass_key,
      },
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/dqe7okgzb/image/upload/v1743163315/logo_yhxmjl.png" alt="Skill Trade Logo" style="width: 250px; margin-bottom: 10px; background-color: black;">
          <h1 style="color: #333;">Your OTP to Verify Email</h1>
          <p style="font-size: 18px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Use the OTP below to verify your email:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${GeneratedOtp}</p>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn’t request this, you can ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Skill Trade. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.email_id,
      to: email,
      subject: "Email Verification - Skill Trade",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).send({
          success: false,
          message: "Error sending email. Please try again later.",
        });
      }

      console.log("Email sent:", info.response);
      return resp.status(200).send({
        success: true,
        message: "OTP sent successfully to the provided email",
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    resp.status(500).send({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function ListWorkers(req, resp) {
  try {
    const { ServiceType, Coordinates, Pincode } = req.body;
    let { page } = req.params;

    const limit = 5;
    page = parseInt(page) || 1;
    const skip = (page - 1) * limit;

    if (!Coordinates && !Pincode) {
      return resp.status(400).send({
        success: false,
        message: "Please provide either Coordinates or Pincode.",
      });
    }

    let query = {};
    if (ServiceType) {
      query.ServiceType = { $regex: `^${ServiceType}$`, $options: "i" }; // for case-insensitive exact match
    }

    let Workers = [];
    let totalWorkers = 0;
    const maxDistanceInMeters = 10000;

    // Search by Coordinates
    if (
      Coordinates &&
      Coordinates.coordinates &&
      Coordinates.coordinates.length === 2
    ) {
      const [lon, lat] = Coordinates.coordinates;

      if (!isNaN(lat) && !isNaN(lon)) {
        console.log("Searching by coordinates:", lat, lon);

        // Use geoNear for geospatial search
        const geoResults = await WorkerModal.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [lon, lat],
              },
              distanceField: "distance",
              maxDistance: maxDistanceInMeters,
              spherical: true,
              query: {
                "coordinates.coordinates": { $exists: true, $ne: null },
                "Banned.ban": { $ne: true },
                ...query,
              },
            },
          },
          {
            $sort: {
              overAllSentimentScore: -1,
              OverallRaitngs: -1,
            },
          },
          {
            $project: {
              password: 0,
              Reviews: 0,
              __v: 0,
            },
          },
          { $skip: skip },
          { $limit: limit },
        ]);

        // Count total geo matches for pagination
        const geoCount = await WorkerModal.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [lon, lat],
              },
              distanceField: "distance",
              maxDistance: maxDistanceInMeters,
              spherical: true,
              query: {
                "coordinates.coordinates": { $exists: true, $ne: null },
                "Banned.ban": { $ne: true },
                ...query,
              },
            },
          },
          { $count: "count" },
        ]);

        totalWorkers = geoCount[0]?.count || 0;
        Workers = geoResults;
      }
    }

    // Fallback: Search by Pincode
    if (!Workers.length && Pincode) {
      console.log("Searching by Pincode:", Pincode);
      query.pincode = Pincode;

      totalWorkers = await WorkerModal.countDocuments({
        ...query,
        "Banned.ban": { $ne: true },
      });

      Workers = await WorkerModal.aggregate([
        {
          $match: {
            ...query,
            "Banned.ban": { $ne: true },
          },
        },
        {
          $project: {
            Name: 1,
            ServiceType: 1,
            city: 1,
            OverallRaitngs: 1,
            CompletedRequest: 1,
            SubSerives: 1,
            overAllSentimentScore: 1,
            ReviewsCount: { $size: "$Reviews" },
          },
        },
        {
          $sort: {
            overAllSentimentScore: -1,
            OverallRaitngs: -1,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);
    }

    // Final fallback: still no results
    if (!Workers.length) {
      return resp.status(400).send({
        success: false,
        message: "No workers found. Please check Coordinates or Pincode.",
      });
    }

    return resp.status(200).send({
      success: true,
      Workers,
      currentPage: page,
      totalPages: Math.ceil(totalWorkers / limit),
      totalWorkers,
    });
  } catch (error) {
    console.error("Error in ListWorkers:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


async function SubmitUserQuery(req, resp) {
  const { Name, Email, Message } = req.body;

  if (!Name || !Email || !Message) {
    return resp.status(400).send({
      success: false,
      message: "All fields are required",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_id,
      pass: process.env.pass_key,
    },
  });

  // Email template for owner
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
      <!-- Header Section -->
      <div style="background-color: #1a1a1a; text-align: center; padding: 16px;">
        <img src="https://res.cloudinary.com/dqe7okgzb/image/upload/v1743163315/logo_yhxmjl.png" alt="Skill Trade Logo" style="width: 160px; margin-bottom: 8px;">
        <h1 style="color: #fff; margin: 0; font-size: 18px; font-weight: 600;">New Customer Inquiry</h1>
        <p style="color: #b0b0b0; margin: 4px 0 0 0; font-size: 12px;">Skill Trade Platform</p>
      </div>
      <!-- Main Content -->
      <div style="background-color: #fff; padding: 14px;">
        <!-- Customer Information Section -->
        <div style="margin-bottom: 12px;">
          <h2 style="color: #333; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #333; padding-bottom: 3px; display: inline-block;">Customer Information</h2>
          <div style="border-left: 4px solid black; padding-left: 8px; background-color: #f8f9fa; padding: 8px; border-radius: 8px; margin: 6px 0;">
            <div style="margin-bottom: 6px;">
              <span style="color: #333; font-weight: 600; font-size: 12px;">Name:</span>
              <span style="color: #555; font-size: 12px; margin-left: 0.5rem;">${Name}</span>
            </div>
            <div style="margin-bottom: 6px;">
              <span style="color: #333; font-weight: 600; font-size: 12px;">Email:</span>
              <a href="mailto:${Email}" style="color: #007BFF; font-size: 12px; margin-left: 0.5rem; text-decoration: underline;">${Email}</a>
            </div>
          </div>
        </div>
        <!-- Message Section -->
        <div style="margin-bottom: 12px;">
          <h3 style="color: #333; margin: 0 0 6px 0; font-size: 13px; font-weight: 600;">Message:</h3>
          <div style="border-left: 4px solid black; padding-left: 8px; background-color: #f8f9fa; padding: 8px; border-radius: 8px; margin: 6px 0;">
            <p style="color: #555; margin: 0; line-height: 1.4; font-size: 12px;">${Message}</p>
          </div>
        </div>
        <!-- Reply Button -->
        <div style="text-align: center; margin: 12px 0;">
          <a href="mailto:${Email}" style="background-color: #1a1a1a; color: #fff; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 11px; display: inline-block;">
            📧 Reply to Customer
          </a>
        </div>
        <!-- Timestamp -->
        <div style="border-left: 4px solid black; padding-left: 8px; background-color: #f8f9fa; padding: 8px; border-radius: 8px; margin: 6px 0;">
          <p style="color: #666; margin: 0; font-size: 11px;">
            <span style="color: #333; font-weight: 600;">Received:</span> ${new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
          </p>
        </div>
        <div style="background-color: #f8f9fa; text-align: center; padding: 10px 8px; margin-top: 12px; border-radius: 8px;">
          <p style="color: #666; font-size: 11px; margin: 0 0 4px 0; font-weight: 500;">
            Skill Trade - Professional Service Marketplace
          </p>
          <p style="color: #666; font-size: 10px; margin: 0 0 5px 0;">
            Connecting customers with skilled professionals
          </p>
          <p style="color: #999; font-size: 9px; margin: 0;">
            © ${new Date().getFullYear()} Skill Trade. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  // Auto-reply email template for user
  const autoReplyTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
      <!-- Header Section -->
      <div style="background-color: #1a1a1a; text-align: center; padding: 16px;">
        <img src="https://res.cloudinary.com/dqe7okgzb/image/upload/v1743163315/logo_yhxmjl.png" alt="Skill Trade Logo" style="width: 160px; margin-bottom: 8px;">
        <h1 style="color: #fff; margin: 0; font-size: 18px; font-weight: 600;">Thank You for Your Inquiry</h1>
        <p style="color: #b0b0b0; margin: 4px 0 0 0; font-size: 12px;">Skill Trade Platform</p>
      </div>
      <!-- Main Content -->
      <div style="background-color: #fff; padding: 14px;">
        <!-- Confirmation Message -->
        <div style="margin-bottom: 12px;">
          <h2 style="color: #333; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #333; padding-bottom: 3px; display: inline-block;">Query Received Successfully</h2>
          <div style="border-left: 4px solid black; padding-left: 8px; background-color: #f8f9fa; padding: 8px; border-radius: 8px; margin: 6px 0;">
            <p style="color: #555; margin: 0; line-height: 1.4; font-size: 12px;">Hello <b>${Name}</b>,</p>
            <p style="color: #555; margin: 6px 0 0 0; line-height: 1.4; font-size: 12px;">We have received your query and appreciate you reaching out to us. Our team will contact you as soon as possible to assist you with your requirements.</p>
          </div>
        </div>
        <!-- Timestamp -->
        <div style="border-left: 4px solid black; padding-left: 8px; background-color: #f8f9fa; padding: 8px; border-radius: 8px; margin: 6px 0;">
          <p style="color: #666; margin: 0; font-size: 11px;">
            <span style="color: #333; font-weight: 600;">Submitted:</span> ${new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
          </p>
        </div>
        <div style="background-color: #f8f9fa; text-align: center; padding: 10px 8px; margin-top: 12px; border-radius: 8px;">
          <p style="color: #666; font-size: 11px; margin: 0 0 4px 0; font-weight: 500;">
            This is an automated notification from Skill Trade platform
          </p>
          <p style="color: #666; font-size: 10px; margin: 0 0 5px 0;">
             Professional service marketplace connecting customers with skilled workers
          </p>
          <p style="color: #999; font-size: 9px; margin: 0;">
            © ${new Date().getFullYear()} Skill Trade. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: req.body.Email,
    to: "taskmaster991@gmail.com",
    subject: "Skill Trade user query",
    html: emailTemplate
  };

  const autoReplyOptions = {
    from: process.env.email_id,
    to: Email,
    subject: "Thank you for contacting Skill Trade - We received your query",
    html: autoReplyTemplate,
    headers: {
      'Reply-To': 'no-reply@skilltrade.com'
    }
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: " + error);
      resp.status(500).send({ success: false, message: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);

      // Send auto-reply to user
      transporter.sendMail(autoReplyOptions, (autoError, autoInfo) => {
        if (autoError) {
          console.log("Error sending auto-reply: " + autoError);
          // Still return success since main email was sent
          return resp.status(200).send({ success: true, message: "Query sent successfully" });
        } else {
          console.log("Auto-reply sent: " + autoInfo.response);
          return resp.status(200).send({ success: true, message: "Query sent successfully and confirmation email sent" });
        }
      });
    }
  });
}

module.exports = {
  RegisterUser,
  UserLogin,
  GetUserInfo,
  UpdateUserInfo,
  GetUserImage,
  UserPassword,
  SendOtp,
  VerifyOtp,
  ResetPassword,
  SubmitForReview,
  SendEmailVerificationOtp,
  ListWorkers,
  SubmitUserQuery,
};