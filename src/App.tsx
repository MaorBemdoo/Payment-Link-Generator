import { useState } from "react";

function App() {

  const [{currency, amount, description, expiryDate}, setFormValues] = useState({
    currency: 'NGN',
    amount: '',
    description: '',
    expiryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Generating invoice for ${amount} ${currency} with description "${description}" and expiry date ${expiryDate}`);
  }

  return (
    <div className="h-screen w-screen bg-slate-200 grid place-content-center" >
      <form className="w-[400px] p-4 rounded-lg shadow-md bg-white border space-y-4 *:*:[label]:text-lg *:*:[label]:font-semibold" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount: </label>
          <div>
            <select
              id="currency"
              name="currency"
              className="border border-gray-300 bg-slate-100 py-2 rounded-l-md w-1/6"
              value={currency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="INR">INR</option>
              <option value="NGN">NGN</option>
              <option value="ZAR">ZAR</option>
              <option value="CNY">CNY</option>
            </select>
            <input
              type="number"
              id="amount"
              className="border border-gray-300 p-2 rounded-r-md w-5/6"
              name="amount"
              inputMode="decimal"
              pattern="[0-9]*"
              min="0"
              value={amount}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" className="border border-gray-300 p-2 rounded-md mt-2 w-full resize-none" value={description} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date: </label>
            <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            className="border border-gray-300 p-2 rounded-md mt-2 w-full"
            value={expiryDate}
            onChange={handleChange}
            />
        </div>
        <button className="px-4 py-2 w-full bg-blue-700 rounded-md cursor-pointer hover:bg-blue-600 focus:scale-85" type="submit">Generate</button>
      </form>
    </div>
  )
}

export default App
