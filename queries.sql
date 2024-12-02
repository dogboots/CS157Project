-- ? should be replaced with real data assuming from the backend

-- User Management Queries 

-- Users or admins can register new accounts:
INSERT INTO User (Username, Password, Email, Role, AddressID) 
VALUES(?, ?, ?, ?, ?)
;

-- Users or admins can inactivate accounts:
UPDATE User U
SET U.isActive = FALSE
WHERE U.UserID = ?
;

-- Users or admins can update account information:
UPDATE User U
SET U.Username = ?,
	U.Password = ?,
    U.Email = ?
WHERE U.UserID = ?
;

-- Fetch user data:
SELECT * 
FROM User U
WHERE U.UserID = ?
;

-- Product Management Queries 

-- Add new products:
INSERT INTO Product (SellerID, CategoryID, ProductName, ProductDescription, ProductPrice, StockQuantity, ProductImage, ReleaseDate) 
VALUES(?, ?, ?, ?, ?, ?, ?, ?)
;

-- Search for products:
SELECT * 
FROM Product P
WHERE P.ProductName Like '% ? %' AND P.CategoryID = ? AND P.ProductPrice BETWEEN ? AND ?
;

-- Cart Operation Queries 

-- Add to cart:
INSERT INTO ShoppingCart (UserID, ProductID, Quantity) 
VALUES(?, ?, ?)
;

-- Remove from cart:
DELETE FROM ShoppingCart S
WHERE S.UserID = ? AND S.ProductID = ?
;

-- Calculate total cart value:
SELECT SUM(sc.Quantity * p.ProductPrice) AS TotalCartValue
FROM ShoppingCart sc
JOIN Product p ON sc.ProductID = p.ProductID
WHERE sc.UserID = ?
;  

-- Order Placement Queries 

-- Insert orders:
INSERT INTO `Order` (BuyerID, TotalPrice, PurchaseDate) 
VALUES(?, ?, ?)
;

-- Insert ordereditems:
INSERT INTO OrderedItem (OrderID, ProductID, Quantity, UnitPrice)
VALUES (?, ?, ?, ?)
;

-- Add payment record:
INSERT INTO Payment (OrderID, PaymentMethod, PaymentStatus, PaymentDate)
VALUES (?, ?, ?, ?)
;  

-- Update product stock after order placed:
UPDATE Product p
JOIN OrderedItem oi ON p.ProductID = oi.ProductID
SET p.StockQuantity = p.StockQuantity - oi.Quantity
WHERE oi.OrderID = ?
;  
  
-- Add to existing product to inventory stock:
UPDATE Inventory
SET Quantity = Quantity + ? 
WHERE SellerID = ? AND ProductID = ?
;

-- Total Stock Quantity for a Product (Assuming multiple sellers for a one product):
SELECT SUM(Quantity) AS TotalStock
FROM Inventory
WHERE ProductID = ?
;

-- Report Queries 

-- Get user order history 
SELECT 
    o.OrderID,
    o.PurchaseDate,
    o.TotalPrice,
    u.Username,
    u.Email
FROM `Order` o
JOIN User u ON u.UserID = o.BuyerID
WHERE u.UserID = 1;

-- Get user sale history
SELECT 
    s.SaleID,
    s.SaleDate,
    s.SalePrice,
    oi.Quantity,
    p.ProductName,
    u.Username AS SellerUsername,
    u.Email AS SellerEmail
FROM Sale s
JOIN OrderedItem oi ON s.OrderItemID = oi.OrderItemID
JOIN Product p ON oi.ProductID = p.ProductID
JOIN User u ON s.SellerID = u.UserID
WHERE u.UserID = ?   
ORDER BY s.SaleDate DESC
;

-- Review Management Queries 

-- Add review record:
INSERT INTO Review (ProductID, UserID, Stars, ReviewContent, PublishDate)
VALUES (?, ?, ?, ?, ?)
;

-- Update review:
UPDATE Review 
SET Stars = ?,
	ReviewContent = ?
WHERE ReviewID = ?
;

-- Delete review:
DELETE FROM Review
WHERE ReviewID = ?
;

-- Fetch product reviews:
SELECT 
    r.ReviewID,
    r.Stars,
    r.ReviewContent,
    r.PublishDate,
    u.Username AS Reviewer,
    u.Email AS ReviewerEmail
FROM Review r
JOIN User u ON r.UserID = u.UserID
WHERE r.ProductID = ?
;