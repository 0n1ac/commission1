(function () {
  const router = window.BapFriendRouter;
  const views = Array.from(document.querySelectorAll('[data-route]'));
  const navItems = Array.from(document.querySelectorAll('[data-nav-route]'));
  const homePage = document.querySelector('[data-home-page]');
  const mapPage = document.querySelector('[data-map-page]');
  const boardPage = document.querySelector('[data-board-page]');
  const chatPage = document.querySelector('[data-chat-page]');
  const mypage = document.querySelector('[data-mypage]');
  const mapState = {
    category: '주변',
    tab: 'ranking',
    sheetSnap: 'mid',
    selectedLocation: '논현동',
  };
  const boardState = {
    tab: 'food',
    openNoticeId: 'n001',
  };
  const chatState = {
    activeRoomId: '',
  };
  const mypageState = {
    view: 'main',
    settings: {
      notifications: true,
      location: true,
      darkMode: false,
    },
  };
  const searchState = {
    query: '',
  };
  const interactionState = {
    bookmarks: [],
    friends: [],
    stampCount: 7,
    aiLoading: false,
    aiResults: [],
  };
  const categories = ['주변', '한식', '양식', '일식', '중식', '카페'];
  const locations = ['논현동', '역삼동', '성수동', '망원동', '합정동', '연남동'];
  const orderGroups = [
    { id: 'o001', host: '한지호', restaurant: '성수 라멘 연구소', members: '2/4명', deadline: '18분 남음' },
    { id: 'o002', host: '김서윤', restaurant: '망원 비건 키친', members: '3/4명', deadline: '24분 남음' },
    { id: 'o003', host: '박민재', restaurant: '을지로 노포 곱창', members: '2/3명', deadline: '31분 남음' },
    { id: 'o004', host: '최유나', restaurant: '논현 분식당', members: '1/4명', deadline: '42분 남음' },
  ];
  const notices = [
    {
      id: 'n001',
      title: 'You and 米 서비스 업데이트 안내',
      date: '2026.05.25',
      content: '지도 탭과 지역 게시판 목업 기능이 추가되었습니다. 시연용 앱에서는 실제 결제와 위치 API가 동작하지 않습니다.',
    },
    {
      id: 'n002',
      title: '커뮤니티 이용 가이드',
      date: '2026.05.20',
      content: '식사 약속을 만들 때는 장소, 시간, 인원 정보를 명확히 적어주세요. 개인정보는 게시글에 직접 노출하지 않는 것을 권장합니다.',
    },
    {
      id: 'n003',
      title: '방문도장 리워드 정책 안내',
      date: '2026.05.15',
      content: '방문도장 10개를 모으면 무료 음료 쿠폰을 받을 수 있습니다. 본 프로젝트에서는 리워드 UI만 목업으로 제공합니다.',
    },
    {
      id: 'n004',
      title: '고객센터 운영 시간',
      date: '2026.05.10',
      content: '1대1 문의는 평일 10:00부터 18:00까지 순차적으로 답변됩니다.',
    },
  ];
  const mypageMenus = [
    { key: 'recent', icon: '🍽', label: '최근에 식사한 친구' },
    { key: 'favorites', icon: '★', label: '즐겨찾기 친구' },
    { key: 'settings', icon: '⚙', label: '설정' },
    { key: 'privacy', icon: '🔒', label: '개인정보 관리' },
    { key: 'ranking', icon: '🏆', label: '식당 랭킹' },
    { key: 'support', icon: '✉', label: '1대1 문의' },
    { key: 'help', icon: '?', label: '도움말' },
    { key: 'alerts', icon: '🔔', label: '알림 설정' },
    { key: 'language', icon: '文', label: '언어' },
  ];
  const recentSearches = ['성수 라멘', '곱창', '비건 브런치', '논현 점심'];
  const popularSearches = ['혼밥', '한식', '친구 추천', 'N 결제'];
  const aiMenus = [
    { name: '김치찌개', reason: '든든한 한식이 필요한 날에 좋아요' },
    { name: '돈코츠 라멘', reason: '진한 국물과 빠른 식사에 잘 맞아요' },
    { name: '새우 오일 파스타', reason: '가볍지만 기분 전환이 되는 메뉴예요' },
    { name: '양념치킨', reason: '친구와 나눠 먹기 좋은 선택이에요' },
    { name: '소고기 쌀국수', reason: '따뜻하고 부담 없는 한 끼예요' },
    { name: '버섯 솥밥', reason: '정갈한 식사와 리워드 도장 코스에 어울려요' },
  ];
  const notifications = [
    { id: 'nt001', title: '김지수님이 친구 요청을 보냈습니다', time: '방금', unread: true },
    { id: 'nt002', title: '을지로 노포 곱창에 새 리뷰가 달렸습니다', time: '12분 전', unread: true },
    { id: 'nt003', title: '성수 점심 번개 모집이 곧 마감됩니다', time: '28분 전', unread: true },
    { id: 'nt004', title: '방문도장 리워드까지 3개 남았습니다', time: '1시간 전', unread: false },
    { id: 'nt005', title: '이번 주 이벤트가 업데이트되었습니다', time: '어제', unread: false },
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function readStorage(key, fallback) {
    try {
      const rawValue = localStorage.getItem(key);
      return rawValue ? JSON.parse(rawValue) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage may be unavailable in restricted previews.
    }
  }

  function hasStorage(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  function applyDarkMode(enabled) {
    document.body.classList.toggle('dark', enabled);
    writeStorage('bapfriend:darkMode', enabled);
  }

  function initializeInteractionState() {
    interactionState.bookmarks = readStorage('bapfriend:bookmarks', []);
    interactionState.friends = readStorage('bapfriend:friends', []);
    interactionState.stampCount = readStorage('bapfriend:stampCount', 7);
    mypageState.settings.darkMode = readStorage('bapfriend:darkMode', false);
    applyDarkMode(mypageState.settings.darkMode);
  }

  function isBookmarked(restaurant) {
    return interactionState.bookmarks.includes(restaurant.id);
  }

  function renderRestaurantCard(restaurant) {
    const categories = restaurant.category.join(' · ');
    const bookmark = isBookmarked(restaurant) ? '♥' : '♡';

    return `
      <article class="card card-restaurant card-restaurant--vertical">
        <div class="card-restaurant__image" aria-hidden="true"></div>
        <div class="card-restaurant__content">
          <div class="card-restaurant__meta">
            <span class="card-restaurant__rating">☆ ${escapeHtml(restaurant.rating)}</span>
            <button class="card-restaurant__bookmark" type="button" data-bookmark-id="${escapeHtml(restaurant.id)}" aria-label="${escapeHtml(restaurant.name)} 북마크">${bookmark}</button>
          </div>
          <p class="card-restaurant__detail">${escapeHtml(categories)}</p>
          <h3 class="card-restaurant__title">${escapeHtml(restaurant.name)}</h3>
          <p class="card-restaurant__detail">${escapeHtml(restaurant.distance)} | ${escapeHtml(restaurant.priceRange)}</p>
        </div>
      </article>
    `;
  }

  function renderMapRestaurantCard(restaurant) {
    const categories = restaurant.category.join(' · ');
    const bookmark = isBookmarked(restaurant) ? '♥' : '♡';

    return `
      <article class="card card-restaurant map-restaurant-card">
        <span class="map-restaurant-card__rating">☆ ${escapeHtml(restaurant.rating)}</span>
        <div class="card-restaurant__image" aria-hidden="true"></div>
        <div class="card-restaurant__content">
          <p class="card-restaurant__detail">${escapeHtml(categories)}</p>
          <h3 class="card-restaurant__title">${escapeHtml(restaurant.name)}</h3>
          <p class="card-restaurant__detail">${escapeHtml(restaurant.distance)} | ${escapeHtml(restaurant.priceRange)}</p>
        </div>
        <button class="map-bookmark" type="button" data-bookmark-id="${escapeHtml(restaurant.id)}" aria-label="${escapeHtml(restaurant.name)} 북마크">${bookmark}</button>
      </article>
    `;
  }

  function renderFriendCard(user) {
    const initials = user.name.slice(0, 1);
    const tags = user.tags.map((tag) => `<span class="home-tag">${escapeHtml(tag)}</span>`).join('');
    const isAdded = interactionState.friends.includes(user.id);

    return `
      <article class="card card-friend">
        <div class="card-friend__avatar" aria-hidden="true">${escapeHtml(initials)}</div>
        <div class="card-friend__tags">${tags}</div>
        <h3 class="card-friend__name">${escapeHtml(user.name)}</h3>
        <button class="btn btn--pill home-friend-button${isAdded ? ' is-added' : ''}" type="button" data-friend-id="${escapeHtml(user.id)}">${isAdded ? '✓ 추가됨' : '친구 추가'}</button>
      </article>
    `;
  }

  function renderStampCells(count) {
    return Array.from({ length: 10 }, (_, index) => {
      const isComplete = index < count;
      return `<span class="card-stamp__cell${isComplete ? ' is-complete' : ''}" aria-label="${index + 1}번째 도장">${isComplete ? '✓' : ''}</span>`;
    }).join('');
  }

  function renderHome(data) {
    if (!homePage) {
      return;
    }

    const restaurants = data.restaurants.slice(0, 4);
    const friends = data.users.slice(0, 4);
    const event = data.events[0];
    const stampCount = Math.min(interactionState.stampCount, 10);
    const aiButtonLabel = interactionState.aiLoading
      ? '<span class="spinner" aria-hidden="true"></span> 추천 중'
      : interactionState.aiResults.length
        ? '다시 추천받기 <span aria-hidden="true">→</span>'
        : '추천받기 <span aria-hidden="true">→</span>';

    homePage.innerHTML = `
      <header class="home-hero">
        <p class="home-hero__eyebrow">안녕하세요</p>
        <h1 id="title-home" class="home-hero__title">오늘은 뭐 드실래요?</h1>
      </header>

      <button class="search-bar home-search" type="button" aria-label="식당, 친구, 지역 검색">
        <span class="home-search__icon" aria-hidden="true">◖</span>
        <span class="home-search__placeholder">식당, 친구, 지역 검색</span>
        <span class="home-search__filter" aria-hidden="true">☷</span>
      </button>

      <section class="home-ai-card" aria-labelledby="home-ai-title">
        <p class="home-ai-card__label">오늘 뭐 먹지?</p>
        <h2 id="home-ai-title" class="home-ai-card__title">AI 메뉴 추천</h2>
        <p class="home-ai-card__description">지금 기분과 위치 기반으로 딱 맞는 메뉴를 골라드려요</p>
        <button class="btn btn--primary home-ai-card__button" type="button" data-ai-recommend ${interactionState.aiLoading ? 'disabled' : ''}>${aiButtonLabel}</button>
        ${interactionState.aiResults.length ? `
          <div class="home-ai-results" aria-live="polite">
            ${interactionState.aiResults.map((menu) => `
              <article class="home-ai-result-card">
                <strong>${escapeHtml(menu.name)}</strong>
                <p>${escapeHtml(menu.reason)}</p>
              </article>
            `).join('')}
          </div>
        ` : ''}
      </section>

      <section class="home-section" aria-labelledby="home-restaurants-title">
        <div class="section-header">
          <div>
            <h2 id="home-restaurants-title" class="section-header__title">추천 식당</h2>
            <p class="section-header__subtitle">You and 米님을 위한 오늘의 픽</p>
          </div>
          <a class="section-header__link" href="#map">더 보기→</a>
        </div>
        <div class="home-scroll-row" aria-label="추천 식당 목록">
          ${restaurants.map(renderRestaurantCard).join('')}
        </div>
      </section>

      <section class="card card-stamp home-section home-stamp" aria-labelledby="home-stamp-title" data-stamp-card>
        <div class="home-stamp__top">
          <div>
            <h2 id="home-stamp-title" class="card-stamp__count">${stampCount}<span>/10</span></h2>
            <p class="home-stamp__reward">다음 보상 · 무료 음료 쿠폰</p>
          </div>
          <span class="badge">◆ VIP</span>
        </div>
        <div class="card-stamp__grid" aria-label="방문 도장 10개 중 ${stampCount}개 완료">
          ${renderStampCells(stampCount)}
        </div>
      </section>

      <section class="home-section" aria-labelledby="home-friends-title">
        <div class="section-header">
          <div>
            <h2 id="home-friends-title" class="section-header__title">추천 친구</h2>
            <p class="section-header__subtitle">비슷한 취향을 가진 사람들</p>
          </div>
          <a class="section-header__link" href="#mypage">더 보기→</a>
        </div>
        <div class="home-scroll-row" aria-label="추천 친구 목록">
          ${friends.map(renderFriendCard).join('')}
        </div>
      </section>

      <section class="card-event home-section" aria-labelledby="home-event-title">
        <p class="card-event__label">이번 주 이벤트</p>
        <h2 id="home-event-title" class="card-event__title">${escapeHtml(event.title)}</h2>
        <p class="card-event__description">${escapeHtml(event.description)}</p>
        <button class="btn btn--pill home-event__button" type="button">${escapeHtml(event.ctaLabel)} <span aria-hidden="true">→</span></button>
      </section>
    `;
  }

  function renderBoardPost(post) {
    const initial = post.author.slice(0, 1);

    return `
      <article class="card card-post board-post-card">
        <div class="card-post__header">
          <div class="board-post-card__author">
            <span class="board-avatar" aria-hidden="true">${escapeHtml(initial)}</span>
            <div>
              <p class="card-post__author">${escapeHtml(post.author)}</p>
              <p class="card-post__time">${escapeHtml(post.time)}</p>
            </div>
          </div>
        </div>
        <p class="card-post__content">${escapeHtml(post.content)}</p>
        <div class="board-post-card__image" aria-hidden="true"></div>
        <div class="card-post__actions">
          <span>♡ ${escapeHtml(post.likes)}</span>
          <span>💬 ${escapeHtml(post.comments)}</span>
        </div>
      </article>
    `;
  }

  function renderBoardEvent(event, index) {
    return `
      <button class="card board-event-card" type="button" data-event-detail="${escapeHtml(event.id)}">
        <div class="board-event-card__image" aria-hidden="true">${index + 1}</div>
        <div class="board-event-card__body">
          <p class="board-event-card__date">${escapeHtml(event.date)} · ${escapeHtml(event.location)}</p>
          <h3 class="board-event-card__title">${escapeHtml(event.title)}</h3>
          <p class="board-event-card__description">${escapeHtml(event.description)}</p>
          <span class="badge board-event-card__badge">${24 + index * 9}명 참여</span>
        </div>
      </button>
    `;
  }

  function renderNotice(notice) {
    const isOpen = notice.id === boardState.openNoticeId;

    return `
      <article class="card board-notice${isOpen ? ' is-open' : ''}">
        <button class="board-notice__button" type="button" data-notice-id="${escapeHtml(notice.id)}" aria-expanded="${isOpen}">
          <span>
            <strong>${escapeHtml(notice.title)}</strong>
            <small>${escapeHtml(notice.date)}</small>
          </span>
          <span class="board-notice__icon" aria-hidden="true">${isOpen ? '−' : '+'}</span>
        </button>
        <p class="board-notice__content">${escapeHtml(notice.content)}</p>
      </article>
    `;
  }

  function renderBoardContent(data) {
    if (boardState.tab === 'events') {
      if (!data.events.length) {
        return '<div class="empty-state"><strong>이벤트가 없습니다</strong><p>새 지역 이벤트가 등록되면 알려드릴게요.</p></div>';
      }

      return `
        <div class="board-list">
          ${data.events.map(renderBoardEvent).join('')}
        </div>
      `;
    }

    if (boardState.tab === 'notice') {
      return `
        <div class="board-list">
          ${notices.map(renderNotice).join('')}
        </div>
      `;
    }

    if (!data.posts.length) {
      return '<div class="empty-state"><strong>게시글이 없습니다</strong><p>첫 지역 맛집 이야기를 남겨보세요.</p></div>';
    }

    return `
      <div class="board-list">
        ${data.posts.map(renderBoardPost).join('')}
      </div>
      <button class="fab board-fab" type="button" data-open-post-modal aria-label="글쓰기">+</button>
    `;
  }

  function renderBoard(data) {
    if (!boardPage) {
      return;
    }

    const tabs = [
      { key: 'food', label: '지역맛집' },
      { key: 'events', label: '지역이벤트' },
      { key: 'notice', label: '공지사항' },
    ];

    boardPage.innerHTML = `
      <header class="board-header">
        <h1 id="title-board" class="view__title">지역게시판</h1>
      </header>
      <div class="board-tabs" role="tablist" aria-label="게시판 탭">
        ${tabs.map((tab) => `
          <button class="board-tab${tab.key === boardState.tab ? ' is-active' : ''}" type="button" role="tab" aria-selected="${tab.key === boardState.tab}" data-board-tab="${tab.key}">${tab.label}</button>
        `).join('')}
      </div>
      <section class="board-content" data-board-content>
        ${renderBoardContent(data)}
      </section>
    `;
  }

  function getChatInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part.slice(0, 1))
      .slice(0, 2);
  }

  function renderChatAvatar(room) {
    const initials = getChatInitials(room.name);

    if (room.isGroup) {
      return `
        <span class="chat-avatar-stack" aria-hidden="true">
          <span>${escapeHtml(initials[0] || 'Y')}</span>
          <span>${escapeHtml(initials[1] || '米')}</span>
          <span>+</span>
        </span>
      `;
    }

    return `<span class="card-chat__avatar" aria-hidden="true">${escapeHtml(initials[0] || room.name.slice(0, 1))}</span>`;
  }

  function renderChatRoomCard(room) {
    return `
      <button class="card card-chat chat-room-card" type="button" data-chat-room-id="${escapeHtml(room.id)}">
        ${renderChatAvatar(room)}
        <span class="card-chat__content">
          <span class="card-chat__top">
            <strong class="card-chat__name">${escapeHtml(room.name)}</strong>
            <span class="card-chat__time">${escapeHtml(room.time)}</span>
          </span>
          <span class="chat-room-card__bottom">
            <span class="card-chat__message">${escapeHtml(room.lastMessage)}</span>
            ${room.unreadCount > 0 ? `<span class="badge chat-unread">${escapeHtml(room.unreadCount)}</span>` : ''}
          </span>
        </span>
      </button>
    `;
  }

  function renderChatMessage(message) {
    return `
      <article class="chat-message${message.isMine ? ' is-mine' : ''}">
        <div class="chat-bubble">
          ${message.isMine ? '' : `<strong class="chat-bubble__sender">${escapeHtml(message.sender)}</strong>`}
          <p>${escapeHtml(message.text)}</p>
        </div>
        <time class="chat-message__time">${escapeHtml(message.time)}</time>
      </article>
    `;
  }

  function renderChatList(data) {
    if (!data.chatRooms.length) {
      return `
        <header class="chat-header">
          <h1 id="title-chat" class="view__title">채팅</h1>
          <button class="chat-notification" type="button" data-open-notifications aria-label="알림">🔔</button>
        </header>
        <div class="empty-state"><strong>채팅방이 없습니다</strong><p>친구를 추가하고 첫 대화를 시작해보세요.</p></div>
      `;
    }

    return `
      <header class="chat-header">
        <h1 id="title-chat" class="view__title">채팅</h1>
        <button class="chat-notification" type="button" data-open-notifications aria-label="알림">🔔</button>
      </header>
      <section class="chat-room-list" aria-label="채팅방 목록">
        ${data.chatRooms.map(renderChatRoomCard).join('')}
      </section>
    `;
  }

  function renderChatDetail(data) {
    const room = data.chatRooms.find((item) => item.id === chatState.activeRoomId) || data.chatRooms[0];
    const messages = data.messages[room.id] || [];

    return `
      <div class="chat-detail">
        <header class="chat-detail__header">
          <button class="chat-back" type="button" data-chat-back aria-label="채팅 목록으로 돌아가기">←</button>
          <div>
            <h1 id="title-chat" class="chat-detail__title">${escapeHtml(room.name)}</h1>
            <p class="chat-detail__subtitle">${room.isGroup ? '그룹 채팅' : '1:1 채팅'}</p>
          </div>
          <button class="chat-menu" type="button" aria-label="채팅 메뉴">⋮</button>
        </header>
        <section class="chat-message-list" data-chat-messages aria-label="${escapeHtml(room.name)} 대화 내역">
          ${messages.map(renderChatMessage).join('')}
        </section>
        <form class="chat-input-bar" data-chat-form>
          <input class="chat-input" type="text" placeholder="메시지 입력" autocomplete="off" data-chat-input>
          <button class="chat-send" type="submit" aria-label="전송">➤</button>
        </form>
      </div>
    `;
  }

  function renderChat(data) {
    if (!chatPage) {
      return;
    }

    chatPage.innerHTML = chatState.activeRoomId ? renderChatDetail(data) : renderChatList(data);

    if (chatState.activeRoomId) {
      requestAnimationFrame(() => {
        const messageList = document.querySelector('[data-chat-messages]');
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      });
    }
  }

  function getSavedLanguage() {
    try {
      return localStorage.getItem('bapfriend:language') || 'ko';
    } catch {
      return 'ko';
    }
  }

  function renderMypageFriend(user, detail, actionLabel) {
    return `
      <article class="card mypage-friend-card">
        <div class="card-friend__avatar" aria-hidden="true">${escapeHtml(user.name.slice(0, 1))}</div>
        <div class="mypage-friend-card__body">
          <h3>${escapeHtml(user.name)}</h3>
          <p>${escapeHtml(user.tags.join(', '))}</p>
          <small>${escapeHtml(detail)}</small>
        </div>
        ${actionLabel ? `<button class="btn btn--pill mypage-small-button" type="button">${escapeHtml(actionLabel)}</button>` : ''}
      </article>
    `;
  }

  function renderMypageHeader(title) {
    return `
      <header class="mypage-sub-header">
        <button class="chat-back" type="button" data-mypage-back aria-label="마이페이지로 돌아가기">←</button>
        <h1 id="title-mypage" class="view__title">${escapeHtml(title)}</h1>
      </header>
    `;
  }

  function renderSettings() {
    const items = [
      { key: 'notifications', label: '알림 수신' },
      { key: 'location', label: '위치 서비스' },
      { key: 'darkMode', label: '다크모드' },
    ];

    return `
      <div class="mypage-list">
        ${items.map((item) => `
          <button class="card mypage-toggle-row" type="button" data-setting-toggle="${item.key}" aria-pressed="${mypageState.settings[item.key]}">
            <span>${escapeHtml(item.label)}</span>
            <span class="mypage-switch${mypageState.settings[item.key] ? ' is-on' : ''}" aria-hidden="true"></span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderInquiryForm() {
    return `
      <form class="card mypage-inquiry-form" data-inquiry-form>
        <label class="map-field">
          <span>제목</span>
          <input class="map-input" type="text" placeholder="문의 제목">
        </label>
        <label class="map-field">
          <span>내용</span>
          <textarea class="board-textarea" rows="6" placeholder="문의 내용을 입력하세요"></textarea>
        </label>
        <button class="btn btn--primary" type="submit">문의하기</button>
      </form>
    `;
  }

  function renderLanguageOptions() {
    const savedLanguage = getSavedLanguage();

    return `
      <div class="mypage-list" role="radiogroup" aria-label="언어 선택">
        ${[
          { key: 'ko', label: '한국어' },
          { key: 'en', label: 'English' },
        ].map((language) => `
          <label class="card mypage-radio-row">
            <span>${escapeHtml(language.label)}</span>
            <input type="radio" name="language" value="${language.key}" data-language-option ${savedLanguage === language.key ? 'checked' : ''}>
          </label>
        `).join('')}
      </div>
    `;
  }

  function renderPlaceholderSubPage(title, message) {
    return `
      <div class="card mypage-placeholder">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  function renderMypageSubView(data) {
    const view = mypageState.view;
    const titles = {
      recent: '최근에 식사한 친구',
      favorites: '즐겨찾기 친구',
      settings: '설정',
      privacy: '개인정보 관리',
      ranking: '식당 랭킹',
      support: '1대1 문의',
      help: '도움말',
      alerts: '알림 설정',
      language: '언어',
    };
    let content = '';

    if (view === 'recent') {
      content = `
        <div class="mypage-list">
          ${data.users.slice(0, 4).map((user, index) => renderMypageFriend(user, `마지막 식사: ${index + 2}일 전`, '')).join('')}
        </div>
      `;
    } else if (view === 'favorites') {
      const favorites = data.users.filter((user) => user.isFriend).concat(data.users.slice(0, 1));
      content = `
        <div class="mypage-list">
          ${favorites.slice(0, 4).map((user) => renderMypageFriend(user, '즐겨찾기 친구', '★ 해제')).join('')}
        </div>
      `;
    } else if (view === 'settings' || view === 'alerts') {
      content = renderSettings();
    } else if (view === 'support') {
      content = renderInquiryForm();
    } else if (view === 'language') {
      content = renderLanguageOptions();
    } else if (view === 'ranking') {
      content = renderPlaceholderSubPage('식당 랭킹', '지도 탭의 식당 랭킹과 연결될 예정입니다.');
    } else if (view === 'privacy') {
      content = renderPlaceholderSubPage('개인정보 관리', '프로필 정보와 계정 보안 설정 화면입니다.');
    } else {
      content = renderPlaceholderSubPage('도움말', '자주 묻는 질문과 이용 가이드를 준비 중입니다.');
    }

    return `${renderMypageHeader(titles[view] || '마이페이지')}${content}`;
  }

  function renderMypageMain() {
    return `
      <header class="mypage-profile">
        <div class="mypage-profile__avatar" aria-hidden="true">米</div>
        <div class="mypage-profile__body">
          <h1 id="title-mypage">You and 米</h1>
          <p>오늘도 맛있는 약속을 찾아보세요</p>
          <button class="btn btn--pill mypage-edit-button" type="button">프로필 편집</button>
        </div>
      </header>
      <nav class="mypage-menu" aria-label="마이페이지 메뉴">
        ${mypageMenus.map((item, index) => `
          <button class="menu-item mypage-menu-item${[2, 5, 7].includes(index) ? ' has-divider' : ''}" type="button" data-mypage-view="${item.key}">
            <span class="menu-item__icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
            <span class="menu-item__label">${escapeHtml(item.label)}</span>
            <span class="menu-item__arrow">›</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  function renderMypage(data) {
    if (!mypage) {
      return;
    }

    mypage.innerHTML = mypageState.view === 'main' ? renderMypageMain(data) : renderMypageSubView(data);
  }

  function createSearchRestaurantCard(restaurant) {
    return `
      <button class="card card-restaurant search-result-card" type="button" data-search-result="${escapeHtml(restaurant.name)}">
        <div class="card-restaurant__image" aria-hidden="true"></div>
        <div class="card-restaurant__content">
          <p class="card-restaurant__detail">${escapeHtml(restaurant.category.join(' · '))}</p>
          <h3 class="card-restaurant__title">${escapeHtml(restaurant.name)}</h3>
          <p class="card-restaurant__detail">☆ ${escapeHtml(restaurant.rating)} · ${escapeHtml(restaurant.distance)} · ${escapeHtml(restaurant.priceRange)}</p>
        </div>
      </button>
    `;
  }

  function createSearchFriendCard(user) {
    return `
      <button class="card search-friend-card" type="button" data-search-result="${escapeHtml(user.name)}">
        <div class="card-friend__avatar" aria-hidden="true">${escapeHtml(user.name.slice(0, 1))}</div>
        <div class="search-friend-card__body">
          <h3>${escapeHtml(user.name)}</h3>
          <p>${escapeHtml(user.tags.join(', '))}</p>
        </div>
        <span class="btn btn--pill mypage-small-button">보기</span>
      </button>
    `;
  }

  function getSearchResults(data) {
    const query = searchState.query.trim().toLowerCase();

    if (query.length < 2) {
      return { restaurants: [], users: [] };
    }

    const restaurants = data.restaurants.filter((restaurant) => {
      const target = `${restaurant.name} ${restaurant.category.join(' ')}`.toLowerCase();
      return target.includes(query);
    });
    const users = data.users.filter((user) => {
      const target = `${user.name} ${user.tags.join(' ')}`.toLowerCase();
      return target.includes(query);
    });

    return { restaurants, users };
  }

  function renderSearchContent(data) {
    const query = searchState.query.trim();

    if (query.length < 2) {
      return `
        <section class="search-suggestions">
          <h2>최근 검색어</h2>
          <div class="search-chip-list">
            ${recentSearches.map((keyword) => `<button class="chip" type="button" data-search-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>`).join('')}
          </div>
        </section>
        <section class="search-suggestions">
          <h2>인기 검색어</h2>
          <div class="search-chip-list">
            ${popularSearches.map((keyword) => `<button class="chip" type="button" data-search-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>`).join('')}
          </div>
        </section>
      `;
    }

    const results = getSearchResults(data);

    if (!results.restaurants.length && !results.users.length) {
      return '<p class="search-empty">검색 결과가 없습니다</p>';
    }

    return `
      ${results.restaurants.length ? `
        <section class="search-results-section">
          <h2>식당</h2>
          <div class="search-result-list">${results.restaurants.map(createSearchRestaurantCard).join('')}</div>
        </section>
      ` : ''}
      ${results.users.length ? `
        <section class="search-results-section">
          <h2>친구</h2>
          <div class="search-result-list">${results.users.map(createSearchFriendCard).join('')}</div>
        </section>
      ` : ''}
    `;
  }

  function renderSearchOverlay() {
    const data = getDataState();

    if (!data?.isLoaded) {
      return;
    }

    let overlay = document.querySelector('[data-search-overlay]');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'search-overlay';
      overlay.dataset.searchOverlay = 'true';
      document.body.append(overlay);
    }

    overlay.innerHTML = `
      <div class="search-overlay__panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <header class="search-overlay__header">
          <button class="chat-back" type="button" data-close-search aria-label="검색 닫기">←</button>
          <label class="search-overlay__input-wrap">
            <span id="search-title" class="map-visually-hidden">통합 검색</span>
            <input class="search-overlay__input" type="search" placeholder="식당, 친구, 지역 검색" value="${escapeHtml(searchState.query)}" data-search-input>
          </label>
          <button class="search-overlay__clear" type="button" data-clear-search aria-label="검색어 지우기">×</button>
        </header>
        <main class="search-overlay__content" data-search-content>
          ${renderSearchContent(data)}
        </main>
      </div>
    `;

    requestAnimationFrame(() => {
      const input = overlay.querySelector('[data-search-input]');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }

  function closeSearchOverlay() {
    searchState.query = '';
    document.querySelector('[data-search-overlay]')?.remove();
  }

  function getFilteredRestaurants(data) {
    if (mapState.category === '주변') {
      return data.restaurants;
    }

    return data.restaurants.filter((restaurant) => restaurant.category.includes(mapState.category));
  }

  function renderMapRanking(data) {
    const restaurants = getFilteredRestaurants(data);

    if (!restaurants.length) {
      return '<p class="map-empty">선택한 카테고리의 식당이 아직 없습니다.</p>';
    }

    return restaurants.map(renderMapRestaurantCard).join('');
  }

  function renderOrderGroups() {
    return orderGroups.map((group) => `
      <article class="card map-order-card">
        <div>
          <p class="map-order-card__host">${escapeHtml(group.host)}</p>
          <h3 class="map-order-card__title">${escapeHtml(group.restaurant)}</h3>
          <p class="map-order-card__meta">${escapeHtml(group.members)} · ${escapeHtml(group.deadline)}</p>
        </div>
        <button class="btn btn--pill map-join-button" type="button" data-toast="참여 완료!">참여하기</button>
      </article>
    `).join('');
  }

  function renderPaymentCalculator() {
    return `
      <form class="card map-pay-card" data-pay-form>
        <label class="map-field">
          <span>총 금액</span>
          <input class="map-input" type="number" min="0" inputmode="numeric" value="48000" data-total-amount>
        </label>
        <label class="map-field">
          <span>인원 수</span>
          <input class="map-input" type="number" min="1" inputmode="numeric" value="4" data-people-count>
        </label>
        <div class="map-pay-card__result" aria-live="polite">
          <span>1인당</span>
          <strong data-per-person>12,000원</strong>
        </div>
        <button class="btn btn--primary" type="submit">결제하기</button>
      </form>
    `;
  }

  function renderMapTabContent(data) {
    if (mapState.tab === 'order') {
      return renderOrderGroups();
    }

    if (mapState.tab === 'pay') {
      return renderPaymentCalculator();
    }

    return renderMapRanking(data);
  }

  function renderMap(data) {
    if (!mapPage) {
      return;
    }

    const tabLabels = {
      ranking: '식당 랭킹',
      order: '같이 주문',
      pay: 'N 결제',
    };

    mapPage.innerHTML = `
      <div class="map-stage">
        <h1 id="title-map" class="map-visually-hidden">지도</h1>
        <header class="map-header">
          <button class="map-location" type="button" data-open-location>
            <span aria-hidden="true">⌖</span>
            <strong>${escapeHtml(mapState.selectedLocation)}</strong>
            <span aria-hidden="true">⌄</span>
          </button>
          <div class="map-chip-row" aria-label="지도 카테고리 필터">
            ${categories.map((category) => `
              <button class="chip${category === mapState.category ? ' chip--active' : ''}" type="button" data-map-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
            `).join('')}
          </div>
        </header>

        <section class="map-canvas" aria-label="지도 목업 영역">
          ${data.restaurants.slice(0, 4).map((restaurant, index) => `
            <button class="map-pin map-pin--${index + 1}" type="button" data-pin-name="${escapeHtml(restaurant.name)}" aria-label="${escapeHtml(restaurant.name)} 위치">
              <span class="map-pin__dot"></span>
              <span class="map-pin__tooltip">${escapeHtml(restaurant.name)}</span>
            </button>
          `).join('')}
        </section>

        <section class="map-sheet map-sheet--${mapState.sheetSnap}" data-map-sheet aria-label="지도 상세 패널">
          <button class="map-sheet__handle" type="button" data-sheet-handle aria-label="바텀 시트 높이 조절"></button>
          <div class="map-sheet__tabs" role="tablist" aria-label="지도 패널 탭">
            ${Object.entries(tabLabels).map(([key, label]) => `
              <button class="map-sheet__tab${key === mapState.tab ? ' is-active' : ''}" type="button" role="tab" aria-selected="${key === mapState.tab}" data-map-tab="${key}">${label}</button>
            `).join('')}
          </div>
          <div class="map-sheet__content" data-map-content>
            ${renderMapTabContent(data)}
          </div>
        </section>

        <button class="fab map-fab" type="button" data-open-restaurant-modal aria-label="식당 등록">+</button>
      </div>
    `;
  }

  function renderRoute(route) {
    views.forEach((view) => {
      const isActive = view.dataset.route === route;
      view.classList.toggle('is-active', isActive);
      view.setAttribute('aria-hidden', String(!isActive));
    });

    navItems.forEach((item) => {
      const isActive = item.dataset.navRoute === route;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function handleRouteChange() {
    renderRoute(router.getCurrentRoute());
  }

  async function initializeData() {
    if (!window.BapFriendData || window.location.protocol === 'file:') {
      return;
    }

    await window.BapFriendData.loadAllData();
    if (!hasStorage('bapfriend:bookmarks')) {
      interactionState.bookmarks = window.BapFriendData.state.restaurants
        .filter((restaurant) => restaurant.bookmarked)
        .map((restaurant) => restaurant.id);
      writeStorage('bapfriend:bookmarks', interactionState.bookmarks);
    }
    if (!hasStorage('bapfriend:friends')) {
      interactionState.friends = window.BapFriendData.state.users
        .filter((user) => user.isFriend)
        .map((user) => user.id);
      writeStorage('bapfriend:friends', interactionState.friends);
    }
    window.dispatchEvent(new CustomEvent('bapfriend:data-loaded', {
      detail: window.BapFriendData.state,
    }));
  }

  function getDataState() {
    return window.BapFriendData?.state;
  }

  function rerenderMap() {
    const data = getDataState();

    if (data?.isLoaded) {
      renderMap(data);
    }
  }

  function rerenderBoard() {
    const data = getDataState();

    if (data?.isLoaded) {
      renderBoard(data);
    }
  }

  function rerenderChat() {
    const data = getDataState();

    if (data?.isLoaded) {
      renderChat(data);
    }
  }

  function rerenderMypage() {
    const data = getDataState();

    if (data?.isLoaded) {
      renderMypage(data);
    }
  }

  function rerenderHome() {
    const data = getDataState();

    if (data?.isLoaded) {
      renderHome(data);
    }
  }

  function rerenderRestaurantSurfaces() {
    const data = getDataState();

    if (!data?.isLoaded) {
      return;
    }

    renderHome(data);
    renderMap(data);
  }

  function showToast(message) {
    document.querySelector('[data-toast-message]')?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.dataset.toastMessage = 'true';
    toast.textContent = message;
    document.body.append(toast);
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 180);
    }, 2000);
  }

  function openRewardModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.dataset.modalOverlay = 'true';
    modal.innerHTML = `
      <div class="modal map-modal" role="dialog" aria-modal="true" aria-labelledby="reward-modal-title">
        <div class="map-modal__header">
          <h2 id="reward-modal-title">축하합니다!</h2>
          <button type="button" class="map-modal__close" data-close-modal aria-label="닫기">×</button>
        </div>
        <p class="reward-modal__text">방문도장 10개를 모두 모았습니다. 무료 음료 쿠폰이 지급되었습니다.</p>
        <button class="btn btn--primary" type="button" data-close-modal>확인</button>
      </div>
    `;
    document.body.append(modal);
  }

  function openNotifications() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay notification-overlay';
    overlay.dataset.modalOverlay = 'true';
    overlay.innerHTML = `
      <div class="modal notification-modal" role="dialog" aria-modal="true" aria-labelledby="notification-title">
        <div class="map-modal__header">
          <h2 id="notification-title">알림</h2>
          <button type="button" class="map-modal__close" data-close-modal aria-label="닫기">×</button>
        </div>
        <div class="notification-list">
          ${notifications.map((notification) => `
            <article class="notification-item${notification.unread ? ' is-unread' : ''}">
              <span class="notification-dot" aria-hidden="true"></span>
              <div>
                <h3>${escapeHtml(notification.title)}</h3>
                <p>${escapeHtml(notification.time)}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
    document.body.append(overlay);
  }

  function pickAiMenus() {
    return [...aiMenus]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }

  function closeModal() {
    document.querySelector('[data-modal-overlay]')?.remove();
  }

  function openLocationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.dataset.modalOverlay = 'true';
    modal.innerHTML = `
      <div class="modal map-modal" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        <div class="map-modal__header">
          <h2 id="location-modal-title">동네 선택</h2>
          <button type="button" class="map-modal__close" data-close-modal aria-label="닫기">×</button>
        </div>
        <div class="map-location-list">
          ${locations.map((location) => `
            <button class="menu-item map-location-option" type="button" data-location-option="${escapeHtml(location)}">
              <span class="menu-item__icon" aria-hidden="true">⌖</span>
              <span class="menu-item__label">${escapeHtml(location)}</span>
              <span class="menu-item__arrow">${location === mapState.selectedLocation ? '✓' : '›'}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    document.body.append(modal);
  }

  function openRestaurantModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.dataset.modalOverlay = 'true';
    modal.innerHTML = `
      <div class="modal map-modal" role="dialog" aria-modal="true" aria-labelledby="restaurant-modal-title">
        <div class="map-modal__header">
          <h2 id="restaurant-modal-title">식당 등록</h2>
          <button type="button" class="map-modal__close" data-close-modal aria-label="닫기">×</button>
        </div>
        <form class="map-register-form">
          <label class="map-field">
            <span>식당명</span>
            <input class="map-input" type="text" placeholder="식당 이름">
          </label>
          <label class="map-field">
            <span>메모</span>
            <input class="map-input" type="text" placeholder="추천 메뉴 또는 특징">
          </label>
          <button class="btn btn--primary" type="submit" data-register-submit>등록하기</button>
        </form>
      </div>
    `;
    document.body.append(modal);
  }

  function openPostModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.dataset.modalOverlay = 'true';
    modal.innerHTML = `
      <div class="modal board-modal" role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
        <div class="map-modal__header">
          <h2 id="post-modal-title">글쓰기</h2>
          <button type="button" class="map-modal__close" data-close-modal aria-label="닫기">×</button>
        </div>
        <form class="board-post-form">
          <label class="map-field">
            <span>제목</span>
            <input class="map-input" type="text" placeholder="예: 오늘 저녁 같이 먹어요">
          </label>
          <label class="map-field">
            <span>내용</span>
            <textarea class="board-textarea" rows="5" placeholder="지역 맛집 후기나 같이 먹을 사람을 찾아보세요"></textarea>
          </label>
          <button class="btn btn--primary" type="submit">등록</button>
        </form>
      </div>
    `;
    document.body.append(modal);
  }

  function updatePaymentResult() {
    const totalInput = document.querySelector('[data-total-amount]');
    const peopleInput = document.querySelector('[data-people-count]');
    const result = document.querySelector('[data-per-person]');

    if (!totalInput || !peopleInput || !result) {
      return;
    }

    const total = Number(totalInput.value);
    const people = Math.max(Number(peopleInput.value), 1);
    const perPerson = Math.ceil(total / people);
    result.textContent = `${perPerson.toLocaleString('ko-KR')}원`;
  }

  function setupSheetDrag() {
    let startY = 0;
    let startSnap = mapState.sheetSnap;

    document.addEventListener('pointerdown', (event) => {
      if (!event.target.closest('[data-sheet-handle]')) {
        return;
      }

      startY = event.clientY;
      startSnap = mapState.sheetSnap;
      event.target.setPointerCapture?.(event.pointerId);
    });

    document.addEventListener('pointerup', (event) => {
      if (!startY) {
        return;
      }

      const delta = event.clientY - startY;
      const snaps = ['min', 'mid', 'max'];
      const currentIndex = snaps.indexOf(startSnap);

      if (delta < -40) {
        mapState.sheetSnap = snaps[Math.min(currentIndex + 1, snaps.length - 1)];
      } else if (delta > 40) {
        mapState.sheetSnap = snaps[Math.max(currentIndex - 1, 0)];
      }

      document.querySelector('[data-map-sheet]')?.classList.remove('map-sheet--min', 'map-sheet--mid', 'map-sheet--max');
      document.querySelector('[data-map-sheet]')?.classList.add(`map-sheet--${mapState.sheetSnap}`);
      startY = 0;
    });
  }

  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('bapfriend:data-loaded', (event) => {
    renderHome(event.detail);
    renderMap(event.detail);
    renderBoard(event.detail);
    renderChat(event.detail);
    renderMypage(event.detail);
  });
  document.addEventListener('click', (event) => {
    const categoryButton = event.target.closest('[data-map-category]');
    const tabButton = event.target.closest('[data-map-tab]');
    const boardTabButton = event.target.closest('[data-board-tab]');
    const noticeButton = event.target.closest('[data-notice-id]');
    const chatRoomButton = event.target.closest('[data-chat-room-id]');
    const mypageViewButton = event.target.closest('[data-mypage-view]');
    const settingToggle = event.target.closest('[data-setting-toggle]');
    const bookmarkButton = event.target.closest('[data-bookmark-id]');
    const friendButton = event.target.closest('[data-friend-id]');
    const searchKeyword = event.target.closest('[data-search-keyword]');
    const searchResult = event.target.closest('[data-search-result]');
    const toastButton = event.target.closest('[data-toast]');
    const locationOption = event.target.closest('[data-location-option]');

    if (event.target.closest('[data-ai-recommend]')) {
      interactionState.aiLoading = true;
      interactionState.aiResults = [];
      rerenderHome();
      window.setTimeout(() => {
        interactionState.aiLoading = false;
        interactionState.aiResults = pickAiMenus();
        rerenderHome();
      }, 1500);
      return;
    }

    if (bookmarkButton) {
      const restaurantId = bookmarkButton.dataset.bookmarkId;
      const isActive = interactionState.bookmarks.includes(restaurantId);
      interactionState.bookmarks = isActive
        ? interactionState.bookmarks.filter((id) => id !== restaurantId)
        : [...interactionState.bookmarks, restaurantId];
      writeStorage('bapfriend:bookmarks', interactionState.bookmarks);
      rerenderRestaurantSurfaces();
      showToast(isActive ? '북마크를 해제했습니다' : '북마크에 저장했습니다');
      return;
    }

    if (friendButton) {
      const userId = friendButton.dataset.friendId;
      const isActive = interactionState.friends.includes(userId);
      interactionState.friends = isActive
        ? interactionState.friends.filter((id) => id !== userId)
        : [...interactionState.friends, userId];
      writeStorage('bapfriend:friends', interactionState.friends);
      rerenderHome();
      showToast(isActive ? '친구 추가를 취소했습니다' : '친구로 추가했습니다');
      return;
    }

    if (event.target.closest('[data-stamp-card]')) {
      interactionState.stampCount = Math.min(interactionState.stampCount + 1, 10);
      writeStorage('bapfriend:stampCount', interactionState.stampCount);
      rerenderHome();
      if (interactionState.stampCount >= 10) {
        openRewardModal();
      } else {
        showToast(`방문도장 ${interactionState.stampCount}/10`);
      }
      return;
    }

    if (event.target.closest('[data-open-notifications]')) {
      openNotifications();
      return;
    }

    if (event.target.closest('.home-search')) {
      renderSearchOverlay();
      return;
    }

    if (event.target.closest('[data-close-search]')) {
      closeSearchOverlay();
      return;
    }

    if (event.target.closest('[data-clear-search]')) {
      searchState.query = '';
      renderSearchOverlay();
      return;
    }

    if (searchKeyword) {
      searchState.query = searchKeyword.dataset.searchKeyword;
      renderSearchOverlay();
      return;
    }

    if (searchResult) {
      showToast(`${searchResult.dataset.searchResult} 상세는 다음 단계에서 연결됩니다`);
      closeSearchOverlay();
      return;
    }

    if (mypageViewButton) {
      mypageState.view = mypageViewButton.dataset.mypageView;
      rerenderMypage();
      return;
    }

    if (event.target.closest('[data-mypage-back]')) {
      mypageState.view = 'main';
      rerenderMypage();
      return;
    }

    if (settingToggle) {
      const key = settingToggle.dataset.settingToggle;
      mypageState.settings[key] = !mypageState.settings[key];
      if (key === 'darkMode') {
        applyDarkMode(mypageState.settings.darkMode);
      }
      rerenderMypage();
      return;
    }

    if (chatRoomButton) {
      chatState.activeRoomId = chatRoomButton.dataset.chatRoomId;
      rerenderChat();
      return;
    }

    if (event.target.closest('[data-chat-back]')) {
      chatState.activeRoomId = '';
      rerenderChat();
      return;
    }

    if (boardTabButton) {
      boardState.tab = boardTabButton.dataset.boardTab;
      rerenderBoard();
      return;
    }

    if (noticeButton) {
      const noticeId = noticeButton.dataset.noticeId;
      boardState.openNoticeId = boardState.openNoticeId === noticeId ? '' : noticeId;
      rerenderBoard();
      return;
    }

    if (categoryButton) {
      mapState.category = categoryButton.dataset.mapCategory;
      rerenderMap();
      return;
    }

    if (tabButton) {
      mapState.tab = tabButton.dataset.mapTab;
      rerenderMap();
      return;
    }

    if (event.target.closest('[data-open-location]')) {
      openLocationModal();
      return;
    }

    if (locationOption) {
      mapState.selectedLocation = locationOption.dataset.locationOption;
      closeModal();
      rerenderMap();
      return;
    }

    if (event.target.closest('[data-open-restaurant-modal]')) {
      openRestaurantModal();
      return;
    }

    if (event.target.closest('[data-open-post-modal]')) {
      openPostModal();
      return;
    }

    if (event.target.closest('[data-event-detail]')) {
      showToast('이벤트 상세는 다음 단계에서 연결됩니다');
      return;
    }

    if (event.target.closest('[data-close-modal]') || event.target.matches('[data-modal-overlay]')) {
      closeModal();
      return;
    }

    if (toastButton) {
      showToast(toastButton.dataset.toast);
    }
  });
  document.addEventListener('input', (event) => {
    if (event.target.matches('[data-total-amount], [data-people-count]')) {
      updatePaymentResult();
    }

    if (event.target.matches('[data-search-input]')) {
      searchState.query = event.target.value;
      const content = document.querySelector('[data-search-content]');
      const data = getDataState();

      if (content && data?.isLoaded) {
        content.innerHTML = renderSearchContent(data);
      }
    }
  });
  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-language-option]')) {
      try {
        localStorage.setItem('bapfriend:language', event.target.value);
      } catch {
        // localStorage may be unavailable in restricted previews.
      }
      showToast('언어 설정이 저장되었습니다');
    }
  });
  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-pay-form]')) {
      event.preventDefault();
      showToast('결제 완료');
      return;
    }

    if (event.target.matches('.map-register-form')) {
      event.preventDefault();
      closeModal();
      showToast('등록 요청 완료');
      return;
    }

    if (event.target.matches('.board-post-form')) {
      event.preventDefault();
      closeModal();
      showToast('게시글 등록 완료');
      return;
    }

    if (event.target.matches('[data-inquiry-form]')) {
      event.preventDefault();
      showToast('접수되었습니다');
      return;
    }

    if (event.target.matches('[data-chat-form]')) {
      event.preventDefault();
      const input = event.target.querySelector('[data-chat-input]');
      const text = input.value.trim();
      const data = getDataState();

      if (!text || !data?.messages?.[chatState.activeRoomId]) {
        return;
      }

      data.messages[chatState.activeRoomId].push({
        id: `m${Date.now()}`,
        sender: '나',
        text,
        time: '방금',
        isMine: true,
      });
      input.value = '';
      rerenderChat();
    }
  });
  setupSheetDrag();

  initializeInteractionState();
  renderRoute(router.ensureRoute());
  initializeData().catch((error) => {
    console.error(error);
  });
  window.setTimeout(() => {
    document.querySelector('[data-splash]')?.classList.add('is-hidden');
  }, 1000);
})();
