// Test script to verify data bundle mapping
const testData = {
  "success": true,
  "data": [
    {
      "plan": "500MB",
      "plan_name": "500MB Daily",
      "amount": 1500,
      "network": "mtn"
    },
    {
      "plan": "1GB",
      "plan_name": "1GB Daily",
      "amount": 3000,
      "network": "mtn"
    }
  ]
};

// Simulate the mapping logic from the fixed code
const rawList = testData.data;
const mapped = rawList.map((item, idx) => {
  const id = String(item?.variation_id ?? item?.id ?? item?.plan ?? `plan_${idx}`);
  const planText = item?.data_plan || item?.variation_name || item?.plan_name || item?.plan || '';
  const price = Number(item?.price ?? item?.variation_amount ?? item?.amount ?? item?.reseller_price ?? item?.selling_price ?? 0);
  return { 
    id, 
    name: planText || 'Plan', 
    size: planText, 
    validity: item?.validity || '', 
    price, 
    network: 'MTN', 
    description: item?.description || planText 
  };
}).filter((b) => b.id && b.price > 0);

console.log('Mapped data bundles:');
console.log(JSON.stringify(mapped, null, 2));
