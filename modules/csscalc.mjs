export function csscalc(str) {
  const str_length = str.length;
  let num = 1;
  for (let i = 0; i < str_length; i++) {

    num = num * str.charCodeAt(i);

  }
  for (let i = 0; i < str_length; i++) {

    num = num + str.charCodeAt(i);

  }
  num = num % 100;

  num = 255 - num;

  return num.toString(16);

}
