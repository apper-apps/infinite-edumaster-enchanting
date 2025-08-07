import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { videoService } from "@/services/api/videoService";
import { blogService } from "@/services/api/blogService";
import { testimonialService } from "@/services/api/testimonialService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole] = useState("admin"); // Mock admin role

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [usersData, videosData, blogsData, testimonialsData] = await Promise.all([
        userService.getAll(),
        videoService.getAll(),
        blogService.getAll(),
        testimonialService.getAll()
      ]);

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalVideos: videosData.length,
        totalBlogs: blogsData.length,
        totalTestimonials: testimonialsData.length,
        usersByRole: {
          free: usersData.filter(u => u.role === "free").length,
          member: usersData.filter(u => u.role === "member").length,
          master: usersData.filter(u => u.role === "master").length,
          both: usersData.filter(u => u.role === "both").length,
          admin: usersData.filter(u => u.role === "admin").length
        }
      });
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.update(userId, { role: newRole });
      toast.success("사용자 등급이 변경되었습니다!");
      loadData();
    } catch (err) {
      toast.error("등급 변경에 실패했습니다.");
      console.error(err);
    }
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

  const getRoleLabel = (role) => {
    const labels = {
      free: "무료",
      member: "멤버",
      master: "마스터",
      both: "양쪽 모두",
      admin: "관리자"
    };
    return labels[role] || role;
  };

  useEffect(() => {
    loadData();
  }, []);

  if (userRole !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <ApperIcon name="Shield" size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600 mb-6">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
          관리자 대시보드
        </h1>
        <p className="text-gray-600">시스템 전반의 상태와 사용자 관리</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Users" className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-gray-500">전체 사용자</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ApperIcon name="Video" className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
              <p className="text-gray-500">동영상 강의</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ApperIcon name="BookOpen" className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
              <p className="text-gray-500">인사이트 글</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ApperIcon name="MessageCircle" className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</p>
              <p className="text-gray-500">도전 후기</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">등급별 사용자 분포</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.usersByRole && Object.entries(stats.usersByRole).map(([role, count]) => (
            <div key={role} className="text-center">
              <Badge variant={getRoleBadgeVariant(role)} className="text-lg px-4 py-2 mb-2">
                {getRoleLabel(role)}
              </Badge>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">사용자 관리</h2>
        </div>
        
        {users.length === 0 ? (
          <Empty
            title="등록된 사용자가 없습니다"
            description="아직 시스템에 등록된 사용자가 없습니다."
            icon="Users"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    현재 등급
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등급 변경
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="free">무료</option>
                        <option value="member">멤버</option>
                        <option value="master">마스터</option>
                        <option value="both">양쪽 모두</option>
                        <option value="admin">관리자</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;