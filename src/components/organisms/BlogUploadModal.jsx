import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Label from "@/components/atoms/Label";
import RoleCheckboxes from "@/components/molecules/RoleCheckboxes";
import RichTextEditor from "@/components/atoms/RichTextEditor";
import ApperIcon from "@/components/ApperIcon";
const BlogUploadModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    excerpt: initialData?.excerpt || "",
    allowedRoles: initialData?.allowedRoles || ["free"],
    isHtmlContent: initialData?.isHtmlContent || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      ...formData,
      thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      excerpt: formData.excerpt || formData.content.substring(0, 150)
    };
    onSubmit(blogData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "글 수정" : "새 글 작성"}
            </h2>
            <Button variant="ghost" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">썸네일 이미지 URL</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
              placeholder="이미지 URL을 입력하지 않으면 기본 이미지가 사용됩니다"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">요약 (선택사항)</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              placeholder="글의 간단한 요약을 입력하세요"
            />
          </div>

<div className="space-y-2">
            <Label htmlFor="content">본문 *</Label>
            <RichTextEditor
              id="content"
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="글 내용을 입력하세요"
              htmlPlaceholder="HTML 태그를 사용할 수 있습니다"
              isHtml={formData.isHtmlContent}
              onHtmlToggle={(isHtml) => setFormData(prev => ({ ...prev, isHtmlContent: isHtml }))}
              rows={15}
              required
            />
          </div>

          <RoleCheckboxes
            selectedRoles={formData.allowedRoles}
            onChange={(roles) => setFormData(prev => ({ ...prev, allowedRoles: roles }))}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              {initialData ? "수정" : "발행"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogUploadModal;