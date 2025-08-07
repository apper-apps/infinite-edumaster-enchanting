import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import CurriculumSidebar from "@/components/organisms/CurriculumSidebar";
import VideoUploadModal from "@/components/organisms/VideoUploadModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { videoService } from "@/services/api/videoService";
import { toast } from "react-toastify";

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole] = useState("member"); // Mock user role

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await videoService.getById(parseInt(id));
      setVideo(data);
    } catch (err) {
      setError("동영상을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (videoData) => {
    try {
      await videoService.update(video.Id, videoData);
      toast.success("동영상이 수정되었습니다!");
      setIsEditModalOpen(false);
      loadVideo();
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      console.error(err);
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube URL conversion
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo URL conversion
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url; // Return as is for direct embed URLs
  };

  const getCurrentVideoUrl = () => {
    if (!video || !video.curriculumUrls || video.curriculumUrls.length === 0) {
      return null;
    }
    return video.curriculumUrls[currentVideoIndex] || video.curriculumUrls[0];
  };

  const canAccess = () => {
    if (!video) return false;
    return video.allowedRoles.includes(userRole) || userRole === "admin" || 
           (userRole === "both" && (video.allowedRoles.includes("member") || video.allowedRoles.includes("master")));
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      free: "free",
      member: "member", 
      master: "master",
      both: "both",
      admin: "admin"
    };
    return variants[role] || "default";
  };

  useEffect(() => {
    loadVideo();
  }, [id]);

  if (loading) return <Loading type="player" />;
  if (error) return <Error message={error} onRetry={loadVideo} />;
  if (!video) return <Error message="동영상을 찾을 수 없습니다." onRetry={() => navigate(-1)} />;

  const currentVideoUrl = getCurrentVideoUrl();
  const embedUrl = getVideoEmbedUrl(currentVideoUrl);

  if (!canAccess()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <ApperIcon name="Lock" size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-6">이 콘텐츠를 시청하려면 적절한 등급이 필요합니다.</p>
          <div className="flex justify-center gap-2 mb-6">
            {video.allowedRoles.map((role) => (
              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                {role}
              </Badge>
            ))}
          </div>
          <Button onClick={() => navigate(-1)}>
            이전으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Video Content */}
        <div className="flex-1">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            돌아가기
          </Button>

          {/* Video Player */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="aspect-video">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="Play" size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">동영상을 재생할 수 없습니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
                  {video.isPinned && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <ApperIcon name="Pin" size={12} />
                      고정
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.allowedRoles.map((role) => (
                    <Badge key={role} variant={getRoleBadgeVariant(role)}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                variant="secondary"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Edit2" size={16} />
                수정
              </Button>
            </div>

            <div className="prose prose-gray max-w-none">
              {video.isHtmlDescription ? (
                <div dangerouslySetInnerHTML={{ __html: video.description }} />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {video.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <span>총 {video.curriculumUrls.length}개 강의</span>
              <span>현재 {currentVideoIndex + 1}번째 강의</span>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-80">
          <CurriculumSidebar
            curriculumUrls={video.curriculumUrls}
            currentIndex={currentVideoIndex}
            onVideoSelect={setCurrentVideoIndex}
          />
        </div>
      </div>

      {/* Curriculum Section - Mobile */}
      <div className="lg:hidden mt-8">
        <CurriculumSidebar
          curriculumUrls={video.curriculumUrls}
          currentIndex={currentVideoIndex}
          onVideoSelect={setCurrentVideoIndex}
        />
      </div>

      {/* Edit Modal */}
      <VideoUploadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        initialData={video}
        category={video.category}
      />
    </div>
  );
};

export default VideoPlayer;