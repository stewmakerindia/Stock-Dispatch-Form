import React, { useState } from 'react';
import './App.css';

const items = [
  "Chicken", "Mutton", "Eggs", "Prawns", "Coconut", "Potato", "Beans", "Onion",
  "Small Onion", "Carrot", "Ginger", "Raw Mango", "Peeled Garlic", "Mushroom",
  "Bread", "Bread Powder", "Instant Dry Yeast", "Chips", "Maida", "Pickles",
  "Coconut Powder", "Magic Masala", "Soya Granules", "Garam Masala",
  "Chilli Powder", "Turmeric Powder", "Salt", "Sugar", "Vinegar", "Cloves",
  "Cardamom", "Black Pepper", "Cinnamon", "Dry Chilli", "Dry Chilli Round",
  "Whole Coriander", "Fennel", "Raisins", "Cashew", "Sunflower Oil",
  "Coconut Oil", "Ghee", "Appam Rice", "Ghee Rice", "Chicken Cutlets",
  "Veg Cutlets", "Roast Masala", "Barrista", "Banana Leaf", "Appam Box",
  "SM Bag", "SM Bag (w/o handle)", "Railway Meal Cover", "Cutlet Box",
  "500ml container", "500g container", "Chutney Box", "Silver Pouch - 9X12",
  "Silver Pouch - 6X9", "Staeppler Pins", "Tape", "Garbage Bag - 24 X 32"
];

const outlets = ["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"];

function App() {
  const [date, setDate] = useState('');
  const [data, setData] = useState({});

  const handleChange = (item, outlet, value) => {
    setData(prev => ({
      ...prev,
      [item]: { ...prev[item], [outlet]: value }
    }));
  };

  const sendWhatsapp = () => {
    let message = `🧾 *Stock Dispatch - ${date}*\n\n`;
    items.forEach(item => {
      const row = data[item] || {};
      message += `*${item}* - ${outlets.map(outlet => `${outlet}: ${row[outlet] || 0}`).join(', ')}\n`;
    });
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="app">
      <h1>Stewmaker Stock Dispatch</h1>
      <div className="header">
        <label>Date: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={sendWhatsapp}>Send via WhatsApp</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            {outlets.map(outlet => <th key={outlet}>{outlet}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item}>
              <td>{item}</td>
              {outlets.map(outlet => (
                <td key={outlet}>
                  <input
                    type="text"
                    value={data[item]?.[outlet] || ''}
                    onChange={e => handleChange(item, outlet, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
