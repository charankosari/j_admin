"use client"
import { useState, useEffect } from "react";
import { APISDK } from "../../libs/api";
import { ISale } from "../../libs/api/types";
import { EditSaleModal } from "./edit-sale-modal";

export function SalesManagement() {
  const [sales, setSales] = useState<ISale[]>([]);
  const [editingSale, setEditingSale] = useState<ISale | null>(null);

  useEffect(() => {
    loadSales();
  }, []);
  const emptySale: ISale = {
    id: "",
    name: "",
    image_url: [],
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    discount_percentage: 0,
    sale_type: "product",
    product_ids: [],
    category_ids: [],
    subcategory_ids: [],
    meta_data: {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  const loadSales = async () => {
    try {
      const salesData = await APISDK.getInstance().getSales();
      setSales(salesData);
    } catch (error) {
      console.error("Failed to load sales:", error);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) {
      return;
    }
    try {
      await APISDK.getInstance().deleteSale(saleId);
      loadSales();
    } catch (error) {
      console.error("Failed to delete sale:", error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          marginBottom: '20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => setEditingSale(emptySale)}

      >
        Create New Sale
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd',color:"black" }}>Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd',color:"black" }}>Start Date</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd',color:"black" }}>End Date</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd',color:"black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{sale.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{new Date(sale.start_date).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{new Date(sale.end_date).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button
                  style={{
                    backgroundColor: '#008CBA',
                    color: 'white',
                    padding: '5px 10px',
                    marginRight: '5px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setEditingSale(sale)}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDeleteSale(sale.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingSale && (
        <EditSaleModal
          sale={editingSale}
          onClose={() => setEditingSale(null)}
          onSave={loadSales}
        />
      )}
    </div>
  );
}