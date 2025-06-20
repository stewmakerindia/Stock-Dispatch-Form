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
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [data, setData] = useState({});

  const handleChange = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateMessage = () => {
    let message = `Stock Dispatch Report\nDate: ${date}\n\n`;
    stockItems.forEach(item => {
      if (item.type === "header") {
        message += `\n== ${item.label} ==\n`;
      } else {
        const outlets = ["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"];
        const line = outlets.map(outlet => {
          const key = item.name + "-" + outlet;
          return `${outlet.slice(0, 3)}: ${data[key] || 0}`;
        }).join(", ");
        message += `${item.name} (${item.unit}): ${line}\n`;
      }
    });
    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    const url = "https://wa.me/?text=" + generateMessage();
    window.open(url, "_blank");
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
            {["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"].map(outlet => {
              const key = item.name + "-" + outlet;
              return (
                <input
                  key={key}
                  type="number"
                  placeholder={outlet}
                  value={data[key] || ""}
                  onChange={e => handleChange(key, e.target.value)}
                />
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={openWhatsApp}>Send on WhatsApp</button>
    </div>
  );
};

export default App;