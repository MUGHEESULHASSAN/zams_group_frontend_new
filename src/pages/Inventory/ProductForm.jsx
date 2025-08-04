"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import JsBarcode from "jsbarcode"
import "./ProductForm.css" // New CSS file for form specific styles

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // General
    id: "", // Internal ID, not directly editable by user
    itemCode: "", // Auto-generated, read-only
    description: "",
    category: "",
    unitType: "",
    // Sales Info
    mrp: 0,
    tradePrice: 0,
    discount: 0,
    taxCode: "",
    brandName: "",
    color: "",
    // Purchase Info
    itemBarcode: "", // This will store the generated barcode value
    // Existing fields
    name: "",
    sku: "",
    stock: 0,
    price: 0,
    status: "In Stock",
    // New field for image
    imageUrl: "",
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [brandSuggestions, setBrandSuggestions] = useState([])
  const barcodeCanvasRef = useRef(null)
  const fileInputRef = useRef(null) // Ref for the hidden file input

  // Mock data for brand suggestions (in a real app, this would come from an API)
  const allBrands = useMemo(
    () => [
      "TechBrand",
      "ComfortSeating",
      "ClickTech",
      "BrightHome",
      "Samsung",
      "Apple",
      "Sony",
      "HP",
      "Dell",
      "Logitech",
      "Steelcase",
      "Herman Miller",
      "IKEA",
      "Nike",
      "Adidas",
      "Puma",
      "Zara",
      "H&M",
      "Penguin Books",
      "Random House",
      "Coca-Cola",
      "Pepsi",
      "Nestle",
      "Bosch",
      "Makita",
      "Stanley",
    ],
    [],
  )

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      // Generate new item code for new products
      const newItemCode = `ITEM-${Date.now().toString().slice(-6)}`
      setFormData((prev) => ({
        ...prev,
        itemCode: newItemCode,
        id: `PROD-${Date.now().toString().slice(-6)}`, // Generate a unique ID for new products
        imageUrl: "", // Clear image for new product
      }))
    }
  }, [product])

  // Effect to generate barcode whenever itemCode changes
  useEffect(() => {
    if (formData.itemCode && barcodeCanvasRef.current) {
      try {
        JsBarcode(barcodeCanvasRef.current, formData.itemCode, {
          format: "CODE128", // Common barcode format
          displayValue: true,
          width: 2,
          height: 50,
          margin: 10,
        })
        setFormData((prev) => ({ ...prev, itemBarcode: formData.itemCode })) // Store the value used for barcode
      } catch (error) {
        console.error("Error generating barcode:", error)
        // Optionally, display an error message to the user
      }
    } else {
      // Clear barcode if itemCode is empty or canvas not ready
      if (barcodeCanvasRef.current) {
        const ctx = barcodeCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, barcodeCanvasRef.current.width, barcodeCanvasRef.current.height)
      }
      setFormData((prev) => ({ ...prev, itemBarcode: "" }))
    }
  }, [formData.itemCode])

  // Calculate Final Price
  const finalPrice = useMemo(() => {
    const tp = Number.parseFloat(formData.tradePrice) || 0
    const disc = Number.parseFloat(formData.discount) || 0
    if (tp <= 0) return 0
    return (tp * (1 - disc / 100)).toFixed(2)
  }, [formData.tradePrice, formData.discount])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.sku || !formData.category || !formData.unitType || !formData.itemCode) {
      alert("Please fill in all required fields (Product Name, SKU, Category, Unit Type, Item Code).")
      return
    }
    if (formData.mrp <= 0 || formData.tradePrice <= 0) {
      alert("MRP and Trade Price must be greater than 0.")
      return
    }
    if (formData.discount < 0 || formData.discount > 100) {
      alert("Discount must be between 0 and 100.")
      return
    }

    // Auto-determine status based on stock
    let status = "In Stock"
    if (formData.stock === 0) {
      status = "Out of Stock"
    } else if (formData.stock <= 10) {
      status = "Low Stock"
    }

    onSave({ ...formData, status, finalPrice: Number.parseFloat(finalPrice) }) // Include finalPrice in saved data
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "price" || name === "mrp" || name === "tradePrice" || name === "discount"
          ? Number(value)
          : value,
    }))

    // Handle brand name suggestions
    if (name === "brandName") {
      if (value.length > 0) {
        const filteredSuggestions = allBrands.filter((brand) => brand.toLowerCase().includes(value.toLowerCase()))
        setBrandSuggestions(filteredSuggestions)
      } else {
        setBrandSuggestions([])
      }
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME // Use VITE_ prefix for Vite
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET // Use VITE_ prefix for Vite

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary environment variables are not set.")
      alert("Cloudinary configuration missing. Please check your .env file.")
      setUploadingImage(false)
      return
    }

    const formDataCloudinary = new FormData()
    formDataCloudinary.append("file", file)
    formDataCloudinary.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formDataCloudinary,
      })
      const data = await response.json()
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }))
      } else {
        console.error("Cloudinary upload failed:", data)
        alert("Image upload failed. Please try again.")
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error)
      alert("An error occurred during image upload.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear the file input
    }
  }

  const handleDownloadBarcode = () => {
    if (barcodeCanvasRef.current) {
      const dataUrl = barcodeCanvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `${formData.itemCode}_barcode.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrintBarcode = () => {
    if (barcodeCanvasRef.current) {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - ${formData.itemCode}</title>
            <style>
              body { font-family: sans-serif; text-align: center; margin: 20px; }
              canvas { max-width: 100%; height: auto; }
              p { font-size: 18px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <h1>${formData.name}</h1>
            <canvas id="printBarcodeCanvas"></canvas>
            <p>${formData.itemCode}</p>
            <script>
              const canvas = document.getElementById('printBarcodeCanvas');
              JsBarcode(canvas, '${formData.itemCode}', {
                format: "CODE128",
                displayValue: true,
                width: 2,
                height: 50,
                margin: 10,
              });
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const categories = ["Electronics", "Furniture", "Office Supplies", "Clothing", "Books", "Food & Beverage", "Hardware"]
  const unitTypes = ["Piece", "Kg", "Liter", "Box", "Meter", "Pack", "Set"]
  const taxCodes = ["GST18", "GST12", "VAT20", "VAT10", "None"]
  const colors = ["Red", "Blue", "Green", "Black", "White", "Silver", "Gold", "Yellow", "Orange", "Purple"]

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {/* General Information */}
      <div className="form-section">
        <h3 className="section-title">General Information</h3>

        <div className="form-group image-upload-group">
          <label htmlFor="productImage">Product Image</label>
          <div className="image-preview-area">
            {uploadingImage ? (
              <div className="image-placeholder">Uploading...</div>
            ) : formData.imageUrl ? (
              <img
                src={formData.imageUrl || "/placeholder.svg"}
                alt="Product Preview"
                className="product-image-preview"
              />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}
            <input
              type="file"
              id="productImage"
              name="productImage"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="file-input-hidden"
              disabled={uploadingImage}
            />
            <div className="image-upload-buttons">
              <label htmlFor="productImage" className="upload-button primary-btn" disabled={uploadingImage}>
                {uploadingImage ? "Uploading..." : formData.imageUrl ? "Change Image" : "Upload Image"}
              </label>
              {formData.imageUrl && (
                <button
                  type="button"
                  className="remove-image-button secondary-btn"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
          <small className="field-note">Upload a clear image of the product.</small>
        </div>

        <div className="form-group">
          <label htmlFor="itemCode">Item Code</label>
          <input
            type="text"
            id="itemCode"
            name="itemCode"
            value={formData.itemCode}
            readOnly
            className="read-only-field"
          />
          <small className="field-note">Auto-generated unique identifier for the item.</small>
        </div>

        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Detailed description of the product"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unitType">Unit Type *</label>
            <select id="unitType" name="unitType" value={formData.unitType} onChange={handleChange} required>
              <option value="">Select Unit Type</option>
              {unitTypes.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div className="form-section">
        <h3 className="section-title">Sales Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mrp">MRP (Maximum Retail Price) *</label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tradePrice">Trade Price *</label>
            <input
              type="number"
              id="tradePrice"
              name="tradePrice"
              value={formData.tradePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="taxCode">Tax Code</label>
            <select id="taxCode" name="taxCode" value={formData.taxCode} onChange={handleChange}>
              <option value="">Select Tax Code</option>
              {taxCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group brand-name-group">
            <label htmlFor="brandName">Brand Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              list="brand-suggestions" // Link to datalist
            />
            <datalist id="brand-suggestions">
              {brandSuggestions.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <select id="color" name="color" value={formData.color} onChange={handleChange}>
              <option value="">Select Color</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group final-price-display">
          <label>Final Price</label>
          <input type="text" value={`$${finalPrice}`} readOnly className="read-only-field" />
          <small className="field-note">Calculated as Trade Price - Discount.</small>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="form-section">
        <h3 className="section-title">Purchase Information</h3>
        <div className="form-group">
          <label>Item Barcode</label>
          <div className="barcode-display">
            {formData.itemCode ? (
              <canvas ref={barcodeCanvasRef} className="barcode-canvas"></canvas>
            ) : (
              <p className="no-barcode-message">Enter an Item Code to generate barcode.</p>
            )}
          </div>
          <div className="barcode-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={handleDownloadBarcode}
              disabled={!formData.itemCode}
            >
              Download Barcode
            </button>
            <button type="button" className="secondary-btn" onClick={handlePrintBarcode} disabled={!formData.itemCode}>
              Print Barcode
            </button>
          </div>
          <small className="field-note">Barcode generated from Item Code.</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel} disabled={uploadingImage}>
          Cancel
        </button>
        <button type="submit" className="primary-btn" disabled={uploadingImage}>
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
