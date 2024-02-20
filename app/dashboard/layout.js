import { Suspense } from "react";
import Footer from "./components/Footer.component";
import Navbar from "./components/Navbar.component";
import Loading from "./loading";

export default function DashboardLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col h-screen">
      <Navbar />
      <main className="my-6 flex-1">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
