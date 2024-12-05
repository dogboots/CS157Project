CREATE DATABASE IF NOT EXISTS ecommerceDB;
USE ecommerceDB;

-- Address Table (Entity 1)
CREATE TABLE Address (
	AddressID INTEGER AUTO_INCREMENT PRIMARY KEY,
    StreetName VARCHAR(225) NOT NULL,
    City VARCHAR(225) NOT NULL,
    State VARCHAR (225) NOT NULL,
    ZipCode INTEGER NOT NULL
);

-- Users Table (Entity 2)
CREATE TABLE User (
	UserID INTEGER AUTO_INCREMENT PRIMARY KEY,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(225) NOT NULL,
    Email VARCHAR(225) UNIQUE NOT NULL,
    Role ENUM('user', 'admin') DEFAULT 'user',
    AddressID INTEGER,
	FOREIGN KEY (AddressID) REFERENCES Address(AddressID) ON DELETE SET NULL
);

-- Category Table (Entity 3)
CREATE TABLE Category (
	CategoryID INTEGER AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(225) NOT NULL UNIQUE
);

-- Product Table (Entity 4)
CREATE TABLE Product (
    ProductID INTEGER AUTO_INCREMENT PRIMARY KEY,
    SellerID INTEGER NOT NULL,
    CategoryID INTEGER,
    ProductName VARCHAR(225) NOT NULL,
    ProductDescription VARCHAR(225),
    ProductPrice DECIMAL(10, 2) NOT NULL,
    StockQuantity INTEGER DEFAULT 0,
    ProductImage VARCHAR(225),
    ReleaseDate DATE,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE SET NULL,
    FOREIGN KEY (SellerID) REFERENCES User(UserID) 
);

