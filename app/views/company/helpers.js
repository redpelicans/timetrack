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


