// import React, { useState } from "react";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// export default function Login({ onLoginSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp"
//   const [forgotOtp, setForgotOtp] = useState("");
//   const [forgotNewPass, setForgotNewPass] = useState("");
//   const [forgotMsg, setForgotMsg] = useState("");
//   const [forgotError, setForgotError] = useState("");

//   const [mode, setMode] = useState("login"); // "login" | "signup"
//   const [signupUsername, setSignupUsername] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupMobile, setSignupMobile] = useState("");
//   const [signupError, setSignupError] = useState("");
//   const [signupSuccess, setSignupSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!username || !password) {
//       setError("Please fill in all security fields.");
//       return;
//     }
//     try {
//       // Backend authentication call
//       const res = await axios.post(`${API_BASE}/auth/login`, {
//         username,
//         password,
//       });
//       onLoginSuccess(res.data); // Expecting { token, username, role }
//     } catch (err) {
//       setError(err.response?.data?.error || "Invalid credentials. Try again.");
//     }
//   };

//   const handleForgotRequest = async (e) => {
//     e.preventDefault();
//     setForgotError("");
//     setForgotMsg("");
//     try {
//       await axios.post(`${API_BASE}/auth/forgot-password`, {
//         email: forgotEmail,
//       });
//       setForgotMsg("OTP sent to your email. Check your inbox.");
//       setForgotStep("otp");
//     } catch (err) {
//       setForgotError(err.response?.data?.error || "Failed to send OTP.");
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setForgotError("");
//     setForgotMsg("");
//     try {
//       await axios.post(`${API_BASE}/auth/verify-otp`, {
//         email: forgotEmail,
//         otp: forgotOtp,
//         newPassword: forgotNewPass,
//       });
//       setForgotMsg("Password reset successfully! You can now log in.");
//       setTimeout(() => {
//         setShowForgot(false);
//         setForgotStep("email");
//         setForgotEmail("");
//         setForgotOtp("");
//         setForgotNewPass("");
//         setForgotMsg("");
//       }, 2500);
//     } catch (err) {
//       setForgotError(err.response?.data?.error || "OTP verification failed.");
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setSignupError("");
//     setSignupSuccess("");
//     // if (!signupUsername || !signupPassword) {
//     //   setSignupError("Username and password are required.");
//     //   return;
//     // }
//     if (!signupUsername || !signupPassword || !signupEmail || !signupMobile) {
//       setSignupError("All fields are required.");
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_BASE}/auth/signup`, {
//         username: signupUsername,
//         password: signupPassword,
//         email: signupEmail,
//         mobile: signupMobile,
//       });
//       setSignupSuccess("Account created! You can now log in.");
//       setSignupUsername("");
//       setSignupPassword("");
//       setSignupEmail("");
//       setSignupMobile("");
//       setTimeout(() => {
//         setMode("login");
//         setSignupSuccess("");
//       }, 2000);
//     } catch (err) {
//       setSignupError(err.response?.data?.error || "Sign up failed.");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         background: "var(--bg)",
//         padding: "1.5rem",
//       }}>
//       <div
//         className="form-panel"
//         style={{
//           width: "100%",
//           maxWidth: "420px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
//         }}>
//         <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
//           <div className="hero-badge">🔐 LMS GATEWAY</div>
//           <h1
//             style={{
//               fontSize: "2rem",
//               fontWeight: "700",
//               background: "linear-gradient(135deg, var(--blue), var(--purple))",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}>
//             Portal Sign-In
//           </h1>
//         </div>

//         {/* Tab toggle */}
//         <div
//           style={{
//             display: "flex",
//             background: "var(--bg)",
//             borderRadius: "10px",
//             border: "1px solid var(--border)",
//             padding: "4px",
//             marginBottom: "1.5rem",
//           }}>
//           {["login", "signup"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setMode(tab);
//                 setError("");
//                 setSignupError("");
//                 setSignupSuccess("");
//               }}
//               style={{
//                 flex: 1,
//                 padding: "8px",
//                 borderRadius: "7px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontFamily: "JetBrains Mono",
//                 fontSize: "0.78rem",
//                 letterSpacing: "1px",
//                 textTransform: "uppercase",
//                 transition: "all 0.2s",
//                 background: mode === tab ? "var(--surface)" : "transparent",
//                 color: mode === tab ? "var(--blue)" : "var(--muted)",
//                 borderColor: mode === tab ? "var(--border)" : "transparent",
//               }}>
//               {tab === "login" ? "Sign In" : "Sign Up"}
//             </button>
//           ))}
//         </div>

//         {mode === "login" ? (
//           <>
//             {error && (
//               <div className="warn" style={{ margin: "0 0 1.5rem 0" }}>
//                 <p>⚠️ {error}</p>
//               </div>
//             )}
//             <form onSubmit={handleSubmit}>
//               <div style={{ marginBottom: "1rem" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter your system username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   style={{ marginBottom: 0 }}
//                 />
//               </div>
//               <div style={{ marginBottom: "1.5rem" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className="input-field"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={{ marginBottom: 0 }}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="action-btn"
//                 style={{
//                   width: "100%",
//                   padding: "0.85rem",
//                   fontSize: "0.9rem",
//                 }}>
//                 Verify & Authenticate →
//               </button>
//               <div style={{ textAlign: "center", marginTop: "1rem" }}>
//                 <span
//                   style={{
//                     color: "var(--blue)",
//                     fontSize: "0.8rem",
//                     fontFamily: "JetBrains Mono",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     setShowForgot(true);
//                     setForgotStep("email");
//                     setForgotError("");
//                     setForgotMsg("");
//                   }}>
//                   Forgot Password?
//                 </span>
//               </div>
//             </form>
//           </>
//         ) : (
//           <>
//             {signupError && (
//               <div className="warn" style={{ margin: "0 0 1rem 0" }}>
//                 <p>⚠️ {signupError}</p>
//               </div>
//             )}
//             {signupSuccess && (
//               <div
//                 style={{
//                   background: "#052e16",
//                   border: "1px solid var(--green)",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1rem",
//                   marginBottom: "1rem",
//                   color: "var(--green)",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "0.82rem",
//                 }}>
//                 ✓ {signupSuccess}
//               </div>
//             )}
//             <form onSubmit={handleSignup}>
//               {[
//                 {
//                   label: "Username",
//                   type: "text",
//                   val: signupUsername,
//                   set: setSignupUsername,
//                   ph: "Choose a username",
//                 },
//                 {
//                   label: "Password",
//                   type: "password",
//                   val: signupPassword,
//                   set: setSignupPassword,
//                   ph: "••••••••",
//                 },
//                 {
//                   label: "Email",
//                   type: "email",
//                   val: signupEmail,
//                   set: setSignupEmail,
//                   ph: "your@email.com",
//                 },
//                 {
//                   label: "Mobile Number",
//                   type: "tel",
//                   val: signupMobile,
//                   set: setSignupMobile,
//                   ph: "+[Country Code] [Mobile Number]",
//                 },
//               ].map(({ label, type, val, set, ph }) => (
//                 <div key={label} style={{ marginBottom: "1rem" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "0.75rem",
//                       fontFamily: "JetBrains Mono",
//                       color: "var(--muted)",
//                       marginBottom: "0.5rem",
//                       textTransform: "uppercase",
//                     }}>
//                     {label}
//                   </label>
//                   <input
//                     type={type}
//                     className="input-field"
//                     placeholder={ph}
//                     value={val}
//                     onChange={(e) => set(e.target.value)}
//                     style={{ marginBottom: 0 }}
//                   />
//                 </div>
//               ))}
//               <button
//                 type="submit"
//                 className="action-btn"
//                 style={{
//                   width: "100%",
//                   padding: "0.85rem",
//                   fontSize: "0.9rem",
//                   marginTop: "0.5rem",
//                 }}>
//                 Create Student Account →
//               </button>
//             </form>
//           </>
//         )}
//       </div>

//       {showForgot && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.7)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}>
//           <div
//             className="form-panel"
//             style={{
//               width: "100%",
//               maxWidth: "400px",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
//             }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "1.5rem",
//               }}>
//               <div className="hero-badge">🔑 Password Reset</div>
//               <span
//                 style={{
//                   cursor: "pointer",
//                   color: "var(--muted)",
//                   fontSize: "1.2rem",
//                 }}
//                 onClick={() => {
//                   setShowForgot(false);
//                   setForgotStep("email");
//                   setForgotError("");
//                   setForgotMsg("");
//                 }}>
//                 ✕
//               </span>
//             </div>

//             {forgotMsg && (
//               <div
//                 style={{
//                   background: "#052e16",
//                   border: "1px solid var(--green)",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1rem",
//                   marginBottom: "1rem",
//                   color: "var(--green)",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "0.82rem",
//                 }}>
//                 ✓ {forgotMsg}
//               </div>
//             )}
//             {forgotError && (
//               <div className="warn" style={{ margin: "0 0 1rem 0" }}>
//                 <p>⚠️ {forgotError}</p>
//               </div>
//             )}

//             {forgotStep === "email" ? (
//               <form onSubmit={handleForgotRequest}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Registered Email
//                 </label>
//                 <input
//                   type="email"
//                   className="input-field"
//                   placeholder="Enter your email address"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="action-btn"
//                   style={{ width: "100%", padding: "0.75rem" }}>
//                   Send OTP →
//                 </button>
//               </form>
//             ) : (
//               <form onSubmit={handleVerifyOtp}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Enter OTP
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="6-digit OTP"
//                   maxLength={6}
//                   value={forgotOtp}
//                   onChange={(e) => setForgotOtp(e.target.value)}
//                 />
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   className="input-field"
//                   placeholder="Enter new password"
//                   value={forgotNewPass}
//                   onChange={(e) => setForgotNewPass(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="action-btn"
//                   style={{ width: "100%", padding: "0.75rem" }}>
//                   Reset Password →
//                 </button>
//                 <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
//                   <span
//                     style={{
//                       color: "var(--muted)",
//                       fontSize: "0.78rem",
//                       fontFamily: "JetBrains Mono",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setForgotStep("email")}>
//                     ← Back
//                   </span>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState } from "react";
// import axios from "axios";

// export default function Login({ onLoginSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp"
//   const [forgotOtp, setForgotOtp] = useState("");
//   const [forgotNewPass, setForgotNewPass] = useState("");
//   const [forgotMsg, setForgotMsg] = useState("");
//   const [forgotError, setForgotError] = useState("");

//   const [mode, setMode] = useState("login"); // "login" | "signup"
//   const [signupUsername, setSignupUsername] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupMobile, setSignupMobile] = useState("");
//   const [signupError, setSignupError] = useState("");
//   const [signupSuccess, setSignupSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!username || !password) {
//       setError("Please fill in all security fields.");
//       return;
//     }
//     try {
//       // Backend authentication call
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         username,
//         password,
//       });
//       onLoginSuccess(res.data); // Expecting { token, username, role }
//     } catch (err) {
//       setError(err.response?.data?.error || "Invalid credentials. Try again.");
//     }
//   };

//   const handleForgotRequest = async (e) => {
//     e.preventDefault();
//     setForgotError("");
//     setForgotMsg("");
//     try {
//       await axios.post("http://localhost:5000/api/auth/forgot-password", {
//         email: forgotEmail,
//       });
//       setForgotMsg("OTP sent to your email. Check your inbox.");
//       setForgotStep("otp");
//     } catch (err) {
//       setForgotError(err.response?.data?.error || "Failed to send OTP.");
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setForgotError("");
//     setForgotMsg("");
//     try {
//       await axios.post("http://localhost:5000/api/auth/verify-otp", {
//         email: forgotEmail,
//         otp: forgotOtp,
//         newPassword: forgotNewPass,
//       });
//       setForgotMsg("Password reset successfully! You can now log in.");
//       setTimeout(() => {
//         setShowForgot(false);
//         setForgotStep("email");
//         setForgotEmail("");
//         setForgotOtp("");
//         setForgotNewPass("");
//         setForgotMsg("");
//       }, 2500);
//     } catch (err) {
//       setForgotError(err.response?.data?.error || "OTP verification failed.");
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setSignupError("");
//     setSignupSuccess("");
//     // if (!signupUsername || !signupPassword) {
//     //   setSignupError("Username and password are required.");
//     //   return;
//     // }
//     if (!signupUsername || !signupPassword || !signupEmail || !signupMobile) {
//       setSignupError("All fields are required.");
//       return;
//     }
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup", {
//         username: signupUsername,
//         password: signupPassword,
//         email: signupEmail,
//         mobile: signupMobile,
//       });
//       setSignupSuccess("Account created! You can now log in.");
//       setSignupUsername("");
//       setSignupPassword("");
//       setSignupEmail("");
//       setSignupMobile("");
//       setTimeout(() => {
//         setMode("login");
//         setSignupSuccess("");
//       }, 2000);
//     } catch (err) {
//       setSignupError(err.response?.data?.error || "Sign up failed.");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         background: "var(--bg)",
//         padding: "1.5rem",
//       }}>
//       <div
//         className="form-panel"
//         style={{
//           width: "100%",
//           maxWidth: "420px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
//         }}>
//         <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
//           <div className="hero-badge">🔐 LMS GATEWAY</div>
//           <h1
//             style={{
//               fontSize: "2rem",
//               fontWeight: "700",
//               background: "linear-gradient(135deg, var(--blue), var(--purple))",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}>
//             Portal Sign-In
//           </h1>
//         </div>

//         {/* Tab toggle */}
//         <div
//           style={{
//             display: "flex",
//             background: "var(--bg)",
//             borderRadius: "10px",
//             border: "1px solid var(--border)",
//             padding: "4px",
//             marginBottom: "1.5rem",
//           }}>
//           {["login", "signup"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setMode(tab);
//                 setError("");
//                 setSignupError("");
//                 setSignupSuccess("");
//               }}
//               style={{
//                 flex: 1,
//                 padding: "8px",
//                 borderRadius: "7px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontFamily: "JetBrains Mono",
//                 fontSize: "0.78rem",
//                 letterSpacing: "1px",
//                 textTransform: "uppercase",
//                 transition: "all 0.2s",
//                 background: mode === tab ? "var(--surface)" : "transparent",
//                 color: mode === tab ? "var(--blue)" : "var(--muted)",
//                 borderColor: mode === tab ? "var(--border)" : "transparent",
//               }}>
//               {tab === "login" ? "Sign In" : "Sign Up"}
//             </button>
//           ))}
//         </div>

//         {mode === "login" ? (
//           <>
//             {error && (
//               <div className="warn" style={{ margin: "0 0 1.5rem 0" }}>
//                 <p>⚠️ {error}</p>
//               </div>
//             )}
//             <form onSubmit={handleSubmit}>
//               <div style={{ marginBottom: "1rem" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter your system username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   style={{ marginBottom: 0 }}
//                 />
//               </div>
//               <div style={{ marginBottom: "1.5rem" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className="input-field"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={{ marginBottom: 0 }}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="action-btn"
//                 style={{
//                   width: "100%",
//                   padding: "0.85rem",
//                   fontSize: "0.9rem",
//                 }}>
//                 Verify & Authenticate →
//               </button>
//               <div style={{ textAlign: "center", marginTop: "1rem" }}>
//                 <span
//                   style={{
//                     color: "var(--blue)",
//                     fontSize: "0.8rem",
//                     fontFamily: "JetBrains Mono",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     setShowForgot(true);
//                     setForgotStep("email");
//                     setForgotError("");
//                     setForgotMsg("");
//                   }}>
//                   Forgot Password?
//                 </span>
//               </div>
//             </form>
//           </>
//         ) : (
//           <>
//             {signupError && (
//               <div className="warn" style={{ margin: "0 0 1rem 0" }}>
//                 <p>⚠️ {signupError}</p>
//               </div>
//             )}
//             {signupSuccess && (
//               <div
//                 style={{
//                   background: "#052e16",
//                   border: "1px solid var(--green)",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1rem",
//                   marginBottom: "1rem",
//                   color: "var(--green)",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "0.82rem",
//                 }}>
//                 ✓ {signupSuccess}
//               </div>
//             )}
//             <form onSubmit={handleSignup}>
//               {[
//                 {
//                   label: "Username",
//                   type: "text",
//                   val: signupUsername,
//                   set: setSignupUsername,
//                   ph: "Choose a username",
//                 },
//                 {
//                   label: "Password",
//                   type: "password",
//                   val: signupPassword,
//                   set: setSignupPassword,
//                   ph: "••••••••",
//                 },
//                 {
//                   label: "Email",
//                   type: "email",
//                   val: signupEmail,
//                   set: setSignupEmail,
//                   ph: "your@email.com",
//                 },
//                 {
//                   label: "Mobile Number",
//                   type: "tel",
//                   val: signupMobile,
//                   set: setSignupMobile,
//                   ph: "+[Country Code] [Mobile Number]",
//                 },
//               ].map(({ label, type, val, set, ph }) => (
//                 <div key={label} style={{ marginBottom: "1rem" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       fontSize: "0.75rem",
//                       fontFamily: "JetBrains Mono",
//                       color: "var(--muted)",
//                       marginBottom: "0.5rem",
//                       textTransform: "uppercase",
//                     }}>
//                     {label}
//                   </label>
//                   <input
//                     type={type}
//                     className="input-field"
//                     placeholder={ph}
//                     value={val}
//                     onChange={(e) => set(e.target.value)}
//                     style={{ marginBottom: 0 }}
//                   />
//                 </div>
//               ))}
//               <button
//                 type="submit"
//                 className="action-btn"
//                 style={{
//                   width: "100%",
//                   padding: "0.85rem",
//                   fontSize: "0.9rem",
//                   marginTop: "0.5rem",
//                 }}>
//                 Create Student Account →
//               </button>
//             </form>
//           </>
//         )}
//       </div>

//       {showForgot && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.7)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}>
//           <div
//             className="form-panel"
//             style={{
//               width: "100%",
//               maxWidth: "400px",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
//             }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "1.5rem",
//               }}>
//               <div className="hero-badge">🔑 Password Reset</div>
//               <span
//                 style={{
//                   cursor: "pointer",
//                   color: "var(--muted)",
//                   fontSize: "1.2rem",
//                 }}
//                 onClick={() => {
//                   setShowForgot(false);
//                   setForgotStep("email");
//                   setForgotError("");
//                   setForgotMsg("");
//                 }}>
//                 ✕
//               </span>
//             </div>

//             {forgotMsg && (
//               <div
//                 style={{
//                   background: "#052e16",
//                   border: "1px solid var(--green)",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1rem",
//                   marginBottom: "1rem",
//                   color: "var(--green)",
//                   fontFamily: "JetBrains Mono",
//                   fontSize: "0.82rem",
//                 }}>
//                 ✓ {forgotMsg}
//               </div>
//             )}
//             {forgotError && (
//               <div className="warn" style={{ margin: "0 0 1rem 0" }}>
//                 <p>⚠️ {forgotError}</p>
//               </div>
//             )}

//             {forgotStep === "email" ? (
//               <form onSubmit={handleForgotRequest}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Registered Email
//                 </label>
//                 <input
//                   type="email"
//                   className="input-field"
//                   placeholder="Enter your email address"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="action-btn"
//                   style={{ width: "100%", padding: "0.75rem" }}>
//                   Send OTP →
//                 </button>
//               </form>
//             ) : (
//               <form onSubmit={handleVerifyOtp}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   Enter OTP
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="6-digit OTP"
//                   maxLength={6}
//                   value={forgotOtp}
//                   onChange={(e) => setForgotOtp(e.target.value)}
//                 />
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontFamily: "JetBrains Mono",
//                     color: "var(--muted)",
//                     marginBottom: "0.5rem",
//                     textTransform: "uppercase",
//                   }}>
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   className="input-field"
//                   placeholder="Enter new password"
//                   value={forgotNewPass}
//                   onChange={(e) => setForgotNewPass(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="action-btn"
//                   style={{ width: "100%", padding: "0.75rem" }}>
//                   Reset Password →
//                 </button>
//                 <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
//                   <span
//                     style={{
//                       color: "var(--muted)",
//                       fontSize: "0.78rem",
//                       fontFamily: "JetBrains Mono",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setForgotStep("email")}>
//                     ← Back
//                   </span>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import Login from "./Login";
// import AdminDashboard from "./AdminDashboard";
// import StudentDashboard from "./StudentDashboard";

// const API_BASE = "https://pratheebahub-backend.onrender.com/api";

// function TopHeader({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (d) =>
//     d.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });

//   const formatDate = (d) =>
//     d.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });

//   const greet = () => {
//     const h = time.getHours();
//     if (h < 12) return "Good Morning";
//     if (h < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 2rem 0 1.25rem",
//         height: "52px",
//         background: "var(--surface)",
//         borderBottom: "1px solid var(--border)",
//         position: "fixed",
//         top: 0,
//         left: sidebarOpen ? "280px" : "0px",
//         right: 0,
//         zIndex: 150,
//         transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//       }}>
//       {/* Left — sidebar toggle + greeting */}
//       <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
//           style={{
//             background: "var(--bg)",
//             border: "1px solid var(--border)",
//             color: "var(--muted)",
//             width: "32px",
//             height: "32px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "0.9rem",
//             flexShrink: 0,
//             transition: "all 0.2s",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.borderColor = "var(--blue)";
//             e.currentTarget.style.color = "var(--blue)";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.borderColor = "var(--border)";
//             e.currentTarget.style.color = "var(--muted)";
//           }}>
//           {sidebarOpen ? "←" : "☰"}
//         </button>

//         <div
//           style={{ width: "1px", height: "24px", background: "var(--border)" }}
//         />

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               width: "6px",
//               height: "6px",
//               borderRadius: "50%",
//               background: "var(--green)",
//               boxShadow: "0 0 6px var(--green)",
//               animation: "pulse 2s infinite",
//             }}
//           />
//           <span
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.76rem",
//               color: "var(--muted)",
//             }}>
//             {greet()}
//           </span>
//         </div>
//       </div>

//       {/* Center — app identity */}
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//         }}>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             fontWeight: "700",
//             letterSpacing: "2px",
//             background: "linear-gradient(135deg, var(--blue), var(--purple))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}>
//           ⬡ LMS PORTAL
//         </span>
//         <span
//           style={{
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.58rem",
//             color: "var(--muted)",
//             background: "var(--bg)",
//             border: "1px solid var(--border)",
//             padding: "1px 6px",
//             borderRadius: "4px",
//           }}>
//           v2.0
//         </span>
//       </div>

//       {/* Right — clock + logout */}
//       <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <div style={{ textAlign: "right" }}>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.82rem",
//               color: "var(--text)",
//               fontWeight: "600",
//               letterSpacing: "0.5px",
//             }}>
//             {formatTime(time)}
//           </div>
//           <div
//             style={{
//               fontFamily: "JetBrains Mono",
//               fontSize: "0.62rem",
//               color: "var(--muted)",
//               marginTop: "1px",
//             }}>
//             {formatDate(time)}
//           </div>
//         </div>

//         <div
//           style={{ width: "1px", height: "28px", background: "var(--border)" }}
//         />

//         <button
//           onClick={onLogout}
//           style={{
//             background: "#1a0808",
//             border: "1px solid #4a1515",
//             color: "#f87171",
//             padding: "5px 14px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontFamily: "JetBrains Mono",
//             fontSize: "0.75rem",
//             letterSpacing: "0.5px",
//             transition: "all 0.2s",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.background = "#3b1111";
//             e.currentTarget.style.borderColor = "#7f1d1d";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.background = "#1a0808";
//             e.currentTarget.style.borderColor = "#4a1515";
//           }}>
//           ⏻ Sign Out
//         </button>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//       `}</style>
//     </header>
//   );
// }

