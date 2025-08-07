import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const BlogCard = ({ post, onEdit, onDelete, showActions = false, userRole = "free" }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest('.action-button')) return;
    navigate(`/blog/${post.Id}`);
  };

  const canAccess = post.allowedRoles.includes(userRole) || userRole === "admin" || 
    (userRole === "both" && (post.allowedRoles.includes("member") || post.allowedRoles.includes("master")));

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

  return (
    <article 
      className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${!canAccess ? 'opacity-60' : ''}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={post.thumbnailUrl} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        {!canAccess && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <ApperIcon name="Lock" size={32} className="mx-auto mb-2" />
              <p className="text-sm">접근 권한이 필요합니다</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-semibold text-xl text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          {showActions && (
            <div className="flex gap-1 ml-2 action-button">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="p-1.5 hover:bg-primary-50 hover:text-primary-600"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.Id);
                }}
                className="p-1.5 hover:bg-red-50 hover:text-red-600"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.allowedRoles.map((role) => (
              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                {role}
              </Badge>
            ))}
          </div>
          <time className="text-xs text-gray-500">
            {format(new Date(post.createdAt), "yyyy.MM.dd", { locale: ko })}
          </time>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;