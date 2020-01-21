export function writeLog(data: {
  event: "http" | "database";
  value: string;
  message?: string;
}) {
  if (data.message) {
    console.info(`${data.event} ${data.value} ${data.message}`);
  } else {
    console.info(`${data.event} ${data.value}`);
  }
}
