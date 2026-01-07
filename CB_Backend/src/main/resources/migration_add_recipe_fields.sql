-- ============================================
-- Миграция: Добавление полей для рецептов
-- ============================================
-- Этот скрипт добавляет новые поля в таблицу CB_RECIPES:
-- - PREP_TIME (время подготовки)
-- - COOK_TIME (время готовки) - переименовываем COOKING_TIME
-- - CALORIES (калории)
-- - TOTAL_FAT (общий жир)
-- - PROTEIN (белок)
-- - CARBOHYDRATES (углеводы)
-- - CHOLESTEROL (холестерин)
-- ============================================

-- Шаг 1: Добавляем новые поля
ALTER TABLE CB_RECIPES ADD PREP_TIME NUMBER(10, 0);
ALTER TABLE CB_RECIPES ADD COOK_TIME NUMBER(10, 0);
ALTER TABLE CB_RECIPES ADD CALORIES NUMBER(10, 2);
ALTER TABLE CB_RECIPES ADD TOTAL_FAT NUMBER(10, 2);
ALTER TABLE CB_RECIPES ADD PROTEIN NUMBER(10, 2);
ALTER TABLE CB_RECIPES ADD CARBOHYDRATES NUMBER(10, 2);
ALTER TABLE CB_RECIPES ADD CHOLESTEROL NUMBER(10, 2);

-- Шаг 2: Переносим данные из COOKING_TIME в COOK_TIME
UPDATE CB_RECIPES SET COOK_TIME = COOKING_TIME WHERE COOKING_TIME IS NOT NULL;

-- Шаг 3: Устанавливаем значения по умолчанию для PREP_TIME (если нужно)
-- UPDATE CB_RECIPES SET PREP_TIME = 15 WHERE PREP_TIME IS NULL;

-- Шаг 4: (Опционально) Удаляем старое поле COOKING_TIME после проверки
-- ВНИМАНИЕ: Раскомментируйте только после проверки, что данные перенесены!
-- ALTER TABLE CB_RECIPES DROP COLUMN COOKING_TIME;

COMMIT;

-- Проверка: посмотреть структуру таблицы
-- SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
-- FROM USER_TAB_COLUMNS 
-- WHERE TABLE_NAME = 'CB_RECIPES' 
-- ORDER BY COLUMN_ID;
