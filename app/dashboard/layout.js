import Footer from "./components/Footer.component";
import Navbar from "./components/Navbar.component";

export default function DashboardLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col h-screen">
      <Navbar />
      <main className="my-6 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
