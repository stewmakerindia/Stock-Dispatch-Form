
import React, { useState } from "react";

const stockItems = [
  { type: "header", label: "Meat & Eggs" },
  { type: "item", name: "Chicken", unit: "Kg" },
  { type: "item", name: "Mutton", unit: "Kg" },
  { type: "item", name: "Eggs", unit: "Tray" },
  { type: "header", label: "Vegetables" },
  { type: "item", name: "Onion", unit: "Kg" },
  { type: "item", name: "Carrot", unit: "Kg" }
];

const App = () => {
  const [date, setDate] = useState(() => new Date().toISOString().substr(0, 10));
  const [data, setData] = useState({});

  const handleChange = (item, outlet, value) => {
    setData(prev => ({
      ...prev,
      [item.name + "-" + outlet]: value
    }));
  };

  const generateMessage = () => {
    let msg = `Stock Dispatch Report\nDate: ${date}\n\n`;
    stockItems.forEach(item => {
      if (item.type === "header") {
        msg += `\n== ${item.label} ==\n`;
      } else {
        const y = data[item.name + "-Yelahanka"] || 0;
        const t = data[item.name + "-Thanisandra"] || 0;
        const k = data[item.name + "-Kammanahalli"] || 0;
        const i = data[item.name + "-Indiranagar"] || 0;
        msg += `${item.name} (${item.unit}): Yel ${y}, Tha ${t}, Kam ${k}, Ind ${i}\n`;
      }
    });
    return encodeURIComponent(msg);
  };

  return (
    <div className="app">
      <div className="header">
        <label>Date: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      {stockItems.map((item, idx) => item.type === "header" ? (
        <div key={idx} className="category-header">{item.label}</div>
      ) : (
        <div key={idx} className="item-row">
          <div>{item.name} ({item.unit})</div>
          <div className="inputs">
            {["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"].map(outlet => (
              <input
                key={outlet}
                type="number"
                placeholder={outlet}
                value={data[item.name + "-" + outlet] || ""}
                onChange={e => handleChange(item, outlet, e.target.value)}
              />
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => {
        const url = "https://wa.me/?text=" + generateMessage();
        window.open(url, "_blank");
      }}>Send on WhatsApp</button>
    </div>
  );
};

export default App;
