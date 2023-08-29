USE Ecom;
GO

CREATE PROCEDURE "sp_increase_usercart_quantity" @CartId INT
AS 
BEGIN
	DECLARE @Quantity int = -1;
	DECLARE @ProductId int = -1;
	DECLARE @ProductStock int = -1;
	
	SELECT @ProductId = (ProductId) FROM [dbo].[UserCart] WHERE CartId = @CartId;
	IF (@ProductId > -1)
	BEGIN
		SELECT @ProductStock = (Stock) FROM [dbo].[Products] WHERE ProductId = @ProductId;
		SELECT @Quantity = (Quantity) FROM [dbo].[UserCart] WHERE CartId = @CartId;

		IF (@ProductStock > -1 AND @Quantity + 1 <= @ProductStock)
		BEGIN 
			UPDATE UserCart SET Quantity = Quantity + 1 WHERE CartId = @CartId;				
			RETURN (@Quantity + 1);
		END		
	END
	
	RETURN -1;	
END
GO

CREATE PROCEDURE "sp_decrease_usercart_quantity" @CartId INT
AS 
BEGIN
	DECLARE @Quantity int = -1;
	DECLARE @ProductId int = -1;
	DECLARE @ProductStock int = -1;
	
	SELECT @ProductId = (ProductId) FROM [dbo].[UserCart] WHERE CartId = @CartId;
	IF (@ProductId > -1)
	BEGIN
		SELECT @ProductStock = (Stock) FROM [dbo].[Products] WHERE ProductId = @ProductId;
		SELECT @Quantity = (Quantity) FROM [dbo].[UserCart] WHERE CartId = @CartId;

		IF (@ProductStock > -1 AND @Quantity - 1 > 0)
		BEGIN 
			UPDATE UserCart SET Quantity = Quantity - 1 WHERE CartId = @CartId;				
			RETURN (@Quantity - 1);
		END		
	END

	RETURN -1;
END
GO

CREATE PROCEDURE "sp_check_or_register_google_user" @UserName VARCHAR(200), @Email VARCHAR(300), @FirstName VARCHAR(30),  @LastName VARCHAR(30)
AS
BEGIN
	DECLARE @UserId int = -1;
	DECLARE @AuthType VARCHAR(20) = null;
	SELECT @UserId = (UserId), @AuthType = (AuthType) FROM Users WHERE Email = @Email;

	IF @UserId = -1
	BEGIN
		SET NOCOUNT ON;
		INSERT INTO Users (Username, Email, FirstName, LastName, AuthType) VALUES (@Username, @Email, @FirstName, @LastName, 'GOOGLE');
		SET @UserId = SCOPE_IDENTITY();
	END
	ELSE IF @AuthType = 'GOOGLE'
	BEGIN
		RETURN @UserId;
	END
	ELSE 
	BEGIN
		RETURN -1;
	END	
END
GO

DROP PROCEDURE sp_check_or_register_google_user;
GO

CREATE PROCEDURE "sp_check_or_register_native_user" @UserName VARCHAR(200), @Email VARCHAR(300), @FirstName VARCHAR(30),  @LastName VARCHAR(30)
AS
BEGIN
	--DECLARE @UserId,
END
GO

SELECT * FROM Users;
SELECT * FROM Orders;
DROP TABLE Orders;

CREATE TABLE Orders
(
	OrderId INT IDENTITY(1,1) NOT NULL,
	UserId INT NOT NULL,	
	OrderDate DATE DEFAULT(GETDATE()),
	CompletedOn DATE NULL,
	IsCancelled BIT DEFAULT(0),
	PRIMARY KEY (OrderId),
	FOREIGN KEY (UserId) REFERENCES Users (UserId)
);

SELECT * FROM Addresses;

ALTER TABLE Orders ADD PaymentMethod VARCHAR(20) DEFAULT('COD') CHECK (PaymentMethod IN ('COD', 'UPI', ''));
ALTER TABLE Orders ADD Amount FLOAT NOT NULL;
ALTER TABLE Orders ADD AddressId INT FOREIGN KEY REFERENCES Addresses(AddressId);
EXEC sp_help Orders;
GO

CREATE TABLE OrderedProducts
(
	Id INT IDENTITY(1,1) NOT NULL,
	OrderId INT NOT NULL,
	ProductId INT NULL,
	Quantity INT DEFAULT (1) NOT NULL,
	FOREIGN KEY (OrderId) REFERENCES Orders (OrderId) ON DELETE CASCADE,
	FOREIGN KEY (ProductId) REFERENCES Products (ProductId) ON DELETE SET NULL
);
GO

SELECT * FROM UserCart;
GO

CREATE PROCEDURE "sp_order_single_product" @CartId INT, @AddressId INT, @PaymentMethod VARCHAR(30)
AS
BEGIN
	DECLARE @Price FLOAT = -1;
	DECLARE @UserId INT = -1
	DECLARE @ProductId INT = -1;
	DECLARE @Quantity INT = -1;

	SELECT @Price = Price, @UserId = uc.UserId, @ProductId = uc.ProductId, @Quantity = uc.Quantity
		FROM Products p
		JOIN UserCart uc ON uc.ProductId = p.ProductId 
		WHERE uc.CartId = @CartId;
	
	IF @Price = -1 OR @UserId = -1 OR @ProductId = -1
		RETURN -1;
	ELSE
	BEGIN
		SET NOCOUNT ON;
		INSERT INTO Orders (UserId, UserAddress, Amount, PaymentMethod) 
			VALUES (@UserId, (SELECT UserAddress FROM Addresses WHERE @AddressId = AddressId), @Price * @Quantity, @PaymentMethod);
		DECLARE @OrderId INT = SCOPE_IDENTITY();		

		IF @OrderId = NULL
			RETURN -1;

		INSERT INTO OrderedProducts (OrderId, Quantity, ProductData) 
		VALUES (
			@OrderId, 
			@Quantity,
			(			
				SELECT * FROM Products p 
				WHERE p.ProductId = @ProductId
				FOR JSON PATH, WITHOUT_ARRAY_WRAPPER				
			)
		);

		DELETE FROM UserCart WHERE CartId = @CartId;
		UPDATE Products SET Stock = Stock - @Quantity WHERE ProductId = @ProductId;
		RETURN @OrderId;
	END
