'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);


  router.get('/api/v1/tx', controller.query.queryTxStatus);
  router.get('/api/v1/components/locked', controller.query.queryLockedStatus);
  router.get('/api/v1/sign', controller.sig.signMsg);

  router.post('/api/v1/sign/gameend', controller.sig.sigGameEnd);
  router.post('/api/v1/sign/unlockcomponents', controller.sig.sigUnlockComponents);
  router.post('/api/v1/sign/settleloots', controller.sig.sigSettleLoots);
  router.post('/api/v1/sign/prepare-mint', controller.sig.signPrepareAndMint);
  router.post('/api/v1/sign/version-info', controller.sig.signVersionInfo);
};
