const sessions = {};

exports.getSession = (number) => {
  if (!sessions[number]) {
    sessions[number] = {};
  }
  return sessions[number];
};

exports.setSession = (number, data) => {
  sessions[number] = data;
};

exports.clearSession = (number) => {
  delete sessions[number];
};