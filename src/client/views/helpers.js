import React from 'react';

export function timeLabels(obj){
  if(!obj || !obj.createdAt)return <span/>;
  const res = [`Created ${obj.createdAt.fromNow()}`];
  if(obj.updatedAt) res.push(`Updated ${obj.updatedAt.fromNow()}`);

  return <span>{res.join(' - ')}</span>
}




