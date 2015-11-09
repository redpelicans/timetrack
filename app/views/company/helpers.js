import React, {Component} from 'react';
import Avatar from '../avatar';
import {avatarTypes, colors} from '../../forms/company';

export const AvatarView = ({company}) => {
  if(!company || !company.avatar) return <Avatar name={"?"}/>;

  const defaultAvatar = <Avatar name={company.name} color={company.avatar.color}/>;

  switch(company.avatar.type){
    case avatarTypes.url:
      return <Avatar src={company.avatar.url}/>;
    case avatarTypes.src:
      return <Avatar src={company.avatar.src}/>;
    default:
      return defaultAvatar;
  }
}

export function timeLabels(company){
  if(!company || !company.createdAt)return <span/>;
  const res = [`Created ${company.createdAt.fromNow()}`];
  if(company.updatedAt) res.push(`Updated ${company.updatedAt.fromNow()}`);

  return <span>{res.join(' - ')}</span>
}