// export default function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [systemLoading, setSystemLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     const sessionAuth = localStorage.getItem("lms_auth_session");
//     if (sessionAuth) {
//       setCurrentUser(JSON.parse(sessionAuth));
//     }
//     setSystemLoading(false);
//   }, []);

//   const handleLoginSuccess = (userPayload) => {
//     localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
//     setCurrentUser(userPayload);
//   };

//   const handleSystemLogout = () => {
//     localStorage.removeItem("lms_auth_session");
//     setCurrentUser(null);
//   };

//   if (systemLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//           background: "var(--bg)",
//           fontFamily: "JetBrains Mono",
//           color: "var(--blue)",
//           gap: "10px",
//         }}>
//         <div
//           style={{
//             width: "8px",
//             height: "8px",
//             borderRadius: "50%",
//             background: "var(--blue)",
//             animation: "pulse 1s infinite",
//           }}
//         />
//         Booting System Engine...
//       </div>
//     );
//   }

//   if (!currentUser) {
//     return <Login onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
//       <TopHeader
//         currentUser={currentUser}
//         onLogout={handleSystemLogout}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       {/* Spacer so content doesn't hide under fixed header */}
//       <div style={{ paddingTop: "52px" }}>
//         {currentUser.role === "admin" ? (
//           <AdminDashboard
//             currentUser={currentUser}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />
//         ) : (
//           <StudentDashboard
//             currentUser={currentUser}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

