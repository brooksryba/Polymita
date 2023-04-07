import { useEffect, useState } from "react";

type StoreItem = {
  id: number;
  name: string;
  date: number;
  price: number;
  image: string;
};

function StoreItems() {
    const [items, setItems] = useState<StoreItem[]>([]);

    useEffect(() => {
      fetch("http://localhost:5000/list")
        .then((response) => response.json())
        .then((data: StoreItem[]) => {
          setItems(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <div className="StoreItems">
            {items.map((item) => (
            <div className="item">
                <img alt="" src={require.context("images/pottery", false, /\.(webp)$/)(item.image)}/>
                <hr/>
                <span className="title">{item.name}</span><br/>
                Price: <span className="price">${item.price}</span><br/>
                Added: <span className="date">{new Date(item.date*1000).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                    })}</span>
            </div>
            ))}
        </div>
    );
}

export default StoreItems;