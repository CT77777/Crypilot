# <div><img src="./client/images/logo_sidebar.png" width="60" height="60" style="vertical-align: middle;">CRYPILOT [[Website]](https://ctceth.com/)</div>

A web3 wallet, integrating custodian, quotation, and trading features to make it easier for web3 beginners to experience Blockchain.

## Table of Contents

- [👨🏻‍💻 User Flow](#user-flow)
- [💻 Tech Stack](#tech-stack)
- [⚙️ Architecture](#system-architecture)
- [🗄️ DB Schema](#db-schema)
- [🔗 Contacts](#contacts)

## User Flow

#### Testing Account

- email: appworks@gmail.com
- password: 123

#### 1. Register

<img src="./client/images/register.png" width="500" height="250">

#### 2. Login

<img src="./client/images/login.png" width="500" height="250">

#### 3. Profile page, check the percentage of assets and ETH balance.

<img src="./client/images/profile.png" width="500" height="250">

#### 4. Set the 2FA for assets security

<img src="./client/images/2fa-1.png" width="500" height="250">

#### download [[Google Authenticator]](https://apps.apple.com/us/app/google-authenticator/id388497605)

<img src="./client/images/2fa-2.png" width="500" height="250">

#### scan QR code by Google Authenticator

<img src="./client/images/2fa-3.png" width="500" height="250">

#### login next time, you have to give security code to verified

<img src="./client/images/2fa-4.png" width="500" height="250">

#### 5. Market page, get instant price of cryptos and add the interesting crypto into tracing list. Furthermore, click the chat button, obtain crypto information from ChatGPT.

<img src="./client/images/market.png" width="500" height="250">
<img src="./client/images/gpt.png" width="500" height="250">

#### 6. Tracing page, check your all tracing cryptos.

<img src="./client/images/tracing.png" width="500" height="250">

#### 7. Buy page, buy ETH by fiat currency through credit card.

<img src="./client/images/buy-1.png" width="500" height="250">

#### Testing Credit Card

- Credit Card Number: 4242 4242 4242 4242
- Valid Date: 09/23
- Security Number: 123

<img src="./client/images/buy-2.png" width="500" height="250">

#### 8. Swap page, buy or sell crypto on-chain through Uniswap V3.

<img src="./client/images/swap-1.png" width="500" height="250">

#### 9. Wallet page, check cryptos you possess.

<img src="./client/images/wallet.png" width="500" height="250">

#### 10. Retrieve the private key of your wallet, take back ownership.

<img src="./client/images/retrieve-1.png" width="500" height="250">
<img src="./client/images/retrieve-2.png" width="500" height="250">
<img src="./client/images/retrieve-3.png" width="500" height="250">

## Tech Stack

### Back-End:

![Node](https://img.shields.io/badge/Node-white?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-white?logo=express&logoColor=%23000000)
![TypeScript](https://img.shields.io/badge/TypeScript-white?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-white?logo=mysql)
![Redis](https://img.shields.io/badge/Redis-white?logo=redis)
![Socket.IO](https://img.shields.io/badge/Socket.IO-white?logo=socketdotio&logoColor=%23010101)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-white?logo=rabbitmq)

### Blockchain:

![Solidity](https://img.shields.io/badge/Solidity-white?logo=solidity&logoColor=%23363636)
![Hardhat](https://img.shields.io/badge/Hardhat-white)

### Cloud Service(AWS):

![EC2](https://img.shields.io/badge/EC2-white?logo=amazonec2)
![RDS](https://img.shields.io/badge/RDS-white?logo=amazonrds)
![ElastiCache](https://img.shields.io/badge/ElastiCache-white)

### Front-End:

![JavaScript](https://img.shields.io/badge/JavaScript-white?logo=javascript)
![HTML](https://img.shields.io/badge/HTML-white?logo=html5)
![SCSS](https://img.shields.io/badge/SCSS-white?logo=sass)
![Bootstrap](https://img.shields.io/badge/Bootstrap-white?logo=bootstrap)
![Plotly.js](https://img.shields.io/badge/Plotly.js-white?logo=plotly&logoColor=%233F4F75)

## System Architecture

### Buy / Swap Flow

![Architecture-trade](./client/images/architecture-trade.png)

### OpenAI / Quotation / Tracing Flow

![Architecture-others](./client/images/architecture-others.png)

## DB Schema

![Schema](./client/images/DB-schema.png)

## Contacts

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chien-tsun-chan-31a75518b/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/CT_Chan7)
