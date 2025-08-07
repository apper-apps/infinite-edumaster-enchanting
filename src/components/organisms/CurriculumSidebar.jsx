import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CurriculumSidebar = ({ curriculumUrls, currentIndex = 0, onVideoSelect }) => {
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getVideoThumbnail = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  if (!curriculumUrls || curriculumUrls.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="PlayCircle" className="text-primary-500" size={20} />
        <h3 className="font-semibold text-lg text-gray-900">커리큘럼</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {curriculumUrls.length}개
        </span>
      </div>

      <div className="space-y-3">
        {curriculumUrls.map((url, index) => {
          const thumbnail = getVideoThumbnail(url);
          const isActive = index === currentIndex;

          return (
            <div
              key={index}
              onClick={() => onVideoSelect(index)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200"
                  : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div className="flex-shrink-0">
                {thumbnail ? (
                  <img 
                    src={thumbnail}
                    alt={`강의 ${index + 1}`}
                    className="w-16 h-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <ApperIcon name="Play" size={16} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    isActive 
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {index + 1}
                  </span>
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-primary-700" : "text-gray-700"
                  )}>
                    강의 {index + 1}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {url}
                </p>
              </div>

              {isActive && (
                <ApperIcon name="Play" size={16} className="text-primary-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumSidebar;