require('dotenv').config();

export class Logger {
  public static log(message: string, color = '\x1b[0m') {
    const time = new Date().toLocaleTimeString();
    if (process.env.NODE_ENV === 'production') {
      console.log(`${time}::${message}`);
      return;
    }
    console.log(`\x1b[30;47m[${time}]\x1b[0m ${color}${message}\x1b[0m`);
  }
}
