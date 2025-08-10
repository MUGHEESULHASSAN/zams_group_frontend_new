import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import CustomerForm from "./CustomerForm"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    const mockCustomers = [
      {
        id: "CUST-001",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        company: "ABC Corp",
        status: "Active",
        category: "Retail",
        address: "123 Main St",
        cnic: "12345-6789012-3",
        customerCode: "CUST-001",
        priceType: "Standard",
        ntnNumber: "NTN-001",
      },
      {
        id: "CUST-002",
        name: "Jane Doe",
        email: "jane.doe@email.com",
        phone: "+1-555-0124",
        company: "XYZ Ltd",
        status: "Active",
        category: "Wholesale",
        address: "456 Elm St",
        cnic: "23456-7890123-4",
        customerCode: "CUST-002",
        priceType: "Premium",
        ntnNumber: "NTN-002",
      },
      {
        id: "CUST-003",
        name: "Bob Johnson",
        email: "bob.johnson@email.com",
        phone: "+1-555-0125",
        company: "Tech Solutions",
        status: "Inactive",
        category: "Retail",
        address: "789 Oak St",
        cnic: "34567-8901234-5",
        customerCode: "CUST-003",
        priceType: "Standard",
        ntnNumber: "NTN-003",
      },
    ]
    setCustomers(mockCustomers)
    setFilteredCustomers(mockCustomers)
  }, [])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const columns = [
    { key: "id", header: "Customer ID", width: "120px" },
    { key: "name", header: "Name", width: "150px" },
    { key: "email", header: "Email", width: "250px" },
    { key: "phone", header: "Phone", width: "150px" },
    { key: "company", header: "Company", width: "150px" },
    { key: "category", header: "Category", width: "120px" },
    { key: "address", header: "Address", width: "200px" },
    { key: "cnic", header: "CNIC Number", width: "180px" },
    { key: "customerCode", header: "Customer Code", width: "150px" },
    { key: "priceType", header: "Price Type", width: "120px" },
    { key: "ntnNumber", header: "NTN Number", width: "150px" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
      width: "120px",
    },
  ]

  const handleNewCustomer = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      setCustomers(customers.filter((c) => c.id !== customer.id))
    }
  }

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      setCustomers(
        customers.map((customer) => (customer.id === editingCustomer.id ? { ...customer, ...customerData } : customer)),
      )
    } else {
      const newCustomer = {
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
        ...customerData,
      }
      setCustomers([...customers, newCustomer])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="primary-btn" onClick={handleNewCustomer}>
          ➕ Add Customer
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search customers..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm customer={editingCustomer} onSave={handleSaveCustomer} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Customers
