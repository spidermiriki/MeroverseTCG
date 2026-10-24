-- ============================================================
-- PHASE 2 — MeroverseTCG schema redesign
-- ============================================================
-- RÈGLE : aucun ALTER TABLE "Card" dans ce fichier.
-- TradeOffer, TradeBid, TradeConfirmation = 0 lignes en prod (vérifié).
-- Passage db push → prisma migrate deploy : _prisma_migrations créé par Prisma.

-- ============================================================
-- Step 1 : Suppression de TradeBid
-- (les FK internes sont supprimées avec la table)
-- ============================================================
DROP TABLE "TradeBid";

-- ============================================================
-- Step 2 : Altérations de User
-- ============================================================
ALTER TABLE "User" RENAME COLUMN "melocoins" TO "coins";
-- RENAME préserve l'ancien DEFAULT 100 — on le remet à 0
ALTER TABLE "User" ALTER COLUMN "coins" SET DEFAULT 0;
-- Thème par défaut change
ALTER TABLE "User" ALTER COLUMN "theme" SET DEFAULT 'black-vs-white';
-- Suppression de lastFreePack (remplacé par energyCount + lastEnergyTick)
ALTER TABLE "User" DROP COLUMN "lastFreePack";
-- Nouveaux champs
ALTER TABLE "User"
  ADD COLUMN "orbs"            INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "level"           INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "xp"              INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "avatarUrl"       TEXT,
  ADD COLUMN "onboardingDone"  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "themeCollection" TEXT,
  ADD COLUMN "energyCount"     INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN "lastEnergyTick"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ============================================================
-- Step 3 : Migrations de données
-- ============================================================
UPDATE "User" SET "theme" = 'black-vs-white' WHERE "theme" = 'dark';
-- Les comptes existants sont déjà onboardés
UPDATE "User" SET "onboardingDone" = true;

-- ============================================================
-- Step 4 : Altérations de TradeOffer (0 lignes — safe)
-- ============================================================
ALTER TABLE "TradeOffer" DROP COLUMN "type";
ALTER TABLE "TradeOffer" DROP COLUMN "minimumPrice";
ALTER TABLE "TradeOffer"
  ADD COLUMN "recipientId" TEXT NOT NULL,
  ADD COLUMN "seenAt"      TIMESTAMP(3),
  ADD COLUMN "expiresAt"   TIMESTAMP(3) NOT NULL,
  ADD COLUMN "counterOfId" TEXT;
ALTER TABLE "TradeOffer" ALTER COLUMN "status" SET DEFAULT 'EN_ATTENTE';

-- ============================================================
-- Step 5 : Index sur les tables existantes
-- ============================================================
CREATE INDEX "UserCard_userId_idx"             ON "UserCard"("userId");
CREATE INDEX "UserCard_cardId_idx"             ON "UserCard"("cardId");
CREATE INDEX "TradeOffer_offererId_idx"        ON "TradeOffer"("offererId");
CREATE INDEX "TradeOffer_recipientId_idx"      ON "TradeOffer"("recipientId");
CREATE INDEX "TradeOffer_status_idx"           ON "TradeOffer"("status");
CREATE INDEX "TradeConfirmation_tradeOfferId_idx" ON "TradeConfirmation"("tradeOfferId");

-- ============================================================
-- Step 6 : FK sur TradeOffer (nouveaux champs)
-- ============================================================
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_recipientId_fkey"
  FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_counterOfId_fkey"
  FOREIGN KEY ("counterOfId") REFERENCES "TradeOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- FavoriteCard
-- ============================================================
CREATE TABLE "FavoriteCard" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "userCardId" TEXT NOT NULL,
    "position"   INTEGER NOT NULL,
    CONSTRAINT "FavoriteCard_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FavoriteCard_userId_position_key" ON "FavoriteCard"("userId", "position");
CREATE INDEX "FavoriteCard_userId_idx" ON "FavoriteCard"("userId");

ALTER TABLE "FavoriteCard" ADD CONSTRAINT "FavoriteCard_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FavoriteCard" ADD CONSTRAINT "FavoriteCard_userCardId_fkey"
  FOREIGN KEY ("userCardId") REFERENCES "UserCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- UserBadge
