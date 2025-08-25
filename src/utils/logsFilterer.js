// Fonction utilitaire pour extraire la date depuis un log
function parseLogDate(log) {
  let match;

  // Format ISO [YYYY-MM-DDTHH:mm:ss.sssZ]
  match = log.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\]/);
  if (match) return new Date(match[1]);

  // Format [YYYY-MM-DD HH:mm:ss]
  match = log.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/);
  if (match) return new Date(match[1].replace(" ", "T"));

  // Format Apache log [DD/MMM/YYYY:HH:mm:ss +0000]
  match = log.match(/\[(\d{2})\/(\w{3})\/(\d{4}):(\d{2}:\d{2}:\d{2}) \+\d+\]/);
  if (match) {
    const [_, day, monthStr, year, time] = match;
    const months = {Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11};
    const month = months[monthStr];
    return new Date(Date.UTC(year, month, day, ...time.split(":")));
  }

  return null; // log sans date valide
}

export default parseLogDate;