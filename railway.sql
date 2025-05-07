create database railway;

use railway;

CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,  -- Lưu mật khẩu đã hash
    Role ENUM('user', 'admin') DEFAULT 'user',  -- Phân quyền
    Status ENUM('active', 'banned') DEFAULT 'active',  -- Trạng thái tài khoản
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Novels (
    NovelID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    CoverImage VARCHAR(255), -- Link ảnh bìa
    AuthorID INT, -- ID của tác giả
    Status ENUM('ongoing', 'completed') DEFAULT 'ongoing',
    Views INT DEFAULT 0, -- Số lượt đọc
    locked BOOLEAN DEFAULT FALSE, -- Trạng thái khóa (TRUE = khóa, FALSE = không khóa)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID) ON DELETE SET NULL
);

create table NovelComments (
	CommentID INT PRIMARY KEY auto_increment,
    NovelID INT,
    UserID INT,
    Content LONGTEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE SET NULL
);

	CREATE TABLE Chapters (
		ChapterID INT PRIMARY KEY AUTO_INCREMENT,
		NovelID INT,
		ChapterNumber INT, -- Số thứ tự chương
		Title VARCHAR(255) NOT NULL,
		Content LONGTEXT NOT NULL, -- Nội dung chương
		CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
	);

CREATE TABLE ChapterComments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ChapterID INT,
    Content TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ChapterID) REFERENCES Chapters(ChapterID) ON DELETE CASCADE
);

CREATE TABLE UserLibrary (
    LibraryID INT PRIMARY KEY AUTO_INCREMENT,  -- ID thư viện
    UserID INT NOT NULL,  -- Người sở hữu tiểu thuyết
    NovelID INT NOT NULL,  -- Tiểu thuyết đã sở hữu
    PurchasedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian sở hữu
    UNIQUE (UserID, NovelID),  -- Mỗi người chỉ có thể sở hữu một bản của mỗi tiểu thuyết
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
);

