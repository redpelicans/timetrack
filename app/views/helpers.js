export function timeLabels(company){
  if(!company || !company.createdAt)return <span/>;
  const res = [`Created ${company.createdAt.fromNow()}`];
  if(company.updatedAt) res.push(`Updated ${company.updatedAt.fromNow()}`);

  return <span>{res.join(' - ')}</span>
}




