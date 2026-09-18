package dev.agentesnamedida.orders;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    private final JdbcTemplate jdbc;

    public record Order(long id, String status, String total, String createdOn, String shippedOn) {}

    public record Column(String table, String column, String type, Integer precision,
                         Integer scale, boolean nullable) {}

    public List<Column> schema() {
        return jdbc.query("""
                SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, NUMERIC_PRECISION,
                       NUMERIC_SCALE, IS_NULLABLE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'PUBLIC' AND TABLE_NAME = 'ORDERS'
                ORDER BY ORDINAL_POSITION
                """, (rs, row) -> new Column(rs.getString("TABLE_NAME"), rs.getString("COLUMN_NAME"),
                rs.getString("DATA_TYPE"), rs.getObject("NUMERIC_PRECISION", Integer.class),
                rs.getObject("NUMERIC_SCALE", Integer.class), rs.getString("IS_NULLABLE").equals("YES")));
    }

    public List<Order> search(Command.Status status, int limit) {
        return jdbc.query("""
                SELECT * FROM orders WHERE status = ?
                ORDER BY total DESC, id DESC LIMIT ?
                """, (rs, row) -> new Order(rs.getLong("id"), rs.getString("status"),
                rs.getBigDecimal("total").toPlainString(), rs.getString("created_on"),
                rs.getString("shipped_on")), status.name(), limit);
    }

    public List<Order> list() {
        return jdbc.query("SELECT * FROM orders ORDER BY id", (rs, row) -> new Order(
                rs.getLong("id"), rs.getString("status"),
                rs.getBigDecimal("total").toPlainString(),
                rs.getString("created_on"), rs.getString("shipped_on")));
    }
}
