-- Migration: Add blog_id column to CB_COMMENTS and CB_RATINGS tables
-- This allows comments and ratings to be associated with blogs in addition to recipes
-- SAFE VERSION: Checks if columns/constraints exist before adding them

-- Add blog_id to CB_COMMENTS table (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_COMMENTS ADD blog_id NUMBER NULL';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -1430 THEN -- Column already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

-- Add foreign key constraint for blog_id in CB_COMMENTS (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_COMMENTS ADD CONSTRAINT FK_COMMENTS_BLOG FOREIGN KEY (blog_id) REFERENCES CB_BLOGS(id)';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2260 OR SQLCODE = -2275 THEN -- Constraint already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

-- Make recipe_id nullable in CB_COMMENTS (if not already)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_COMMENTS MODIFY recipe_id NUMBER NULL';
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore errors
END;
/

-- Add blog_id to CB_RATINGS table (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_RATINGS ADD blog_id NUMBER NULL';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -1430 THEN -- Column already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

-- Add foreign key constraint for blog_id in CB_RATINGS (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_RATINGS ADD CONSTRAINT FK_RATINGS_BLOG FOREIGN KEY (blog_id) REFERENCES CB_BLOGS(id)';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2260 OR SQLCODE = -2275 THEN -- Constraint already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

-- Make recipe_id nullable in CB_RATINGS (if not already)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_RATINGS MODIFY recipe_id NUMBER NULL';
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore errors
END;
/

-- Add check constraint for CB_COMMENTS (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_COMMENTS ADD CONSTRAINT CHK_COMMENTS_REFERENCE CHECK ((recipe_id IS NOT NULL AND blog_id IS NULL) OR (recipe_id IS NULL AND blog_id IS NOT NULL))';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2260 OR SQLCODE = -2275 THEN -- Constraint already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

-- Add check constraint for CB_RATINGS (skip if exists)
BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE CB_RATINGS ADD CONSTRAINT CHK_RATINGS_REFERENCE CHECK ((recipe_id IS NOT NULL AND blog_id IS NULL) OR (recipe_id IS NULL AND blog_id IS NOT NULL))';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2260 OR SQLCODE = -2275 THEN -- Constraint already exists
            NULL; -- Skip silently
        ELSE
            RAISE;
        END IF;
END;
/

COMMIT;
