import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import VideoCard from "@/components/molecules/VideoCard";
import BlogCard from "@/components/molecules/BlogCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { videoService } from "@/services/api/videoService";
import { blogService } from "@/services/api/blogService";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [videosData, blogsData] = await Promise.all([
        videoService.getAll(),
        blogService.getAll()
      ]);

      // Show featured content (first 3 items)
      setVideos(videosData.slice(0, 3));
      setBlogs(blogsData.slice(0, 3));
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent mb-6">
            온라인 학습의 새로운 경험
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            체계적인 동영상 강의와 전문가 인사이트로<br />
            당신의 성장을 함께하는 프리미엄 학습 플랫폼입니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <ApperIcon name="Play" size={20} />
              강의 둘러보기
            </Button>
            <Button size="lg" variant="secondary" className="flex items-center gap-2">
              <ApperIcon name="BookOpen" size={20} />
              인사이트 읽기
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 강의</h2>
            <p className="text-gray-600">많은 학습자들이 선택한 프리미엄 콘텐츠</p>
          </div>
          <Link to="/membership">
            <Button variant="secondary" className="flex items-center gap-2">
              전체보기
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.Id} video={video} userRole="free" />
          ))}
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 인사이트</h2>
            <p className="text-gray-600">업계 트렌드와 전문가 노하우를 확인하세요</p>
          </div>
          <Link to="/insights">
            <Button variant="secondary" className="flex items-center gap-2">
              전체보기
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.Id} post={blog} userRole="free" />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 EduMaster를 선택해야 할까요?
            </h2>
            <p className="text-gray-600 text-lg">
              차별화된 학습 경험을 제공하는 핵심 기능들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                <ApperIcon name="Video" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">체계적인 강의</h3>
              <p className="text-gray-600">
                단계별 커리큘럼으로 구성된 고품질 동영상 강의를 통해 체계적으로 학습할 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">등급별 콘텐츠</h3>
              <p className="text-gray-600">
                사용자 등급에 맞는 맞춤형 콘텐츠로 단계적인 학습 진행이 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mb-4">
                <ApperIcon name="BookOpen" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">전문가 인사이트</h3>
              <p className="text-gray-600">
                업계 전문가들의 실무 경험과 최신 트렌드 정보를 블로그 형태로 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;