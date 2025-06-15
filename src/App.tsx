import { useEffect, useState } from "react";
import { generateLink, getCurrencies, getDefaultExpiryDate } from "./lib";
import type { Currency, FormErrors, FormValues } from "./types";

function App() {
  const [formValues, setFormValues] = useState<FormValues>({
    currency: "NGN",
    amount: "",
    description: "",
    expiryDate: getDefaultExpiryDate(),
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currencies, setCurrencies] = useState<Currency[] | null>(null);
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [link, setLink] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const currencyData = await getCurrencies();
        setCurrencies(currencyData?.data);
      } catch (err) {
        console.error("Error fetching currencies", err);
      }
    })();
  }, []);

  const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};
    if (!values.currency) errors.currency = "Currency is required";
    if (!values.amount) errors.amount = "Amount is required";
    else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0)
      errors.amount = "Amount must be a positive number";
    if (!values.description) errors.description = "Description is required";
    if (!values.expiryDate) errors.expiryDate = "Expiry date is required";
    else if (new Date(values.expiryDate) < new Date())
      errors.expiryDate = "Expiry date must be in the future";
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true)
    const link = await generateLink()
    setLink(link)
    setLoading(false)
    setOpenModal(true)
  };

  return (
    <div className="relative h-screen w-screen bg-slate-200 grid place-content-center">
      <form
        className="w-[400px] p-4 rounded-lg shadow-md bg-white border space-y-4 *:*:[label]:text-lg *:*:[label]:font-semibold"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label htmlFor="amount">Amount: </label>
          <div>
            <select
              id="currency"
              name="currency"
              className="border border-gray-300 bg-slate-100 py-2 rounded-l-md w-1/6"
              value={formValues.currency}
              onChange={handleChange}
            >
              <option value="" disabled>
                {currencies === null
                  ? "Loading currencies..."
                  : "Select currency"}
              </option>
              {currencies &&
                currencies.map(({ key }) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </select>
            <input
              type="number"
              id="amount"
              className="border border-gray-300 p-2 rounded-r-md w-5/6"
              name="amount"
              inputMode="decimal"
              pattern="[0-9]*"
              min="0"
              value={formValues.amount}
              onChange={handleChange}
            />
          </div>
          {formErrors.currency && (
            <div className="text-red-600 text-sm">{formErrors.currency}</div>
          )}
          {formErrors.amount && (
            <div className="text-red-600 text-sm">{formErrors.amount}</div>
          )}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="border border-gray-300 p-2 rounded-md mt-2 w-full resize-none"
            value={formValues.description}
            onChange={handleChange}
          />
          {formErrors.description && (
            <div className="text-red-600 text-sm">{formErrors.description}</div>
          )}
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date: </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            className="border border-gray-300 p-2 rounded-md mt-2 w-full"
            value={formValues.expiryDate}
            onChange={handleChange}
            min={getDefaultExpiryDate()}
          />
          {formErrors.expiryDate && (
            <div className="text-red-600 text-sm">{formErrors.expiryDate}</div>
          )}
        </div>
        <button
          className="px-4 py-2 w-full bg-blue-700 rounded-md cursor-pointer hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          { loading ? "Generating..." : "Generate" }
        </button>
      </form>
      {
        openModal &&
        <div
          className="fixed grid place-content-center h-full w-full bg-black/70"
          onClick={() => {
            setOpenModal(false);
            setFormValues({
              currency: "NGN",
              amount: "",
              description: "",
              expiryDate: getDefaultExpiryDate(),
            });
          }}
        >
          <div
            className="grid place-content-center text-center bg-white w-[400px] rounded-lg p-4"
            onClick={e => e.stopPropagation()}
          >
            <a href={link} className="text-lg underline">{link}</a>
            <p className="text-sm text-yellow-500">
              This link expires in {new Date(formValues.expiryDate).getDate() - new Date().getDate()} days
            </p>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
