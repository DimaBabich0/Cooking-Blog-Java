-- Migration: Add status field to CB_RECIPES and CB_BLOGS tables
-- Status values: PENDING, PUBLISHED, REJECTED

-- Add status column to CB_RECIPES
ALTER TABLE CB_RECIPES ADD (
    status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL
);

-- Add status column to CB_BLOGS
ALTER TABLE CB_BLOGS ADD (
    status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL
);

-- Set existing records to PUBLISHED (assuming they were already approved)
UPDATE CB_RECIPES SET status = 'PUBLISHED' WHERE status = 'PENDING';
UPDATE CB_BLOGS SET status = 'PUBLISHED' WHERE status = 'PENDING';

-- Add check constraint to ensure valid status values
ALTER TABLE CB_RECIPES ADD CONSTRAINT chk_recipe_status 
    CHECK (status IN ('PENDING', 'PUBLISHED', 'REJECTED'));

ALTER TABLE CB_BLOGS ADD CONSTRAINT chk_blog_status 
    CHECK (status IN ('PENDING', 'PUBLISHED', 'REJECTED'));

COMMIT;
