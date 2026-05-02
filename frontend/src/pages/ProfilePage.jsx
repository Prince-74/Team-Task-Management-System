import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Profile</h2>
      <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200 max-w-md">
        <p className="text-sm text-slate-500">Name</p>
        <p className="text-lg font-medium text-slate-900 mb-3">{user?.name}</p>

        <p className="text-sm text-slate-500">Email</p>
        <p className="text-lg font-medium text-slate-900 mb-3">{user?.email}</p>

        <p className="text-sm text-slate-500">Role</p>
        <p className="text-lg font-medium text-slate-900">{user?.role}</p>
      </div>
    </Layout>
  );
};

export default ProfilePage;
