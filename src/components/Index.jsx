import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Loading from './Loading'
import Data from './Data'
import './style.css'

const Index = () => {

    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [all, setAll] = useState(Data);

    const getSearch = (event) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        async function getData() {
            setLoading(true);
            let responseJsonData = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`
            );

            setAll(responseJsonData.data);
            setLoading(false);
        }
        getData();
    }, []);

    useEffect(() => {
        const newData = all.filter((crypto) => {
            let lenc = crypto.name.length
            let lens = search.length
            let s = crypto.name.slice(0, Math.min(lenc, lens))
            let ser = search
            return (s.toLowerCase() === ser.toLowerCase())
        })

        if (search === '') { setData(all) } else { setData(newData) }
    }, [search,all])

    return (
        <>
            <Navbar />
            {
                loading === true ? <Loading /> :
                    <>
                        <div className="banner text-center mb-4">
                            Search a Currency
                        </div>
                        <div className="inputset flexy mb-5">
                            <input 
                            className="styleInput text-white form-control" 
                            type="text"
                            placeholder="Search Currency . . . ."
                            value={search} 
                            onChange={getSearch} />
                        </div>
                        <div className="dataAnalysis mb-5 flexy">
                            <table className="table text-white mx-5">
                                {
                                    data.length !== 0 ?
                                        data.map((crypto, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="edit">
                                        <img className="bitcoin-img me-3" src={crypto.image} alt="" />
                                                       
                                                        {crypto.name}
                                                    </td>
                                                    <td className="edit">
                                                        {crypto.symbol.toUpperCase()}
                                                    </td>
                                                    <td className="edit text-end">
                                                        ${crypto.current_price.toFixed(2)}
                                                    </td>
                                                    <td className="edit text-end">
                                                        ${crypto.total_volume}
                                                    </td>
                                                    {
                                                        crypto.price_change_percentage_24h.toFixed(2)>=0 ? 
                                                    
                                                    <td className="edit text-success text-end">
                                                        {crypto.price_change_percentage_24h.toFixed(2)}%
                                                    </td>
                                                    : 
                                                    <td className="edit f600 text-danger text-end">
                                                        {crypto.price_change_percentage_24h.toFixed(2)}%
                                                    </td>
                                                    } 
                                                    <td className="edit text-end">Mkt_Cap : ${crypto.market_cap}</td>
                                            
                                                </tr>
                                            )
                                        })
                                        :
                                        <div className="unavailable text-center my-5">
                                            Search Unavialable
                                        </div>

                                }
                            </table>
                        </div>
                    </>
            }
        </>
    )
}

export default Index
