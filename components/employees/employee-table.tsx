"use client"
import { useState } from "react"
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { NewEmployeeModal } from "@/components/employees/new-employee-modal" 
interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  role: string;
  profile_picture: string;
  updated_at: string;
  created_at: string;
  employeeid: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onUpdate: (employeeData: any) => Promise<void>;
  onDelete: (employeeId: string) => Promise<void>;
  search:string;
}

export function EmployeeTable({ employees, onUpdate,onDelete,search }: EmployeeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const filteredEmployees = employees.filter((employee) =>
    employee.first_name.toLowerCase().includes(search.toLowerCase()) ||
    employee.last_name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.phone_number.includes(search) ||
    employee.employeeid.includes(search)
  );
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDelete=(employeeId:string)=>{
    const confirmDelete=window.confirm("Are you sure you want to delete this employee?");
    if(confirmDelete){
      onDelete(employeeId)
    }
  }
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    setShowModal(true); // Show the modal
  };

  return (
    <div className="bg-white border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentEmployees.map((employee, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={employee.profile_picture || "https://i.pinimg.com/736x/62/7d/7a/627d7ac2d198b462f5a558ac49ecfc9f.jpg"}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{`${employee.first_name} ${employee.last_name}`}</div>
                    <div className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded inline-block">
                      {employee.role}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeid}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone_number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
               
                  <button
                    className="p-1.5 bg-orange-100 rounded-md text-orange-600 hover:bg-orange-200"
                    onClick={() => handleEdit(employee)}// Example usage of onUpdate
                  >
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 bg-red-100 rounded-md text-red-600 hover:bg-red-200"  onClick={() => handleDelete(employee.id)} >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-3 flex items-center justify-between border-t">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, currentEmployees.length)} of {currentEmployees.length} Results
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-3">Page {currentPage} of {totalPages}</span>
          <div className="flex">
            <button
              className="px-2 py-1 border rounded-l-md bg-gray-100 text-gray-600"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="px-2 py-1 border-t border-b border-r rounded-r-md bg-gray-100 text-gray-600"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {showModal && selectedEmployee && (
        <NewEmployeeModal
          onClose={() => setShowModal(false)}
          onSubmit={onUpdate}
          isUpdate={!!selectedEmployee}
          initialData={selectedEmployee} // Pass existing data to the modal
        />
      )}
    </div>
  )
}
