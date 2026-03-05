import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/common/AppLayout";

// Auth
import LoginPage from "./components/Auth/LoginPage";
import Register from "./components/Auth/Register";
import OtpPage from "./components/Auth/OtpPage";

// Dashboard
import Dashboard from "./components/Dashboard/Dashboard";

// Accounts
import AccountsSummary from "./components/Accounts/AccountsSummary";

// FundTransfer
import FundTransfer from "./components/FundTransfer/FundTransfer";

// Payments
import PaymentsBills from "./components/Payments/PaymentsBills";

// Profile
import ProfileManagement from "./components/Profile/ProfileManagement";
import PersonalDetailsUpdate from "./components/Profile/PersonalDetailsUpdate";
import ChangePassword from "./components/Profile/ChangePassword";
import ManageBeneficiaries from "./components/Profile/ManageBeneficiaries";
import HighSecurityOptions from "./components/Profile/HighSecurityOptions";
import AddBeneficiary from "./components/Profile/AddBeneficiary";

// Support
import CustomerSupport from "./components/Support/CustomerSupport";
import FAQs from "./components/Support/FAQs";
import ContactInformation from "./components/Support/ContactInformation";
import TroubleshootingGuides from "./components/Support/TroubleshootingGuides";
import FeedbackSuggestions from "./components/Support/FeedbackSuggestions";
import ServiceRequests from "./components/Support/ServiceRequests";

// Logout
import Logout from "./components/Logout/Logout";

/**
 * Wraps a component with the AppLayout (sidebar + main content area)
 * and ProtectedRoute (requires authentication).
 */
function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Protected Routes — wrapped with Sidebar layout */}
          <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/accounts-summary" element={<ProtectedPage><AccountsSummary /></ProtectedPage>} />
          <Route path="/fund-transfer" element={<ProtectedPage><FundTransfer /></ProtectedPage>} />
          <Route path="/payments-bills" element={<ProtectedPage><PaymentsBills /></ProtectedPage>} />
          <Route path="/profile-management" element={<ProtectedPage><ProfileManagement /></ProtectedPage>} />
          <Route path="/profile/personal-details-update" element={<ProtectedPage><PersonalDetailsUpdate /></ProtectedPage>} />
          <Route path="/profile/change-password" element={<ProtectedPage><ChangePassword /></ProtectedPage>} />
          <Route path="/profile/manage-beneficiaries" element={<ProtectedPage><ManageBeneficiaries /></ProtectedPage>} />
          <Route path="/profile/high-security-options" element={<ProtectedPage><HighSecurityOptions /></ProtectedPage>} />
          <Route path="/add-beneficiary" element={<ProtectedPage><AddBeneficiary /></ProtectedPage>} />
          <Route path="/customer-support" element={<ProtectedPage><CustomerSupport /></ProtectedPage>} />
          <Route path="/faqs" element={<ProtectedPage><FAQs /></ProtectedPage>} />
          <Route path="/contact-information" element={<ProtectedPage><ContactInformation /></ProtectedPage>} />
          <Route path="/troubleshooting" element={<ProtectedPage><TroubleshootingGuides /></ProtectedPage>} />
          <Route path="/feedback-suggestions" element={<ProtectedPage><FeedbackSuggestions /></ProtectedPage>} />
          <Route path="/service-requests" element={<ProtectedPage><ServiceRequests /></ProtectedPage>} />

          {/* Logout */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
