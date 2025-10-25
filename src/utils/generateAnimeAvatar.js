// src/utils/generateAnimeAvatar.js
export async function generateAnimeAvatar() {
  const query = `
    query {
      Page(page: ${Math.floor(Math.random() * 20) + 1}, perPage: 1) {
        characters(sort: FAVOURITES_DESC) {
          image {
            large
          }
        }
      }
    }
  `;
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    const char = data.data.Page.characters[0];
    return char.image.large;
  } catch (err) {
    console.error("Error generating anime avatar:", err);
    return null;
  }
}
