import { useState } from "react";

interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  onSelect?: (item: DropdownItem) => void;
  label?: string;
}

const Dropdown = ({ items, placeholder = "Select an option", onSelect, label }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect?.(item);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
        >
          <span className={selectedItem ? "text-gray-900" : "text-gray-500"}>
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {items.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                >
                  {item.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
