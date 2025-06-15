export const getCurrencies = async () => {
  const res = await fetch('https://api.apyhub.com/data/dictionary/currency', {
    headers: [[
        "apy-token", import.meta.env.VITE_APYHUB_API_KEY
    ]]
  });
  const data = await res.json()

  if(!res.ok){
    throw new Error(data)
  }

  return data;
};
