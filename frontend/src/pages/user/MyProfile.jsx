import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="text-gray-600">User Account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
          </div>

          {user?.phone && (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-semibold">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
