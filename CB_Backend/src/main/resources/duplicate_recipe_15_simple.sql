-- ============================================
-- Скрипт для дублирования рецепта 15 раз (простой вариант)
-- ============================================
-- Убедитесь, что подключены к схеме SYS
-- ============================================

-- Проверка перед началом
SELECT COUNT(*) as "Total recipes before" FROM SYS.CB_RECIPES;
SELECT ID, TITLE, USER_ID FROM SYS.CB_RECIPES ORDER BY ID;

-- Шаг 1: Дублируем рецепт 15 раз
-- Берем первый рецепт (с минимальным ID)
INSERT INTO SYS.CB_RECIPES (
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    PREP_TIME,
    COOK_TIME,
    CALORIES,
    TOTAL_FAT,
    PROTEIN,
    CARBOHYDRATES,
    CHOLESTEROL,
    USER_ID,
    CREATED_AT,
    UPDATED_AT
)
SELECT 
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    PREP_TIME,
    COOK_TIME,
    CALORIES,
    TOTAL_FAT,
    PROTEIN,
    CARBOHYDRATES,
    CHOLESTEROL,
    USER_ID,
    SYSDATE,
    SYSDATE
FROM (
    SELECT * FROM SYS.CB_RECIPES 
    WHERE ID = (SELECT MIN(ID) FROM SYS.CB_RECIPES)
) r
CROSS JOIN (
    SELECT LEVEL as num FROM DUAL CONNECT BY LEVEL <= 15
) num;

COMMIT;

-- Шаг 2: Копируем связи с категориями для всех новых рецептов
-- Находим ID исходного рецепта и всех новых рецептов
INSERT INTO SYS.CB_RECIPE_CATEGORIES (RECIPE_ID, CATEGORY_ID)
SELECT 
    r2.ID as RECIPE_ID,
    rc.CATEGORY_ID
FROM SYS.CB_RECIPES r1
CROSS JOIN SYS.CB_RECIPES r2
INNER JOIN SYS.CB_RECIPE_CATEGORIES rc ON rc.RECIPE_ID = r1.ID
WHERE r1.ID = (SELECT MIN(ID) FROM SYS.CB_RECIPES)
  AND r2.ID > r1.ID
  AND NOT EXISTS (
      SELECT 1 FROM SYS.CB_RECIPE_CATEGORIES rc2 
      WHERE rc2.RECIPE_ID = r2.ID AND rc2.CATEGORY_ID = rc.CATEGORY_ID
  );

COMMIT;

-- Шаг 3: Копируем ингредиенты для всех новых рецептов
INSERT INTO SYS.CB_INGREDIENTS (
    PRODUCT_NAME,
    QUANTITY,
    UNIT,
    RECIPE_ID
)
SELECT 
    i.PRODUCT_NAME,
    i.QUANTITY,
    i.UNIT,
    r2.ID as RECIPE_ID
FROM SYS.CB_RECIPES r1
CROSS JOIN SYS.CB_RECIPES r2
INNER JOIN SYS.CB_INGREDIENTS i ON i.RECIPE_ID = r1.ID
WHERE r1.ID = (SELECT MIN(ID) FROM SYS.CB_RECIPES)
  AND r2.ID > r1.ID;

COMMIT;

-- Проверка результата
SELECT COUNT(*) as "Total recipes after" FROM SYS.CB_RECIPES;
SELECT ID, TITLE, USER_ID, TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT 
FROM SYS.CB_RECIPES 
ORDER BY ID DESC 
FETCH FIRST 20 ROWS ONLY;

-- Проверка связей с категориями
SELECT COUNT(*) as "Total recipe-category links" FROM SYS.CB_RECIPE_CATEGORIES;

-- Проверка ингредиентов
SELECT COUNT(*) as "Total ingredients" FROM SYS.CB_INGREDIENTS;

-- Проверка, что у всех новых рецептов есть категории
SELECT 
    r.ID,
    r.TITLE,
    COUNT(rc.CATEGORY_ID) as CATEGORY_COUNT
FROM SYS.CB_RECIPES r
LEFT JOIN SYS.CB_RECIPE_CATEGORIES rc ON rc.RECIPE_ID = r.ID
WHERE r.ID > (SELECT MIN(ID) FROM SYS.CB_RECIPES)
GROUP BY r.ID, r.TITLE
ORDER BY r.ID DESC
FETCH FIRST 20 ROWS ONLY;
