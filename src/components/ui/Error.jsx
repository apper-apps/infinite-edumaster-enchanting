import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-red-500 mb-4">
        <ApperIcon name="AlertCircle" size={64} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        오류가 발생했습니다
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          다시 시도
        </Button>
      )}
    </div>
  );
};

export default Error;