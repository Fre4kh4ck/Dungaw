import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from '../AdminLogin';
import UserLogin from '../UserLogin';
import Home from '../Home';
import Calendar from '../Calendar';
import Events from '../Events';
import Chats from '../Chat';
import ContactUs from '../ContactUs';
import AdminEvents from '../AdminEvents';
import DeptCalendar from '../DeptCalendar';
import Accounts from '../Accounts';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<UserLogin />} />
        <Route path='/' element={<UserLogin />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/home' element={<Home />} />

        {/* ✅ FIXED — Only one Protected Route for adminEvents */}
        <Route
          path="/adminEvents"
          element={
            <ProtectedRoute allowedRoles={["admin", "co-admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/events' element={<Events />} />
        <Route path='/chats' element={<Chats />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/DepartmentCalendar' element={<DeptCalendar />} />
        <Route path='/accounts' element={<Accounts />} />
      </Routes>
    </BrowserRouter>
  );
}
