package dev.agentesnamedida.orders;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.CsvSource;
import java.util.stream.Stream;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;

class OrderCliTest {
    record Result(int exit, String out, String err) {
        JsonNode json() { return JsonMapper.builder().build().readTree(out); }
    }

    private Result run(String... args) throws Exception {
        var command = new ArrayList<>(List.of(
                System.getProperty("java.home") + "/bin/java", "-Xmx192m", "-cp",
                System.getProperty("java.class.path"), "dev.agentesnamedida.orders.OrderApplication"));
        command.addAll(List.of(args));
        var process = new ProcessBuilder(command).start();
        if (!process.waitFor(20, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            fail("CLI exceeded 20 seconds");
        }
        return new Result(process.exitValue(),
                new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8),
                new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8));
    }

    static Stream<List<String>> invalidArguments() {
        return Stream.of(List.of(), List.of("sql", "SELECT * FROM orders"),
                List.of("list", "extra"), List.of("schema", "extra"),
                List.of("--spring.datasource.url=jdbc:h2:mem:other"),
                List.of("search"), List.of("search", "--status", "AWAITING_SHIPMENT"),
                List.of("search", "--status", "UNKNOWN", "--limit", "5"),
                List.of("search", "--status", "awaiting_shipment", "--limit", "5"),
                List.of("search", "--status", "SHIPPED' OR 1=1 --", "--limit", "5"),
                List.of("search", "--status", "SHIPPED", "--limit", "0"),
                List.of("search", "--status", "SHIPPED", "--limit", "11"),
                List.of("search", "--status", "SHIPPED", "--limit", "9999999999999"),
                List.of("search", "--status", "SHIPPED", "--limit", "1.5"),
                List.of("search", "--status", "SHIPPED", "--limit", "5", "extra"),
                List.of("search", "--limit", "5", "--status", "SHIPPED"));
    }

    @ParameterizedTest
    @MethodSource("invalidArguments")
    void invalidInputHasExitTwoEmptyStdoutAndJsonError(List<String> args) throws Exception {
        var result = run(args.toArray(String[]::new));
        assertEquals(2, result.exit());
        assertEquals("", result.out());
        assertEquals("invalid_arguments", JsonMapper.builder().build()
                .readTree(result.err()).get("error").asString());
    }

    @ParameterizedTest
    @CsvSource({"AWAITING_SHIPMENT,1,1,1004", "AWAITING_SHIPMENT,10,8,1004",
            "SHIPPED,10,2,1003", "CANCELLED,10,1,1005", "PENDING_PAYMENT,10,1,1008"})
    void searchAcceptsBoundsAndEveryDeclaredStatus(String status, int limit, int count, long firstId)
            throws Exception {
        var result = run("search", "--status", status, "--limit", Integer.toString(limit));
        assertEquals(0, result.exit(), result.err());
        assertEquals("", result.err());
        var rows = result.json();
        assertEquals(count, rows.size());
        assertEquals(firstId, rows.get(0).get("id").asLong());
        assertTrue(rows.valueStream().allMatch(row -> row.get("status").asString().equals(status)));
    }

    @Test
    void searchReturnsTopFiveAwaitingShipmentWithDescendingIdTieBreak() throws Exception {
        var result = run("search", "--status", "AWAITING_SHIPMENT", "--limit", "5");
        assertEquals(0, result.exit(), result.err());
        assertEquals("", result.err());
        var rows = result.json();
        assertEquals(List.of(1004L, 1002L, 1009L, 1007L, 1001L),
                rows.valueStream().map(row -> row.get("id").asLong()).toList());
        assertTrue(rows.valueStream().allMatch(row -> row.get("shippedOn").isNull()));
        assertTrue(rows.valueStream().allMatch(row -> row.get("status").asString().equals("AWAITING_SHIPMENT")));
    }

    @Test
    void schemaReportsOnlyOrderTableColumnsInDeclarationOrder() throws Exception {
        var result = run("schema");
        assertEquals(0, result.exit(), result.err());
        assertEquals("", result.err());
        var schema = result.json();
        assertEquals("ORDERS", schema.get(0).path("table").asString());
        assertEquals(5, schema.size());
        assertEquals(List.of("ID", "STATUS", "TOTAL", "CREATED_ON", "SHIPPED_ON"),
                schema.valueStream().map(column -> column.get("column").asString()).toList());
        assertEquals("NUMERIC", schema.get(2).get("type").asString());
        assertEquals(2, schema.get(2).get("scale").asInt());
        assertFalse(schema.get(0).get("nullable").asBoolean());
        assertTrue(schema.get(4).get("nullable").asBoolean());
    }

    @Test
    void listReturnsOnlyDeterministicSyntheticOrdersAsJson() throws Exception {
        var result = run("list");
        assertEquals(0, result.exit(), result.err());
        assertEquals("", result.err());
        var rows = result.json();
        assertEquals(12, rows.size());
        assertEquals(1001, rows.get(0).get("id").asInt());
        assertEquals("2026-01-01", rows.get(0).get("createdOn").asString());
        assertEquals("1250.00", rows.get(0).get("total").asString());
        assertEquals(1012, rows.get(11).get("id").asInt());
    }
}
