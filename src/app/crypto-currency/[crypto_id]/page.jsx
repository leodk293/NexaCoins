'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ReadMore from '@/app/components/readMore';
import Link from 'next/link';
import Chart from 'react-google-charts';

export default function Page({ params }) {
    const [cryptoCurrency_id, setCryptoCurrency_id] = useState(null);
    useEffect(() => {
        params.then((resolvedParams) => setCryptoCurrency_id(resolvedParams.crypto_id));
    }, [params]);

    const [coinsData, setCoinsData] = useState({ error: false, data: undefined, loading: false });
    const [historicalData, setHistoricalData] = useState({ error: false, data: undefined, loading: false });
    const [chartData, setChartData] = useState([]);
    const [currency, setCurrency] = useState({ name: 'usd', symbol: '$' });

    const api_key = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': api_key,
        },
    };

    async function fetchCoinsData() {
        setCoinsData({ ...coinsData, loading: true });

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoCurrency_id}`, options);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const result = await response.json();
            setCoinsData({ error: false, data: result, loading: false });
        } catch (error) {
            console.error(error);
            setCoinsData({ error: true, data: undefined, loading: false });
        }
    }

    async function fetchHistoricalChartData() {
        setHistoricalData({ ...historicalData, loading: true });

        try {
            if (!cryptoCurrency_id) throw new Error("Crypto ID is undefined.");
            if (!currency || !currency.name) throw new Error("Currency is undefined.");

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${cryptoCurrency_id}/market_chart?vs_currency=${currency.name}&days=5`,
                options
            );
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const result = await response.json();

            if (!result || !result.prices || !Array.isArray(result.prices)) {
                throw new Error("Invalid historical data received.");
            }

            const tabChartData = [
                ['Date', 'Price'],
                ...result.prices.map(([timestamp, price]) => [new Date(timestamp), price]),
            ];
            setChartData(tabChartData);
            setHistoricalData({ error: false, data: result, loading: false });
        } catch (error) {
            console.error("Error fetching historical data:", error);
            setHistoricalData({ error: true, data: undefined, loading: false });
        }
    }

    function getCurrencySymbol(currencyCode) {
        try {
            return new Intl.NumberFormat('en', {
                style: 'currency',
                currency: currencyCode,
            })
                .formatToParts(1)
                .find((part) => part.type === 'currency').value;
        } catch (error) {
            console.error(`Invalid currency code: ${currencyCode}`, error);
            return '?';
        }

    }

    useEffect(() => {
        const fetchCoinsDataTimeOut = setTimeout(() => fetchCoinsData(), 1000)
        return () => {
            clearTimeout(fetchCoinsDataTimeOut)
        }
    }, [cryptoCurrency_id]);

    useEffect(() => {
        const historicalChartDataTimeout = setTimeout(() => fetchHistoricalChartData(), 1000);
        return () => {
            clearTimeout(historicalChartDataTimeout)
        }
    }, [cryptoCurrency_id, currency]);

    return (
        <main className="m-auto w-auto md:w-[60rem]">
            {coinsData.error ? (
                <p className="text-2xl h-[20rem] font-bold text-red-600 text-center mt-10">
                    Something went wrong, try again
                </p>
            ) : coinsData.loading ? (
                <p className="text-2xl h-[20rem] font-bold text-orange-600 text-center mt-10">
                    Loading...
                </p>
            ) : (
                coinsData.data && (
                    <div className=' mt-10 flex flex-col'>

                        <div className=' flex flex-row gap-2'>
                            <h1 className=' text-white text-2xl font-bold self-center md:text-4xl'>{coinsData.data.name}</h1>
                            <Image
                                src={coinsData.data.image.large}
                                alt={coinsData.data.name}
                                width={50}
                                height={50}
                                className=" self-center rounded-[50%] object-cover"
                            />
                        </div>

                        {
                            coinsData.data.description.en ?
                                <div className=' mt-2 text-white text-[15px] leading-9 md:text-[18px]'>
                                    <ReadMore
                                        text={(coinsData.data.description.en).replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')}
                                        maxLength={400}
                                    />
                                </div>
                                :
                                <p className=' text-2xl mt-5 font-semibold text-slate-400'>Sorry, description not available</p>
                        }


                        <div className=" text-white mt-10 flex flex-wrap gap-5">
                            <p className=" self-center text-xl font-bold">Select a currency :</p>
                            <button
                                onClick={() => setCurrency({
                                    name: 'usd',
                                    symbol: `${getCurrencySymbol('usd')}`
                                })}
                                className=" outline-none font-senibold border border-transparent bg-green-900 px-5 py-1 rounded-[25px]"
                            >
                                Dollar $
                            </button>

                            <button
                                onClick={() => setCurrency({
                                    name: 'eur',
                                    symbol: `${getCurrencySymbol('eur')}`
                                })}
                                className=" outline-none font-senibold border border-transparent bg-blue-900 px-5 py-1 rounded-[25px]"
                            >
                                Euro €
                            </button>

                            <button
                                onClick={() => setCurrency({
                                    name: 'gbp',
                                    symbol: `${getCurrencySymbol('gbp')}`
                                })}
                                className=" outline-none font-senibold border border-transparent bg-purple-900 px-5 py-1 rounded-[25px]"
                            >
                                Pound £
                            </button>

                            <button
                                onClick={() => setCurrency({
                                    name: 'inr',
                                    symbol: `${getCurrencySymbol('inr')}`
                                })}
                                className=" outline-none font-senibold border border-transparent bg-orange-900 px-5 py-1 rounded-[25px]"
                            >
                                Rupee ₹
                            </button>
                        </div>

                        <div className=' text-white mt-5 text-[18px] flex flex-col gap-2 md:text-xl'>

                            <div className=' flex flex-row justify-between'>
                                <p className=' font-bold'>Current Price</p>
                                <p className=' font-semibold'>{currency.symbol} {(coinsData.data.market_data.current_price[`${currency.name}`]).toLocaleString('en-US')}</p>
                            </div>

                            <div className=' w-full h-[1px] rounded-[25px] bg-gray-400'></div>

                            <div className=' flex flex-row justify-between'>
                                <p className=' font-bold'>Market Cap</p>
                                <p className=' font-semibold'>{currency.symbol} {(coinsData.data.market_data.market_cap[`${currency.name}`]).toLocaleString('en-US')}</p>
                            </div>

                            <div className=' w-full h-[1px] rounded-[25px] bg-gray-400'></div>

                            <div className=' flex flex-row justify-between'>
                                <p className=' font-bold'>24 Hour high</p>
                                <p className=' font-semibold'>{currency.symbol} {(coinsData.data.market_data.high_24h[`${currency.name}`]).toLocaleString('en-US')}</p>
                            </div>

                            <div className=' w-full h-[1px] rounded-[25px] bg-gray-400'></div>

                            <div className=' flex flex-row justify-between'>
                                <p className=' font-bold'>24 Hour low</p>
                                <p className=' font-semibold'>{currency.symbol} {(coinsData.data.market_data.low_24h[`${currency.name}`]).toLocaleString('en-US')}</p>
                            </div>

                        </div>

                        {historicalData.error === true ?
                            <p className="text-2xl h-[15rem] font-bold text-red-600 text-center mt-10">
                                Something went wrong, try again
                            </p> :
                            historicalData.loading === true ?
                                <p className="text-2xl h-[15rem] font-bold text-orange-600 text-center mt-10">
                                    Loading...
                                </p> :
                                (
                                    (historicalData && historicalData.data) ?
                                        historicalData &&
                                        <Chart
                                            className=' mt-10 rounded-[5px]'
                                            width="100%"
                                            height="400px"
                                            chartType="LineChart"
                                            data={chartData}
                                            options={{
                                                title: `${cryptoCurrency_id} Price in ${currency.name}`,
                                                hAxis: { title: 'Date' },
                                                vAxis: { title: `Price (${getCurrencySymbol(currency.name)})` },
                                                legend: 'none',
                                            }}
                                        />
                                        :
                                        <p className="text-2xl h-[15rem] font-bold text-orange-600 text-center mt-10">
                                            Something went wrong, refresh the page
                                        </p>

                                )
                        }

                        <p className=' mt-[70px] text-white text-[15px] font-semibold md:text-xl'>{coinsData.data.name}&apos;s official website : <Link className=' font-bold text-orange-700 hover:text-orange-900 duration-200' target='_blank' href={coinsData.data.links.homepage[0]}>{coinsData.data.links.homepage[0]}</Link></p>
                    </div>
                )
            )}
        </main>
    );
}
