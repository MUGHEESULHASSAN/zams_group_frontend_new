"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import TransactionForm from "./TransactionForm"

const Finance = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    const mockTransactions = [
      {
        id: "TXN-001",
        date: "2024-01-15",
        description: "Office Supplies Purchase",
        type: "Expense",
        amount: 250.0,
        category: "Office Expenses",
        status: "Completed",
      },
      {
        id: "TXN-002",
        date: "2024-01-16",
        description: "Client Payment Received",
        type: "Income",
        amount: 5000.0,
        category: "Sales Revenue",
        status: "Completed",
      },
    ]
    setTransactions(mockTransactions)
    setFilteredTransactions(mockTransactions)
  }, [])

  const columns = [
    { key: "id", header: "Transaction ID" },
    { key: "date", header: "Date" },
    { key: "description", header: "Description" },
    {
      key: "type",
      header: "Type",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (value, row) => (
        <span className={row.type === "Income" ? "text-green" : "text-red"}>
          {row.type === "Income" ? "+" : "-"}${value.toFixed(2)}
        </span>
      ),
    },
    { key: "category", header: "Category" },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
  ]

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((txn) => (txn.id === editingTransaction.id ? { ...txn, ...transactionData } : txn)),
      )
    } else {
      const newTransaction = {
        id: `TXN-${String(transactions.length + 1).padStart(3, "0")}`,
        ...transactionData,
        date: new Date().toISOString().split("T")[0],
      }
      setTransactions([...transactions, newTransaction])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="finance-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <button
          className="primary-btn"
          onClick={() => {
            setEditingTransaction(null)
            setIsModalOpen(true)
          }}
        >
          ➕ Add Transaction
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search transactions..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredTransactions}
        onEdit={(txn) => {
          setEditingTransaction(txn)
          setIsModalOpen(true)
        }}
        onDelete={(txn) => {
          if (window.confirm(`Delete transaction ${txn.id}?`)) {
            setTransactions(transactions.filter((t) => t.id !== txn.id))
          }
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default Finance
