CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    status VARCHAR(24) NOT NULL CHECK (status IN ('AWAITING_SHIPMENT', 'SHIPPED', 'CANCELLED', 'PENDING_PAYMENT')),
    total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
    created_on DATE NOT NULL,
    shipped_on DATE
);
