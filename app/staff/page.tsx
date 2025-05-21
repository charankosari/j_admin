"use client"

import { useState } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { EmployeeMetrics } from "@/components/employees/employee-metrics"
import { EmployeeTable } from "@/components/employees/employee-table"
import { NewEmployeeModal } from "@/components/employees/new-employee-modal"
import { Search } from "lucide-react"
import { APISDK } from "@/libs/api/index" // Import the APISDK
import { useEffect } from "react"
interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  role: string;
  profile_picture: string;
  updated_at:string;
  created_at:string;
  employeeid:string;
}
export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([]) 
  const fetchEmployees = async () => {
    try {
      const api = APISDK.getInstance();
      const response = await api.getEmployees(); // Assuming getEmployees method exists
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };
  const handleCreateOrUpdateEmployee = async (employeeData:any) => {
    try {
    
      fetchEmployees();
      // Handle success (e.g., refresh the employee list, close modal)
      console.log("Employee created/updated successfully");
    } catch (error) {
      console.error("Failed to create/update employee:", error);
    }
  };

  const DeleteEmployee = async (employeeid:string) => {
    try {
      const api = APISDK.getInstance();
      await api.deleteEmployee(employeeid); // Assuming getEmployees method exists
      fetchEmployees();
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <Breadcrumb items={["Employee", "Overview"]} />
      <main className="flex-1 p-6">
        {/* <EmployeeMetrics /> */}

        <div className="mt-8 border rounded-lg p-2">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-800">Employee Management</h2>
            <p className="text-sm text-gray-500">Manage all the employees at one place</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search with Employee Name or ID"
                className="pl-10 pr-4 py-2 border rounded-md placeholder:text-gray-400 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button
              onClick={() => setShowNewEmployeeModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              New Employee
            </button>
          </div>

          <EmployeeTable  employees={employees} onUpdate={handleCreateOrUpdateEmployee} onDelete={DeleteEmployee} search={searchTerm}/>
        </div>
      </main>

      {showNewEmployeeModal && (
        <NewEmployeeModal
          onClose={() => setShowNewEmployeeModal(false)}
          isUpdate={false}
          initialData={{
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            country_code: "+91",
            phone_number: "",
            role: "",
            profile_picture: "",
          }}
          onSubmit={handleCreateOrUpdateEmployee} // Pass the handler to the modal
        />
      )}
    </>
  )
}
