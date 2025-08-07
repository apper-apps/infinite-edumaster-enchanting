import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Label from "@/components/atoms/Label";
import RoleCheckboxes from "@/components/molecules/RoleCheckboxes";
import ApperIcon from "@/components/ApperIcon";

const VideoUploadModal = ({ isOpen, onClose, onSubmit, initialData = null, category }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    curriculumUrls: initialData?.curriculumUrls || [""],
    allowedRoles: initialData?.allowedRoles || ["free"],
    isPinned: initialData?.isPinned || false,
    isHtmlDescription: initialData?.isHtmlDescription || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      ...formData,
      category,
      thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      curriculumUrls: formData.curriculumUrls.filter(url => url.trim())
    };
    onSubmit(videoData);
    onClose();
  };

  const addCurriculumUrl = () => {
    setFormData(prev => ({
      ...prev,
      curriculumUrls: [...prev.curriculumUrls, ""]
    }));
  };

  const removeCurriculumUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculumUrls: prev.curriculumUrls.filter((_, i) => i !== index)
    }));
  };

  const updateCurriculumUrl = (index, value) => {
    setFormData(prev => ({
      ...prev,
      curriculumUrls: prev.curriculumUrls.map((url, i) => i === index ? value : url)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "동영상 수정" : "동영상 업로드"}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="description">설명</Label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.isHtmlDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHtmlDescription: e.target.checked }))}
                  className="mr-2"
                />
                HTML로 작성
              </label>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder={formData.isHtmlDescription ? "HTML 태그를 사용할 수 있습니다" : "동영상 설명을 입력하세요"}
            />
          </div>

          <div className="space-y-4">
            <Label>커리큘럼 동영상 URL</Label>
            {formData.curriculumUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateCurriculumUrl(index, e.target.value)}
                  placeholder={`커리큘럼 ${index + 1} URL`}
                />
                {formData.curriculumUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeCurriculumUrl(index)}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addCurriculumUrl}
              className="w-full flex items-center justify-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              커리큘럼 추가
            </Button>
          </div>

          <RoleCheckboxes
            selectedRoles={formData.allowedRoles}
            onChange={(roles) => setFormData(prev => ({ ...prev, allowedRoles: roles }))}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <Label htmlFor="isPinned" className="ml-2">
              상단 고정
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              {initialData ? "수정" : "업로드"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadModal;