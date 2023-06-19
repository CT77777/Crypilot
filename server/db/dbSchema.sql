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
    private_key VARCHAR(64) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE fts (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50),
    symbol VARCHAR(50),
    contract_address VARCHAR(40) UNIQUE
);

CREATE TABLE nfts (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50),
    symbol VARCHAR(50),
    contract_address VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE user_favorite_fts (
    user_id BIGINT UNSIGNED NOT NULL,
    ft_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ft_id) REFERENCES fts(id),
    PRIMARY KEY (user_id, ft_id)
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