-- ============================================================
CREATE TABLE "UserBadge" (
    "id"       TEXT NOT NULL,
    "userId"   TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserBadge_userId_badgeKey_key" ON "UserBadge"("userId", "badgeKey");
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- UserCosmetic
-- ============================================================
CREATE TABLE "UserCosmetic" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "cosmeticKey" TEXT NOT NULL,
    "acquiredAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserCosmetic_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserCosmetic_userId_cosmeticKey_key" ON "UserCosmetic"("userId", "cosmeticKey");
CREATE INDEX "UserCosmetic_userId_idx" ON "UserCosmetic"("userId");

ALTER TABLE "UserCosmetic" ADD CONSTRAINT "UserCosmetic_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Auction
-- ============================================================
CREATE TABLE "Auction" (
    "id"              TEXT NOT NULL,
    "sellerId"        TEXT NOT NULL,
    "cardId"          TEXT NOT NULL,
    "startPrice"      INTEGER NOT NULL,
    "currentBid"      INTEGER,
    "highestBidderId" TEXT,
    "endsAt"          TIMESTAMP(3) NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'EN_COURS',
    "claimedAt"       TIMESTAMP(3),
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Auction_sellerId_idx"        ON "Auction"("sellerId");
CREATE INDEX "Auction_cardId_idx"          ON "Auction"("cardId");
CREATE INDEX "Auction_highestBidderId_idx" ON "Auction"("highestBidderId");
CREATE INDEX "Auction_status_idx"          ON "Auction"("status");

ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_cardId_fkey"
  FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_highestBidderId_fkey"
  FOREIGN KEY ("highestBidderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- AuctionBid
-- ============================================================
CREATE TABLE "AuctionBid" (
    "id"        TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "bidderId"  TEXT NOT NULL,
    "amount"    INTEGER NOT NULL,
    "status"    TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuctionBid_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuctionBid_auctionId_idx" ON "AuctionBid"("auctionId");
CREATE INDEX "AuctionBid_bidderId_idx"  ON "AuctionBid"("bidderId");

ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_auctionId_fkey"
  FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_bidderId_fkey"
  FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Friendship
-- ============================================================
CREATE TABLE "Friendship" (
    "id"          TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status"      TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Friendship_requesterId_addresseeId_key" ON "Friendship"("requesterId", "addresseeId");
CREATE INDEX "Friendship_requesterId_idx" ON "Friendship"("requesterId");
CREATE INDEX "Friendship_addresseeId_idx" ON "Friendship"("addresseeId");

ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey"
  FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addresseeId_fkey"
  FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Group
-- ============================================================
CREATE TABLE "Group" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "imageUrl"    TEXT,
    "emblemColor" TEXT,
    "access"      TEXT NOT NULL DEFAULT 'TOUT_LE_MONDE',
    "maxMembers"  INTEGER NOT NULL DEFAULT 20,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- GroupMember
-- ============================================================
CREATE TABLE "GroupMember" (
    "id"       TEXT NOT NULL,
    "groupId"  TEXT NOT NULL,
    "userId"   TEXT NOT NULL,
    "role"     TEXT NOT NULL DEFAULT 'MEMBRE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");
CREATE INDEX "GroupMember_groupId_idx" ON "GroupMember"("groupId");
CREATE INDEX "GroupMember_userId_idx"  ON "GroupMember"("userId");

ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- GroupJoinRequest
-- ============================================================
CREATE TABLE "GroupJoinRequest" (
    "id"        TEXT NOT NULL,
    "groupId"   TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "status"    TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupJoinRequest_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GroupJoinRequest_groupId_userId_key" ON "GroupJoinRequest"("groupId", "userId");
CREATE INDEX "GroupJoinRequest_groupId_idx" ON "GroupJoinRequest"("groupId");
CREATE INDEX "GroupJoinRequest_userId_idx"  ON "GroupJoinRequest"("userId");

ALTER TABLE "GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- GroupInvite
-- ============================================================
CREATE TABLE "GroupInvite" (
    "id"        TEXT NOT NULL,
    "groupId"   TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "status"    TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupInvite_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GroupInvite_groupId_inviteeId_key" ON "GroupInvite"("groupId", "inviteeId");
CREATE INDEX "GroupInvite_groupId_idx"   ON "GroupInvite"("groupId");
CREATE INDEX "GroupInvite_inviteeId_idx" ON "GroupInvite"("inviteeId");

ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_inviterId_fkey"
  FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_inviteeId_fkey"
  FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- GroupMessage
-- ============================================================
CREATE TABLE "GroupMessage" (
    "id"        TEXT NOT NULL,
    "groupId"   TEXT NOT NULL,
    "senderId"  TEXT NOT NULL,
    "content"   TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GroupMessage_groupId_idx"  ON "GroupMessage"("groupId");
CREATE INDEX "GroupMessage_senderId_idx" ON "GroupMessage"("senderId");

ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- GroupRequest
-- ============================================================
CREATE TABLE "GroupRequest" (
    "id"           TEXT NOT NULL,
    "groupId"      TEXT NOT NULL,
    "requesterId"  TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "type"         TEXT NOT NULL,
    "targetRole"   TEXT,
    "status"       TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "decidedById"  TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GroupRequest_groupId_idx"      ON "GroupRequest"("groupId");
CREATE INDEX "GroupRequest_requesterId_idx"  ON "GroupRequest"("requesterId");
CREATE INDEX "GroupRequest_targetUserId_idx" ON "GroupRequest"("targetUserId");

ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_requesterId_fkey"
  FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_targetUserId_fkey"
  FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupRequest" ADD CONSTRAINT "GroupRequest_decidedById_fkey"
  FOREIGN KEY ("decidedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- GroupBan
-- ============================================================
CREATE TABLE "GroupBan" (
    "id"         TEXT NOT NULL,
    "groupId"    TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "bannedById" TEXT NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupBan_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GroupBan_groupId_userId_key" ON "GroupBan"("groupId", "userId");
CREATE INDEX "GroupBan_groupId_idx" ON "GroupBan"("groupId");

ALTER TABLE "GroupBan" ADD CONSTRAINT "GroupBan_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupBan" ADD CONSTRAINT "GroupBan_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GroupBan" ADD CONSTRAINT "GroupBan_bannedById_fkey"
  FOREIGN KEY ("bannedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- DirectMessage
-- ============================================================
CREATE TABLE "DirectMessage" (
    "id"         TEXT NOT NULL,
    "senderId"   TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content"    TEXT NOT NULL,
    "readAt"     TIMESTAMP(3),
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DirectMessage_senderId_idx"   ON "DirectMessage"("senderId");
CREATE INDEX "DirectMessage_receiverId_idx" ON "DirectMessage"("receiverId");

ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_receiverId_fkey"
  FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Gift
-- Séquestre : quantity décrémentée à l'envoi côté API ;
-- recréditée si le cadeau est DECLINED.
-- cardId → Card (pas UserCard) ; le cadeau ne dépend pas
-- de la ligne UserCard de l'envoyeur.
-- ============================================================
CREATE TABLE "Gift" (
    "id"         TEXT NOT NULL,
    "senderId"   TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "cardId"     TEXT NOT NULL,
    "message"    TEXT,
    "status"     TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Gift_senderId_idx"   ON "Gift"("senderId");
CREATE INDEX "Gift_receiverId_idx" ON "Gift"("receiverId");
CREATE INDEX "Gift_cardId_idx"     ON "Gift"("cardId");

ALTER TABLE "Gift" ADD CONSTRAINT "Gift_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_receiverId_fkey"
  FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_cardId_fkey"
  FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Notification
-- ============================================================
CREATE TABLE "Notification" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "type"      TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "body"      TEXT,
    "readAt"    TIMESTAMP(3),
    "data"      JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- BugReport
-- ============================================================
CREATE TABLE "BugReport" (
    "id"            TEXT NOT NULL,
    "reporterId"    TEXT NOT NULL,
    "category"      TEXT NOT NULL,
    "description"   TEXT NOT NULL,
    "screenshotUrl" TEXT,
    "deviceInfo"    JSONB,
    "status"        TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BugReport_reporterId_idx" ON "BugReport"("reporterId");
CREATE INDEX "BugReport_status_idx"     ON "BugReport"("status");

ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_reporterId_fkey"
  FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
