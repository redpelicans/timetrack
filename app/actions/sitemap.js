export const ENTER_ROUTE = 'ENTER_ROUTE';

export function enter(currentRoute){
  return {
    type: ENTER_ROUTE,
    currentRoute
  }
}

export const sitemapActions = { enter };
