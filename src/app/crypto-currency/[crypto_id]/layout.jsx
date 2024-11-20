import React from 'react'

export async function generateMetadata({ params }) {
    const id = params.crypto_id;

    const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    const result = await resp.json();

    return {
        title: ` ${result.name} - NexaCoins`,
        description: ` ${result.name} Infos are displayed here .`,
    };
}

export default function layout({ children }) {
    return (
        <div>
            {children}
        </div>
    )
}
