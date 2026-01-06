-- SQL скрипт для создания тестового пользователя
-- Выполни этот скрипт в SQL Developer перед созданием постов

-- Создание пользователя
INSERT INTO CB_USERS (
    USERNAME,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    PASSWORD_HASH,
    PASSWORD_SALT,
    ROLE,
    CREATED_AT
) VALUES (
    'testuser',
    'Test',
    'User',
    'testuser@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- пароль: "password"
    '$2a$10$N9qo8uLOickgx2ZMRZoMye',
    'USER',
    SYSDATE
);

-- Если нужно создать пользователя с конкретным ID (если автоинкремент не работает)
-- Сначала создай sequence если его нет:
-- CREATE SEQUENCE CB_USERS_SEQ START WITH 1;

-- Затем вставь с явным ID:
-- INSERT INTO CB_USERS (ID, USERNAME, EMAIL, PASSWORD_HASH, PASSWORD_SALT, ROLE, CREATED_AT)
-- VALUES (1, 'testuser', 'testuser@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'USER', SYSDATE);

COMMIT;

-- Проверка: должен вернуть созданного пользователя
SELECT ID, USERNAME, EMAIL, ROLE FROM CB_USERS WHERE ID = 1;
