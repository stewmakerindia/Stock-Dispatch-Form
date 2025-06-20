import React, { useState } from "react";

const stockItems = [
  { type: "header", label: "Meat & Eggs" },
  { type: "item", name: "Chicken", unit: "Kg" },
  { type: "item", name: "Mutton", unit: "Kg" },
  { type: "item", name: "Eggs", unit: "Tray" },
  { type: "header", label: "Sea Food" },
  { type: "item", name: "Prawns", unit: "Kg" },
  { type: "header", label: "Vegetables" },
  { type: "item", name: "Coconut", unit: "Kg" },
  { type: "item", name: "Potato", unit: "Kg" },
  { type: "item", name: "Beans", unit: "Kg" },
  { type: "item", name: "Onion", unit: "Kg" },
  { type: "item", name: "Small Onion", unit: "Kg" },
  { type: "item", name: "Carrot", unit: "Kg" },
  { type: "item", name: "Ginger", unit: "Kg" },
  { type: "item", name: "Raw Mango", unit: "Kg" },
  { type: "item", name: "Peeled Garlic", unit: "Packet" },
  { type: "item", name: "Mushroom", unit: "Packet" },
  { type: "header", label: "Packaged Foods" },
  { type: "item", name: "Bread", unit: "Packet" },
  { type: "item", name: "Bread Powder", unit: "Packet" },
  { type: "item", name: "Instant Dry Yeast", unit: "Packet" },
  { type: "item", name: "Chips", unit: "Packet" },
  { type: "item", name: "Maida", unit: "Kg" },
  { type: "item", name: "Pickles", unit: "Bottle" },
  { type: "item", name: "Coconut Powder", unit: "Packet" },
  { type: "item", name: "Magic Masala", unit: "Packet" },
  { type: "item", name: "Soya Granules", unit: "Packet" },
  { type: "header", label: "Spices & Condiments" },
  { type: "item", name: "Garam Masala", unit: "Packet" },
  { type: "item", name: "Chilli Powder", unit: "Packet" },
  { type: "item", name: "Turmeric Powder", unit: "Packet" },
  { type: "item", name: "Salt", unit: "Kg" },
  { type: "item", name: "Sugar", unit: "Kg" },
  { type: "item", name: "Vinegar", unit: "Bottle" },
  { type: "item", name: "Cloves", unit: "Packet" },
  { type: "item", name: "Cardamom", unit: "Packet" },
  { type: "item", name: "Black Pepper", unit: "Packet" },
  { type: "item", name: "Cinnamon", unit: "Packet" },
  { type: "item", name: "Dry Chilli", unit: "Packet" },
  { type: "item", name: "Dry Chilli Round", unit: "Packet" },
  { type: "item", name: "Whole Coriander", unit: "Packet" },
  { type: "item", name: "Fennel", unit: "Packet" },
  { type: "header", label: "Dry Fruits & Nuts" },
  { type: "item", name: "Raisins", unit: "Packet" },
  { type: "item", name: "Cashew", unit: "Packet" },
  { type: "header", label: "Oils & Fat" },
  { type: "item", name: "Sunflower Oil", unit: "Ltr" },
  { type: "item", name: "Coconut Oil", unit: "Ltr" },
  { type: "item", name: "Ghee", unit: "Ltr" },
  { type: "header", label: "Rice" },
  { type: "item", name: "Appam Rice", unit: "Bori" },
  { type: "item", name: "Ghee Rice", unit: "Bori" },
  { type: "header", label: "Finished Goods" },
  { type: "item", name: "Chicken Cutlets", unit: "Packet" },
  { type: "item", name: "Veg Cutlets", unit: "Packet" },
  { type: "item", name: "Roast Masala", unit: "Packet" },
  { type: "item", name: "Barrista", unit: "Packet" },
  { type: "header", label: "Packing Materials" },
  { type: "item", name: "Banana Leaf", unit: "Pcs" },
  { type: "item", name: "Appam Box", unit: "Box" },
  { type: "item", name: "SM Bag", unit: "Box" },
  { type: "item", name: "SM Bag (w/o handle)", unit: "Box" },
  { type: "item", name: "Railway Meal Cover", unit: "Box" },
  { type: "item", name: "Cutlet Box", unit: "Box" },
  { type: "item", name: "500ml container", unit: "Box" },
  { type: "item", name: "500g container", unit: "Box" },
  { type: "item", name: "Chutney Box", unit: "Box" },
  { type: "item", name: "Silver Pouch - 9X12", unit: "Box" },
  { type: "item", name: "Silver Pouch - 6X9", unit: "Box" },
  { type: "item", name: "Staeppler Pins", unit: "Box" },
  { type: "item", name: "Tape", unit: "Pcs" },
  { type: "header", label: "Garbage Bag" },
  { type: "item", name: "Garbage Bag - 24 X 32", unit: "Box" }
];

const App = () => {
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [data, setData] = useState({});

  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const generateMessage = () => {
    let message = `Stock Dispatch Report\nDate: ${date}\n\n`;
    stockItems.forEach((item) => {
      if (item.type === "header") {
        message += `\n== ${item.label} ==\n`;
      } else {
        const outlets = ["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"];
        const line = outlets
          .map((outlet) => {
            const key = item.name + "-" + outlet;
            const val = data[key] || 0;
            return outlet.slice(0, 3) + ": " + val;
          })
          .join(", ");
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
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {stockItems.map((item, idx) =>
        item.type === "header" ? (
          <div key={idx} className="category-header">
            {item.label}
          </div>
        ) : (
          <div key={idx} className="item-row">
            <div>{item.name} ({item.unit})</div>
            <div className="inputs">
              {["Yelahanka", "Thanisandra", "Kammanahalli", "Indiranagar"].map((outlet) => {
                const key = item.name + "-" + outlet;
                return (
                  <input
                    key={key}
                    type="number"
                    placeholder={outlet}
                    value={data[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                );
              })}
            </div>
          </div>
        )
      )}
      <button onClick={openWhatsApp}>Send on WhatsApp</button>
    </div>
  );
};

export default App;