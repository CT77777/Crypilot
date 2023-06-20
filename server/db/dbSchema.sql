CREATE DATABASE crypilot;

USE crypilot;

------------------------custodial---------------------------------------

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    `password` VARCHAR(255),
    `name` VARCHAR(50),
    picture VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX email_index (email)
);

CREATE TABLE user_providers (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    `name` ENUM("native", "facebook", "google", "apple") NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_wallets (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    public_address VARCHAR(40) UNIQUE,
    private_key VARCHAR(255) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE fts (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50),
    symbol VARCHAR(50),
    contract_address VARCHAR(40) UNIQUE,
    cmc_id BIGINT UNSIGNED NOT NULL UNIQUE
);

CREATE TABLE nfts (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50),
    symbol VARCHAR(50),
    contract_address VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE user_favorite_fts (
    user_id BIGINT UNSIGNED NOT NULL,
    ft_cmc_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ft_cmc_id) REFERENCES fts(cmc_id),
    PRIMARY KEY (user_id, ft_cmc_id)
);

CREATE TABLE user_favorite_nfts (
    user_id BIGINT UNSIGNED NOT NULL,
    nft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (nft_id) REFERENCES nfts(id),
    PRIMARY KEY (user_id, nft_id)
);

CREATE TABLE user_inventory_fts (
    user_id BIGINT UNSIGNED NOT NULL,
    ft_id BIGINT UNSIGNED NOT NULL,
    balance BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ft_id) REFERENCES fts(id),
    PRIMARY KEY (user_id, ft_id)
);

CREATE TABLE user_inventory_nfts (
    user_id BIGINT UNSIGNED NOT NULL,
    nft_id BIGINT UNSIGNED NOT NULL,
    token_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (nft_id) REFERENCES nfts(id),
    PRIMARY KEY (nft_id, token_id)
);

------------------------self custodial---------------------------------------

CREATE TABLE self_custodial_wallets (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    public_address VARCHAR(40) UNIQUE,
    picture VARCHAR(255),
    INDEX public_address_index (public_address)
);

CREATE TABLE self_custodial_wallet_types (
    self_custodial_wallet_id BIGINT UNSIGNED NOT NULL,
    wallet_type ENUM("metamask", "coinbase", "trust") NOT NULL,
    FOREIGN KEY (self_custodial_wallet_id) REFERENCES self_custodial_wallets(id)
);

CREATE TABLE self_custodial_favorite_fts (
    self_custodial_wallet_id BIGINT UNSIGNED NOT NULL,
    ft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (self_custodial_wallet_id) REFERENCES self_custodial_wallets(id),
    FOREIGN KEY (ft_id) REFERENCES fts(id),
    PRIMARY KEY (self_custodial_wallet_id, ft_id)
);

CREATE TABLE self_custodial_favorite_nfts (
    self_custodial_wallet_id BIGINT UNSIGNED NOT NULL,
    nft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (self_custodial_wallet_id) REFERENCES self_custodial_wallets(id),
    FOREIGN KEY (nft_id) REFERENCES nfts(id),
    PRIMARY KEY (self_custodial_wallet_id, nft_id)
);


INSERT INTO fts (name, symbol, contract_address, cmc_id) 
VALUES
("Tether", "USDT", "dac17f958d2ee523a2206206994597c13d831ec7", 825),
("Ethereum", "ETH", "", 1027),
("USD Coin", "USDC", "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 3408),
("Wrapped Bitcoin", "WBTC", "2260fac5e5542a773aa44fbcfedf7c193bc2c599", 3717),
("Dai", "DAI", "6b175474e89094c44da98b954eedeac495271d0f", 4943),
("Compound", "COMP", "c00e94cb662c3520282e6f5717214004a7f26888", 5692),
("SushiSwap", "SUSHI", "6b3595068778dd592e39a122f4f5a5cf09c90fe2", 6758),
("Uniswap", "UNI", "1f9840a85d5af5bf1d1762f925bdaddc4201f984", 7083),
("Aave", "AAVE", "7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", 7278),
("1inch Network", "1INCH", "111111111117dc0aa78b770fa6a738034120c302", 8104);

