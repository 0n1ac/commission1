(function () {
  const DATA_FILES = {
    restaurants: './data/restaurants.json',
    users: './data/users.json',
    events: './data/events.json',
    posts: './data/posts.json',
    chatRooms: './data/chatRooms.json',
    messages: './data/messages.json',
  };

  const state = {
    restaurants: [],
    users: [],
    events: [],
    posts: [],
    chatRooms: [],
    messages: {},
    isLoaded: false,
  };

  async function loadJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`데이터를 불러오지 못했습니다: ${url}`);
    }

    return response.json();
  }

  async function loadAllData() {
    const entries = await Promise.all(
      Object.entries(DATA_FILES).map(async ([key, url]) => [key, await loadJson(url)])
    );

    entries.forEach(([key, value]) => {
      state[key] = value;
    });
    state.isLoaded = true;

    return state;
  }

  window.BapFriendData = {
    DATA_FILES,
    state,
    loadJson,
    loadAllData,
  };
})();
