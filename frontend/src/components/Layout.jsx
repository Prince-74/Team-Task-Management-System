import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-slate-50">{children}</main>
    </div>
  );
};

export default Layout;
