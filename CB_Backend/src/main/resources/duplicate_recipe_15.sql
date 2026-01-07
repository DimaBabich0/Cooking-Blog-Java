-- ============================================
-- Скрипт для дублирования рецепта 15 раз
-- ============================================
-- Копирует первый рецепт из таблицы CB_RECIPES
-- Включает связи с категориями и ингредиентами
-- ============================================

-- Шаг 1: Проверка существующих рецептов
SELECT COUNT(*) as "Total recipes before" FROM CB_RECIPES;
SELECT ID, TITLE, USER_ID FROM CB_RECIPES ORDER BY ID;

-- Шаг 2: Получаем ID первого рецепта для копирования
-- (Используем первый рецепт по ID)
DECLARE
    v_source_recipe_id NUMBER;
    v_new_recipe_id NUMBER;
    v_counter NUMBER := 1;
BEGIN
    -- Получаем ID первого рецепта
    SELECT MIN(ID) INTO v_source_recipe_id FROM CB_RECIPES;
    
    IF v_source_recipe_id IS NULL THEN
        DBMS_OUTPUT.PUT_LINE('Ошибка: Нет рецептов в таблице!');
        RETURN;
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('Копируем рецепт с ID: ' || v_source_recipe_id);
    
    -- Дублируем рецепт 15 раз
    FOR i IN 1..15 LOOP
        -- Вставляем новый рецепт
        INSERT INTO CB_RECIPES (
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
        FROM CB_RECIPES
        WHERE ID = v_source_recipe_id;
        
        -- Получаем ID только что созданного рецепта
        SELECT MAX(ID) INTO v_new_recipe_id FROM CB_RECIPES;
        
        DBMS_OUTPUT.PUT_LINE('Создан рецепт #' || i || ' с ID: ' || v_new_recipe_id);
        
        -- Копируем связи с категориями
        INSERT INTO CB_RECIPE_CATEGORIES (RECIPE_ID, CATEGORY_ID)
        SELECT v_new_recipe_id, CATEGORY_ID
        FROM CB_RECIPE_CATEGORIES
        WHERE RECIPE_ID = v_source_recipe_id;
        
        -- Копируем ингредиенты
        INSERT INTO CB_INGREDIENTS (
            PRODUCT_NAME,
            QUANTITY,
            UNIT,
            RECIPE_ID
        )
        SELECT 
            PRODUCT_NAME,
            QUANTITY,
            UNIT,
            v_new_recipe_id
        FROM CB_INGREDIENTS
        WHERE RECIPE_ID = v_source_recipe_id;
        
        v_counter := v_counter + 1;
    END LOOP;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Готово! Создано 15 копий рецепта.');
END;
/

-- Шаг 3: Проверка результата
SELECT COUNT(*) as "Total recipes after" FROM CB_RECIPES;
SELECT ID, TITLE, USER_ID, CREATED_AT FROM CB_RECIPES ORDER BY ID DESC;

-- Проверка связей с категориями
SELECT COUNT(*) as "Total recipe-category links" FROM CB_RECIPE_CATEGORIES;

-- Проверка ингредиентов
SELECT COUNT(*) as "Total ingredients" FROM CB_INGREDIENTS;

-- ============================================
-- Альтернативный вариант (если PL/SQL блок не работает)
-- ============================================
/*
-- Простое дублирование через INSERT SELECT
INSERT INTO CB_RECIPES (
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
    SELECT * FROM CB_RECIPES WHERE ROWNUM = 1
) r
CROSS JOIN (
    SELECT LEVEL as num FROM DUAL CONNECT BY LEVEL <= 15
) num;

COMMIT;

-- Копируем связи с категориями для всех новых рецептов
INSERT INTO CB_RECIPE_CATEGORIES (RECIPE_ID, CATEGORY_ID)
SELECT 
    r2.ID as RECIPE_ID,
    rc.CATEGORY_ID
FROM CB_RECIPES r1
CROSS JOIN CB_RECIPES r2
INNER JOIN CB_RECIPE_CATEGORIES rc ON rc.RECIPE_ID = r1.ID
WHERE r1.ID = (SELECT MIN(ID) FROM CB_RECIPES)
  AND r2.ID > r1.ID
  AND NOT EXISTS (
      SELECT 1 FROM CB_RECIPE_CATEGORIES rc2 
      WHERE rc2.RECIPE_ID = r2.ID AND rc2.CATEGORY_ID = rc.CATEGORY_ID
  );

-- Копируем ингредиенты для всех новых рецептов
INSERT INTO CB_INGREDIENTS (
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
FROM CB_RECIPES r1
CROSS JOIN CB_RECIPES r2
INNER JOIN CB_INGREDIENTS i ON i.RECIPE_ID = r1.ID
WHERE r1.ID = (SELECT MIN(ID) FROM CB_RECIPES)
  AND r2.ID > r1.ID;

COMMIT;
*/
