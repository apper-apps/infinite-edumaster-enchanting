import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 mb-4">
        <ApperIcon name={icon} size={64} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || "콘텐츠가 없습니다"}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description || "아직 등록된 콘텐츠가 없습니다. 첫 번째 콘텐츠를 등록해보세요."}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;