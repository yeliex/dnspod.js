const DNSPod = require('../lib').default;

const dnspod = new DNSPod({
    access_token: 'f66ec908ff8441a0039b283713b0ba27',
    access_token_id: '56776',
});

const main = async () => {
    console.log(await dnspod.User.Telephone.VarifyCode('15988545765'));
};

main();