END
GO

EXEC sp_help Orders; 
SELECT JSON_VALUE(ProductData, '$.ProductName') FROM OrderedProducts;
DROP PROCEDURE sp_order_single_product;


INSERT INTO TestTable (JsonString)
SELECT (
	SELECT * 
	FROM Products p
	WHERE p.ProductId = Products.ProductId
	FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
)
FROM Products
WHERE Products.ProductId > 58;

DECLARE @OrderId INT = -1;
EXEC @OrderId = sp_order_single_product 74, 1, 'UPI';
PRINT @OrderId;

SELECT * FROM Orders;
SELECT * FROM OrderedProducts;
SELECT * FROM UserCart;

DROP PROCEDURE sp_order_single_product;

EXEC sp_help Addresses;
EXEC sp_help Orders;
EXEC sp_help OrderedProducts;
SELECT * FROM Products WHERE ProductId = 51;

INSERT INTO Addresses (UserId, UserAddress) VALUES (52, 'this is temp address');
SELECT * FROM Addresses;
--INSERT INTO Users (Username, Email, Password, AuthType) VALUES ('asfasAMNDFdss', 'asadsdnSDFNBSDmsdbsd,', , 'GOOGLE');
--DELETE FROM Users WHERE UserId > 19;

SELECT * FROM Orders;
SELECT * FROM OrderedProducts;
SELECT * FROM Products;
SELECT * FROM Addresses;
DELETE FROM Orders;
SELECT *, op.Id as OrderProductId FROM Orders o JOIN OrderedProducts op ON o.OrderId = op.OrderId JOIN Addresses ad ON o.AddressId = ad.AddressId JOIN Products p ON p.ProductId = op.ProductId WHERE o.UserId = 52;

SELECT name FROM sys.tables;

CREATE TABLE TestTable
(
	JsonString NVARCHAR (MAX)
);

INSERT INTO TestTable (JsonString)
SELECT (
	SELECT * 
	FROM Products p
	WHERE p.ProductId = Products.ProductId
	FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
)
FROM Products
WHERE Products.ProductId > 58;

SELECT * FROM TestTable;
DELETE FROM TestTable;

SELECT JsonString, JSON_VALUE(JsonString, '$.ProductName') FROM TestTable;

DELETE FROM Orders;

ALTER TABLE OrderedProducts DROP COLUMN ProductId;
ALTER TABLE OrderedProducts ADD ProductData NVARCHAR (MAX) NOT NULL

SELECT JSON_VALUE(ProductData, '$.ProductName') FROM OrderedProducts;
SELECT * FROM Products WHERE ProductId = 51;

SELECT JSON_QUERY(ProductData) FROM OrderedProducts;

--SELECT TOP 5 * FROM Products WHERE Category IN (SELECT Category FROM Products GROUP BY Category);
SELECT (SELECT TOP 2 * FROM Products p WHERE p.ProductId = x.ProductId ) 
FROM Products x;

SELECT * FROM Products x WHERE EXISTS (SELECT TOP 2 * FROM Products p WHERE p.Category = x.Category);

SELECT * FROM OrderedProducts;
SELECT * from Orders;
SELECT * FROM Addresses;
ALTER TABLE Addresses DROP COLUMN UserAddress;
DELETE FROM Addresses;
ALTER TABLE Addresses ADD UserAddress NVARCHAR(MAX) NOT NULL;
ALTER TABLE Addresses DROP COLUMN

ALTER TABLE Orders DROP COLUMN AddressId;
SELECT * FROM Addresses;
DROP TABLE Addresses;

SELECT * FROM Addresses;

CREATE TABLE Payments 
(
	Id INT IDENTITY(1, 1) NOT NULL,
	OrderId INT,
	IntentId INT NOT NULL,
	PaymentMethod VARCHAR(20) DEFAULT('CARD') NOT NULL,
	Currency VARCHAR (20) DEFAULT ('INR') NOT NULL,
	CreateOn DATETIME DEFAULT(GETDATE()) NOT NULL,
	Amount FLOAT NOT NULL CHECK (AMOUNT > 0),
	Status VARCHAR DEFAULT ('CREATED') NOT NULL

	PRIMARY KEY (Id),
	FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE SET NULL
);

DROP TABLE Payments;
SELECT * FROM UserCart;
SELECT * FROM UserCart uc JOIN Products p ON uc.ProductId = p.ProductId WHERE uc.CartId=97 AND uc.UserId=19

ALTER TABLE Orders DROP CONSTRAINT CK__Orders__PaymentM__489AC854;
ALTER TABLE Orders ADD CONSTRAINT CK__Orders__PaymentM__489AC854  CHECK (PaymentMethod IN ('COD', 'UPI', 'CARD'));

SELECT * FROM Users;