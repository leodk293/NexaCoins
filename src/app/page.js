'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import './globals.css'
import { MoveUp } from "lucide-react";
import { MoveDown } from "lucide-react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const api_key = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY;

  const [cryptoList, setCryptoList] = useState({
    error: false,
    data: undefined,
    loading: false
  })

  const [currencyList, setCurrencyList] = useState([]);

  async function getCurrencyList() {
    try {
      const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': api_key }
      };

      const response = await fetch(`https://api.coingecko.com/api/v3/simple/supported_vs_currencies`, options);
      if (!response.ok) {
        throw new Error(`An error has ocurred : ${response.status}`)
      }
      const result = await response.json();
      //console.log(result);
      setCurrencyList(result)

    }
    catch (error) {
      console.log(error.message);
      setCurrencyList([]);
    }
  }

  function getCurrencySymbol(currencyCode) {
    try {
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0
      }).formatToParts(1).find(part => part.type === 'currency').value;
    } catch (error) {
      console.error(`Invalid currency code: ${currencyCode}`, error);
      return '?';
    }
  }


  useEffect(() => {
    getCurrencyList();
  }, [])

  const [currency, setCurrency] = useState({
    name: 'usd',
    symbol: '$'
  })

  function handleSubmit(event) {
    event.preventDefault();
    const inputValue = event.target.elements[0].value;
    setCurrency({
      name: `${inputValue}`,
      symbol: `${getCurrencySymbol(inputValue)}`
    })
  }

  function handleError() {
    setCryptoList({
      error: true,
      data: undefined,
      loading: false
    })
  }

  function setLoader() {
    setCryptoList({
      error: false,
      data: undefined,
      loading: true
    })
  }

  async function fetchCrypto() {
    setLoader();
    try {
      const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': api_key }
      };

      const api_url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`;

      const response = await fetch(api_url, options);

      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }

      const data = await response.json();
      //console.log(data)

      setCryptoList({
        error: false,
        data: data,
        loading: false
      });
    }
    catch (error) {
      console.log(error.message);
      handleError();
    }
  }

  useEffect(() => {
    fetchCrypto();
  }, [currency])

  return (
    <main className=" m-auto w-auto md:w-[55rem]">
      <div className=" flex flex-col m-auto mt-10 gap-5 ">
        <h1 className=" font-extrabold text-2xl text-white md:text-4xl">Welcome to <span className=" text-yellow-600">NexaCoins</span></h1>
        <p className=" text-[16px] self-center text-zinc-100 md:text-[18px]">NexaCoins, your all-in-one platform for real-time cryptocurrency insights, market trends,
          and portfolio tracking. Stay ahead in the world of digital currencies with live updates and
          powerful analytics, tailored just for you. Signup and leave us a comment
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 mt-[60px] ">
        <div className=" text-white flex flex-wrap gap-5">
          <p className=" self-center text-xl font-bold">Select a currency :</p>
          <button
            onClick={() => setCurrency({
              name: 'usd',
              symbol: `${getCurrencySymbol('usd')}`
            })}
            className=" outline-none font-senibold border border-transparent bg-green-900 px-5 py-1 rounded-[25px] md:hover:bg-green-600 duration-150"
          >
            Dollar $
          </button>

          <button
            onClick={() => setCurrency({
              name: 'eur',
              symbol: `${getCurrencySymbol('eur')}`
            })}
            className=" outline-none font-senibold border border-transparent bg-blue-900 px-5 py-1 rounded-[25px] md:hover:bg-blue-600 duration-150"
          >
            Euro €
          </button>

          <button
            onClick={() => setCurrency({
              name: 'gbp',
              symbol: `${getCurrencySymbol('gbp')}`
            })}
            className=" outline-none font-senibold border border-transparent bg-purple-900 px-5 py-1 rounded-[25px] md:hover:bg-purple-600 duration-150"
          >
            Pound £
          </button>

          <button
            onClick={() => setCurrency({
              name: 'inr',
              symbol: `${getCurrencySymbol('inr')}`
            })}
            className=" outline-none font-senibold border border-transparent bg-orange-900 px-5 py-1 rounded-[25px] md:hover:bg-orange-600 duration-150"
          >
            Rupee ₹
          </button>
        </div>

        <div className=" flex gap-2 flex-row">
          <span className=" self-center h-[1px] rounded-[5px] w-[150px] bg-[#ffffffcd] md:w-[300px] "></span>
          <span className=" self-center text-white text-xl font-semibold">or</span>
          <span className=" self-center h-[1px] rounded-[5px] w-[150px] bg-[#ffffffcd] md:w-[300px] "></span>
        </div>

        <form
          onSubmit={handleSubmit}
          className=" flex flex-row"
          action=""
        >
          <input
            required
            list="currencies"
            className=" text-white rounded-tl-[5px] rounded-bl-[5px] text-[20px] p-2 outline-none border border-transparent bg-black"
            placeholder="Enter a currency"
            type="text"

          />
          <datalist id="currencies">
            {Array.isArray(currencyList) && currencyList.map((currency, index) => (
              <option
                value={currency}
                key={index}
              />
            ))}
          </datalist>
          <button
            className=" bg-purple-900 rounded-tr-[5px] rounded-br-[5px] font-bold px-2 text-white">
            Submit
          </button>
        </form>

      </div>

      <h1 className=" text-2xl mt-[80px] text-center font-bold text-yellow-600 md:text-3xl">Top 30 CryptoCurrency 🪙</h1>

      {cryptoList.error === true ?
        <p className=" text-2xl h-[10rem] font-bold text-red-600 text-center mt-10">Something went wrong, try again</p> :
        cryptoList.loading === true ?
          <p className=" text-2xl h-[10rem] font-bold text-orange-600 text-center mt-10">Loading...</p> :
          (
            cryptoList.data &&
            <div className=" mt-10 text-white" >

              <div className="grid grid-cols-6 text-orange-700 text-[15px] font-bold border-b border-gray-500 pb-2 mb-2 md:text-xl" >
                <p>#</p>
                <p>Name</p>
                <p>Symbole</p>
                <p>Price</p>
                <p>24H Change</p>
                <p>Market Cap</p>
              </div>

              {cryptoList.data.slice(0, 30).map((crypto) => (

                <Link href={`/crypto-currency/${crypto.id}`} key={crypto.id}>
                  <div
                    className="grid grid-cols-6 border-b text-[12px] border-gray-700 py-2 font-semibold md:text-[15px] md:hover:bg-[#ffffff28] duration-300 md:px-1"
                  >

                    <p>{crypto.market_cap_rank}</p>
                    <p className=" leading-5">{crypto.name}</p>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      width={25}
                      height={25}
                      className=" object-cover rounded-[50%]"
                    />
                    <p>{currency.symbol} {crypto.current_price.toLocaleString('en-US')}</p>

                    <div className={` flex flex-row ${Math.floor(crypto.price_change_percentage_24h * 100) / 10 > 0 ? "text-green-700" : "text-red-700"}`}>

                      <span className=" self-center">{Math.floor(crypto.price_change_percentage_24h * 100) / 100}</span>

                      <div className={` self-center hidden md:block`}>
                        {
                          Math.floor(crypto.price_change_percentage_24h * 100) / 10 > 0 ?
                            <MoveUp size={16} color="#15803d" strokeWidth={2.5} />
                            :
                            <MoveDown size={16} color="#b91c1c" strokeWidth={2.5} />
                        }
                      </div>

                    </div>

                    <p>{currency.symbol} {crypto.market_cap.toLocaleString('en-US')}</p>

                  </div>
                </Link>

              ))}

            </div>

          )
      }

      <Link
        href={'/cryptos'}
      >
        <button
          className=" mt-10 border font-bold border-transparent text-white bg-indigo-950 rounded-[5px] px-5 py-2 hover:translate-x-3 hover:bg-blue-950 duration-300"
        >
          Click here for more
        </button>
      </Link>

    </main>
  );
}
