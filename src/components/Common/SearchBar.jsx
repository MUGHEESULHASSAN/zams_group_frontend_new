"use client"
import "./SearchBar.css"

const SearchBar = ({ placeholder, value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  )
}

export default SearchBar
