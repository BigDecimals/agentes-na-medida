package dev.agentesnamedida.orders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import tools.jackson.databind.json.JsonMapper;

@SpringBootApplication
public class OrderApplication {
    public static void main(String[] args) {
        final Command command;
        try {
            command = Command.parse(args);
        } catch (IllegalArgumentException exception) {
            System.err.println("{\"error\":\"invalid_arguments\",\"usage\":\"schema | list | search --status STATUS --limit 1..10\"}");
            System.exit(2);
            return;
        }
        try (var context = SpringApplication.run(OrderApplication.class)) {
            var repository = context.getBean(OrderRepository.class);
            var result = switch (command.action()) {
                case "schema" -> repository.schema();
                case "search" -> repository.search(command.status(), command.limit());
                default -> repository.list();
            };
            System.out.println(JsonMapper.builder().build().writeValueAsString(result));
        }
    }
}
