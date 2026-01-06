-- SQL скрипт для добавления тестовых постов блога в таблицу CB_BLOGS
-- ВАЖНО: Убедитесь, что в таблице CB_USERS есть пользователь с ID = 1
-- Если у вас другой ID пользователя, измените USER_ID в запросах ниже

-- Пост 1: Полное руководство по становлению профессиональным шеф-поваром
INSERT INTO CB_BLOGS (
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    USER_ID,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'Full Guide to Becoming a Professional Chef',
    'Discover the essential steps and skills needed to pursue a career in professional cooking.',
    '<h2>How did you start out in the food industry?</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<h2>What do you like most about your job?</h2>
<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

<h2>Do you cook at home on your days off?</h2>
<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>

<blockquote>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac ultrices odio.</p>
</blockquote>

<h2>What is the biggest misconception that people have about being a professional chef?</h2>
<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>',
    'chef-cooking.jpg',
    0,
    1,
    TIMESTAMP '2023-10-15 10:30:00',
    TIMESTAMP '2023-10-15 10:30:00'
);

-- Пост 2: Секреты идеальной пасты
INSERT INTO CB_BLOGS (
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    USER_ID,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'The Secret of Perfect Pasta',
    'Learn how to make al dente pasta every single time with these professional tips.',
    '<h2>Choosing the Right Pasta</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. The key to perfect pasta starts with selecting the right type. Fresh pasta works best for delicate sauces, while dried pasta holds up better with hearty, robust sauces.</p>

<h2>Cooking Techniques</h2>
<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Always use a large pot with plenty of salted water. The general rule is 1 liter of water and 10 grams of salt per 100 grams of pasta.</p>

<h2>Timing is Everything</h2>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Taste your pasta a minute or two before the package suggests. Al dente pasta should have a slight resistance when bitten.</p>

<blockquote>
<p>The secret to great pasta is in the details: quality ingredients, proper technique, and timing.</p>
</blockquote>

<h2>Sauce Pairing</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Remember to reserve some pasta water before draining - it''s the secret ingredient that helps bind your sauce to the pasta.</p>',
    'pasta-dish.jpg',
    20,
    1,
    TIMESTAMP '2023-11-20 14:15:00',
    TIMESTAMP '2023-11-20 14:15:00'
);

-- Пост 3: Путешествие домашнего хлеба
INSERT INTO CB_BLOGS (
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    USER_ID,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'Homemade Bread Journey',
    'From dough to crust - everything you need to know about baking perfect bread at home.',
    '<h2>Getting Started with Bread Making</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Baking bread at home is one of the most rewarding culinary experiences. The process requires patience, but the results are absolutely worth it.</p>

<h2>Understanding Your Ingredients</h2>
<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Flour, water, yeast, and salt - these four simple ingredients can create an incredible variety of breads. The quality of your flour makes a huge difference.</p>

<h2>The Kneading Process</h2>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Proper kneading develops gluten, which gives bread its structure. You''ll know your dough is ready when it becomes smooth and elastic.</p>

<h2>Proofing and Rising</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Temperature and humidity play crucial roles in how your bread rises. A warm, draft-free environment is ideal.</p>

<blockquote>
<p>Bread making is both an art and a science. Each loaf teaches you something new.</p>
</blockquote>

<h2>Baking to Perfection</h2>
<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. The sound of a hollow thud when you tap the bottom of your loaf means it''s perfectly baked.</p>',
    'homemade-bread.jpg',
    180,
    1,
    TIMESTAMP '2023-12-01 09:00:00',
    TIMESTAMP '2023-12-01 09:00:00'
);

-- Пост 4: Здоровое питание для начинающих
INSERT INTO CB_BLOGS (
    TITLE,
    DESCRIPTION,
    TEXT,
    PHOTO_URL,
    COOKING_TIME,
    USER_ID,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'Healthy Eating for Beginners',
    'Simple tips and recipes to start your journey towards a healthier lifestyle.',
    '<h2>Why Healthy Eating Matters</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Healthy eating doesn''t have to be complicated or expensive. With the right approach, you can enjoy delicious meals while nourishing your body.</p>

<h2>Building a Balanced Plate</h2>
<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A balanced meal includes proteins, carbohydrates, healthy fats, and plenty of vegetables. Aim for variety and color on your plate.</p>

<h2>Meal Planning Made Easy</h2>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Planning your meals ahead of time saves both money and stress. Start with planning just a few days ahead, then gradually increase.</p>

<h2>Simple Swaps for Better Health</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Small changes can make a big difference. Swap white rice for brown, choose whole grain bread, and opt for lean proteins.</p>

<blockquote>
<p>Healthy eating is a journey, not a destination. Every small step counts.</p>
</blockquote>

<h2>Staying Motivated</h2>
<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Remember that it''s okay to indulge occasionally. The key is consistency, not perfection.</p>',
    'healthy-food.jpg',
    30,
    1,
    TIMESTAMP '2023-12-10 16:45:00',
    TIMESTAMP '2023-12-10 16:45:00'
);

COMMIT;
