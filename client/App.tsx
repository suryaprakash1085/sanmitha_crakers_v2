import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader } from "@/components/Loader";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingActions } from "@/components/FloatingActions";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Products from "./pages/Products.tsx";
import QuickOrder from "./pages/QuickOrder.tsx";
import Checkout from "./pages/Checkout.tsx";
import Offers from "./pages/Offers.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AdminOrders from "./pages/admin/Orders.tsx";
import AdminProducts from "./pages/admin/Products.tsx";
import AdminCategories from "./pages/admin/Categories.tsx";
import AdminServices from "./pages/admin/Services.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import AdminCompany from "./pages/admin/Company.tsx";
import AdminCustomization from "./pages/admin/Customization.tsx";
import AdminPdfTemplate from "./pages/admin/PdfTemplate.tsx";
import AdminEmailSettings from "./pages/admin/EmailSettings.tsx";
import AdminAccessControl from "./pages/admin/AccessControl.tsx";
import AdminReport from "./pages/admin/Report.tsx";

import { useApplyAppCustomization } from "@/lib/appSettings";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  useApplyAppCustomization();

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <FloatingActions />}
      <Routes>
        <Route path="/home" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/" element={<Products />} />
        <Route path="/collections" element={<Products />} />
        <Route path="/quick-order" element={<QuickOrder />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/report" element={<AdminLayout><AdminReport /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/company" element={<AdminLayout><AdminCompany /></AdminLayout>} />
        <Route path="/admin/customization" element={<AdminLayout><AdminCustomization /></AdminLayout>} />
      
        <Route path="/admin/pdf-template" element={<AdminLayout><AdminPdfTemplate /></AdminLayout>} />
        <Route path="/admin/email-settings" element={<AdminLayout><AdminEmailSettings /></AdminLayout>} />

         <Route path="/admin/access-control" element={<AdminLayout><AdminAccessControl /></AdminLayout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          {!loaded && <Loader />}
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
