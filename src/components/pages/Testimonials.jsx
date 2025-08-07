import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import TestimonialCard from "@/components/molecules/TestimonialCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { testimonialService } from "@/services/api/testimonialService";
import { toast } from "react-toastify";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTestimonial, setNewTestimonial] = useState("");
  const [userRole] = useState("member"); // Mock user role

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await testimonialService.getAll();
      
      // Sort by creation date, visible posts first
      const sortedTestimonials = data.sort((a, b) => {
        if (a.isHidden && !b.isHidden) return 1;
        if (!a.isHidden && b.isHidden) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setTestimonials(sortedTestimonials);
    } catch (err) {
      setError("도전 후기를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTestimonial.trim()) return;

    try {
      const testimonialData = {
        userId: "current-user",
        content: newTestimonial.trim(),
        isHidden: false
      };

      await testimonialService.create(testimonialData);
      toast.success("도전 후기가 등록되었습니다!");
      setNewTestimonial("");
      loadTestimonials();
    } catch (err) {
      toast.error("등록에 실패했습니다.");
      console.error(err);
    }
  };

  const handleEdit = async (testimonialId, updatedData) => {
    try {
      await testimonialService.update(testimonialId, updatedData);
      toast.success("후기가 수정되었습니다!");
      loadTestimonials();
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await testimonialService.delete(testimonialId);
        toast.success("후기가 삭제되었습니다!");
        loadTestimonials();
      } catch (err) {
        toast.error("삭제에 실패했습니다.");
        console.error(err);
      }
    }
  };

  const handleToggleVisibility = async (testimonialId) => {
    try {
      const testimonial = testimonials.find(t => t.Id === testimonialId);
      await testimonialService.update(testimonialId, {
        isHidden: !testimonial.isHidden
      });
      toast.success(testimonial.isHidden ? "후기가 표시됩니다!" : "후기가 숨겨졌습니다!");
      loadTestimonials();
    } catch (err) {
      toast.error("변경에 실패했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadTestimonials} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          도전 후기
        </h1>
        <p className="text-gray-600">
          학습자들의 생생한 도전 경험과 성공 스토리를 공유해보세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <ApperIcon name="MessageCircle" className="text-primary-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => !t.isHidden).length}
              </p>
              <p className="text-gray-500">공개 후기</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <ApperIcon name="Users" className="text-secondary-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
              <p className="text-gray-500">전체 후기</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Testimonial Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div>
            <p className="font-medium text-gray-900">도전 후기 작성</p>
            <p className="text-sm text-gray-500">500자까지 작성 가능</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newTestimonial}
            onChange={(e) => setNewTestimonial(e.target.value)}
            placeholder="당신의 도전 경험을 공유해주세요..."
            maxLength={500}
            className="min-h-[120px]"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {newTestimonial.length}/500
            </span>
            <Button 
              type="submit" 
              disabled={!newTestimonial.trim()}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Send" size={16} />
              등록
            </Button>
          </div>
        </form>
      </div>

      {/* Testimonials List */}
      {testimonials.length === 0 ? (
        <Empty
          title="도전 후기가 없습니다"
          description="첫 번째 도전 후기를 작성해보세요!"
          icon="MessageCircle"
        />
      ) : (
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.Id}
              testimonial={testimonial}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;