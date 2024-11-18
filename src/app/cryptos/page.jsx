'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import '../globals.css'
import { MoveUp } from "lucide-react";
import { MoveDown } from "lucide-react";
import Link from "next/link";

export default function page() {

    const api_key = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY;

    const [currency, setCurrency] = useState({
        name: 'usd',
        symbol: '$'
    })

    const [cryptoList, setCryptoList] = useState({
        error: false,
        data: undefined,
        loading: false
    })

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
            console.log(data)

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

            <h1 className=" mt-10 text-center text-2xl text-yellow-600 font-bold md:text-3xl">Discover several cryptocurrencies</h1>

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

                            {cryptoList.data.map((crypto) => (

                                <Link href={`/crypto-currency/${crypto.id}`} key={crypto.id}>
                                    <div
                                        className="grid grid-cols-6 border-b text-[12px] border-gray-700 py-2 font-semibold md:text-[15px] md:hover:bg-[#ffffff28] duration-300 md:px-1"
                                    >

                                        <p>{crypto.market_cap_rank}</p>
                                        <p className=" leading-5">{crypto.name}</p>
                                        <Image
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

        </main>
    )
}
