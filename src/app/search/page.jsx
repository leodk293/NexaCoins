"use client";
import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReadMore from "../components/readMore";
import Chart from "react-google-charts";

export default function Page() {
  const searchParams = useSearchParams();
  const cryptoName = searchParams.get("crypto");
  const [historicalData, setHistoricalData] = useState({
    error: false,
    data: undefined,
    loading: false,
  });
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState({ name: "usd", symbol: "$" });

  const [crypto, setCrypto] = useState({
    error: false,
    data: undefined,
    loading: false,
  });

  const api_key = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY;
  if (!api_key) {
    console.error("API key is missing!");
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": api_key,
    },
  };

  async function getSearchedCrypto() {
    setCrypto((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
          cryptoName
        )}`,
        options
      );
      if (!response.ok)
        throw new Error(`An error has occured : ${response.status}`);
      const result = await response.json();

      //console.log(result)
      setCrypto({ error: false, data: result, loading: false });
    } catch (error) {
      console.log(error.message);
      setCrypto({
        error: true,
        data: undefined,
        loading: false,
      });
    }
  }

  function getCurrencySymbol(currencyCode) {
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
      })
        .formatToParts(1)
        .find((part) => part.type === "currency").value;
    } catch (error) {
      console.error(`Invalid currency code: ${currencyCode}`, error);
      return "?";
    }
  }

  async function fetchHistoricalChartData() {
    setHistoricalData({ ...historicalData, loading: true });

    try {
      if (!cryptoName) throw new Error("Crypto ID is undefined.");
      if (!currency || !currency.name)
        throw new Error("Currency is undefined.");

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart?vs_currency=${currency.name}&days=5`,
        options
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();

      if (!result || !result.prices || !Array.isArray(result.prices)) {
        throw new Error("Invalid historical data received.");
      }

      const tabChartData = [
        ["Date", "Price"],
        ...result.prices.map(([timestamp, price]) => [
          new Date(timestamp),
          price,
        ]),
      ];
      setChartData(tabChartData);
      setHistoricalData({ error: false, data: result, loading: false });
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setHistoricalData({ error: true, data: undefined, loading: false });
    }
  }

  useEffect(() => {
    const searchedCryptoTimeOut = setTimeout(() => getSearchedCrypto(), 1000);
    return () => {
      clearTimeout(searchedCryptoTimeOut);
    };
  }, [cryptoName]);

  useEffect(() => {
    const historicalChartDataTimeout = setTimeout(
      () => fetchHistoricalChartData(),
      1000
    );

    return () => {
      clearTimeout(historicalChartDataTimeout);
    };
  }, [cryptoName, currency]);

  return (
    <main className="m-auto w-auto md:w-[60rem]">
      {crypto.loading ? (
        <div className=" h-[10rem] mt-10 flex flex-col items-center gap-1">
          <div className="loader" />
          <p className=" text-2xl font-bold text-orange-600 text-center">
            Loading...
          </p>
        </div>
      ) : crypto.error ? (
        <p className=" text-2xl h-[10rem] font-bold text-red-600 text-center mt-10">
          Something went wrong...
        </p>
      ) : crypto && crypto.data ? (
        crypto && (
          <div className=" mt-10 flex flex-col">
            <div className=" flex flex-row gap-2">
              <h1 className=" text-white text-2xl font-bold self-center md:text-4xl">
                {crypto.data.name}
              </h1>
              <img
                src={crypto.data.image.large}
                alt={crypto.data.name}
                width={50}
                height={50}
                className=" self-center rounded-[50%] object-cover"
              />
            </div>

            {crypto.data.description.en ? (
              <div className=" mt-2 text-white text-[15px] leading-9 md:text-[18px]">
                <ReadMore
                  text={crypto.data.description.en.replace(
                    /<a[^>]*>(.*?)<\/a>/gi,
                    "$1"
                  )}
                  maxLength={400}
                />
              </div>
            ) : (
              <p className=" text-2xl mt-5 font-semibold text-slate-400">
                Sorry, description not available
              </p>
            )}

            <div className=" text-white mt-10 flex flex-wrap gap-5">
              <p className=" self-center text-xl font-bold">
                Select a currency :
              </p>
              <button
                onClick={() =>
                  setCurrency({
                    name: "usd",
                    symbol: `${getCurrencySymbol("usd")}`,
                  })
                }
                className=" outline-none font-senibold border border-transparent bg-green-900 px-5 py-1 rounded-[25px] md:hover:bg-green-600 duration-150"
              >
                Dollar $
              </button>

              <button
                onClick={() =>
                  setCurrency({
                    name: "eur",
                    symbol: `${getCurrencySymbol("eur")}`,
                  })
                }
                className=" outline-none font-senibold border border-transparent bg-blue-900 px-5 py-1 rounded-[25px] md:hover:bg-blue-600 duration-150"
              >
                Euro €
              </button>

              <button
                onClick={() =>
                  setCurrency({
                    name: "gbp",
                    symbol: `${getCurrencySymbol("gbp")}`,
                  })
                }
                className=" outline-none font-senibold border border-transparent bg-purple-900 px-5 py-1 rounded-[25px] md:hover:bg-purple-600 duration-150"
              >
                Pound £
              </button>

              <button
                onClick={() =>
                  setCurrency({
                    name: "inr",
                    symbol: `${getCurrencySymbol("inr")}`,
                  })
                }
                className=" outline-none font-senibold border border-transparent bg-orange-900 px-5 py-1 rounded-[25px] md:hover:bg-orange-600 duration-150"
              >
                Rupee ₹
              </button>
            </div>

            <div className=" text-white mt-5 text-[18px] flex flex-col gap-2 md:text-xl">
              <div className=" flex flex-row justify-between">
                <p className=" font-bold">Current Price</p>
                <p className=" font-semibold">
                  {currency.symbol}{" "}
                  {crypto.data.market_data.current_price[
                    `${currency.name}`
                  ].toLocaleString("en-US")}
                </p>
              </div>

              <div className=" w-full h-[1px] rounded-[25px] bg-gray-400"></div>

              <div className=" flex flex-row justify-between">
                <p className=" font-bold">Market Cap</p>
                <p className=" font-semibold">
                  {currency.symbol}{" "}
                  {crypto.data.market_data.market_cap[
                    `${currency.name}`
                  ].toLocaleString("en-US")}
                </p>
              </div>

              <div className=" w-full h-[1px] rounded-[25px] bg-gray-400"></div>

              <div className=" flex flex-row justify-between">
                <p className=" font-bold">24 Hour high</p>
                <p className=" font-semibold">
                  {currency.symbol}{" "}
                  {crypto.data.market_data.high_24h[
                    `${currency.name}`
                  ].toLocaleString("en-US")}
                </p>
              </div>

              <div className=" w-full h-[1px] rounded-[25px] bg-gray-400"></div>

              <div className=" flex flex-row justify-between">
                <p className=" font-bold">24 Hour low</p>
                <p className=" font-semibold">
                  {currency.symbol}{" "}
                  {crypto.data.market_data.low_24h[
                    `${currency.name}`
                  ].toLocaleString("en-US")}
                </p>
              </div>
            </div>

            {historicalData.error === true ? (
              <p className="text-2xl h-[15rem] font-bold text-red-600 text-center mt-10">
                Something went wrong, try again
              </p>
            ) : historicalData.loading === true ? (
              <p className="text-2xl h-[15rem] font-bold text-orange-600 text-center mt-10">
                Loading...
              </p>
            ) : historicalData && historicalData.data ? (
              historicalData && (
                <Chart
                  className=" mt-10 rounded-[5px]"
                  width="100%"
                  height="400px"
                  chartType="LineChart"
                  data={chartData}
                  options={{
                    title: `${cryptoName} Price in ${currency.name}`,
                    hAxis: { title: "Date" },
                    vAxis: {
                      title: `Price (${getCurrencySymbol(currency.name)})`,
                    },
                    legend: "none",
                  }}
                />
              )
            ) : (
              <p className="text-2xl h-[15rem] font-bold text-orange-600 text-center mt-10">
                Something went wrong, refresh the page
              </p>
            )}

            <p className=" mt-[70px] text-white text-[15px] font-semibold md:text-xl">
              {crypto.data.name}&apos;s official website :{" "}
              <Link
                className=" font-bold text-orange-700 hover:text-orange-900 duration-200"
                target="_blank"
                href={crypto.data.links.homepage[0]}
              >
                {crypto.data.links.homepage[0]}
              </Link>
            </p>
          </div>
        )
      ) : (
        <p className="text-2xl h-[10rem] font-bold text-orange-600 text-center mt-10">
          Waiting for a response..
        </p>
      )}
    </main>
  );
}
