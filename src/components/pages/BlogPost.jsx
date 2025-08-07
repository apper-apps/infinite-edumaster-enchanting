import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import BlogCard from "@/components/molecules/BlogCard";
import BlogUploadModal from "@/components/organisms/BlogUploadModal";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { blogService } from "@/services/api/blogService";
import { toast } from "react-toastify";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole] = useState("free"); // Mock user role

  const loadPost = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await blogService.getById(parseInt(id));
      setPost(data);
      
      // Load related posts (exclude current post)
      const allPosts = await blogService.getAll();
      const related = allPosts
        .filter(p => p.Id !== data.Id)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (err) {
      setError("글을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (postData) => {
    try {
      await blogService.update(post.Id, postData);
      toast.success("글이 수정되었습니다!");
      setIsEditModalOpen(false);
      loadPost();
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      console.error(err);
    }
  };

  const canAccess = () => {
    if (!post) return false;
    return post.allowedRoles.includes(userRole) || userRole === "admin" || 
           (userRole === "both" && (post.allowedRoles.includes("member") || post.allowedRoles.includes("master")));
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
    loadPost();
  }, [id]);

  if (loading) return <Loading type="player" />;
  if (error) return <Error message={error} onRetry={loadPost} />;
  if (!post) return <Error message="글을 찾을 수 없습니다." onRetry={() => navigate(-1)} />;

  if (!canAccess()) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <ApperIcon name="Lock" size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-6">이 글을 읽으려면 적절한 등급이 필요합니다.</p>
          <div className="flex justify-center gap-2 mb-6">
            {post.allowedRoles.map((role) => (
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ApperIcon name="ArrowLeft" size={16} />
        인사이트 목록으로
      </Button>

      {/* Article */}
      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80">
          <img 
            src={post.thumbnailUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.allowedRoles.map((role) => (
                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                  {role}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {post.title}
            </h1>
            <div className="flex items-center justify-between text-white/80">
              <time className="text-sm">
                {format(new Date(post.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
              </time>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="Edit2" size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-lg prose-gray max-w-none">
            {post.isHtmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            다른 인사이트 글
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.Id}
                post={relatedPost}
                userRole={userRole}
              />
            ))}
          </div>
        </section>
      )}

      {/* Edit Modal */}
      <BlogUploadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        initialData={post}
      />
    </div>
  );
};

export default BlogPost;