import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Import all your pages ---
import UserLogin from '../UserLogin';
import Home from '../Home';
import Events from '../Events';
import Calendars from '../Calendar';
import Chats from '../Chat';
import AdminEvents from '../AdminEvents';
import Admin from '../AdminLogin'
import Accounts from '../Accounts'
import ManageEvents from '../AdminManageEvents'
import AdminReoprts from '../AdminEventReports'
import Scanner from '../Scanner';
import EventApproval from '../EventApproval';
import UserAccounts from '../UserAccounts';

// ✅ IMPORT SECURITY FILES
import RestrictGuest from '../RestrictGuest';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Login & Public Pages */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />

        {/* 2. 🔒 GUEST RESTRICTED ROUTES (For regular logged-in users) */}
        <Route element={<RestrictGuest />}>
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendars />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/event-scanner" element={<Scanner />} />
        </Route>


        <Route
          path="/adminEvents"
          element={
            <ProtectedRoute allowedRoles={['admin', 'co-admin']}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manageEvents"
          element={
            <ProtectedRoute allowedRoles={['admin', 'co-admin']}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'co-admin']}>
              <AdminReoprts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eventApproval"
          element={
            <ProtectedRoute allowedRoles={['admin', 'co-admin']}>
              <EventApproval />
            </ProtectedRoute>
          }
        />

        {/* 4. ⛔ SUPER ADMIN ONLY ROUTES */}
        {/* This is the ONLY route where Co-Admin is blocked */}

        <Route
          path="/accounts"
          element={
            <ProtectedRoute allowedRoles={['admin']}> {/* ❌ No 'co-admin' here */}
              <Accounts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/userAccounts"
          element={
            <ProtectedRoute allowedRoles={['admin']}> {/* ❌ No 'co-admin' here */}
              <UserAccounts/>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;