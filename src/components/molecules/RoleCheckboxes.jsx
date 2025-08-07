import React from "react";

const RoleCheckboxes = ({ selectedRoles, onChange }) => {
  const roles = [
    { value: "free", label: "무료" },
    { value: "member", label: "멤버" },
    { value: "master", label: "마스터" },
    { value: "both", label: "양쪽 모두" }
  ];

  const handleRoleChange = (roleValue) => {
    const updatedRoles = selectedRoles.includes(roleValue)
      ? selectedRoles.filter(role => role !== roleValue)
      : [...selectedRoles, roleValue];
    onChange(updatedRoles);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">접근 권한</label>
      <div className="flex flex-wrap gap-4">
        {roles.map((role) => (
          <label key={role.value} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedRoles.includes(role.value)}
              onChange={() => handleRoleChange(role.value)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">{role.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleCheckboxes;