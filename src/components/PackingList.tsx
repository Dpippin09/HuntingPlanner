import React, { useState } from 'react';
import { PackingItem } from '../types';
import './PackingList.css';

interface PackingListProps {
  items: PackingItem[];
  onUpdateItems: (items: PackingItem[]) => void;
}

const DEFAULT_CATEGORIES = [
  'Clothing',
  'Gear',
  'Safety',
  'Food & Water',
  'Documents',
  'Miscellaneous',
];

const PackingList: React.FC<PackingListProps> = ({ items, onUpdateItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(DEFAULT_CATEGORIES[0]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      packed: false,
    };

    onUpdateItems([...items, newItem]);
    setNewItemName('');
  };

  const handleTogglePacked = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    onUpdateItems(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    onUpdateItems(updatedItems);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  const packedCount = items.filter((item) => item.packed).length;
  const totalCount = items.length;

  return (
    <div className="packing-list">
      <h2>🎒 Packing List</h2>
      
      <div className="packing-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: totalCount > 0 ? `${(packedCount / totalCount) * 100}%` : '0%' }}
          />
        </div>
        <span className="progress-text">{packedCount} of {totalCount} items packed</span>
      </div>

      <form className="add-item-form" onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="item-input"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="category-select"
        >
          {DEFAULT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="add-button">Add Item</button>
      </form>

      <div className="items-container">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="category-group">
            <h3 className="category-title">{category}</h3>
            <ul className="items-list">
              {categoryItems.map((item) => (
                <li key={item.id} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                  <label className="item-label">
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => handleTogglePacked(item.id)}
                    />
                    <span className="item-name">{item.name}</span>
                  </label>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="empty-message">No items in your packing list yet. Add some items above!</p>
      )}
    </div>
  );
};

export default PackingList;
