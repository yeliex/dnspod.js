# dnspod.js
js sdk for dnspod

## Installation 
```bash
npm install dnspod.js -S

OR

yarn add dnspod.js
```

## Usage
```javascript
// js
const DNSPod = require('dnspod.js');


//ts
import DNSPod from 'dnspod.js';

const dnspod = new DNSPod({
  access_token: 'access_token',
  access_token_id: 'access_token_id'
})

const main =async ()=>{
  console.log(await dnspod.Info.Version();)
}

main();
```
