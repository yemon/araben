export const primaryNav = [
  { href: '/alphabet/', label: 'Alphabet', hint: '28 letters & harakāt' },
  { href: '/grammar/', label: 'Grammar', hint: 'A map of sentence-building' },
  { href: '/basics/', label: 'Basics', hint: 'Words & patterns' },
  { href: '/scenarios/', label: 'Scenarios', hint: '12 real-life dialogues' },
  { href: '/surahs/', label: 'Surahs', hint: 'Word-by-word' },
  { href: '/roots/', label: 'Roots', hint: 'Word families' },
  { href: '/hidden/', label: 'Hidden in Bangla', hint: 'Arabic you already know' },
  { href: '/search/', label: 'Search', hint: 'Find any word' },
];

// Routes that take over the whole screen — a game in play, or the admin panel
// with its own sidebar — and so render without the site Nav and Footer. The
// trace player is /practice/trace/<slug>; the word list above it keeps the
// site chrome.
export const isFullscreenRoute = (pathname: string | null): boolean =>
  !!pathname && (/^\/practice\/trace\/[^/]+\/?$/.test(pathname) || /^\/admin(\/|$)/.test(pathname));
