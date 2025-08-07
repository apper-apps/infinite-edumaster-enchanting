import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import VideoCard from "@/components/molecules/VideoCard";
import VideoUploadModal from "@/components/organisms/VideoUploadModal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { videoService } from "@/services/api/videoService";
import { toast } from "react-toastify";

const Membership = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [userRole] = useState("member"); // Mock user role

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await videoService.getAll();
      const membershipVideos = data.filter(video => video.category === "membership");
      
      // Sort: pinned first, then by creation date
      const sortedVideos = membershipVideos.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setVideos(sortedVideos);
      setFilteredVideos(sortedVideos);
    } catch (err) {
      setError("동영상을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(term.toLowerCase()) ||
        video.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  };

  const handleUpload = async (videoData) => {
    try {
      await videoService.create(videoData);
      toast.success("동영상이 업로드되었습니다!");
      loadVideos();
    } catch (err) {
      toast.error("업로드에 실패했습니다.");
      console.error(err);
    }
  };

  const handleEdit = async (videoData) => {
    try {
      await videoService.update(editingVideo.Id, videoData);
      toast.success("동영상이 수정되었습니다!");
      setEditingVideo(null);
      loadVideos();
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await videoService.delete(videoId);
        toast.success("동영상이 삭제되었습니다!");
        loadVideos();
      } catch (err) {
        toast.error("삭제에 실패했습니다.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadVideos} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            멤버십 강의
          </h1>
          <p className="text-gray-600">멤버 전용 고품질 동영상 강의 콘텐츠</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="강의 검색..."
            />
          </div>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" size={16} />
            동영상 업로드
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <ApperIcon name="Video" className="text-primary-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
              <p className="text-gray-500">전체 강의</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg">
              <ApperIcon name="Pin" className="text-accent-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {videos.filter(v => v.isPinned).length}
              </p>
              <p className="text-gray-500">고정 강의</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <ApperIcon name="Users" className="text-secondary-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {videos.reduce((sum, v) => sum + v.curriculumUrls.length, 0)}
              </p>
              <p className="text-gray-500">총 영상 수</p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <Empty
          title="멤버십 강의가 없습니다"
          description="아직 등록된 멤버십 강의가 없습니다. 첫 번째 강의를 업로드해보세요."
          icon="Video"
          actionLabel="동영상 업로드"
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.Id}
              video={video}
              onEdit={setEditingVideo}
              onDelete={handleDelete}
              showActions={true}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
        category="membership"
      />

      {/* Edit Modal */}
      <VideoUploadModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        onSubmit={handleEdit}
        initialData={editingVideo}
        category="membership"
      />
    </div>
  );
};

export default Membership;