export default function dataValidationUserInput(username: string, password: string):string {
  if (username.length === 0) {
    return 'Please enter a username';
  }

  if (username[0] === ' ') {
    return 'Username cannot start with a space';
  }

  if (password.length === 0) {
    return 'Please enter a password';
  }

  const pureName = username.replace(/ /g, '');
  const purePass = password.replace(/ /g, '');

  if (pureName.length === 0) {
    return 'Please enter a username that isn\'t filled with spaces';
  }

  if (purePass.length === 0) {
    return 'Please enter a password that isn\'t filled with spaces';
  }

  return '';
}