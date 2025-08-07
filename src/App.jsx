import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Membership from "@/components/pages/Membership";
import Master from "@/components/pages/Master";
import Insights from "@/components/pages/Insights";
import VideoPlayer from "@/components/pages/VideoPlayer";
import BlogPost from "@/components/pages/BlogPost";
import AdminDashboard from "@/components/pages/AdminDashboard";
import Testimonials from "@/components/pages/Testimonials";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="membership" element={<Membership />} />
            <Route path="master" element={<Master />} />
            <Route path="insights" element={<Insights />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="video/:id" element={<VideoPlayer />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;