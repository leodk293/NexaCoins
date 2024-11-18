'use client'
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

export default function Search_Cypto() {
    const router = useRouter();
    const [cryptoName, setCryptoName] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (cryptoName.trim()) {
            router.push(`/search?crypto=${encodeURIComponent(cryptoName)}`);
            setCryptoName('');
        }
    };


    const [cryptoTab, setCryptoTab] = useState([]);
    const api_key = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY;
    const tab = [];

    async function getCryptoTab() {
        try {
            const options = {
                method: 'GET',
                headers: { accept: 'application/json', 'x-cg-demo-api-key': api_key }
            };
            const api_url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`;

            const response = await fetch(api_url, options);
            if (!response.ok) {
                throw new Error(`An error has occurred: ${response.status}`);
            }

            const result = await response.json();
            for (let i = 0; i < result.length; i++) {
                tab.push(result[i].id)
            }

            setCryptoTab(tab)

        }
        catch (error) {
            console.log(error.message);
            setCryptoTab([]);
        }
    }

    useEffect(() => {
        getCryptoTab();
    }, []);

    return (
        <section className=' mt-10 flex flex-col items-center'>

            <form
                onSubmit={handleSubmit}
                className=' flex flex-row'
                action=""
            >
                <input
                    required
                    list="cryptos"
                    style={{ borderRadius: "5px 0 0 5px" }}
                    className=' text-white p-3 w-auto text-[15px] bg-black outline-none placeholder:font-bold md:w-[20rem] md:text-xl'
                    type="text"
                    placeholder='Search for a crypto...'
                    onChange={(event) => setCryptoName(event.target.value)}
                    value={cryptoName}
                />
                <datalist id="cryptos">
                    {Array.isArray(cryptoTab) && cryptoTab.map((crypto) => (
                        <option
                            value={crypto}
                            key={nanoid(10)}
                        />
                    ))}
                </datalist>
                <button
                    style={{ borderRadius: "0 5px 5px 0" }}
                    className=' border border-transparent px-5 bg-purple-950 hover:bg-purple-800 duration-200'>
                    <Search size={27} color="#ffffff" strokeWidth={1.75} />
                </button>
            </form>

        </section>
    )
}
