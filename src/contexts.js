import { createContext } from 'react';
import { identity } from 'lodash/fp';

export const DomainContext = createContext({ apiDomain: '', cdnDomain: '' });
export const I18NContext = createContext(identity);
export const BaseUrlContext = createContext('');
