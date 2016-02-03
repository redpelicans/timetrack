export const ALERT='ALERT';

export function alert(error){
  return {
    type: ALERT,
    header: error.header,
    message: error.message,
  };
}
