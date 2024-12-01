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
    CategoryName VARCHAR(225) NOT NULL
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

-- Sale Table (Entity 9)
CREATE TABLE Sale (
    SaleID INTEGER AUTO_INCREMENT PRIMARY KEY,
    SellerID INTEGER NOT NULL,
    OrderItemID INTEGER NOT NULL,
    ProductID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    SalePrice DECIMAL(10, 2),
    SaleDate DATE,
    FOREIGN KEY (SellerID) REFERENCES User(UserID),
    FOREIGN KEY (OrderItemID) REFERENCES OrderedItem(OrderItemID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- Payment Table (Entity 10)
CREATE TABLE Payment (
    PaymentID INTEGER AUTO_INCREMENT PRIMARY KEY,
    OrderID INTEGER NOT NULL,
    PaymentMethod VARCHAR(225),
    PaymentStatus VARCHAR(225),
    PaymentDate DATE,
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID)
);

-- Review Table (Entity 11)
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
('456 Random Dr', 'Los Angeles', 'CA', 90001)
;

INSERT INTO User (Username, Password, Email, Role, AddressID) VALUES
('user_buyer', 'buy123', 'buyer@gmail.com', 'User', 1),
('admin1', 'password456', 'admin@hotmail.com', 'Admin', 2),
('user_seller', 'sell123', 'seller@yahoo.com', 'User', 3)
;

INSERT INTO Category (CategoryName) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home & Kitchen')
;

INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) VALUES
(3, 1, 'Laptop', 'General use laptop with high performance', 699.99, 50, 'laptop.jpg', '2023-01-01'),
(3, 2, 'Dictionary', 'A regular dictionary', 19.99, 100, 'dictionary.jpg', '2022-11-15'),
(3, 3, 'T-shirt', 'A simple t-shirt', 14.99, 200, 'tshirt.jpg', '2022-08-20')
;

INSERT INTO Inventory (SellerID, ProductID, Quantity) VALUES
(3, 1, 50),
(3, 2, 100),
(3, 3, 200)
;

INSERT INTO ShoppingCart (UserID, ProductID, Quantity) VALUES
(1, 1, 1),
(1, 2, 2)
;

INSERT INTO `Order` (BuyerID, TotalPrice, PurchaseDate) VALUES
(1, 739.97, '2023-03-10'),
(1, 49.97, '2023-03-15')
;

INSERT INTO OrderedItem (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 1, 699.99),
(1, 2, 2, 19.99),
(2, 3, 3, 14.99)
;

INSERT INTO Sale (SellerID, OrderItemID, ProductID, Quantity, SalePrice, SaleDate) VALUES
(3, 1, 1, 1, 699.99, '2023-03-10'),
(3, 2, 2, 2, 39.98, '2023-03-10'),
(3, 3, 3, 3, 49.97, '2023-03-15')
;

INSERT INTO Payment (OrderID, PaymentMethod, PaymentStatus, PaymentDate) VALUES
(1, 'CreditCard', 'Completed', '2023-03-10'),
(2, 'PayPal', 'Completed', '2023-03-15')
;

INSERT INTO Review (ProductID, UserID, Stars, ReviewContent, PublishDate) VALUES
(1, 1, 5, 'Good', '2023-03-11'),
(2, 1, 4, 'Nice', '2023-03-16')
;