CREATE TABLE UserUploadLibrary (
    LibraryID INT PRIMARY KEY AUTO_INCREMENT,  -- ID thư viện
    UserID INT NOT NULL,                       -- ID người dùng
    NovelID INT NOT NULL,                      -- ID tiểu thuyết
    UploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tải lên
    UNIQUE (UserID, NovelID),                  -- Đảm bảo mỗi người dùng chỉ có một bản của mỗi tiểu thuyết
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER after_insert_Novels
AFTER INSERT ON Novels
FOR EACH ROW
BEGIN
    -- Khi một tiểu thuyết mới được thêm, tự động thêm vào thư viện của tác giả
    INSERT INTO UserUploadLibrary (UserID, NovelID, UploadedAt)
    VALUES (NEW.AuthorID, NEW.NovelID, NOW());
END;

//
DELIMITER ;

CREATE TABLE Genres (
    GenreID INT PRIMARY KEY AUTO_INCREMENT,  -- ID thể loại
    GenreName VARCHAR(100) UNIQUE NOT NULL,  -- Tên thể loại (VD: Fantasy, Romance, Sci-fi)
    Description TEXT  -- Mô tả thể loại
);

CREATE TABLE NovelGenres (
    NovelID INT NOT NULL,  
    GenreID INT NOT NULL,  
    PRIMARY KEY (NovelID, GenreID),  -- Đảm bảo không có trùng lặp
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES Genres(GenreID) ON DELETE CASCADE
);

CREATE TABLE Bookmarks (
    BookmarkID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    NovelID INT NOT NULL,
    ChapterNumber INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE,
    UNIQUE (UserID, NovelID) -- Đảm bảo mỗi người dùng chỉ có một bookmark cho mỗi tiểu thuyết
);

CREATE TABLE SubscriptionPlans (
    PlanID INT PRIMARY KEY AUTO_INCREMENT,  -- ID gói đọc
    PlanName VARCHAR(100) NOT NULL,  -- Tên gói (VD: Gói 10 truyện, Gói 20 truyện)
    Price DECIMAL(10,2) NOT NULL,  -- Giá gói
    MaxNovels INT NOT NULL,  -- Số tiểu thuyết có thể sở hữu
    Description TEXT,  -- Mô tả gói đọc
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transactions (
  TransactionID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT,
  PlanID INT,
  PaymentMethod ENUM('momo', 'bank'),
  TransactionCode VARCHAR(100),
  ProofImage VARCHAR(255),
  Status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER after_transaction_completed
AFTER UPDATE ON Transactions
FOR EACH ROW
BEGIN
  DECLARE maxNovels INT DEFAULT 0;

  -- Chỉ thực hiện nếu trạng thái vừa cập nhật là 'completed'
  IF NEW.Status = 'completed' AND OLD.Status != 'completed' THEN
    -- Lấy số truyện từ gói đọc (nếu có)
    SELECT MaxNovels INTO maxNovels FROM SubscriptionPlans WHERE PlanID = NEW.PlanID;

    -- Chỉ chèn nếu lấy được maxNovels hợp lệ
    IF maxNovels > 0 THEN
      INSERT INTO UserSubscriptions (UserID, PlanID, RemainingNovels)
      VALUES (NEW.UserID, NEW.PlanID, maxNovels);
    END IF;
  END IF;
END$$

DELIMITER ;


CREATE TABLE UserSubscriptions (
    SubscriptionID INT PRIMARY KEY AUTO_INCREMENT,  -- ID gói của người dùng
    UserID INT NOT NULL,  -- Người sở hữu gói
    PlanID INT NOT NULL,  -- Gói đã mua
    RemainingNovels INT NOT NULL,  -- Số tiểu thuyết còn có thể sở hữu
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày mua gói
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Cập nhật khi thay đổi
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PlanID) REFERENCES SubscriptionPlans(PlanID) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER add_remaining_novels
BEFORE INSERT ON UserSubscriptions
FOR EACH ROW
BEGIN
    DECLARE old_remaining INT DEFAULT 0;

    -- Lấy số tiểu thuyết còn lại từ gói cũ (chỉ lấy gói mới nhất)
    SELECT SUM(RemainingNovels) INTO old_remaining 
    FROM UserSubscriptions 
    WHERE UserID = NEW.UserID;

    -- Nếu người dùng có gói cũ, cộng dồn số tiểu thuyết còn lại
    IF old_remaining > 0 THEN
        SET NEW.RemainingNovels = NEW.RemainingNovels + old_remaining;
    END IF;
END //
DELIMITER ;


CREATE TABLE SubscriptionUsage (
    UsageID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    PlanID INT NOT NULL,
    NovelID INT NOT NULL,
    UsedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PlanID) REFERENCES SubscriptionPlans(PlanID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
);

CREATE TABLE Favorites (
    FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    NovelID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (UserID, NovelID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
);

CREATE TABLE Ratings (
    RatingID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    NovelID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5), -- Đánh giá từ 1 đến 5 sao
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (UserID, NovelID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE CASCADE
);

CREATE TABLE Reports (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    NovelID INT NULL,
    Reason TEXT NOT NULL, -- Lý do báo cáo
    Status ENUM('pending', 'resolved') DEFAULT 'pending', -- Trạng thái xử lý
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (NovelID) REFERENCES Novels(NovelID) ON DELETE SET NULL
);

CREATE TABLE Discussions (
    DiscussionID INT PRIMARY KEY AUTO_INCREMENT,  -- ID bài thảo luận
    UserID INT NOT NULL,  -- Người tạo bài thảo luận
    Title VARCHAR(255) NOT NULL,  -- Tiêu đề bài thảo luận
    Content TEXT NOT NULL,  -- Nội dung bài thảo luận
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm tạo
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Cập nhật thời gian sửa đổi
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE  -- Liên kết với bảng Users
);

CREATE TABLE DiscussionComments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,  -- ID bình luận
    DiscussionID INT NOT NULL,  -- Bài thảo luận mà bình luận thuộc về
    UserID INT NOT NULL,  -- Người bình luận
    Content TEXT NOT NULL,  -- Nội dung bình luận
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm bình luận
    FOREIGN KEY (DiscussionID) REFERENCES Discussions(DiscussionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE DiscussionLikes (
    LikeID INT PRIMARY KEY AUTO_INCREMENT,  -- ID lượt thích
    UserID INT NOT NULL,  -- Người thích
    DiscussionID INT NOT NULL,  -- Bài thảo luận được thích
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm thích
    UNIQUE (UserID, DiscussionID),  -- Đảm bảo mỗi người chỉ thích một lần
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DiscussionID) REFERENCES Discussions(DiscussionID) ON DELETE CASCADE
);

CREATE TABLE DiscussionReports (
    ReportID INT PRIMARY KEY AUTO_INCREMENT,  -- ID báo cáo
    UserID INT NOT NULL,  -- Người báo cáo
    DiscussionID INT NOT NULL,  -- Bài thảo luận bị báo cáo
    Reason TEXT NOT NULL,  -- Lý do báo cáo
    Status ENUM('pending', 'resolved') DEFAULT 'pending',  -- Trạng thái xử lý
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm báo cáo
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DiscussionID) REFERENCES Discussions(DiscussionID) ON DELETE CASCADE
);

INSERT INTO Genres (GenreName, Description)
VALUES 
('Fantasy', 'Thế giới huyền ảo, phép thuật và sinh vật kỳ bí.'),
('Romance', 'Tình yêu và các mối quan hệ lãng mạn.'),
('Sci-fi', 'Khoa học viễn tưởng, công nghệ tương lai và không gian.'),
('Mystery', 'Bí ẩn, điều tra và những vụ án chưa có lời giải.'),
('Horror', 'Kinh dị, ma quái và yếu tố gây sợ hãi.'),
('Adventure', 'Hành trình phiêu lưu, khám phá những vùng đất mới.'),
('Historical', 'Lấy bối cảnh trong quá khứ, có yếu tố lịch sử.'),
('Comedy', 'Hài hước, mang lại tiếng cười.'),
('Action', 'Hành động, chiến đấu, truy đuổi kịch tính.'),
('Drama', 'Kịch tính, cảm xúc mạnh, tập trung vào nhân vật và mối quan hệ.');