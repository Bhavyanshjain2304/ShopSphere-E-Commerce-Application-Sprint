import { createContext, useContext, useState } from 'react';

const SearchBarContext = createContext({ heroVisible: false, setHeroVisible: () => {} });

export const SearchBarProvider = ({ children }) => {
  const [heroVisible, setHeroVisible] = useState(false);
  return (
    <SearchBarContext.Provider value={{ heroVisible, setHeroVisible }}>
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBar = () => useContext(SearchBarContext);
