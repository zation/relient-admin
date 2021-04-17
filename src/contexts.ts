import { createContext } from 'react';

export const DomainContext = createContext({ apiDomain: '', cdnDomain: '' });
export const BaseUrlContext = createContext('');