-- Inventory Table (Entity 5)
CREATE TABLE Inventory (
    InventoryID INTEGER AUTO_INCREMENT PRIMARY KEY,
    SellerID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER DEFAULT 0,
    FOREIGN KEY (SellerID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Shopping Cart Table (Entity 6)
CREATE TABLE ShoppingCart (
    UserID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (UserID, ProductID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Order Table (Entity 7)
CREATE TABLE `Order` (
    OrderID INTEGER AUTO_INCREMENT PRIMARY KEY,
    BuyerID INTEGER NOT NULL,
    TotalPrice DECIMAL(10, 2) NOT NULL,
    PurchaseDate DATE NOT NULL,
    FOREIGN KEY (BuyerID) REFERENCES User(UserID)
);

-- OrderedItem (Entity 8)
CREATE TABLE OrderedItem (
	OrderItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
    OrderID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- Payment Table (Entity 9)
CREATE TABLE Payment (
    PaymentID INTEGER AUTO_INCREMENT PRIMARY KEY,
    OrderID INTEGER NOT NULL,
    PaymentMethod VARCHAR(225),
    PaymentStatus VARCHAR(225),
    PaymentDate DATE,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID)
);

-- Review Table (Entity 10)
CREATE TABLE Review (
    ReviewID INTEGER AUTO_INCREMENT PRIMARY KEY,
    ProductID INTEGER NOT NULL,
    UserID INTEGER NOT NULL,
    Stars INTEGER CHECK (Stars >= 1 AND Stars <= 5),
    ReviewContent VARCHAR(225),
    PublishDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Populate Sample Data for testing

INSERT INTO Address (StreetName, City, State, ZipCode) VALUES
('1 Washington Sq', 'San Jose', 'CA', 95192),
('123 Test St', 'San Jose', 'CA', 95192),
('456 Random Dr', 'Los Angeles', 'CA', 90001),
('456 Test St', 'Los Angeles', 'CA', 90001),
('123 Fashion St', 'San Jose', 'CA', 95192)
;

INSERT INTO User (Username, Password, Email, Role, AddressID) VALUES
('user_buyer', 'buy123', 'buyer@gmail.com', 'User', 1),
('admin1', 'password456', 'admin@hotmail.com', 'Admin', 2),
('user_seller', 'sell123', 'seller@yahoo.com', 'User', 3),
('isellthings', 'selling123', 'isellthings@gmail.com', 'User', 4),
('fashionicon', 'fashion123', 'fashionicon@hotmail.com', 'User', 5)
;

INSERT INTO Category (CategoryName) VALUES
('Electronics'),
('Books'),
('Fashion'),
('HomeKitchen'),
('Toys'),
('Sports')
;

INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(3, 1, 'Laptop', 'General use laptop with high performance', 699.99, 50, '/images/laptop.jpg', '2023-01-01'),
(3, 2, 'Dictionary', 'A regular dictionary', 19.99, 100, '/images/dictionary.jpg', '2022-11-15'),
(3, 3, 'T-shirt', 'A simple t-shirt', 14.99, 200, '/images/tshirt.jpg', '2022-08-20')
;

-- Dummy data for electronics 
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(4, 1, 'Smartphone', '6.5-inch display, 64GB storage', 499.99, 100, '/images/smartphone.jpg', '2023-09-01'),
(4, 1, 'Smartwatch', 'Health tracking, GPS', 149.99, 150, '/images/smartwatch.jpg', '2023-10-10'),
(4, 1, 'Bluetooth Speaker', 'Compact, 12-hour battery', 49.99, 300, '/images/bluetoothspeaker.jpg', '2023-08-20'),
(4, 1, 'Camera', 'Waterproof, 1080p recording', 199.99, 80, '/images/bluetoothspeaker.jpg', '2023-09-15'),
(4, 1, 'Wireless Earbuds', 'Noise-cancelling, 10-hour life', 99.99, 200, '/images/wirelessearbuds.jpg', '2023-11-15'),
(3, 1, 'Desk Fan', 'Adjustable speed, quiet', 29.99, 120, '/images/deskfan.jpg', '2023-06-10'),
(3, 1, 'Mouse', 'Wireless mouse with adjustable DPI', 29.99, 200, '/images/mouse.jpg', '2022-09-15')
;

-- Dummy data for books
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(3, 2, 'Thesaurus', 'A classic thesaurus for finding synonyms and antonyms.', 19.99, 150, '/images/thesaurus.jpg', '2021-07-05'),
(3, 2, 'The Very Hungry Caterpillar', 'A classic childrens book', 11.99, 50, '/images/caterpillarbook.jpg', '2022-10-10'),
(4, 2, 'The Giving Tree', 'Shel Silverstein: The Giving Tree', 10.99, 300, '/images/givingtree.jpg', '2021-08-20'),
(4, 2, 'The Lightning Thief', 'First Percy Jackson book', 20.99, 80, '/images/lightningthief.jpg', '2009-09-15'),
(4, 2, 'The Sea of Monsters', 'Second Percy Jackson book', 20.99, 90, '/images/seaofmonsters.jpg', '2011-11-15'),
(4, 2, 'Moby-Dick', 'A book about the whale', 29.99, 50, '/images/mobydick.jpg', '2018-06-10'),
(4, 2, 'Frankenstein', 'story about a science experiment gone wrong', 15.99, 200, '/images/frankenstein.jpg', '2022-09-15')
;

-- Dummy data for fashion
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(5, 3, 'Jeans', 'Very new jeans', 19.99, 150, '/images/jeans.jpg', '2021-08-05'),
(5, 3, 'Sweater', 'Warm sweater', 25.99, 50, '/images/sweater.jpg', '2022-11-10'),
(5, 3, 'Socks', 'Comfy pair of socks', 8.99, 300, '/images/socks.jpg', '2021-08-20'),
(5, 3, 'Glasses', 'Fashionable glasses', 149.99, 20, '/images/glasses.jpg', '2021-09-15'),
(5, 3, 'Gloves', 'Fashionable gloves', 200.99, 25, '/images/gloves.jpg', '2020-11-15'),
(5, 3, 'Shoes', 'Good Shoes, Last a lifetime', 19.99, 50, '/images/shoes.jpg', '2018-06-10'),
(5, 3, 'Ring', 'Very pretty ring', 399.99, 25, '/images/ring.jpg', '2022-09-15')
;

-- Dummy data for Home & Kitchen
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(4, 4, 'Fork', 'Perfect for eating pasta', 4.99, 150, '/images/fork.jpg', '2021-08-05'),
(4, 4, 'Spoon', 'Perfect for some soup', 4.99, 50, '/images/spoon.jpg', '2022-11-10'),
(4, 4, 'Chopstick', 'Asian eating utensil', 4.99, 300, '/images/chopsticks.jpg', '2021-08-20'),
(4, 4, 'Cup', 'Useful for any kind of drink', 7.99, 20, '/images/cup.jpg', '2021-09-15'),
(4, 4, 'Plate', 'Necessary for daily meals', 10.99, 25, '/images/plate.jpg', '2020-11-15'),
(4, 4, 'Pan', 'Perfect to sear the perfect steak', 19.99, 50, '/images/pan.jpg', '2018-06-10'),
(4, 4, 'Bottle', 'Useful for water or any drink', 15.99, 250, '/images/bottle.jpg', '2022-07-05'),
(4, 4, 'Toaster', 'Perfect for making some toast', 50.99, 25, '/images/toaster.jpg', '2022-09-15')
;

-- Dummy data for Toys
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(4, 5, 'Toy Car', 'Friction Powered Cars Toys for Toddlers', 4.99, 150, '/images/toycar.jpg', '2021-08-05'),
(4, 5, 'Teddy Bear', 'Stuffed toy in the form of a bear', 13.99, 50, '/images/teddybear.jpg', '2022-11-10'),
(4, 5, 'Dinosaur Toy', 'Fierce dinosaur toy for kids who crave adventure', 13.99, 300, '/images/dinosaurtoy.jpg', '2021-08-20'),
(4, 5, 'Bakugan', 'Special Attack Dragonoid', 30.99, 20, '/images/bakugan.jpg', '2021-09-15'),
(4, 5, 'Beyblade', 'Popular toy for children', 39.99, 25, '/images/beyblade.jpg', '2020-11-15'),
(4, 5, 'Doll', 'Cute toy for children', 15.99, 50, '/images/doll.jpg', '2018-06-10'),
(4, 5, 'Toy Piano', 'Toy Piano to keep your child happy', 15.99, 250, '/images/toypiano.jpg', '2022-07-05'),
(3, 5, 'Action figure', 'Cool toy for kids who love adventure', 50.99, 25, '/images/actionfigure.jpg', '2022-09-15')
;

-- Dummy data for Sports
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(4, 6, 'Basketball', 'The best long-lasting basketball', 4.99, 150, '/images/basketball.jpg', '2021-08-05'),
(4, 6, 'Soccerball', 'Perfect to kick around on the field', 8.99, 50, '/images/soccerball.jpg', '2022-11-10'),
(4, 6, 'Baseball bat', 'Easy to swing, made with good material', 13.99, 300, '/images/baseballbat.jpg', '2021-08-20'),
(4, 6, 'Golf Ball', 'Lowest prices of the season', 3.99, 20, '/images/golfball.jpg', '2021-09-15'),
(4, 6, 'Tennis Racquet', 'Best selection of quality tennis racquets', 19.99, 25, '/images/tennisracquet.jpg', '2020-11-15'),
(3, 6, 'Tennis Ball', 'High quality, long-lasting', 9.99, 50, '/images/tennisball.jpg', '2018-06-10'),
(3, 6, 'Volleyball', 'Simple design, water resistant', 35.99, 250, '/images/volleyball.jpg', '2022-07-05'),
(3, 6, 'Football', 'Designed to meet the needs of players at every level', 36.99, 25, '/images/football.jpg', '2022-09-15')
;

INSERT INTO Inventory (SellerID, ProductID, Quantity) VALUES
(3, 1, 50),
(3, 2, 100),
(3, 3, 200),
(4, 4, 100),
(4, 5, 150),
(4, 6, 300),
(4, 7, 80),
(4, 8, 200),
(3, 9, 120),
(3, 10, 200),
(3, 11, 150),
(4, 12, 50),
(4, 13, 300),
(4, 14, 80),
(4, 15, 90),
(4, 16, 50),
(4, 17, 200),
(4, 18, 300),
(5, 19, 150),
(5, 20, 50),
(5, 21, 300),
(5, 22, 20),
(5, 23, 25),
(5, 24, 50),
(5, 25, 25),
(4, 26, 150),
(4, 27, 50),
(4, 28, 300),
(4, 29, 20),
(4, 30, 25),
(4, 31, 50),
(4, 32, 250),
(4, 33, 25),
(4, 34, 150),
(4, 35, 50),
(4, 36, 300),
(4, 37, 20),
(4, 38, 25),
(3, 39, 50),
(3, 40, 250),
(3, 41, 25),
(4, 42, 50),
(4, 43, 300),
(4, 44, 20),
(4, 45, 25),
(3, 46, 150),
(3, 47, 50),
(3, 48, 300);



INSERT INTO Payment (OrderID, PaymentMethod, PaymentStatus, PaymentDate) VALUES
(1, 'CreditCard', 'Completed', '2023-03-10'),
(2, 'PayPal', 'Completed', '2023-03-15')
;
