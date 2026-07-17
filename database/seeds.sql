USE getmart_db;

-- 1. Seed Users (Admin & Customer)
-- All passwords are set to 'password123' (BCrypt hash: $2a$10$e0MYzXy53LFAhxM675fXEeVW40k.tJk7FswXUf8B7L60n7/wS6U2K)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, status) VALUES
(1, 'jagadeeshdodda2@gmail.com', '$2a$10$e0MYzXy53LFAhxM675fXEeVW40k.tJk7FswXUf8B7L60n7/wS6U2K', 'Jagadeesh', 'Dodda', '9177411203', 'ADMIN', 'ACTIVE'),
(2, 'rudraganiramsai@gmail.com', '$2b$12$paWLFyE3EEHlwgu5shoD0u0RzbQRLHzqGA3T4L7Ia5P0arThoyd2C', 'Ram', 'Sai', '9170104546', 'ADMIN', 'ACTIVE'),
(3, 'harshasrujan88@gmail.com', '$2b$12$clR6DJUsSsZNJGfQGiHYj.uZghc2FHQF0T7qHiInfptOZE4dcn3wm', 'Harsha', 'Srujan', '9177411544', 'CUSTOMER', 'ACTIVE');

-- 2. Seed Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Electronics', 'electronics', 'High-end premium electronics, laptops, smartphones and audio gear.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80'),
(2, 'Vegetables', 'vegetables', 'Fresh and organic direct-from-farm vegetables.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80'),
(3, 'Shoes', 'shoes', 'Premium casual, running and designer sneakers.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'),
(4, 'Summer Wear', 'summer-wear', 'Lightweight resort shirts, shorts, and summer dresses.', 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=500&q=80'),
(5, 'Winter Wear', 'winter-wear', 'Heavy parkas, wool sweaters, down jackets, and accessories.', 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500&q=80'),
(6, 'Sports Wear', 'sports-wear', 'Sweat-wicking gym tees, compression wear, and track suits.', 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=500&q=80');

-- 3. Seed Brands
INSERT INTO brands (id, name, slug, logo_url, description) VALUES
(1, 'Apple', 'apple', 'https://logo.clearbit.com/apple.com', 'Innovative smartphones, laptops, and watches.'),
(2, 'Samsung', 'samsung', 'https://logo.clearbit.com/samsung.com', 'Leading developer of screens, phones, and storage devices.'),
(3, 'Organic Farms', 'organic-farms', 'https://logo.clearbit.com/organicvalley.coop', 'Hand-picked daily organic fresh produce.'),
(4, 'Nike', 'nike', 'https://logo.clearbit.com/nike.com', 'Just Do It. Athletic shoes and performance clothing.'),
(5, 'Adidas', 'adidas', 'https://logo.clearbit.com/adidas.com', 'Performance and lifestyle clothing and footwear.'),
(6, 'Zara', 'zara', 'https://logo.clearbit.com/zara.com', 'Fast luxury lifestyle garments.'),
(7, 'H&M', 'hm', 'https://logo.clearbit.com/hm.com', 'Everyday essentials and fashion items.'),
(8, 'Puma', 'puma', 'https://logo.clearbit.com/puma.com', 'Forever Faster performance products.'),
(9, 'The North Face', 'the-north-face', 'https://logo.clearbit.com/thenorthface.com', 'Outdoor performance clothing and equipment.');

-- 4. Seed Products
-- Electronics (Category 1)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(1, 1, 1, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'The titanium design, A17 Pro chip, custom Action button, and 5x Telephoto camera.', 1299.00, 1199.00, 50, FALSE, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80"]', '{"Brand":"Apple","Display":"6.7-inch OLED","Processor":"A17 Pro","Storage":"256GB","Battery":"4441 mAh"}'),
(2, 1, 2, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Ultimate smartphone experience with built-in S-Pen, Galaxy AI, and 200MP camera.', 1299.00, 1149.00, 45, FALSE, '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80"]', '{"Brand":"Samsung","Display":"6.8-inch AMOLED","Processor":"Snapdragon 8 Gen 3","Storage":"512GB","Battery":"5000 mAh"}'),
(3, 1, 1, 'MacBook Pro 16" M3 Max', 'macbook-pro-16-m3-max', 'Powerhouse laptop for creators and developers, 16.2" Liquid Retina XDR, M3 Max chip.', 2499.00, 2349.00, 15, FALSE, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"]', '{"Brand":"Apple","Memory":"36GB Unified RAM","Storage":"1TB SSD","CPU":"14-Core","GPU":"30-Core"}'),
(4, 1, 2, 'Samsung QLED 4K Smart TV 65"', 'samsung-qled-4k-tv-65', 'Stunning colors, smart hub dashboard, quantum processor with 4K upscaling.', 899.00, 799.00, 20, FALSE, '["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80"]', '{"Brand":"Samsung","Resolution":"4K UHD","Screen Size":"65-inch","Refresh Rate":"120Hz"}'),
(5, 1, 1, 'Apple iPad Pro 12.9" M2', 'apple-ipad-pro-12-9-m2', 'Astonishing performance, Liquid Retina XDR display, superfast wireless connections.', 1099.00, 999.00, 30, FALSE, '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"]', '{"Brand":"Apple","Display":"12.9-inch Liquid Retina","Processor":"M2","Storage":"256GB"}'),
(6, 1, 2, 'Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', 'Immersive 24-bit Hi-Fi sound, active noise cancellation, comfortable design.', 199.00, 169.00, 100, FALSE, '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"]', '{"Brand":"Samsung","Battery Life":"Up to 29 hours","ANC":"Yes","Water Resistance":"IPX7"}'),
(7, 1, 1, 'Apple Watch Ultra 2', 'apple-watch-ultra-2', 'The most rugged and capable Apple Watch. Precision dual-frequency GPS, 36hr battery.', 799.00, 749.00, 25, FALSE, '["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80"]', '{"Brand":"Apple","Case Material":"Titanium","Connectivity":"LTE/GPS","Size":"49mm"}'),
(8, 1, 2, 'Samsung Odyssey OLED G9', 'samsung-odyssey-oled-g9', '49-inch curved gaming monitor, 240Hz refresh rate, 0.03ms response time.', 1599.00, 1399.00, 12, FALSE, '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80"]', '{"Brand":"Samsung","Aspect Ratio":"32:9","Resolution":"Dual QHD","Panel Type":"OLED"}'),
(9, 1, 1, 'Apple AirPods Max', 'apple-airpods-max', 'Over-ear headphones, active noise cancellation, transparency mode, spatial audio.', 549.00, 499.00, 40, FALSE, '["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&q=80"]', '{"Brand":"Apple","Type":"Over-ear","Weight":"384g","Case":"Smart Case"}'),
(10, 1, 2, 'Samsung Portable SSD T7 2TB', 'samsung-portable-ssd-t7-2tb', 'Fast, secure external storage, reads up to 1050 MB/s, password encryption.', 159.00, 139.00, 150, FALSE, '["https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&q=80"]', '{"Brand":"Samsung","Capacity":"2TB","Interface":"USB 3.2 Gen 2","Transfer Speed":"1,050 MB/s"}');

-- Vegetables (Category 2)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(11, 2, 3, 'Organic Fresh Tomatoes (1kg)', 'organic-fresh-tomatoes', 'Sweet, juicy, vine-ripened organic tomatoes sourced locally.', 2.99, NULL, 300, FALSE, '["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80"]', '{"Weight":"1kg","Type":"Organic","Shelf Life":"5 days"}'),
(12, 2, 3, 'Crisp Organic Carrots (1kg)', 'crisp-organic-carrots', 'Sweet and crunchy organic carrots, perfect for salads and juices.', 1.99, NULL, 250, FALSE, '["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80"]', '{"Weight":"1kg","Type":"Organic","Shelf Life":"10 days"}'),
(13, 2, 3, 'Fresh Green Broccoli (500g)', 'fresh-green-broccoli', 'Nutrient-rich, vibrant green broccoli crowns.', 3.49, 2.99, 180, FALSE, '["https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&q=80"]', '{"Weight":"500g","Type":"Fresh","Shelf Life":"4 days"}'),
(14, 2, 3, 'Sweet Bell Peppers Mix (3 Pack)', 'sweet-bell-peppers-mix', 'Pack of red, yellow, and green sweet bell peppers.', 4.49, NULL, 150, FALSE, '["https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=600&q=80"]', '{"Quantity":"3 Peppers","Colors":"Red, Yellow, Green","Type":"Fresh"}'),
(15, 2, 3, 'Organic Baby Spinach (250g)', 'organic-baby-spinach', 'Pre-washed, tender organic baby spinach leaves.', 2.99, 2.49, 120, FALSE, '["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80"]', '{"Weight":"250g","Type":"Organic","Status":"Pre-washed"}'),
(16, 2, 3, 'Fresh Red Onions (1kg)', 'fresh-red-onions', 'Pungent, firm red onions, staple for any culinary dish.', 1.89, NULL, 400, FALSE, '["https://images.unsplash.com/photo-1508747705729-40885702655a?w=600&q=80"]', '{"Weight":"1kg","Type":"Fresh","Origin":"Local Farm"}'),
(17, 2, 3, 'Organic Russet Potatoes (2kg)', 'organic-russet-potatoes', 'Perfect for baking, mashing, and frying organic potatoes.', 3.99, NULL, 300, FALSE, '["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80"]', '{"Weight":"2kg","Type":"Organic","Shelf Life":"30 days"}'),
(18, 2, 3, 'English Seedless Cucumbers (2 Pack)', 'english-seedless-cucumbers', 'Mild flavor, crunchy texture, seedless and crisp.', 1.49, NULL, 200, FALSE, '["https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&q=80"]', '{"Quantity":"2 Cucumbers","Type":"Seedless","Shelf Life":"7 days"}'),
(19, 2, 3, 'Organic Cauliflower (1 Head)', 'organic-cauliflower', 'Vibrant white, compact cauliflower head, high in fiber.', 3.99, 3.49, 140, FALSE, '["https://images.unsplash.com/photo-1568584711299-a3cf13e5a610?w=600&q=80"]', '{"Size":"1 Head","Type":"Organic","Shelf Life":"5 days"}'),
(20, 2, 3, 'Fresh Garlic Bulbs (3 Pack)', 'fresh-garlic-bulbs', 'Aromatic garlic bulbs, essential for seasoning.', 2.49, NULL, 350, FALSE, '["https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&q=80"]', '{"Quantity":"3 Bulbs","Type":"Fresh","Origin":"Local"}');

-- Shoes (Category 3)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(21, 3, 4, 'Nike Air Max 90', 'nike-air-max-90', 'Timeless sneaker with comfortable Max Air cushioning and classic silhouette.', 130.00, 110.00, 80, FALSE, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"]', '{"Brand":"Nike","Upper":"Leather & mesh","Cushioning":"Max Air","Type":"Lifestyle"}'),
(22, 3, 5, 'Adidas Ultraboost Light', 'adidas-ultraboost-light', 'Ultimate energy return, Lightweight Boost midsole, Primeknit upper.', 190.00, 160.00, 70, FALSE, '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"]', '{"Brand":"Adidas","Midsole":"Light BOOST","Upper":"Primeknit+","Purpose":"Running"}'),
(23, 3, 8, 'Puma RS-X Triple Black', 'puma-rs-x-triple-black', 'Retro-futuristic silhouette with running system cushioning tech.', 110.00, 95.00, 60, FALSE, '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"]', '{"Brand":"Puma","Color":"Triple Black","Cushioning":"RS Tech","Type":"Sneaker"}'),
(24, 3, 4, 'Nike Air Jordan 1 Low', 'nike-air-jordan-1-low', 'Inspired by the 1985 original, classic profile with encapsulated Air-Sole.', 115.00, NULL, 50, FALSE, '["https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80"]', '{"Brand":"Nike","Model":"Jordan 1","Upper":"Leather","Style":"Retro"}'),
(25, 3, 5, 'Adidas NMD_R1 V3', 'adidas-nmd-r1-v3', 'Tactical design, Boost midsole for step-in comfort, futuristic overlay plugs.', 160.00, 130.00, 65, FALSE, '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"]', '{"Brand":"Adidas","Midsole":"Boost","Style":"Streetwear"}'),
(26, 3, 8, 'Puma Suede Classic', 'puma-suede-classic', 'Iconic design since 1968, full suede upper, gold foil branding details.', 75.00, 65.00, 90, FALSE, '["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80"]', '{"Brand":"Puma","Upper":"Suede","Outsole":"Rubber","Origin":"Classic"}'),
(27, 3, 4, 'Nike Air Zoom Pegasus 40', 'nike-pegasus-40', 'Springy ride for every run, familiar pegasus fit, React foam and zoom units.', 140.00, 120.00, 85, FALSE, '["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"]', '{"Brand":"Nike","Midsole":"React Foam","Tech":"Zoom Air","Use":"Daily Running"}'),
(28, 3, 5, 'Adidas Stan Smith Primegreen', 'adidas-stan-smith', 'Clean aesthetic, timeless classic leather shoes constructed with recycled materials.', 100.00, NULL, 110, FALSE, '["https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80"]', '{"Brand":"Adidas","Material":"Primegreen","Color":"Cloud White/Green"}'),
(29, 3, 8, 'Puma Mirage Sport Remix', 'puma-mirage-sport-remix', 'Classic sport style meets futuristic elements, suede overlays, mesh panels.', 100.00, 80.00, 75, FALSE, '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"]', '{"Brand":"Puma","Inspiration":"DJ Culture","Upper":"Suede/Mesh"}'),
(30, 3, 4, 'Nike Blazer Mid 77 Vintage', 'nike-blazer-mid-77', 'Throwback basketball vibe with a vintage midsole finish and autoclave sole.', 105.00, 90.00, 55, FALSE, '["https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80"]', '{"Brand":"Nike","Style":"Mid-top","Upper":"Leather/Suede","Detail":"Autoclave Construction"}');

-- Summer Wear (Category 4)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(31, 4, 6, 'Zara Linen Resort Shirt', 'zara-linen-resort-shirt', 'Relaxed fit, lightweight 100% linen shirt with open collar.', 49.90, 39.90, 100, TRUE, '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"]', '{"Brand":"Zara","Material":"100% Linen","Fit":"Relaxed","Collar":"Camp Collar"}'),
(32, 4, 7, 'H&M Regular Fit Drawstring Shorts', 'hm-drawstring-shorts', 'Lightweight cotton-twill shorts with elastic waist and side pockets.', 24.99, NULL, 150, TRUE, '["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80"]', '{"Brand":"H&M","Material":"100% Cotton","Waist":"Drawstring Elastic"}'),
(33, 4, 6, 'Zara Premium Heavyweight Tee', 'zara-heavyweight-tee', 'Oversized thick cotton t-shirt with ribbed neck and drop shoulders.', 29.90, NULL, 200, TRUE, '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80"]', '{"Brand":"Zara","Material":"100% Cotton","Weight":"240 GSM","Fit":"Oversized"}'),
(34, 4, 7, 'H&M Floral Summer Dress', 'hm-floral-summer-dress', 'Flowy woven sundress with a V-neck, thin straps and flared skirt.', 39.99, 34.99, 80, TRUE, '["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80"]', '{"Brand":"H&M","Material":"Rayon","Pattern":"Floral","Neckline":"V-neck"}'),
(35, 4, 6, 'Zara Pleated Linen Pants', 'zara-pleated-linen-pants', 'Relaxed pleated trousers in a lightweight linen blend.', 59.90, NULL, 90, TRUE, '["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"]', '{"Brand":"Zara","Material":"Linen Blend","Pleats":"Single Pleat"}'),
(36, 4, 7, 'H&M Linen-Blend Summer Tunic', 'hm-linen-blend-tunic', 'Long, airy tunic top, collarless with a three-button front.', 34.99, NULL, 110, TRUE, '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"]', '{"Brand":"H&M","Material":"Linen/Cotton","Sleeves":"Roll-tab long"}'),
(37, 4, 6, 'Zara Crochet Knit Crop Top', 'zara-crochet-crop-top', 'Handcrafted design, high neckline, open knit summer staple.', 35.90, 29.90, 70, TRUE, '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80"]', '{"Brand":"Zara","KnitType":"Crochet","Style":"Crop"}'),
(38, 4, 7, 'H&M Print Beach Boardshorts', 'hm-print-boardshorts', 'Quick-dry swim shorts, tropical graphic prints, mesh lining.', 19.99, NULL, 130, TRUE, '["https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=600&q=80"]', '{"Brand":"H&M","Material":"Polyester","DryTime":"Quick dry"}'),
(39, 4, 6, 'Zara Canvas Beach Tote', 'zara-canvas-tote', 'Large spacious tote bag with contrast handles and zip closure.', 39.90, 32.90, 60, TRUE, '["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80"]', '{"Brand":"Zara","Material":"Canvas","Pockets":"Inside zip pocket"}'),
(40, 4, 7, 'H&M Classic Sunglasses Frame', 'hm-classic-sunglasses', 'Acetate frames with polarized UV400 lenses.', 14.99, NULL, 200, FALSE, '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"]', '{"Brand":"H&M","UV Protection":"UV400","Lenses":"Polarized"}');

-- Winter Wear (Category 5)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(41, 5, 9, 'The North Face Retro Nuptse Down Jacket', 'tnf-retro-nuptse-jacket', 'Stowable down hood, 700 fill goose down insulation, durable ripstop shell.', 320.00, 290.00, 40, TRUE, '["https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=600&q=80"]', '{"Brand":"The North Face","Fill":"700 Goose Down","Waterproof":"DWR Shell"}'),
(42, 5, 6, 'Zara Heavyweight Overcoat', 'zara-heavyweight-overcoat', 'Double-breasted tailored wool overcoat, premium lining, notch lapels.', 149.00, 129.00, 30, TRUE, '["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80"]', '{"Brand":"Zara","Material":"60% Wool","Fit":"Tailored"}'),
(43, 5, 7, 'H&M Cable Knit Wool Sweater', 'hm-cable-knit-sweater', 'Soft textured sweater in a warming wool blend, ribbed trims.', 49.99, NULL, 95, TRUE, '["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"]', '{"Brand":"H&M","Material":"Wool/Acrylic","Knit":"Cable Knit"}'),
(44, 5, 9, 'The North Face Denali Fleece', 'tnf-denali-fleece', 'Polartec recycled fleece jacket, zip-in integration, woven nylon overlays.', 99.00, 85.00, 60, TRUE, '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"]', '{"Brand":"The North Face","Material":"Polartec Fleece","Pockets":"4 chest and hand"}'),
(45, 5, 6, 'Zara Faux Leather Puffer Jacket', 'zara-faux-leather-puffer', 'High collar puffer jacket, zip closure, elasticated cuffs, synthetic fill.', 119.00, NULL, 50, TRUE, '["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80"]', '{"Brand":"Zara","Material":"Faux Leather","Fill":"Polyester"}'),
(46, 5, 7, 'H&M Soft Cashmere Knit Scarf', 'hm-cashmere-scarf', 'Premium 100% cashmere scarf, soft fringed trims, extremely warm.', 59.99, 49.99, 80, TRUE, '["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80"]', '{"Brand":"H&M","Material":"100% Cashmere","Dimensions":"180cm x 30cm"}'),
(47, 5, 9, 'The North Face McMurdo Parka', 'tnf-mcmurdo-parka', 'Longer length waterproof shell, faux fur hood trim, 550-fill down.', 350.00, 310.00, 25, TRUE, '["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&q=80"]', '{"Brand":"The North Face","Insulation":"550-down","Shell":"DryVent 2L"}'),
(48, 5, 6, 'Zara Textured Collar Cardigan', 'zara-textured-cardigan', 'Chunky shawl collar cardigan, button placket, patch pockets.', 69.90, NULL, 70, TRUE, '["https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&q=80"]', '{"Brand":"Zara","Collar":"Shawl Collar","Knit":"Chunky textured"}'),
(49, 5, 7, 'H&M Thermal Base Layer Set', 'hm-thermal-base-layer', 'Includes top and pants, micro-waffle stretch knit for heat retention.', 29.99, NULL, 110, TRUE, '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"]', '{"Brand":"H&M","Includes":"Top & Bottoms","Material":"Polyester Blend"}'),
(50, 5, 9, 'The North Face Etip Gloves', 'tnf-etip-gloves', 'Four-way stretch fleece gloves with touchscreen functionality.', 45.00, NULL, 130, TRUE, '["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80"]', '{"Brand":"The North Face","Touchscreen":"Etip Compatible","Material":"Fleece"}');

-- Sports Wear (Category 6)
INSERT INTO products (id, category_id, brand_id, name, slug, description, price, discount_price, stock_quantity, is_clothing, image_urls, specifications) VALUES
(51, 6, 4, 'Nike Dri-FIT Legend Tee', 'nike-dri-fit-legend-tee', 'Sweat-wicking performance tee, soft lightweight fabric, standard fit.', 35.00, 28.00, 150, TRUE, '["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"]', '{"Brand":"Nike","Technology":"Dri-FIT","Material":"100% Recycled Polyester"}'),
(52, 6, 5, 'Adidas Techfit Compression Tights', 'adidas-techfit-tights', 'Focuses your muscles for explosive power, AEROREADY wicks sweat.', 50.00, 42.00, 120, TRUE, '["https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&q=80"]', '{"Brand":"Adidas","Fit":"Compression","Tech":"AEROREADY"}'),
(53, 6, 8, 'Puma Essential Fleece Track Jacket', 'puma-essential-track-jacket', 'Full zip training jacket, high collar, side welt pockets, Puma logo.', 65.00, NULL, 80, TRUE, '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"]', '{"Brand":"Puma","Material":"Cotton/Polyester","Closure":"Full Zip"}'),
(54, 6, 4, 'Nike Pro Training Flex Shorts', 'nike-pro-flex-shorts', 'High stretch fabric moves with you, elastic waistband stays snug.', 30.00, NULL, 140, TRUE, '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"]', '{"Brand":"Nike","Inseam":"7-inch","Waistband":"Elastic Pro"}'),
(55, 6, 5, 'Adidas Tiro 23 Track Pants', 'adidas-tiro-23-pants', 'Classic soccer styling, moisture absorbing, ankle zippers for easy on/off.', 55.00, 45.00, 100, TRUE, '["https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80"]', '{"Brand":"Adidas","Style":"Tiro","Zippers":"Ankle zippers","Tech":"AEROREADY"}'),
(56, 6, 8, 'Puma Run Favorite Tee', 'puma-run-favorite-tee', 'Lightweight breathable run tee, flatlock stitching, reflective branding.', 25.00, NULL, 130, TRUE, '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80"]', '{"Brand":"Puma","Stitching":"Flatlock","Reflective":"Yes"}'),
(57, 6, 4, 'Nike Sportswear Club Hoodie', 'nike-club-hoodie', 'Classic look, brushed fleece comfort, adjustable drawstring hood.', 70.00, 60.00, 90, TRUE, '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"]', '{"Brand":"Nike","Material":"80% Cotton / 20% Polyester","Fleece":"Brushed"}'),
(58, 6, 5, 'Adidas Own The Run Wind Jacket', 'adidas-own-the-run-jacket', 'Water-repellent finish, wind resistant, reflective accents, zip chest pocket.', 80.00, 68.00, 75, TRUE, '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"]', '{"Brand":"Adidas","Feature":"Wind/Water Resistant","Pockets":"Zip chest"}'),
(59, 6, 8, 'Puma Train Favorite Shorts', 'puma-train-favorite-shorts', 'Ergonomic cuts for ease of motion, dryCELL moisture wicking technology.', 30.00, NULL, 110, TRUE, '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"]', '{"Brand":"Puma","Inseam":"9-inch","Tech":"dryCELL"}'),
(60, 6, 4, 'Nike Alpha High Support Sports Bra', 'nike-alpha-sports-bra', 'High molded support cups, front zip closure, adjustable crossed back straps.', 45.00, NULL, 80, TRUE, '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"]', '{"Brand":"Nike","Support Level":"High","Closure":"Front Zip"}');

-- 5. Seed Variants for Clothing (Summer: 31-39, Winter: 41-50, Sports: 51-60) and Shoes (21-30)
-- For Shoes: Size variants: 7, 8, 9, 10
DELIMITER //
CREATE PROCEDURE seed_shoe_variants()
BEGIN
    DECLARE i INT DEFAULT 21;
    WHILE i <= 30 DO
        INSERT INTO product_variants (product_id, variant_type, variant_value, stock_quantity, price_adjustment) VALUES
        (i, 'SIZE', '7', 15, 0.00),
        (i, 'SIZE', '8', 20, 0.00),
        (i, 'SIZE', '9', 25, 0.00),
        (i, 'SIZE', '10', 10, 5.00);
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;
CALL seed_shoe_variants();
DROP PROCEDURE seed_shoe_variants;

-- For Clothing (Summer Wear, Winter Wear, Sports Wear): Sizes S, M, L, XL
DELIMITER //
CREATE PROCEDURE seed_clothing_variants()
BEGIN
    DECLARE i INT;
    
    -- Summer Wear (31-39)
    SET i = 31;
    WHILE i <= 39 DO
        INSERT INTO product_variants (product_id, variant_type, variant_value, stock_quantity, price_adjustment) VALUES
        (i, 'SIZE', 'S', 20, 0.00),
        (i, 'SIZE', 'M', 30, 0.00),
        (i, 'SIZE', 'L', 30, 0.00),
        (i, 'SIZE', 'XL', 15, 0.00);
        SET i = i + 1;
    END WHILE;

    -- Winter Wear (41-50)
    SET i = 41;
    WHILE i <= 50 DO
        INSERT INTO product_variants (product_id, variant_type, variant_value, stock_quantity, price_adjustment) VALUES
        (i, 'SIZE', 'S', 10, 0.00),
        (i, 'SIZE', 'M', 15, 0.00),
        (i, 'SIZE', 'L', 15, 0.00),
        (i, 'SIZE', 'XL', 10, 5.00);
        SET i = i + 1;
    END WHILE;

    -- Sports Wear (51-60)
    SET i = 51;
    WHILE i <= 60 DO
        INSERT INTO product_variants (product_id, variant_type, variant_value, stock_quantity, price_adjustment) VALUES
        (i, 'SIZE', 'S', 25, 0.00),
        (i, 'SIZE', 'M', 35, 0.00),
        (i, 'SIZE', 'L', 35, 0.00),
        (i, 'SIZE', 'XL', 20, 0.00);
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;
CALL seed_clothing_variants();
DROP PROCEDURE seed_clothing_variants;

-- 6. Seed Coupons
INSERT INTO coupons (id, code, discount_value, discount_type, min_order_amount, max_discount_amount, expires_at, is_active) VALUES
(1, 'GETMART10', 10.00, 'PERCENTAGE', 50.00, 20.00, '2027-12-31 23:59:59', TRUE),
(2, 'WELCOME50', 50.00, 'FIXED', 200.00, 50.00, '2027-12-31 23:59:59', TRUE),
(3, 'FREESHIP', 15.00, 'FIXED', 100.00, 15.00, '2027-12-31 23:59:59', TRUE);
