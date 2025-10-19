// src/services/characters.js
export const fetchRandomCharacter = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        characters {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
  `;
  const randomPage = Math.floor(Math.random() * 50) + 1;
  const variables = { page: randomPage, perPage: 1 };
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.data?.Page?.characters?.length) {
      const char = json.data.Page.characters[0];
      return { name: char.name.full, avatar_url: char.image.large };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
