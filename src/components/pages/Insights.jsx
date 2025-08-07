import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import BlogCard from "@/components/molecules/BlogCard";
import BlogUploadModal from "@/components/organisms/BlogUploadModal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { blogService } from "@/services/api/blogService";
import { toast } from "react-toastify";

const Insights = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [userRole] = useState("free"); // Mock user role

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogService.getAll();
      
      // Sort by creation date
      const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBlogs(sortedBlogs);
      setFilteredBlogs(sortedBlogs);
    } catch (err) {
      setError("인사이트를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(term.toLowerCase()) ||
        blog.content.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  const handleUpload = async (blogData) => {
    try {
      await blogService.create(blogData);
      toast.success("글이 발행되었습니다!");
      loadBlogs();
    } catch (err) {
      toast.error("발행에 실패했습니다.");
      console.error(err);
    }
  };

  const handleEdit = async (blogData) => {
    try {
      await blogService.update(editingBlog.Id, blogData);
      toast.success("글이 수정되었습니다!");
      setEditingBlog(null);
      loadBlogs();
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await blogService.delete(blogId);
        toast.success("글이 삭제되었습니다!");
        loadBlogs();
      } catch (err) {
        toast.error("삭제에 실패했습니다.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadBlogs} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
            인사이트
          </h1>
          <p className="text-gray-600">전문가가 전하는 업계 트렌드와 실무 노하우</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="글 검색..."
            />
          </div>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600"
          >
            <ApperIcon name="PenTool" size={16} />
            글 작성
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg">
              <ApperIcon name="BookOpen" className="text-accent-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              <p className="text-gray-500">전체 글</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <ApperIcon name="Calendar" className="text-primary-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString("ko-KR", { month: "long" })}
              </p>
              <p className="text-gray-500">이번 달</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <Empty
          title="인사이트 글이 없습니다"
          description="아직 등록된 인사이트 글이 없습니다. 첫 번째 글을 작성해보세요."
          icon="BookOpen"
          actionLabel="글 작성"
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.Id}
              post={blog}
              onEdit={setEditingBlog}
              onDelete={handleDelete}
              showActions={true}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <BlogUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
      />

      {/* Edit Modal */}
      <BlogUploadModal
        isOpen={!!editingBlog}
        onClose={() => setEditingBlog(null)}
        onSubmit={handleEdit}
        initialData={editingBlog}
      />
    </div>
  );
};

export default Insights;