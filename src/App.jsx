import React, { useState } from 'react';
import './App.css';

const masterData = [
  { category: "Meat & Eggs", items: ["Chicken", "Mutton", "Eggs", "Prawns"] },
  { category: "Vegetables", items: ["Coconut", "Potato", "Beans", "Onion", "Small Onion", "Carrot", "Ginger", "Raw Mango"] },
  { category: "Packaged Foods", items: ["Peeled Garlic", "Mushroom", "Bread", "Bread Powder", "Instant Dry Yeast", "Chips", "Maida", "Pickles"] },
  { category: "Spices & Condiments", items: ["Coconut Powder", "Magic Masala", "Soya Granules", "Garam Masala", "Chilli Powder", "Turmeric Powder", "Salt", "Sugar", "Vinegar", "Cloves", "Cardamom", "Black Pepper", "Cinnamon", "Dry Chilli", "Dry Chilli Round", "Whole Coriander", "Fennel", "Raisins", "Cashew"] },
  { category: "Oils & Fats", items: ["Sunflower Oil", "Coconut Oil", "Ghee"] },
  { category: "Rice", items: ["Appam Rice", "Ghee Rice"] },
  { category: "Finished Goods", items: ["Chicken Cutlets", "Veg Cutlets", "Roast Masala", "Barrista"] },
  { category: "Packing Materials", items: ["Banana Leaf", "Appam Box", "SM Bag", "SM Bag (w/o handle)", "Railway Meal Cover", "Cutlet Box", "500ml container", "500g container", "Chutney Box", "Silver Pouch - 9X12", "Silver Pouch - 6X9", "Staeppler Pins", "Tape", "Garbage Bag - 24 X 32"] }
];

const outlets = ["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"];

function App() {
  const [date, setDate] = useState('');
  const [data, setData] = useState({});

  const adjustQty = (item, outlet, delta) => {
    setData(prev => {
      const current = parseInt(prev[item]?.[outlet] || 0);
      const updated = Math.max(0, current + delta);
      return {
        ...prev,
        [item]: { ...prev[item], [outlet]: updated }
      };
    });
  };

  const sendWhatsapp = () => {
    let message = `🧾 *Stock Dispatch - ${date}*\n\n`;
    masterData.forEach(group => {
      message += `*${group.category}*\n`;
      group.items.forEach(item => {
        const row = data[item] || {};
        message += `• ${item}: ${outlets.map(outlet => `${outlet}: ${row[outlet] || 0}`).join(', ')}\n`;
      });
      message += '\n';
    });
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="app">
      <h1>Stock Dispatch</h1>
      <div className="date-row">
        <label>Date: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={sendWhatsapp}>Send via WhatsApp</button>
      </div>
      {masterData.map(group => (
        <div key={group.category}>
          <h2 className="category">{group.category}</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                {outlets.map(outlet => <th key={outlet}>{outlet}</th>)}
              </tr>
            </thead>
            <tbody>
              {group.items.map(item => (
                <tr key={item}>
                  <td>{item}</td>
                  {outlets.map(outlet => (
                    <td key={outlet}>
                      <div className="qty-cell">
                        <button onClick={() => adjustQty(item, outlet, -1)}>-</button>
                        <span>{data[item]?.[outlet] || 0}</span>
                        <button onClick={() => adjustQty(item, outlet, 1)}>+</button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
