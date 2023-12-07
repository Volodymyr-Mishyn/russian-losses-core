export class Logger {
  public static log(message: string, color = '\x1b[0m') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\x1b[30;47m[${timestamp}]\x1b[0m ${color}${message}\x1b[0m`);
  }
}
