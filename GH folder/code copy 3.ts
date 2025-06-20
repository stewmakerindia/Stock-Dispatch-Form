'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Define the types for our data for type safety
type Product = {
  id: number;
  name: string;
  category: string;
  unit: string;
};

type Outlet = {
  id: number;
  name:string;
};

type Quantities = {
  [productId: number]: number;
};

type GroupedProducts = {
  [category: string]: Product[];
};

export default function TransferPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  
  // State for the form inputs
  const [selectedOutlet, setSelectedOutlet] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data (outlets and products)
  useEffect(() => {
    async function fetchData() {
      // Fetch outlets
      const { data: outletsData } = await supabase.from('outlets').select('*');
      setOutlets(outletsData || []);

      // Fetch products and group them by category
      const { data: productsData } = await supabase.from('products').select('*').order('name');
      if (productsData) {
        const grouped = productsData.reduce((acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {} as GroupedProducts);
        setGroupedProducts(grouped);
      }
    }
    fetchData();
  }, []);

  const handleQuantityChange = (productId: number, value: string) => {
    const newQuantities = { ...quantities };
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      newQuantities[productId] = numValue;
    } else {
      delete newQuantities[productId]; // Remove if input is empty or zero
    }
    setQuantities(newQuantities);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutlet || !transferDate) {
      alert('Please select a date and an outlet.');
      return;
    }
    
    const itemsToTransfer = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        product_id: parseInt(productId),
        quantity,
    }));

    if (itemsToTransfer.length === 0) {
      alert('Please add quantity for at least one item.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Create the transfer record
      const { data: transferData, error: transferError } = await supabase
        .from('transfers')
        .insert({ outlet_id: parseInt(selectedOutlet), transfer_date: transferDate })
        .select('id')
        .single();

      if (transferError) throw transferError;

      // 2. Prepare items for the transfer_items table
      const transferItemsData = itemsToTransfer.map(item => ({
        ...item,
        transfer_id: transferData.id,
      }));

      // 3. Insert all items
      const { error: itemsError } = await supabase.from('transfer_items').insert(transferItemsData);

      if (itemsError) throw itemsError;

      alert('Transfer created successfully!');
      // Reset form
      setSelectedOutlet('');
      setQuantities({});
      
    } catch (error: any) {
      console.error('Error creating transfer:', error);
      alert(`Failed to create transfer: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        {/* -- CONTROLS -- */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-brand-blue mb-4">New Stock Transfer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Transfer Date</label>
              <input
                type="date"
                id="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="outlet" className="block text-sm font-medium text-gray-700">Destination Outlet</label>
              <select
                id="outlet"
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select an Outlet</option>
                {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="md:mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Transfer'}
              </button>
            </div>
          </div>
        </div>

        {/* -- PRODUCT LIST -- */}
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-brand-blue border-b-2 border-gray-200 pb-2 mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between">
                    <label htmlFor={`product-${product.id}`} className="flex-grow">{product.name}</label>
                    <div className="flex items-center space-x-2">
                       <input
                        type="number"
                        id={`product-${product.id}`}
                        min="0"
                        step="1"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded-md text-right"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500 w-10">{product.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}