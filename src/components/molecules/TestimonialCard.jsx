import React, { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const TestimonialCard = ({ testimonial, onEdit, onDelete, onToggleVisibility, userRole = "free" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(testimonial.content);

  const handleSaveEdit = () => {
    onEdit(testimonial.Id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(testimonial.content);
    setIsEditing(false);
  };

  const isOwner = testimonial.userId === "current-user";
  const isAdmin = userRole === "admin";

  return (
    <div className={`bg-white rounded-xl shadow-lg border p-6 transition-all duration-300 hover:shadow-xl ${testimonial.isHidden ? 'opacity-50 border-gray-300' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {testimonial.userId.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">사용자 {testimonial.userId.slice(-4)}</p>
            <time className="text-sm text-gray-500">
              {format(new Date(testimonial.createdAt), "yyyy.MM.dd HH:mm", { locale: ko })}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {testimonial.isHidden && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              숨김
            </span>
          )}
          
          {isOwner && !isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-primary-50 hover:text-primary-600"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          )}

          {isAdmin && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleVisibility(testimonial.Id)}
                className="p-1.5 hover:bg-yellow-50 hover:text-yellow-600"
              >
                <ApperIcon name={testimonial.isHidden ? "Eye" : "EyeOff"} size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(testimonial.Id)}
                className="p-1.5 hover:bg-red-50 hover:text-red-600"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="도전 후기를 작성해주세요 (최대 500자)"
            maxLength={500}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {editContent.length}/500
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                취소
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                저장
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {testimonial.content}
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;