function TopHeader({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const greet = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem 0 1.25rem",
        height: "52px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        left: sidebarOpen ? "280px" : "0px",
        right: 0,
        zIndex: 150,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
      {/* Left — sidebar toggle + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--blue)";
            e.currentTarget.style.color = "var(--blue)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}>
          {sidebarOpen ? "←" : "☰"}
        </button>

        <div
          style={{ width: "1px", height: "24px", background: "var(--border)" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 6px var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.76rem",
              color: "var(--muted)",
            }}>
            {greet()}
          </span>
        </div>
      </div>

      {/* Center — app identity */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.75rem",
            fontWeight: "700",
            letterSpacing: "2px",
            background: "linear-gradient(135deg, var(--blue), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          ⬡ LMS PORTAL
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: "0.58rem",
            color: "var(--muted)",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            padding: "1px 6px",
            borderRadius: "4px",
          }}>
          v2.0
        </span>
      </div>

      {/* Right — clock + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.82rem",
              color: "var(--text)",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}>
            {formatTime(time)}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: "0.62rem",
              color: "var(--muted)",
              marginTop: "1px",
            }}>
            {formatDate(time)}
          </div>
        </div>

        <div
          style={{ width: "1px", height: "28px", background: "var(--border)" }}
        />

        <button
          onClick={onLogout}
          style={{
            background: "#1a0808",
            border: "1px solid #4a1515",
            color: "#f87171",
            padding: "5px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "JetBrains Mono",
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#3b1111";
            e.currentTarget.style.borderColor = "#7f1d1d";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1a0808";
            e.currentTarget.style.borderColor = "#4a1515";
          }}>
          ⏻ Sign Out
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Validate session but also ping backend to wake Render from cold start
    const wakeBackend = async () => {
      try {
        await fetch("https://pratheebahub-backend.onrender.com/api/subjects");
      } catch (_) {}
    };
    wakeBackend();

    const sessionAuth = localStorage.getItem("lms_auth_session");
    if (sessionAuth) {
      setCurrentUser(JSON.parse(sessionAuth));
    }
    setSystemLoading(false);
  }, []);

  const handleLoginSuccess = (userPayload) => {
    localStorage.setItem("lms_auth_session", JSON.stringify(userPayload));
    setCurrentUser(userPayload);
  };

  const handleSystemLogout = () => {
    localStorage.removeItem("lms_auth_session");
    setCurrentUser(null);
  };

  if (systemLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg)",
          fontFamily: "JetBrains Mono",
          color: "var(--blue)",
          gap: "10px",
        }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--blue)",
            animation: "pulse 1s infinite",
          }}
        />
        Booting System Engine...
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TopHeader
        currentUser={currentUser}
        onLogout={handleSystemLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Spacer so content doesn't hide under fixed header */}
      <div style={{ paddingTop: "52px" }}>
        {currentUser.role === "admin" ? (
          <AdminDashboard
            currentUser={currentUser}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <StudentDashboard
            currentUser={currentUser}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}
      </div>
    </div>
  );
}