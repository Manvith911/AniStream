import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

const WatchlistPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id} className="mb-2 flex items-center">
              <img
                src={it.image_url}
                alt={it.title}
                className="w-12 h-16 rounded mr-3"
              />
              {it.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WatchlistPage;
