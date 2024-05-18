/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* jshint esversion: 6, asi: true, node: true */
/*
 * index.js
 *
 * WebSSH2 - Web to SSH2 gateway
 * Bill Church - https://github.com/billchurch/WebSSH2 - May 2017
 *
 */

module.exports = function WebSSH2({ checkAuth }) {
  if(!checkAuth) throw new Error('A Check auth function is not provided');

  const { config } = require('./server/app');
  const { server, initSocket } = require('./server/app');

  initSocket({ checkAuth });

  server.listen({ host: config.listen.ip, port: config.listen.port });

  // eslint-disable-next-line no-console
  console.log(`WebSSH2 service listening on ${config.listen.ip}:${config.listen.port}`);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      config.listen.port += 1;
      console.warn(`WebSSH2 Address in use, retrying on port ${config.listen.port}`);
      setTimeout(() => {
        server.listen(config.listen.port);
      }, 250);
    } else {
      // eslint-disable-next-line no-console
      console.log(`WebSSH2 server.listen ERROR: ${err.code}`);
    }
  });
}

