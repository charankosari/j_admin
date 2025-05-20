"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { APISDK } from "@/libs/api/index"
interface NewEmployeeModalProps {
  onClose: () => void;
  onSubmit: (employeeData: any) => Promise<void>;
}

interface EmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  role: string;
  profile_picture: string;
  created_at: Date;
  updated_at: Date;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ onClose, onSubmit }) => {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    first_name: '',
    last_name: '',
    email: '',
    country_code: '+91',
    phone_number: '',
    role: 'cafe_admin', // Ensure this is initialized correctly
    profile_picture: '',
    created_at: new Date(),
    updated_at: new Date(),
  });
  // const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState("https://jeevic-prod.s3.ap-south-1.amazonaws.com/jv-uploads/1747773837875-Profile_avatar_placeholder_large.png");
  const [showDeleteImage, setShowDeleteImage] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const api = APISDK.getInstance(); // Get an instance of APISDK
        const uploadResponse = await api.uploadFile(file); // Use uploadFile method
        const imageUrl = uploadResponse.url; // Assume the response contains the URL
        setProfileImage(imageUrl);
        setEmployeeData({ ...employeeData, profile_picture: imageUrl });
        setShowDeleteImage(true);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  // Create ref for the modal content


  // Effect to handle clicks outside the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);



  const handleDeleteImage = () => {
    setProfileImage("https://jeevic-prod.s3.ap-south-1.amazonaws.com/jv-uploads/1747773837875-Profile_avatar_placeholder_large.png");
    setShowDeleteImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = APISDK.getInstance();

  

    try {
      await onSubmit({ ...employeeData, profile_picture: profileImage });
      onClose();
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Employee"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
              <div className="flex space-x-2 py-2">
                <label className="cursor-pointer text-sm bg-white border-2 border-gray-300 rounded-md px-2 py-1 text-black">
                  Upload Image
                  <input type="file" className="hidden" accept="image/*"onChange={handleImageUpload} /> 
                </label>
                {showDeleteImage && (
                  <button type="button" className="text-sm bg-red-100 rounded-md px-2 py-1 text-red-500" onClick={handleDeleteImage}>
                    Delete Image
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  value={employeeData.first_name}
                  onChange={(e) => setEmployeeData({ ...employeeData, first_name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  value={employeeData.last_name}
                  onChange={(e) => setEmployeeData({ ...employeeData, last_name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Employee Department</label>
                <div className="relative">
                  <select
                    value={employeeData.role}
                    onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-gray-800 appearance-none"
                    required
                  >
                    <option value="Cafe_admin">Cafe Admin</option>
                    <option value="ecommerce_admin">Ecommerce Staff</option>
                    <option value="admin">Super admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Employee Email</label>
                <input
                  type="email"
                  value={employeeData.email}
                  onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Employee Mobile</label>
                <input
                  type="tel"
                  value={employeeData.phone_number}
                  onChange={(e) => setEmployeeData({ ...employeeData, phone_number: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Create Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}